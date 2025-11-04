/**
 * Central Event Configuration
 * Update these values to change event details across the entire site
 */

export const EVENT_CONFIG = {
  // Event Details
  name: 'White Elephant Party 2025',
  heistName: 'The Great Gift Heist: Operation Santa\'s Manifest',
  date: '2025-12-13',
  time: '18:30', // 24-hour format
  timeDisplay: '6:30 PM',
  heistTime: '19:00',
  heistTimeDisplay: '1900 hours',
  timezone: 'AST',
  timezoneIANA: 'America/Puerto_Rico',
  
  // Location
  location: {
    name: 'The Beer Box',
    address: '123 Holiday Lane',
    city: 'San Juan',
    state: 'PR',
    zip: '00901',
    coordinates: {
      lat: 18.4655,
      lng: -66.1057
    },
    mapUrl: 'https://maps.google.com/?q=The+Beer+Box+San+Juan+PR',
    heistName: 'Tactical HQ',
    heistDescription: 'Classified Location'
  },

  // Gift Exchange Rules
  giftBudget: {
    min: 20,
    max: 40,
    currency: '$'
  },

  // Contact Info
  contact: {
    hostName: 'Ryan',
    hostEmail: 'ryan@example.com',
    adminEmail: 'jenny.bradshaw@gmail.com',
    replyTo: 'ryan@example.com'
  },

  // WhatsApp Secret Group
  whatsapp: {
    enabled: true,
    groupName: '🎁 The Great Gift Heist – Agents Only',
    inviteLink: 'https://chat.whatsapp.com/YOUR_INVITE_CODE_HERE', // Replace with actual link
    partyGroupName: '🎄 White Elephant Party 2025',
    partyInviteLink: 'https://chat.whatsapp.com/YOUR_PARTY_INVITE_CODE_HERE' // Replace with actual link
  },

  // Email Service Configuration
  email: {
    service: 'emailjs', // 'emailjs' or 'resend'
    // EmailJS Config (if using EmailJS)
    emailjs: {
      serviceId: 'YOUR_SERVICE_ID',
      confirmationTemplateId: 'YOUR_CONFIRMATION_TEMPLATE_ID',
      reminderTemplateId: 'YOUR_REMINDER_TEMPLATE_ID',
      publicKey: 'YOUR_PUBLIC_KEY'
    },
    // Resend Config (if using Resend)
    resend: {
      apiKey: 'YOUR_RESEND_API_KEY',
      fromEmail: 'hq@thegreatgiftheist.com',
      fromName: 'Santa\'s Intelligence Division'
    }
  },

  // SMS Configuration (optional)
  sms: {
    enabled: false, // Set to true to enable SMS reminders
    service: 'twilio', // 'twilio' or 'keap'
    twilioAccountSid: 'YOUR_ACCOUNT_SID',
    twilioAuthToken: 'YOUR_AUTH_TOKEN',
    twilioPhoneNumber: '+1234567890'
  },

  // PWA Configuration
  pwa: {
    enabled: true,
    name: 'North Pole Comms Device',
    shortName: 'NP Comms',
    description: 'Your secure communication channel for Operation Santa\'s Manifest',
    themeColor: '#020617',
    backgroundColor: '#020617',
    // Push Notifications
    pushNotifications: {
      enabled: false, // Set to true when ready
      service: 'firebase', // 'firebase' or 'onesignal'
      vapidKey: 'YOUR_VAPID_KEY'
    }
  },

  // Feature Flags
  features: {
    rsvpEnabled: true,
    reminderEmails: true,
    reminderSMS: false,
    whatsappIntegration: true,
    codenameGenerator: true,
    adminGuestList: true,
    calendarExport: true,
    pwaInstall: true,
    accessGate: true // Enable/disable the access code gate
  },

  // Access Gate Configuration
  accessGate: {
    enabled: true,
    universalCode: 'RED-SLEIGH-2025', // Universal access code
    requireCode: true, // Set to false to disable access gate entirely
    sessionKey: 'heist_access_granted',
    // VIP codes unlock special features
    vipCodes: ['SANTA-ACTUAL', 'ELF-PRIME', 'NORTH-POLE-1'],
    // Individual agent codes (can be generated on RSVP)
    agentCodes: [
      { code: 'GGH-02FROSTBYTE', name: 'Agent Frosty', used: false },
      { code: 'GGH-07TINSELSTORM', name: 'Agent Jingle', used: false },
      { code: 'GGH-13COCOACOMMANDER', name: 'Agent Cocoa', used: false },
      // Add more codes as guests RSVP
    ]
  },

  // Countdown Configuration
  countdown: {
    targetDate: '2025-12-13T18:30:00', // ISO format for party
    heistTargetDate: '2025-12-13T19:00:00', // ISO format for heist
    showCountdown: true
  },

  // Reminder Schedule
  reminders: {
    weekBefore: {
      enabled: true,
      daysBeforeEvent: 7,
      subject: 'Mission Update: T-minus 7 days'
    },
    dayBefore: {
      enabled: true,
      daysBeforeEvent: 1,
      subject: 'Mission Activation: Tomorrow at 1900 hours'
    },
    hourseBefore: {
      enabled: true,
      hoursBeforeEvent: 2,
      subject: 'Final Alert: Mission starts in 2 hours'
    }
  }
};

// Helper functions
export const getEventDate = () => new Date(EVENT_CONFIG.date + 'T' + EVENT_CONFIG.time);
export const getHeistEventDate = () => new Date(EVENT_CONFIG.date + 'T' + EVENT_CONFIG.heistTime);
export const getDaysUntilEvent = () => {
  const now = new Date();
  const eventDate = getEventDate();
  const diffTime = eventDate - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const formatEventDate = (heistTheme = false) => {
  const date = new Date(EVENT_CONFIG.date);
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = date.toLocaleDateString('en-US', options);
  const time = heistTheme ? EVENT_CONFIG.heistTimeDisplay : EVENT_CONFIG.timeDisplay;
  return `${formattedDate} • ${time} ${EVENT_CONFIG.timezone}`;
};

export default EVENT_CONFIG;
