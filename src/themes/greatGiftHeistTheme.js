/**
 * The Great Gift Heist Theme
 * Cinematic heist operation - Ocean's 11 meets Elf
 * Mission-focused, immersive caper experience
 */
export default {
  name: "The Great Gift Heist",
  slug: "great-gift-heist",
  
  // Color palette - deep navy, icy blues, crimson, gold sparkle
  palette: {
    primary: "#dc2626", // crimson red-600
    secondary: "#0ea5e9", // sky blue-500
    accent: "#fbbf24", // gold amber-400
    background: "#020617", // deeper slate-950
    surface: "rgba(14, 165, 233, 0.08)", // icy blue glass
    text: {
      primary: "#f8fafc", // slate-50
      secondary: "#cbd5e1", // slate-300
      muted: "#64748b", // slate-500
    },
    gradients: {
      hero: "from-sky-400 via-blue-500 to-cyan-500",
      button: "from-sky-600 via-sky-500 to-cyan-500",
      buttonAlt: "from-red-600 to-red-700",
      spotlight: "radial-gradient(circle, rgba(251,191,36,0.3) 0%, transparent 70%)",
      vault: "from-slate-950 via-blue-950 to-slate-900",
    }
  },

  // Typography
  fonts: {
    display: "'Bebas Neue', sans-serif", // cinematic all-caps
    body: "'Inter', sans-serif",
  },

  // Story & Mission
  story: {
    classification: "TOP SECRET",
    division: "North Pole Intelligence Division",
    operation: "Operation Santa's Manifest",
    brief: "Santa's sleigh manifest has been compromised. The Naughty Network intercepted the route data and scrambled every gift's destination. The elves can't fix it. The reindeer refuse to fly without union representation. So, Santa's activating a covert ground unit: The Gift Recovery Crew.",
    mission: "Your mission is simple — steal back Christmas. Each operative must infiltrate HQ on December 13 at 1900 hours, armed with a wrapped 'decoy package' (value ≤ $25). Once the mission begins, chaos is inevitable. Alliances will form. Gifts will vanish. Only one rule stands: no gift leaves un-stolen.",
    closing: "Report to Command for your assignment, Agent.",
  },

  // Hero section
  hero: {
    classification: "⚠️ CLASSIFIED INTEL",
    title: "The Great Gift Heist",
    subtitle: "This December, the gifts are up for grabs. Santa's manifest is compromised. The crew is assembling. Your mission starts now.",
    tagline: "MISSION START: DECEMBER 13, 2025 • 19:00 HOURS",
    additionalCopy: "You've heard of White Elephant… but have you been part of the Heist?",
    cta: {
      primary: "Accept Mission",
      secondary: "View Mission Brief"
    },
    backgroundVideo: "/media/heist/hero-bg.mp4",
    backgroundImage: "/media/heist/vault-bg.jpg",
  },

  // Navigation
  nav: {
    links: [
      { label: "Command Center", path: "/" },
      { label: "Mission Brief", path: "/rules" },
      { label: "Agent Recruitment", path: "/rsvp" },
    ]
  },

  // Sections copy
  sections: {
    // Home page sections
    intel: {
      title: "Mission Parameters",
      classification: "INTEL BRIEF #2025-12",
      items: [
        {
          icon: "🎯",
          title: "The Objective",
          description: "Each operative brings one wrapped decoy package valued at $20-40. Contents classified. Previous operations have yielded everything from premium spirits to tactical landscape lighting. One agent once brought a heated bidet seat. Another deployed a life-size cardboard cutout of Danny DeVito. Expect the unexpected.",
        },
        {
          icon: "📍",
          title: "HQ Location",
          description: "Safe house coordinates will be transmitted upon mission acceptance. Base of operations will be stocked with tactical refreshments (chili). Additional provisions welcome. This is a team effort — covert ops run on good food and better company.",
        },
        {
          icon: "⚡",
          title: "The Protocol",
          description: "Classic infiltration rules apply. Draw your entry code. Acquire or liberate packages. Strategic theft is not only permitted — it's required. Trust no one. Alliances are temporary. Only the mission matters.",
        },
      ]
    },

    vault: {
      title: "The Vault",
      subtitle: "Surveillance Footage from Last Year's Operation",
      description: "Security stills from Operation Santa's Manifest 2024 — laughs, chaos, and criminally bad wrapping paper.",
    },

    countdown: {
      title: "Mission Countdown",
      description: "Time until infiltration begins",
    },

    // Rules page (Mission Brief)
    rules: {
      title: "Mission Brief",
      subtitle: "⚠️ CLASSIFIED – FOR AGENT EYES ONLY",
      classification: "DOCUMENT #WE-2025-MB",
      briefing: "Your objective: infiltrate HQ on time, bring a wrapped decoy package, and prepare for tactical chaos. Gifts will be acquired. Alliances will be tested. Laughter is mandatory.",
      items: [
        {
          number: 1,
          title: "Acquire Your Decoy Package",
          description: "Target value: $20-40. Conceal in festive wrapping. Make it memorable. Make it absurd. Make it legendary. Operatives may work in pairs (one package) or go solo (two packages). Choose wisely.",
        },
        {
          number: 2,
          title: "Draw Your Entry Code",
          description: "Each operative receives a randomly assigned number. This determines infiltration order. Operative #1 enters first and receives a bonus extraction opportunity at mission's end.",
        },
        {
          number: 3,
          title: "Secure or Liberate",
          description: "On your turn: claim an unopened package from The Vault OR execute a tactical acquisition from another operative's possession. Choose your target wisely. Some gifts are worth fighting for. Others… less so.",
        },
        {
          number: 4,
          title: "Three-Acquisition Maximum",
          description: "Each package can be stolen a maximum of three times. After the third acquisition, it's permanently locked to that operative. The final thief claims permanent possession. Plan accordingly.",
        },
        {
          number: 5,
          title: "No Immediate Counter-Acquisition",
          description: "If you're robbed, you cannot immediately retaliate against the same operative. That's bad form. Redirect your vengeance elsewhere. Revenge is a dish best served to someone else's gift pile.",
        },
        {
          number: 6,
          title: "Acquisition Chains Authorized",
          description: "Stolen from? Steal from someone else. The chaos is part of the operation. Alliances will form. Trust will be broken. Laughs will be had. It's all part of the mission.",
        },
        {
          number: 7,
          title: "Final Operative Advantage",
          description: "Highest entry code goes last. They can claim the final unopened package or execute one strategic acquisition from the board. Knowledge is power. Use it.",
        },
        {
          number: 8,
          title: "Operative #1 Extraction Protocol",
          description: "After all operatives have completed their turns, Operative #1 gets one final swap opportunity. Patience is a virtue. Revenge is sweeter. Make it count.",
        },
        {
          number: 9,
          title: "Mission Complete",
          description: "When all packages are claimed and final acquisitions executed, the operation concludes. Everyone extracts with something. Hopefully something good. No guarantees. Mission success is defined by laughter, not loot.",
        },
      ]
    },

    // RSVP page (Agent Recruitment)
    rsvp: {
      title: "Agent Recruitment",
      subtitle: "⚠️ CLASSIFIED OPERATION – ACCEPTANCE REQUIRED",
      classification: "RECRUITMENT FORM #2025",
      briefing: "Every heist needs a solid crew. Are you in?",
      attending: {
        yes: "Accept Mission",
        no: "Decline Mission"
      },
      success: {
        attending: "Mission Accepted",
        notAttending: "Mission Declined",
        message: "Welcome to the crew, Agent {name}.",
        messageDenied: "Your declination has been noted, Agent {name}. You'll be missed in the field.",
        checkEmail: "Mission briefing transmitted to {email}",
        accessGranted: "🔓 ACCESS GRANTED",
      },
      fields: {
        name: "Agent Name",
        email: "Secure Communication Channel",
        guests: "Additional Operatives",
        dietary: "Tactical Dietary Requirements",
        reminder: "Mission Reminder Protocol",
      }
    }
  },

    // Codename generator arrays - Elf-themed holiday names
  codenames: {
    adjectives: [
      'Jolly', 'Merry', 'Sparkle', 'Twinkle', 'Frosty',
      'Snowy', 'Sugar', 'Candy', 'Ginger', 'Peppermint',
      'Cinnamon', 'Cocoa', 'Jingle', 'Tinsel', 'Glitter',
      'Mistletoe', 'Holly', 'Evergreen', 'Starlight', 'Moonbeam',
      'Crystal', 'Shimmer', 'Cozy', 'Cheerful', 'Fuzzy',
      'Snuggles', 'Buttons', 'Sprinkles', 'Nutmeg', 'Marshmallow'
    ],
    nouns: [
      'Boots', 'Bells', 'Snowflake', 'Cookie', 'Mittens',
      'Muffin', 'Cocoa', 'Pudding', 'Gumdrops', 'Stocking',
      'Ornament', 'Ribbon', 'Wreath', 'Sleigh', 'Reindeer',
      'Icicle', 'Pine', 'Star', 'Candle', 'Nog',
      'Plum', 'Figgy', 'Chestnuts', 'Snowball', 'Scarf',
      'Toes', 'Cheeks', 'Nose', 'Whiskers', 'Giggles'
    ]
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
    snowfall: true, // subtle icy particles
    sleighAnimation: false, // no sleigh for heist
    particleColor: "#0ea5e9", // icy blue particles
    glowColor: "#fbbf24", // gold spotlight glow
    spotlight: true,
    vaultTransition: true,
    motionBlur: true,
    lightLeaks: true,
    dossierSlide: true,
  },

  // Footer
  footer: {
    tagline: "The Great Gift Heist — Because stealing gifts is way more fun than buying them.",
    copyright: "Operation Santa's Manifest • North Pole Intelligence Division • Est. 2025",
    classification: "DOCUMENT DESTRUCTION DATE: DEC 14, 2025"
  }
};
