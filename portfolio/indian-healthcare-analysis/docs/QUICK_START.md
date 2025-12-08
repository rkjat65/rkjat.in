# 🚀 Quick Start Guide - Indian Healthcare Analysis Project

## 📋 Prerequisites Checklist

Before starting, ensure you have:
- [ ] Python 3.8 or higher installed
- [ ] Power BI Desktop installed
- [ ] Git installed (for version control)
- [ ] Text editor or IDE (VS Code recommended)

---

## ⚡ Step-by-Step Setup

### **STEP 1: Download the Data** (5 minutes)

#### Option A: GitHub (Recommended)
1. Go to: https://github.com/SaiSiddhardhaKalla/NFHS
2. Click the green **"Code"** button
3. Click **"Download ZIP"**
4. Extract the ZIP file

#### Option B: Harvard Dataverse
1. Go to: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/42WNZF
2. Click **"Access Dataset"** → **"Original Format ZIP"**
3. Download and extract

#### What You Should Have:
```
Downloaded folder/
├── State_wise/
│   ├── State.csv                 # Aggregated state data
│   ├── Andhra_Pradesh.csv        # District data for AP
│   ├── Bihar.csv                 # District data for Bihar
│   └── ... (all state CSVs)
├── NFHS_Change/                  # NFHS-4 to NFHS-5 comparison
└── README.md
```

---

### **STEP 2: Organize Your Data** (2 minutes)

1. Navigate to your project folder:
   ```bash
   cd indian-healthcare-analysis
   ```

2. Copy the downloaded CSV files to `data/raw/nfhs5/`:
   ```bash
   # On Windows
   xcopy /E /I "C:\Downloads\NFHS-master\*" "data\raw\nfhs5\"
   
   # On Mac/Linux
   cp -r ~/Downloads/NFHS-master/* data/raw/nfhs5/
   ```

3. Verify the files are in place:
   ```bash
   ls data/raw/nfhs5/
   ```

---

### **STEP 3: Set Up Python Environment** (3 minutes)

1. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

2. Activate the virtual environment:
   ```bash
   # On Windows
   venv\Scripts\activate
   
   # On Mac/Linux
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

---

### **STEP 4: Create the Database** (5 minutes)

1. Run the database creation script:
   ```bash
   cd scripts
   python 01_load_data.py
   ```

2. **Expected Output:**
   ```
   ============================================================
   INDIAN HEALTHCARE ANALYSIS - DATA LOADER
   ============================================================
   Creating database schema...
   ✓ Database schema created successfully!
   
   Loading state-wise data...
   ✓ Loaded 36 states/UTs
   
   Loading district data...
   ✓ Total records loaded: 92,400+ records
   
   Processing data for database insertion...
   ✓ Inserted 36 states
   ✓ Inserted 707 districts
   ✓ Data processing completed!
   
   ============================================================
   DATA LOADING COMPLETED!
   Database location: data/database/healthcare_india.db
   ============================================================
   ```

3. Verify database creation:
   ```bash
   ls -lh ../data/database/
   ```
   You should see `healthcare_india.db` (approximately 15-25 MB)

---

### **STEP 5: Explore the Data** (10 minutes)

#### Using Python:

```python
import sqlite3
import pandas as pd

# Connect to database
conn = sqlite3.connect('data/database/healthcare_india.db')

# Test query: Top 10 states by immunization
query = """
SELECT 
    state_name,
    COUNT(DISTINCT district_name) as num_districts,
    ROUND(AVG(nfhs5_value), 2) as avg_immunization
FROM vw_district_health_profile
WHERE indicator_name LIKE '%fully immunized%'
GROUP BY state_name
ORDER BY avg_immunization DESC
LIMIT 10;
"""

df = pd.read_sql_query(query, conn)
print(df)

conn.close()
```

#### Using SQLite Command Line:

```bash
sqlite3 data/database/healthcare_india.db

sqlite> .tables
sqlite> SELECT COUNT(*) FROM fact_health_metrics;
sqlite> .quit
```

---

### **STEP 6: Run Sample Analyses** (15 minutes)

1. Open the sample queries file:
   ```bash
   code sql/analysis_queries.sql
   ```

2. Try these starter queries:

#### Query 1: National Overview
```sql
SELECT 
    indicator_category,
    COUNT(DISTINCT indicator_id) as num_indicators,
    COUNT(*) as total_measurements
FROM vw_district_health_profile
GROUP BY indicator_category
ORDER BY num_indicators DESC;
```

#### Query 2: Your State's Performance
```sql
-- Replace 'Maharashtra' with your state name
SELECT 
    district_name,
    indicator_name,
    nfhs5_value,
    target_status
FROM vw_district_health_profile
WHERE state_name = 'Maharashtra'
    AND indicator_category = 'Maternal Health'
ORDER BY district_name, indicator_name;
```

#### Query 3: Best Performing Districts
```sql
SELECT * FROM vw_district_rankings
WHERE indicator_name LIKE '%immunization%'
AND national_rank <= 10;
```

---

### **STEP 7: Connect Power BI** (10 minutes)

1. **Open Power BI Desktop**

2. **Get Data**:
   - Click **"Get Data"** → **"More"**
   - Search for **"SQLite"**
   - Browse to: `data/database/healthcare_india.db`

3. **Select Tables/Views**:
   - ✅ `vw_district_health_profile` (primary view)
   - ✅ `vw_state_aggregates`
   - ✅ `vw_district_rankings`
   - ✅ `vw_maternal_child_dashboard`
   - ✅ `dim_states`
   - ✅ `dim_districts`
   - Click **"Load"**

4. **Verify Relationships**:
   - Go to **Model** view
   - Check that relationships are created automatically
   - Adjust if needed:
     - `dim_states[state_code]` ➜ `dim_districts[state_code]`

5. **Create Your First Visual**:
   - Add a **Filled Map** visualization
   - Location: `state_name`
   - Values: Average of `nfhs5_value`
   - Filter: `indicator_name` = "Institutional births (%)"

---

### **STEP 8: Build Your Dashboard** (30-60 minutes)

#### Recommended Page Layout:

**Page 1: National Overview**
- KPI Cards: National averages for key indicators
- Map: State-wise performance (color gradient)
- Bar Chart: Top 10 and Bottom 10 states
- Line Chart: Trend comparison NFHS-4 vs NFHS-5

**Page 2: State Deep Dive**
- Slicer: State selector
- Map: District-level performance within selected state
- Table: All districts with key indicators
- Gauge Charts: Progress towards targets

**Page 3: Maternal & Child Health**
- Multi-row cards: Key maternal health indicators
- Clustered Column Chart: State comparison
- Scatter Plot: Institutional delivery vs Infant mortality
- Drill-through: Click district for details

**Page 4: Nutrition & Immunization**
- Matrix: Cross-tabulation of indicators by district
- Waterfall Chart: Change analysis
- Treemap: Anemia prevalence by state

---

## 🎯 Your Next Steps

### Immediate (Today):
1. ✅ Download and organize data
2. ✅ Create database
3. ✅ Run 5-10 sample queries
4. ✅ Connect Power BI

### This Week:
1. 📊 Complete exploratory data analysis in Python
2. 📈 Build initial Power BI dashboard (2-3 pages)
3. 🔍 Identify 3-5 key insights from the data
4. 📝 Write methodology documentation

### Next Week:
1. 🎨 Refine dashboard design (colors, layouts, Bharat Maps)
2. 📊 Add advanced visualizations (drill-through, bookmarks)
3. 📄 Create project README with findings
4. 🚀 Deploy dashboard and prepare presentation

### Portfolio Preparation:
1. 📸 Take high-quality screenshots of dashboard
2. 📹 Record a 2-minute demo video
3. 📝 Write a detailed case study article
4. 🔗 Update rkjat.in with project link
5. 🐦 Create a Twitter thread with key insights
6. 💼 Add to LinkedIn with #DataAnalytics #HealthcareAnalytics

---

## 🆘 Troubleshooting

### Issue: "No such file or directory"
**Solution**: Make sure you're in the right directory
```bash
cd indian-healthcare-analysis
pwd  # Should show full path to project
```

### Issue: "SQLite database is locked"
**Solution**: Close all connections
```python
conn.close()  # In Python
```
Or restart Power BI Desktop

### Issue: "Missing indicator data"
**Solution**: Some districts have incomplete data. Use this query:
```sql
SELECT * FROM vw_data_quality_check;
```

### Issue: Power BI can't find SQLite connector
**Solution**: 
1. Download ODBC driver: https://www.devart.com/odbc/sqlite/
2. Or use CSV export method (see below)

---

## 💡 Pro Tips

### Export to CSV for Power BI (Alternative):
```python
import sqlite3
import pandas as pd

conn = sqlite3.connect('data/database/healthcare_india.db')

# Export main view
df = pd.read_sql("SELECT * FROM vw_district_health_profile", conn)
df.to_csv('data/processed/district_health_profile.csv', index=False)

conn.close()
```

### Performance Optimization:
- **Indexing**: Already done in schema.sql
- **Filtering**: Always filter by state or indicator category first
- **Power BI**: Use DirectQuery for large datasets

### Data Validation:
```sql
-- Check for anomalies
SELECT * FROM vw_data_quality_check;

-- Verify record counts
SELECT 
    (SELECT COUNT(*) FROM dim_states) as states,
    (SELECT COUNT(*) FROM dim_districts) as districts,
    (SELECT COUNT(*) FROM fact_health_metrics) as metrics;
```

---

## 📚 Additional Resources

- **NFHS-5 Official Report**: http://rchiips.org/nfhs/
- **Power BI Documentation**: https://docs.microsoft.com/power-bi/
- **SQL Window Functions**: https://www.sqlitetutorial.net/sqlite-window-functions/
- **Bharat Maps for Power BI**: https://appsource.microsoft.com/

---

## 🎓 Learning Outcomes

By completing this project, you'll demonstrate:

✅ **Data Engineering**: ETL pipeline, database design, data normalization  
✅ **SQL Proficiency**: Complex queries, CTEs, window functions, views  
✅ **Data Analysis**: Statistical analysis, trend identification, outlier detection  
✅ **Visualization**: Interactive dashboards, geographic mapping, storytelling  
✅ **Domain Knowledge**: Indian healthcare system, public health indicators  
✅ **Tool Expertise**: Python, SQLite, Power BI, Git  

---

## 📞 Need Help?

If you get stuck:
1. Check the troubleshooting section above
2. Review the data dictionary: `docs/data_dictionary.md`
3. Examine sample queries: `sql/analysis_queries.sql`
4. Reach out on Twitter/LinkedIn with specific questions

---

**Status**: Ready to Start! 🎉  
**Time to Complete**: 4-6 hours (initial version)  
**Difficulty**: Intermediate  

Let's build something amazing! 💪
