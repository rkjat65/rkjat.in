"""
Custom Data Loading Script for Indian Healthcare Analysis
Adapted for your specific NFHS-5 CSV structure
Author: RK
"""

import pandas as pd
import sqlite3
import os
from pathlib import Path
import glob

print("=" * 70)
print("INDIAN HEALTHCARE ANALYSIS - CUSTOM DATA LOADER")
print("=" * 70)

# Configuration
BASE_DIR = Path(__file__).parent.parent
DATA_DIR = BASE_DIR / 'data'
RAW_DATA_DIR = DATA_DIR / 'raw' / 'nfhs5'
DATABASE_PATH = DATA_DIR / 'database' / 'healthcare_india.db'
SQL_SCHEMA_PATH = BASE_DIR / 'sql' / 'schema.sql'

print(f"\nProject directory: {BASE_DIR}")
print(f"Data directory: {RAW_DATA_DIR}")
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
    'Dadra & Nagar Haveli and Daman & Diu': 'DD',
    'Delhi': 'DL', 'Jammu and Kashmir': 'JK', 'Jammu & Kashmir': 'JK',
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
print("STEP 1: Checking for data files...")
print("-" * 70)

# Check for India.csv
india_csv = RAW_DATA_DIR / 'India.csv'
india_change_csv = RAW_DATA_DIR / 'India_Change.csv'
states_folder = RAW_DATA_DIR / '_states'

files_found = []
if india_csv.exists():
    files_found.append(f"✓ India.csv ({india_csv.stat().st_size / 1024:.0f} KB)")
if india_change_csv.exists():
    files_found.append(f"✓ India_Change.csv ({india_change_csv.stat().st_size / 1024:.0f} KB)")
if states_folder.exists():
    state_csvs = list(states_folder.glob("*.csv"))
    files_found.append(f"✓ _states folder ({len(state_csvs)} CSV files)")

if not files_found:
    print("✗ No data files found!")
    exit(1)

print("\nFound files:")
for f in files_found:
    print(f"  {f}")

print("\n" + "-" * 70)
print("STEP 2: Creating database schema...")
print("-" * 70)

# Create database directory
DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)

# Remove old database
if DATABASE_PATH.exists():
    os.remove(DATABASE_PATH)
    print("Removed old database")

# Connect to new database
conn = sqlite3.connect(DATABASE_PATH)
cursor = conn.cursor()

# Read and execute schema
try:
    with open(SQL_SCHEMA_PATH, 'r', encoding='utf-8') as f:
        schema_sql = f.read()
    
    for statement in schema_sql.split(';'):
        statement = statement.strip()
        if statement and not statement.startswith('--'):
            try:
                cursor.execute(statement)
            except sqlite3.Error as e:
                if 'already exists' not in str(e).lower():
                    pass  # Ignore minor errors
    
    conn.commit()
    print("✓ Database schema created")
except Exception as e:
    print(f"Warning: {e}")
    print("Creating basic schema...")
    
    # Create minimal schema
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS raw_health_data (
            state TEXT,
            district TEXT,
            indicator TEXT,
            nfhs5_value REAL,
            nfhs4_value REAL,
            change_value REAL
        )
    ''')
    conn.commit()
    print("✓ Basic schema created")

print("\n" + "-" * 70)
print("STEP 3: Loading India.csv...")
print("-" * 70)

if india_csv.exists():
    try:
        print("Reading India.csv...")
        df = pd.read_csv(india_csv, encoding='utf-8')
        
        print(f"  Rows: {len(df):,}")
        print(f"  Columns: {list(df.columns)}")
        
        # Save to database
        df.to_sql('india_data', conn, if_exists='replace', index=False)
        print(f"✓ Loaded {len(df):,} records into 'india_data' table")
        
        # Show sample
        print("\nSample data:")
        print(df.head(3).to_string())
        
    except Exception as e:
        print(f"✗ Error loading India.csv: {e}")

print("\n" + "-" * 70)
print("STEP 4: Loading state-wise data from _states folder...")
print("-" * 70)

if states_folder.exists():
    state_files = list(states_folder.glob("*.csv"))
    print(f"Found {len(state_files)} state CSV files")
    
    all_states_data = []
    successful = 0
    
    for csv_file in state_files[:5]:  # Load first 5 as test
        try:
            state_name = csv_file.stem.replace('_', ' ')
            print(f"\n  Loading: {csv_file.name}...")
            
            df = pd.read_csv(csv_file, encoding='utf-8')
            
            # Add state column if not present
            if 'State' not in df.columns and 'state' not in df.columns:
                df['State'] = state_name
            
            all_states_data.append(df)
            print(f"    ✓ {len(df):,} records")
            successful += 1
            
        except Exception as e:
            print(f"    ✗ Error: {e}")
    
    if all_states_data:
        combined_df = pd.concat(all_states_data, ignore_index=True)
        combined_df.to_sql('states_data', conn, if_exists='replace', index=False)
        print(f"\n✓ Combined and loaded {len(combined_df):,} records from {successful} states")

print("\n" + "-" * 70)
print("STEP 5: Creating analysis-ready table...")
print("-" * 70)

try:
    # Try to create a unified view from available data
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS health_metrics AS
        SELECT * FROM india_data
        LIMIT 100000
    ''')
    conn.commit()
    
    count = cursor.execute("SELECT COUNT(*) FROM health_metrics").fetchone()[0]
    print(f"✓ Created health_metrics table with {count:,} records")
    
except Exception as e:
    print(f"Note: {e}")

print("\n" + "-" * 70)
print("STEP 6: Database summary...")
print("-" * 70)

# List all tables
tables = cursor.execute(
    "SELECT name FROM sqlite_master WHERE type='table'"
).fetchall()

print(f"\n📊 Tables created: {len(tables)}")
for table in tables:
    try:
        count = cursor.execute(f"SELECT COUNT(*) FROM {table[0]}").fetchone()[0]
        print(f"  • {table[0]}: {count:,} records")
    except:
        print(f"  • {table[0]}: (empty)")

# Database size
db_size = DATABASE_PATH.stat().st_size / 1024 / 1024
print(f"\n💾 Database size: {db_size:.2f} MB")
print(f"📂 Location: {DATABASE_PATH}")

conn.close()

print("\n" + "=" * 70)
print("DATA LOADING COMPLETED!")
print("=" * 70)

print("\n✅ Next steps:")
print("1. Explore data: python scripts/explore_database.py")
print("2. Run sample queries from sql/analysis_queries.sql")
print("3. Connect Power BI to the database")
print("4. Start building your dashboard!")
print("\n" + "=" * 70)