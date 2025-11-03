import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Christmas-themed emojis for the matching game
 */
const EMOJIS = ['🎁', '🎄', '⛄', '🎅', '🔔', '⭐', '🕯️', '🦌'];

/**
 * AI difficulty levels
 */
const DIFFICULTY = {
  easy: { name: 'Easy', thinkTime: 2000, memoryAccuracy: 0.5 },
  medium: { name: 'Medium', thinkTime: 1500, memoryAccuracy: 0.75 },
  hard: { name: 'Hard', thinkTime: 1000, memoryAccuracy: 0.95 },
};

/**
 * MatchingGame Component
 * A memory card matching game where you compete against an AI opponent
 * Features:
 * - Beautiful card flip animations
 * - Smart AI opponent with difficulty levels
 * - Score tracking
 * - Smooth transitions and micro-interactions
 * - Apple-level polish
 */
const MatchingGame = () => {
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState('medium');
  const [aiMemory, setAiMemory] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Initialize the game board
   */
  const initializeGame = useCallback(() => {
    // Create pairs of cards
    const cardPairs = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));

    setCards(cardPairs);
    setFlippedIndices([]);
    setMatchedPairs([]);
    setPlayerScore(0);
    setAiScore(0);
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
      matchedPairs.includes(cards[index].emoji) ||
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
          setMatchedPairs([...matchedPairs, cards[first].emoji]);
          setPlayerScore(playerScore + 1);
          setFlippedIndices([]);
          setIsProcessing(false);

          // Check if game is over
          if (matchedPairs.length + 1 === EMOJIS.length) {
            setGameOver(true);
          }
        }, 1000);
      } else {
        // No match - switch to AI's turn
        setTimeout(() => {
          setFlippedIndices([]);
          setIsPlayerTurn(false);
          setIsProcessing(false);
        }, 1500);
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
        // AI tries to find a match based on memory and difficulty
        let firstCard = null;
        let secondCard = null;

        // Check if AI remembers any pairs
        const rememberedPairs = aiMemory.reduce((acc, card) => {
          const matchingCard = aiMemory.find(
            (c) => c.emoji === card.emoji && c.index !== card.index && !matchedPairs.includes(c.emoji)
          );
          if (matchingCard && Math.random() < difficultySettings.memoryAccuracy) {
            acc.push([card.index, matchingCard.index]);
          }
          return acc;
        }, []);

        if (rememberedPairs.length > 0) {
          // AI remembers a pair!
          const pair = rememberedPairs[0];
          firstCard = pair[0];
          secondCard = pair[1];
        } else {
          // AI picks random unmatched cards
          const availableCards = cards
            .map((card, idx) => ({ ...card, index: idx }))
            .filter((card) => !matchedPairs.includes(card.emoji));

          if (availableCards.length >= 2) {
            const randomCards = availableCards.sort(() => 0.5 - Math.random()).slice(0, 2);
            firstCard = randomCards[0].index;
            secondCard = randomCards[1].index;
          }
        }

        if (firstCard !== null && secondCard !== null) {
          // Flip first card
          setFlippedIndices([firstCard]);

          setTimeout(() => {
            // Flip second card
            setFlippedIndices([firstCard, secondCard]);

            setTimeout(() => {
              if (cards[firstCard].emoji === cards[secondCard].emoji) {
                // AI found a match!
                setMatchedPairs([...matchedPairs, cards[firstCard].emoji]);
                setAiScore(aiScore + 1);
                setFlippedIndices([]);

                // Check if game is over
                if (matchedPairs.length + 1 === EMOJIS.length) {
                  setGameOver(true);
                  setIsProcessing(false);
                } else {
                  setIsProcessing(false);
                  // AI gets another turn if it found a match
                }
              } else {
                // AI missed - player's turn
                setFlippedIndices([]);
                setIsPlayerTurn(true);
                setIsProcessing(false);
              }
            }, 1200);
          }, 800);
        } else {
          setIsPlayerTurn(true);
          setIsProcessing(false);
        }
      }, difficultySettings.thinkTime);
    }
  }, [isPlayerTurn, gameOver, gameStarted, isProcessing, aiMemory, cards, matchedPairs, aiScore, difficulty]);

  if (!gameStarted) {
    return (
      <div className="text-center">
        <h2 className="text-4xl md:text-5xl mb-4 text-christmas-gold text-shadow-gold">
          🎮 Memory Match Challenge
        </h2>
        <p className="text-lg mb-8 text-snow-white/90 max-w-2xl mx-auto">
          Test your memory against our AI elf! Find matching pairs before the AI does.
          Each match you find earns you a point. Most pairs wins! 🏆
        </p>

        {/* Difficulty Selection */}
        <div className="mb-8">
          <h3 className="text-2xl text-christmas-gold mb-4">Choose AI Difficulty:</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
            {Object.entries(DIFFICULTY).map(([key, { name }]) => (
              <motion.button
                key={key}
                onClick={() => setDifficulty(key)}
                className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all ${
                  difficulty === key
                    ? 'bg-christmas-green text-white shadow-lg scale-105'
                    : 'bg-blue-800/50 text-snow-white/60 hover:bg-blue-800/70'
                }`}
                whileHover={{ scale: difficulty === key ? 1.05 : 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {name}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <motion.button
          onClick={initializeGame}
          className="btn-festive text-xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🎮 Start Game
        </motion.button>
      </div>
    );
  }

  return (
    <div className="text-center">
      {/* Game Header */}
      <div className="mb-8">
        <h2 className="text-4xl md:text-5xl mb-6 text-christmas-gold text-shadow-gold">
          Memory Match Challenge
        </h2>

        {/* Score Display */}
        <div className="flex justify-center gap-8 mb-4">
          <motion.div
            className={`bg-blue-800/50 px-6 py-3 rounded-xl border-2 ${
              isPlayerTurn && !isProcessing ? 'border-christmas-green' : 'border-christmas-gold/30'
            }`}
            animate={{
              scale: isPlayerTurn && !isProcessing ? 1.05 : 1,
            }}
          >
            <div className="text-sm text-snow-white/70">You</div>
            <div className="text-3xl font-bold text-christmas-gold">{playerScore}</div>
          </motion.div>

          <motion.div
            className={`bg-blue-800/50 px-6 py-3 rounded-xl border-2 ${
              !isPlayerTurn && !isProcessing ? 'border-christmas-red' : 'border-christmas-gold/30'
            }`}
            animate={{
              scale: !isPlayerTurn && !isProcessing ? 1.05 : 1,
            }}
          >
            <div className="text-sm text-snow-white/70">AI Elf</div>
            <div className="text-3xl font-bold text-christmas-gold">{aiScore}</div>
          </motion.div>
        </div>

        {/* Turn Indicator */}
        <AnimatePresence mode="wait">
          <motion.p
            key={isPlayerTurn ? 'player' : 'ai'}
            className="text-xl font-bold"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            {isPlayerTurn ? (
              <span className="text-christmas-green">Your Turn! 🎯</span>
            ) : (
              <span className="text-christmas-red">AI is thinking... 🤔</span>
            )}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Game Board */}
      <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto mb-8">
        {cards.map((card, index) => {
          const isFlipped = flippedIndices.includes(index) || matchedPairs.includes(card.emoji);
          const isMatched = matchedPairs.includes(card.emoji);

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
                transition={{ duration: 0.4 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Card Back */}
                <div
                  className={`absolute inset-0 rounded-xl shadow-lg flex items-center justify-center text-5xl ${
                    isMatched ? 'opacity-0' : 'opacity-100'
                  }`}
                  style={{
                    backfaceVisibility: 'hidden',
                    background: 'linear-gradient(135deg, #FF3B3B 0%, #c92a2a 100%)',
                  }}
                >
                  <div className="text-christmas-gold">🎄</div>
                </div>

                {/* Card Front */}
                <div
                  className={`absolute inset-0 rounded-xl shadow-lg flex items-center justify-center text-5xl ${
                    isMatched
                      ? 'bg-gradient-to-br from-christmas-green to-green-700'
                      : 'bg-gradient-to-br from-blue-800 to-blue-900'
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
          >
            <motion.div
              className="candy-cane-border rounded-3xl max-w-md w-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-blue-900/95 backdrop-blur-sm p-8 rounded-2xl text-center">
                <div className="text-7xl mb-4">
                  {playerScore > aiScore ? '🏆' : playerScore < aiScore ? '🎅' : '🤝'}
                </div>
                <h3 className="text-4xl font-bold mb-4 text-christmas-gold">
                  {playerScore > aiScore
                    ? 'You Win!'
                    : playerScore < aiScore
                    ? 'AI Wins!'
                    : "It's a Tie!"}
                </h3>
                <p className="text-2xl mb-6 text-snow-white">
                  You: {playerScore} | AI: {aiScore}
                </p>
                <motion.button
                  onClick={initializeGame}
                  className="btn-festive text-xl w-full"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🔄 Play Again
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset Button */}
      {!gameOver && (
        <motion.button
          onClick={initializeGame}
          className="btn-festive-green text-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🔄 Restart Game
        </motion.button>
      )}
    </div>
  );
};

export default MatchingGame;
