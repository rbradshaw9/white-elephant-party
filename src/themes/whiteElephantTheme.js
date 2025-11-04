/**
 * White Elephant Party Theme
 * Elf-inspired, cheerful, candy-cane Christmas vibes
 */
export default {
  name: "White Elephant Party",
  slug: "white-elephant",
  
  // Color palette - bright reds, snowy whites, greens, gold
  palette: {
    primary: "#ef4444", // red-500
    secondary: "#10b981", // emerald-500
    accent: "#f59e0b", // amber-500
    background: "#0f172a", // slate-900
    surface: "rgba(255, 255, 255, 0.1)", // glass effect
    text: {
      primary: "#ffffff",
      secondary: "#cbd5e1", // slate-300
      muted: "#94a3b8", // slate-400
    },
    gradients: {
      hero: "from-red-400 via-amber-300 to-emerald-400",
      button: "from-red-500 to-red-600",
      buttonAlt: "from-emerald-500 to-emerald-600",
    }
  },

  // Typography
  fonts: {
    display: "'Playfair Display', serif", // elegant display
    body: "'Inter', sans-serif",
  },

  // Hero section
  hero: {
    title: "White Elephant 2025",
    subtitle: "The annual gift exchange where your friends' questionable taste meets your competitive spirit",
    tagline: "Saturday, December 13, 2025 • 6:30 PM",
    cta: {
      primary: "Reserve Your Spot →",
      secondary: "View the Rules"
    },
    backgroundVideo: "/media/elephant/snow-bg.mp4",
    backgroundImage: "/media/elephant/presents.jpg",
  },

  // Navigation
  nav: {
    links: [
      { label: "Home", path: "/" },
      { label: "Rules", path: "/rules" },
      { label: "RSVP", path: "/rsvp" },
    ]
  },

  // Sections copy
  sections: {
    // Home page sections
    details: {
      title: "The Details",
      items: [
        {
          icon: "🎁",
          title: "Bring a Gift",
          description: "$20-40 range. Couples can bring one gift and play as a team, or bring two gifts and compete individually. Anything goes: tequila to sex toys to landscape lighting, heated bidet seats, Danny DeVito cardboard cutouts.",
        },
        {
          icon: "🍲",
          title: "Food & Drinks",
          description: "We're making chili! Bring something to share if you'd like — drinks, desserts, or your famous guac. The more, the merrier!",
        },
        {
          icon: "🎲",
          title: "The Game",
          description: "Classic White Elephant rules apply. Numbers are drawn, gifts are opened, chaos ensues. Stealing is encouraged. Friendships may be tested.",
        },
      ]
    },

    music: {
      title: "Get in the Mood",
      description: "Official White Elephant Party 2025 Playlist",
    },

    game: {
      title: "Practice Your Skills",
      description: "Play Present Tetris while you wait for the party!",
    },

    // Rules page
    rules: {
      title: "The Rules",
      subtitle: "Simple chaos. Maximum fun.",
      items: [
        {
          number: 1,
          title: "Bring a wrapped gift",
          description: "Budget: $20-40. Make it good, make it weird, make it memorable. Couples can team up with one gift or compete with two.",
        },
        {
          number: 2,
          title: "Draw numbers",
          description: "Everyone picks a number. That's your turn order. #1 goes first (and gets an extra steal at the end).",
        },
        {
          number: 3,
          title: "Pick or steal",
          description: "On your turn: unwrap a new gift OR steal someone's already-opened gift. Choose violence wisely.",
        },
        {
          number: 4,
          title: "Three-steal limit",
          description: "Each gift can only be stolen 3 times. After that, it's locked. The third thief gets to keep it forever (or until next year).",
        },
        {
          number: 5,
          title: "No immediate steal-backs",
          description: "If someone steals from you, you can't immediately steal it back. That's just petty. Wait your turn.",
        },
        {
          number: 6,
          title: "Steal chains are allowed",
          description: "Someone steals from you? Steal from someone else. Chaos is part of the fun.",
        },
        {
          number: 7,
          title: "Last person picks",
          description: "Person with the highest number goes last and can either unwrap the final gift or steal anything on the table.",
        },
        {
          number: 8,
          title: "Person #1 gets revenge",
          description: "After everyone's had their turn, Person #1 gets one final chance to swap. It's delayed gratification, but with vengeance.",
        },
        {
          number: 9,
          title: "Game ends when it ends",
          description: "When all gifts are claimed and the final swap is made, the game is over. Everyone goes home with something. Hopefully something good.",
        },
      ]
    },

    // RSVP page
    rsvp: {
      title: "RSVP",
      subtitle: "Secure your spot at the chaos",
      attending: {
        yes: "Yes, I'll be there!",
        no: "Can't make it"
      },
      success: {
        attending: "You're In!",
        notAttending: "Sorry you can't make it",
        message: "Can't wait, {name}!",
        checkEmail: "Check {email} for details",
      }
    }
  },

  // Media assets
  media: {
    heroBg: "/media/elephant/snow-bg.mp4",
    heroFallback: "/media/elephant/presents.jpg",
    gallery: [
      "/media/elephant/presents.jpg",
      "/media/elephant/elf-lights.jpg",
      "/media/elephant/party-group.jpg",
    ]
  },

  // Animations & effects
  effects: {
    snowfall: true,
    sleighAnimation: true,
    particleColor: "#ffffff",
    glowColor: "#ef4444",
  },

  // Footer
  footer: {
    tagline: "No Scrooges allowed!",
    copyright: "White Elephant Party 2025",
  }
};
