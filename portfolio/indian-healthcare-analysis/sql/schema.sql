-- =====================================================
-- Indian Healthcare Analysis Database Schema
-- Database: SQLite
-- Author: RK
-- Date: December 2024
-- =====================================================

-- Drop existing tables if they exist
DROP TABLE IF EXISTS fact_health_metrics;
DROP TABLE IF EXISTS dim_indicators;
DROP TABLE IF EXISTS dim_districts;
DROP TABLE IF EXISTS dim_states;

-- =====================================================
-- DIMENSION TABLES
-- =====================================================

-- States/UTs Dimension Table
CREATE TABLE dim_states (
    state_code TEXT PRIMARY KEY,
    state_name TEXT NOT NULL UNIQUE,
    region TEXT CHECK(region IN ('North', 'South', 'East', 'West', 'Northeast', 'Central')),
    population_2011 INTEGER,
    area_sqkm REAL,
    literacy_rate REAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Districts Dimension Table
CREATE TABLE dim_districts (
    district_code TEXT PRIMARY KEY,
    district_name TEXT NOT NULL,
    state_code TEXT NOT NULL,
    population_2011 INTEGER,
    area_sqkm REAL,
    urban_population_pct REAL,
    sex_ratio INTEGER,  -- Females per 1000 males
    literacy_rate REAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (state_code) REFERENCES dim_states(state_code),
    UNIQUE(district_name, state_code)  -- Prevent duplicate districts within same state
);

-- Create index on state_code for faster joins
CREATE INDEX idx_districts_state ON dim_districts(state_code);

-- Health Indicators Dimension Table
CREATE TABLE dim_indicators (
    indicator_id INTEGER PRIMARY KEY,
    indicator_name TEXT NOT NULL UNIQUE,
    indicator_category TEXT CHECK(indicator_category IN (
        'Maternal Health',
        'Child Health',
        'Nutrition',
        'Family Planning',
        'Healthcare Access',
        'Disease Prevalence',
        'Immunization',
        'Sanitation & Hygiene',
        'Demographics'
    )),
    indicator_subcategory TEXT,
    indicator_unit TEXT CHECK(indicator_unit IN ('%', 'per 1000', 'ratio', 'years', 'number', 'km')),
    target_value REAL,  -- WHO or India's target value
    direction TEXT CHECK(direction IN ('higher_better', 'lower_better', 'neutral')),
    description TEXT,
    data_source TEXT DEFAULT 'NFHS-5',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on category for filtering
CREATE INDEX idx_indicators_category ON dim_indicators(indicator_category);

-- =====================================================
-- FACT TABLE
-- =====================================================

-- Health Metrics Fact Table (Main data table)
CREATE TABLE fact_health_metrics (
    metric_id INTEGER PRIMARY KEY AUTOINCREMENT,
    district_code TEXT NOT NULL,
    indicator_id INTEGER NOT NULL,
    nfhs5_value REAL,
    nfhs4_value REAL,
    change_value REAL,  -- Difference between NFHS-5 and NFHS-4
    change_pct REAL,    -- Percentage change
    survey_year TEXT DEFAULT '2019-21',
    data_quality_flag TEXT CHECK(data_quality_flag IN ('Good', 'Fair', 'Small Sample', 'Unreliable')),
    sample_size INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (district_code) REFERENCES dim_districts(district_code),
    FOREIGN KEY (indicator_id) REFERENCES dim_indicators(indicator_id),
    UNIQUE(district_code, indicator_id, survey_year)  -- Prevent duplicate entries
);

-- Create composite index for common queries
CREATE INDEX idx_metrics_district_indicator ON fact_health_metrics(district_code, indicator_id);
CREATE INDEX idx_metrics_indicator ON fact_health_metrics(indicator_id);
CREATE INDEX idx_metrics_quality ON fact_health_metrics(data_quality_flag);

-- =====================================================
-- VIEWS FOR ANALYSIS
-- =====================================================

-- View 1: Complete District Health Profile
CREATE VIEW vw_district_health_profile AS
SELECT 
    s.state_name,
    s.region,
    d.district_name,
    d.population_2011 as district_population,
    i.indicator_category,
    i.indicator_subcategory,
    i.indicator_name,
    i.indicator_unit,
    f.nfhs5_value,
    f.nfhs4_value,
    f.change_value,
    f.change_pct,
    i.target_value,
    i.direction,
    CASE 
        WHEN i.direction = 'higher_better' AND f.nfhs5_value >= i.target_value THEN 'Target Met'
        WHEN i.direction = 'lower_better' AND f.nfhs5_value <= i.target_value THEN 'Target Met'
        WHEN i.direction = 'higher_better' AND f.nfhs5_value >= i.target_value * 0.8 THEN 'Near Target'
        WHEN i.direction = 'lower_better' AND f.nfhs5_value <= i.target_value * 1.2 THEN 'Near Target'
        ELSE 'Below Target'
    END as target_status,
    f.data_quality_flag
FROM fact_health_metrics f
JOIN dim_districts d ON f.district_code = d.district_code
JOIN dim_states s ON d.state_code = s.state_code
JOIN dim_indicators i ON f.indicator_id = i.indicator_id
WHERE f.nfhs5_value IS NOT NULL;

-- View 2: State-wise Aggregated Metrics
CREATE VIEW vw_state_aggregates AS
SELECT 
    s.state_code,
    s.state_name,
    s.region,
    i.indicator_category,
    i.indicator_name,
    i.indicator_unit,
    AVG(f.nfhs5_value) as avg_value,
    MIN(f.nfhs5_value) as min_value,
    MAX(f.nfhs5_value) as max_value,
    STDDEV(f.nfhs5_value) as std_deviation,
    COUNT(DISTINCT d.district_code) as num_districts,
    COUNT(CASE WHEN f.data_quality_flag = 'Good' THEN 1 END) as good_quality_count
FROM fact_health_metrics f
JOIN dim_districts d ON f.district_code = d.district_code
JOIN dim_states s ON d.state_code = s.state_code
JOIN dim_indicators i ON f.indicator_id = i.indicator_id
WHERE f.nfhs5_value IS NOT NULL
GROUP BY s.state_code, s.state_name, s.region, i.indicator_category, i.indicator_name, i.indicator_unit;

-- View 3: District Rankings by Indicator
CREATE VIEW vw_district_rankings AS
SELECT 
    s.state_name,
    d.district_name,
    i.indicator_name,
    f.nfhs5_value,
    RANK() OVER (
        PARTITION BY i.indicator_id 
        ORDER BY 
            CASE 
                WHEN i.direction = 'higher_better' THEN f.nfhs5_value
            END DESC,
            CASE 
                WHEN i.direction = 'lower_better' THEN f.nfhs5_value
            END ASC
    ) as national_rank,
    RANK() OVER (
        PARTITION BY s.state_code, i.indicator_id 
        ORDER BY 
            CASE 
                WHEN i.direction = 'higher_better' THEN f.nfhs5_value
            END DESC,
            CASE 
                WHEN i.direction = 'lower_better' THEN f.nfhs5_value
            END ASC
    ) as state_rank,
    NTILE(10) OVER (
        PARTITION BY i.indicator_id 
        ORDER BY 
            CASE 
                WHEN i.direction = 'higher_better' THEN f.nfhs5_value
            END DESC,
            CASE 
                WHEN i.direction = 'lower_better' THEN f.nfhs5_value
            END ASC
    ) as decile
FROM fact_health_metrics f
JOIN dim_districts d ON f.district_code = d.district_code
JOIN dim_states s ON d.state_code = s.state_code
JOIN dim_indicators i ON f.indicator_id = i.indicator_id
WHERE f.nfhs5_value IS NOT NULL;

-- View 4: Improvement Analysis (NFHS-4 vs NFHS-5)
CREATE VIEW vw_improvement_analysis AS
SELECT 
    s.state_name,
    s.region,
    d.district_name,
    i.indicator_category,
    i.indicator_name,
    f.nfhs4_value,
    f.nfhs5_value,
    f.change_value,
    f.change_pct,
    CASE 
        WHEN f.change_pct > 20 THEN 'Significant Improvement'
        WHEN f.change_pct > 10 THEN 'Moderate Improvement'
        WHEN f.change_pct > 0 THEN 'Slight Improvement'
        WHEN f.change_pct = 0 THEN 'No Change'
        WHEN f.change_pct > -10 THEN 'Slight Decline'
        WHEN f.change_pct > -20 THEN 'Moderate Decline'
        ELSE 'Significant Decline'
    END as trend_category
FROM fact_health_metrics f
JOIN dim_districts d ON f.district_code = d.district_code
JOIN dim_states s ON d.state_code = s.state_code
JOIN dim_indicators i ON f.indicator_id = i.indicator_id
WHERE f.nfhs4_value IS NOT NULL AND f.nfhs5_value IS NOT NULL;

-- View 5: Key Maternal-Child Health Indicators Dashboard
CREATE VIEW vw_maternal_child_dashboard AS
SELECT 
    s.state_name,
    d.district_name,
    MAX(CASE WHEN i.indicator_name LIKE '%institutional birth%' THEN f.nfhs5_value END) as institutional_births_pct,
    MAX(CASE WHEN i.indicator_name LIKE '%4 antenatal%' THEN f.nfhs5_value END) as anc_4plus_pct,
    MAX(CASE WHEN i.indicator_name LIKE '%fully immunized%' THEN f.nfhs5_value END) as full_immunization_pct,
    MAX(CASE WHEN i.indicator_name LIKE '%Stunting%' THEN f.nfhs5_value END) as stunting_pct,
    MAX(CASE WHEN i.indicator_name LIKE '%Infant mortality%' THEN f.nfhs5_value END) as imr,
    MAX(CASE WHEN i.indicator_name LIKE '%anaemic%' AND i.indicator_name LIKE '%children%' THEN f.nfhs5_value END) as child_anemia_pct
FROM fact_health_metrics f
JOIN dim_districts d ON f.district_code = d.district_code
JOIN dim_states s ON d.state_code = s.state_code
JOIN dim_indicators i ON f.indicator_id = i.indicator_id
WHERE i.indicator_category IN ('Maternal Health', 'Child Health', 'Nutrition', 'Immunization')
GROUP BY s.state_name, d.district_name;

-- =====================================================
-- TRIGGERS FOR DATA INTEGRITY
-- =====================================================

-- Trigger to calculate change_value and change_pct automatically
CREATE TRIGGER trg_calculate_change
AFTER INSERT ON fact_health_metrics
WHEN NEW.nfhs4_value IS NOT NULL AND NEW.nfhs5_value IS NOT NULL
BEGIN
    UPDATE fact_health_metrics
    SET 
        change_value = NEW.nfhs5_value - NEW.nfhs4_value,
        change_pct = ROUND(((NEW.nfhs5_value - NEW.nfhs4_value) * 100.0 / NEW.nfhs4_value), 2)
    WHERE metric_id = NEW.metric_id;
END;

-- =====================================================
-- SAMPLE DATA QUALITY CHECKS
-- =====================================================

-- Check for missing critical values
CREATE VIEW vw_data_quality_check AS
SELECT 
    'Missing NFHS-5 values' as check_type,
    COUNT(*) as issue_count
FROM fact_health_metrics
WHERE nfhs5_value IS NULL
UNION ALL
SELECT 
    'Duplicate entries' as check_type,
    COUNT(*) - COUNT(DISTINCT district_code || '-' || indicator_id) as issue_count
FROM fact_health_metrics
UNION ALL
SELECT 
    'Out of range percentages' as check_type,
    COUNT(*) as issue_count
FROM fact_health_metrics f
JOIN dim_indicators i ON f.indicator_id = i.indicator_id
WHERE i.indicator_unit = '%' AND (f.nfhs5_value < 0 OR f.nfhs5_value > 100);

-- =====================================================
-- DOCUMENTATION & METADATA
-- =====================================================

-- Create metadata table for tracking data loads
CREATE TABLE etl_metadata (
    load_id INTEGER PRIMARY KEY AUTOINCREMENT,
    load_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    source_file TEXT,
    records_loaded INTEGER,
    load_status TEXT CHECK(load_status IN ('Success', 'Failed', 'Partial')),
    error_message TEXT
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Additional indexes for common query patterns
CREATE INDEX idx_metrics_value ON fact_health_metrics(nfhs5_value) 
    WHERE nfhs5_value IS NOT NULL;

CREATE INDEX idx_districts_state_name ON dim_districts(state_code, district_name);

-- =====================================================
-- COMMENTS (SQLite doesn't support COMMENT ON, but kept for documentation)
-- =====================================================

/*
TABLE DESCRIPTIONS:
- dim_states: Master list of Indian states and union territories
- dim_districts: Master list of districts mapped to states
- dim_indicators: Catalog of all health indicators with metadata
- fact_health_metrics: Main fact table with district-indicator values
- vw_district_health_profile: Comprehensive view for district-level analysis
- vw_state_aggregates: State-level aggregated metrics
- vw_district_rankings: Rankings and performance tiers
- vw_improvement_analysis: Trend analysis between NFHS-4 and NFHS-5
- vw_maternal_child_dashboard: Key indicators for dashboard
*/
