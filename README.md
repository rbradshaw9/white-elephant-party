# 🎅 White Elephant Party 2025
**An interactive Elf-inspired invitation website for our annual Christmas party (Dec 13, 2025).**

---

## ✨ Overview
This microsite is both an invitation and a playful experience. Guests can explore the party details, learn the rules, and click through an animated “gift pile” to reveal funny surprises.

---

## 🧠 Features
- **Elf-inspired design:** bright colors, animated snow, candy-cane borders.
- **Interactive gift pile:** each gift reveals a random funny message or image.
- **Responsive layout:** looks great on desktop, tablet, or mobile.
- **Zero-login RSVP:** just share the URL with friends.
- **Optional backend (future):** connect Supabase to store RSVPs or guest nicknames.

---

## ⚙️ Tech Stack
- **Framework:** [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animation:** [Framer Motion](https://www.framer.com/motion/)
- **Deployment:** [Vercel](https://vercel.com/)
- **Optional integrations:** OpenAI API (for random gift text generation)

---

## 🏗️ File Structure
/white-elephant-party/
├── public/
│ ├── favicon.ico
│ ├── robots.txt (Disallow: /)
│ ├── images/
├── src/
│ ├── components/
│ │ ├── GiftPile.jsx
│ │ ├── RulesCard.jsx
│ │ ├── Snowfall.jsx
│ ├── pages/
│ │ ├── Home.jsx
│ │ ├── Rules.jsx
│ │ ├── Gallery.jsx
│ ├── App.jsx
│ ├── main.jsx
│ ├── assets/
│ └── styles/
│ └── tailwind.css
├── package.json
└── # White Elephant Party 2025 🎄

A beautifully crafted White Elephant Party website with Apple-level design polish. Built with React, Vite, Tailwind CSS, and Framer Motion. Inspired by the movie *Elf* with joyful animations, modern design, and delightful interactions.

## 🎁 Features

- **Terminal Access Gate** - Retro CRT-style authentication with boot sequence, animated progress bar, and typing effects
- **AI-Powered Codenames** - Personalized elf-themed agent codenames generated via OpenAI based on a fun personality quiz
- **Codename Uniqueness** - Registry system ensures no duplicate codenames across all users
- **Dual Themes** - Toggle between "Heist Mode" (spy aesthetics) and "Party Mode" (cheerful vibes)
- **RSVP System** - Beautiful form with validation, smooth animations, and success states
- **AI Memory Match Game** - Play against an intelligent AI opponent with adjustable difficulty levels
- **Mission Brief** - Clear, beautifully formatted White Elephant game rules
- **Background Music** - Toggle-able sleigh bells audio for extra holiday cheer
- **Fully Responsive** - Pixel-perfect on desktop, tablet, and mobile
- **Smooth Animations** - Apple-quality micro-interactions powered by Framer Motion
- **Modern Design System** - Clean, accessible, and delightful

## 🎨 Design

- **Color Palette**: Christmas red (#FF3B3B), snow white (#FFFFFF), Christmas green (#2ECC71), gold accents
- **Fonts**: "Mountains of Christmas" for headings, Inter for body text
- **Animations**: Snowfall, floating elements, card flips, form transitions
- **Philosophy**: Apple-level polish meets Elf's whimsical spirit

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key (for AI-powered codename generation)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd white-elephant-party
```

2. Install dependencies:
```bash
npm install
```

3. **Configure OpenAI API Key:**

   Create a `.env` file in the root directory:
   ```bash
   VITE_OPENAI_API_KEY=your-openai-api-key-here
   ```

   Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)

   **Important:** Never commit your `.env` file to Git. It's already in `.gitignore`.

4. Start the development server:
```bash
npm run dev
```

5. Open your browser to the URL shown in the terminal (usually `http://localhost:5173`)

### Universal Access Code

The site uses a terminal-style access gate. The universal access code is:

**RED-SLEIGH-2025**

(This can be changed in `src/pages/AccessGate.jsx`)

### Building for Production

```bash
npm run build
```

## 📁 Project Structure

```
white-elephant-party/
├── public/
│   ├── robots.txt          # Blocks search engine indexing
│   └── audio/              # Add sleigh-bells.mp3 here (optional)
├── src/
│   ├── components/
│   │   ├── Snowfall.jsx    # Animated snowfall effect
│   │   ├── MusicToggle.jsx # Background music control
│   │   ├── MatchingGame.jsx # AI-powered memory game
│   │   └── CodenameQuiz.jsx # Personality quiz for AI codenames
│   ├── pages/
│   │   ├── Home.jsx        # Landing page
│   │   ├── AccessGate.jsx  # Terminal-style access gate
│   │   ├── MissionBrief.jsx # Game rules (heist theme)
│   │   ├── Rules.jsx       # Game rules (party theme)
│   │   └── AgentRecruitment.jsx # RSVP form
│   ├── utils/
│   │   ├── aiCodenameGenerator.js # OpenAI-powered codename generation
│   │   └── codenameRegistry.js    # Uniqueness tracking system
│   ├── context/
│   │   └── AccessContext.jsx # Global access state management
│   ├── App.jsx             # Main app with routing
│   ├── main.jsx            # App entry point
│   └── index.css           # Global styles with Tailwind
├── .env                    # OpenAI API key (DO NOT COMMIT)
├── index.html              # HTML template with meta tags
├── package.json
├── vite.config.js
├── tailwind.config.js
└── vercel.json             # Vercel deployment config
```

## 🎵 Adding Background Music

To add sleigh bells audio:

1. Find a royalty-free sleigh bells MP3 file
2. Create a `public/audio/` directory
3. Add your audio file as `sleigh-bells.mp3`
4. The music toggle button will automatically work!

## 🎮 Customizing the Game

The AI memory match game features three difficulty levels:
- **Easy**: AI has 50% memory accuracy
- **Medium**: AI has 75% memory accuracy  
- **Hard**: AI has 95% memory accuracy

Edit `src/components/MatchingGame.jsx` to adjust difficulty settings or change the Christmas emojis used in the game.

## 📝 Customizing Content

- **Rules**: Update the `RULES` array in `src/pages/Rules.jsx`
- **Colors**: Edit `tailwind.config.js` to change the color scheme
- **Text**: Search for text strings in component files to personalize messages
- **Animations**: Adjust Framer Motion parameters for different animation effects

## 🌟 Deployment on Vercel

1. Push your code to GitHub

2. Go to [Vercel](https://vercel.com) and sign in

3. Click "New Project" and import your GitHub repository

4. Vercel will automatically detect Vite settings:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. Click "Deploy"

Your site will be live in minutes! 🎉

## 🎄 Technologies Used

- **React 18** - UI framework
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Production-ready animations
- **React Router** - Client-side routing
- **Inter Font** - Modern, readable typography

## ✨ Design Highlights

- Glassmorphism effects with backdrop blur
- Smooth page transitions and micro-interactions
- Accessible form validation with helpful feedback
- 3D card flip animations in the memory game
- Responsive design that works beautifully on all devices
- Dark mode optimized with carefully chosen opacity levels

## 📄 License

This project is open source and available for personal use. Have fun and happy holidays! 🎅

## 🎊 Credits

Designed with love and inspiration from the movie *Elf*. Built with the same attention to detail and polish you'd expect from Apple. May your White Elephant party be filled with laughter, friendly competition, and unforgettable moments!

---

**Made with ❤️ and lots of Christmas cheer!**

yaml
Copy code

---

## 🚀 Getting Started
```bash
# Clone repo
git clone https://github.com/yourname/white-elephant-party.git

# Install dependencies
cd white-elephant-party
npm install

# Run locally
npm run dev

# Deploy
vercel deploy
🎮 Interaction Concept
The GiftPile component renders clickable boxes with randomized contents (text, GIFs, or jokes). Example:

jsx
Copy code
const gifts = [
  { text: "A used candle from 2009" },
  { text: "Half a fruitcake (from last year)" },
  { text: "An IOU for one hug" },
];
When clicked, each box “unwraps” with a Framer Motion animation, plays a jingle, and shows the text in a modal.

🧊 Rules Page Content
Step 1: Everyone brings a wrapped gift under $25.
Step 2: Draw numbers to determine order.
Step 3: Choose or steal gifts — chaos encouraged.
Step 4: No crying (unless from laughter).
Step 5: The last person standing wins nothing… but glory.

🔒 Privacy
The site is public but unlisted.

robots.txt blocks indexing

<meta name="robots" content="noindex"> is included
No personal data is collected unless an RSVP backend is added later.

🧁 Credits
Built with ❤️ and holiday cheer by [Ryan Bradshaw] and friends.
Design inspired by Elf (2003).
Music from FreeSound / FreePD.

🎅 Future Ideas
Live “gift exchange” mode (real-time randomizer)

Naughty or Nice AI quiz

Snowball fight animation game