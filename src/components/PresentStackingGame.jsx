import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Present Stacking Game Component
 * Physics-based game where players stack falling presents as tall as possible
 * Features:
 * - Falling presents with physics
 * - Stack height tracking
 * - Game over detection
 * - Restart functionality
 * - Responsive design
 */

const PRESENT_COLORS = [
  'from-red-500 to-red-600',
  'from-emerald-500 to-emerald-600',
  'from-blue-500 to-blue-600',
  'from-amber-500 to-amber-600',
  'from-purple-500 to-purple-600',
];

const PresentStackingGame = () => {
  const [gameState, setGameState] = useState('idle'); // idle, playing, gameOver
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [presents, setPresents] = useState([]);
  const [currentPresent, setCurrentPresent] = useState(null);
  const [position, setPosition] = useState(50); // Percentage from left
  const gameAreaRef = useRef(null);

  // Start game
  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setPresents([]);
    spawnNewPresent();
  };

  // Spawn a new falling present
  const spawnNewPresent = () => {
    const size = 60 + Math.random() * 20; // Random width between 60-80px
    setCurrentPresent({
      id: Date.now(),
      width: size,
      color: PRESENT_COLORS[Math.floor(Math.random() * PRESENT_COLORS.length)],
      x: 50, // Start in center
    });
    setPosition(50);
  };

  // Drop present
  const dropPresent = () => {
    if (!currentPresent || gameState !== 'playing') return;

    const newPresent = {
      ...currentPresent,
      x: position,
      y: presents.length, // Stack height
    };

    // Check if present is balanced (simple collision detection)
    const isBalanced = checkBalance(newPresent, presents);

    if (!isBalanced && presents.length > 0) {
      // Game over
      setGameState('gameOver');
      if (score > highScore) {
        setHighScore(score);
      }
      return;
    }

    // Add to stack
    setPresents([...presents, newPresent]);
    setScore(score + 1);
    
    // Spawn next present
    setTimeout(() => spawnNewPresent(), 300);
  };

  // Simple balance check - present must overlap with previous one
  const checkBalance = (newPresent, stack) => {
    if (stack.length === 0) return true; // First present always lands
    
    const lastPresent = stack[stack.length - 1];
    const lastLeft = lastPresent.x - lastPresent.width / 2;
    const lastRight = lastPresent.x + lastPresent.width / 2;
    const newLeft = newPresent.x - newPresent.width / 2;
    const newRight = newPresent.x + newPresent.width / 2;

    // Check if there's any overlap
    const hasOverlap = !(newRight < lastLeft || newLeft > lastRight);
    return hasOverlap;
  };

  // Move present left/right with arrow keys
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameState !== 'playing') return;

      if (e.key === 'ArrowLeft') {
        setPosition(prev => Math.max(10, prev - 5));
      } else if (e.key === 'ArrowRight') {
        setPosition(prev => Math.min(90, prev + 5));
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        dropPresent();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, position, currentPresent, presents, score]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="glass-card rounded-3xl p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-300 to-emerald-400">
            🎁 Present Stacking
          </h2>
          <p className="text-slate-300 text-sm">
            Stack presents as high as you can! Use ← → arrows to move, Space/Enter to drop
          </p>
        </div>

        {/* Score Display */}
        <div className="flex justify-between items-center mb-4 px-4">
          <div className="text-center">
            <div className="text-sm text-slate-400">Height</div>
            <div className="text-3xl font-bold text-emerald-400">{score}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-slate-400">High Score</div>
            <div className="text-3xl font-bold text-amber-400">{highScore}</div>
          </div>
        </div>

        {/* Game Area */}
        <div 
          ref={gameAreaRef}
          className="relative bg-slate-900/50 rounded-2xl border-2 border-slate-700 overflow-hidden"
          style={{ height: '400px' }}
        >
          {gameState === 'idle' && (
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <button
                onClick={startGame}
                className="btn-festive text-xl px-8 py-4"
              >
                Start Stacking!
              </button>
            </motion.div>
          )}

          {gameState === 'gameOver' && (
            <motion.div 
              className="absolute inset-0 flex items-center justify-center bg-slate-900/90 z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">😱</div>
                <h3 className="text-3xl font-bold text-red-400 mb-2">Tower Collapsed!</h3>
                <p className="text-xl text-slate-300 mb-4">You stacked {score} presents</p>
                {score === highScore && score > 0 && (
                  <p className="text-emerald-400 font-semibold mb-4">🎉 New High Score!</p>
                )}
                <button
                  onClick={startGame}
                  className="btn-festive-green text-lg px-6 py-3"
                >
                  Try Again
                </button>
              </div>
            </motion.div>
          )}

          {/* Current Falling Present */}
          <AnimatePresence>
            {gameState === 'playing' && currentPresent && (
              <motion.div
                initial={{ y: -80 }}
                className="absolute top-4"
                style={{
                  left: `${position}%`,
                  transform: 'translateX(-50%)',
                  width: `${currentPresent.width}px`,
                  height: '60px',
                }}
              >
                <div className={`w-full h-full bg-gradient-to-br ${currentPresent.color} rounded-lg shadow-xl border-2 border-white/20 flex items-center justify-center`}>
                  <div className="text-2xl">🎀</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stacked Presents */}
          <div className="absolute bottom-0 left-0 right-0">
            {presents.map((present, index) => (
              <motion.div
                key={present.id}
                initial={{ y: -400, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute"
                style={{
                  bottom: `${index * 60}px`,
                  left: `${present.x}%`,
                  transform: 'translateX(-50%)',
                  width: `${present.width}px`,
                  height: '60px',
                }}
              >
                <div className={`w-full h-full bg-gradient-to-br ${present.color} rounded-lg shadow-lg border-2 border-white/20 flex items-center justify-center`}>
                  <div className="text-2xl">🎀</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Ground Line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-emerald-500 to-amber-500"></div>
        </div>

        {/* Controls Hint */}
        {gameState === 'playing' && (
          <motion.div 
            className="mt-4 text-center text-slate-400 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex justify-center gap-4 flex-wrap">
              <span>← → Move</span>
              <span>|</span>
              <span>Space/Enter Drop</span>
            </div>
          </motion.div>
        )}

        {/* Mobile Controls */}
        {gameState === 'playing' && (
          <div className="mt-4 flex justify-center gap-3 md:hidden">
            <button
              onClick={() => setPosition(prev => Math.max(10, prev - 5))}
              className="btn-festive px-6 py-3"
            >
              ←
            </button>
            <button
              onClick={dropPresent}
              className="btn-festive-green px-8 py-3"
            >
              Drop
            </button>
            <button
              onClick={() => setPosition(prev => Math.min(90, prev + 5))}
              className="btn-festive px-6 py-3"
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PresentStackingGame;
