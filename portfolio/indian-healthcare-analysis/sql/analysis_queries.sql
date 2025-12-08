-- =====================================================
-- SAMPLE ANALYSIS QUERIES
-- Indian Healthcare System Performance Analysis
-- =====================================================

-- =====================================================
-- 1. TOP PERFORMING DISTRICTS
-- =====================================================

-- Q1.1: Top 10 districts by immunization coverage
SELECT 
    state_name,
    district_name,
    nfhs5_value as immunization_coverage_pct,
    nfhs4_value as prev_coverage,
    change_value as improvement,
    national_rank
FROM vw_district_rankings
WHERE indicator_name LIKE '%fully immunized%'
    AND national_rank <= 10
ORDER BY national_rank;

-- Q1.2: Bottom 10 districts needing urgent attention (immunization)
SELECT 
    state_name,
    district_name,
    nfhs5_value as immunization_coverage_pct,
    target_value,
    (target_value - nfhs5_value) as gap_to_target
FROM vw_district_health_profile
WHERE indicator_name LIKE '%fully immunized%'
ORDER BY nfhs5_value ASC
LIMIT 10;

-- =====================================================
-- 2. STATE-WISE COMPARISONS
-- =====================================================

-- Q2.1: State-wise maternal health scorecard
SELECT 
    state_name,
    ROUND(AVG(CASE WHEN indicator_name LIKE '%institutional birth%' THEN avg_value END), 2) as inst_delivery_pct,
    ROUND(AVG(CASE WHEN indicator_name LIKE '%4 antenatal%' THEN avg_value END), 2) as anc_4plus_pct,
    ROUND(AVG(CASE WHEN indicator_name LIKE '%C-section%' THEN avg_value END), 2) as csection_pct,
    num_districts
FROM vw_state_aggregates
WHERE indicator_category = 'Maternal Health'
GROUP BY state_name, num_districts
ORDER BY inst_delivery_pct DESC;

-- Q2.2: State rankings by multiple health indicators
WITH state_scores AS (
    SELECT 
        state_name,
        AVG(CASE WHEN indicator_category = 'Maternal Health' AND target_status = 'Target Met' THEN 100
                 WHEN indicator_category = 'Maternal Health' AND target_status = 'Near Target' THEN 75
                 ELSE 50 END) as maternal_score,
        AVG(CASE WHEN indicator_category = 'Child Health' AND target_status = 'Target Met' THEN 100
                 WHEN indicator_category = 'Child Health' AND target_status = 'Near Target' THEN 75
                 ELSE 50 END) as child_score,
        AVG(CASE WHEN indicator_category = 'Nutrition' AND target_status = 'Target Met' THEN 100
                 WHEN indicator_category = 'Nutrition' AND target_status = 'Near Target' THEN 75
                 ELSE 50 END) as nutrition_score
    FROM vw_district_health_profile
    GROUP BY state_name
)
SELECT 
    state_name,
    ROUND(maternal_score, 1) as maternal_health_score,
    ROUND(child_score, 1) as child_health_score,
    ROUND(nutrition_score, 1) as nutrition_score,
    ROUND((maternal_score + child_score + nutrition_score) / 3, 1) as overall_health_score,
    RANK() OVER (ORDER BY (maternal_score + child_score + nutrition_score) / 3 DESC) as national_rank
FROM state_scores
ORDER BY overall_health_score DESC;

-- =====================================================
-- 3. TREND ANALYSIS (NFHS-4 vs NFHS-5)
-- =====================================================

-- Q3.1: States with maximum improvement in immunization
SELECT 
    state_name,
    ROUND(AVG(nfhs4_value), 2) as nfhs4_avg,
    ROUND(AVG(nfhs5_value), 2) as nfhs5_avg,
    ROUND(AVG(change_value), 2) as avg_improvement,
    COUNT(DISTINCT district_name) as num_districts
FROM vw_improvement_analysis
WHERE indicator_name LIKE '%fully immunized%'
GROUP BY state_name
HAVING COUNT(DISTINCT district_name) >= 5  -- States with at least 5 districts
ORDER BY avg_improvement DESC
LIMIT 10;

-- Q3.2: Indicators showing national decline
SELECT 
    indicator_category,
    indicator_name,
    COUNT(*) as num_districts_declined,
    ROUND(AVG(change_value), 2) as avg_decline,
    MIN(change_value) as worst_decline
FROM vw_improvement_analysis
WHERE change_value < 0
GROUP BY indicator_category, indicator_name
HAVING COUNT(*) > 50  -- At least 50 districts showing decline
ORDER BY avg_decline ASC;

-- =====================================================
-- 4. GEOGRAPHIC PATTERNS
-- =====================================================

-- Q4.1: Regional comparison of child nutrition
SELECT 
    region,
    COUNT(DISTINCT state_code) as num_states,
    COUNT(DISTINCT district_code) as num_districts,
    ROUND(AVG(CASE WHEN indicator_name LIKE '%Stunting%' THEN nfhs5_value END), 2) as avg_stunting,
    ROUND(AVG(CASE WHEN indicator_name LIKE '%Wasting%' THEN nfhs5_value END), 2) as avg_wasting,
    ROUND(AVG(CASE WHEN indicator_name LIKE '%Underweight%' THEN nfhs5_value END), 2) as avg_underweight
FROM vw_district_health_profile
WHERE indicator_category = 'Nutrition'
GROUP BY region
ORDER BY avg_stunting DESC;

-- Q4.2: Urban-rural disparities (if data available)
-- This query would need additional urban/rural classification data

-- =====================================================
-- 5. CORRELATION ANALYSIS
-- =====================================================

-- Q5.1: Districts with high anemia but low nutritional interventions
SELECT 
    d.state_name,
    d.district_name,
    MAX(CASE WHEN indicator_name LIKE '%anaemic%children%' THEN nfhs5_value END) as child_anemia_pct,
    MAX(CASE WHEN indicator_name LIKE '%adequate diet%' THEN nfhs5_value END) as adequate_diet_pct,
    (MAX(CASE WHEN indicator_name LIKE '%anaemic%children%' THEN nfhs5_value END) - 
     MAX(CASE WHEN indicator_name LIKE '%adequate diet%' THEN nfhs5_value END)) as nutrition_gap
FROM vw_district_health_profile d
WHERE indicator_category = 'Nutrition'
GROUP BY d.state_name, d.district_name
HAVING child_anemia_pct IS NOT NULL AND adequate_diet_pct IS NOT NULL
ORDER BY nutrition_gap DESC
LIMIT 20;

-- Q5.2: Relationship between maternal care and infant mortality
SELECT 
    state_name,
    district_name,
    MAX(CASE WHEN indicator_name LIKE '%institutional birth%' THEN nfhs5_value END) as inst_delivery,
    MAX(CASE WHEN indicator_name LIKE '%Infant mortality%' THEN nfhs5_value END) as imr,
    MAX(CASE WHEN indicator_name LIKE '%4 antenatal%' THEN nfhs5_value END) as anc_coverage
FROM vw_district_health_profile
WHERE indicator_category IN ('Maternal Health', 'Child Health')
GROUP BY state_name, district_name
HAVING inst_delivery IS NOT NULL AND imr IS NOT NULL
ORDER BY imr DESC;

-- =====================================================
-- 6. PERFORMANCE TIERS & CLUSTERS
-- =====================================================

-- Q6.1: Categorize districts into performance tiers
WITH district_scores AS (
    SELECT 
        state_name,
        district_name,
        AVG(CASE 
            WHEN target_status = 'Target Met' THEN 3
            WHEN target_status = 'Near Target' THEN 2
            ELSE 1
        END) as performance_score,
        COUNT(*) as indicators_measured
    FROM vw_district_health_profile
    WHERE nfhs5_value IS NOT NULL
    GROUP BY state_name, district_name
    HAVING indicators_measured >= 30  -- Minimum 30 indicators for reliable scoring
)
SELECT 
    state_name,
    district_name,
    ROUND(performance_score, 2) as score,
    indicators_measured,
    CASE 
        WHEN performance_score >= 2.5 THEN 'High Performer'
        WHEN performance_score >= 2.0 THEN 'Good Performer'
        WHEN performance_score >= 1.5 THEN 'Average Performer'
        ELSE 'Needs Improvement'
    END as performance_tier,
    NTILE(4) OVER (ORDER BY performance_score) as quartile
FROM district_scores
ORDER BY performance_score DESC;

-- Q6.2: Identify "champion" districts that improved significantly
SELECT 
    state_name,
    district_name,
    COUNT(CASE WHEN trend_category IN ('Significant Improvement', 'Moderate Improvement') THEN 1 END) as improved_indicators,
    COUNT(CASE WHEN trend_category IN ('Significant Decline', 'Moderate Decline') THEN 1 END) as declined_indicators,
    COUNT(*) as total_indicators,
    ROUND(100.0 * COUNT(CASE WHEN trend_category LIKE '%Improvement%' THEN 1 END) / COUNT(*), 1) as improvement_rate
FROM vw_improvement_analysis
GROUP BY state_name, district_name
HAVING total_indicators >= 50  -- Minimum data availability
ORDER BY improvement_rate DESC, improved_indicators DESC
LIMIT 20;

-- =====================================================
-- 7. DATA QUALITY & COVERAGE ANALYSIS
-- =====================================================

-- Q7.1: Check data completeness by state
SELECT 
    s.state_name,
    COUNT(DISTINCT d.district_code) as districts_in_state,
    COUNT(DISTINCT f.indicator_id) as indicators_measured,
    COUNT(*) as total_data_points,
    COUNT(f.nfhs5_value) as non_null_values,
    ROUND(100.0 * COUNT(f.nfhs5_value) / COUNT(*), 1) as completeness_pct,
    COUNT(CASE WHEN f.data_quality_flag = 'Small Sample' THEN 1 END) as small_sample_count
FROM dim_states s
LEFT JOIN dim_districts d ON s.state_code = d.state_code
LEFT JOIN fact_health_metrics f ON d.district_code = f.district_code
GROUP BY s.state_name
ORDER BY completeness_pct DESC;

-- Q7.2: Indicators with most missing data
SELECT 
    i.indicator_category,
    i.indicator_name,
    COUNT(DISTINCT f.district_code) as districts_with_data,
    707 - COUNT(DISTINCT f.district_code) as districts_missing_data,
    ROUND(100.0 * COUNT(DISTINCT f.district_code) / 707, 1) as coverage_pct
FROM dim_indicators i
LEFT JOIN fact_health_metrics f ON i.indicator_id = f.indicator_id
GROUP BY i.indicator_category, i.indicator_name
HAVING coverage_pct < 80  -- Less than 80% coverage
ORDER BY coverage_pct ASC;

-- =====================================================
-- 8. DASHBOARD READY QUERIES
-- =====================================================

-- Q8.1: Executive summary - National KPIs
SELECT 
    'National Average' as geography,
    ROUND(AVG(CASE WHEN indicator_name LIKE '%institutional birth%' THEN nfhs5_value END), 1) as inst_delivery_pct,
    ROUND(AVG(CASE WHEN indicator_name LIKE '%fully immunized%' THEN nfhs5_value END), 1) as immunization_pct,
    ROUND(AVG(CASE WHEN indicator_name LIKE '%Stunting%' THEN nfhs5_value END), 1) as stunting_pct,
    ROUND(AVG(CASE WHEN indicator_name LIKE '%anaemic%children%' THEN nfhs5_value END), 1) as child_anemia_pct,
    ROUND(AVG(CASE WHEN indicator_name LIKE '%Infant mortality%' THEN nfhs5_value END), 1) as imr
FROM vw_district_health_profile;

-- Q8.2: State comparison for Power BI slicer
SELECT DISTINCT
    state_name,
    region,
    COUNT(DISTINCT district_name) OVER (PARTITION BY state_name) as num_districts
FROM vw_district_health_profile
ORDER BY state_name;

-- =====================================================
-- 9. CUSTOM METRICS & CALCULATIONS
-- =====================================================

-- Q9.1: Calculate healthcare access index
WITH access_metrics AS (
    SELECT 
        state_name,
        district_name,
        MAX(CASE WHEN indicator_name LIKE '%Health insurance%' THEN nfhs5_value END) as insurance_coverage,
        MAX(CASE WHEN indicator_name LIKE '%institutional birth%' THEN nfhs5_value END) as facility_usage,
        MAX(CASE WHEN indicator_name LIKE '%distance%health%' THEN 100 - nfhs5_value * 10 END) as accessibility_score
    FROM vw_district_health_profile
    WHERE indicator_category = 'Healthcare Access'
    GROUP BY state_name, district_name
)
SELECT 
    state_name,
    district_name,
    insurance_coverage,
    facility_usage,
    accessibility_score,
    ROUND((COALESCE(insurance_coverage, 0) + 
           COALESCE(facility_usage, 0) + 
           COALESCE(accessibility_score, 0)) / 3, 1) as healthcare_access_index
FROM access_metrics
ORDER BY healthcare_access_index DESC;

-- Q9.2: Identify districts with unusual patterns (outliers)
WITH state_benchmarks AS (
    SELECT 
        state_code,
        indicator_id,
        AVG(nfhs5_value) as state_avg,
        STDDEV(nfhs5_value) as state_std
    FROM fact_health_metrics f
    JOIN dim_districts d ON f.district_code = d.district_code
    WHERE nfhs5_value IS NOT NULL
    GROUP BY state_code, indicator_id
)
SELECT 
    d.state_name,
    d.district_name,
    i.indicator_name,
    f.nfhs5_value as district_value,
    ROUND(b.state_avg, 2) as state_average,
    ROUND((f.nfhs5_value - b.state_avg) / NULLIF(b.state_std, 0), 2) as z_score,
    CASE 
        WHEN ABS((f.nfhs5_value - b.state_avg) / NULLIF(b.state_std, 0)) > 2 THEN 'Outlier'
        WHEN ABS((f.nfhs5_value - b.state_avg) / NULLIF(b.state_std, 0)) > 1 THEN 'Notable'
        ELSE 'Normal'
    END as deviation_category
FROM fact_health_metrics f
JOIN dim_districts d ON f.district_code = d.district_code
JOIN dim_indicators i ON f.indicator_id = i.indicator_id
JOIN state_benchmarks b ON d.state_code = b.state_code AND f.indicator_id = b.indicator_id
WHERE ABS((f.nfhs5_value - b.state_avg) / NULLIF(b.state_std, 0)) > 2  -- Only outliers
ORDER BY ABS((f.nfhs5_value - b.state_avg) / NULLIF(b.state_std, 0)) DESC;

-- =====================================================
-- NOTES FOR POWER BI INTEGRATION
-- =====================================================

/*
For Power BI Dashboard:

1. Use vw_district_health_profile as main data source
2. Create relationships:
   - dim_states -> dim_districts (state_code)
   - dim_districts -> fact_health_metrics (district_code)
   - dim_indicators -> fact_health_metrics (indicator_id)

3. Key measures to create in Power BI:
   - National Average = AVERAGE(fact_health_metrics[nfhs5_value])
   - Target Achievement = COUNTROWS(FILTER(vw_district_health_profile, [target_status] = "Target Met"))
   - Improvement Count = COUNTROWS(FILTER(vw_improvement_analysis, [change_value] > 0))

4. Recommended visualizations:
   - Filled Map (Bharat Maps) for state/district performance
   - Line chart for trend analysis
   - Table with conditional formatting for rankings
   - KPI cards for key metrics
   - Drill-through pages for detailed district analysis
*/
