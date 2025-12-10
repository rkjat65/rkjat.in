# Gallery Quick Start Guide

## Get Started in 3 Steps

### Step 1: Add Your Images
1. Place your square visualization images in `/images/gallery/`
2. Best format: PNG, 800x800px or larger
3. Name them descriptively (e.g., `gdp-trends-2024.png`)

### Step 2: Update Gallery Data
Edit `gallery-data.json` and add your images:

```json
{
  "id": 1,
  "image": "/images/gallery/your-image.png",
  "category": "economics",
  "caption": "Your caption here (supports HTML: <b>bold</b>, <i>italic</i>, <span style='color:red'>colored text</span>)"
}
```

**Categories:**
- `economics` - Economic visualizations
- `politics` - Political data
- `social` - Social indicators
- `healthcare` - Health statistics

### Step 3: Access Your Gallery
Open `https://rkjat.in/gallery.html` in your browser

## Caption Formatting

You can add rich formatting to captions using HTML:

```json
{
  "caption": "India's <b>GDP Growth</b> from 2015-2024 showing <i>steady recovery</i> with <span style='color:#0071e3'>8.2% growth</span> in 2024"
}
```

**Formatting options:**
- `<b>text</b>` - Bold text
- `<i>text</i>` - Italic text
- `<span style='color:#hex'>text</span>` - Colored text
- Combine multiple formats for rich captions

## Social Sharing

Each image automatically includes share buttons for:
- Twitter/X (with hashtags)
- LinkedIn
- Facebook
- WhatsApp
- Copy Link

Visitors can share any visualization with one click!

## Pagination

The gallery automatically paginates:
- Shows 12 images per page
- Smart navigation with page numbers
- Previous/Next buttons
- Filters reset to page 1

To change items per page, edit `gallery.js`:
```javascript
this.itemsPerPage = 12; // Change this number
```

## Image Recommendations

### Size & Format
- **Dimensions**: 800x800px minimum (square)
- **Format**: PNG for charts, WebP for photos
- **File size**: Under 500KB (compress if needed)

### Best Practices
- Keep aspect ratio 1:1 (square)
- Use high contrast for readability
- Include title/legend in the image
- Test on mobile devices

## Adding New Images

Just add new entries to `gallery-data.json`:

```json
{
  "id": 11,
  "image": "/images/gallery/new-viz.png",
  "category": "social",
  "caption": "Your <b>formatted</b> caption here"
}
```

The gallery updates automatically!

## Tips

- Start with 10-20 images
- Group by category for easy filtering
- Write clear, descriptive captions
- Use HTML formatting for emphasis
- Test both light and dark modes
- Monitor page load times

## Example Entry with Formatting

```json
{
  "id": 1,
  "image": "/images/gallery/india-gdp-growth.png",
  "category": "economics",
  "caption": "<b>India's GDP Growth (2015-2024)</b><br>Steady upward trajectory with <span style='color:#34c759'>8.2% growth</span> in 2024, showing <i>strong post-pandemic recovery</i>"
}
```

## Key Features

✓ Admin-only captions (controlled via JSON)
✓ Social sharing on every image
✓ Automatic pagination (12 per page)
✓ Category filtering
✓ Grid/Masonry view toggle
✓ Lightbox with keyboard navigation
✓ Mobile responsive
✓ Dark/Light mode support

That's it! Your professional image gallery is ready to showcase your data visualizations.
