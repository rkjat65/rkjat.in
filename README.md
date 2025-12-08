# DAwithRK - Simple Portfolio Website

A clean, minimal portfolio website built with pure HTML, CSS, and JavaScript. No frameworks, no build process – just push and it's live!

## 🚀 Quick Deploy to GitHub Pages (FREE & Unlimited)

### Step 1: Create GitHub Repository

1. Go to [github.com](https://github.com) → Click **"+"** → **"New repository"**
2. Name it: `rkjat.in` (or any name)
3. Keep it **Public**
4. **Don't** add README (we have one)
5. Click **Create repository**

### Step 2: Push Your Code

```bash
# Navigate to your website folder
cd rkjat-simple

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/rkjat65/rkjat.in.git

# Push
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repo on GitHub
2. Click **Settings** → **Pages** (left sidebar)
3. Source: **Deploy from a branch**
4. Branch: **main** / **root**
5. Click **Save**

🎉 Your site is live at: `https://rkjat65.github.io/rkjat.in/`

### Step 4: Connect Custom Domain (rkjat.in)

**In GitHub:**
1. Settings → Pages → Custom domain
2. Enter: `rkjat.in`
3. Check "Enforce HTTPS"

**In Your Domain Registrar (Hostinger):**

Add these DNS records:

| Type | Name | Value |
|------|------|-------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | rkjat65.github.io |

Wait 10-30 minutes for DNS propagation.

---

## 📁 Project Structure

```
rkjat-simple/
├── index.html              # Homepage
├── about.html              # About page
├── contact.html            # Contact page
├── css/
│   └── style.css           # All styles
├── js/
│   └── main.js             # Theme toggle, mobile nav
├── images/
│   └── profile.jpg         # Your photo
├── portfolio/
│   ├── index.html          # Portfolio list
│   ├── india-economic-pulse.html
│   └── project-template.html
├── blog/
│   ├── index.html          # Blog list
│   └── your-post.html      # Blog posts
└── assets/
    ├── pdf/                # PDF reports
    ├── ppt/                # Presentations
    └── notebooks/          # Jupyter notebooks (as HTML)
```

---

## ✍️ Adding Content

### New Blog Post

1. Copy any existing `.html` file in `/blog/`
2. Rename it: `my-new-post.html`
3. Edit the content
4. Add link to `/blog/index.html`
5. Push to GitHub

```bash
git add .
git commit -m "Add new blog post"
git push
```

### New Portfolio Project

1. Copy `/portfolio/project-template.html`
2. Rename it: `my-project.html`
3. Edit content, add embedded dashboard
4. Add link to `/portfolio/index.html`
5. Push to GitHub

---

## 🔧 Customization

### Change Colors

Edit `css/style.css`:

```css
:root {
  --primary: #0071e3;       /* Main accent color */
  --text: #1d1d1f;          /* Text color */
  --bg: #ffffff;            /* Background */
}
```

### Add Your Photo

1. Save as `images/profile.jpg`
2. In `about.html`, replace placeholder with:
   ```html
   <img src="images/profile.jpg" class="about-image" alt="RK">
   ```

### Setup Contact Form

**Option 1: Formspree (Recommended)**
1. Go to [formspree.io](https://formspree.io)
2. Create free account
3. Create new form → Get form ID
4. In `contact.html`, replace `YOUR_FORM_ID`:
   ```html
   <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```

---

## 📊 Embedding Dashboards

### Streamlit App
```html
<iframe src="https://your-app.streamlit.app/?embedded=true" 
        width="100%" height="700"></iframe>
```

### Dash/Flask App (on Render)
```html
<iframe src="https://your-app.onrender.com" 
        width="100%" height="700"></iframe>
```

### Jupyter Notebook
```bash
# Convert to HTML first
jupyter nbconvert --to html notebook.ipynb
```
```html
<iframe src="assets/notebooks/notebook.html" 
        width="100%" height="800"></iframe>
```

### PDF Report
```html
<iframe src="assets/pdf/report.pdf" 
        width="100%" height="600"></iframe>
```

---

## 🆚 Why GitHub Pages Over Netlify?

| Feature | Netlify Free | GitHub Pages |
|---------|--------------|--------------|
| Build minutes | 300/month | ✅ Unlimited |
| Deploys | Limited | ✅ Unlimited |
| Bandwidth | 100GB | 100GB |
| Custom domain | ✅ Free | ✅ Free |
| SSL | ✅ Free | ✅ Free |
| Build process | Required | ❌ Not needed |

**For a simple HTML/CSS/JS site, GitHub Pages is the clear winner!**

---

## 🔄 Updating Your Site

Every time you make changes:

```bash
git add .
git commit -m "Your update message"
git push
```

Changes are live within seconds!

---

## 📱 Features

- ✅ Responsive design (mobile-friendly)
- ✅ Dark/Light mode toggle
- ✅ Fast loading (no build process)
- ✅ SEO-friendly
- ✅ Embed any dashboard (Streamlit, Dash, etc.)
- ✅ Host PDFs, PPTs, notebooks
- ✅ Contact form ready
- ✅ Easy to update

---

## 🆘 Need Help?

Feel free to reach out or open an issue!

---

Built with ❤️ for data analysis
