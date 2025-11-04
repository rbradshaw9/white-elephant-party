# 📁 Media File Organization

## Simplified Structure - Single Source

All your party media files go in **ONE place**: `/public/gallery/`

The media files will be **automatically referenced** by:
- Gallery page (surveillance footage view)
- Hero backgrounds (themes can pull from gallery)
- Any other page that needs party photos

## 📂 Directory Structure

```
public/
├── gallery/              ← PUT ALL YOUR PARTY MEDIA HERE
│   ├── 2024-cam1.jpg
│   ├── 2024-cam2.jpg
│   ├── 2024-cam3.mp4
│   ├── 2024-cam4.jpg
│   └── thumbs/
│       ├── 2024-cam1.jpg
│       ├── 2024-cam2.jpg
│       ├── 2024-cam3-thumb.jpg
│       └── 2024-cam4.jpg
│
└── media/                ← OPTIONAL: Theme-specific assets
    ├── heist/            (Hero backgrounds, additional videos)
    │   ├── vault-bg.jpg  (can symlink from gallery)
    │   └── hero-bg.mp4   (optional additional footage)
    │
    └── elephant/         (Alternative theme assets)
        ├── presents.jpg  (can symlink from gallery)
        └── snow-bg.mp4   (optional additional footage)
```

## 🎯 Strategy

### For Party Media (photos/videos from last year):
✅ **Store in: `/public/gallery/`**
- Gallery page displays these automatically
- Hero backgrounds can reference these
- No duplication needed

### For Theme-Specific Backgrounds:
✅ **Option 1: Symlink from gallery** (Recommended)
```bash
cd public/media/heist
ln -s ../../gallery/2024-cam1.jpg vault-bg.jpg

cd ../elephant
ln -s ../../gallery/2024-cam1.jpg presents.jpg
```

✅ **Option 2: Copy with script** (Automatic)
The `import-media.sh` script automatically copies your first photo to both theme folders as hero backgrounds.

✅ **Option 3: Use gallery paths directly**
Update theme configs to point to `/gallery/` instead of `/media/`

## 🚀 Quick Import

### 1. Run the Import Script
```bash
./import-media.sh
```

This will:
1. Copy your photos/videos to `/public/gallery/`
2. Rename them as `2024-cam1.jpg`, `2024-cam2.mp4`, etc.
3. Generate thumbnails
4. **Automatically** copy the first photo to theme folders for hero backgrounds

### 2. Update Gallery Count

Edit `src/pages/Gallery.jsx` - update the `media` array to match your actual file count.

### 3. Commit and Push

```bash
git add public/gallery/
git add public/media/  # if you have theme-specific assets
git commit -m "Add party media from December 2024"
git push origin main
```

## 📤 Deployment Notes

### Vercel/Netlify
- ✅ Automatically deploys everything in `/public/`
- ✅ Media files are served from CDN
- ✅ No special configuration needed

### File Size Limits
- **Individual files**: 50MB max (compress videos if larger)
- **Total repo**: 2GB max on GitHub free tier
- **Use Git LFS** if you have many large files (see ADD_YOUR_MEDIA.md)

## 💡 Benefits of Single-Source Strategy

1. **No Duplication**: Store files once, reference everywhere
2. **Easier Updates**: Change a photo in one place, updates everywhere
3. **Smaller Repo**: No redundant files
4. **Faster Deploys**: Less data to transfer
5. **Cleaner Git History**: Fewer file conflicts

## 🔄 Migration Path

If you already have files in multiple locations:

```bash
# Keep gallery as source of truth
cd public/gallery

# Remove duplicates from media
rm -rf ../media/heist/*.jpg
rm -rf ../media/elephant/*.jpg

# Create symlinks instead
cd ../media/heist
ln -s ../../gallery/2024-cam1.jpg vault-bg.jpg

cd ../elephant
ln -s ../../gallery/2024-cam1.jpg presents.jpg
```

## ✅ Checklist

- [ ] All party photos/videos in `/public/gallery/`
- [ ] Thumbnails created in `/public/gallery/thumbs/`
- [ ] Gallery.jsx updated with correct media count
- [ ] (Optional) Hero backgrounds symlinked or copied
- [ ] Tested locally: `npm run dev`
- [ ] Committed: `git add public/gallery/`
- [ ] Pushed: `git push origin main`
- [ ] Verified on live site

---

**TL;DR:** Put everything in `/public/gallery/`, run the import script, done! 🎉
