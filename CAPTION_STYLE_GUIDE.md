# Gallery Caption Style Guide

## ✅ What Changed

Your gallery now features:
- **Enhanced captions** with professional formatting and colors
- **Always visible** captions below images (no click required)
- **Two-line limit** with ellipsis for long text
- Click image to see full caption in lightbox

## Color Scheme Used

### Primary Colors
- **Blue (#0071e3)**: Your brand primary - for important stats/highlights
- **Green (#34c759)**: Success/positive metrics - growth, wins, achievements
- **Orange (#ff9500)**: Attention/special mentions - notable players/facts
- **Red (#ff3b30)**: Critical/declining metrics - concerns, drops

### Usage Examples

```html
<!-- Player Names / Key Subjects -->
<b style='color:#0071e3'>Player Name</b>

<!-- Positive Stats / Achievements -->
<span style='color:#34c759'>Record Number</span>

<!-- Special Mentions / Notable -->
<b style='color:#ff9500'>Nickname</b>

<!-- Concerns / Declining -->
<span style='color:#ff3b30'>Negative Trend</span>

<!-- Emphasis without color -->
<b>Important Term</b>
<i>descriptive phrase</i>
```

## Your Enhanced Captions

### Cricket Category (5 images)
1. **Rohit Sharma 6s**: Blue name, green stat (positive achievement)
2. **MoM Awards**: Orange nickname, blue achievement
3. **Kohli T20**: Red name (King theme), green milestone
4. **ODI 2025**: Bold title, blue italic generation
5. **Chase Masters**: Orange & blue players, green prowess

### Economics Category (6 images)
6. **Tesla**: Blue stat (economy rank), italic context
7. **Currency**: Green stability, red struggle
8. **Tax Givers**: Blue title, italic impact
9. **Tax Receivers**: Green title, italic pattern
10. **Rupee**: Orange title, red milestone
11. **15th FC**: Blue italic formula

### Social Category (1 image)
12. **AI Index**: Blue country, green stat

## Caption Writing Tips

### Structure
1. **Lead**: Bold key subject/player/country
2. **Stat**: Colored span for numbers/achievements
3. **Context**: Italic for descriptive context

### Best Practices
✓ Keep under 80 characters for 2-line display
✓ Use colors to highlight key data points
✓ Bold for names and titles
✓ Italic for context and commentary
✓ One main color per caption (avoid rainbow effect)

### Examples

**Good:**
```json
"<b style='color:#0071e3'>India</b> achieves <span style='color:#34c759'>8.2% GDP growth</span> in <i>Q3 2024</i>"
```

**Avoid:**
```json
"<b style='color:red'>India</b> <span style='color:blue'>achieves</span> <span style='color:green'>8.2%</span> <span style='color:orange'>GDP</span>"
```
(Too many colors)

## Quick Reference

| Element | Tag | When to Use |
|---------|-----|-------------|
| **Bold** | `<b>` | Names, titles, key subjects |
| **Colored Bold** | `<b style='color:#hex'>` | Featured players, countries |
| **Span Color** | `<span style='color:#hex'>` | Stats, numbers, metrics |
| **Italic** | `<i>` | Context, descriptions, commentary |
| **Colored Italic** | `<i style='color:#hex'>` | Subtle emphasis with context |

## Color Psychology

- **Blue (#0071e3)**: Trust, authority, primary focus
- **Green (#34c759)**: Growth, success, positive trends
- **Orange (#ff9500)**: Energy, excitement, attention
- **Red (#ff3b30)**: Urgency, decline, critical points

## Updating Captions

Edit `gallery-data.json`:

```json
{
  "id": 13,
  "image": "/images/gallery/new-viz.jpg",
  "category": "Cricket",
  "caption": "<b style='color:#0071e3'>Your Title:</b> Key <span style='color:#34c759'>metric</span> with <i>context</i>"
}
```

## Current Stats

- **Total Images**: 12
- **Cricket**: 5 images
- **Economics**: 6 images
- **Social**: 1 image
- **All captions**: Enhanced with formatting and colors
- **Display**: 2 lines max, click to see full text

Your gallery is now professional, informative, and visually engaging! 🎨
