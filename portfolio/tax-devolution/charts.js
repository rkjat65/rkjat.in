// Chart.js configurations for Fiscal Federalism Project

// Configure Chart.js defaults
Chart.defaults.color = '#cbd5e1';
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.plugins.legend.display = true;
Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(15, 23, 42, 0.9)';
Chart.defaults.plugins.tooltip.borderColor = 'rgba(99, 102, 241, 0.3)';
Chart.defaults.plugins.tooltip.borderWidth = 1;

// Prepare data arrays
const allStates = Object.keys(statesData);
const contributors = allStates.filter(s => statesData[s].netDiff > 0);
const beneficiaries = allStates.filter(s => statesData[s].netDiff < 0);

// Sort states by net difference
const sortedStates = allStates.sort((a, b) => statesData[b].netDiff - statesData[a].netDiff);
const top10 = sortedStates.slice(0, 10);

// Beneficiaries Chart
const beneficiariesCtx = document.getElementById('beneficiariesChart');
if (beneficiariesCtx) {
    new Chart(beneficiariesCtx, {
        type: 'bar',
        data: {
            labels: beneficiaries.sort((a, b) => statesData[a].netDiff - statesData[b].netDiff),
            datasets: [{
                label: 'Net Difference (pp)',
                data: beneficiaries.map(s => Math.abs(statesData[s].netDiff)),
                backgroundColor: 'rgba(239, 68, 68, 0.8)',
                borderColor: 'rgba(239, 68, 68, 1)',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Gap: -${context.parsed.x.toFixed(2)}pp`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { callback: function(value) { return value + 'pp'; } }
                },
                y: { grid: { display: false } }
            }
        }
    });
}

// Main Diverging Chart
const divergingCtx = document.getElementById('mainDivergingChart');
if (divergingCtx) {
    new Chart(divergingCtx, {
        type: 'bar',
        data: {
            labels: sortedStates,
            datasets: [{
                label: 'Net Difference (pp)',
                data: sortedStates.map(s => statesData[s].netDiff),
                backgroundColor: sortedStates.map(s => 
                    statesData[s].netDiff > 0 ? 'rgba(16, 185, 129, 0.8)' : 'rgba(239, 68, 68, 0.8)'
                ),
                borderColor: sortedStates.map(s => 
                    statesData[s].netDiff > 0 ? 'rgba(16, 185, 129, 1)' : 'rgba(239, 68, 68, 1)'
                ),
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const state = context.label;
                            const data = statesData[state];
                            return [
                                `Net Difference: ${data.netDiff > 0 ? '+' : ''}${data.netDiff.toFixed(2)}pp`,
                                `Contribution: ${data.contribution}%`,
                                `Devolution: ${data.devolution}%`,
                                `Multiplier: ${data.multiplier.toFixed(2)}x`
                            ];
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { callback: function(value) { return value + 'pp'; } }
                },
                y: { grid: { display: false } }
            }
        }
    });
}

// Scatter Chart
const scatterCtx = document.getElementById('mainScatterChart');
if (scatterCtx) {
    new Chart(scatterCtx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Net Contributors',
                data: contributors.map(s => ({
                    x: statesData[s].contribution,
                    y: statesData[s].devolution,
                    label: s
                })),
                backgroundColor: 'rgba(16, 185, 129, 0.6)',
                borderColor: 'rgba(16, 185, 129, 1)',
                pointRadius: 8,
                pointHoverRadius: 12
            }, {
                label: 'Net Beneficiaries',
                data: beneficiaries.map(s => ({
                    x: statesData[s].contribution,
                    y: statesData[s].devolution,
                    label: s
                })),
                backgroundColor: 'rgba(239, 68, 68, 0.6)',
                borderColor: 'rgba(239, 68, 68, 1)',
                pointRadius: 8,
                pointHoverRadius: 12
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1.5,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const point = context.raw;
                            return [
                                `State: ${point.label}`,
                                `Contribution: ${point.x.toFixed(2)}%`,
                                `Devolution: ${point.y.toFixed(2)}%`
                            ];
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: { display: true, text: 'Tax Contribution %' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                y: {
                    title: { display: true, text: 'Devolution Receipt %' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            }
        }
    });
}

// Comparison Chart
const comparisonCtx = document.getElementById('mainComparisonChart');
if (comparisonCtx) {
    new Chart(comparisonCtx, {
        type: 'bar',
        data: {
            labels: top10,
            datasets: [{
                label: 'Tax Contribution %',
                data: top10.map(s => statesData[s].contribution),
                backgroundColor: 'rgba(99, 102, 241, 0.8)',
                borderColor: 'rgba(99, 102, 241, 1)',
                borderWidth: 1
            }, {
                label: 'Devolution Receipt %',
                data: top10.map(s => statesData[s].devolution),
                backgroundColor: 'rgba(245, 158, 11, 0.8)',
                borderColor: 'rgba(245, 158, 11, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            plugins: {
                tooltip: {
                    callbacks: {
                        afterLabel: function(context) {
                            const state = context.label;
                            return `Gap: ${statesData[state].netDiff > 0 ? '+' : ''}${statesData[state].netDiff.toFixed(2)}pp`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { callback: function(value) { return value + '%'; } }
                },
                x: { grid: { display: false } }
            }
        }
    });
}
