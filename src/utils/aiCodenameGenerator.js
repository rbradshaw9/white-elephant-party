/**
 * AI-Powered Codename Generator
 * Uses OpenAI to create personalized elf-themed agent codenames
 * Ensures uniqueness by checking against backend registry
 */

import api from './api';

// Store your OpenAI API key here (we'll use environment variable in production)
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';

/**
 * Quiz questions for personality-based codename generation
 */
export const QUIZ_QUESTIONS = [
  {
    id: 'weapon',
    question: 'Pick your secret weapon:',
    emoji: '🎯',
    options: [
      { value: 'cookie', label: '🍪 Cookie', trait: 'sweet and sneaky' },
      { value: 'snowball', label: '❄️ Snowball', trait: 'bold and playful' },
      { value: 'candy-cane', label: '🍭 Candy Cane', trait: 'sharp and festive' },
      { value: 'hot-cocoa', label: '☕ Hot Cocoa', trait: 'warm and comforting' }
    ]
  },
  {
    id: 'style',
    question: 'Your mission style:',
    emoji: '💼',
    options: [
      { value: 'stealth', label: '🥷 Stealth Mode', trait: 'mysterious and quiet' },
      { value: 'chaos', label: '🎪 Maximum Chaos', trait: 'energetic and unpredictable' },
      { value: 'charm', label: '✨ Pure Charm', trait: 'charismatic and sparkly' },
      { value: 'strategy', label: '🧠 Strategic', trait: 'clever and calculated' }
    ]
  },
  {
    id: 'vibe',
    question: 'Your holiday vibe:',
    emoji: '🎄',
    options: [
      { value: 'cozy', label: '🔥 Cozy Nights', trait: 'snuggly and peaceful' },
      { value: 'festive', label: '🎉 Party Time', trait: 'joyful and celebratory' },
      { value: 'magical', label: '⭐ Pure Magic', trait: 'whimsical and enchanting' },
      { value: 'mischief', label: '😈 Mischievous', trait: 'playful and cheeky' }
    ]
  }
];

/**
 * Get time-based context for codename generation
 */
const getTimeContext = () => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return { period: 'morning', flavor: 'fresh and energetic' };
  } else if (hour >= 12 && hour < 17) {
    return { period: 'afternoon', flavor: 'bright and warm' };
  } else if (hour >= 17 && hour < 21) {
    return { period: 'evening', flavor: 'cozy and mysterious' };
  } else {
    return { period: 'night', flavor: 'quiet and magical' };
  }
};

/**
 * Generate AI-powered elf codename based on quiz answers
 * Ensures uniqueness by checking backend registry and retrying if needed
 * @param {Object} answers - Quiz answers { weapon: '', style: '', vibe: '' }
 * @param {boolean} isHeistTheme - Whether heist theme is active
 * @param {number} maxRetries - Maximum retry attempts for uniqueness
 * @returns {Promise<string>} - Generated unique codename
 */
export const generateAICodename = async (answers, isHeistTheme = false, maxRetries = 5) => {
  if (!OPENAI_API_KEY) {
    console.warn('No OpenAI API key found, falling back to random generation');
    return generateFallbackCodename();
  }

  let attempts = 0;
  let codename = '';

  while (attempts < maxRetries) {
    try {
      codename = await generateCodenameFromAI(answers, isHeistTheme);
      
      // Check if codename is unique via backend
      const { available } = await api.checkCodename(codename);
      
      if (available) {
        // Register it in backend and return
        await api.registerCodename(codename);
        return codename;
      }
      
      console.log(`Codename "${codename}" already taken, generating another...`);
      attempts++;
    } catch (error) {
      console.error('AI generation attempt failed:', error);
      attempts++;
    }
  }

  // If we exhausted retries with AI, fall back to random
  console.warn('Max AI retries reached, using fallback generator');
  return generateFallbackCodename();
};

/**
 * Internal function to call OpenAI API
 */
const generateCodenameFromAI = async (answers, isHeistTheme) => {
  try {
    // Build personality profile from answers
    const traits = QUIZ_QUESTIONS.map(q => {
      const selectedOption = q.options.find(opt => opt.value === answers[q.id]);
      return selectedOption?.trait || '';
    }).filter(Boolean);

    const timeContext = getTimeContext();
    const themeContext = isHeistTheme ? 'mysterious spy operation' : 'cheerful holiday party';

    // Create prompt for OpenAI
    const prompt = `You are Santa's special codename generator for The Great Gift Heist party. Generate ONE creative elf-themed codename based on these traits:

Personality: ${traits.join(', ')}
Time: ${timeContext.period} (${timeContext.flavor})
Theme: ${themeContext}

Requirements:
- Must be TWO words: [Adjective] [Noun]
- First word should be a festive/winter adjective (like: Sparkle, Jolly, Frosty, Twinkle, Cozy, Midnight, Shadow, Shimmer)
- Second word should be a Christmas/winter noun (like: Snowflake, Cookie, Bells, Cocoa, Mittens, Starlight, Candy)
- Make it fun, memorable, and match their personality
- ${isHeistTheme ? 'Lean slightly mysterious/cool' : 'Lean cheerful and cute'}

Return ONLY the two-word codename, nothing else.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a creative codename generator for a holiday party game. Generate fun, festive elf-themed codenames.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 20,
        temperature: 0.9
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const codename = data.choices[0]?.message?.content?.trim();

    if (codename) {
      return codename;
    }

    throw new Error('No codename generated');
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
};

/**
 * Fallback random codename generator (if API fails)
 * Ensures uniqueness by checking backend registry and retrying
 */
const generateFallbackCodename = async () => {
  const maxAttempts = 50; // Prevent infinite loop
  let attempts = 0;

  while (attempts < maxAttempts) {
    const codename = generateRandomCodename();
    
    try {
      const { available } = await api.checkCodename(codename);
      
      if (available) {
        await api.registerCodename(codename);
        return codename;
      }
    } catch (error) {
      console.error('Error checking codename:', error);
      // If backend is down, just return the codename
      return codename;
    }
    
    attempts++;
  }

  // Last resort: add a number suffix
  const baseCodename = generateRandomCodename();
  const uniqueCodename = `${baseCodename} ${Math.floor(Math.random() * 100)}`;
  
  try {
    await api.registerCodename(uniqueCodename);
  } catch (error) {
    console.error('Failed to register fallback codename:', error);
  }
  
  return uniqueCodename;
};

/**
 * Generate a random codename without checking uniqueness
 */
const generateRandomCodename = () => {
  const adjectives = [
    'Jolly', 'Merry', 'Sparkle', 'Twinkle', 'Frosty', 'Snowy', 'Sugar', 'Candy',
    'Ginger', 'Peppermint', 'Cinnamon', 'Cocoa', 'Jingle', 'Tinsel', 'Glitter',
    'Mistletoe', 'Holly', 'Starlight', 'Moonbeam', 'Crystal', 'Shimmer', 'Cozy'
  ];
  
  const nouns = [
    'Boots', 'Bells', 'Snowflake', 'Cookie', 'Mittens', 'Muffin', 'Cocoa',
    'Pudding', 'Gumdrops', 'Stocking', 'Ornament', 'Ribbon', 'Wreath', 'Sleigh',
    'Reindeer', 'Icicle', 'Pine', 'Star', 'Candle', 'Chestnuts', 'Snowball'
  ];

  const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

  return `${randomAdj} ${randomNoun}`;
};

export default generateAICodename;
