import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { saveAgent, updateConversationLog, isCodenameAvailable } from '../utils/saveAgentData';
import { saveAISession } from '../utils/saveAISession';
import { checkReturningAgent, storeAgentSession } from '../utils/returningAgent';
import { generateNextQuestion, generateAICodename } from '../utils/aiConversation';
import EVENT_CONFIG from '../config/config';

/**
 * HQ Terminal Chat Component
 * Interactive AI-powered onboarding terminal for The Great Gift Heist
 * 
 * Features:
 * - Terminal-style chat interface
 * - Typewriter animation for AI messages
 * - Structured conversation flow (name → personality → codename → RSVP → guests)
 * - Supabase integration for data persistence
 * - OpenAI integration for dynamic responses
 */
const HQTerminal = ({ onComplete }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationState, setConversationState] = useState('greeting'); // greeting, name, personality, codename_gen, codename_confirm, rsvp, guests_count, guest_names, reminders_email, reminders_phone, interactive_chat, complete
  const [agentData, setAgentData] = useState({
    real_name: '',
    codename: '',
    email: '',
    phone: '',
    attendance_status: '',
    guest_count: 0,
    guest_names: [],
    personality_responses: [],
    access_code: 'RED-SLEIGH-2025',
    wants_reminders: false,
  });
  const [agentId, setAgentId] = useState(null);
  const [currentPersonalityQ, setCurrentPersonalityQ] = useState(0);
  const [aiConversationHistory, setAiConversationHistory] = useState([]); // For OpenAI context
  const [totalPersonalityQuestions] = useState(3); // Will ask 3-5 AI-generated questions
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Also scroll during typewriter animation
  const handleCharacterAdded = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Focus input when ready
  useEffect(() => {
    if (!isTyping && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isTyping]);

  // ESC key to exit (before completion)
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && conversationState !== 'complete') {
        const confirmed = window.confirm('Are you sure you want to exit? Your progress will be lost.');
        if (confirmed) {
          navigate('/');
        }
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [conversationState, navigate]);

  // Initial greeting
  useEffect(() => {
    // Check for returning agent first
    const checkReturning = async () => {
      const returningAgent = await checkReturningAgent();
      
      if (returningAgent) {
        // Welcome back returning agent
        setTimeout(() => {
          addHQMessage(
            `� NORTH POLE COMMAND - ELF AGENT NETWORK\n\n` +
            `> ACCESS GRANTED\n` +
            `> ELF CREDENTIALS VERIFIED\n` +
            `> NICE LIST CLEARANCE: CONFIRMED\n\n` +
            `Welcome back, **Elf Agent ${returningAgent.codename}**!\n\n` +
            `Your workshop profile is active. ` +
            `Status: ${returningAgent.attendance_status === 'attending' ? 'PARTY CONFIRMED ✅' : returningAgent.attendance_status === 'not_attending' ? 'UNABLE TO ATTEND ❌' : 'AWAITING RESPONSE 🤔'}\n\n` +
            `What would you like to do?\n` +
            `• Type "update" to change your party RSVP\n` +
            `• Type "card" to view your elf agent card\n` +
            `• Type "roster" to see all recruited elves\n` +
            `• Ask me anything about the party!`
          );
          setAgentData(returningAgent);
          setAgentId(returningAgent.id);
          setConversationState('complete');
        }, 1000);
        return;
      }

      // New agent - normal greeting
      setTimeout(() => {
        addHQMessage(
          `� NORTH POLE COMMAND - ELF AGENT NETWORK\n\n` +
          `> INITIALIZING WORKSHOP CONNECTION...\n` +
          `> CANDY CANE ENCRYPTION: ACTIVE\n` +
          `> NICE LIST PROTOCOLS: LOADED\n\n` +
          `Ho ho hello! Welcome to Operation Santa's Manifest.\n\n` +
          `I'm North Pole Command - your friendly coordinator for this festive mission. ` +
          `Before we assign you an elf codename, I need to know who you are!\n\n` +
          `What's your name?`
        );
        setConversationState('name');
      }, 1000);
    };

    checkReturning();
  }, []);

  /**
   * Add an HQ message with typewriter effect
   */
  const addHQMessage = (text, delay = 0) => {
    setTimeout(() => {
      setIsTyping(true);
      const message = {
        id: Date.now(),
        sender: 'HQ',
        text: text,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, message]);
      
      // Typewriter duration based on text length
      const typingDuration = Math.min(text.length * 20, 2000);
      setTimeout(() => setIsTyping(false), typingDuration);
    }, delay);
  };

  /**
   * Add user message (instant)
   */
  const addUserMessage = (text) => {
    const message = {
      id: Date.now(),
      sender: 'USER',
      text: text,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, message]);
  };

  /**
   * Show interactive prompt buttons after registration
   */
  const showInteractivePrompts = () => {
    addHQMessage(
      `✅ **ELF AGENT PROFILE CREATED**\n\n` +
      `Welcome to the workshop, Elf Agent ${agentData.codename}!\n\n` +
      `Your profile is saved in Santa's database. I'm here if you need help with party planning.\n\n` +
      `**Quick Actions:**\n` +
      `• Type "gift ideas" for great gift suggestions ($25-50)\n` +
      `• Type "food" to see what's on the menu\n` +
      `• Type "rules" for White Elephant game rules\n` +
      `• Type "card" to view your elf agent card\n` +
      `• Type "exit" to close this terminal and return to HQ\n\n` +
      `**To return to this terminal later:**\n` +
      `Click the "HQ Terminal" button from your agent card, or use the navigation menu below.\n\n` +
      `What would you like to know?`,
      500
    );
    setConversationState('complete');
  };

  /**
   * Handle interactive questions after registration
   */
  const handleInteractiveQuestion = async (input) => {
    const lowerInput = input.toLowerCase();

    // Exit/Leave terminal
    if (lowerInput.includes('exit') || lowerInput.includes('leave') || lowerInput.includes('quit') || lowerInput.includes('close')) {
      addHQMessage(
        `Understood, Elf Agent ${agentData.codename}! Closing workshop terminal...\n\n` +
        `Redirecting to your agent card. See you at the party! 🎄`,
        300
      );
      setTimeout(() => {
        navigate(`/agent/${agentData.codename}`);
      }, 2000);
      return;
    }

    // View agent card/profile
    if (lowerInput.includes('card') || lowerInput.includes('profile')) {
      navigate(`/agent/${agentData.codename}`);
      return;
    }

    // View roster
    if (lowerInput.includes('roster') || lowerInput.includes('list') || lowerInput.includes('who') || lowerInput.includes('attending')) {
      navigate('/roster');
      return;
    }

    // Update RSVP
    if (lowerInput.includes('update') || lowerInput.includes('change') || lowerInput.includes('edit')) {
      addHQMessage(
        `🔄 **RSVP UPDATE REQUEST**\n\n` +
        `To update your RSVP details:\n\n` +
        `1. Contact North Pole Command (the hosts) directly\n` +
        `2. Or respond to the confirmation email\n` +
        `3. Or message in the WhatsApp channel\n\n` +
        `Need to change your codename, attendance, or guest count? Just let the hosts know!`,
        500
      );
      return;
    }

    // Codename change request
    if (lowerInput.includes('codename') || lowerInput.includes('name') || lowerInput.includes('rename')) {
      addHQMessage(
        `🏷️ **CODENAME MODIFICATION**\n\n` +
        `Your current codename: **${agentData.codename}**\n\n` +
        `Want to change it? Contact the hosts directly!\n` +
        `They can update your elf credentials in the workshop database.\n\n` +
        `Pro tip: Your codename will be on your gift tag, so choose wisely! 🎁`,
        500
      );
      return;
    }

    // Gift ideas - FLEXIBLE matching for any gift-related questions
    if (
      lowerInput.includes('gift') || 
      lowerInput.includes('present') || 
      lowerInput.includes('bring') ||
      lowerInput.includes('what should i') ||
      lowerInput.includes('buy') ||
      lowerInput.includes('idea') ||
      lowerInput.includes('suggestion') ||
      lowerInput.includes('funny') ||
      lowerInput.includes('weird') ||
      lowerInput.includes('creative')
    ) {
      // Check if they want funny/weird/unusual gifts specifically
      const wantsFunny = lowerInput.includes('funny') || lowerInput.includes('weird') || lowerInput.includes('unusual') || lowerInput.includes('hilarious') || lowerInput.includes('gag');
      
      if (wantsFunny) {
        addHQMessage(
          `😂 **HILARIOUS GIFT IDEAS FOR $25-$50**\n\n` +
          `Based on elf workshop intel, these are guaranteed laughs:\n\n` +
          `**Ridiculous But Functional:**\n` +
          `• Giant wine glass (holds a whole bottle)\n` +
          `• Bigfoot air freshener for the car\n` +
          `• Toilet bowl night light (7 colors!)\n` +
          `• Desktop punching bag (for stressful Zoom calls)\n` +
          `• Emergency underpants vending machine\n\n` +
          `**Gag Gifts That Win:**\n` +
          `• "Accoutrements Horse Head Squirrel Feeder"\n` +
          `• Nicolas Cage sequin pillow (his face changes!)\n` +
          `• Yodeling pickle (yes, really)\n` +
          `• Inflatable toast or pizza pool float\n` +
          `• "Poo-Pourri" toilet spray gift set\n\n` +
          `**Useful + Weird Combo:**\n` +
          `• Cat butt tissue holder\n` +
          `• Bob Ross Chia Pet\n` +
          `• Bacon-scented candle\n` +
          `• Screaming goat (the toy that screams when squeezed)\n\n` +
          `Remember: The goal is to make people laugh AND fight over it!\n\n` +
          `Want more "normal" gift ideas? Just ask!`,
          500
        );
      } else {
        addHQMessage(
          `🎁 **GIFT IDEAS FOR $25-$50**\n\n` +
          `Based on workshop intel, here are some crowd-pleasers:\n\n` +
          `**Cozy & Practical:**\n` +
          `• Fleece blanket or heated throw\n` +
          `• Quality coffee beans + fun mug\n` +
          `• Fuzzy socks or slippers\n\n` +
          `**Fun & Games:**\n` +
          `• Card game (Exploding Kittens, Cards Against Humanity)\n` +
          `• Puzzle or board game\n` +
          `• Cocktail kit or fancy hot chocolate set\n\n` +
          `**Wildcard Winners:**\n` +
          `• Nice bottle of wine or craft spirits\n` +
          `• Bluetooth speaker\n` +
          `• Plant or succulent with cute pot\n` +
          `• Gourmet snack basket\n\n` +
          `Remember: The most stolen gifts are usually cozy, boozy, or hilariously unexpected!\n\n` +
          `Want **funny** or **weird** gift ideas? Just ask!`,
          500
        );
      }
      return;
    }

    // Food/menu questions
    if (lowerInput.includes('food') || lowerInput.includes('menu') || lowerInput.includes('eat') || lowerInput.includes('drink') || lowerInput.includes('snack')) {
      addHQMessage(
        `🍽️ **PARTY MENU INTEL**\n\n` +
        `The hosts will provide the main dishes, but contributions are welcome!\n\n` +
        `**Great Additions:**\n` +
        `• Appetizers or finger foods\n` +
        `• Desserts (cookies, brownies, holiday treats)\n` +
        `• Drinks (wine, beer, festive cocktails)\n` +
        `• Chips and dip\n\n` +
        `Coordinate with other elves in the WhatsApp channel to avoid duplicates!\n\n` +
        `Any dietary restrictions? Let the hosts know in advance.`,
        500
      );
      return;
    }

    // Rules/how to play
    if (lowerInput.includes('rule') || lowerInput.includes('how') || lowerInput.includes('play') || lowerInput.includes('work') || lowerInput.includes('game')) {
      addHQMessage(
        `📋 **WHITE ELEPHANT RULES**\n\n` +
        `**Setup:**\n` +
        `1. Everyone brings a wrapped gift ($25-$50)\n` +
        `2. Draw numbers to determine order\n\n` +
        `**Gameplay:**\n` +
        `1. First person picks a gift and opens it\n` +
        `2. Next person can either:\n` +
        `   • Steal an opened gift, OR\n` +
        `   • Pick a new wrapped gift\n` +
        `3. If your gift is stolen, repeat step 2\n` +
        `4. Each gift can only be stolen 3 times max\n` +
        `5. After 3 steals, that gift is "locked"\n\n` +
        `**Strategy Tips:**\n` +
        `• Going first = control the steal chain\n` +
        `• Going last = ultimate power of choice\n` +
        `• Wrap creatively to influence picks!\n\n` +
        `Most importantly: Have fun with the chaos!`,
        500
      );
      return;
    }

    // Time/when/where questions
    if (lowerInput.includes('when') || lowerInput.includes('time') || lowerInput.includes('where') || lowerInput.includes('location') || lowerInput.includes('address')) {
      addHQMessage(
        `📅 **PARTY DETAILS**\n\n` +
        `**When:** ${EVENT_CONFIG.date}\n` +
        `**Time:** ${EVENT_CONFIG.time}\n` +
        `**Location:** ${EVENT_CONFIG.location}\n\n` +
        `Check your confirmation email for the full address and parking details!\n\n` +
        `Need directions? Message in the WhatsApp channel.`,
        500
      );
      return;
    }

    // Catch-all for unrecognized questions - be helpful, not rigid
    addHQMessage(
      `🎄 **ELF WORKSHOP ASSISTANT**\n\n` +
      `I can help with:\n\n` +
      `**Party Info:**\n` +
      `• Gift ideas (normal or funny!)\n` +
      `• Food and menu details\n` +
      `• White Elephant rules\n` +
      `• Party time, date, location\n\n` +
      `**Your Profile:**\n` +
      `• View your agent card\n` +
      `• See the roster of confirmed elves\n` +
      `• Update your RSVP (contact hosts)\n\n` +
      `Just ask me anything in your own words - I understand natural questions! 🎅`,
      300
    );
  };

  /**
   * Handle user input submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userInput = inputValue.trim();
    addUserMessage(userInput);
    setInputValue('');

    // Process input based on conversation state
    await processUserInput(userInput);
  };

  /**
   * Main conversation flow processor
   */
  const processUserInput = async (input) => {
    switch (conversationState) {
      case 'name':
        // Store name and start AI-driven personality conversation
        setAgentData(prev => ({ ...prev, real_name: input }));
        
        addHQMessage(
          `Perfect! Welcome to the workshop, ${input}.\n\n` +
          `Before we assign you an elf codename, I need to learn about your Christmas spirit! ` +
          `Think of it as a festive personality assessment.\n\n` +
          `Consulting with the elves...`,
          500
        );
        
        // Generate first AI question
        setTimeout(async () => {
          const firstQuestion = await generateNextQuestion([], input, 1);
          
          // Add AI question to conversation history
          setAiConversationHistory([{ role: 'assistant', content: firstQuestion }]);
          
          addHQMessage(firstQuestion, 300);
          setConversationState('personality');
        }, 1500);
        break;

      case 'personality':
        // Store personality response
        const updatedResponses = [...agentData.personality_responses, input];
        setAgentData(prev => ({ ...prev, personality_responses: updatedResponses }));
        
        // Add user response to AI conversation history
        const updatedHistory = [
          ...aiConversationHistory,
          { role: 'user', content: input }
        ];

        if (currentPersonalityQ < totalPersonalityQuestions - 1) {
          // Generate next AI question
          setCurrentPersonalityQ(prev => prev + 1);
          
          const nextQuestion = await generateNextQuestion(
            updatedHistory, 
            agentData.real_name, 
            currentPersonalityQ + 2
          );
          
          // Add AI question to conversation history
          setAiConversationHistory([
            ...updatedHistory,
            { role: 'assistant', content: nextQuestion }
          ]);
          
          addHQMessage(nextQuestion, 500);
        } else {
          // Generate AI codename
          addHQMessage(
            `Analyzing your Christmas spirit...\n\n` +
            `> FESTIVE PERSONALITY: COMPLETE\n` +
            `> ELF CODENAME GENERATION: PROCESSING\n` +
            `> NICE LIST STATUS: APPROVED`,
            500
          );
          
          setTimeout(async () => {
            let generatedCodename = await generateAICodename(agentData.real_name, updatedResponses);
            
            // Check if codename is unique, regenerate if needed
            let isUnique = await isCodenameAvailable(generatedCodename);
            let attempts = 0;
            
            while (!isUnique && attempts < 5) {
              console.log(`Codename "${generatedCodename}" taken, regenerating...`);
              generatedCodename = await generateAICodename(agentData.real_name, updatedResponses);
              isUnique = await isCodenameAvailable(generatedCodename);
              attempts++;
            }
            
            if (!isUnique) {
              // Fallback: append random number
              generatedCodename = `${generatedCodename}-${Math.floor(Math.random() * 999)}`;
            }
            
            setAgentData(prev => ({ ...prev, codename: generatedCodename }));
            
            addHQMessage(
              `\n\n✨ Your elf codename is: **${generatedCodename}**\n\n` +
              `This will be your party identity for Operation Santa's Manifest. ` +
              `All other elves will know you by this name!\n\n` +
              `Do you like this codename? (yes/no)`,
              500
            );
            setConversationState('codename_confirm');
          }, 2000);
        }
        break;

      case 'codename_confirm':
        const acceptance = input.toLowerCase();
        if (acceptance.includes('yes') || acceptance.includes('accept') || acceptance.includes('sure') || acceptance.includes('like')) {
          addHQMessage(
            `Perfect! **${agentData.codename}** is now officially registered in Santa's database. 🎅\n\n` +
            `Now for the important part: the party invitation!\n\n` +
            `🎄 **OPERATION SANTA'S MANIFEST**\n` +
            `📅 Date: December 13, 2025 @ 1900 HRS\n` +
            `📍 Location: ${EVENT_CONFIG.location.name}\n` +
            `🎁 Objective: Gift exchange & holiday fun\n` +
            `💵 Budget: $${EVENT_CONFIG.giftBudget.min}-$${EVENT_CONFIG.giftBudget.max}\n\n` +
            `Will you attend our workshop party? (yes/no/maybe)`,
            500
          );
          setConversationState('rsvp');
        } else {
          // Regenerate AI codename
          addHQMessage(
            `No problem! Let me consult with the other elves...\n\n` +
            `> ELF CODENAME GENERATOR: REINITIALIZING`,
            300
          );
          
          setTimeout(async () => {
            const newCodename = await generateAICodename(agentData.real_name, agentData.personality_responses);
            setAgentData(prev => ({ ...prev, codename: newCodename }));
            
            addHQMessage(
              `\n\nHow about: **${newCodename}**?\n\n` +
              `Do you like this one? (yes/no)`,
              300
            );
          }, 1500);
        }
        break;

      case 'rsvp':
        const rsvpResponse = input.toLowerCase();
        let attendanceStatus = 'uncertain';
        
        if (rsvpResponse.includes('yes') || rsvpResponse.includes('accept') || rsvpResponse.includes('definitely')) {
          attendanceStatus = 'attending';
          setAgentData(prev => ({ ...prev, attendance_status: 'attending' }));
          
          addHQMessage(
            `� **PARTY RSVP: CONFIRMED**\n\n` +
            `Fantastic, ${agentData.codename}! Your attendance has been logged on the party roster.\n\n` +
            `Are you bringing any helper elves (guests)? If so, how many? (Enter a number, or 0 if coming solo)`,
            500
          );
          setConversationState('guests_count');
        } else if (rsvpResponse.includes('no') || rsvpResponse.includes('decline')) {
          attendanceStatus = 'not_attending';
          setAgentData(prev => ({ ...prev, attendance_status: 'not_attending', rsvp_confirmed_at: new Date().toISOString() }));
          
          addHQMessage(
            `Understood. Your response has been noted.\n\n` +
            `You'll be marked as unable to attend this year's party. We'll catch you next year, ${agentData.codename}! 🎄\n\n` +
            `Generating your elf profile...`,
            500
          );
          
          // Save to Supabase
          setTimeout(async () => {
            await saveAgentToDatabase();
            setConversationState('complete');
          }, 2000);
        } else {
          attendanceStatus = 'uncertain';
          setAgentData(prev => ({ ...prev, attendance_status: 'uncertain' }));
          
          addHQMessage(
            `Noted! You're marked as "Checking the Nice List" - elf-speak for "I need more time to decide."\n\n` +
            `No pressure, but the workshop would love to have you at the party. You can update your status later.\n\n` +
            `Generating your elf profile...`,
            500
          );
          
          setTimeout(async () => {
            await saveAgentToDatabase();
            setConversationState('complete');
          }, 2000);
        }
        break;

      case 'guests_count':
        const guestCount = parseInt(input);
        
        if (isNaN(guestCount) || guestCount < 0) {
          addHQMessage(
            `I need a number, ${agentData.codename}. How many helper elves are joining you? (Enter 0 if coming solo)`,
            200
          );
          return;
        }
        
        setAgentData(prev => ({ ...prev, guest_count: guestCount }));
        
        if (guestCount === 0) {
          addHQMessage(
            `Flying solo! Perfect - sometimes the best parties are experienced on your own. 🎄\n\n` +
            `Would you like party reminders sent to you? (yes/no)`,
            500
          );
          setConversationState('reminders_email');
        } else {
          addHQMessage(
            `${guestCount} helper ${guestCount === 1 ? 'elf' : 'elves'} noted!\n\n` +
            `Please provide their names (comma-separated if multiple):`,
            500
          );
          setConversationState('guest_names');
        }
        break;

      case 'guest_names':
        const names = input.split(',').map(n => n.trim()).filter(n => n);
        setAgentData(prev => ({ 
          ...prev, 
          guest_names: names,
        }));
        
        addHQMessage(
          `Perfect! Your workshop team is registered:\n` +
          names.map(name => `• ${name}`).join('\n') +
          `\n\nWould you like party reminders sent to you? (yes/no)`,
          500
        );
        setConversationState('reminders_email');
        break;

      case 'reminders_email':
        const wantsReminders = input.toLowerCase();
        
        if (wantsReminders.includes('yes')) {
          setAgentData(prev => ({ ...prev, wants_reminders: true }));
          addHQMessage(
            `Great! What's your email address for party updates?`,
            300
          );
          setConversationState('reminders_phone');
        } else {
          addHQMessage(
            `No problem. Finalizing your elf profile...`,
            300
          );
          setTimeout(async () => {
            await saveAgentToDatabase();
            showInteractivePrompts();
          }, 1500);
        }
        break;

      case 'reminders_phone':
        // Store email
        setAgentData(prev => ({ ...prev, email: input }));
        
        addHQMessage(
          `Email logged. And your phone number for SMS reminders? (Or type 'skip')`,
          300
        );
        setConversationState('save_and_continue');
        break;

      case 'save_and_continue':
        if (!input.toLowerCase().includes('skip')) {
          setAgentData(prev => ({ ...prev, phone: input }));
        }
        
        addHQMessage(
          `✅ All set! Saving your profile...`,
          300
        );
        
        setTimeout(async () => {
          await saveAgentToDatabase();
          showInteractivePrompts();
        }, 1500);
        break;

      case 'interactive_chat':
        // This shouldn't be called in handleUserInput
        // Interactive prompts are already shown
        break;

      case 'complete':
        // Handle post-completion questions with AI
        await handleInteractiveQuestion(input);
        break;

      default:
        break;
    }
  };

  /**
   * Save agent data to Supabase
   */
  const saveAgentToDatabase = async () => {
    try {
      const savedAgent = await saveAgent({
        ...agentData,
        conversation_log: messages,
        // Don't pass created_at - let DB default handle it
      });
      
      setAgentId(savedAgent.id);
      
      // Save AI session (best-effort). If it fails, log but continue — agent record exists.
      try {
        await saveAISession(savedAgent.id, messages);
      } catch (aiErr) {
        console.error('AI session save error (non-blocking):', aiErr);
        addHQMessage(
          `⚠️ Note: We couldn't save the AI chat log to HQ servers right now. Your profile was created and is safe.`,
          200
        );
      }

      // Store in localStorage for returning agents
      storeAgentSession(savedAgent);
      
      // Show completion message
      addHQMessage(
        `✅ **PROFILE COMPLETE**\n\n` +
        `Your elf profile has been created, ${agentData.codename}! 🎄\n\n` +
        `📋 **Party Summary:**\n` +
        `• Codename: ${agentData.codename}\n` +
        `• Status: ${agentData.attendance_status === 'attending' ? 'CONFIRMED ✅' : agentData.attendance_status === 'uncertain' ? 'PENDING 🤔' : 'DECLINED ❌'}\n` +
        `• Team Size: ${agentData.guest_count + 1}\n\n` +
        `Redirecting to your Elf Card in 3 seconds...\n\n` +
        `Check out the /roster to see other confirmed elves!`,
        500
      );
      
      // Redirect to agent card
      setTimeout(() => {
        if (onComplete) {
          onComplete(savedAgent);
        }
        navigate(`/agent/${agentData.codename}`);
      }, 5000);
      
    } catch (error) {
      console.error('Failed to save agent:', error);
      addHQMessage(
        `⚠️ **TRANSMISSION ERROR**\n\n` +
        `There was a problem saving your profile to Santa's database. ` +
        `Don't worry - your data is cached locally. Please contact North Pole Command for manual registration.`,
        200
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4">
      {/* Terminal Container */}
      <div className="w-full max-w-4xl h-[90vh] flex flex-col">
        {/* Terminal Header */}
        <div className="bg-gradient-to-r from-red-900 to-green-900 px-6 py-3 rounded-t-lg border-b-2 border-green-500/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-300 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
            <span className="text-green-300 font-mono text-sm tracking-wider flex items-center gap-2">
              <span className="text-xl">🎄</span>
              ELF_WORKSHOP_CHAT_TERMINAL
              <span className="text-xl">🎅</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-green-300/70 font-mono text-xs flex items-center gap-1">
              <span className="text-yellow-300">✨</span>
              SANTA'S_NETWORK_CONNECTED
              <span className="text-yellow-300">✨</span>
            </div>
            {/* Exit button - only show before completion */}
            {conversationState !== 'complete' && (
              <button
                onClick={() => navigate('/')}
                className="text-red-400 hover:text-red-300 text-xs font-mono transition-colors"
                title="Exit terminal (ESC)"
              >
                [X] EXIT
              </button>
            )}
          </div>
        </div>

        {/* Terminal Body */}
        <div className="flex-1 bg-black/95 backdrop-blur-sm overflow-y-auto p-6 font-mono text-sm border-x-2 border-green-500/20">
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={msg.sender === 'HQ' ? 'text-green-400' : 'text-cyan-300'}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-green-500 font-bold min-w-[60px]">
                      {msg.sender === 'HQ' ? '[HQ]>' : '[YOU]>'}
                    </span>
                    <div className="flex-1 whitespace-pre-wrap break-words">
                      {msg.sender === 'HQ' ? (
                        <TypewriterText text={msg.text} onCharacterAdded={handleCharacterAdded} />
                      ) : (
                        msg.text
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                className="text-green-400/60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <span className="text-green-500 font-bold">[HQ]{'>'}</span> <span className="animate-pulse">▋</span>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Terminal Input */}
        <div className="bg-slate-900 px-6 py-4 rounded-b-lg border-t-2 border-green-500/30">
          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <span className="text-cyan-400 font-bold">$</span>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isTyping}
              className="flex-1 bg-transparent border-none outline-none text-cyan-300 font-mono placeholder-green-500/30"
              placeholder={isTyping ? "HQ is transmitting..." : "Type your response..."}
              autoComplete="off"
              spellCheck="false"
            />
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-cyan-400"
            >
              █
            </motion.span>
          </form>
        </div>
      </div>

      {/* CRT Effect Overlay */}
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-transparent via-green-500/5 to-transparent animate-scan opacity-20" />
      
      {/* Vignette */}
      <div className="fixed inset-0 pointer-events-none opacity-40" style={{
        background: 'radial-gradient(circle, transparent 0%, black 100%)'
      }} />

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scan {
          animation: scan 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

/**
 * Typewriter Text Component
 * Animates text character by character
 * Click to skip animation and show full text immediately
 */
const TypewriterText = ({ text, onCharacterAdded }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length && !isComplete) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
        // Trigger scroll on every character added
        if (onCharacterAdded) onCharacterAdded();
      }, 15); // 15ms per character

      return () => clearTimeout(timeout);
    } else if (currentIndex >= text.length) {
      setIsComplete(true);
    }
  }, [currentIndex, text, isComplete, onCharacterAdded]);

  useEffect(() => {
    // Reset when text changes
    setDisplayedText('');
    setCurrentIndex(0);
    setIsComplete(false);
  }, [text]);

  const handleSkip = () => {
    setDisplayedText(text);
    setCurrentIndex(text.length);
    setIsComplete(true);
  };

  return (
    <span 
      onClick={handleSkip}
      className={!isComplete ? 'cursor-pointer hover:opacity-80' : ''}
      title={!isComplete ? 'Click to skip animation' : ''}
    >
      {displayedText}
    </span>
  );
};

export default HQTerminal;
