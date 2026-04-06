"""
Fiscal Federalism Analysis: State Tax Contributions vs Devolutions
Data Source: Ministry of Finance, Rajya Sabha Unstarred Question 236 (Dec 2, 2025)
Period: FY 2020-21 to FY 2024-25
Author: RK Jat (@rkjat65)
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from matplotlib.patches import Rectangle
import warnings
warnings.filterwarnings('ignore')

# Set style for professional visualizations
plt.style.use('seaborn-v0_8-darkgrid')
sns.set_palette("husl")

# ==============================================================================
# DATA PREPARATION
# ==============================================================================

# Annexure A: Tax Collection by States (FY 2020-21 to 2024-25)
tax_collection_data = {
    'State': [
        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
        'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
        'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
        'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
        'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
        'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
    ],
    'Tax_Collection_Lakh_Crore': [
        3.32, 0.04, 0.75, 0.76, 1.68,
        0.35, 7.69, 6.02, 0.48, 1.58,
        14.14, 1.81, 2.17, 40.30, 0.03,
        0.15, 0.01, 0.03, 2.61, 1.47,
        2.83, 0.16, 8.50, 4.32, 0.05,
        5.14, 0.90, 4.46
    ],
    'Tax_Collection_Percent': [
        2.97, 0.03, 0.67, 0.68, 1.50,
        0.31, 6.88, 5.38, 0.43, 1.42,
        12.66, 1.62, 1.94, 36.07, 0.03,
        0.13, 0.01, 0.03, 2.34, 1.32,
        2.53, 0.14, 7.61, 3.87, 0.04,
        4.60, 0.81, 3.99
    ]
}

# Annexure B: Devolution to States (FY 2020-21 to 2024-25)
devolution_data = {
    'State': [
        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
        'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
        'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
        'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
        'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
        'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
    ],
    'Devolution_Lakh_Crore': [
        3.23, 1.07, 2.93, 6.50, 2.36,
        0.20, 2.55, 0.83, 1.19, 2.22,
        2.93, 2.03, 5.56, 4.99, 0.62,
        0.63, 0.43, 0.63, 3.32, 1.57,
        4.57, 0.27, 3.50, 1.84, 0.78,
        11.88, 1.24, 5.23
    ],
    'Devolution_Percent': [
        4.30, 1.42, 3.90, 8.66, 3.14,
        0.27, 3.39, 1.10, 1.59, 2.96,
        3.90, 2.70, 7.40, 6.65, 0.83,
        0.84, 0.57, 0.84, 4.42, 2.09,
        6.08, 0.36, 4.66, 2.45, 1.04,
        15.82, 1.66, 6.97
    ]
}

# Create DataFrames
df_tax = pd.DataFrame(tax_collection_data)
df_devolution = pd.DataFrame(devolution_data)

# Merge datasets
df = pd.merge(df_tax, df_devolution, on='State')

# Calculate key metrics
df['Net_Difference_PP'] = df['Tax_Collection_Percent'] - df['Devolution_Percent']
df['Net_Difference_Absolute'] = df['Tax_Collection_Lakh_Crore'] - df['Devolution_Lakh_Crore']
df['Devolution_Ratio'] = df['Devolution_Lakh_Crore'] / df['Tax_Collection_Lakh_Crore']
df['Multiplier'] = df['Devolution_Percent'] / df['Tax_Collection_Percent']

# Classify states
df['Classification'] = df['Net_Difference_PP'].apply(
    lambda x: 'Net Contributor' if x > 0 else 'Net Beneficiary'
)

# Sort by net difference for better visualization
df_sorted = df.sort_values('Net_Difference_PP', ascending=False)

# ==============================================================================
# STATISTICAL SUMMARY
# ==============================================================================

print("="*80)
print("FISCAL FEDERALISM ANALYSIS: STATE TAX CONTRIBUTIONS VS DEVOLUTIONS")
print("Period: FY 2020-21 to FY 2024-25")
print("="*80)
print()

print("OVERALL STATISTICS")
print("-"*80)
print(f"Total Tax Collection: ₹{df['Tax_Collection_Lakh_Crore'].sum():.2f} lakh crore")
print(f"Total Devolution: ₹{df['Devolution_Lakh_Crore'].sum():.2f} lakh crore")
print(f"Devolution as % of Collection: {(df['Devolution_Lakh_Crore'].sum()/df['Tax_Collection_Lakh_Crore'].sum()*100):.2f}%")
print()

print("STATE CLASSIFICATION")
print("-"*80)
contributors = df[df['Net_Difference_PP'] > 0]
beneficiaries = df[df['Net_Difference_PP'] < 0]
neutral = df[df['Net_Difference_PP'] == 0]

print(f"Net Contributors: {len(contributors)} states")
print(f"Net Beneficiaries: {len(beneficiaries)} states")
print(f"Neutral: {len(neutral)} states")
print()

print("TOP 5 NET CONTRIBUTORS (by percentage point difference)")
print("-"*80)
top_contributors = df_sorted.head(5)[['State', 'Tax_Collection_Percent', 
                                       'Devolution_Percent', 'Net_Difference_PP']]
print(top_contributors.to_string(index=False))
print()

print("TOP 5 NET BENEFICIARIES (by percentage point difference)")
print("-"*80)
top_beneficiaries = df_sorted.tail(5)[['State', 'Tax_Collection_Percent', 
                                        'Devolution_Percent', 'Net_Difference_PP']]
print(top_beneficiaries.to_string(index=False))
print()

print("EXTREME CASES")
print("-"*80)
max_contributor = df_sorted.iloc[0]
max_beneficiary = df_sorted.iloc[-1]

print(f"Largest Contributor: {max_contributor['State']}")
print(f"  Tax Share: {max_contributor['Tax_Collection_Percent']:.2f}%")
print(f"  Devolution Share: {max_contributor['Devolution_Percent']:.2f}%")
print(f"  Net Difference: +{max_contributor['Net_Difference_PP']:.2f} pp")
print(f"  Multiplier: {max_contributor['Multiplier']:.2f}x")
print()

print(f"Largest Beneficiary: {max_beneficiary['State']}")
print(f"  Tax Share: {max_beneficiary['Tax_Collection_Percent']:.2f}%")
print(f"  Devolution Share: {max_beneficiary['Devolution_Percent']:.2f}%")
print(f"  Net Difference: {max_beneficiary['Net_Difference_PP']:.2f} pp")
print(f"  Multiplier: {max_beneficiary['Multiplier']:.2f}x")
print()

# ==============================================================================
# VISUALIZATION 1: DIVERGING BAR CHART
# ==============================================================================

def create_diverging_bar_chart():
    """Create professional diverging bar chart showing net contributors vs beneficiaries"""
    
    fig, ax = plt.subplots(figsize=(14, 12))
    
    # Prepare data
    states = df_sorted['State'].values
    differences = df_sorted['Net_Difference_PP'].values
    colors = ['#d62728' if x > 0 else '#2ca02c' for x in differences]
    
    # Create bars
    bars = ax.barh(states, differences, color=colors, alpha=0.8, edgecolor='black', linewidth=0.5)
    
    # Add value labels
    for i, (bar, val) in enumerate(zip(bars, differences)):
        x_pos = val + (0.5 if val > 0 else -0.5)
        ha = 'left' if val > 0 else 'right'
        ax.text(x_pos, i, f'{val:+.2f}pp', 
                va='center', ha=ha, fontsize=9, fontweight='bold')
    
    # Add vertical line at zero
    ax.axvline(x=0, color='black', linestyle='-', linewidth=1.5, alpha=0.7)
    
    # Styling
    ax.set_xlabel('Net Difference (Tax Share % - Devolution Share %)', 
                  fontsize=12, fontweight='bold')
    ax.set_ylabel('State', fontsize=12, fontweight='bold')
    ax.set_title('Fiscal Federalism: Net Contributors vs Net Beneficiaries\n' + 
                 'States Ranked by Tax Contribution - Devolution Gap (FY 2020-21 to 2024-25)',
                 fontsize=14, fontweight='bold', pad=20)
    
    # Add legend
    from matplotlib.patches import Patch
    legend_elements = [
        Patch(facecolor='#d62728', alpha=0.8, label='Net Contributor (Contributes > Receives)'),
        Patch(facecolor='#2ca02c', alpha=0.8, label='Net Beneficiary (Receives > Contributes)')
    ]
    ax.legend(handles=legend_elements, loc='lower right', fontsize=10)
    
    # Grid
    ax.grid(axis='x', alpha=0.3, linestyle='--')
    ax.set_axisbelow(True)
    
    # Add watermark
    fig.text(0.99, 0.01, '@rkjat65 | Source: Ministry of Finance, Rajya Sabha', 
             ha='right', va='bottom', fontsize=8, alpha=0.6, style='italic')
    
    plt.tight_layout()
    plt.savefig('/mnt/user-data/outputs/chart1_diverging_bar.png', dpi=300, bbox_inches='tight')
    print("✓ Chart 1 saved: chart1_diverging_bar.png")
    
    return fig

# ==============================================================================
# VISUALIZATION 2: SCATTER PLOT WITH EQUITY LINE
# ==============================================================================

def create_scatter_plot():
    """Create scatter plot showing relationship between contribution and devolution"""
    
    fig, ax = plt.subplots(figsize=(14, 10))
    
    # Scatter plot
    scatter = ax.scatter(df['Tax_Collection_Percent'], 
                        df['Devolution_Percent'],
                        s=df['Tax_Collection_Lakh_Crore']*20,  # Size by absolute collection
                        c=df['Net_Difference_PP'],
                        cmap='RdYlGn_r',
                        alpha=0.7,
                        edgecolors='black',
                        linewidth=1)
    
    # Add equity line (where contribution = devolution)
    max_val = max(df['Tax_Collection_Percent'].max(), df['Devolution_Percent'].max())
    ax.plot([0, max_val], [0, max_val], 'r--', linewidth=2, label='Equity Line (Contribution = Devolution)', alpha=0.7)
    
    # Annotate key states
    key_states = ['Maharashtra', 'Uttar Pradesh', 'Karnataka', 'Bihar', 'Gujarat', 'Tamil Nadu']
    for state in key_states:
        row = df[df['State'] == state].iloc[0]
        ax.annotate(state, 
                   xy=(row['Tax_Collection_Percent'], row['Devolution_Percent']),
                   xytext=(10, 10),
                   textcoords='offset points',
                   fontsize=9,
                   fontweight='bold',
                   bbox=dict(boxstyle='round,pad=0.3', facecolor='yellow', alpha=0.5),
                   arrowprops=dict(arrowstyle='->', connectionstyle='arc3,rad=0', lw=1))
    
    # Colorbar
    cbar = plt.colorbar(scatter, ax=ax)
    cbar.set_label('Net Difference (pp)\n← Beneficiary | Contributor →', 
                   rotation=270, labelpad=25, fontsize=10, fontweight='bold')
    
    # Styling
    ax.set_xlabel('Tax Collection Share (%)', fontsize=12, fontweight='bold')
    ax.set_ylabel('Devolution Receipt Share (%)', fontsize=12, fontweight='bold')
    ax.set_title('Tax Contribution vs Devolution: The Redistribution Map\n' +
                 'Bubble size = Absolute tax collection (FY 2020-21 to 2024-25)',
                 fontsize=14, fontweight='bold', pad=20)
    
    # Add quadrant labels
    ax.text(0.95, 0.05, 'High Contribution\nLow Devolution\n(Net Contributors)', 
            transform=ax.transAxes, ha='right', va='bottom',
            bbox=dict(boxstyle='round', facecolor='#d62728', alpha=0.3),
            fontsize=9, fontweight='bold')
    
    ax.text(0.05, 0.95, 'Low Contribution\nHigh Devolution\n(Net Beneficiaries)', 
            transform=ax.transAxes, ha='left', va='top',
            bbox=dict(boxstyle='round', facecolor='#2ca02c', alpha=0.3),
            fontsize=9, fontweight='bold')
    
    ax.legend(loc='upper left', fontsize=10)
    ax.grid(alpha=0.3, linestyle='--')
    ax.set_axisbelow(True)
    
    # Add watermark
    fig.text(0.99, 0.01, '@rkjat65 | Source: Ministry of Finance, Rajya Sabha', 
             ha='right', va='bottom', fontsize=8, alpha=0.6, style='italic')
    
    plt.tight_layout()
    plt.savefig('/mnt/user-data/outputs/chart2_scatter_plot.png', dpi=300, bbox_inches='tight')
    print("✓ Chart 2 saved: chart2_scatter_plot.png")
    
    return fig

# ==============================================================================
# VISUALIZATION 3: STACKED BAR COMPARISON
# ==============================================================================

def create_stacked_comparison():
    """Create stacked bar comparison for top states"""
    
    # Select top 10 by absolute collection
    top_10 = df.nlargest(10, 'Tax_Collection_Lakh_Crore').copy()
    top_10 = top_10.sort_values('Tax_Collection_Percent', ascending=True)
    
    fig, ax = plt.subplots(figsize=(14, 8))
    
    x = np.arange(len(top_10))
    width = 0.35
    
    bars1 = ax.barh(x - width/2, top_10['Tax_Collection_Percent'], width, 
                    label='Tax Collection %', color='#1f77b4', alpha=0.8, edgecolor='black')
    bars2 = ax.barh(x + width/2, top_10['Devolution_Percent'], width, 
                    label='Devolution Receipt %', color='#ff7f0e', alpha=0.8, edgecolor='black')
    
    # Add value labels
    for bars in [bars1, bars2]:
        for bar in bars:
            width_val = bar.get_width()
            ax.text(width_val + 0.3, bar.get_y() + bar.get_height()/2,
                   f'{width_val:.2f}%',
                   ha='left', va='center', fontsize=9, fontweight='bold')
    
    ax.set_yticks(x)
    ax.set_yticklabels(top_10['State'])
    ax.set_xlabel('Percentage Share (%)', fontsize=12, fontweight='bold')
    ax.set_title('Top 10 States: Tax Collection vs Devolution Receipt\n' +
                 '(FY 2020-21 to 2024-25)',
                 fontsize=14, fontweight='bold', pad=20)
    ax.legend(loc='lower right', fontsize=10)
    ax.grid(axis='x', alpha=0.3, linestyle='--')
    ax.set_axisbelow(True)
    
    # Add watermark
    fig.text(0.99, 0.01, '@rkjat65 | Source: Ministry of Finance, Rajya Sabha', 
             ha='right', va='bottom', fontsize=8, alpha=0.6, style='italic')
    
    plt.tight_layout()
    plt.savefig('/mnt/user-data/outputs/chart3_stacked_comparison.png', dpi=300, bbox_inches='tight')
    print("✓ Chart 3 saved: chart3_stacked_comparison.png")
    
    return fig

# ==============================================================================
# VISUALIZATION 4: TREEMAP OF TAX COLLECTION
# ==============================================================================

def create_treemap():
    """Create treemap showing tax collection contribution by state"""
    import squarify
    
    fig, ax = plt.subplots(figsize=(16, 10))
    
    # Prepare data (top 15 states + others)
    top_15 = df.nlargest(15, 'Tax_Collection_Percent')
    others_value = df.nsmallest(13, 'Tax_Collection_Percent')['Tax_Collection_Percent'].sum()
    
    sizes = list(top_15['Tax_Collection_Percent']) + [others_value]
    labels = [f"{state}\n{pct:.2f}%" 
              for state, pct in zip(top_15['State'], top_15['Tax_Collection_Percent'])]
    labels += [f"Others (13 states)\n{others_value:.2f}%"]
    
    # Create color map based on net difference
    colors_list = list(top_15['Net_Difference_PP']) + [0]
    
    squarify.plot(sizes=sizes, label=labels, 
                  value=colors_list,
                  alpha=0.8,
                  text_kwargs={'fontsize':9, 'weight':'bold'},
                  color=plt.cm.RdYlGn_r(plt.Normalize(vmin=-12, vmax=30)(colors_list)),
                  edgecolor='white',
                  linewidth=2,
                  ax=ax)
    
    ax.set_title('India\'s Tax Collection Map: State-wise Contribution\n' +
                 'Color indicates Net Contributor (Red) vs Net Beneficiary (Green)\n' +
                 '(FY 2020-21 to 2024-25)',
                 fontsize=14, fontweight='bold', pad=20)
    ax.axis('off')
    
    # Add watermark
    fig.text(0.99, 0.01, '@rkjat65 | Source: Ministry of Finance, Rajya Sabha', 
             ha='right', va='bottom', fontsize=8, alpha=0.6, style='italic')
    
    plt.tight_layout()
    plt.savefig('/mnt/user-data/outputs/chart4_treemap.png', dpi=300, bbox_inches='tight')
    print("✓ Chart 4 saved: chart4_treemap.png")
    
    return fig

# ==============================================================================
# DATA EXPORT
# ==============================================================================

def export_data():
    """Export cleaned data for further analysis"""
    
    # Export main dataset
    df_export = df.copy()
    df_export = df_export.sort_values('Net_Difference_PP', ascending=False)
    df_export.to_csv('/mnt/user-data/outputs/fiscal_federalism_data.csv', index=False)
    print("✓ Data exported: fiscal_federalism_data.csv")
    
    # Create summary statistics file
    summary = {
        'Metric': [
            'Total Tax Collection (₹ lakh crore)',
            'Total Devolution (₹ lakh crore)',
            'Devolution Rate (%)',
            'Number of Net Contributors',
            'Number of Net Beneficiaries',
            'Largest Contributor (State)',
            'Largest Contributor (pp difference)',
            'Largest Beneficiary (State)',
            'Largest Beneficiary (pp difference)'
        ],
        'Value': [
            f"{df['Tax_Collection_Lakh_Crore'].sum():.2f}",
            f"{df['Devolution_Lakh_Crore'].sum():.2f}",
            f"{(df['Devolution_Lakh_Crore'].sum()/df['Tax_Collection_Lakh_Crore'].sum()*100):.2f}",
            len(contributors),
            len(beneficiaries),
            max_contributor['State'],
            f"{max_contributor['Net_Difference_PP']:.2f}",
            max_beneficiary['State'],
            f"{max_beneficiary['Net_Difference_PP']:.2f}"
        ]
    }
    
    pd.DataFrame(summary).to_csv('/mnt/user-data/outputs/summary_statistics.csv', index=False)
    print("✓ Summary exported: summary_statistics.csv")
    
    return df_export

# ==============================================================================
# MAIN EXECUTION
# ==============================================================================

if __name__ == "__main__":
    print("\nGenerating visualizations...\n")
    
    # Create all visualizations
    create_diverging_bar_chart()
    create_scatter_plot()
    create_stacked_comparison()
    create_treemap()
    
    # Export data
    print("\nExporting data...\n")
    export_data()
    
    print("\n" + "="*80)
    print("ANALYSIS COMPLETE!")
    print("="*80)
    print("\nGenerated files:")
    print("  1. chart1_diverging_bar.png - Main visualization for Twitter")
    print("  2. chart2_scatter_plot.png - Contribution vs Devolution map")
    print("  3. chart3_stacked_comparison.png - Top 10 states comparison")
    print("  4. chart4_treemap.png - Tax collection proportions")
    print("  5. fiscal_federalism_data.csv - Complete dataset")
    print("  6. summary_statistics.csv - Key metrics")
    print("\n")
