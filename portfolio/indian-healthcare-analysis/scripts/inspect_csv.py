"""
CSV Inspector - Understand your NFHS-5 data structure
Run this BEFORE loading to see what's in your files
"""

import pandas as pd
from pathlib import Path

print("=" * 70)
print("NFHS-5 DATA INSPECTOR")
print("=" * 70)

RAW_DATA_DIR = Path('data/raw/nfhs5')

# Check India.csv
india_csv = RAW_DATA_DIR / 'India.csv'
print("\n" + "-" * 70)
print("📄 INDIA.CSV")
print("-" * 70)

if india_csv.exists():
    df = pd.read_csv(india_csv)
    print(f"✓ File exists: {india_csv.stat().st_size / 1024:.0f} KB")
    print(f"✓ Rows: {len(df):,}")
    print(f"✓ Columns: {len(df.columns)}")
    print(f"\nColumn names:")
    for i, col in enumerate(df.columns, 1):
        print(f"  {i}. {col}")
    
    print(f"\nFirst 5 rows:")
    print(df.head().to_string())
    
    print(f"\nData types:")
    print(df.dtypes)
    
    # Check for key columns
    key_cols = ['State', 'District', 'Indicator', 'NFHS-5', 'NFHS-4']
    present = [col for col in key_cols if col in df.columns]
    print(f"\nKey columns found: {present}")
    
else:
    print("✗ India.csv not found")

# Check India_Change.csv
print("\n" + "-" * 70)
print("📄 INDIA_CHANGE.CSV")
print("-" * 70)

india_change = RAW_DATA_DIR / 'India_Change.csv'
if india_change.exists():
    df = pd.read_csv(india_change)
    print(f"✓ File exists: {india_change.stat().st_size / 1024:.0f} KB")
    print(f"✓ Rows: {len(df):,}")
    print(f"✓ Columns: {list(df.columns)}")
    print(f"\nFirst 3 rows:")
    print(df.head(3).to_string())
else:
    print("✗ India_Change.csv not found")

# Check _states folder
print("\n" + "-" * 70)
print("📁 _STATES FOLDER")
print("-" * 70)

states_folder = RAW_DATA_DIR / '_states'
if states_folder.exists():
    csv_files = list(states_folder.glob("*.csv"))
    print(f"✓ Found {len(csv_files)} state CSV files")
    
    if csv_files:
        print(f"\nFirst 10 files:")
        for f in csv_files[:10]:
            print(f"  • {f.name}")
        
        # Inspect first state file
        print(f"\n📊 Sample from first file: {csv_files[0].name}")
        df = pd.read_csv(csv_files[0])
        print(f"  Rows: {len(df):,}")
        print(f"  Columns: {list(df.columns)}")
        print(f"\nFirst 3 rows:")
        print(df.head(3).to_string())
else:
    print("✗ _states folder not found")

print("\n" + "=" * 70)
print("INSPECTION COMPLETE")
print("=" * 70)
print("\n💡 Recommended next steps:")
print("1. Review the column structure above")
print("2. Run the custom data loader: python scripts/02_load_data_custom.py")
print("3. The loader will adapt to your CSV structure automatically")