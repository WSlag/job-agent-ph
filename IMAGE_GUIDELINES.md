# 📸 Job Image Guidelines

## Recommended Image Specifications

### Optimal Size
**4 inches x 2.1 inches** (1200 x 630 pixels at 300 DPI)

This is the best size for job images because:
- ✅ Looks great on desktop and mobile devices
- ✅ Matches social media sharing standards (Open Graph)
- ✅ Fast loading with good quality
- ✅ Sharp on retina/high-DPI displays
- ✅ Easy to remember and create

---

## Technical Requirements

| Specification | Value |
|--------------|-------|
| **Recommended Dimensions** | 4" x 2.1" (1200 x 630 pixels) |
| **Aspect Ratio** | 1.91:1 (landscape) |
| **Resolution** | 300 DPI (print quality) |
| **File Format** | JPG (preferred) or PNG |
| **Maximum File Size** | 5 MB |
| **Minimum Dimensions** | 2.7" x 1.4" (800 x 420 pixels) |
| **Maximum Dimensions** | 8" x 4.2" (2400 x 1260 pixels) |

---

## Alternative Aspect Ratios

If you prefer different formats:

### Wide Banner (16:9)
- **Dimensions:** 4" x 2.25" (1200 x 675 pixels)
- **Use case:** Cinematic, professional shots
- **Example:** Office environments, team photos

### Standard (4:3)
- **Dimensions:** 4" x 3" (1200 x 900 pixels)
- **Use case:** More square format, shows more vertical content
- **Example:** Portrait-oriented subjects

### Social Media Banner (2:1)
- **Dimensions:** 4" x 2" (1200 x 600 pixels)
- **Use case:** Twitter/X header style
- **Example:** Wide landscape shots

---

## Image Best Practices

### ✅ DO
- Use high-quality, professional images
- Show relevant workplace environments
- Include people in work settings (with permission)
- Use proper lighting and clear focus
- Compress images before upload (use tools like TinyPNG)
- Test how images look on both mobile and desktop

### ❌ DON'T
- Use blurry or pixelated images
- Include watermarks or logos from stock sites
- Use images that don't relate to the job
- Upload unnecessarily large files (slows down page)
- Use dark images that make text hard to read

---

## Image Content Suggestions by Job Type

### Office/Professional Jobs
- Modern office spaces
- Professional meetings
- Team collaboration
- Clean, bright environments

### Healthcare Jobs
- Medical facilities (without patient identities)
- Healthcare professionals in scrubs
- Clean, professional medical settings

### Construction/Labor Jobs
- Construction sites
- Safety equipment
- Workers in action (with PPE)
- Completed projects

### Hospitality/Service Jobs
- Hotels, restaurants, or service venues
- Customer service interactions
- Clean, welcoming environments

### Domestic Helper/Household Jobs
- Clean, organized home environments
- Professional appearance
- Task-related images (cleaning, organizing)

---

## Free Stock Photo Resources

If agencies don't have custom photos:

1. **[Unsplash](https://unsplash.com/)** - Free high-quality images
2. **[Pexels](https://www.pexels.com/)** - Free stock photos
3. **[Pixabay](https://pixabay.com/)** - Free images and videos
4. **[Burst by Shopify](https://burst.shopify.com/)** - Free business photos

### Search Terms to Try:
- "office professional"
- "construction worker"
- "healthcare professional"
- "hospitality service"
- "team meeting"
- "workplace environment"

---

## Image Optimization Tools

Before uploading, optimize images:

1. **[TinyPNG](https://tinypng.com/)** - Compress PNG/JPG (free)
2. **[Squoosh](https://squoosh.app/)** - Google's image optimizer
3. **[Compressor.io](https://compressor.io/)** - Online compression
4. **[ImageOptim](https://imageoptim.com/)** - Mac app (free)

---

## How Images Display

### Desktop View
- Large hero image at top of job listing
- Full width container with rounded corners
- Height: ~400-600px depending on aspect ratio

### Mobile View
- Full-width responsive image
- Automatically scales down
- Height: ~200-300px
- Still maintains aspect ratio

### Job Cards (Browse Page)
- Thumbnail view
- Width: 100% of card
- Height: Fixed at ~200px
- Image is cropped to fit if needed

---

## Current Implementation

### Upload Restrictions (Set in Code)
```typescript
// From storage.rules
- Maximum file size: 5 MB
- Allowed types: image/* (JPG, PNG, WEBP, etc.)
- Auto-generates unique filename with timestamp
```

### Image Display (Set in Components)
```typescript
// Job detail page
<Image
  src={job.imageUrl}
  fill
  className="object-cover"
  priority
/>

// Job cards
<Image
  src={job.imageUrl}
  fill
  className="object-cover"
/>
```

---

## For Agencies: Quick Checklist

Before uploading a job image:

- [ ] Image is at least 4" x 2.1" (1200 x 630 pixels)
- [ ] File size is under 5 MB
- [ ] Image is relevant to the job
- [ ] Image is professional and high-quality
- [ ] No watermarks or copyright issues
- [ ] Image has been compressed/optimized
- [ ] Tested on mobile preview (if possible)

---

## Need Help?

If agencies have questions about images:
1. Refer them to this guide
2. Suggest free stock photo sites
3. Recommend image optimization tools
4. Show examples of good job images

---

**Last Updated:** 2025-10-23
