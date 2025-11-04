import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAccess } from '../context/AccessContext';
import { useTheme } from '../context/ThemeContext';
import CodenameQuiz from '../components/CodenameQuiz';

/**
 * Access Gate Component
 * Terminal-style authentication screen for The Great Gift Heist
 * Features:
 * - Retro CRT terminal aesthetics
 * - Typewriter boot sequence
 * - Code validation with animations
 * - AI-powered codename quiz
 * - Vault unlock effect
 */
const AccessGate = () => {
  const navigate = useNavigate();
  const { validateCode, hasAccess, isLoading, grantAccess } = useAccess();
  const { setTheme, isHeistTheme } = useTheme();
  const [inputCode, setInputCode] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [bootComplete, setBootComplete] = useState(false);
  const [validationState, setValidationState] = useState(null); // 'validating', 'success', 'denied', 'quiz'
  const [attempts, setAttempts] = useState(0);
  const [bootText, setBootText] = useState([]);
  const [progressPercent, setProgressPercent] = useState(0);
  const [assignedCodename, setAssignedCodename] = useState('');
  const inputRef = useRef(null);

  // Boot sequence messages
  const bootSequence = [
    '> INITIALIZING NORTH POLE INTELLIGENCE TERMINAL v4.2.5',
    '> Loading secure protocols...',
    '> Establishing encrypted connection...',
    'PROGRESS_BAR', // Special marker for animated progress bar
    '> CONNECTION ESTABLISHED',
    '> OPERATION SANTA\'S MANIFEST - ACTIVE',
    '',
    '⚠️  CLASSIFIED ACCESS REQUIRED ⚠️',
    '',
    'Enter your Agent Access Code to proceed...',
  ];

  // Redirect immediately if already authenticated (before boot sequence)
  useEffect(() => {
    if (!isLoading && hasAccess) {
      navigate('/', { replace: true });
    }
  }, [hasAccess, isLoading, navigate]);

  // Run boot sequence on mount (only if not already authenticated)
  useEffect(() => {
    // Don't run boot sequence if already has access
    if (hasAccess) return;

    // Force heist theme for access gate
    setTheme('heist');

    let index = 0;
    const interval = setInterval(() => {
      if (index < bootSequence.length) {
        const currentLine = bootSequence[index];
        
        // If we hit the progress bar marker, animate it
        if (currentLine === 'PROGRESS_BAR') {
          setBootText((prev) => [...prev, currentLine]);
          
          // Pause the boot sequence while progress animates
          clearInterval(interval);
          
          // Animate progress from 0 to 100
          let progress = 0;
          const progressInterval = setInterval(() => {
            progress += 5;
            setProgressPercent(progress);
            if (progress >= 100) {
              clearInterval(progressInterval);
              // Resume boot sequence after progress completes
              index++;
              continueBootSequence(index);
            }
          }, 30); // Update every 30ms for smooth animation
        } else {
          setBootText((prev) => [...prev, currentLine]);
          index++;
        }
      } else {
        clearInterval(interval);
        setBootComplete(true);
        setTimeout(() => setShowInput(true), 1000);
      }
    }, 600); // Slowed from 300ms to 600ms per line

    // Helper function to continue boot sequence after progress bar
    const continueBootSequence = (startIndex) => {
      let idx = startIndex;
      const resumeInterval = setInterval(() => {
        if (idx < bootSequence.length) {
          setBootText((prev) => [...prev, bootSequence[idx]]);
          idx++;
        } else {
          clearInterval(resumeInterval);
          setBootComplete(true);
          setTimeout(() => setShowInput(true), 1000);
        }
      }, 600);
    };

    return () => clearInterval(interval);
  }, [setTheme, hasAccess]);

  // Focus input when shown
  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInput]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputCode.trim()) return;

    setValidationState('validating');

    // Simulate validation delay
    setTimeout(async () => {
      const isValid = await validateCode(inputCode);
      
      if (isValid) {
        setValidationState('success');
        // After success animation, show quiz
        setTimeout(() => {
          setValidationState('quiz');
        }, 3500);
      } else {
        setValidationState('denied');
        setAttempts(prev => prev + 1);
        // Reset after showing error
        setTimeout(() => {
          setValidationState(null);
          setInputCode('');
          inputRef.current?.focus();
        }, 3000);
      }
    }, 2000);
  };  const handleCodenameComplete = (codename) => {
    setAssignedCodename(codename);
    // Store codename in access context
    grantAccess(false, codename);
    // Redirect to main site
    setTimeout(() => {
      navigate('/');
    }, 500);
  };

  const handleInputChange = (e) => {
    // Only allow input if not currently validating
    if (validationState !== 'validating' && validationState !== 'success') {
      setInputCode(e.target.value.toUpperCase());
    }
  };

  // Show loading or nothing if already authenticated
  if (isLoading || hasAccess) {
    return (
      <div className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center">
        {isLoading && (
          <div className="text-green-400 font-mono">Loading...</div>
        )}
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center">
      {/* CRT Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-green-500/5 to-transparent animate-scan" 
           style={{
             backgroundSize: '100% 4px',
             animation: 'scan 8s linear infinite'
           }} 
      />

      {/* Static Noise Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10"
           style={{
             backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
             animation: 'noise 0.2s infinite'
           }}
      />

      {/* Vignette Effect */}
      <div className="absolute inset-0 pointer-events-none bg-radial-gradient opacity-60"
           style={{
             background: 'radial-gradient(circle, transparent 0%, black 100%)'
           }}
      />

      {/* Main Terminal Container */}
      <div className="relative z-10 w-full max-w-4xl mx-4">
        <motion.div
          className="bg-black/90 border-4 border-green-500/30 rounded-lg p-8 shadow-2xl shadow-green-500/20"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            boxShadow: '0 0 40px rgba(34, 197, 94, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.8)'
          }}
        >
          {/* CRT Screen Glow */}
          <div className="absolute inset-0 bg-green-500/5 rounded-lg pointer-events-none" />

          {/* Terminal Header */}
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-green-500/30">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="text-green-400 font-mono text-sm ml-4 tracking-wider">
              NORTH_POLE_INTELLIGENCE_TERMINAL
            </div>
          </div>

          {/* Terminal Content */}
          <div className="font-mono text-green-400 text-sm leading-relaxed min-h-[400px]">
            {/* Boot Sequence */}
            <AnimatePresence>
              {bootText.map((line, index) => {
                // Special rendering for progress bar
                if (line === 'PROGRESS_BAR') {
                  const barLength = 20;
                  const filledLength = Math.floor((progressPercent / 100) * barLength);
                  const emptyLength = barLength - filledLength;
                  const progressBar = '█'.repeat(filledLength) + '░'.repeat(emptyLength);
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.1 }}
                      className="text-green-300"
                    >
                      {`> [${progressBar}] ${progressPercent}%`}
                    </motion.div>
                  );
                }
                
                // Regular line rendering
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.1 }}
                    className={
                      line && line.startsWith('>') ? 'text-green-300' : 
                      line && line.startsWith('⚠️') ? 'text-yellow-400 font-bold' : 
                      'text-green-400'
                    }
                  >
                    {line || '\u00A0'}
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Input Prompt */}
            {bootComplete && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6"
              >
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                  <span className="text-cyan-400 font-bold">ENTER ACCESS CODE:</span>
                  {showInput && (
                    <div className="relative flex-1">
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputCode}
                        onChange={handleInputChange}
                        disabled={validationState === 'validating' || validationState === 'success'}
                        className="bg-transparent border-none outline-none text-green-300 font-mono text-sm tracking-widest w-full"
                        style={{
                          caretColor: 'lime',
                          textShadow: '0 0 5px rgba(34, 197, 94, 0.8)'
                        }}
                        maxLength={20}
                        autoComplete="off"
                        spellCheck="false"
                      />
                      <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="text-green-400 ml-1"
                      >
                        █
                      </motion.span>
                    </div>
                  )}
                </form>

                {/* Validation States */}
                <AnimatePresence>
                  {validationState === 'validating' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="mt-4 text-yellow-400"
                    >
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          ⟳
                        </motion.div>
                        VALIDATING ACCESS CODE...
                      </div>
                    </motion.div>
                  )}

                  {validationState === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-4"
                    >
                      <div className="text-green-400 font-bold text-lg mb-2">
                        ✓ ACCESS GRANTED
                      </div>
                      <div className="text-green-300 text-sm">
                        &gt; Decrypting mission files...
                      </div>
                      <div className="text-green-300 text-sm">
                        &gt; Unlocking vault interface...
                      </div>
                      
                      {/* Vault Opening Animation */}
                      <motion.div
                        className="mt-6 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <motion.div
                          className="text-6xl"
                          initial={{ scale: 0 }}
                          animate={{ scale: [0, 1.2, 1] }}
                          transition={{ duration: 0.8 }}
                        >
                          🔓
                        </motion.div>
                        <motion.div
                          className="text-cyan-400 mt-4 font-bold tracking-widest"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          WELCOME, AGENT
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  )}

                  {validationState === 'denied' && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-4"
                    >
                      <div className="text-red-500 font-bold">
                        ⚠️ ACCESS DENIED
                      </div>
                      <div className="text-red-400 text-sm mt-1">
                        &gt; Invalid access code. Security protocols engaged.
                      </div>
                      {attempts >= 2 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-yellow-400 text-sm mt-2"
                        >
                          &gt; Unauthorized entry detected. Elves have been notified.
                        </motion.div>
                      )}
                      {attempts >= 4 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-red-400 text-sm mt-1"
                        >
                          &gt; Please report to the Naughty List Processing Center.
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Help Text */}
                {!validationState && attempts === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-8 text-green-500/60 text-xs"
                  >
                    <div>Hint: Your access code was included in your mission invitation.</div>
                    <div className="mt-1">Format: XXX-XXXXXXXXXXXX</div>
                  </motion.div>
                )}

                {/* Bypass for Development (remove in production) */}
                {process.env.NODE_ENV === 'development' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                    className="mt-8 text-yellow-500/40 text-xs border-t border-yellow-500/20 pt-4"
                  >
                    <div>DEV MODE: Universal code = RED-SLEIGH-2025</div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Bottom Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
          className="text-center mt-6 text-green-500/40 font-mono text-xs"
        >
          <div>NORTH POLE INTELLIGENCE DIVISION • OPERATION SANTA'S MANIFEST</div>
          <div className="mt-1">CLASSIFIED: EYES ONLY</div>
        </motion.div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        
        @keyframes noise {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -5%); }
          20% { transform: translate(-10%, 5%); }
          30% { transform: translate(5%, -10%); }
          40% { transform: translate(-5%, 15%); }
          50% { transform: translate(-10%, 5%); }
          60% { transform: translate(15%, 0); }
          70% { transform: translate(0, 10%); }
          80% { transform: translate(-15%, 0); }
          90% { transform: translate(10%, 5%); }
        }
      `}</style>

      {/* Codename Quiz Overlay */}
      <AnimatePresence>
        {validationState === 'quiz' && (
          <motion.div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CodenameQuiz 
              onComplete={handleCodenameComplete}
              isHeistTheme={isHeistTheme}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AccessGate;
