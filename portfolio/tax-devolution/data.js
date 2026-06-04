// Complete dataset for Fiscal Federalism Analysis
// Source: Ministry of Finance, Rajya Sabha (December 2, 2025)

const statesData = {
    "Maharashtra": {
        contribution: 36.07,
        devolution: 6.65,
        netDiff: 29.42,
        contributionAbs: 40.30,
        devolutionAbs: 4.99,
        multiplier: 0.18,
        classification: "Net Contributor"
    },
    "Karnataka": {
        contribution: 12.66,
        devolution: 3.90,
        netDiff: 8.76,
        contributionAbs: 14.14,
        devolutionAbs: 2.93,
        multiplier: 0.31,
        classification: "Net Contributor"
    },
    "Uttar Pradesh": {
        contribution: 4.60,
        devolution: 15.82,
        netDiff: -11.22,
        contributionAbs: 5.14,
        devolutionAbs: 11.88,
        multiplier: 3.44,
        classification: "Net Beneficiary"
    },
    "Bihar": {
        contribution: 0.68,
        devolution: 8.66,
        netDiff: -7.98,
        contributionAbs: 0.76,
        devolutionAbs: 6.50,
        multiplier: 12.74,
        classification: "Net Beneficiary"
    },
    "Tamil Nadu": {
        contribution: 7.61,
        devolution: 4.66,
        netDiff: 2.95,
        contributionAbs: 8.50,
        devolutionAbs: 3.50,
        multiplier: 0.61,
        classification: "Net Contributor"
    },
    "Gujarat": {
        contribution: 6.88,
        devolution: 3.39,
        netDiff: 3.49,
        contributionAbs: 7.69,
        devolutionAbs: 2.55,
        multiplier: 0.49,
        classification: "Net Contributor"
    },
    "West Bengal": {
        contribution: 3.99,
        devolution: 6.97,
        netDiff: -2.98,
        contributionAbs: 4.46,
        devolutionAbs: 5.23,
        multiplier: 1.75,
        classification: "Net Beneficiary"
    },
    "Rajasthan": {
        contribution: 2.53,
        devolution: 6.08,
        netDiff: -3.55,
        contributionAbs: 2.83,
        devolutionAbs: 4.57,
        multiplier: 2.40,
        classification: "Net Beneficiary"
    },
    "Madhya Pradesh": {
        contribution: 1.94,
        devolution: 7.40,
        netDiff: -5.46,
        contributionAbs: 2.17,
        devolutionAbs: 5.56,
        multiplier: 3.81,
        classification: "Net Beneficiary"
    },
    "Andhra Pradesh": {
        contribution: 2.97,
        devolution: 4.30,
        netDiff: -1.33,
        contributionAbs: 3.32,
        devolutionAbs: 3.23,
        multiplier: 1.45,
        classification: "Net Beneficiary"
    },
    "Telangana": {
        contribution: 3.87,
        devolution: 2.45,
        netDiff: 1.42,
        contributionAbs: 4.32,
        devolutionAbs: 1.84,
        multiplier: 0.63,
        classification: "Net Contributor"
    },
    "Kerala": {
        contribution: 1.62,
        devolution: 2.70,
        netDiff: -1.08,
        contributionAbs: 1.81,
        devolutionAbs: 2.03,
        multiplier: 1.67,
        classification: "Net Beneficiary"
    },
    "Haryana": {
        contribution: 5.38,
        devolution: 1.10,
        netDiff: 4.28,
        contributionAbs: 6.02,
        devolutionAbs: 0.83,
        multiplier: 0.20,
        classification: "Net Contributor"
    },
    "Odisha": {
        contribution: 2.34,
        devolution: 4.42,
        netDiff: -2.08,
        contributionAbs: 2.61,
        devolutionAbs: 3.32,
        multiplier: 1.89,
        classification: "Net Beneficiary"
    },
    "Punjab": {
        contribution: 1.32,
        devolution: 2.09,
        netDiff: -0.77,
        contributionAbs: 1.47,
        devolutionAbs: 1.57,
        multiplier: 1.58,
        classification: "Net Beneficiary"
    },
    "Assam": {
        contribution: 0.67,
        devolution: 3.90,
        netDiff: -3.23,
        contributionAbs: 0.75,
        devolutionAbs: 2.93,
        multiplier: 5.82,
        classification: "Net Beneficiary"
    },
    "Jharkhand": {
        contribution: 1.42,
        devolution: 2.96,
        netDiff: -1.54,
        contributionAbs: 1.58,
        devolutionAbs: 2.22,
        multiplier: 2.08,
        classification: "Net Beneficiary"
    },
    "Chhattisgarh": {
        contribution: 1.50,
        devolution: 3.14,
        netDiff: -1.64,
        contributionAbs: 1.68,
        devolutionAbs: 2.36,
        multiplier: 2.09,
        classification: "Net Beneficiary"
    },
    "Uttarakhand": {
        contribution: 0.81,
        devolution: 1.66,
        netDiff: -0.85,
        contributionAbs: 0.90,
        devolutionAbs: 1.24,
        multiplier: 2.05,
        classification: "Net Beneficiary"
    },
    "Himachal Pradesh": {
        contribution: 0.43,
        devolution: 1.59,
        netDiff: -1.16,
        contributionAbs: 0.48,
        devolutionAbs: 1.19,
        multiplier: 3.70,
        classification: "Net Beneficiary"
    },
    "Tripura": {
        contribution: 0.04,
        devolution: 1.04,
        netDiff: -1.00,
        contributionAbs: 0.05,
        devolutionAbs: 0.78,
        multiplier: 26.00,
        classification: "Net Beneficiary"
    },
    "Meghalaya": {
        contribution: 0.13,
        devolution: 0.84,
        netDiff: -0.71,
        contributionAbs: 0.15,
        devolutionAbs: 0.63,
        multiplier: 6.46,
        classification: "Net Beneficiary"
    },
    "Manipur": {
        contribution: 0.03,
        devolution: 0.83,
        netDiff: -0.80,
        contributionAbs: 0.03,
        devolutionAbs: 0.62,
        multiplier: 27.67,
        classification: "Net Beneficiary"
    },
    "Nagaland": {
        contribution: 0.03,
        devolution: 0.84,
        netDiff: -0.81,
        contributionAbs: 0.03,
        devolutionAbs: 0.63,
        multiplier: 28.00,
        classification: "Net Beneficiary"
    },
    "Goa": {
        contribution: 0.31,
        devolution: 0.27,
        netDiff: 0.04,
        contributionAbs: 0.35,
        devolutionAbs: 0.20,
        multiplier: 0.87,
        classification: "Net Contributor"
    },
    "Arunachal Pradesh": {
        contribution: 0.03,
        devolution: 1.42,
        netDiff: -1.39,
        contributionAbs: 0.04,
        devolutionAbs: 1.07,
        multiplier: 47.33,
        classification: "Net Beneficiary"
    },
    "Mizoram": {
        contribution: 0.01,
        devolution: 0.57,
        netDiff: -0.56,
        contributionAbs: 0.01,
        devolutionAbs: 0.43,
        multiplier: 57.00,
        classification: "Net Beneficiary"
    },
    "Sikkim": {
        contribution: 0.14,
        devolution: 0.36,
        netDiff: -0.22,
        contributionAbs: 0.16,
        devolutionAbs: 0.27,
        multiplier: 2.57,
        classification: "Net Beneficiary"
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { statesData };
}
