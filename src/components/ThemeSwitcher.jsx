import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

/**
 * Theme Switcher Component
 * Toggle between White Elephant Party and Great Gift Heist themes
 */
const ThemeSwitcher = () => {
  const { theme, toggleTheme, isHeistTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="fixed top-6 left-6 z-50 glass-card rounded-full p-3 md:p-4 hover:scale-110 transition-all duration-300 group"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      title={`Switch to ${isHeistTheme ? 'White Elephant Party' : 'The Great Gift Heist'}`}
    >
      <motion.div
        className="relative w-8 h-8 md:w-10 md:h-10 flex items-center justify-center"
        animate={{ rotate: isHeistTheme ? 180 : 0 }}
        transition={{ duration: 0.5, type: 'spring' }}
      >
        {/* Icon that rotates based on theme */}
        <span className="text-2xl md:text-3xl">
          {isHeistTheme ? '💼' : '🎄'}
        </span>
      </motion.div>

      {/* Tooltip on hover */}
      <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap">
        <div className="glass-card rounded-lg px-4 py-2 text-sm font-medium">
          {isHeistTheme ? '🎄 Party Mode' : '💼 Heist Mode'}
        </div>
      </div>
    </motion.button>
  );
};

export default ThemeSwitcher;
