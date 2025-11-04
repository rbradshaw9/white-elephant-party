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
          <h1 className="text-5xl md:text-7xl mb-4 font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-300 to-emerald-400">
            The Rules
          </h1>
          <p className="text-xl text-slate-300">
            Follow these and we'll all have a good time
          </p>
        </motion.div>

        {/* Rules list */}
        <div className="space-y-4 mb-12">
          {RULES.map((rule, index) => (
            <motion.div
              key={rule.number}
              className="glass-card rounded-2xl p-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className="flex items-start gap-4">
                {/* Rule number badge */}
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {rule.number}
                </div>

                {/* Rule content */}
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{rule.icon}</span>
                    <h3 className="text-xl font-semibold text-white">
                      {rule.title}
                    </h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {rule.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Important reminder box */}
        <motion.div
          className="glass-card rounded-2xl p-6 mb-8 border border-emerald-500/30"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <div className="text-center">
            <div className="text-4xl mb-3">🎅</div>
            <h3 className="text-2xl font-bold text-emerald-400 mb-2">
              Remember
            </h3>
            <p className="text-slate-300">
              It's all fun and games. Well, mostly games. Okay, it's competitive chaos.
              But the point is: bring something good or prepare to go home empty-handed.
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
              className="btn-festive text-lg w-full sm:w-auto"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              ← Back to Home
            </motion.button>
          </Link>

          <Link to="/rsvp">
            <motion.button
              className="btn-festive-green text-lg w-full sm:w-auto"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              RSVP Now
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Rules;
