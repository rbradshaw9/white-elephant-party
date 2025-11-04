import { motion } from 'framer-motion';

/**
 * Sleigh Animation Component
 * Animated sleigh with reindeer that flies across the screen periodically
 * Uses CSS and Framer Motion for smooth animation
 */
const SleighAnimation = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <motion.div
        className="absolute"
        initial={{ x: '-200px', y: '20%' }}
        animate={{
          x: ['- 200px', '120vw'],
          y: ['20%', '15%', '10%', '5%'],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatDelay: 30,
          ease: 'linear',
        }}
      >
        {/* Sleigh SVG - Simple Christmas sleigh */}
        <div className="flex items-center gap-2 opacity-30 hover:opacity-50 transition-opacity">
          {/* Reindeer */}
          <div className="text-6xl transform -scale-x-100">
            🦌
          </div>
          
          {/* Sleigh */}
          <div className="text-6xl">
            🛷
          </div>
          
          {/* Santa */}
          <div className="text-5xl">
            🎅
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SleighAnimation;
