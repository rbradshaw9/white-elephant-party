# 🎄 North Pole Theme Conversion Plan

## Overview
Converting from spy/heist theme → whimsical North Pole agent theme while keeping the fun agent/mission vibe.

## ✅ Completed Changes

### 1. Theme Configuration
- Created `northPoleTheme.js` with Christmas terminology
- Updated AI prompts to use "North Pole Command" instead of "HQ"
- Codename generator emphasizes whimsical elf names

### 2. Custom Song (Suno.ai)
- Created `SUNO_SONG_PROMPT.md` with two song options
- "Operation Santa's Manifest" - main theme song
- "North Pole Agents" - shorter alternative
- Upbeat Christmas electronic pop style

## 🔄 In Progress

### 3. Flow Reorganization

**Current Flow:**
- /home → HeistHome (landing page)
- /access → Access Gate (code entry)
- HQ Terminal → Onboarding
- /rsvp → Separate RSVP form

**New Flow:**
- `/` (Home) → "The Great Gift Heist" landing page
  - "Access Terminal" button → Opens HQ Terminal
  - No access code needed (or make it optional)
  
- `/terminal` → HQ Terminal handles everything:
  - Name collection
  - Personality questions (3 AI-generated)
  - Codename generation
  - **RSVP within terminal** (AI asks about attendance)
  - Guest count & names
  - Email/SMS reminder collection
  - Interactive prompts after completion
  
- After completion → Navigate to `/agent/[codename]`

- Remove or repurpose `/rsvp` page

### 4. Terminal Messaging Updates

**Replace spy terminology:**
- ❌ "HQ" → ✅ "North Pole Command"
- ❌ "Agent" → ✅ "Elf Agent"  
- ❌ "Mission Briefing" → ✅ "Workshop Intel"
- ❌ "Classified Terminal" → ✅ "North Pole Intelligence Network"
- ❌ "Operative" → ✅ "Helper Elf"
- ❌ "Field Agent" → ✅ "Workshop Agent"
- ❌ "Clearance Level" → ✅ "Nice List Clearance"

**System boot messages:**
```
INITIALIZING NORTH POLE NETWORK...
CONNECTING TO SANTA'S DATABASE...
LOADING NICE LIST PROTOCOLS...
CANDY CANE ENCRYPTION: ACTIVE
JINGLE BELL SECURITY: ENABLED
SYSTEM READY - HO HO HO!
```

### 5. RSVP in Terminal

Add new conversation state after codename confirmation:

```javascript
case 'rsvp':
  addNorthPoleMessage(
    `Perfect! Your elf codename is locked in.\n\n` +
    `Now for the important question:\n` +
    `Will you be joining us for Operation Santa's Manifest?\n\n` +
    `Type "yes" to accept the mission, or "no" if you can't make it this year.`
  );
```

**If YES:**
- Continue to guest_count
- Then guest_names (if > 0)
- Then reminders
- Then interactive prompts

**If NO:**
- Save as not_attending
- Offer to keep them on updates list
- Navigate to agent card

### 6. Visual Updates

**Colors to emphasize:**
- Primary: Christmas Red (#DC2626)
- Secondary: Evergreen (#047857)
- Accent: Golden (#FCD34D)
- Glow: Candy cane stripes

**Terminal styling:**
- Add subtle candy cane border animation
- Snowflake particles instead of matrix rain
- Jingle bell sound on messages (optional)

## 📝 Files to Update

### High Priority
1. ✅ `src/config/northPoleTheme.js` - Created
2. ✅ `src/utils/aiConversation.js` - Updated AI prompts
3. ⏳ `src/components/HQTerminal.jsx` - Update all messaging
4. ⏳ `src/pages/HeistHome.jsx` - Make this the main home page
5. ⏳ `src/App.jsx` - Update routing (/ → HeistHome)
6. ⏳ `src/pages/Home.jsx` - Repurpose or remove

### Medium Priority
7. ⏳ `src/pages/RSVP.jsx` - Remove or convert to "Update RSVP" page
8. ⏳ `src/components/BottomNav.jsx` - Update labels
9. ⏳ `src/components/HQTransmissions.jsx` - Update terminology
10. ⏳ `src/pages/AccessGate.jsx` - Make optional or remove

### Low Priority
11. ⏳ Update all "HQ" references across codebase
12. ⏳ Add Christmas sound effects
13. ⏳ Replace background music with custom Suno song

## 🎯 Next Actions

1. Commit current North Pole theme config
2. Update HQTerminal messaging comprehensively
3. Reorganize routing (Home → HeistHome)
4. Test full flow: Landing → Terminal → RSVP → Agent Card
5. Generate Suno song and add to music player
6. Update all component terminology
7. Test on mobile PWA

## 🎵 Music Integration

Once Suno song is generated:
1. Download MP3
2. Add to `/public/music/operation-santas-manifest.mp3`
3. Update `MusicToggle.jsx` to use new song
4. Add song credits/attribution

## 💡 Ideas for Future

- Animated elf walking across screen
- Candy cane cursor
- Snowglobe effect on hover
- Workshop background sounds
- Daily advent calendar-style countdown messages
- "Naughty or Nice" achievement badges
