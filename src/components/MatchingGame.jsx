import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Christmas-themed emojis for the matching game
 */
const EMOJIS = ['🎁', '🎄', '⛄', '🎅', '🔔', '⭐'];

/**
 * AI difficulty levels
 */
const DIFFICULTY = {
  easy: { name: 'Easy', thinkTime: 2000, memoryAccuracy: 0.5 },
  medium: { name: 'Medium', thinkTime: 1500, memoryAccuracy: 0.75 },
  hard: { name: 'Hard', thinkTime: 1000, memoryAccuracy: 0.95 },
};

/**
 * Compact Matching Game Component
 * - Fixed header with scores (no scrolling issues)
 * - Color-coded matches for each player
 * - Smaller, tighter layout
 */
const MatchingGame = () => {
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [playerMatches, setPlayerMatches] = useState([]);
  const [aiMatches, setAiMatches] = useState([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState('medium');
  const [aiMemory, setAiMemory] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const allMatched = [...playerMatches, ...aiMatches];

  /**
   * Initialize the game board
   */
  const initializeGame = useCallback(() => {
    const cardPairs = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
      }));

    setCards(cardPairs);
    setFlippedIndices([]);
    setPlayerMatches([]);
    setAiMatches([]);
    setIsPlayerTurn(true);
    setGameStarted(true);
    setAiMemory([]);
    setGameOver(false);
    setIsProcessing(false);
  }, []);

  /**
   * Handle card click (player's turn)
   */
  const handleCardClick = (index) => {
    if (
      !isPlayerTurn ||
      isProcessing ||
      flippedIndices.includes(index) ||
      allMatched.includes(cards[index].emoji) ||
      flippedIndices.length >= 2
    ) {
      return;
    }

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    // AI observes the card for memory
    const newMemory = [...aiMemory, { emoji: cards[index].emoji, index }];
    setAiMemory(newMemory);

    if (newFlippedIndices.length === 2) {
      setIsProcessing(true);
      const [first, second] = newFlippedIndices;

      if (cards[first].emoji === cards[second].emoji) {
        // Player found a match!
        setTimeout(() => {
          setPlayerMatches([...playerMatches, cards[first].emoji]);
          setFlippedIndices([]);
          setIsProcessing(false);

          // Check if game is over
          if (allMatched.length + 1 === EMOJIS.length) {
            setGameOver(true);
          }
        }, 800);
      } else {
        // No match - switch to AI's turn
        setTimeout(() => {
          setFlippedIndices([]);
          setIsPlayerTurn(false);
          setIsProcessing(false);
        }, 1200);
      }
    }
  };

  /**
   * AI makes its move
   */
  useEffect(() => {
    if (!isPlayerTurn && !gameOver && gameStarted && !isProcessing) {
      setIsProcessing(true);
      const difficultySettings = DIFFICULTY[difficulty];

      setTimeout(() => {
        let firstCard = null;
        let secondCard = null;

        // Check if AI remembers any pairs
        const rememberedPairs = aiMemory.reduce((acc, card) => {
          const matchingCard = aiMemory.find(
            (c) => c.emoji === card.emoji && c.index !== card.index && !allMatched.includes(c.emoji)
          );
          if (matchingCard && Math.random() < difficultySettings.memoryAccuracy) {
            acc.push([card.index, matchingCard.index]);
          }
          return acc;
        }, []);

        if (rememberedPairs.length > 0) {
          const pair = rememberedPairs[0];
          firstCard = pair[0];
          secondCard = pair[1];
        } else {
          const availableCards = cards
            .map((card, idx) => ({ ...card, index: idx }))
            .filter((card) => !allMatched.includes(card.emoji));

          if (availableCards.length >= 2) {
            const randomCards = availableCards.sort(() => 0.5 - Math.random()).slice(0, 2);
            firstCard = randomCards[0].index;
            secondCard = randomCards[1].index;
          }
        }

        if (firstCard !== null && secondCard !== null) {
          setFlippedIndices([firstCard]);

          setTimeout(() => {
            setFlippedIndices([firstCard, secondCard]);

            setTimeout(() => {
              if (cards[firstCard].emoji === cards[secondCard].emoji) {
                setAiMatches([...aiMatches, cards[firstCard].emoji]);
                setFlippedIndices([]);

                if (allMatched.length + 1 === EMOJIS.length) {
                  setGameOver(true);
                  setIsProcessing(false);
                } else {
                  setIsProcessing(false);
                }
              } else {
                setFlippedIndices([]);
                setIsPlayerTurn(true);
                setIsProcessing(false);
              }
            }, 1000);
          }, 600);
        } else {
          setIsPlayerTurn(true);
          setIsProcessing(false);
        }
      }, difficultySettings.thinkTime);
    }
  }, [isPlayerTurn, gameOver, gameStarted, isProcessing, aiMemory, cards, allMatched, aiMatches, difficulty, playerMatches]);

  if (!gameStarted) {
    return (
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-display font-bold">
            Warm Up Your Brain 🧠
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">
            Think you can beat our AI? Find matching pairs before the computer does. First to 4 matches wins!
          </p>
        </div>

        {/* Difficulty Selection - Compact */}
        <div className="space-y-3">
          <div className="text-sm text-slate-400">Choose difficulty:</div>
          <div className="flex gap-3 justify-center">
            {Object.entries(DIFFICULTY).map(([key, { name }]) => (
              <button
                key={key}
                onClick={() => setDifficulty(key)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  difficulty === key
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={initializeGame}
          className="btn-festive text-base px-8"
        >
          Start Game
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Fixed Header - Always visible */}
      <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm -mx-6 -mt-6 px-6 pt-6 pb-4 rounded-t-3xl border-b border-slate-700/50 z-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl md:text-3xl font-display font-bold">
            Memory Match
          </h2>
          <button
            onClick={initializeGame}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 transition-all"
          >
            Reset
          </button>
        </div>

        {/* Score Display - Compact and Color-Coded */}
        <div className="flex gap-3 items-center justify-center">
          <div
            className={`flex-1 max-w-[200px] px-4 py-2.5 rounded-xl transition-all ${
              isPlayerTurn && !isProcessing
                ? 'bg-emerald-500/20 border-2 border-emerald-500'
                : 'bg-slate-800/50 border-2 border-transparent'
            }`}
          >
            <div className="text-xs text-slate-400 mb-0.5">You</div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-emerald-400">{playerMatches.length}</div>
              <div className="flex gap-0.5">
                {playerMatches.map((emoji, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-slate-600 font-bold">VS</div>

          <div
            className={`flex-1 max-w-[200px] px-4 py-2.5 rounded-xl transition-all ${
              !isPlayerTurn && !isProcessing
                ? 'bg-red-500/20 border-2 border-red-500'
                : 'bg-slate-800/50 border-2 border-transparent'
            }`}
          >
            <div className="text-xs text-slate-400 mb-0.5">AI</div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-red-400">{aiMatches.length}</div>
              <div className="flex gap-0.5">
                {aiMatches.map((emoji, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Turn Indicator */}
        <div className="text-center mt-3">
          <div className="text-sm">
            {isPlayerTurn ? (
              <span className="text-emerald-400 font-medium">Your turn</span>
            ) : (
              <span className="text-red-400 font-medium">AI is thinking...</span>
            )}
          </div>
        </div>
      </div>

      {/* Game Board - Compact Grid */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-md mx-auto pt-2">
        {cards.map((card, index) => {
          const isFlipped = flippedIndices.includes(index) || allMatched.includes(card.emoji);
          const isPlayerMatch = playerMatches.includes(card.emoji);
          const isAiMatch = aiMatches.includes(card.emoji);

          return (
            <motion.div
              key={card.id}
              className="aspect-square cursor-pointer perspective"
              onClick={() => handleCardClick(index)}
              whileHover={!isFlipped && isPlayerTurn ? { scale: 1.05 } : {}}
              whileTap={!isFlipped && isPlayerTurn ? { scale: 0.95 } : {}}
            >
              <motion.div
                className="relative w-full h-full"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Card Back */}
                <div
                  className="absolute inset-0 rounded-xl shadow-lg flex items-center justify-center"
                  style={{
                    backfaceVisibility: 'hidden',
                    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                  }}
                >
                  <div className="text-2xl opacity-30">?</div>
                </div>

                {/* Card Front - Color-coded by player */}
                <div
                  className={`absolute inset-0 rounded-xl shadow-lg flex items-center justify-center text-3xl sm:text-4xl ${
                    isPlayerMatch
                      ? 'bg-gradient-to-br from-emerald-600 to-emerald-700 ring-2 ring-emerald-400'
                      : isAiMatch
                      ? 'bg-gradient-to-br from-red-600 to-red-700 ring-2 ring-red-400'
                      : 'bg-gradient-to-br from-slate-700 to-slate-800'
                  }`}
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  {card.emoji}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Game Over Modal */}
      <AnimatePresence>
        {gameOver && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setGameOver(false)}
          >
            <motion.div
              className="glass-card rounded-2xl max-w-sm w-full p-8 text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-6xl mb-4">
                {playerMatches.length > aiMatches.length ? '🏆' : playerMatches.length < aiMatches.length ? '🤖' : '🤝'}
              </div>
              <h3 className="text-3xl font-bold mb-3">
                {playerMatches.length > aiMatches.length
                  ? 'You Win!'
                  : playerMatches.length < aiMatches.length
                  ? 'AI Wins!'
                  : "It's a Tie!"}
              </h3>
              <div className="flex gap-4 justify-center mb-6 text-lg">
                <div>
                  <span className="text-emerald-400 font-bold">{playerMatches.length}</span>
                  <span className="text-slate-400 text-sm ml-1">You</span>
                </div>
                <div className="text-slate-600">-</div>
                <div>
                  <span className="text-red-400 font-bold">{aiMatches.length}</span>
                  <span className="text-slate-400 text-sm ml-1">AI</span>
                </div>
              </div>
              <button
                onClick={initializeGame}
                className="btn-festive text-base w-full"
              >
                Play Again
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MatchingGame;
