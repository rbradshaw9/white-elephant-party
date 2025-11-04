/**
 * AI-Powered Conversation System for HQ Terminal
 * Uses OpenAI to create dynamic, personalized agent onboarding
 */

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';

/**
 * Generate next AI question based on conversation history
 * @param {Array} conversationHistory - Array of {role: 'user'|'assistant', content: string}
 * @param {string} agentName - The agent's real name
 * @param {number} questionNumber - Current question number (1-5)
 * @returns {Promise<string>} - The next question to ask
 */
export async function generateNextQuestion(conversationHistory, agentName, questionNumber) {
  if (!OPENAI_API_KEY) {
    console.warn('No OpenAI API key found, using fallback questions');
    return getFallbackQuestion(questionNumber);
  }

  try {
    const systemPrompt = `You are "HQ" - the AI handler for The Great Gift Heist, a Christmas white elephant party with a playful spy/heist theme. You're onboarding a new agent named ${agentName}.

Your job: Ask ${questionNumber} of 3-5 personality questions to learn about them. The questions should:
1. Be fun, casual, and personality-revealing
2. Relate to gifts, holidays, Christmas, heists, or spy themes
3. Build on their previous answers to create a natural conversation
4. Help you understand their personality to generate a perfect codename later
5. Keep the tone playful and slightly mysterious (like a friendly spy handler)

Examples of good questions:
- "If you could steal ONE gift from Santa's workshop, what would it be and why?"
- "Are you more of a 'wrap it perfectly' or 'gift bag and go' person?"
- "On a scale of 1-10, how likely are you to actually follow the $25-50 gift budget? Be honest."
- "If this party was a heist movie, what role would you play?"
- "What's your go-to move when you see someone about to steal your gift?"

Ask ONE question at a time. Make it conversational and reference their previous answer if relevant.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory
        ],
        max_tokens: 150,
        temperature: 0.8
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content?.trim() || getFallbackQuestion(questionNumber);
  } catch (error) {
    console.error('Error generating next question:', error);
    return getFallbackQuestion(questionNumber);
  }
}

/**
 * Generate AI-powered codename based on personality conversation
 * @param {string} agentName - The agent's real name
 * @param {Array} personalityResponses - Array of user's answers
 * @returns {Promise<string>} - Generated codename
 */
export async function generateAICodename(agentName, personalityResponses) {
  if (!OPENAI_API_KEY) {
    console.warn('No OpenAI API key found, using fallback codename');
    return generateFallbackCodename();
  }

  try {
    const personalityProfile = personalityResponses.join('\n- ');
    
    const systemPrompt = `You are Santa's elite Codename Generator for The Great Gift Heist - a Christmas white elephant party with a playful spy theme. You create magical, memorable elf-style agent codenames.

Your specialty: Matching personality to perfectly festive, Christmas-themed codenames that sound like they belong in Santa's workshop crossed with a spy movie.

CRITICAL RULES:
1. ALWAYS use Christmas/winter/elf themes - never generic spy names
2. Must be EXACTLY 2 words: [Christmas Adjective] [Christmas Noun]
3. Both words MUST be festive/winter/holiday related
4. Make it match their personality while staying Christmas-themed
5. Return ONLY the codename - no quotes, no explanations

APPROVED ADJECTIVES (use these or similar Christmas themes):
Jolly, Merry, Sparkle, Twinkle, Frosty, Snowy, Sugar, Candy, Ginger, Peppermint, Cinnamon, Cocoa, Jingle, Tinsel, Glitter, Mistletoe, Holly, Starlight, Moonbeam, Crystal, Shimmer, Cozy, Silent, Golden, Silver, Midnight (for night owls), Shadow (for mysterious types), Whisper, Arctic, Frosted, Icy, Evergreen, Pine, Nutmeg, Clove, Velvet, Crimson, Emerald

APPROVED NOUNS (use these or similar Christmas themes):
Snowflake, Cookie, Bells, Cocoa, Mittens, Muffin, Pudding, Gumdrops, Stocking, Ornament, Ribbon, Wreath, Sleigh, Reindeer, Icicle, Pine, Star, Candle, Chestnuts, Snowball, Frost, Gift, Angel, Sugarplum, Gingerbread, Eggnog, Nutcracker, Tinsel, Garland, Holly, Boots, Scarf, Cane (candy cane), Lights, Fireside, Caroler, Elf, Wishlist

EXAMPLES OF GREAT CODENAMES:
- Jolly Snowflake (cheerful personality)
- Midnight Cookie (night owl, sneaky)
- Sparkle Frost (energetic, bright)
- Shadow Cocoa (mysterious but warm)
- Crystal Bells (elegant, clear)
- Peppermint Starlight (sweet with flair)
- Velvet Gingerbread (cozy, sophisticated)
- Arctic Tinsel (cool demeanor, flashy)
- Silent Snowfall (quiet, peaceful)
- Crimson Ornament (bold, stands out)

BAD EXAMPLES (too generic, not Christmas-y):
- Shadow Agent ❌
- Steel Falcon ❌  
- Quick Strike ❌
- Dark Phoenix ❌`;

    const userPrompt = `Generate ONE unique codename for ${agentName} based on their personality:

${personalityProfile}

Remember: MUST be Christmas/winter/elf themed. Match their personality to festive words. Return ONLY the two-word codename.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        max_tokens: 20,
        temperature: 0.95  // Higher creativity for unique names
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    let codename = data.choices[0]?.message?.content?.trim();

    // Clean up any extra formatting
    codename = codename.replace(/["""]/g, '').trim();
    
    if (!codename) {
      throw new Error('No codename generated');
    }

    return codename;
  } catch (error) {
    console.error('Error generating AI codename:', error);
    return generateFallbackCodename();
  }
}

/**
 * Fallback questions if AI is unavailable
 */
function getFallbackQuestion(questionNumber) {
  const fallbackQuestions = [
    "First question: Are you more of a 'wrap it perfectly' or 'gift bag it and go' kind of person?",
    "If you could steal ONE gift from Santa's workshop, what would it be?",
    "On a scale of 1-10, how likely are you to actually follow the gift budget rules? (Be honest, this is a no-judgment zone)",
    "What's your go-to move when someone steals your gift in White Elephant?",
    "If this party was a heist movie, what role would you play?"
  ];

  return fallbackQuestions[Math.min(questionNumber - 1, fallbackQuestions.length - 1)] || fallbackQuestions[0];
}

/**
 * Fallback random codename generator
 */
function generateFallbackCodename() {
  const adjectives = [
    'Jolly', 'Merry', 'Sparkle', 'Twinkle', 'Frosty', 'Snowy', 'Midnight', 'Shadow',
    'Shimmer', 'Crystal', 'Sugar', 'Candy', 'Ginger', 'Peppermint', 'Tinsel', 'Glitter'
  ];
  
  const nouns = [
    'Snowflake', 'Cookie', 'Bells', 'Cocoa', 'Mittens', 'Frost', 'Starlight', 'Candy',
    'Boots', 'Muffin', 'Sleigh', 'Icicle', 'Pine', 'Wreath', 'Chestnuts', 'Candle'
  ];

  const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

  return `${randomAdj} ${randomNoun}`;
}
