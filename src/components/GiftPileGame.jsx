import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Sample gift data - funny and quirky items perfect for White Elephant
 * Customize this array to add your own hilarious gift ideas!
 */
const GIFTS = [
  {
    id: 1,
    name: '🦙 Desktop Llama',
    description: 'A tiny llama that judges your work choices',
    emoji: '🎁',
  },
  {
    id: 2,
    name: '🧦 Mismatched Socks',
    description: 'Because who needs matching socks anyway?',
    emoji: '🎀',
  },
  {
    id: 3,
    name: '🍕 Pizza Blanket',
    description: 'Become the human burrito of your dreams',
    emoji: '🎁',
  },
  {
    id: 4,
    name: '🦖 Dinosaur Taco Holder',
    description: 'T-Rex wants to hold your tacos... rawr!',
    emoji: '🎀',
  },
  {
    id: 5,
    name: '🎤 Shower Microphone',
    description: 'For your Grammy-winning bathroom performances',
    emoji: '🎁',
  },
  {
    id: 6,
    name: '🧙 Wizard Hat',
    description: 'You shall pass... for a wizard at parties!',
    emoji: '🎀',
  },
  {
    id: 7,
    name: '🥑 Avocado Stress Ball',
    description: 'Squeeze away the pain of expensive toast',
    emoji: '🎁',
  },
  {
    id: 8,
    name: '🦄 Unicorn Slippers',
    description: 'Magical footwear for mythical comfort',
    emoji: '🎀',
  },
];

/**
 * GiftPileGame Component
 * Interactive game where users click wrapped gift boxes to reveal random items
 * Features:
 * - Click gifts to reveal what's inside
 * - Animated gift opening with confetti effect
 * - Reset button to wrap all gifts again
 * - Prevents duplicate reveals until reset
 */
const GiftPileGame = () => {
  // Track which gifts have been opened (by index)
  const [openedGifts, setOpenedGifts] = useState([]);
  // Store revealed gifts with their data
  const [revealedGifts, setRevealedGifts] = useState({});

  /**
   * Handle clicking a gift box
   * Randomly selects an unopened gift from the GIFTS array
   */
  const handleGiftClick = (index) => {
    // Don't allow re-opening the same gift
    if (openedGifts.includes(index)) return;

    // Find gifts that haven't been revealed yet
    const availableGifts = GIFTS.filter(
      (gift) => !Object.values(revealedGifts).find((r) => r.id === gift.id)
    );

    // If we have gifts left, reveal a random one
    if (availableGifts.length > 0) {
      const randomGift =
        availableGifts[Math.floor(Math.random() * availableGifts.length)];
      setOpenedGifts([...openedGifts, index]);
      setRevealedGifts({ ...revealedGifts, [index]: randomGift });
    }
  };

  /**
   * Reset the game - wrap all gifts again
   */
  const resetGifts = () => {
    setOpenedGifts([]);
    setRevealedGifts({});
  };

  return (
    <div className="text-center">
      {/* Section title */}
      <h2 className="text-4xl md:text-5xl mb-4 text-christmas-gold text-shadow-gold">
        🎁 Gift Pile Game 🎁
      </h2>
      <p className="text-lg mb-8 text-snow-white/90">
        Click a wrapped gift to see what's inside! Can you find all the treasures?
      </p>

      {/* Gift grid - displays 8 gift boxes in a responsive grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8 max-w-4xl mx-auto">
        {Array.from({ length: 8 }).map((_, index) => {
          const isOpened = openedGifts.includes(index);
          const gift = revealedGifts[index];

          return (
            <motion.div
              key={index}
              className="relative aspect-square"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <AnimatePresence mode="wait">
                {!isOpened ? (
                  // Wrapped gift box (before clicking)
                  <motion.div
                    key="wrapped"
                    className="gift-box w-full h-full flex items-center justify-center bg-gradient-to-br from-christmas-red to-red-700 rounded-lg shadow-xl border-4 border-christmas-gold"
                    onClick={() => handleGiftClick(index)}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    exit={{ scale: 0, rotate: 180 }}
                  >
                    <span className="text-6xl">
                      {index % 2 === 0 ? '🎁' : '🎀'}
                    </span>
                  </motion.div>
                ) : (
                  // Revealed gift (after clicking)
                  <motion.div
                    key="revealed"
                    className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-christmas-green to-green-700 rounded-lg shadow-xl border-4 border-christmas-gold p-4"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <div className="text-4xl mb-2">{gift?.name.split(' ')[0]}</div>
                    <div className="text-xs font-bold text-center text-white">
                      {gift?.name.substring(2)}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Display revealed gift details below the grid */}
      {Object.keys(revealedGifts).length > 0 && (
        <motion.div
          className="mb-6 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-2xl mb-4 text-christmas-gold">
            🎉 Revealed Gifts:
          </h3>
          <div className="space-y-3">
            {Object.values(revealedGifts).map((gift) => (
              <motion.div
                key={gift.id}
                className="bg-blue-800/50 p-4 rounded-lg border-2 border-christmas-gold/50"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="text-xl font-bold text-christmas-gold">
                  {gift.name}
                </div>
                <div className="text-sm text-snow-white/80 italic">
                  {gift.description}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Reset button - only show when at least one gift is opened */}
      {openedGifts.length > 0 && (
        <motion.button
          onClick={resetGifts}
          className="btn-festive-green"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🔄 Reset Gifts
        </motion.button>
      )}

      {/* Celebration message when all gifts are opened */}
      {openedGifts.length === 8 && (
        <motion.div
          className="mt-6 text-2xl text-christmas-gold font-bold"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          🎊 You found all the gifts! You're a White Elephant champion! 🎊
        </motion.div>
      )}
    </div>
  );
};

export default GiftPileGame;
