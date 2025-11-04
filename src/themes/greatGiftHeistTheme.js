/**
 * The Great Gift Heist Theme
 * Cinematic heist movie meets Christmas - Ocean's 11 vibes
 */
export default {
  name: "The Great Gift Heist",
  slug: "great-gift-heist",
  
  // Color palette - deep navy, icy blues, crimson, gold sparkle
  palette: {
    primary: "#dc2626", // crimson red-600
    secondary: "#3b82f6", // icy blue-500
    accent: "#fbbf24", // gold amber-400
    background: "#0a0e1a", // deep navy
    surface: "rgba(59, 130, 246, 0.08)", // icy blue glass
    text: {
      primary: "#f8fafc", // slate-50
      secondary: "#cbd5e1", // slate-300
      muted: "#64748b", // slate-500
    },
    gradients: {
      hero: "from-blue-400 via-cyan-300 to-blue-500",
      button: "from-blue-600 via-blue-500 to-cyan-500",
      buttonAlt: "from-red-600 to-red-700",
      spotlight: "radial-gradient(circle, rgba(251,191,36,0.3) 0%, transparent 70%)",
    }
  },

  // Typography
  fonts: {
    display: "'Bebas Neue', sans-serif", // cinematic titles
    body: "'Inter', sans-serif",
  },

  // Hero section
  hero: {
    title: "The Great Gift Heist",
    subtitle: "Every December, the city's most daring holiday caper returns. One night. Dozens of gifts. Infinite chaos.",
    tagline: "Mission Date: December 13, 2025 • 18:30 Hours",
    cta: {
      primary: "Join the Heist",
      secondary: "Mission Brief"
    },
    backgroundVideo: "/media/heist/hero-bg.mp4",
    backgroundImage: "/media/heist/vault-bg.jpg",
    additionalCopy: "You've heard of White Elephant… but have you been part of the Heist?",
  },

  // Navigation
  nav: {
    links: [
      { label: "Home", path: "/" },
      { label: "Mission Brief", path: "/rules" },
      { label: "Join the Crew", path: "/rsvp" },
    ]
  },

  // Sections copy
  sections: {
    // Home page sections
    details: {
      title: "The Mission Parameters",
      items: [
        {
          icon: "💎",
          title: "The Score",
          description: "Each operative brings one wrapped package valued at $20-40. Contents classified. Could be premium spirits, contraband electronics, or a cardboard cutout of a B-list celebrity. Intel suggests previous heists yielded everything from landscape lighting to heated bidets.",
        },
        {
          icon: "🍸",
          title: "Safe House Provisions",
          description: "Base of operations will be stocked with chili. Operatives encouraged to bring additional supplies — beverages, tactical snacks, or covert desserts. This is a team effort.",
        },
        {
          icon: "🎯",
          title: "The Protocol",
          description: "Classic infiltration rules apply. Draw your entry code. Acquire or liberate packages. Strategic theft is not only permitted — it's encouraged. Trust no one.",
        },
      ]
    },

    music: {
      title: "Soundtrack for the Caper",
      description: "The Official Heist Playlist — for planning your strategy",
    },

    game: {
      title: "Train for the Mission",
      description: "Test your reflexes with Present Tetris. Every great heist needs preparation.",
    },

    // Rules page (Mission Brief)
    rules: {
      title: "Mission Brief",
      subtitle: "Your objective: arrive on time, bring a wrapped gift, and prepare for laughter and larceny.",
      items: [
        {
          number: 1,
          title: "Acquire a package",
          description: "Target value: $20-40. Conceal in festive wrapping. Make it memorable. Operatives may work in pairs (one package) or go rogue (two packages).",
        },
        {
          number: 2,
          title: "Draw your entry code",
          description: "Each operative receives a number. This determines infiltration order. Operative #1 enters first and receives a bonus extraction at mission's end.",
        },
        {
          number: 3,
          title: "Secure or liberate",
          description: "On your turn: claim an unopened package OR liberate an already-revealed item from another operative. Choose your target wisely.",
        },
        {
          number: 4,
          title: "Three-theft maximum",
          description: "Each package can be stolen three times. After the third theft, it's locked down. The final thief claims permanent possession.",
        },
        {
          number: 5,
          title: "No immediate counter-theft",
          description: "If you're robbed, you cannot immediately retaliate against the same operative. That's bad form. Redirect your vengeance elsewhere.",
        },
        {
          number: 6,
          title: "Theft chains authorized",
          description: "Stolen from? Steal from someone else. The chaos is part of the operation. Alliances will be broken. Laughs will be had.",
        },
        {
          number: 7,
          title: "Final operative advantage",
          description: "Highest number goes last. They can claim the final package or execute one strategic theft from the board.",
        },
        {
          number: 8,
          title: "Operative #1 extraction",
          description: "After all operatives have acted, #1 gets one final swap. Patience is a virtue. Revenge is sweeter.",
        },
        {
          number: 9,
          title: "Mission complete",
          description: "When all packages are claimed and final swaps executed, the heist concludes. Everyone leaves with something. Hopefully something good. No guarantees.",
        },
      ]
    },

    // RSVP page (Join the Crew)
    rsvp: {
      title: "Join the Crew",
      subtitle: "Every heist needs a solid team. Are you in?",
      attending: {
        yes: "I'm in",
        no: "I'm out"
      },
      success: {
        attending: "Welcome to the Crew!",
        notAttending: "Mission aborted",
        message: "Good to have you aboard, {name}.",
        checkEmail: "Mission briefing sent to {email}",
      }
    }
  },

  // Media assets
  media: {
    heroBg: "/media/heist/hero-bg.mp4",
    heroFallback: "/media/heist/vault-bg.jpg",
    gallery: [
      "/media/heist/vault-bg.jpg",
      "/media/heist/gift-pile.jpg",
      "/media/heist/crew-photo.jpg",
    ]
  },

  // Animations & effects
  effects: {
    snowfall: true, // keep snow but subtle
    sleighAnimation: false, // no sleigh for heist theme
    particleColor: "#3b82f6", // icy blue particles
    glowColor: "#fbbf24", // gold spotlight glow
    spotlight: true,
    vaultTransition: true,
    motionBlur: true,
  },

  // Footer
  footer: {
    tagline: "The Great Gift Heist — Because stealing gifts is way more fun than buying them.",
    copyright: "Operation White Elephant • Est. 2025",
  }
};
