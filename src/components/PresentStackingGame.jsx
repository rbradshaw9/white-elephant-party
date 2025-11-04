import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Present Tetris Game Component
 * Classic Tetris gameplay with present-themed pieces
 * Features:
 * - 7 tetromino shapes made of presents
 * - Arrow key controls (left, right, down, rotate)
 * - Line clearing with score
 * - Increasing difficulty
 */

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const CELL_SIZE = 24;

// Tetromino shapes (present clusters)
const SHAPES = {
  I: { shape: [[1], [1], [1], [1]], color: 'from-red-500 to-red-600' },
  O: { shape: [[1, 1], [1, 1]], color: 'from-emerald-500 to-emerald-600' },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: 'from-blue-500 to-blue-600' },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: 'from-amber-500 to-amber-600' },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: 'from-purple-500 to-purple-600' },
  J: { shape: [[1, 0, 0], [1, 1, 1]], color: 'from-pink-500 to-pink-600' },
  L: { shape: [[0, 0, 1], [1, 1, 1]], color: 'from-cyan-500 to-cyan-600' },
};

const SHAPE_KEYS = Object.keys(SHAPES);

const PresentStackingGame = () => {
  const [gameState, setGameState] = useState('idle'); // idle, playing, paused, gameOver
  const [board, setBoard] = useState([]);
  const [currentPiece, setCurrentPiece] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);

  // Clear old leaderboard on mount (one-time reset)
  useEffect(() => {
    localStorage.removeItem('presentTetrisLeaderboard');
  }, []);

  // Sound effects using Web Audio API with Christmas-y tones
  const playSound = (type) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Christmas-themed sounds (using major scale and bell-like tones)
    switch(type) {
      case 'move':
        // Gentle sleigh bell tinkle
        oscillator.type = 'sine';
        oscillator.frequency.value = 1047; // High C
        gainNode.gain.value = 0.08;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.04);
        break;
      case 'rotate':
        // Cheerful jingle
        oscillator.type = 'triangle';
        oscillator.frequency.value = 1319; // E
        gainNode.gain.value = 0.12;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.06);
        break;
      case 'land':
        // Soft thud like present hitting floor
        oscillator.type = 'sine';
        oscillator.frequency.value = 262; // Middle C
        gainNode.gain.value = 0.15;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.08);
        break;
      case 'line':
        // Jingle bells melody snippet (C-E-G-C)
        const frequencies = [523, 659, 784, 1047];
        frequencies.forEach((freq, i) => {
          setTimeout(() => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.type = 'sine';
            osc.frequency.value = freq;
            gain.gain.value = 0.18;
            osc.start();
            osc.stop(audioContext.currentTime + 0.12);
          }, i * 80);
        });
        break;
      case 'gameover':
        // Descending "aww" sound
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(392, audioContext.currentTime); // G
        oscillator.frequency.exponentialRampToValueAtTime(196, audioContext.currentTime + 0.4); // G (lower octave)
        gainNode.gain.value = 0.2;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.4);
        break;
      default:
        break;
    }
  };

  // Save score to leaderboard
  const saveScore = () => {
    if (!playerName.trim()) return;
    
    const newEntry = {
      name: playerName.trim().slice(0, 20), // Max 20 chars
      score,
      lines,
      level,
      date: new Date().toISOString(),
    };
    
    const updated = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10); // Keep top 10
    
    setLeaderboard(updated);
    localStorage.setItem('presentTetrisLeaderboard', JSON.stringify(updated));
    setShowLeaderboard(true);
    setPlayerName('');
  };

  // Check if score qualifies for leaderboard
  const isHighScore = () => {
    if (score === 0) return false;
    if (leaderboard.length < 10) return true;
    return score > leaderboard[leaderboard.length - 1].score;
  };

  // Initialize empty board
  const createEmptyBoard = () => {
    return Array(BOARD_HEIGHT).fill(null).map(() => 
      Array(BOARD_WIDTH).fill(null)
    );
  };

  // Generate random piece
  const randomPiece = () => {
    const shapeKey = SHAPE_KEYS[Math.floor(Math.random() * SHAPE_KEYS.length)];
    return {
      shape: SHAPES[shapeKey].shape,
      color: SHAPES[shapeKey].color,
    };
  };

  // Start game
  const startGame = () => {
    setBoard(createEmptyBoard());
    setCurrentPiece(randomPiece());
    setPosition({ x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 });
    setScore(0);
    setLines(0);
    setLevel(1);
    setGameState('playing');
  };

  // Check collision
  const checkCollision = (piece, pos, boardToCheck = board) => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = pos.x + x;
          const newY = pos.y + y;
          
          // Check boundaries
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
            return true;
          }
          
          // Check collision with placed pieces
          if (newY >= 0 && boardToCheck[newY][newX]) {
            return true;
          }
        }
      }
    }
    return false;
  };

  // Rotate piece
  const rotatePiece = (piece) => {
    const rotated = piece.shape[0].map((_, i) =>
      piece.shape.map(row => row[i]).reverse()
    );
    return { ...piece, shape: rotated };
  };

  // Merge piece to board
  const mergePieceToBoard = () => {
    const newBoard = board.map(row => [...row]);
    
    currentPiece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          const boardY = position.y + y;
          const boardX = position.x + x;
          if (boardY >= 0 && boardY < BOARD_HEIGHT) {
            newBoard[boardY][boardX] = currentPiece.color;
          }
        }
      });
    });
    
    return newBoard;
  };

  // Clear completed lines
  const clearLines = (boardToCheck) => {
    let linesCleared = 0;
    const newBoard = boardToCheck.filter(row => {
      const isFull = row.every(cell => cell !== null);
      if (isFull) linesCleared++;
      return !isFull;
    });
    
    // Add empty lines at top
    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(null));
    }
    
    return { newBoard, linesCleared };
  };

  // Move piece down
  const moveDown = useCallback(() => {
    if (gameState !== 'playing' || !currentPiece) return;
    
    const newPos = { ...position, y: position.y + 1 };
    
    if (!checkCollision(currentPiece, newPos)) {
      setPosition(newPos);
    } else {
      // Piece has landed
      playSound('land');
      const mergedBoard = mergePieceToBoard();
      const { newBoard, linesCleared } = clearLines(mergedBoard);
      
      if (linesCleared > 0) {
        playSound('line');
      }
      
      setBoard(newBoard);
      setLines(prev => prev + linesCleared);
      setScore(prev => prev + linesCleared * 100 * level);
      setLevel(Math.floor((lines + linesCleared) / 5) + 1); // Speed up every 5 lines
      
      // Spawn new piece
      const nextPiece = randomPiece();
      const nextPos = { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 };
      
      if (checkCollision(nextPiece, nextPos, newBoard)) {
        // Game over
        playSound('gameover');
        setGameState('gameOver');
        if (score > highScore) {
          setHighScore(score);
        }
      } else {
        setCurrentPiece(nextPiece);
        setPosition(nextPos);
      }
    }
  }, [gameState, currentPiece, position, board, score, highScore, lines, level]);

  // Handle keyboard input
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const handleKeyPress = (e) => {
      if (!currentPiece) return;
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const newPos = { ...position, x: position.x - 1 };
        if (!checkCollision(currentPiece, newPos)) {
          setPosition(newPos);
          playSound('move');
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const newPos = { ...position, x: position.x + 1 };
        if (!checkCollision(currentPiece, newPos)) {
          setPosition(newPos);
          playSound('move');
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        moveDown();
      } else if (e.key === 'ArrowUp' || e.key === ' ') {
        e.preventDefault();
        const rotated = rotatePiece(currentPiece);
        if (!checkCollision(rotated, position)) {
          setCurrentPiece(rotated);
          playSound('rotate');
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, currentPiece, position, moveDown]);

  // Auto-drop piece
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    // Exponential difficulty curve - gets much harder each level
    const baseSpeed = 800;
    const speedReduction = Math.pow(0.75, level - 1); // 25% faster each level
    const dropInterval = Math.max(50, baseSpeed * speedReduction);
    
    const timer = setInterval(moveDown, dropInterval);
    
    return () => clearInterval(timer);
  }, [gameState, level, moveDown]);

  // Render board with current piece
  const renderBoard = () => {
    // Only return the locked pieces, not the current falling piece
    return board.map(row => [...row]);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="glass-card rounded-3xl p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-300 to-emerald-400">
            🎁 Present Tetris
          </h2>
          <p className="text-slate-300 text-sm">
            Stack the presents! Use ← → to move, ↓ to drop faster, ↑ or Space to rotate
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-4 text-center">
          <div>
            <div className="text-xs text-slate-400">Score</div>
            <div className="text-xl font-bold text-emerald-400">{score}</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Lines</div>
            <div className="text-xl font-bold text-blue-400">{lines}</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Level</div>
            <div className="text-xl font-bold text-purple-400">{level}</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">
              <button 
                onClick={() => setShowLeaderboard(!showLeaderboard)}
                className="hover:text-amber-400 transition-colors"
              >
                🏆 Top 10
              </button>
            </div>
            <div className="text-xl font-bold text-amber-400">
              {leaderboard.length > 0 ? leaderboard[0].score : 0}
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <AnimatePresence>
          {showLeaderboard && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 overflow-hidden"
            >
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-bold text-amber-400">🏆 Top 10 Scores</h3>
                  <button
                    onClick={() => setShowLeaderboard(false)}
                    className="text-slate-400 hover:text-white text-sm"
                  >
                    ✕
                  </button>
                </div>
                {leaderboard.length === 0 ? (
                  <p className="text-slate-400 text-sm text-center py-4">No scores yet. Be the first!</p>
                ) : (
                  <div className="space-y-2">
                    {leaderboard.map((entry, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center text-sm bg-slate-900/50 rounded px-3 py-2"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`font-bold ${index < 3 ? 'text-amber-400' : 'text-slate-400'}`}>
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                          </span>
                          <span className="text-white font-semibold">{entry.name}</span>
                        </div>
                        <div className="flex gap-4 text-slate-400">
                          <span>{entry.score} pts</span>
                          <span>L{entry.level}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Container */}
        <div className="flex justify-center">
          <div className="relative bg-slate-900/50 rounded-2xl border-2 border-slate-700 p-2">
            {/* Board */}
            <div 
              className="grid gap-[1px] bg-slate-800/50 relative"
              style={{
                gridTemplateColumns: `repeat(${BOARD_WIDTH}, ${CELL_SIZE}px)`,
                gridTemplateRows: `repeat(${BOARD_HEIGHT}, ${CELL_SIZE}px)`,
              }}
            >
              {/* Locked pieces */}
              {renderBoard().map((row, y) =>
                row.map((cell, x) => (
                  <div
                    key={`${y}-${x}`}
                    className={`${
                      cell 
                        ? `bg-gradient-to-br ${cell} border border-white/20` 
                        : ''
                    } rounded-sm flex items-center justify-center`}
                    style={{ width: CELL_SIZE, height: CELL_SIZE }}
                  >
                    {cell && <span className="text-[10px]">🎀</span>}
                  </div>
                ))
              )}
              
              {/* Current falling piece - rendered on top as absolute positioned */}
              {currentPiece && gameState === 'playing' && (
                <div className="absolute top-0 left-0 pointer-events-none">
                  {currentPiece.shape.map((row, y) =>
                    row.map((cell, x) => {
                      if (!cell) return null;
                      const boardY = position.y + y;
                      const boardX = position.x + x;
                      if (boardY < 0 || boardY >= BOARD_HEIGHT || boardX < 0 || boardX >= BOARD_WIDTH) return null;
                      
                      return (
                        <div
                          key={`current-${y}-${x}`}
                          className={`absolute bg-gradient-to-br ${currentPiece.color} border border-white/20 rounded-sm flex items-center justify-center`}
                          style={{
                            width: CELL_SIZE,
                            height: CELL_SIZE,
                            left: boardX * (CELL_SIZE + 1),
                            top: boardY * (CELL_SIZE + 1),
                          }}
                        >
                          <span className="text-[10px]">🎀</span>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* Overlays */}
            <AnimatePresence>
              {gameState === 'idle' && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center bg-slate-900/90 rounded-2xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <button onClick={startGame} className="btn-festive text-xl px-8 py-4">
                    Start Game!
                  </button>
                </motion.div>
              )}

              {gameState === 'gameOver' && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center bg-slate-900/90 rounded-2xl"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="text-center px-4 max-w-sm">
                    <div className="text-6xl mb-4">🎁</div>
                    <h3 className="text-3xl font-bold text-red-400 mb-2">Game Over!</h3>
                    <p className="text-xl text-slate-300 mb-2">Score: {score}</p>
                    <p className="text-lg text-slate-400 mb-4">Lines: {lines} • Level: {level}</p>
                    
                    {isHighScore() && !showLeaderboard && (
                      <div className="mb-4">
                        <p className="text-emerald-400 font-semibold mb-3">🎉 Top 10 Score!</p>
                        <input
                          type="text"
                          value={playerName}
                          onChange={(e) => setPlayerName(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && saveScore()}
                          placeholder="Enter your name"
                          maxLength={20}
                          className="w-full px-4 py-2 rounded-lg bg-slate-800 text-white border-2 border-emerald-500 focus:outline-none focus:border-emerald-400 mb-2"
                        />
                        <button
                          onClick={saveScore}
                          disabled={!playerName.trim()}
                          className="btn-festive-green text-sm px-4 py-2 w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Save Score
                        </button>
                      </div>
                    )}
                    
                    <div className="flex flex-col gap-2">
                      {!showLeaderboard && (
                        <button
                          onClick={() => setShowLeaderboard(true)}
                          className="btn-festive text-sm px-4 py-2"
                        >
                          View Leaderboard
                        </button>
                      )}
                      <button onClick={startGame} className="btn-festive-green text-lg px-6 py-3">
                        Play Again
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Controls (optional) */}
        {gameState === 'playing' && (
          <div className="mt-4 md:hidden">
            <div className="flex justify-center gap-2 mb-2">
              <button
                onClick={() => {
                  const newPos = { ...position, x: position.x - 1 };
                  if (!checkCollision(currentPiece, newPos)) {
                    setPosition(newPos);
                  }
                }}
                className="btn-festive px-6 py-3"
              >
                ←
              </button>
              <button
                onClick={() => {
                  const rotated = rotatePiece(currentPiece);
                  if (!checkCollision(rotated, position)) {
                    setCurrentPiece(rotated);
                  }
                }}
                className="btn-festive-green px-6 py-3"
              >
                ↻
              </button>
              <button
                onClick={() => {
                  const newPos = { ...position, x: position.x + 1 };
                  if (!checkCollision(currentPiece, newPos)) {
                    setPosition(newPos);
                  }
                }}
                className="btn-festive px-6 py-3"
              >
                →
              </button>
            </div>
            <div className="flex justify-center">
              <button onClick={moveDown} className="btn-festive px-12 py-3">
                ↓ Drop
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        {gameState === 'playing' && (
          <motion.div
            className="mt-4 text-center text-slate-400 text-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p>💡 Clear lines to score points • Speed increases every 5 lines</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PresentStackingGame;
