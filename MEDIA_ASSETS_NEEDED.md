# 🎬 Media Assets Needed

## Overview
The theme configurations reference media files that need to be added to make backgrounds, galleries, and visuals complete.

## Directory Structure Needed

```
public/
├── media/
│   ├── elephant/          # White Elephant Party theme assets
│   │   ├── snow-bg.mp4    # Hero background video (looping snow/Christmas scene)
│   │   ├── presents.jpg   # Fallback image for hero
│   │   ├── elf-lights.jpg # Gallery image
│   │   └── party-group.jpg # Gallery image
│   │
│   └── heist/             # Great Gift Heist theme assets
│       ├── hero-bg.mp4    # Cinematic heist/vault video background
│       ├── vault-bg.jpg   # Fallback image
│       ├── gift-pile.jpg  # Gallery image
│       └── crew-photo.jpg # Gallery image
│
└── gallery/               # Last year's party photos/videos
    ├── 2024-1.jpg
    ├── 2024-2.jpg
    ├── 2024-3.jpg
    ├── 2024-4.jpg
    ├── 2024-video-1.mp4
    ├── 2024-video-2.mp4
    └── thumbs/            # Thumbnail versions for performance
        ├── 2024-1.jpg
        ├── 2024-2.jpg
        ├── 2024-3.jpg
        ├── 2024-4.jpg
        ├── 2024-video-1-thumb.jpg
        └── 2024-video-2-thumb.jpg
```

## Where Media is Referenced

### White Elephant Theme (`src/themes/whiteElephantTheme.js`)
```javascript
media: {
  heroBg: "/media/elephant/snow-bg.mp4",
  heroFallback: "/media/elephant/presents.jpg",
  gallery: [
    "/media/elephant/presents.jpg",
    "/media/elephant/elf-lights.jpg",
    "/media/elephant/party-group.jpg",
  ]
}
```

### Great Gift Heist Theme (`src/themes/greatGiftHeistTheme.js`)
```javascript
media: {
  heroBg: "/media/heist/hero-bg.mp4",
  heroFallback: "/media/heist/vault-bg.jpg",
  gallery: [
    "/media/heist/vault-bg.jpg",
    "/media/heist/gift-pile.jpg",
    "/media/heist/crew-photo.jpg",
  ]
}
```

### Gallery Page (`src/pages/Gallery.jsx`)
- Expects photos/videos in `/public/gallery/`
- Shows last year's party memories
- Supports lightbox viewing with filters

## Current Status

**⚠️ All media files are currently placeholders**
- Gallery.jsx has fallback SVG placeholders if images not found
- Theme backgrounds not yet integrated into pages
- Videos would add production value but aren't required

## Integration Tasks

### 1. Add Hero Background Videos (Optional)
Update `Home.jsx` and `HeistHome.jsx` to use `theme.media.heroBg`:

```jsx
// Add video background
<div className="absolute inset-0 overflow-hidden">
  <video
    autoPlay
    loop
    muted
    playsInline
    className="w-full h-full object-cover opacity-30"
  >
    <source src={theme.media.heroBg} type="video/mp4" />
  </video>
  <img 
    src={theme.media.heroFallback} 
    alt="Background" 
    className="w-full h-full object-cover opacity-30"
  />
</div>
```

### 2. Add Gallery Photos
- Take photos from 2024 party (or use stock festive images)
- Resize to web-friendly sizes (1920px wide max)
- Create thumbnails (400px wide)
- Place in `/public/gallery/` and `/public/gallery/thumbs/`

### 3. Video Recommendations

**White Elephant Theme (`snow-bg.mp4`):**
- Gentle falling snow
- Twinkling Christmas lights
- Warm fireplace or cozy scene
- Loop seamlessly (15-30 seconds)
- Subtle, not distracting

**Great Gift Heist Theme (`hero-bg.mp4`):**
- Cinematic vault/security footage aesthetic
- Blue/cyan color grading
- Subtle movement (scanning lasers, code scrolling)
- Mystery/intrigue vibe
- Loop seamlessly (15-30 seconds)

## Quick Stock Sources

**Free Christmas Videos:**
- Pexels.com (search: "christmas snow", "winter lights")
- Pixabay.com (search: "snowfall", "christmas decorations")
- Coverr.co (search: "winter", "holiday")

**Free Heist-Style Videos:**
- Pexels.com (search: "vault", "code", "technology")
- Videvo.net (search: "digital", "security", "matrix")
- Coverr.co (search: "abstract blue", "data")

## Fallback Strategy

**If you don't add videos:**
- Theme fallback images will be used
- Still looks great with gradient backgrounds
- Videos are purely enhancement

**If you don't add gallery photos:**
- Gallery shows SVG placeholders with "🎄 Photo" text
- Page is fully functional
- Can add photos later as they're taken

## Performance Notes

- Keep videos under 5MB if possible
- Use H.264 codec for best browser support
- Compress images (JPG quality 80-85)
- Thumbnails should be <100KB each
- Videos load asynchronously, won't block page

## Priority

1. **Not Required:** Site works perfectly without any media
2. **Nice to Have:** Gallery photos from last year's party
3. **Enhancement:** Hero background videos for immersion
4. **Optional:** Stock photos if you don't have real ones

---

**Bottom Line:** The app is fully functional without any media files. They're referenced in the theme configs but have fallbacks and placeholders. Add them when/if you have time for extra polish!
