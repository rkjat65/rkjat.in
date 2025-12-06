# 📚 Content Management Guide

Your website now features **automatic dynamic content loading**! The homepage will always display your latest projects and blog posts automatically.

## 🎯 How It Works

The homepage reads from a single JSON file ([content-index.json](content-index.json)) and automatically displays:
- **Latest 2 Projects** in the "Featured Projects" section
- **Latest 3 Blog Posts** in the "Latest Insights" section

Content is sorted by date automatically, so the newest items always appear first!

## ✏️ How to Add New Content

### Adding a New Blog Post

1. Create your blog post HTML file (e.g., `blog/my-new-post.html`)
2. Open [content-index.json](content-index.json)
3. Add a new entry to the `blogs` array:

```json
{
  "id": "my-new-post",
  "title": "My Awesome New Blog Post",
  "description": "A brief description of what this post is about (1-2 sentences)",
  "date": "2024-12-15",
  "tags": ["Data Analysis", "Python", "Tutorial"],
  "category": "Technical",
  "readTime": "8 min",
  "image": "blog/my-post-image.jpg",
  "link": "blog/my-new-post.html",
  "featured": true
}
```

4. Save the file - your homepage will automatically show the new post!

### Adding a New Project

1. Create your project page (e.g., `portfolio/my-project/index.html`)
2. Open [content-index.json](content-index.json)
3. Add a new entry to the `projects` array:

```json
{
  "id": "my-new-project",
  "title": "My Amazing Data Project",
  "description": "What this project does and why it's cool",
  "date": "2024-12-15",
  "tags": ["Python", "SQL", "Tableau"],
  "image": "portfolio/my-project/preview.png",
  "link": "portfolio/my-project/",
  "featured": true
}
```

4. Save the file - your homepage will automatically show the new project!

## 📝 Field Explanations

### Required Fields (Both Projects and Blogs)

- **id**: Unique identifier (use lowercase with hyphens)
- **title**: Display title
- **description**: Short description (1-2 sentences)
- **date**: Publication date in `YYYY-MM-DD` format (determines sort order!)
- **tags**: Array of relevant tags
- **link**: Relative path to the content (e.g., `blog/my-post.html`)
- **featured**: `true` or `false` (currently not used but reserved for future features)

### Blog-Specific Fields

- **category**: Blog category (e.g., "Geopolitics", "Current Affairs", "Technical")
- **readTime**: Estimated reading time (e.g., "5 min", "10 min")
- **image**: Path to blog thumbnail/hero image (optional)

### Project-Specific Fields

- **image**: Path to project preview image (required for visual display)

## 🔄 Current Content in the System

### Projects (3 total)
1. Indian Healthcare System Analysis (Nov 15, 2024)
2. Indian Legislature Analysis (Oct 20, 2024)
3. India Economic Pulse Dashboard (Sep 10, 2024)

### Blog Posts (3 total)
1. India-Russia Strategic Partnership (Dec 6, 2024)
2. Privacy in a 'Fishbowl Society': India's Deepfake Crisis (Dec 5, 2024)
3. Why Is There No Peace in Ukraine? (Dec 1, 2024)

## 💡 Pro Tips

1. **Keep dates accurate**: The `date` field determines the order - newer dates appear first
2. **Use meaningful descriptions**: These show up on the homepage preview cards
3. **Optimize images**: Use compressed images for faster loading
4. **Update regularly**: Simply edit the JSON file and the homepage updates automatically
5. **Test after changes**: Always check the homepage after updating the JSON

## 🚀 Advanced Usage

### Want to show more items?

Edit [js/main.js](js/main.js):
- Line 303: `.slice(0, 2)` → Change `2` to show more projects
- Line 328: `.slice(0, 3)` → Change `3` to show more blog posts

### Want different sorting?

The content is currently sorted by `date` (newest first). To change this, edit the sort function in [js/main.js](js/main.js).

## ❓ Troubleshooting

**Homepage showing "Loading..." forever?**
- Check that [content-index.json](content-index.json) is valid JSON (use a JSON validator)
- Check browser console for errors (F12 → Console tab)
- Ensure the JSON file path is correct

**New content not appearing?**
- Verify the `date` field is in `YYYY-MM-DD` format
- Make sure the `date` is newer than existing content
- Clear browser cache and refresh (Ctrl+Shift+R)

**Images not loading?**
- Check that the `image` path is correct and relative to the site root
- Ensure the image file actually exists at that path

---

🎉 **That's it!** You now have a modern, automatically updating homepage. Just edit one JSON file and everything updates!
