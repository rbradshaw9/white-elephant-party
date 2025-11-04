/**
 * North Pole Terminal Theme Configuration
 * Christmas-themed agent terminology instead of spy/heist
 */

export const NORTH_POLE_THEME = {
  // Terminal branding
  terminalName: "NORTH POLE INTELLIGENCE",
  organization: "Santa's Secret Service",
  operation: "Operation Santa's Manifest",
  
  // Agent terminology
  agent: {
    title: "Elf Agent",
    titlePlural: "Elf Agents",
    handler: "North Pole Command",
    base: "North Pole HQ",
    clearance: "Nice List Clearance",
  },
  
  // Mission terminology
  mission: {
    name: "The Great Gift Heist",
    objective: "Execute the perfect White Elephant exchange",
    briefing: "Mission Briefing from Santa's Workshop",
    status: {
      confirmed: "MISSION ACCEPTED 🎁",
      declined: "MISSION DECLINED",
      pending: "AWAITING CONFIRMATION ⏳"
    }
  },
  
  // Communication terminology  
  comms: {
    transmission: "Workshop Transmission",
    intel: "Gift Intel",
    alert: "Candy Cane Alert",
    message: "Snow Globe Message"
  },
  
  // Personality/codename generation themes
  personality: {
    vibe: "Christmas Spirit Assessment",
    traits: "Holiday Personality Profile",
    assessment: "Festive Character Analysis"
  },
  
  // RSVP terminology
  rsvp: {
    accept: "Join the Mission",
    decline: "Skip This Year",
    maybe: "Still Deciding",
    guests: "Additional Elves",
    guestSingular: "helper elf",
    guestPlural: "helper elves"
  },
  
  // System messages
  system: {
    booting: [
      "INITIALIZING NORTH POLE NETWORK...",
      "CONNECTING TO SANTA'S DATABASE...",
      "LOADING NICE LIST PROTOCOLS...",
      "CANDY CANE ENCRYPTION: ACTIVE",
      "JINGLE BELL SECURITY: ENABLED",
      "SYSTEM READY - HO HO HO!"
    ],
    loading: "Consulting with the elves...",
    saving: "Updating Nice List database...",
    error: "Oops! Looks like the gingerbread server is down",
    success: "Mission profile updated! ✨"
  },
  
  // Interactive prompts
  prompts: {
    giftIdeas: "🎁 Gift Ideas (Budget: $25-50)",
    menu: "🍪 Party Menu Intel",
    rules: "📜 White Elephant Rules",
    profile: "🎯 View Your Elf Card",
    exit: "🚪 Leave Workshop Terminal"
  },
  
  // Visual elements
  visual: {
    primaryColor: "christmas-red", // #DC2626
    secondaryColor: "evergreen", // #047857
    accentColor: "golden", // #FCD34D
    sparkleColor: "snow-white", // #F8FAFC
    terminalGlow: "candy-cane-glow" // Red/white stripe effect
  }
};

export default NORTH_POLE_THEME;
