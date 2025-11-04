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
  I: { shape: [[1, 1, 1, 1]], color: 'from-red-500 to-red-600' },
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
      const mergedBoard = mergePieceToBoard();
      const { newBoard, linesCleared } = clearLines(mergedBoard);
      
      setBoard(newBoard);
      setLines(prev => prev + linesCleared);
      setScore(prev => prev + linesCleared * 100 * level);
      setLevel(Math.floor((lines + linesCleared) / 10) + 1);
      
      // Spawn new piece
      const nextPiece = randomPiece();
      const nextPos = { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 };
      
      if (checkCollision(nextPiece, nextPos, newBoard)) {
        // Game over
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
        const newPos = { ...position, x: position.x - 1 };
        if (!checkCollision(currentPiece, newPos)) {
          setPosition(newPos);
        }
      } else if (e.key === 'ArrowRight') {
        const newPos = { ...position, x: position.x + 1 };
        if (!checkCollision(currentPiece, newPos)) {
          setPosition(newPos);
        }
      } else if (e.key === 'ArrowDown') {
        moveDown();
      } else if (e.key === 'ArrowUp' || e.key === ' ') {
        e.preventDefault();
        const rotated = rotatePiece(currentPiece);
        if (!checkCollision(rotated, position)) {
          setCurrentPiece(rotated);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, currentPiece, position, moveDown]);

  // Auto-drop piece
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const dropInterval = Math.max(100, 1000 - (level - 1) * 100);
    const timer = setInterval(moveDown, dropInterval);
    
    return () => clearInterval(timer);
  }, [gameState, level, moveDown]);

  // Render board with current piece
  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);
    
    // Add current piece to display
    if (currentPiece && gameState === 'playing') {
      currentPiece.shape.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell) {
            const boardY = position.y + y;
            const boardX = position.x + x;
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              displayBoard[boardY][boardX] = currentPiece.color;
            }
          }
        });
      });
    }
    
    return displayBoard;
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
            <div className="text-xs text-slate-400">High</div>
            <div className="text-xl font-bold text-amber-400">{highScore}</div>
          </div>
        </div>

        {/* Game Container */}
        <div className="flex justify-center">
          <div className="relative bg-slate-900/50 rounded-2xl border-2 border-slate-700 p-2">
            {/* Board */}
            <div 
              className="grid gap-[1px] bg-slate-800/50"
              style={{
                gridTemplateColumns: `repeat(${BOARD_WIDTH}, ${CELL_SIZE}px)`,
                gridTemplateRows: `repeat(${BOARD_HEIGHT}, ${CELL_SIZE}px)`,
              }}
            >
              {renderBoard().map((row, y) =>
                row.map((cell, x) => (
                  <div
                    key={`${y}-${x}`}
                    className={`${
                      cell 
                        ? `bg-gradient-to-br ${cell} border border-white/20` 
                        : 'bg-slate-900/30'
                    } rounded-sm flex items-center justify-center transition-all`}
                    style={{ width: CELL_SIZE, height: CELL_SIZE }}
                  >
                    {cell && <span className="text-[10px]">🎀</span>}
                  </div>
                ))
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
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎁</div>
                    <h3 className="text-3xl font-bold text-red-400 mb-2">Game Over!</h3>
                    <p className="text-xl text-slate-300 mb-2">Score: {score}</p>
                    <p className="text-lg text-slate-400 mb-4">Lines: {lines}</p>
                    {score === highScore && score > 0 && (
                      <p className="text-emerald-400 font-semibold mb-4">🎉 New High Score!</p>
                    )}
                    <button onClick={startGame} className="btn-festive-green text-lg px-6 py-3">
                      Play Again
                    </button>
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
            <p>💡 Clear lines to score points • Speed increases every 10 lines</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PresentStackingGame;
