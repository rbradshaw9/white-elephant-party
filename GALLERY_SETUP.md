# Gallery Setup Guide

## Adding Your Photos & Videos from Last Year's Party

### Step 1: Organize Your Media Files

1. **Create the gallery folders** in your `public` directory:
   ```
   public/
   └── gallery/
       ├── thumbs/           # Thumbnail images
       ├── 2024-1.jpg
       ├── 2024-2.jpg
       ├── 2024-3.jpg
       ├── 2024-video-1.mp4
       └── ...
   ```

2. **Name your files** descriptively:
   - Photos: `2024-1.jpg`, `2024-group.jpg`, `2024-gift-opening.jpg`
   - Videos: `2024-steal.mp4`, `2024-reactions.mp4`

### Step 2: Create Thumbnails

For best performance, create thumbnail versions of all media:

**For Photos:**
- Resize to ~400x300px
- Save in `public/gallery/thumbs/` with same filename
- Example: `2024-1.jpg` → `thumbs/2024-1.jpg`

**For Videos:**
- Extract a frame from the video as a thumbnail
- Save as JPG in `public/gallery/thumbs/`
- Example: `2024-video-1.mp4` → `thumbs/2024-video-1-thumb.jpg`

**Quick thumbnail creation (macOS):**
```bash
# For images (requires ImageMagick)
brew install imagemagick
cd public/gallery
mkdir -p thumbs
for file in *.jpg; do
  convert "$file" -resize 400x300^ -gravity center -extent 400x300 "thumbs/$file"
done

# For video thumbnails (requires ffmpeg)
brew install ffmpeg
ffmpeg -i 2024-video-1.mp4 -ss 00:00:02 -vframes 1 thumbs/2024-video-1-thumb.jpg
```

### Step 3: Update the Gallery Component

Edit `src/pages/Gallery.jsx` and replace the `media` array with your actual files:

```javascript
const media = [
  {
    id: 1,
    type: 'photo',
    src: '/gallery/gift-exchange.jpg',
    thumbnail: '/gallery/thumbs/gift-exchange.jpg',
    caption: 'The chaos begins!',
  },
  {
    id: 2,
    type: 'video',
    src: '/gallery/reactions.mp4',
    thumbnail: '/gallery/thumbs/reactions-thumb.jpg',
    caption: 'Best reactions compilation',
  },
  // Add more items...
];
```

### Step 4: Deploy

1. **Commit your changes:**
   ```bash
   git add public/gallery src/pages/Gallery.jsx
   git commit -m "Add 2024 party gallery"
   git push
   ```

2. **Vercel will automatically redeploy** with your new gallery

### Tips

**File Size Optimization:**
- Keep photos under 2MB each
- Compress videos (target ~720p, ~5MB per minute)
- Use `.jpg` for photos, `.mp4` for videos

**Privacy:**
- Review photos before uploading
- Get consent if faces are clearly visible
- Consider blurring faces if needed

**Captions:**
- Keep them fun and festive
- Reference inside jokes from the party
- Don't reveal who got what gift (spoilers!)

**Organization Ideas:**
- Group photos by timeline (arrival, dinner, game, etc.)
- Create themed sections (best reactions, worst gifts, etc.)
- Add a "highlights reel" video at the top

### Alternative: Use a CDN

For many photos/videos, consider using a service like:
- **Cloudinary** (free tier: 25GB storage)
- **ImageKit** (free tier: 20GB bandwidth)
- **AWS S3** (pay-as-you-go)

Update the `src` URLs in `Gallery.jsx` to point to your CDN URLs.

### Example with Cloudinary

```javascript
const media = [
  {
    id: 1,
    type: 'photo',
    src: 'https://res.cloudinary.com/your-cloud/image/upload/v1234/gallery/2024-1.jpg',
    thumbnail: 'https://res.cloudinary.com/your-cloud/image/upload/w_400,h_300,c_fill/gallery/2024-1.jpg',
    caption: 'Party time!',
  },
];
```

### Need Help?

Contact me if you need help with:
- Bulk resizing images
- Video compression
- Setting up a CDN
- Automating thumbnail generation
