# Gallery Assets

Add your party photos and videos here!

## Expected Structure

# 📸 Gallery Media Files

This folder contains last year's party photos and videos.

## 🎬 Surveillance Theme Naming

Files are named with camera IDs for the surveillance aesthetic:
- `2024-cam1.jpg` - Camera 01 footage
- `2024-cam2.jpg` - Camera 02 footage  
- `2024-cam3.mp4` - Camera 03 video
- etc.

## 📁 Expected Structure

```
gallery/
├── 2024-cam1.jpg           # Full-size media
├── 2024-cam2.jpg
├── 2024-cam3.mp4           # Videos
├── 2024-cam4.jpg
└── thumbs/                 # Thumbnails (400px wide)
    ├── 2024-cam1.jpg
    ├── 2024-cam2.jpg
    ├── 2024-cam3-thumb.jpg  # Video thumbnails
    └── 2024-cam4.jpg
```

## 🚀 Adding Your Media

### Option 1: Use the Helper Script
```bash
./import-media.sh
```
Follow the prompts to automatically import and rename your files!

### Option 2: Manual Method
1. Copy your photos/videos here
2. Rename as `2024-cam1.jpg`, `2024-cam2.mp4`, etc.
3. Create thumbnails (400px wide) in `thumbs/` folder
4. Update `src/pages/Gallery.jsx` with metadata

## 📝 Updating Gallery Metadata

Edit `src/pages/Gallery.jsx` and update the `media` array:

```jsx
{
  id: 1,
  type: 'photo',  // or 'video'
  src: '/gallery/2024-cam1.jpg',
  thumbnail: '/gallery/thumbs/2024-cam1.jpg',
  camera: 'CAM-01',
  timestamp: '2024-12-13 19:23:17',
  location: 'Gift Exchange Area',
  caption: 'Gift Unwrapping Protocol',
}
```

## 💡 Tips

- **Photos**: JPG format, max 1920px wide, quality 85%
- **Videos**: MP4 (H.264), 720p, max 10MB
- **Thumbnails**: 400px wide, quality 80%
- **Git**: Large files (>50MB) should use Git LFS

## 🎨 Styling

The Gallery component automatically adds:
- ✓ Surveillance camera overlays
- ✓ Timestamps and camera IDs  
- ✓ Classified watermarks
- ✓ VHS scan lines
- ✓ Grayscale with hover color

See `SURVEILLANCE_MEDIA_INTEGRATION.md` for more details!

## Tips

- **Images**: JPG or PNG, optimized for web (< 2MB each)
- **Videos**: MP4, H.264 codec, < 50MB each
- **Thumbnails**: 300x300px or 400x300px, < 100KB each

## Adding More Media

Edit `src/pages/Gallery.jsx` and add items to the `galleryItems` array:

```jsx
{
  id: 6,
  type: 'image',
  src: '/gallery/2024-5.jpg',
  thumbnail: '/gallery/thumbs/2024-5.jpg',
  caption: 'Your caption here',
  date: 'December 2024'
}
```

The gallery will automatically display all items!
