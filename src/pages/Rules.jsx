import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

/**
 * White Elephant Rules Data
 * Customize these rules to match your party's specific guidelines
 */
const RULES = [
  {
    number: 1,
    title: 'The Gift Budget',
    description:
      'Keep gifts between $15-$25. The goal is fun, not breaking the bank! 💰',
    icon: '💵',
  },
  {
    number: 2,
    title: 'Wrap It Up!',
    description:
      'All gifts MUST be wrapped. No gift bags, no peeking! Mystery is half the fun. 🎁',
    icon: '🎁',
  },
  {
    number: 3,
    title: 'Drawing Numbers',
    description:
      'Everyone draws a number to determine their turn. Lowest goes first! 🎯',
    icon: '🎲',
  },
  {
    number: 4,
    title: 'Pick or Steal',
    description:
      'On your turn, either unwrap a new gift OR steal an already-opened gift from someone else. 👀',
    icon: '🤔',
  },
  {
    number: 5,
    title: 'Steal Limits',
    description:
      'Each gift can only be stolen 3 times total. After the third steal, it\'s "frozen" with that person. ❄️',
    icon: '🔒',
  },
  {
    number: 6,
    title: 'No Immediate Steal-Backs',
    description:
      'If your gift gets stolen, you can\'t immediately steal it back. Pick someone else to bother! 😈',
    icon: '🚫',
  },
  {
    number: 7,
    title: 'First Player Advantage',
    description:
      'Player #1 gets a bonus turn at the END to potentially steal any gift they want! 🎊',
    icon: '👑',
  },
  {
    number: 8,
    title: 'The Golden Rule',
    description:
      'Have fun! It\'s not about the gift, it\'s about the laughs, the chaos, and the memories! 🎉',
    icon: '⭐',
  },
];

/**
 * Rules Page Component
 * Displays the official White Elephant game rules
 * Features:
 * - Numbered rules with icons
 * - Animated rule cards
 * - Back to home button
 * - Festive styling consistent with brand
 */
const Rules = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 py-20 z-10">
      {/* Main content container */}
      <div className="max-w-4xl w-full">
        {/* Page header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl mb-4 text-christmas-gold text-shadow-gold">
            📜 The Official Rules 📜
          </h1>
          <p className="text-xl text-snow-white/90">
            Follow these sacred commandments of White Elephant chaos!
          </p>
        </motion.div>

        {/* Rules list */}
        <div className="space-y-6 mb-12">
          {RULES.map((rule, index) => (
            <motion.div
              key={rule.number}
              className="candy-cane-border rounded-2xl"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className="bg-blue-900/95 backdrop-blur-sm p-6 rounded-xl">
                <div className="flex items-start gap-4">
                  {/* Rule number badge */}
                  <div className="flex-shrink-0 w-12 h-12 bg-christmas-red rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {rule.number}
                  </div>

                  {/* Rule content */}
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-3xl">{rule.icon}</span>
                      <h3 className="text-2xl font-bold text-christmas-gold">
                        {rule.title}
                      </h3>
                    </div>
                    <p className="text-lg text-snow-white/90">
                      {rule.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Important reminder box */}
        <motion.div
          className="bg-christmas-green/20 border-4 border-christmas-green rounded-2xl p-6 mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <div className="text-center">
            <div className="text-4xl mb-3">🎅</div>
            <h3 className="text-2xl font-bold text-christmas-gold mb-2">
              Remember, Friends!
            </h3>
            <p className="text-lg text-snow-white">
              White Elephant is all about the journey, not the destination. May
              the odds be ever in your favor, and may your gift not be the one
              everyone avoids! 😂
            </p>
          </div>
        </motion.div>

        {/* Navigation buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <Link to="/">
            <motion.button
              className="btn-festive text-xl w-full sm:w-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🏠 Back to Home
            </motion.button>
          </Link>

          <Link to="/rsvp">
            <motion.button
              className="btn-festive-green text-xl w-full sm:w-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ✉️ RSVP Now
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Rules;
