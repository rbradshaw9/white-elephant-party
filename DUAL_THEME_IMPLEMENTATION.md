# Dual-Theme System Implementation

## ✅ What's Been Built

### Core Theme System
- **Theme Configuration Files**
  - `/src/themes/whiteElephantTheme.js` - Original Elf-inspired party theme
  - `/src/themes/greatGiftHeistTheme.js` - New cinematic heist theme
  - Complete configs with colors, fonts, copy, animations, and media paths

- **Theme Context** (`/src/context/ThemeContext.jsx`)
  - React Context Provider for global theme state
  - Automatic localStorage persistence
  - Document title and meta tag updates
  - CSS custom property updates for fonts
  - Theme toggle and direct theme setter functions

- **Theme Switcher Component** (`/src/components/ThemeSwitcher.jsx`)
  - Fixed position toggle button (top-left)
  - 🎄 ↔ 💼 icon rotation animation
  - Hover tooltip showing next theme
  - Smooth spring animations

### Updated Infrastructure
- **Fonts**: Added Bebas Neue for heist theme via Google Fonts
- **Tailwind Config**: Extended with heist colors and animations
  - Heist palette: navy, icy blue, crimson, gold
  - New animations: spotlight, vault-open, glow-pulse
  - Heist-specific font family

- **App.jsx**: Wrapped in ThemeProvider, conditional rendering of theme-specific components
- **Snowfall.jsx**: Now accepts color prop for theme-aware particles

### Theme Configurations

#### White Elephant Theme
- **Palette**: Bright reds, snowy whites, greens, gold accents
- **Fonts**: Playfair Display (display), Inter (body)
- **Tone**: Playful, cheerful, warm, "Buddy the Elf" style
- **Effects**: Snowfall, sleigh animation, red/green gradients
- **Copy**: "No Scrooges allowed!" / "Grab a gift, grab a drink, and get ready for joyful chaos"

#### Great Gift Heist Theme
- **Palette**: Deep navy (#0a0e1a), icy blue, crimson, gold sparkle
- **Fonts**: Bebas Neue (display), Inter (body)
- **Tone**: Cinematic, confident, mischievous, heist-movie cool
- **Effects**: Spotlight glows, vault transitions, icy blue particles
- **Copy Examples**:
  - Title: "The Great Gift Heist"
  - Subtitle: "Every December, the city's most daring holiday caper returns"
  - Tagline: "Mission Date: December 13, 2025 • 18:30 Hours"
  - Footer: "Because stealing gifts is way more fun than buying them"

## 🚧 What Needs Completion

### Pages to Update
1. **Home.jsx** - Partially updated, needs:
   - Complete theme-aware hero section
   - Dynamic details section using `theme.sections.details`
   - Theme-specific Spotify section title
   - Theme-specific game section copy

2. **Rules.jsx** - Needs full conversion:
   - Title: "The Rules" vs "Mission Brief"
   - Use `theme.sections.rules.items` for rule content
   - Heist theme: military/caper language
   - White Elephant: playful language

3. **RSVP.jsx** - Needs updates:
   - Button text from `theme.sections.rsvp`
   - Success messages: "You're In!" vs "Welcome to the Crew!"
   - Form labels: "Reserve Your Spot" vs "Join the Crew"

4. **AdminGuestList.jsx** - Minor theme styling updates

### Components to Update
- **MusicToggle.jsx** - Position adjustment (theme switcher took top-left)
- **PresentStackingGame.jsx** - Optional: heist-themed colors/copy

### Media Assets Needed
Create placeholder files in `/public/media/`:
```
/media/
├── elephant/
│   ├── snow-bg.mp4 (or .jpg fallback)
│   ├── presents.jpg
│   ├── elf-lights.jpg
│   └── party-group.jpg
└── heist/
    ├── hero-bg.mp4 (vault/heist imagery)
    ├── vault-bg.jpg
    ├── gift-pile.jpg
    └── crew-photo.jpg
```

## 🎯 How to Complete

### Quick Win: Update Home Page
```jsx
import { useTheme } from '../context/ThemeContext';

const Home = () => {
  const { theme, isHeistTheme } = useTheme();
  
  return (
    <div style={{ backgroundColor: theme.palette.background }}>
      <h1 style={{ fontFamily: theme.fonts.display }}>
        {theme.hero.title}
      </h1>
      <p style={{ color: theme.palette.text.secondary }}>
        {theme.hero.subtitle}
      </p>
      
      {/* Map over theme.sections.details.items */}
      {theme.sections.details.items.map(item => (
        <div key={item.title}>
          <span>{item.icon}</span>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  );
};
```

### Quick Win: Update Rules Page
```jsx
const Rules = () => {
  const { theme } = useTheme();
  
  return (
    <div>
      <h1 style={{ fontFamily: theme.fonts.display }}>
        {theme.sections.rules.title}
      </h1>
      <p>{theme.sections.rules.subtitle}</p>
      
      {theme.sections.rules.items.map((rule, i) => (
        <div key={i}>
          <span>{rule.number}</span>
          <h3>{rule.title}</h3>
          <p>{rule.description}</p>
        </div>
      ))}
    </div>
  );
};
```

## 🎨 Theme Switching

Users can switch themes via:
1. **Toggle Button** - Click 🎄/💼 icon in top-left
2. **localStorage** - Persists across sessions
3. **Programmatic** - `setTheme('heist')` or `setTheme('elephant')`

## 📝 Copy Guidelines

### Connection-Focused Messaging
Both themes emphasize:
- **Community**: "It's not about competition — it's about connection"
- **Laughter**: "Gifts will be stolen. Alliances will be broken. Fun will be had"
- **Inclusivity**: "Everyone belongs at the heist/party"
- **Shared Joy**: "Music or gifts bring people together"

### Tone Differences
- **White Elephant**: Warm, excited, Elf-style enthusiasm
- **Heist**: Witty, confident, cinematic trailer energy

## 🚀 Deployment Notes

- Theme system works entirely client-side (no backend changes)
- Vercel deployment ready (just needs component updates)
- No breaking changes to existing functionality
- Backward compatible (defaults to White Elephant theme)

## Next Steps

1. Complete Home.jsx theme integration (hero, details, Spotify)
2. Transform Rules.jsx into theme-aware Mission Brief
3. Update RSVP.jsx with theme context
4. Add placeholder media assets
5. Optional: Heist-themed animations (spotlights, vault transitions)
6. Test theme switching across all pages
7. Deploy!

---

**Status**: Core theme system ✅ Complete | Pages 🚧 In Progress | Ready for final integration
