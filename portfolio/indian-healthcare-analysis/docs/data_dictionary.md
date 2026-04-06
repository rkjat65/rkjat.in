# Data Dictionary - Indian Healthcare Analysis

## 📊 NFHS-5 Dataset Structure

### Primary Tables

#### 1. States Table
Contains state/UT-level aggregated health indicators.

| Column Name | Data Type | Description | Example |
|------------|-----------|-------------|---------|
| state_code | TEXT | 2-letter state code | "MH", "DL", "UP" |
| state_name | TEXT | Full state name | "Maharashtra", "Delhi" |
| indicator_id | INTEGER | Unique indicator ID | 1-131 |
| indicator_name | TEXT | Description of health indicator | "Total fertility rate" |
| indicator_value | REAL | Numeric value of indicator | 1.8, 85.4 |
| indicator_unit | TEXT | Unit of measurement | "%, per 1000, ratio" |
| survey_year | TEXT | Survey period | "2019-21" |

#### 2. Districts Table
Contains district-level health indicators for 707 districts.

| Column Name | Data Type | Description | Example |
|------------|-----------|-------------|---------|
| state_code | TEXT | 2-letter state code | "MH" |
| state_name | TEXT | Full state name | "Maharashtra" |
| district_code | TEXT | Census 2011 district code | "496" |
| district_name | TEXT | Full district name | "Mumbai" |
| indicator_id | INTEGER | Unique indicator ID | 1-131 |
| indicator_name | TEXT | Description of indicator | "Children age 12-23 months fully immunized" |
| indicator_value | REAL | Numeric value | 75.4 |
| indicator_unit | TEXT | Unit | "%" |
| nfhs4_value | REAL | NFHS-4 (2015-16) value for comparison | 68.2 |
| change | REAL | Change between NFHS-4 and NFHS-5 | 7.2 |

---

## 🏥 Key Health Indicators (Categories)

### 1. Maternal Health Indicators

| Indicator ID | Indicator Name | Description | Target/Good Value |
|-------------|----------------|-------------|-------------------|
| 10 | Mothers who had an antenatal check-up in the first trimester (%) | % of mothers with ANC in first 3 months | >70% |
| 11 | Mothers who had at least 4 antenatal care visits (%) | Adequate ANC coverage | >80% |
| 16 | Institutional births (%) | Deliveries in health facilities | >90% |
| 17 | Postnatal care within 2 days of delivery (%) | Early PNC coverage | >85% |
| 20 | C-section deliveries (%) | Proportion of cesarean births | 10-15% (WHO) |

### 2. Child Health Indicators

| Indicator ID | Indicator Name | Description | Target/Good Value |
|-------------|----------------|-------------|-------------------|
| 31 | Children age 12-23 months fully immunized (%) | Complete immunization coverage | >90% |
| 41 | Infant mortality rate (per 1000 live births) | Deaths in first year of life | <30 |
| 42 | Under-five mortality rate (U5MR) (per 1000) | Deaths before age 5 | <40 |
| 44 | Stunting (height-for-age) (%) | Chronic malnutrition indicator | <20% |
| 45 | Wasting (weight-for-height) (%) | Acute malnutrition indicator | <5% |
| 46 | Underweight (weight-for-age) (%) | Overall nutritional status | <20% |

### 3. Nutrition Indicators

| Indicator ID | Indicator Name | Description | Target/Good Value |
|-------------|----------------|-------------|-------------------|
| 55 | Children age 6-59 months who are anaemic (%) | Childhood anemia prevalence | <20% |
| 56 | Non-pregnant women age 15-49 years who are anaemic (%) | Women's anemia | <20% |
| 36 | Children age 6-23 months receiving adequate diet (%) | Dietary diversity | >50% |
| 34 | Early initiation of breastfeeding (%) | Breastfed within 1 hour of birth | >75% |
| 35 | Exclusive breastfeeding for 6 months (%) | No other foods/liquids for 6 months | >60% |

### 4. Healthcare Access Indicators

| Indicator ID | Indicator Name | Description | Target/Good Value |
|-------------|----------------|-------------|-------------------|
| 26 | Health insurance coverage (%) | Population covered by health insurance | >50% |
| 27 | Distance to nearest health facility | Accessibility measure | <5 km |
| - | Per capita public health expenditure | State health spending | Higher is better |

### 5. Disease Prevalence Indicators

| Indicator ID | Indicator Name | Description | Target/Good Value |
|-------------|----------------|-------------|-------------------|
| 61 | Women age 15-49 years with high blood glucose (%) | Diabetes prevalence | <10% |
| 62 | Women age 15-49 years who are overweight/obese (%) | Obesity indicator | <20% |
| 63 | Men age 15-54 years with hypertension (%) | High BP prevalence | <25% |
| 64 | Women age 15-49 years with hypertension (%) | High BP in women | <20% |

### 6. Family Planning Indicators

| Indicator ID | Indicator Name | Description | Target/Good Value |
|-------------|----------------|-------------|-------------------|
| 1 | Total fertility rate (children per woman) | Average births per woman | 2.1 (replacement) |
| 2 | Currently married women age 15-49 using modern contraceptive methods (%) | Modern FP uptake | >60% |
| 3 | Unmet need for family planning (%) | Women wanting FP without access | <10% |

---

## 🔄 Data Quality Notes

### Missing Values
- Some indicators may have missing values for certain districts
- Missing represented as: NULL, "NA", empty string, or "-"
- Need to handle during analysis:
  ```sql
  WHERE indicator_value IS NOT NULL 
  AND indicator_value != 'NA'
  ```

### Data Ranges
- Percentages: 0-100
- Rates (mortality, fertility): Can exceed 100 per 1000
- Nutritional indicators: 0-100% typically

### Known Data Issues
1. **Uttar Bastar Kanker (Chhattisgarh)**: Only 103 indicators instead of 131
2. **Sample Size**: Some district estimates based on small samples (25-49 cases)
3. **Name Standardization**: District names may vary slightly from Census 2011

---

## 📊 SQL Table Design (Proposed)

### Normalized Schema

```sql
-- Dimension Tables
CREATE TABLE dim_states (
    state_code TEXT PRIMARY KEY,
    state_name TEXT NOT NULL,
    region TEXT,  -- North, South, East, West, Northeast
    population_2011 INTEGER
);

CREATE TABLE dim_districts (
    district_code TEXT PRIMARY KEY,
    district_name TEXT NOT NULL,
    state_code TEXT,
    population_2011 INTEGER,
    area_sqkm REAL,
    FOREIGN KEY (state_code) REFERENCES dim_states(state_code)
);

CREATE TABLE dim_indicators (
    indicator_id INTEGER PRIMARY KEY,
    indicator_name TEXT NOT NULL,
    indicator_category TEXT,  -- Maternal, Child, Nutrition, etc.
    indicator_unit TEXT,
    target_value REAL,
    description TEXT
);

-- Fact Table
CREATE TABLE fact_health_metrics (
    metric_id INTEGER PRIMARY KEY AUTOINCREMENT,
    district_code TEXT,
    indicator_id INTEGER,
    nfhs5_value REAL,
    nfhs4_value REAL,
    change_value REAL,
    survey_year TEXT,
    data_quality_flag TEXT,  -- Good, Fair, Small Sample
    FOREIGN KEY (district_code) REFERENCES dim_districts(district_code),
    FOREIGN KEY (indicator_id) REFERENCES dim_indicators(indicator_id)
);
```

---

## 🎯 Analysis-Ready Views

### Create useful views for common queries:

```sql
-- View: Complete Health Profile by District
CREATE VIEW vw_district_health_profile AS
SELECT 
    d.state_name,
    d.district_name,
    i.indicator_category,
    i.indicator_name,
    f.nfhs5_value,
    f.nfhs4_value,
    f.change_value,
    CASE 
        WHEN f.nfhs5_value >= i.target_value THEN 'Met'
        WHEN f.nfhs5_value >= i.target_value * 0.8 THEN 'Near'
        ELSE 'Below'
    END as target_status
FROM fact_health_metrics f
JOIN dim_districts d ON f.district_code = d.district_code
JOIN dim_indicators i ON f.indicator_id = i.indicator_id;

-- View: State-wise Aggregated Metrics
CREATE VIEW vw_state_aggregates AS
SELECT 
    s.state_name,
    i.indicator_category,
    i.indicator_name,
    AVG(f.nfhs5_value) as avg_value,
    MIN(f.nfhs5_value) as min_value,
    MAX(f.nfhs5_value) as max_value,
    COUNT(DISTINCT f.district_code) as num_districts
FROM fact_health_metrics f
JOIN dim_districts d ON f.district_code = d.district_code
JOIN dim_states s ON d.state_code = s.state_code
JOIN dim_indicators i ON f.indicator_id = i.indicator_id
WHERE f.nfhs5_value IS NOT NULL
GROUP BY s.state_name, i.indicator_category, i.indicator_name;
```

---

## 📝 Data Processing Pipeline

1. **Raw Data** → `data/raw/nfhs5/`
2. **Data Cleaning** → Handle missing values, standardize names
3. **Data Transformation** → Pivot from long to wide format (optional)
4. **Database Load** → Create normalized tables
5. **View Creation** → Analysis-ready views
6. **Dashboard Connection** → Power BI connects to SQLite

---

## 🔗 References
- NFHS-5 Report: http://rchiips.org/nfhs/
- Census 2011 Codes: https://censusindia.gov.in/
- WHO Standards: https://www.who.int/health-topics/
