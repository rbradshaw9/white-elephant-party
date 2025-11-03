import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import GiftPileGame from '../components/GiftPileGame';

/**
 * Home Page Component
 * Main landing page featuring:
 * - Animated title with festive styling
 * - Candy-cane border decoration
 * - Navigation buttons to rules and gallery
 * - Interactive gift pile game
 * - Elf-inspired playful tone and design
 */
const Home = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 z-10">
      {/* Main content container with candy cane border */}
      <div className="candy-cane-border rounded-3xl max-w-6xl w-full">
        <div className="bg-blue-900/95 backdrop-blur-sm p-8 md:p-12 rounded-2xl">
          {/* Animated main title */}
          <motion.h1
            className="text-6xl md:text-8xl text-center mb-4 text-shadow-gold text-christmas-gold"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 20,
              duration: 1,
            }}
          >
            White Elephant Party 2025! 🎄
          </motion.h1>

          {/* Subtitle with bouncing animation */}
          <motion.p
            className="text-2xl md:text-3xl text-center mb-8 text-snow-white"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            The <span className="text-christmas-green font-bold">BEST</span> way
            to celebrate the season!
          </motion.p>

          {/* Festive divider */}
          <div className="flex justify-center gap-4 mb-8">
            <span className="text-4xl animate-float">🎁</span>
            <span className="text-4xl animate-float" style={{ animationDelay: '0.2s' }}>
              ❄️
            </span>
            <span className="text-4xl animate-float" style={{ animationDelay: '0.4s' }}>
              🎅
            </span>
            <span className="text-4xl animate-float" style={{ animationDelay: '0.6s' }}>
              ❄️
            </span>
            <span className="text-4xl animate-float" style={{ animationDelay: '0.8s' }}>
              🎁
            </span>
          </div>

          {/* Welcome message with Elf-inspired humor */}
          <motion.div
            className="text-center mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
          >
            <p className="text-xl mb-4 text-snow-white">
              Welcome to the most{' '}
              <span className="text-christmas-red font-bold italic">
                ridiculously fun
              </span>{' '}
              White Elephant exchange this side of the North Pole!
            </p>
            <p className="text-lg text-snow-white/90">
              Prepare for gift-stealing shenanigans, questionable presents, and
              memories that'll last longer than your fruitcake! 🍰
            </p>
          </motion.div>

          {/* Navigation buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <Link to="/rules">
              <motion.button
                className="btn-festive text-xl w-full sm:w-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                📜 View the Rules
              </motion.button>
            </Link>

            <Link to="/gallery">
              <motion.button
                className="btn-festive-green text-xl w-full sm:w-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                📸 Last Year's Highlights
              </motion.button>
            </Link>
          </motion.div>

          {/* Gift Pile Game Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <GiftPileGame />
          </motion.div>

          {/* Footer message */}
          <motion.div
            className="text-center mt-12 pt-8 border-t-2 border-christmas-gold/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
          >
            <p className="text-sm text-snow-white/70 italic">
              "The best way to spread Christmas cheer is singing loud for all to
              hear... or stealing the best gift!" 🎶
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;
