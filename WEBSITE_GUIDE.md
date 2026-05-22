# RKJat Website Guide & Reference

A comprehensive guide to understanding, maintaining, and extending the rkjat.in portfolio website.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Quick Reference Commands](#quick-reference-commands)
5. [How to Add New Content](#how-to-add-new-content)
6. [File Reference Guide](#file-reference-guide)
7. [Styling Guide](#styling-guide)
8. [Component System](#component-system)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)

---

## Project Overview

This is a modern, professional portfolio website built with:
- **Vite** for fast development and optimized builds
- **TypeScript** for type-safe JavaScript
- **Handlebars** for reusable HTML components
- **Vanilla CSS** with CSS custom properties (variables)

The website features:
- Dark/Light theme support
- Responsive design
- Blog system with rich article styling
- Project portfolio
- Image gallery with lightbox
- Contact form
- Animated particle canvas background

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Vite | Build tool & dev server |
| TypeScript | Type-safe JavaScript |
| Handlebars | HTML templating & partials |
| CSS Variables | Theming & consistent styling |
| Vitest | Unit testing |
| GitHub Actions | CI/CD pipeline |
| GitHub Pages | Hosting |

---

## Project Structure

```
rkjat.in/
├── src/                          # Source files (edit these!)
│   ├── index.html                # Homepage
│   ├── about.html                # About page
│   ├── contact.html              # Contact page
│   ├── gallery.html              # Image gallery page
│   │
│   ├── blog/                     # Blog pages
│   │   ├── index.html            # Blog listing page
│   │   ├── Russia.html           # Individual blog posts
│   │   ├── deepfake.html
│   │   └── ...
│   │
│   ├── portfolio/                # Portfolio pages
│   │   └── index.html            # Portfolio listing
│   │
│   ├── components/               # Handlebars partials (reusable HTML)
│   │   ├── head.hbs              # <head> content for regular pages
│   │   ├── blog-head.hbs         # <head> content for blog posts
│   │   ├── nav.hbs               # Navigation bar
│   │   ├── footer.hbs            # Footer
│   │   ├── analytics.hbs         # Google Analytics script
│   │   ├── social-links.hbs      # Social media links
│   │   └── blog-share.hbs        # Blog sharing section
│   │
│   ├── css/                      # Stylesheets
│   │   ├── style.css             # Main styles (all pages)
│   │   ├── gallery.css           # Gallery-specific styles
│   │   └── blog.css              # Blog article styles
│   │
│   ├── ts/                       # TypeScript source
│   │   ├── main.ts               # Main page entry point
│   │   ├── gallery-page.ts       # Gallery page entry point
│   │   ├── blog-page.ts          # Blog page entry point
│   │   │
│   │   ├── modules/              # Reusable TypeScript modules
│   │   │   ├── theme.ts          # Dark/light theme switching
│   │   │   ├── navigation.ts     # Mobile nav, scroll effects
│   │   │   ├── gallery.ts        # Gallery lightbox & filtering
│   │   │   ├── canvas.ts         # Particle animation
│   │   │   ├── content.ts        # Dynamic content loading
│   │   │   ├── share.ts          # Social sharing
│   │   │   ├── form.ts           # Contact form handling
│   │   │   ├── blog-article.ts   # Blog scroll animations
│   │   │   ├── utils.ts          # Utility functions
│   │   │   ├── constants.ts      # Configuration constants
│   │   │   └── types.ts          # TypeScript type definitions
│   │   │
│   │   └── test/                 # Test setup
│   │       └── setup.ts
│   │
│   ├── data/                     # JSON data files
│   │   └── gallery.json          # Gallery images data
│   │
│   ├── images/                   # Image assets
│   │   ├── profilepic.png        # Profile picture
│   │   ├── RussiaR/              # Russia blog images
│   │   ├── Gemini/               # Gemini blog images
│   │   └── Sam/                  # Sam Altman blog images
│   │
│   └── favicon/                  # Favicon files
│
├── dist/                         # Built files (auto-generated)
├── scripts/                      # Build scripts
│   └── optimize-images.js        # Image optimization script
│
├── .github/workflows/            # GitHub Actions
│   └── ci.yml                    # CI/CD pipeline
│
├── content-index.json            # Blog posts & projects data
├── vite.config.ts                # Vite configuration
├── tsconfig.json                 # TypeScript configuration
├── vitest.config.ts              # Test configuration
├── package.json                  # Dependencies & scripts
└── .eslintrc.json                # ESLint configuration
```

---

## Quick Reference Commands

### Development

```bash
# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Testing

```bash
# Run tests in watch mode
npm run test

# Run tests once with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### Code Quality

```bash
# Run ESLint
npm run lint

# Fix ESLint errors automatically
npm run lint:fix

# Format code with Prettier
npm run format

# Type check without building
npm run typecheck
```

### Utilities

```bash
# Optimize images (convert to WebP)
npm run optimize:images

# Clean build folder
npm run clean

# Deploy to GitHub Pages
npm run deploy
```

---

## How to Add New Content

### Adding a New Blog Post

#### Step 1: Create the HTML file

Create a new file in `src/blog/` (e.g., `src/blog/my-new-post.html`):

```html
<!DOCTYPE html>
<html lang="en">
<head>
  {{> blog-head
    title="Your Blog Title"
    description="A brief description for SEO (150-160 chars)"
    keywords="keyword1, keyword2, keyword3"
    author="Your Name"
    image="images/your-image.png"
    url="blog/my-new-post.html"
    publishedDate="2024-12-24T00:00:00Z"
    modifiedDate="2024-12-24T00:00:00Z"
    category="Technology"
    tags="Tag1,Tag2,Tag3"
  }}
</head>

<body>
  <a href="#main-content" class="skip-link">Skip to main content</a>
  <div class="progress-bar"></div>

  {{> nav isBlog=true}}

  <header class="blog-header animate-header">
    <h1>Your Blog Title</h1>
    <p>Subtitle or description</p>
  </header>

  <article class="blog-article" id="main-content">
    <div class="meta-info">
      <span>Published: December 24, 2024</span>
      <span>Read Time: <span class="read-time">5</span> minutes</span>
      <span>Category</span>
    </div>

    <!-- Your content here -->
    <h2>Section Heading</h2>
    <p class="animate-on-scroll">Your paragraph text...</p>

    <div class="key-points animate-on-scroll">
      <h4>Key Points</h4>
      <ul>
        <li>Point 1</li>
        <li>Point 2</li>
      </ul>
    </div>

    {{> blog-share shareUrl="blog/my-new-post.html" shareTitle="Your Blog Title"}}
  </article>

  <button class="back-to-top" id="backToTop" aria-label="Back to top">&#8593;</button>

  {{> footer}}

  <script type="module" src="/ts/blog-page.ts"></script>
</body>
</html>
```

#### Step 2: Add to Vite config

Edit `vite.config.ts` and add your new page:

```typescript
input: {
  // ... existing pages
  blogMyNewPost: resolve(__dirname, 'src/blog/my-new-post.html'),
},
```

#### Step 3: Add to content-index.json

Add your blog to the blogs array in `content-index.json`:

```json
{
  "id": "my-new-post",
  "title": "Your Blog Title",
  "description": "Brief description",
  "date": "2024-12-24",
  "category": "Technology",
  "readTime": "5 min",
  "tags": ["Tag1", "Tag2"],
  "image": "images/your-image.png",
  "link": "blog/my-new-post.html"
}
```

#### Step 4: Add images

Place your blog images in `src/images/YourBlogFolder/`

---

### Adding a New Project

#### Step 1: Add to content-index.json

Add your project to the projects array:

```json
{
  "id": "my-project",
  "title": "Project Title",
  "description": "Project description",
  "date": "2024-12-24",
  "tags": ["Python", "Data Analysis"],
  "image": "images/projects/my-project.png",
  "link": "https://github.com/yourrepo",
  "featured": true
}
```

#### Step 2: Add project image

Place the project thumbnail in `src/images/projects/`

**Note:** Projects with `"featured": true` appear on the homepage.

---

### Adding Gallery Images

Edit `src/data/gallery.json`:

```json
{
  "id": 100,
  "image": "images/gallery/your-image.png",
  "category": "visualization",
  "caption": "Image description"
}
```

**Categories:** visualization, analysis, dashboard, ai, other

---

### Adding a New Page

#### Step 1: Create the HTML file

```html
<!DOCTYPE html>
<html lang="en">
<head>
  {{> head title="Page Title" description="Page description"}}
</head>

<body>
  <a href="#main-content" class="skip-link">Skip to main content</a>

  {{> nav}}

  <main id="main-content">
    <!-- Your content -->
  </main>

  {{> footer}}

  <script type="module" src="/ts/main.ts"></script>
</body>
</html>
```

#### Step 2: Add to Vite config

```typescript
input: {
  // ... existing pages
  myNewPage: resolve(__dirname, 'src/my-new-page.html'),
},
```

---

## File Reference Guide

### Configuration Files

| File | Purpose | When to Edit |
|------|---------|--------------|
| `vite.config.ts` | Build config, page entries | Adding new pages |
| `tsconfig.json` | TypeScript settings | Rarely |
| `package.json` | Dependencies, scripts | Adding packages |
| `.eslintrc.json` | Linting rules | Adjusting code style |
| `.prettierrc` | Code formatting | Adjusting formatting |
| `vitest.config.ts` | Test configuration | Test settings |

### Content Files

| File | Purpose | When to Edit |
|------|---------|--------------|
| `content-index.json` | Blog posts & projects list | Adding content |
| `src/data/gallery.json` | Gallery images | Adding gallery images |

### Style Files

| File | Purpose | Key Sections |
|------|---------|--------------|
| `src/css/style.css` | Main styles | Variables, nav, footer, buttons, cards |
| `src/css/gallery.css` | Gallery page | Grid, lightbox, filters |
| `src/css/blog.css` | Blog articles | Typography, boxes, animations |

### TypeScript Modules

| Module | Purpose |
|--------|---------|
| `theme.ts` | Dark/light mode toggle |
| `navigation.ts` | Mobile menu, scroll behavior |
| `gallery.ts` | Lightbox, filtering, pagination |
| `canvas.ts` | Particle background animation |
| `content.ts` | Load projects/blogs from JSON |
| `share.ts` | Social media sharing |
| `form.ts` | Contact form validation |
| `blog-article.ts` | Scroll animations, progress bar |
| `utils.ts` | Helper functions (debounce, throttle, etc.) |

### Handlebars Partials

| Partial | Purpose | Parameters |
|---------|---------|------------|
| `head.hbs` | Regular page `<head>` | `title`, `description`, `extraCss` |
| `blog-head.hbs` | Blog page `<head>` | `title`, `description`, `keywords`, `image`, `url`, `publishedDate`, `category`, `tags` |
| `nav.hbs` | Navigation bar | `isHome`, `isAbout`, `isPortfolio`, `isBlog`, `isGallery`, `isContact` |
| `footer.hbs` | Page footer | None |
| `blog-share.hbs` | Blog share section | `shareUrl`, `shareTitle` |
| `analytics.hbs` | Google Analytics | None (uses `analyticsId` from config) |

---

## Styling Guide

### CSS Variables (Theme)

Located in `src/css/style.css`:

```css
:root {
  /* Colors */
  --primary: #0071e3;
  --primary-hover: #0077ed;
  --bg: #ffffff;
  --bg-secondary: #f5f5f7;
  --text: #1d1d1f;
  --text-secondary: #6e6e73;
  --border: #d2d2d7;

  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.1);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 25px rgba(0,0,0,0.1);

  /* Z-Index Scale */
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-modal: 300;
  --z-tooltip: 400;
}

/* Dark mode overrides */
[data-theme="dark"] {
  --bg: #1d1d1f;
  --bg-secondary: #2d2d2f;
  --text: #f5f5f7;
  /* ... */
}
```

### Blog Article Classes

Use these classes in blog posts:

```html
<!-- Highlight box (blue) -->
<div class="intro-box animate-on-scroll">
  <p>Important introduction text...</p>
</div>

<!-- Key points list (green) -->
<div class="key-points animate-on-scroll">
  <h4>Key Points</h4>
  <ul>
    <li>Point 1</li>
    <li>Point 2</li>
  </ul>
</div>

<!-- Info block (neutral) -->
<div class="info-block animate-on-scroll">
  <h4>Information</h4>
  <p>Details here...</p>
</div>

<!-- Warning box (red) -->
<div class="warning-box animate-on-scroll">
  <h4>Warning</h4>
  <p>Caution text...</p>
</div>

<!-- Quote -->
<div class="quote-block animate-on-scroll">
  "Quote text here..."
</div>

<!-- Statistics -->
<div class="stats-box animate-on-scroll">
  <div class="stat-item">
    <div class="stat-number">100</div>
    <div class="stat-label">Label</div>
  </div>
</div>

<!-- Call to action -->
<div class="cta-box animate-on-scroll">
  <h3>Title</h3>
  <p>Call to action text...</p>
</div>

<!-- Image wrapper -->
<div class="image-wrapper animate-on-scroll">
  <img src="/images/your-image.png" alt="Description" loading="lazy">
</div>

<!-- Text colors -->
<span class="blue-text">Blue text</span>
<span class="green-text">Green text</span>
<span class="red-text">Red text</span>
<span class="orange-text">Orange text</span>
<span class="highlight-text">Highlighted text</span>
```

---

## Component System

### Using Handlebars Partials

Partials are reusable HTML snippets. Use them with `{{> partialName}}`:

```html
<!-- Include navigation -->
{{> nav isHome=true}}

<!-- Include with parameters -->
{{> head title="My Page" description="Page description"}}

<!-- Include footer -->
{{> footer}}
```

### Creating a New Partial

1. Create file in `src/components/` (e.g., `my-partial.hbs`)
2. Add HTML content with optional parameters:

```handlebars
<!-- src/components/my-partial.hbs -->
<div class="my-component">
  <h2>{{title}}</h2>
  {{#if showButton}}
    <button>Click me</button>
  {{/if}}
</div>
```

3. Use it in your HTML:

```html
{{> my-partial title="Hello" showButton=true}}
```

---

## Deployment

### Automatic Deployment (Recommended)

Push to `master` branch → GitHub Actions automatically:
1. Runs ESLint
2. Runs TypeScript check
3. Runs unit tests
4. Builds the project
5. Deploys to GitHub Pages

### Manual Deployment

```bash
npm run deploy
```

This builds and pushes to the `gh-pages` branch.

### Deployment Checklist

- [ ] All tests pass (`npm run test -- --run`)
- [ ] Build succeeds (`npm run build`)
- [ ] No TypeScript errors (`npm run typecheck`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] Content-index.json is valid JSON
- [ ] All images are in `src/images/`
- [ ] New pages added to `vite.config.ts`

---

## Troubleshooting

### Common Issues

#### Build fails with "Cannot find module"
- Check if the file path in `vite.config.ts` is correct
- Run `npm install` to ensure dependencies are installed

#### Styles not updating
- Clear browser cache (Ctrl+Shift+R)
- Check if CSS file is imported correctly

#### Handlebars partial not found
- Verify the file is in `src/components/`
- Check the partial name matches the filename (without .hbs)

#### Images not showing
- Use absolute paths starting with `/` (e.g., `/images/photo.png`)
- Check file exists in `src/images/`

#### TypeScript errors
- Run `npm run typecheck` to see all errors
- Check import paths are correct

#### Tests failing
- Run `npm run test` to see detailed errors
- Check if mocks in `src/ts/test/setup.ts` are correct

### Useful Debug Commands

```bash
# Check for TypeScript errors
npm run typecheck

# Check for lint errors
npm run lint

# Test build without deploying
npm run build && npm run preview

# Check if JSON is valid
node -e "require('./content-index.json')"
```

---

## Quick Cheat Sheet

### Add Blog Post
1. Create `src/blog/filename.html` (use template above)
2. Add entry to `vite.config.ts`
3. Add entry to `content-index.json`
4. Add images to `src/images/`

### Add Project
1. Add entry to `content-index.json` (projects array)
2. Add image to `src/images/projects/`

### Add Gallery Image
1. Add image to `src/images/gallery/`
2. Add entry to `src/data/gallery.json`

### Change Colors
Edit CSS variables in `src/css/style.css` (`:root` section)

### Change Site Name/Info
Edit `vite.config.ts` → `context` object:
```typescript
context: {
  year: new Date().getFullYear(),
  siteName: 'RKJat',
  siteUrl: 'https://rkjat.in',
  analyticsId: 'G-4V7XW1QPZ8',
},
```

### Update Social Links
Edit `src/components/footer.hbs` and `src/components/blog-share.hbs`

---

## Contact & Support

- **Website:** https://rkjat.in
- **GitHub:** https://github.com/rkjat65
- **Twitter:** @rkjat65

---

*Last updated: December 2024*
