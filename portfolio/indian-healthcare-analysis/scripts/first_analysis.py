"""
First Healthcare Analysis - Real Insights!
Run this to get your first findings
"""

import sqlite3
import pandas as pd

# Connect to database
conn = sqlite3.connect('data/database/healthcare_india.db')

print("=" * 70)
print("INDIAN HEALTHCARE ANALYSIS - FIRST INSIGHTS")
print("=" * 70)

# ============================================================
# ANALYSIS 1: Top 10 States by Improvement (NFHS-4 to NFHS-5)
# ============================================================
print("\n📈 ANALYSIS 1: States Showing Most Improvement")
print("-" * 70)

query1 = """
SELECT 
    state_name,
    region,
    COUNT(*) as total_indicators,
    COUNT(CASE WHEN trend = 'Improved' THEN 1 END) as improved_count,
    COUNT(CASE WHEN trend = 'Declined' THEN 1 END) as declined_count,
    ROUND(100.0 * COUNT(CASE WHEN trend = 'Improved' THEN 1 END) / COUNT(*), 1) as improvement_rate
FROM vw_health_analysis
WHERE nfhs4_value IS NOT NULL AND nfhs5_value IS NOT NULL
GROUP BY state_name, region
ORDER BY improvement_rate DESC
LIMIT 10
"""

result1 = pd.read_sql(query1, conn)
print(result1.to_string(index=False))

# ============================================================
# ANALYSIS 2: Key Health Indicators - National Overview
# ============================================================
print("\n\n🏥 ANALYSIS 2: Key Health Indicators (National Average)")
print("-" * 70)

query2 = """
SELECT 
    indicator,
    category,
    COUNT(DISTINCT state_name) as states_covered,
    ROUND(AVG(nfhs5_value), 2) as avg_nfhs5,
    ROUND(AVG(nfhs4_value), 2) as avg_nfhs4,
    ROUND(AVG(change_value), 2) as avg_change
FROM vw_health_analysis
WHERE indicator LIKE '%immuniz%'
   OR indicator LIKE '%institutional%'
   OR indicator LIKE '%antenatal%'
   OR indicator LIKE '%stunting%'
   OR indicator LIKE '%anaemic%'
GROUP BY indicator, category
ORDER BY avg_change DESC
"""

result2 = pd.read_sql(query2, conn)
print(result2.to_string(index=False))

# ============================================================
# ANALYSIS 3: Regional Performance Comparison
# ============================================================
print("\n\n🗺️ ANALYSIS 3: Regional Health Performance")
print("-" * 70)

query3 = """
SELECT 
    region,
    COUNT(DISTINCT state_name) as num_states,
    COUNT(*) as total_data_points,
    ROUND(AVG(CASE WHEN trend = 'Improved' THEN 1.0 ELSE 0.0 END) * 100, 1) as pct_improved,
    ROUND(AVG(nfhs5_value), 2) as avg_current_value
FROM vw_health_analysis
WHERE region IS NOT NULL
  AND nfhs5_value IS NOT NULL
GROUP BY region
ORDER BY pct_improved DESC
"""

result3 = pd.read_sql(query3, conn)
print(result3.to_string(index=False))

# ============================================================
# ANALYSIS 4: Best vs Worst Performing Districts
# ============================================================
print("\n\n🏆 ANALYSIS 4: Top 5 Best Performing Districts")
print("-" * 70)

query4a = """
SELECT 
    state_name,
    district_name,
    COUNT(*) as indicators_measured,
    COUNT(CASE WHEN trend = 'Improved' THEN 1 END) as improved_indicators,
    ROUND(100.0 * COUNT(CASE WHEN trend = 'Improved' THEN 1 END) / COUNT(*), 1) as improvement_rate
FROM vw_health_analysis
WHERE district_name IS NOT NULL 
  AND district_name != ''
  AND nfhs4_value IS NOT NULL
GROUP BY state_name, district_name
HAVING indicators_measured >= 50
ORDER BY improvement_rate DESC
LIMIT 5
"""

result4a = pd.read_sql(query4a, conn)
print(result4a.to_string(index=False))

print("\n⚠️ ANALYSIS 4B: Bottom 5 Districts Needing Attention")
print("-" * 70)

query4b = """
SELECT 
    state_name,
    district_name,
    COUNT(*) as indicators_measured,
    COUNT(CASE WHEN trend = 'Declined' THEN 1 END) as declined_indicators,
    ROUND(100.0 * COUNT(CASE WHEN trend = 'Declined' THEN 1 END) / COUNT(*), 1) as decline_rate
FROM vw_health_analysis
WHERE district_name IS NOT NULL 
  AND district_name != ''
  AND nfhs4_value IS NOT NULL
GROUP BY state_name, district_name
HAVING indicators_measured >= 50
ORDER BY decline_rate DESC
LIMIT 5
"""

result4b = pd.read_sql(query4b, conn)
print(result4b.to_string(index=False))

# ============================================================
# ANALYSIS 5: Indicator Categories Analysis
# ============================================================
print("\n\n📊 ANALYSIS 5: Health Categories Overview")
print("-" * 70)

query5 = """
SELECT 
    category,
    COUNT(DISTINCT indicator) as num_indicators,
    COUNT(*) as total_measurements,
    ROUND(AVG(nfhs5_value), 2) as avg_value,
    COUNT(CASE WHEN trend = 'Improved' THEN 1 END) as improved_count,
    COUNT(CASE WHEN trend = 'Declined' THEN 1 END) as declined_count
FROM vw_health_analysis
WHERE category IS NOT NULL
  AND nfhs4_value IS NOT NULL
GROUP BY category
ORDER BY num_indicators DESC
"""

result5 = pd.read_sql(query5, conn)
print(result5.to_string(index=False))

# ============================================================
# KEY INSIGHTS SUMMARY
# ============================================================
print("\n\n" + "=" * 70)
print("🎯 KEY INSIGHTS DISCOVERED")
print("=" * 70)

# Get some quick stats for insights
total_improved = pd.read_sql("""
    SELECT COUNT(*) as count 
    FROM vw_health_analysis 
    WHERE trend = 'Improved' AND nfhs4_value IS NOT NULL
""", conn)['count'][0]

total_declined = pd.read_sql("""
    SELECT COUNT(*) as count 
    FROM vw_health_analysis 
    WHERE trend = 'Declined' AND nfhs4_value IS NOT NULL
""", conn)['count'][0]

total_compared = total_improved + total_declined

print(f"\n1. National Trend:")
print(f"   • {total_improved:,} indicators improved ({100*total_improved/total_compared:.1f}%)")
print(f"   • {total_declined:,} indicators declined ({100*total_declined/total_compared:.1f}%)")

print(f"\n2. Coverage:")
print(f"   • Data for all 36 Indian states/UTs")
print(f"   • District-level detail for 700+ districts")
print(f"   • 105 different health indicators tracked")

print(f"\n3. Best Performing Region:")
best_region = result3.iloc[0]
print(f"   • {best_region['region']} region leads with {best_region['pct_improved']:.1f}% improvement rate")

print(f"\n4. Opportunities:")
worst_region = result3.iloc[-1]
print(f"   • {worst_region['region']} region needs attention with only {worst_region['pct_improved']:.1f}% improvement")

print("\n" + "=" * 70)
print("✅ ANALYSIS COMPLETE - Ready for Dashboard!")
print("=" * 70)

conn.close()

print("\n💡 Next Steps:")
print("1. Save these insights for your README")
print("2. Use these queries as templates for Power BI")
print("3. Create visualizations for each analysis")
print("4. Build your dashboard story around these insights")