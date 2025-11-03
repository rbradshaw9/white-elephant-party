import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import MatchingGame from '../components/MatchingGame';

/**
 * Home Page Component
 * Main landing page featuring:
 * - Refined animated title with festive styling
 * - Clean navigation with clear CTAs
 * - Interactive AI matching game
 * - Apple-level design polish with Elf-inspired whimsy
 */
const Home = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 z-10">
      {/* Main content container with candy cane border */}
      <div className="candy-cane-border rounded-3xl max-w-6xl w-full">
        <div className="bg-blue-900/95 backdrop-blur-xl p-8 md:p-12 rounded-2xl shadow-2xl">
          {/* Animated main title with improved typography */}
          <motion.h1
            className="text-6xl md:text-8xl text-center mb-4 text-shadow-gold text-christmas-gold leading-tight"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 20,
              duration: 1,
            }}
          >
            White Elephant Party 2025
          </motion.h1>

          {/* Subtitle with improved animation */}
          <motion.p
            className="text-2xl md:text-3xl text-center mb-8 text-snow-white font-medium"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            The <span className="text-christmas-green font-bold">best</span> way
            to celebrate the season
          </motion.p>

          {/* Festive divider with staggered animation */}
          <div className="flex justify-center gap-4 mb-8">
            {['🎁', '❄️', '🎅', '❄️', '🎁'].map((emoji, index) => (
              <motion.span
                key={index}
                className="text-4xl"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                style={{
                  animation: 'float 3s ease-in-out infinite',
                  animationDelay: `${index * 0.2}s`,
                }}
              >
                {emoji}
              </motion.span>
            ))}
          </div>

          {/* Welcome message with cleaner typography */}
          <motion.div
            className="text-center mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
          >
            <p className="text-xl mb-4 text-snow-white/95 leading-relaxed">
              Welcome to the most{' '}
              <span className="text-christmas-red font-semibold italic">
                ridiculously fun
              </span>{' '}
              White Elephant exchange this side of the North Pole!
            </p>
            <p className="text-lg text-snow-white/80 leading-relaxed">
              Gift-stealing shenanigans, questionable presents, and memories
              that'll last forever �
            </p>
          </motion.div>

          {/* Primary CTAs with improved hierarchy */}
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <Link to="/rsvp" className="w-full sm:w-auto">
              <motion.button
                className="btn-festive text-xl w-full"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ✉️ RSVP Now
              </motion.button>
            </Link>

            <Link to="/rules" className="w-full sm:w-auto">
              <motion.button
                className="btn-festive-green text-xl w-full"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                � View the Rules
              </motion.button>
            </Link>
          </motion.div>

          {/* Matching Game Section with improved spacing */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="pt-8 border-t-2 border-christmas-gold/20"
          >
            <MatchingGame />
          </motion.div>

          {/* Footer message with refined styling */}
          <motion.div
            className="text-center mt-16 pt-8 border-t-2 border-christmas-gold/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
          >
            <p className="text-sm text-snow-white/60 italic leading-relaxed">
              "The best way to spread Christmas cheer is singing loud for all to
              hear... <br className="hidden sm:block" />
              or winning at memory games!" 🎶
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;
