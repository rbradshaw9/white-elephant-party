# 📸 Adding Your Last Year's Party Media

## Quick Start Guide

### Step 1: Organize Your Media Files

1. **Gather all photos and videos** from last year's party
2. **Rename them** with surveillance-style names:
   - `2024-cam1.jpg` (first photo)
   - `2024-cam2.jpg` (second photo)
   - `2024-cam3.mp4` (first video)
   - etc.

### Step 2: Add Files to the Project

**Option A: Using Finder (Easiest)**
1. Open Finder and navigate to your project folder
2. Go to `public/gallery/`
3. Drag and drop your renamed media files here
4. Create thumbnails (instructions below)

**Option B: Using Terminal**
```bash
# Navigate to your media folder
cd ~/Pictures/WhiteElephantParty2024  # or wherever your photos are

# Copy to project (update paths as needed)
cp 2024-cam*.jpg "/Users/ryanbradshaw/Git Projects/white-elephant-party/public/gallery/"
cp 2024-cam*.mp4 "/Users/ryanbradshaw/Git Projects/white-elephant-party/public/gallery/"
```

### Step 3: Create Thumbnails

**Easy Way - Use Preview (Mac)**
1. Open each image in Preview
2. Tools → Adjust Size
3. Set width to 400px (keep aspect ratio)
4. Save as new file in `public/gallery/thumbs/`
5. Name it the same: `2024-cam1.jpg`

**For Videos:**
1. Open video in QuickTime
2. Pause at a good frame
3. Edit → Copy
4. Preview → File → New from Clipboard
5. Resize to 400px wide
6. Save as `2024-cam1-thumb.jpg` in `thumbs/` folder

**Fast Way - Use ImageMagick (if installed)**
```bash
cd "/Users/ryanbradshaw/Git Projects/white-elephant-party/public/gallery"

# Create thumbnails for all JPGs
for img in *.jpg; do
  convert "$img" -resize 400x -quality 85 "thumbs/$img"
done

# For PNGs
for img in *.png; do
  convert "$img" -resize 400x -quality 85 "thumbs/${img%.*}.jpg"
done
```

### Step 4: Update Gallery Metadata

Edit `src/pages/Gallery.jsx` to add proper captions for your photos.

**Current structure:**
```javascript
{
  id: 1,
  type: 'photo',
  src: '/gallery/2024-cam1.jpg',
  thumbnail: '/gallery/thumbs/2024-cam1.jpg',
  camera: 'CAM-01',
  timestamp: '2024-12-13 19:23:17',
  location: 'Gift Exchange Area',
  caption: 'Gift Unwrapping Protocol - Subject A',
}
```

**Your action:**
1. Count how many photos/videos you have
2. Update the `media` array in Gallery.jsx
3. Add fun captions for each one!

### Step 5: Commit and Push

```bash
cd "/Users/ryanbradshaw/Git Projects/white-elephant-party"

# Check what files were added
git status

# Add all new media
git add public/gallery/

# Commit
git commit -m "Add last year's party photos and videos

- Added [X] photos from December 2024 party
- Added [X] videos
- Created thumbnails for faster loading
- Ready for Gallery page surveillance theme"

# Push to GitHub
git push origin main
```

## 🎬 Video Optimization Tips

If your videos are large (>10MB), compress them:

**Using HandBrake (Free, Easy)**
1. Download HandBrake: https://handbrake.fr/
2. Open your video
3. Preset: "Web" → "Gmail Small 5 Minutes 720p30"
4. Save as new file
5. Replace original with compressed version

**Using FFmpeg (Command Line)**
```bash
# Compress video to web-friendly size
ffmpeg -i input.mp4 -vcodec h264 -acodec aac -b:v 2M -b:a 128k output.mp4
```

## 📏 Recommended File Sizes

- **Photos:** 1920px wide max, JPEG quality 85%
- **Thumbnails:** 400px wide, JPEG quality 80%
- **Videos:** 720p, H.264, ~2Mbps bitrate
- **Max file size:** 5-10MB per video

## 🎨 Adding Surveillance Effects (Optional)

If you want to add surveillance styling to your photos:

**Using Any Photo Editor:**
1. Convert to black & white (or 80% desaturate)
2. Increase contrast +20%
3. Lower brightness -10%
4. Add grain/noise if desired
5. Export as JPEG

**Our components will add:**
- Scan lines ✓
- Timestamps ✓
- Camera labels ✓
- Classified watermark ✓
- VHS effects ✓

## 🚀 Testing Locally

After adding files:
```bash
# Make sure dev server is running
npm run dev

# Open browser to:
# http://localhost:5173/gallery

# You should see your photos with surveillance styling!
```

## ⚠️ Important: Git LFS for Large Files (Optional)

If you have many large videos (>50MB each), consider Git LFS:

```bash
# Install Git LFS
brew install git-lfs  # Mac
# or download from: https://git-lfs.github.com/

# Initialize in your repo
cd "/Users/ryanbradshaw/Git Projects/white-elephant-party"
git lfs install

# Track video files
git lfs track "*.mp4"
git lfs track "*.mov"

# Add .gitattributes
git add .gitattributes
git commit -m "Configure Git LFS for videos"

# Now add your videos normally
git add public/gallery/
git commit -m "Add party videos via LFS"
git push
```

## 📋 Quick Checklist

- [ ] Rename media files (2024-cam1.jpg, etc.)
- [ ] Copy to `public/gallery/`
- [ ] Create thumbnails in `public/gallery/thumbs/`
- [ ] Update Gallery.jsx with correct count and captions
- [ ] Test locally (npm run dev)
- [ ] Commit and push to GitHub
- [ ] Verify deployment on live site

## 🎯 Example File Structure

```
public/gallery/
├── 2024-cam1.jpg          (Main photo)
├── 2024-cam2.jpg
├── 2024-cam3.mp4          (Video)
├── 2024-cam4.jpg
├── 2024-cam5.mp4
└── thumbs/
    ├── 2024-cam1.jpg      (Thumbnail - 400px)
    ├── 2024-cam2.jpg
    ├── 2024-cam3-thumb.jpg (Video thumbnail)
    ├── 2024-cam4.jpg
    └── 2024-cam5-thumb.jpg
```

## 🎉 What Happens After Push

1. **GitHub receives your files**
2. **Vercel/Netlify auto-deploys** (if connected)
3. **Gallery page shows your photos** with surveillance styling
4. **People can click to view full-size** in lightbox
5. **Videos play with surveillance overlays**

## Need Help?

If you need help:
1. Let me know how many photos/videos you have
2. Share where they're currently stored
3. I can create a custom script to automate everything!

---

Ready to add your media? Start with Step 1 above!
