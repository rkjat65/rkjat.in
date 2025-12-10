# Image Gallery Setup Guide

## Overview
Your new image gallery page is now ready! It features:
- Professional masonry/grid layouts
- Rich caption editing (bold, italic, colors)
- Category filtering
- Lightbox view with navigation
- Fully responsive design
- Dark/light mode support

## File Structure
```
rkjat.in/
├── gallery.html              # Main gallery page
├── gallery-data.json          # Gallery configuration
├── css/
│   └── gallery.css           # Gallery-specific styles
├── js/
│   └── gallery.js            # Gallery functionality
└── images/
    └── gallery/              # Your visualization images
        ├── viz1.png
        ├── viz2.png
        └── ...
```

## Setup Instructions

### 1. Create Image Folder
Create a folder for your gallery images:
```bash
mkdir -p images/gallery
```

### 2. Add Your Images
- Place your visualization images in `/images/gallery/`
- **Recommended format**: Square (1:1 aspect ratio) for best results
- **Suggested size**: 800x800px or 1200x1200px
- **Format**: PNG for crisp data visualizations
- **Naming**: Use descriptive names like `gdp-growth-2024.png`

### 3. Configure Gallery Data
Edit `gallery-data.json` to add your images:

```json
[
  {
    "id": 1,
    "image": "/images/gallery/your-image-name.png",
    "category": "economics",
    "defaultCaption": "Your caption here"
  }
]
```

**Categories available:**
- `economics` - Economic data visualizations
- `politics` - Political analysis charts
- `social` - Social indicators
- `healthcare` - Health statistics

### 4. Update Navigation
The gallery link has been added to the navigation. To update other pages, add this to their navigation:
```html
<li><a href="/gallery.html">Gallery</a></li>
```

## Usage Guide

### For Visitors
1. **Browse**: View all visualizations in grid or masonry layout
2. **Filter**: Click category buttons to filter by topic
3. **View Details**: Click any image to open lightbox
4. **Navigate**: Use arrows or keyboard (←/→) to browse

### For You (Admin)
1. **Edit Captions**:
   - Click any image to open lightbox
   - Edit caption text in the editor
   - Use toolbar for formatting:
     - **Bold** button or Ctrl+B
     - *Italic* button or Ctrl+I
     - Color picker for text color
   - Click "Save Caption" to persist changes

2. **Add New Images**:
   - Upload image to `/images/gallery/`
   - Add entry to `gallery-data.json`
   - Refresh page - image appears automatically

3. **Caption Storage**:
   - Captions are saved in browser's localStorage
   - Persist across sessions
   - Can be exported (see Advanced section)

## Features Explained

### Responsive Design
- **Desktop**: 4-column grid or masonry layout
- **Tablet**: 3-column layout
- **Mobile**: 2-column grid, 1-column masonry

### Caption Editor
- **Rich Text**: Bold, italic formatting
- **Colors**: Choose any color for text highlights
- **Auto-save**: Captions saved to localStorage
- **Persistent**: Your edits remain across visits

### Lightbox
- **Keyboard Navigation**: ESC to close, arrows to navigate
- **Touch Gestures**: Swipe on mobile devices
- **Image Protection**: Right-click disabled (optional)

## Advanced Customization

### Changing Colors
Edit `css/gallery.css` to match your brand:
```css
/* Change primary accent color */
.filter-btn.active {
  background: #YOUR_COLOR;
}
```

### Adding New Categories
1. Add category to filter buttons in `gallery.html`:
```html
<button class="filter-btn" data-filter="newcategory">New Category</button>
```

2. Use category in `gallery-data.json`:
```json
{
  "id": 11,
  "category": "newcategory",
  ...
}
```

### Exporting Captions
To backup or share captions, run in browser console:
```javascript
console.log(localStorage.getItem('gallery-captions'));
// Copy output to save
```

To import captions:
```javascript
localStorage.setItem('gallery-captions', 'YOUR_SAVED_DATA');
```

### SEO Optimization
Add to each gallery item for better SEO:
```json
{
  "id": 1,
  "image": "/images/gallery/viz1.png",
  "category": "economics",
  "defaultCaption": "GDP Growth Analysis",
  "alt": "Bar chart showing India's GDP growth from 2015-2024",
  "keywords": ["gdp", "economics", "growth"]
}
```

## Performance Tips

### Image Optimization
1. **Compress**: Use tools like TinyPNG or ImageOptim
2. **WebP Format**: Convert PNGs to WebP for smaller size
3. **Lazy Loading**: Already implemented in code
4. **CDN**: Host images on CDN for faster loading

### Gallery Size
- Optimal: 20-50 images per page
- If more: Consider pagination or infinite scroll
- Very large galleries: Split into multiple pages

## Troubleshooting

### Images Not Showing
1. Check image path in `gallery-data.json`
2. Verify images exist in `/images/gallery/`
3. Check browser console for errors
4. Ensure web server is running

### Captions Not Saving
1. Check browser localStorage is enabled
2. Try incognito/private mode
3. Clear localStorage and try again:
   ```javascript
   localStorage.clear();
   ```

### Layout Issues
1. Clear browser cache (Ctrl+Shift+R)
2. Check `gallery.css` is loading
3. Verify no CSS conflicts with other pages

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements
Consider adding:
- [ ] Batch caption export/import
- [ ] Image upload interface
- [ ] Search functionality
- [ ] Pagination for large galleries
- [ ] Share buttons per image
- [ ] Download original image button
- [ ] Image metadata display

## Questions?
If you need help customizing or extending the gallery, feel free to ask!

## License
This gallery is part of your DAwithRK website. Feel free to modify as needed.
