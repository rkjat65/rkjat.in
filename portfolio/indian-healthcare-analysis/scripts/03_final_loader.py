"""
FINAL Data Loader - Handles all edge cases
Loads India.csv + ALL state files
Author: RK
"""

import pandas as pd
import sqlite3
import os
from pathlib import Path

print("=" * 70)
print("INDIAN HEALTHCARE ANALYSIS - FINAL DATA LOADER")
print("=" * 70)

# Configuration
BASE_DIR = Path(__file__).parent.parent
DATA_DIR = BASE_DIR / 'data'
RAW_DATA_DIR = DATA_DIR / 'raw' / 'nfhs5'
DATABASE_PATH = DATA_DIR / 'database' / 'healthcare_india.db'

print(f"\nProject: {BASE_DIR}")
print(f"Database: {DATABASE_PATH}")

# State code mapping
STATE_CODES = {
    'Andhra Pradesh': 'AP', 'Arunachal Pradesh': 'AR', 'Assam': 'AS',
    'Bihar': 'BR', 'Chhattisgarh': 'CG', 'Goa': 'GA', 'Gujarat': 'GJ',
    'Haryana': 'HR', 'Himachal Pradesh': 'HP', 'Jharkhand': 'JH',
    'Karnataka': 'KA', 'Kerala': 'KL', 'Madhya Pradesh': 'MP',
    'Maharashtra': 'MH', 'Manipur': 'MN', 'Meghalaya': 'ML',
    'Mizoram': 'MZ', 'Nagaland': 'NL', 'Odisha': 'OR', 'Punjab': 'PB',
    'Rajasthan': 'RJ', 'Sikkim': 'SK', 'Tamil Nadu': 'TN',
    'Telangana': 'TG', 'Tripura': 'TR', 'Uttar Pradesh': 'UP',
    'Uttarakhand': 'UK', 'West Bengal': 'WB',
    'Andaman and Nicobar Islands': 'AN', 'Chandigarh': 'CH',
    'Dadra and Nagar Haveli and Daman and Diu': 'DD', 
    'Delhi': 'DL', 'Jammu and Kashmir': 'JK', 
    'Ladakh': 'LA', 'Lakshadweep': 'LD', 'Puducherry': 'PY'
}

STATE_REGIONS = {
    'AP': 'South', 'AR': 'Northeast', 'AS': 'Northeast', 'BR': 'East',
    'CG': 'Central', 'GA': 'West', 'GJ': 'West', 'HR': 'North',
    'HP': 'North', 'JH': 'East', 'KA': 'South', 'KL': 'South',
    'MP': 'Central', 'MH': 'West', 'MN': 'Northeast', 'ML': 'Northeast',
    'MZ': 'Northeast', 'NL': 'Northeast', 'OR': 'East', 'PB': 'North',
    'RJ': 'North', 'SK': 'Northeast', 'TN': 'South', 'TG': 'South',
    'TR': 'Northeast', 'UP': 'North', 'UK': 'North', 'WB': 'East',
    'AN': 'South', 'CH': 'North', 'DD': 'West', 'DL': 'North',
    'JK': 'North', 'LA': 'North', 'LD': 'South', 'PY': 'South'
}

print("\n" + "-" * 70)
print("STEP 1: Database setup")
print("-" * 70)

# Remove old database
if DATABASE_PATH.exists():
    os.remove(DATABASE_PATH)
    print("✓ Removed old database")

# Create new database
DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)
conn = sqlite3.connect(DATABASE_PATH)
cursor = conn.cursor()

# Create tables with clean schema
print("Creating tables...")

cursor.execute('''
    CREATE TABLE dim_states (
        state_code TEXT PRIMARY KEY,
        state_name TEXT NOT NULL,
        region TEXT,
        census_code TEXT
    )
''')

cursor.execute('''
    CREATE TABLE dim_districts (
        district_code TEXT PRIMARY KEY,
        district_name TEXT NOT NULL,
        state_code TEXT NOT NULL,
        census_code TEXT,
        FOREIGN KEY (state_code) REFERENCES dim_states(state_code)
    )
''')

cursor.execute('''
    CREATE TABLE dim_indicators (
        indicator_id INTEGER PRIMARY KEY AUTOINCREMENT,
        indicator_name TEXT NOT NULL,
        category TEXT
    )
''')

cursor.execute('''
    CREATE TABLE fact_health_metrics (
        metric_id INTEGER PRIMARY KEY AUTOINCREMENT,
        state_name TEXT,
        district_name TEXT,
        indicator TEXT,
        nfhs5_value REAL,
        nfhs4_value REAL,
        change_value REAL,
        category TEXT
    )
''')

conn.commit()
print("✓ Tables created")

print("\n" + "-" * 70)
print("STEP 2: Loading India.csv (with duplicate column fix)")
print("-" * 70)

india_csv = RAW_DATA_DIR / 'India.csv'
if india_csv.exists():
    try:
        # Read with specific column handling to avoid duplicates
        print("Reading India.csv...")
        df = pd.read_csv(india_csv, encoding='utf-8', low_memory=False)
        
        # Fix duplicate columns
        cols = df.columns.tolist()
        if 'DISTRICT' in cols and 'District' in cols:
            # Drop the uppercase duplicate
            df = df.drop(columns=['DISTRICT'])
            print("  Fixed duplicate column issue")
        
        print(f"  Rows: {len(df):,}")
        print(f"  Columns: {list(df.columns)}")
        
        # Standardize column names
        column_mapping = {
            'NFHS 5': 'nfhs5_value',
            'NFHS 4': 'nfhs4_value',
            'State': 'state_name',
            'District': 'district_name',
            'Indicator': 'indicator',
            'Category': 'category'
        }
        
        for old, new in column_mapping.items():
            if old in df.columns:
                df = df.rename(columns={old: new})
        
        # Calculate change if both values exist
        if 'nfhs5_value' in df.columns and 'nfhs4_value' in df.columns:
            df['nfhs5_value'] = pd.to_numeric(df['nfhs5_value'], errors='coerce')
            df['nfhs4_value'] = pd.to_numeric(df['nfhs4_value'], errors='coerce')
            df['change_value'] = df['nfhs5_value'] - df['nfhs4_value']
        
        # Select relevant columns
        cols_to_keep = ['state_name', 'district_name', 'indicator', 
                        'nfhs5_value', 'nfhs4_value', 'change_value', 'category']
        df = df[[col for col in cols_to_keep if col in df.columns]]
        
        # Save to database
        df.to_sql('fact_health_metrics', conn, if_exists='append', index=False)
        print(f"✓ Loaded {len(df):,} records from India.csv")
        
        # Show sample
        print("\nSample data:")
        print(df.head(3).to_string(max_colwidth=40))
        
    except Exception as e:
        print(f"✗ Error: {e}")
        import traceback
        traceback.print_exc()

print("\n" + "-" * 70)
print("STEP 3: Loading ALL state files from _states folder")
print("-" * 70)

states_folder = RAW_DATA_DIR / '_states'
if states_folder.exists():
    state_files = sorted(states_folder.glob("*.csv"))
    print(f"Found {len(state_files)} state CSV files")
    print("Loading all states...")
    
    successful = 0
    total_records = 0
    
    for csv_file in state_files:  # Load ALL states
        try:
            state_code = csv_file.stem.upper()
            
            df = pd.read_csv(csv_file, encoding='utf-8', low_memory=False)
            
            # Fix duplicate columns if present
            if 'DISTRICT' in df.columns and 'District' in df.columns:
                df = df.drop(columns=['DISTRICT'])
            
            # Standardize columns
            column_mapping = {
                'NFHS 5': 'nfhs5_value',
                'NFHS 4': 'nfhs4_value',
                'State': 'state_name',
                'District': 'district_name',
                'Indicator': 'indicator',
                'Category': 'category'
            }
            
            for old, new in column_mapping.items():
                if old in df.columns:
                    df = df.rename(columns={old: new})
            
            # Add state code if missing
            if 'state_name' not in df.columns:
                df['state_name'] = state_code
            
            # Calculate change
            if 'nfhs5_value' in df.columns and 'nfhs4_value' in df.columns:
                df['nfhs5_value'] = pd.to_numeric(df['nfhs5_value'], errors='coerce')
                df['nfhs4_value'] = pd.to_numeric(df['nfhs4_value'], errors='coerce')
                df['change_value'] = df['nfhs5_value'] - df['nfhs4_value']
            
            # Select relevant columns
            cols_to_keep = ['state_name', 'district_name', 'indicator', 
                            'nfhs5_value', 'nfhs4_value', 'change_value', 'category']
            df = df[[col for col in cols_to_keep if col in df.columns]]
            
            # Append to database
            df.to_sql('fact_health_metrics', conn, if_exists='append', index=False)
            
            total_records += len(df)
            successful += 1
            
            if successful % 10 == 0:  # Progress update every 10 states
                print(f"  ✓ Loaded {successful} states... ({total_records:,} records so far)")
            
        except Exception as e:
            print(f"  ✗ {csv_file.name}: {e}")
    
    print(f"\n✓ Successfully loaded {successful}/{len(state_files)} states")
    print(f"✓ Total records from states: {total_records:,}")

print("\n" + "-" * 70)
print("STEP 4: Populating dimension tables")
print("-" * 70)

# Populate states
try:
    unique_states = pd.read_sql(
        "SELECT DISTINCT state_name FROM fact_health_metrics WHERE state_name IS NOT NULL",
        conn
    )
    
    for state in unique_states['state_name']:
        state_code = STATE_CODES.get(state, state[:2].upper())
        region = STATE_REGIONS.get(state_code, 'Other')
        
        cursor.execute('''
            INSERT OR IGNORE INTO dim_states (state_code, state_name, region)
            VALUES (?, ?, ?)
        ''', (state_code, state, region))
    
    conn.commit()
    print(f"✓ Populated dim_states with {len(unique_states)} states")
except Exception as e:
    print(f"Note: {e}")

# Populate districts
try:
    unique_districts = pd.read_sql('''
        SELECT DISTINCT state_name, district_name 
        FROM fact_health_metrics 
        WHERE district_name IS NOT NULL AND district_name != ''
    ''', conn)
    
    for _, row in unique_districts.iterrows():
        state = row['state_name']
        district = row['district_name']
        state_code = STATE_CODES.get(state, state[:2].upper())
        district_code = f"{state_code}_{district.replace(' ', '_')[:20]}"
        
        cursor.execute('''
            INSERT OR IGNORE INTO dim_districts (district_code, district_name, state_code)
            VALUES (?, ?, ?)
        ''', (district_code, district, state_code))
    
    conn.commit()
    print(f"✓ Populated dim_districts with {len(unique_districts)} districts")
except Exception as e:
    print(f"Note: {e}")

# Populate indicators
try:
    unique_indicators = pd.read_sql(
        "SELECT DISTINCT indicator, category FROM fact_health_metrics WHERE indicator IS NOT NULL",
        conn
    )
    
    for _, row in unique_indicators.iterrows():
        cursor.execute('''
            INSERT OR IGNORE INTO dim_indicators (indicator_name, category)
            VALUES (?, ?)
        ''', (row['indicator'], row.get('category')))
    
    conn.commit()
    print(f"✓ Populated dim_indicators with {len(unique_indicators)} indicators")
except Exception as e:
    print(f"Note: {e}")

print("\n" + "-" * 70)
print("STEP 5: Creating analysis views")
print("-" * 70)

# Create main analysis view
cursor.execute('''
    CREATE VIEW IF NOT EXISTS vw_health_analysis AS
    SELECT 
        f.state_name,
        f.district_name,
        f.indicator,
        f.category,
        f.nfhs5_value,
        f.nfhs4_value,
        f.change_value,
        CASE 
            WHEN f.change_value > 0 THEN 'Improved'
            WHEN f.change_value < 0 THEN 'Declined'
            ELSE 'No Change'
        END as trend,
        s.region
    FROM fact_health_metrics f
    LEFT JOIN dim_states s ON f.state_name = s.state_name
''')

conn.commit()
print("✓ Created vw_health_analysis view")

print("\n" + "-" * 70)
print("FINAL SUMMARY")
print("-" * 70)

# Get final stats
tables_info = [
    ('dim_states', 'States/UTs'),
    ('dim_districts', 'Districts'),
    ('dim_indicators', 'Health Indicators'),
    ('fact_health_metrics', 'Total Data Points')
]

print("\n📊 Database Contents:")
for table, label in tables_info:
    try:
        count = cursor.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0]
        print(f"  • {label}: {count:,}")
    except:
        print(f"  • {label}: 0")

db_size = DATABASE_PATH.stat().st_size / 1024 / 1024
print(f"\n💾 Database size: {db_size:.2f} MB")
print(f"📂 Location: {DATABASE_PATH}")

conn.close()

print("\n" + "=" * 70)
print("✅ DATA LOADING COMPLETE!")
print("=" * 70)

print("\n🎯 Your data is ready for analysis!")
print("\nQuick test query:")
print("""
import sqlite3
import pandas as pd

conn = sqlite3.connect('data/database/healthcare_india.db')
result = pd.read_sql("SELECT * FROM vw_health_analysis LIMIT 10", conn)
print(result)
""")

print("\n📊 Next steps:")
print("1. Explore: python scripts/explore_database.py")
print("2. Query: Use SQL queries from sql/analysis_queries.sql")
print("3. Visualize: Open Power BI and connect to the database")
print("4. Build your dashboard!")

print("\n" + "=" * 70)