# Gallery Assets

Add your party photos and videos here!

## Expected Structure

```
gallery/
├── 2024-1.jpg           # Full-size images
├── 2024-2.jpg
├── 2024-3.jpg
├── 2024-4.jpg
├── 2024-video-1.mp4     # Videos
├── 2024-video-2.mp4
└── thumbs/              # Thumbnail versions (for faster loading)
    ├── 2024-1.jpg       # 300x300 or similar
    ├── 2024-2.jpg
    ├── 2024-3.jpg
    ├── 2024-4.jpg
    ├── 2024-video-1-thumb.jpg
    └── 2024-video-2-thumb.jpg
```

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
