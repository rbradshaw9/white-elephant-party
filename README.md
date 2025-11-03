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

A festive, interactive White Elephant Party website built with React, Vite, Tailwind CSS, and Framer Motion. Inspired by the movie *Elf* with joyful animations, playful design, and interactive features.

## 🎁 Features

- **Animated Landing Page** - Festive design with snowfall, candy-cane borders, and playful typography
- **Gift Pile Game** - Interactive game where users click wrapped gifts to reveal random funny presents
- **Rules Page** - Clear, beautifully formatted White Elephant game rules
- **Gallery Page** - Showcase last year's party highlights (customizable with your own photos)
- **Background Music** - Toggle-able sleigh bells audio for extra holiday cheer
- **Fully Responsive** - Works beautifully on desktop, tablet, and mobile
- **Smooth Animations** - Powered by Framer Motion for delightful interactions

## 🎨 Design

- **Color Palette**: Christmas red (#FF3B3B), snow white (#FFFFFF), Christmas green (#2ECC71), gold accents
- **Fonts**: "Mountains of Christmas" for headings, "Open Sans" for body text
- **Animations**: Snowfall, floating elements, gift reveals, and more!

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

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

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to the URL shown in the terminal (usually `http://localhost:5173`)

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
│   │   └── GiftPileGame.jsx # Interactive gift game
│   ├── pages/
│   │   ├── Home.jsx        # Landing page
│   │   ├── Rules.jsx       # Game rules page
│   │   └── Gallery.jsx     # Photo gallery page
│   ├── App.jsx             # Main app with routing
│   ├── main.jsx            # App entry point
│   └── index.css           # Global styles with Tailwind
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

## 🖼️ Customizing Gallery Photos

To add your own party photos:

1. Option A - Local files:
   - Add images to `public/images/`
   - Update the `PHOTOS` array in `src/pages/Gallery.jsx`

2. Option B - External hosting:
   - Upload images to a service like Imgur or Cloudinary
   - Update the `src` URLs in the `PHOTOS` array

## 🎮 Customizing Gift Ideas

Edit the `GIFTS` array in `src/components/GiftPileGame.jsx` to add your own funny gift ideas!

## 🌟 Deployment on Vercel

1. Push your code to GitHub

2. Go to [Vercel](https://vercel.com) and sign in

3. Click "New Project" and import your GitHub repository

4. Vercel will automatically detect Vite settings

5. Click "Deploy"

Your site will be live in minutes! 🎉

## 📝 Customization Tips

- **Colors**: Edit `tailwind.config.js` to change the color scheme
- **Rules**: Update the `RULES` array in `src/pages/Rules.jsx`
- **Gifts**: Modify the `GIFTS` array in `src/components/GiftPileGame.jsx`
- **Text**: Search for text strings in component files to personalize messages
- **Animations**: Adjust Framer Motion parameters for different animation effects

## 🎄 Technologies Used

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animation library
- **React Router** - Client-side routing

## 📄 License

This project is open source and available for personal use. Have fun and happy holidays! 🎅

## 🎊 Credits

Designed with love and inspiration from the movie *Elf*. May your White Elephant party be filled with laughter, chaos, and questionable gifts!

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