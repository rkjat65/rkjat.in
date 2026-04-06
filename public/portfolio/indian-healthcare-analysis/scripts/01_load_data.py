"""
Data Loading Script for Indian Healthcare Analysis
Author: RK
Description: Loads NFHS-5 CSV data into SQLite database
"""

import pandas as pd
import sqlite3
import os
from pathlib import Path
from datetime import datetime
import glob

# Configuration
BASE_DIR = Path(__file__).parent.parent
DATA_DIR = BASE_DIR / 'data'
RAW_DATA_DIR = DATA_DIR / 'raw' / 'nfhs5'
DATABASE_PATH = DATA_DIR / 'database' / 'healthcare_india.db'
SQL_SCHEMA_PATH = BASE_DIR / 'sql' / 'schema.sql'

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
    'Dadra and Nagar Haveli and Daman and Diu': 'DD', 'Delhi': 'DL',
    'Jammu and Kashmir': 'JK', 'Ladakh': 'LA', 'Lakshadweep': 'LD',
    'Puducherry': 'PY'
}

# Region mapping
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


def create_database_schema():
    """Create database and tables from schema.sql"""
    print("Creating database schema...")
    
    # Create database directory if it doesn't exist
    DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)
    
    # Connect to database
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    # Read and execute schema SQL
    with open(SQL_SCHEMA_PATH, 'r') as f:
        schema_sql = f.read()
        # Split by semicolon and execute each statement
        for statement in schema_sql.split(';'):
            if statement.strip():
                try:
                    cursor.execute(statement)
                except sqlite3.Error as e:
                    print(f"Warning: {e}")
    
    conn.commit()
    conn.close()
    print("✓ Database schema created successfully!")


def load_state_wise_data(csv_file='State_wise/State.csv'):
    """Load state-wise aggregated data"""
    print(f"\nLoading state-wise data from {csv_file}...")
    
    file_path = RAW_DATA_DIR / csv_file
    
    if not file_path.exists():
        print(f"✗ File not found: {file_path}")
        return
    
    # Read CSV
    df = pd.read_csv(file_path)
    
    print(f"  Loaded {len(df)} records")
    print(f"  Columns: {list(df.columns)}")
    
    # Display first few rows
    print("\nSample data:")
    print(df.head())
    
    return df


def load_district_data(pattern='State_wise/*.csv'):
    """Load all district-level CSV files"""
    print(f"\nLoading district data from {pattern}...")
    
    csv_files = glob.glob(str(RAW_DATA_DIR / pattern))
    
    if not csv_files:
        print(f"✗ No CSV files found in {RAW_DATA_DIR / pattern}")
        return None
    
    print(f"  Found {len(csv_files)} CSV files")
    
    all_districts = []
    
    for csv_file in csv_files:
        try:
            df = pd.read_csv(csv_file)
            all_districts.append(df)
            print(f"  ✓ Loaded {Path(csv_file).name}: {len(df)} records")
        except Exception as e:
            print(f"  ✗ Error loading {Path(csv_file).name}: {e}")
    
    if all_districts:
        combined_df = pd.concat(all_districts, ignore_index=True)
        print(f"\n✓ Total records loaded: {len(combined_df)}")
        return combined_df
    
    return None


def process_and_insert_data(df, conn):
    """Process dataframe and insert into database tables"""
    print("\nProcessing data for database insertion...")
    
    cursor = conn.cursor()
    
    # Extract unique states
    if 'State' in df.columns:
        states = df['State'].unique()
        print(f"  Found {len(states)} unique states/UTs")
        
        # Insert states
        for state in states:
            state_code = STATE_CODES.get(state)
            region = STATE_REGIONS.get(state_code)
            
            if state_code:
                try:
                    cursor.execute('''
                        INSERT OR IGNORE INTO dim_states (state_code, state_name, region)
                        VALUES (?, ?, ?)
                    ''', (state_code, state, region))
                except sqlite3.Error as e:
                    print(f"  Error inserting state {state}: {e}")
        
        conn.commit()
        print(f"  ✓ Inserted {len(states)} states")
    
    # Extract unique districts
    if 'District' in df.columns and 'State' in df.columns:
        districts = df[['State', 'District']].drop_duplicates()
        print(f"  Found {len(districts)} unique districts")
        
        # Insert districts
        for _, row in districts.iterrows():
            state_code = STATE_CODES.get(row['State'])
            
            if state_code:
                # Generate district code (you may want to use actual census codes)
                district_code = f"{state_code}_{row['District'].replace(' ', '_')}"
                
                try:
                    cursor.execute('''
                        INSERT OR IGNORE INTO dim_districts (district_code, district_name, state_code)
                        VALUES (?, ?, ?)
                    ''', (district_code, row['District'], state_code))
                except sqlite3.Error as e:
                    print(f"  Error inserting district {row['District']}: {e}")
        
        conn.commit()
        print(f"  ✓ Inserted {len(districts)} districts")
    
    # Process indicators
    # This will depend on the exact structure of your CSV files
    # You'll need to adapt this based on the actual column names
    
    print("✓ Data processing completed!")


def main():
    """Main execution function"""
    print("=" * 60)
    print("INDIAN HEALTHCARE ANALYSIS - DATA LOADER")
    print("=" * 60)
    
    # Step 1: Create database schema
    create_database_schema()
    
    # Step 2: Check if raw data exists
    if not RAW_DATA_DIR.exists():
        print(f"\n✗ Raw data directory not found: {RAW_DATA_DIR}")
        print("\nPlease:")
        print("1. Download NFHS-5 data from GitHub")
        print("2. Place CSV files in: data/raw/nfhs5/")
        print("3. Run this script again")
        return
    
    # Step 3: Load state-wise data
    state_df = load_state_wise_data()
    
    # Step 4: Load district data
    district_df = load_district_data()
    
    # Step 5: Process and insert data
    if state_df is not None or district_df is not None:
        conn = sqlite3.connect(DATABASE_PATH)
        
        if state_df is not None:
            process_and_insert_data(state_df, conn)
        
        if district_df is not None:
            process_and_insert_data(district_df, conn)
        
        conn.close()
    
    print("\n" + "=" * 60)
    print("DATA LOADING COMPLETED!")
    print(f"Database location: {DATABASE_PATH}")
    print("=" * 60)


if __name__ == "__main__":
    main()
