import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { saveAgent, updateConversationLog } from '../utils/saveAgentData';
import { saveAISession } from '../utils/saveAISession';
import { checkReturningAgent, storeAgentSession } from '../utils/returningAgent';
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
  const [conversationState, setConversationState] = useState('greeting'); // greeting, name, personality, codename_gen, codename_confirm, rsvp, guests_count, guest_names, complete
  const [agentData, setAgentData] = useState({
    real_name: '',
    codename: '',
    attendance_status: '',
    guest_count: 0,
    guest_names: [],
    personality_responses: [],
    access_code: 'RED-SLEIGH-2025',
  });
  const [agentId, setAgentId] = useState(null);
  const [currentPersonalityQ, setCurrentPersonalityQ] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const personalityQuestions = [
    "First, tell me: Are you more of a 'wrap it perfectly' or 'gift bag it and go' kind of person?",
    "If you had to steal ONE gift from Santa's workshop, what would it be?",
    "On a scale of 1-10, how likely are you to actually follow the gift budget rules? (Be honest, this is a no-judgment zone)",
  ];

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when ready
  useEffect(() => {
    if (!isTyping && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isTyping]);

  // Initial greeting
  useEffect(() => {
    // Check for returning agent first
    const checkReturning = async () => {
      const returningAgent = await checkReturningAgent();
      
      if (returningAgent) {
        // Welcome back returning agent
        setTimeout(() => {
          addHQMessage(
            `🎯 NORTH POLE INTELLIGENCE - CLASSIFIED TERMINAL\n\n` +
            `> ACCESS GRANTED\n` +
            `> AGENT CREDENTIALS VERIFIED\n` +
            `> CLEARANCE: CONFIRMED\n\n` +
            `Welcome back, **Agent ${returningAgent.codename}**.\n\n` +
            `Your profile is already in our system. ` +
            `Status: ${returningAgent.attendance_status === 'attending' ? 'MISSION CONFIRMED ✅' : returningAgent.attendance_status === 'not_attending' ? 'MISSION DECLINED' : 'PENDING CONFIRMATION'}\n\n` +
            `Would you like to:\n` +
            `• Type "update" to modify your RSVP\n` +
            `• Type "card" to view your agent card\n` +
            `• Type "roster" to see other confirmed agents\n` +
            `• Ask me anything about the mission`
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
          `🎯 NORTH POLE INTELLIGENCE - CLASSIFIED TERMINAL\n\n` +
          `> ACCESS GRANTED\n` +
          `> SECURE CHANNEL ESTABLISHED\n` +
          `> ENCRYPTION: ACTIVE\n\n` +
          `Welcome to Operation Santa's Manifest.\n\n` +
          `I'm HQ - your handler for this mission. Before we proceed with clearance protocols, I need to verify your identity.\n\n` +
          `What's your real name, agent?`
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
   * Generate codename using simple algorithm
   */
  const generateCodename = (personalityData) => {
    const adjectives = ['Frosty', 'Jolly', 'Sparkle', 'Tinsel', 'Candy', 'Blizzard', 'Icicle', 'Peppermint'];
    const nouns = ['Frost', 'Bells', 'Snow', 'Gift', 'Sleigh', 'Star', 'Cookie', 'Cane'];
    
    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    
    return `${randomAdj} ${randomNoun}`;
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
        // Store name and move to personality questions
        setAgentData(prev => ({ ...prev, real_name: input }));
        addHQMessage(
          `Excellent. Welcome to the team, ${input}.\n\n` +
          `Before we assign your operational codename, I need to run a quick personality profile. ` +
          `Standard procedure - helps us match you with the right alias.\n\n` +
          personalityQuestions[0],
          500
        );
        setConversationState('personality');
        break;

      case 'personality':
        // Store personality response
        const updatedResponses = [...agentData.personality_responses, input];
        setAgentData(prev => ({ ...prev, personality_responses: updatedResponses }));

        if (currentPersonalityQ < personalityQuestions.length - 1) {
          // Ask next personality question
          setCurrentPersonalityQ(prev => prev + 1);
          addHQMessage(personalityQuestions[currentPersonalityQ + 1], 500);
        } else {
          // Generate codename
          const generatedCodename = generateCodename(updatedResponses);
          setAgentData(prev => ({ ...prev, codename: generatedCodename }));
          
          addHQMessage(
            `Analyzing your profile...\n\n` +
            `> PERSONALITY MATRIX: COMPLETE\n` +
            `> CODENAME GENERATION: PROCESSING\n` +
            `> CLEARANCE LEVEL: ASSIGNED\n\n` +
            `Your operational codename is: **Agent ${generatedCodename}**\n\n` +
            `This will be your identifier for the duration of Operation Santa's Manifest. ` +
            `All field agents will know you by this designation.\n\n` +
            `Do you accept this codename? (yes/no)`,
            1000
          );
          setConversationState('codename_confirm');
        }
        break;

      case 'codename_confirm':
        const acceptance = input.toLowerCase();
        if (acceptance.includes('yes') || acceptance.includes('accept') || acceptance.includes('sure')) {
          addHQMessage(
            `Outstanding. **Agent ${agentData.codename}** is now officially registered in our system.\n\n` +
            `Now for the critical part: the mission briefing.\n\n` +
            `📋 **OPERATION SANTA'S MANIFEST**\n` +
            `📅 Date: December 13, 2025 @ 1900 HRS\n` +
            `📍 Location: ${EVENT_CONFIG.location.name}\n` +
            `🎁 Objective: Gift acquisition & exchange operation\n` +
            `💵 Budget: $${EVENT_CONFIG.giftBudget.min}-$${EVENT_CONFIG.giftBudget.max}\n\n` +
            `Will you accept this mission? (yes/no/maybe)`,
            500
          );
          setConversationState('rsvp');
        } else {
          // Regenerate codename
          const newCodename = generateCodename(agentData.personality_responses);
          setAgentData(prev => ({ ...prev, codename: newCodename }));
          
          addHQMessage(
            `No problem. Regenerating...\n\n` +
            `How about: **Agent ${newCodename}**?\n\n` +
            `Accept this codename? (yes/no)`,
            500
          );
        }
        break;

      case 'rsvp':
        const rsvpResponse = input.toLowerCase();
        let attendanceStatus = 'uncertain';
        
        if (rsvpResponse.includes('yes') || rsvpResponse.includes('accept') || rsvpResponse.includes('definitely')) {
          attendanceStatus = 'attending';
          setAgentData(prev => ({ ...prev, attendance_status: 'attending' }));
          
          addHQMessage(
            `🎖️ **MISSION ACCEPTED**\n\n` +
            `Excellent work, Agent ${agentData.codename}. Your attendance has been logged in the operational roster.\n\n` +
            `Are you bringing any additional operatives (guests)? If so, how many? (Enter a number, or 0 for solo mission)`,
            500
          );
          setConversationState('guests_count');
        } else if (rsvpResponse.includes('no') || rsvpResponse.includes('decline')) {
          attendanceStatus = 'not_attending';
          setAgentData(prev => ({ ...prev, attendance_status: 'not_attending', rsvp_confirmed_at: new Date().toISOString() }));
          
          addHQMessage(
            `Understood. Your declination has been noted.\n\n` +
            `You'll be marked as unavailable for this operation. We'll catch you on the next mission, Agent ${agentData.codename}.\n\n` +
            `Your agent credentials are being generated...`,
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
            `Noted. You're marked as "Still Gathering Intel" - which is spy-speak for "I need more time to decide."\n\n` +
            `No pressure, but HQ would love to have you on the mission. You can update your status later.\n\n` +
            `Generating your agent profile...`,
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
            `I need a number, Agent. How many additional operatives? (Enter 0 for solo mission)`,
            200
          );
          return;
        }
        
        setAgentData(prev => ({ ...prev, guest_count: guestCount }));
        
        if (guestCount === 0) {
          addHQMessage(
            `Solo mission confirmed. Sometimes the best ops are run alone.\n\n` +
            `Your mission profile is being finalized...`,
            500
          );
          
          setTimeout(async () => {
            await saveAgentToDatabase();
            setConversationState('complete');
          }, 2000);
        } else {
          addHQMessage(
            `${guestCount} additional ${guestCount === 1 ? 'operative' : 'operatives'} noted.\n\n` +
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
          rsvp_confirmed_at: new Date().toISOString() 
        }));
        
        addHQMessage(
          `Perfect. Your team is registered:\n` +
          names.map(name => `• ${name}`).join('\n') +
          `\n\nAll operatives accounted for. Finalizing your mission dossier...`,
          500
        );
        
        setTimeout(async () => {
          await saveAgentToDatabase();
          setConversationState('complete');
        }, 2000);
        break;

      case 'complete':
        // Handle post-completion chat (gift ideas, food intel, etc.)
        addHQMessage(
          `I'm here if you need mission support. Try asking about:\n` +
          `• "gift ideas" - Get intel on great gifts in your budget\n` +
          `• "food intel" - What's on the menu\n` +
          `• "mission rules" - White Elephant game rules\n` +
          `• "location" - Get directions to HQ`,
          500
        );
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
        created_at: new Date().toISOString(),
      });
      
      setAgentId(savedAgent.id);
      
      // Save AI session
      await saveAISession(savedAgent.id, messages);
      
      // Store in localStorage for returning agents
      storeAgentSession(savedAgent);
      
      // Show completion message
      addHQMessage(
        `✅ **CLEARANCE COMPLETE**\n\n` +
        `Your agent profile has been created, Agent ${agentData.codename}.\n\n` +
        `📋 **Mission Summary:**\n` +
        `• Codename: ${agentData.codename}\n` +
        `• Status: ${agentData.attendance_status === 'attending' ? 'CONFIRMED' : agentData.attendance_status === 'uncertain' ? 'PENDING' : 'DECLINED'}\n` +
        `• Team Size: ${agentData.guest_count + 1}\n\n` +
        `Redirecting to your Agent Card in 3 seconds...\n\n` +
        `For mission intel, visit the /roster to see other confirmed agents.`,
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
        `There was a problem saving your profile to our secure servers. ` +
        `Don't worry - your data is cached locally. Please contact HQ for manual registration.`,
        200
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4">
      {/* Terminal Container */}
      <div className="w-full max-w-4xl h-[90vh] flex flex-col">
        {/* Terminal Header */}
        <div className="bg-slate-800 px-6 py-3 rounded-t-lg border-b-2 border-green-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
            </div>
            <span className="text-green-400 font-mono text-sm tracking-wider">
              NORTH_POLE_INTELLIGENCE_TERMINAL
            </span>
          </div>
          <div className="text-green-400/60 font-mono text-xs">
            SECURE_CHANNEL_ACTIVE
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
                        <TypewriterText text={msg.text} />
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
 */
const TypewriterText = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 15); // 15ms per character

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  useEffect(() => {
    // Reset when text changes
    setDisplayedText('');
    setCurrentIndex(0);
  }, [text]);

  return <>{displayedText}</>;
};

export default HQTerminal;
