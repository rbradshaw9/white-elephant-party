import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Present Jenga Game Component
 * Jenga/Bandu style game where players click blocks to remove them without toppling the tower
 * Features:
 * - Click to remove blocks
 * - Physics simulation for stability
 * - Score tracking (blocks removed)
 * - Tower collapse detection
 */

const PRESENT_COLORS = [
  'from-red-500 to-red-600',
  'from-emerald-500 to-emerald-600',
  'from-blue-500 to-blue-600',
  'from-amber-500 to-amber-600',
  'from-purple-500 to-purple-600',
  'from-pink-500 to-pink-600',
];

const PresentStackingGame = () => {
  const [gameState, setGameState] = useState('idle'); // idle, playing, gameOver
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [tower, setTower] = useState([]);
  const [shakingBlock, setShakingBlock] = useState(null);
  const [towerShake, setTowerShake] = useState(0);

  // Initialize tower
  const startGame = () => {
    const initialTower = [];
    const layers = 8; // Start with 8 layers
    
    for (let layer = 0; layer < layers; layer++) {
      const blocksInLayer = 3;
      const isHorizontal = layer % 2 === 0;
      
      for (let block = 0; block < blocksInLayer; block++) {
        initialTower.push({
          id: `${layer}-${block}`,
          layer,
          position: block,
          isHorizontal,
          removed: false,
          color: PRESENT_COLORS[layer % PRESENT_COLORS.length],
        });
      }
    }
    
    setTower(initialTower);
    setGameState('playing');
    setScore(0);
    setTowerShake(0);
  };

  // Try to remove a block
  const removeBlock = (blockId) => {
    if (gameState !== 'playing') return;
    
    const block = tower.find(b => b.id === blockId);
    if (!block || block.removed) return;

    // Check if block can be removed (stability check)
    const canRemove = checkIfRemovable(block);
    
    if (!canRemove) {
      // Tower collapses!
      setGameState('gameOver');
      if (score > highScore) {
        setHighScore(score);
      }
      return;
    }

    // Shake block before removing
    setShakingBlock(blockId);
    
    setTimeout(() => {
      // Remove the block
      setTower(prev => prev.map(b => 
        b.id === blockId ? { ...b, removed: true } : b
      ));
      setScore(prev => prev + 1);
      setShakingBlock(null);
      
      // Add tower shake for effect
      setTowerShake(prev => prev + 1);
      setTimeout(() => setTowerShake(0), 300);
    }, 500);
  };

  // Check if block can be safely removed (simplified Jenga logic)
  const checkIfRemovable = (block) => {
    const { layer, position } = block;
    
    // Can't remove from bottom layer
    if (layer === 0) return false;
    
    // Check if there are blocks above
    const blocksAbove = tower.filter(b => 
      !b.removed && b.layer === layer + 1
    );
    
    if (blocksAbove.length === 0) {
      // Top layer - can remove any
      return true;
    }
    
    // Check current layer - need at least 2 blocks for support
    const currentLayerBlocks = tower.filter(b => 
      !b.removed && b.layer === layer
    );
    
    if (currentLayerBlocks.length <= 2) {
      // Risky! 50% chance of collapse
      return Math.random() > 0.5;
    }
    
    // Middle blocks are safer than edge blocks
    if (position === 1) {
      return Math.random() > 0.2; // 80% success
    } else {
      return Math.random() > 0.3; // 70% success
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="glass-card rounded-3xl p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-300 to-emerald-400">
            🎁 Present Jenga
          </h2>
          <p className="text-slate-300 text-sm">
            Click blocks to remove them without toppling the tower!
          </p>
        </div>

        {/* Score Display */}
        <div className="flex justify-between items-center mb-4 px-4">
          <div className="text-center">
            <div className="text-sm text-slate-400">Blocks Removed</div>
            <div className="text-3xl font-bold text-emerald-400">{score}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-slate-400">High Score</div>
            <div className="text-3xl font-bold text-amber-400">{highScore}</div>
          </div>
        </div>

        {/* Game Area */}
        <div 
          className="relative bg-slate-900/50 rounded-2xl border-2 border-slate-700 overflow-hidden flex items-center justify-center"
          style={{ height: '500px' }}
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
                Start Game!
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
                <motion.div 
                  className="text-6xl mb-4"
                  animate={{ 
                    rotate: [0, -10, 10, -10, 0],
                    y: [0, -20, 0]
                  }}
                  transition={{ duration: 0.5 }}
                >
                  💥
                </motion.div>
                <h3 className="text-3xl font-bold text-red-400 mb-2">Tower Collapsed!</h3>
                <p className="text-xl text-slate-300 mb-4">You removed {score} blocks</p>
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

          {/* Tower */}
          {gameState === 'playing' && (
            <motion.div 
              className="relative"
              animate={{ 
                x: towerShake !== 0 ? [0, -3, 3, -3, 3, 0] : 0,
                y: towerShake !== 0 ? [0, -2, 2, -2, 2, 0] : 0
              }}
              transition={{ duration: 0.3 }}
            >
              {/* Render tower from bottom to top */}
              {Array.from({ length: 8 }).map((_, layerIndex) => {
                const layerBlocks = tower.filter(b => b.layer === layerIndex);
                const isHorizontal = layerIndex % 2 === 0;
                
                return (
                  <div
                    key={layerIndex}
                    className="relative flex justify-center items-center"
                    style={{
                      height: '48px',
                      marginBottom: '2px',
                    }}
                  >
                    {layerBlocks.map(block => (
                      <AnimatePresence key={block.id}>
                        {!block.removed && (
                          <motion.button
                            onClick={() => removeBlock(block.id)}
                            className={`absolute bg-gradient-to-br ${block.color} rounded border-2 border-white/20 shadow-lg hover:border-white/40 hover:shadow-xl transition-all cursor-pointer disabled:cursor-not-allowed`}
                            style={{
                              width: isHorizontal ? '80px' : '140px',
                              height: '40px',
                              left: isHorizontal 
                                ? `${block.position * 48}px`
                                : '50%',
                              transform: isHorizontal 
                                ? 'none'
                                : `translateX(-50%) rotate(90deg) translateY(${(block.position - 1) * 48}px)`,
                            }}
                            animate={
                              shakingBlock === block.id
                                ? { x: [-2, 2, -2, 2, 0], y: [-1, 1, -1, 1, 0] }
                                : {}
                            }
                            exit={{ 
                              opacity: 0,
                              scale: 0.5,
                              transition: { duration: 0.3 }
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <div className="text-xl">🎀</div>
                          </motion.button>
                        )}
                      </AnimatePresence>
                    ))}
                  </div>
                );
              })}
            </motion.div>
          )}

          {/* Ground */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-emerald-500 to-amber-500"></div>
        </div>

        {/* Instructions */}
        {gameState === 'playing' && (
          <motion.div 
            className="mt-4 text-center text-slate-400 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p>💡 Click blocks to remove them • Middle blocks are safer • Keep the tower standing!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PresentStackingGame;
