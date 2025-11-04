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
    // Extract only user responses to track what's been discussed
    const previousTopics = conversationHistory
      .filter(msg => msg.role === 'user')
      .map(msg => msg.content)
      .join(' | ');

    const systemPrompt = `You are "HQ" - the AI handler for The Great Gift Heist, a Christmas white elephant party with a playful spy/heist theme. You're onboarding Agent ${agentName}.

🎯 CRITICAL RULES:
1. This is question ${questionNumber} of EXACTLY 3 questions
2. NEVER repeat or rephrase questions you've already asked
3. Each question must explore a NEW aspect of their personality
4. Build on their previous answer naturally, then ask something different
5. Keep responses SHORT - max 2-3 sentences total

📋 QUESTION PROGRESSION (focus on personality/style for codename):
Question 1: Ask about their personality style or vibe (cozy vs flashy, classic vs quirky, etc.)
Question 2: Ask about their Christmas aesthetic or favorite holiday element (colors, traditions, symbols)
Question 3: Ask about their party persona or energy (life of the party, mysterious, playful, etc.)

✅ GOOD PATTERN:
"[1 sentence acknowledging their answer] Now, [NEW question about different aspect]?"

❌ BAD PATTERNS:
- Asking the same question twice in different words
- Following up with "what would you..." if you just asked that
- Repeating topics already covered

🎨 CODENAME-RELEVANT TOPICS (choose ONE per question):
- Are you more cozy-sweater or sequin-dress vibes?
- What's your Christmas color palette? (Classic red/green, icy blues, golds, etc.)
- Favorite Christmas symbol or element (snowflakes, bells, lights, cocoa, etc.)
- Party energy (life of the party, mysterious observer, playful prankster, warm host)
- Holiday personality (jolly, mischievous, elegant, whimsical, etc.)
- If you were a Christmas character, who? (Santa, elf, reindeer, snowman, etc.)

Keep it fun, brief, and always move forward. Don't circle back to topics you've covered.`;

    const userContext = previousTopics 
      ? `Previous topics covered: ${previousTopics}\n\nNow ask question ${questionNumber} about a DIFFERENT aspect.`
      : `Ask your first personality question to ${agentName}.`;

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
          ...conversationHistory,
          { role: 'system', content: userContext }
        ],
        max_tokens: 100,  // Shorter responses
        temperature: 0.7,  // Lower temp for more consistency
        presence_penalty: 1.0,  // Strong penalty for repeating topics
        frequency_penalty: 0.5  // Discourage word repetition
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
    // Extract words from their responses to avoid using them
    const avoidWords = personalityResponses
      .join(' ')
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    const systemPrompt = `You are Santa's CREATIVE Codename Generator for The Great Gift Heist. Your job is to create WHIMSICAL, UNEXPECTED, and DELIGHTFUL elf-style codenames that make people smile.

🎯 YOUR MISSION:
Generate codenames that are:
- Surprisingly creative (NOT predictable combinations)
- Fun to say out loud
- Memorable and unique
- Christmas-themed but IMAGINATIVE

⚠️ CRITICAL RULES:
1. Be CREATIVE - avoid obvious or common combinations
2. Must be EXACTLY 2 words: [Festive Adjective] [Festive Noun]
3. NEVER use words the person mentioned in their answers
4. Mix unexpected combinations (Nutmeg Dreams, Frosted Jingle, Velvet Snowdrift)
5. Return ONLY the codename - no quotes, explanations, or punctuation

🎨 CREATIVE WORD POOL (mix these unexpectedly):

Magical Adjectives:
Whispering, Gleaming, Dancing, Twinkling, Humming, Glittering, Frosted, Velvet, Crystal, Moonlit, Starlit, Sparkling, Shimmering, Glowing, Merry, Jolly, Snowy, Icy, Arctic, Winter, Festive, Jolly, Cozy, Silent, Golden, Silver, Crimson, Emerald, Sapphire, Ruby

Whimsical Nouns:
Snowdrift, Sleighbell, Snowglobe, Mistletoe, Sugarplum, Gingerbread, Wonderland, Fireside, Starlight, Moonbeam, Snowfall, Icicle, Wintermint, Candlelight, Evergreen, Pinecone, Nutmeg, Eggnog, Tinseltown, Wonderland, Dreams, Whisper, Jingle, Chime, Flurry, Frost, Sparkle

🌟 INSPIRATION (create something DIFFERENT from these):
- Velvet Snowdrift (NOT Velvet Gingerbread)
- Frosted Jingle (NOT Frosted Cookie)
- Moonlit Sugarplum (NOT Midnight anything)
- Whispering Evergreen (NOT Silent Pine)
- Dancing Snowglobe (NOT Sparkle Snowflake)
- Nutmeg Dreams (NOT Cinnamon Cookie)
- Crystal Wonderland (NOT Crystal Bells)
- Humming Wintermint (NOT Peppermint Star)

❌ AVOID:
- Anything too literal or predictable
- Using ANY words from their responses
- Common combinations everyone uses
- Generic spy terms`;

    const userPrompt = `Create ONE completely unique, creative, whimsical Christmas codename based on this personality vibe (but DON'T use these exact words):

PERSONALITY ESSENCE: ${personalityResponses.map((r, i) => `Q${i + 1}: ${r}`).join(' | ')}

WORDS TO AVOID: ${avoidWords.slice(0, 10).join(', ')}

Generate something unexpected and delightful that captures their spirit without being literal. Return ONLY the two-word codename.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',  // Using full GPT-4 for better creativity
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
        max_tokens: 15,
        temperature: 1.2,  // Maximum creativity
        presence_penalty: 0.6,  // Encourage novelty
        frequency_penalty: 0.3  // Reduce repetition
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
