# Indian Healthcare System Performance Analysis

## 📊 Project Overview
A comprehensive analysis of India's healthcare system using NFHS-5 (National Family Health Survey 2019-21) and HMIS (Health Management Information System) data. This project analyzes district-level health indicators across all 36 States/UTs and 707 districts.

## 🎯 Objectives
- Analyze maternal and child health indicators across India
- Identify best and worst performing districts in healthcare delivery
- Track immunization coverage and nutrition trends
- Compare state-wise healthcare performance
- Build interactive dashboards for data-driven decision making

## 📂 Project Structure
```
indian-healthcare-analysis/
├── data/
│   ├── raw/                    # Original datasets
│   │   ├── nfhs5/             # NFHS-5 data files
│   │   └── hmis/              # HMIS data files
│   ├── processed/             # Cleaned and merged data
│   └── database/              # SQLite database
├── sql/
│   ├── schema.sql             # Database schema
│   ├── data_cleaning.sql      # Data cleaning queries
│   └── analysis_queries.sql   # Analysis SQL queries
├── notebooks/
│   └── exploratory_analysis.ipynb  # EDA notebook
├── dashboard/
│   └── healthcare_dashboard.pbix   # Power BI dashboard
├── docs/
│   ├── data_dictionary.md     # Data dictionary
│   └── methodology.md         # Analysis methodology
└── README.md
```

## 📁 Data Sources

### NFHS-5 (National Family Health Survey 2019-21)
- **Coverage**: 707 districts across 36 States/UTs
- **Indicators**: 131 health indicators including:
  - Maternal health (ANC visits, institutional deliveries)
  - Child health (immunization, nutrition, mortality)
  - Healthcare access (distance to facilities, clean fuel)
  - Disease prevalence (anemia, hypertension, diabetes)
- **Source**: [GitHub - SaiSiddhardhaKalla/NFHS](https://github.com/SaiSiddhardhaKalla/NFHS)
- **License**: CC BY 4.0

### HMIS (Health Management Information System)
- **Coverage**: Monthly hospital performance data
- **Indicators**: Hospital services, facility performance, disease data
- **Source**: [data.gov.in](https://www.data.gov.in/)

## 🔑 Key Performance Indicators (KPIs)

### Maternal Health
- Institutional deliveries (%)
- 4+ ANC visits (%)
- Postnatal care within 48 hours (%)
- C-section delivery rate (%)

### Child Health
- Full immunization coverage (12-23 months) (%)
- Stunting prevalence (%)
- Wasting prevalence (%)
- Infant Mortality Rate (IMR)

### Healthcare Access & Infrastructure
- Distance to nearest health facility
- Healthcare facility utilization
- Health insurance coverage (%)

### Nutrition
- Anemia in women (15-49 years) (%)
- Anemia in children (6-59 months) (%)
- Minimum dietary diversity (%)
- Exclusive breastfeeding (%)

## 🛠️ Technologies Used
- **Database**: SQLite
- **SQL Skills**: Window functions, CTEs, JOIN operations, aggregations
- **Visualization**: Power BI
- **Analysis**: Python (pandas, sqlite3)
- **Version Control**: Git/GitHub

## 🚀 Getting Started

### Prerequisites
```bash
# Python 3.8+
# Power BI Desktop
# SQLite3
```

### Installation
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/indian-healthcare-analysis.git
cd indian-healthcare-analysis

# Install Python dependencies
pip install -r requirements.txt
```

### Data Setup
1. Download NFHS-5 data from [GitHub](https://github.com/SaiSiddhardhaKalla/NFHS)
2. Place CSV files in `data/raw/nfhs5/`
3. Run data cleaning script:
   ```bash
   python scripts/01_data_cleaning.py
   ```
4. Create SQLite database:
   ```bash
   python scripts/02_create_database.py
   ```

## 📊 SQL Analysis Examples

### Top 10 Districts by Immunization Coverage
```sql
SELECT 
    state,
    district,
    full_immunization_pct,
    RANK() OVER (ORDER BY full_immunization_pct DESC) as rank
FROM health_indicators
WHERE full_immunization_pct IS NOT NULL
LIMIT 10;
```

### State-wise Maternal Health Comparison
```sql
WITH state_avg AS (
    SELECT 
        state,
        AVG(institutional_delivery_pct) as avg_inst_delivery,
        AVG(anc_4plus_visits_pct) as avg_anc_visits
    FROM health_indicators
    GROUP BY state
)
SELECT *,
    CASE 
        WHEN avg_inst_delivery > 90 THEN 'Excellent'
        WHEN avg_inst_delivery > 75 THEN 'Good'
        ELSE 'Needs Improvement'
    END as performance_category
FROM state_avg
ORDER BY avg_inst_delivery DESC;
```

## 📈 Dashboard Features
- Geographic heat maps (Bharat Maps integration)
- State and district-level drill-through
- Year-over-year trend analysis
- Performance ranking tables
- KPI cards for key metrics

## 📝 Key Findings
[To be updated after analysis]

## 👨‍💻 Author
**RK** - Data Analyst
- Portfolio: [rkjat.in](https://rkjat.in)
- Twitter: [@YOUR_HANDLE]
- LinkedIn: [Your Profile]

## 📄 License
This project uses data licensed under CC BY 4.0. The analysis and code are available under MIT License.

## 🙏 Acknowledgments
- Ministry of Health and Family Welfare, Government of India
- International Institute for Population Sciences (IIPS)
- ICF International
- Pratap Vardhan & Sai Siddhartha Kalla for data compilation

## 📚 References
1. IIPS and ICF. 2021. National Family Health Survey (NFHS-5), 2019-21: India. Mumbai: IIPS.
2. Health Management Information System (HMIS), Ministry of Health and Family Welfare
3. Census 2011, Office of the Registrar General & Census Commissioner, India

---

**Status**: 🚧 In Development  
**Last Updated**: December 2024
