#!/bin/bash

# 📸 Media Import Helper Script
# This script helps you add last year's party media to the gallery

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🎄 White Elephant Party - Media Import Helper${NC}"
echo "=============================================="
echo ""

# Get project directory
PROJECT_DIR="/Users/ryanbradshaw/Git Projects/white-elephant-party"
GALLERY_DIR="$PROJECT_DIR/public/gallery"
THUMBS_DIR="$GALLERY_DIR/thumbs"

# Create directories if they don't exist
mkdir -p "$GALLERY_DIR"
mkdir -p "$THUMBS_DIR"

echo -e "${GREEN}✓${NC} Gallery directory ready: $GALLERY_DIR"
echo ""

# Function to check if ImageMagick is installed
check_imagemagick() {
  if command -v convert &> /dev/null; then
    echo -e "${GREEN}✓${NC} ImageMagick found - thumbnails will be auto-generated"
    return 0
  else
    echo -e "${YELLOW}⚠${NC} ImageMagick not found - you'll need to create thumbnails manually"
    echo "  To install: brew install imagemagick"
    return 1
  fi
}

# Check for ImageMagick
HAS_IMAGEMAGICK=false
if check_imagemagick; then
  HAS_IMAGEMAGICK=true
fi
echo ""

# Ask user for source directory
echo -e "${BLUE}Where are your party photos/videos located?${NC}"
echo "Enter the full path (or drag folder here):"
read -r SOURCE_DIR

# Remove quotes if user dragged folder
SOURCE_DIR="${SOURCE_DIR//\'/}"
SOURCE_DIR="${SOURCE_DIR//\"/}"

# Trim whitespace
SOURCE_DIR="$(echo -e "${SOURCE_DIR}" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')"

# Check if directory exists
if [ ! -d "$SOURCE_DIR" ]; then
  echo -e "${RED}✗${NC} Directory not found: $SOURCE_DIR"
  exit 1
fi

echo -e "${GREEN}✓${NC} Found source directory"
echo ""

# Count files
PHOTO_COUNT=$(find "$SOURCE_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) | wc -l | tr -d ' ')
VIDEO_COUNT=$(find "$SOURCE_DIR" -type f \( -iname "*.mp4" -o -iname "*.mov" -o -iname "*.m4v" \) | wc -l | tr -d ' ')

echo -e "Found ${GREEN}$PHOTO_COUNT photos${NC} and ${GREEN}$VIDEO_COUNT videos${NC}"
echo ""

if [ "$PHOTO_COUNT" -eq 0 ] && [ "$VIDEO_COUNT" -eq 0 ]; then
  echo -e "${RED}✗${NC} No media files found in $SOURCE_DIR"
  exit 1
fi

# Ask for confirmation
echo -e "${YELLOW}This will:${NC}"
echo "  1. Copy files to $GALLERY_DIR"
echo "  2. Rename them as 2024-cam1.jpg, 2024-cam2.mp4, etc."
if [ "$HAS_IMAGEMAGICK" = true ]; then
  echo "  3. Auto-generate thumbnails"
else
  echo "  3. You'll need to create thumbnails manually"
fi
echo ""
echo -e "${BLUE}Continue? (y/n)${NC}"
read -r CONFIRM

if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
  echo "Cancelled."
  exit 0
fi

echo ""
echo -e "${BLUE}Processing files...${NC}"
echo ""

# Counter for naming
counter=1

# Process photos
for file in "$SOURCE_DIR"/*.{jpg,JPG,jpeg,JPEG,png,PNG} 2>/dev/null; do
  [ -e "$file" ] || continue
  
  ext="${file##*.}"
  # Convert to lowercase extension
  ext_lower=$(echo "$ext" | tr '[:upper:]' '[:lower:]')
  
  # If PNG, convert to JPG for web
  if [ "$ext_lower" = "png" ]; then
    target_file="$GALLERY_DIR/2024-cam$counter.jpg"
    echo "  Converting: $(basename "$file") → 2024-cam$counter.jpg"
    if [ "$HAS_IMAGEMAGICK" = true ]; then
      convert "$file" -quality 90 "$target_file"
    else
      cp "$file" "$target_file"
    fi
  else
    target_file="$GALLERY_DIR/2024-cam$counter.jpg"
    echo "  Copying: $(basename "$file") → 2024-cam$counter.jpg"
    cp "$file" "$target_file"
  fi
  
  # Create thumbnail if ImageMagick available
  if [ "$HAS_IMAGEMAGICK" = true ]; then
    convert "$target_file" -resize 400x -quality 85 "$THUMBS_DIR/2024-cam$counter.jpg"
    echo "    ✓ Thumbnail created"
  fi
  
  counter=$((counter + 1))
done

# Process videos
for file in "$SOURCE_DIR"/*.{mp4,MP4,mov,MOV,m4v,M4V} 2>/dev/null; do
  [ -e "$file" ] || continue
  
  ext="${file##*.}"
  ext_lower=$(echo "$ext" | tr '[:upper:]' '[:lower:]')
  
  # Convert MOV to MP4 if ffmpeg available
  if [ "$ext_lower" = "mov" ] && command -v ffmpeg &> /dev/null; then
    target_file="$GALLERY_DIR/2024-cam$counter.mp4"
    echo "  Converting: $(basename "$file") → 2024-cam$counter.mp4"
    ffmpeg -i "$file" -vcodec h264 -acodec aac -b:v 2M -b:a 128k "$target_file" -y 2>&1 | grep -v "frame="
  else
    if [ "$ext_lower" = "mov" ]; then
      target_file="$GALLERY_DIR/2024-cam$counter.mov"
    else
      target_file="$GALLERY_DIR/2024-cam$counter.$ext_lower"
    fi
    echo "  Copying: $(basename "$file") → $(basename "$target_file")"
    cp "$file" "$target_file"
  fi
  
  echo "    ℹ  You'll need to create a thumbnail manually for this video"
  echo "       Open in QuickTime, take a screenshot, resize to 400px"
  echo "       Save as: $THUMBS_DIR/2024-cam$counter-thumb.jpg"
  
  counter=$((counter + 1))
done

echo ""
echo -e "${GREEN}✓${NC} Files copied successfully!"
echo ""

# Summary
TOTAL_FILES=$((counter - 1))
echo -e "${BLUE}Summary:${NC}"
echo "  • $TOTAL_FILES files added to gallery"
echo "  • Location: $GALLERY_DIR"
if [ "$HAS_IMAGEMAGICK" = true ]; then
  echo "  • Photo thumbnails: Auto-generated ✓"
else
  echo "  • Photo thumbnails: Need to create manually"
fi
echo "  • Video thumbnails: Need to create manually"
echo ""

# Next steps
echo -e "${YELLOW}Next Steps:${NC}"
echo ""
echo "1. Update Gallery.jsx with metadata:"
echo "   File: src/pages/Gallery.jsx"
echo "   Look for the 'media' array and update to match $TOTAL_FILES items"
echo ""
echo "2. Test locally:"
echo "   npm run dev"
echo "   Visit: http://localhost:5173/gallery"
echo ""
echo "3. Commit and deploy (media files upload like any other file!):"
echo "   git add public/gallery/"
echo "   git commit -m \"Add $TOTAL_FILES party media files\""
echo "   git push origin main"
echo ""
echo "   ✨ Vercel/Netlify will automatically deploy your media!"
echo ""
echo -e "${GREEN}Done! 🎉${NC}"
