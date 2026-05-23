# 🇮🇳 India's Fiscal Federalism - Interactive Analysis

An interactive web-based data visualization project analyzing state-wise tax contributions and devolutions in India (FY 2020-21 to 2024-25).

![Project Banner](images/preview.png)

## 🎯 Live Demo

**[View Live Project](https://rkjat.github.io/fiscal-federalism-analysis/)**

## 📊 Project Overview

This interactive portfolio project reveals how ₹111 lakh crore in taxes flows between India's 28 states through constitutional redistribution mechanisms. Built with modern web technologies, it features:

- ✅ **Interactive Visualizations** - Dynamic charts powered by Chart.js
- ✅ **Modern UI/UX** - Glassmorphism design with smooth animations  
- ✅ **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- ✅ **Data-Driven Insights** - Based on official government data
- ✅ **Educational Content** - Explains India's fiscal federalism with context

## 🔥 Key Findings

- **7 states** contribute more than they receive (Net Contributors)
- **21 states** receive more than they contribute (Net Beneficiaries)
- **Maharashtra** leads contributors with +29.42pp gap
- **Uttar Pradesh** leads beneficiaries with -11.22pp gap
- **Bihar** has the highest multiplier: receives 12.7x its contribution

## 🛠️ Technologies Used

### Frontend
- **HTML5** - Semantic markup with accessibility features
- **CSS3** - Modern styling with CSS Variables, Flexbox, Grid
- **JavaScript (ES6+)** - Interactive features and animations

### Libraries & Frameworks
- **Chart.js 4.4.0** - Data visualization
- **AOS (Animate On Scroll)** - Scroll animations
- **CountUp.js** - Animated number counters
- **Google Fonts** - Inter & Playfair Display typography

### Design Features
- Glassmorphism UI
- Gradient backgrounds with animated orbs
- Smooth scroll behavior
- Lightbox image viewer
- Back-to-top button
- Mobile-first responsive design

## 📁 Project Structure

```
fiscal-federalism-analysis/
├── index.html              # Main HTML file
├── styles.css              # Complete stylesheet
├── script.js               # Main JavaScript
├── data.js                 # State-wise data
├── charts.js               # Chart configurations
├── README.md               # This file
├── images/                 # Visual assets
│   ├── beneficiary-states.png
│   ├── contributor-states.png
│   └── finance-commission-formula.png
├── data/                   # Raw data files
│   └── fiscal_federalism_data.csv
└── code/                   # Analysis scripts
    └── fiscal_federalism_analysis.py
```

## 🚀 Getting Started

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/rkjat/fiscal-federalism-analysis.git
cd fiscal-federalism-analysis
```

2. **Open in browser**
```bash
# Simply open index.html in your browser
# OR use a local server (recommended)

# Using Python
python -m http.server 8000

# Using Node.js http-server
npx http-server -p 8000

# Using VS Code Live Server extension
# Right-click index.html → Open with Live Server
```

3. **Visit** `http://localhost:8000`

### Deployment

**GitHub Pages** (Recommended):
1. Push code to GitHub repository
2. Go to Settings → Pages
3. Select branch (main) and root folder
4. Save and wait for deployment

**Netlify**:
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

**Vercel**:
```bash
# Install Vercel CLI  
npm install -g vercel

# Deploy
vercel --prod
```

## 📝 Customization Guide

### Updating Data

Edit `data.js` to update state information:

```javascript
const statesData = {
    "State Name": {
        contribution: 0.00,      // % of total tax
        devolution: 0.00,        // % of devolution received
        netDiff: 0.00,           // Difference (pp)
        contributionAbs: 0.00,   // Absolute value (₹ lakh crore)
        devolutionAbs: 0.00,     // Absolute value (₹ lakh crore)
        multiplier: 0.00,        // Receipt ÷ Contribution
        classification: "Type"   // "Net Contributor" or "Net Beneficiary"
    }
};
```

### Changing Colors

Edit CSS variables in `styles.css`:

```css
:root {
    --primary: #6366f1;           /* Primary color */
    --contributor: #10b981;       /* Contributors (green) */
    --beneficiary: #ef4444;       /* Beneficiaries (red) */
    --dark: #0f172a;              /* Background */
}
```

### Adding New Sections

1. Add HTML section in `index.html`
2. Add navigation link
3. Style in `styles.css`
4. Add interactivity in `script.js` if needed

## 📊 Data Source

**Official Government Data**:
- Ministry of Finance, Government of India
- Rajya Sabha Unstarred Question No. 236
- Date: December 2, 2025
- Period: FY 2020-21 to FY 2024-25

**Methodology**:
- Data extracted from official PDF (Annexure A & B)
- Metrics calculated: Net Difference, Multiplier, Classification
- Verified against stated totals
- Open data principles applied

## 🎨 Design System

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)
- **Sizes**: Responsive with clamp()

### Color Palette
- **Primary**: Indigo (#6366f1)
- **Secondary**: Amber (#f59e0b)
- **Contributors**: Emerald (#10b981)
- **Beneficiaries**: Red (#ef4444)
- **Dark**: Slate (#0f172a)

### Components
- Glass cards with backdrop blur
- Floating orbs with animations
- Smooth transitions (300ms cubic-bezier)
- Mobile-optimized navigation

## 🧪 Testing

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Performance
- Lighthouse Score: 95+
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s

## 📱 Features

### Interactive Elements
- ✅ State selector with live data display
- ✅ Tab navigation for infographics
- ✅ Interactive charts (hover for details)
- ✅ Image lightbox for full-screen viewing
- ✅ Smooth scroll with section highlighting
- ✅ Animated statistics counters

### Accessibility
- ✅ Semantic HTML5
- ✅ ARIA labels
- ✅ Keyboard navigation
- ✅ Color contrast (WCAG AA)
- ✅ Responsive text sizing

## 🤝 Contributing

Contributions welcome! Areas for improvement:

1. **Data Updates**: Historical comparison with previous Finance Commissions
2. **Visualizations**: Additional chart types (treemap, sankey diagram)
3. **Features**: State comparison tool, downloadable reports
4. **Performance**: Image optimization, code splitting
5. **Accessibility**: Screen reader testing, ARIA improvements

### How to Contribute

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

**Data**: Public Domain (Government of India)  
**Code & Design**: MIT License

```
MIT License - See LICENSE file for details
```

## 👤 Author

**RK Jat**  
Data Analyst | Content Creator | UPSC Aspirant

- 🌐 Website: [rkjat.in](https://rkjat.in)
- 💼 LinkedIn: [Connect via website]
- 📧 Email: [Contact form on website]

### About Me
I'm a data analyst transitioning from UPSC preparation, specializing in Indian economy, policy analysis, and data visualization. This project combines my background in current affairs with developing technical skills in data analytics and web development.

**Other Projects**:
- India Economic Pulse Dashboard (React/FastAPI)
- NFHS-5 Healthcare Analytics
- Indian Legislature Political Profile Analysis

## 🙏 Acknowledgments

- Ministry of Finance for open data
- Chart.js team for excellent visualization library
- AOS library for smooth animations
- Inter & Playfair Display font families
- Open source community

## 📧 Contact & Support

### Questions?
- Open an issue on GitHub
- Visit [rkjat.in](https://rkjat.in)

### For Media/Collaboration
Contact via website for:
- Data journalism inquiries
- Project collaborations
- Speaking engagements
- Custom analysis requests

## ⭐ Show Your Support

If you found this project useful:
- ⭐ Star the repository
- 🐦 Share on Twitter with #FiscalFederalism
- 💬 Provide feedback via issues
- 🤝 Contribute improvements

## 📈 Roadmap

### Phase 1 (Current)
- [x] Core visualization
- [x] Interactive features
- [x] Responsive design
- [x] Documentation

### Phase 2 (Q1 2026)
- [ ] Historical data (13th, 14th FC)
- [ ] Per capita analysis
- [ ] State comparison tool
- [ ] Video explainer

### Phase 3 (Future)
- [ ] API for data access
- [ ] Mobile app version
- [ ] Real-time updates
- [ ] Multi-language support (Hindi)

## 📊 Project Stats

- **Lines of Code**: ~3,500
- **Components**: 15+
- **Charts**: 4 types
- **States Covered**: 28
- **Data Points**: 252
- **Development Time**: 40 hours

## 🎯 Use Cases

### For Students
- UPSC current affairs material
- Economics research projects
- Data visualization learning

### For Analysts
- Template for fiscal analysis
- Chart.js implementation examples
- Responsive design patterns

### For Policymakers
- Quick reference for state finances
- Devolution formula understanding
- Evidence for policy discussions

### For Media
- Data-driven story source
- Visualization assets
- Expert contact for quotes

---

**Last Updated**: December 2025  
**Version**: 1.0.0  
**Status**: Active Development

---

Made with ❤️ and ☕ by [RK Jat](https://rkjat.in)

*This project is part of my portfolio demonstrating skills in data analysis, visualization, and modern web development.*

