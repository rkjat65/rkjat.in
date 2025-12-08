import sqlite3
import pandas as pd

conn = sqlite3.connect('data/database/healthcare_india.db')

# 1. Check tables
print("📊 AVAILABLE TABLES:")
tables = pd.read_sql("SELECT name FROM sqlite_master WHERE type='table'", conn)
print(tables)

# 2. Sample your data
print("\n🔍 SAMPLE DATA:")
sample = pd.read_sql("SELECT * FROM vw_health_analysis LIMIT 10", conn)
print(sample)

# 3. Top indicators
print("\n📈 TOP HEALTH INDICATORS:")
indicators = pd.read_sql("""
    SELECT indicator, COUNT(*) as count 
    FROM vw_health_analysis 
    GROUP BY indicator 
    ORDER BY count DESC 
    LIMIT 10
""", conn)
print(indicators)

# 4. States covered
print("\n🗺️ STATES COVERED:")
states = pd.read_sql("""
    SELECT state_name, region, COUNT(*) as data_points
    FROM vw_health_analysis
    GROUP BY state_name, region
    ORDER BY data_points DESC
""", conn)
print(states)

conn.close()