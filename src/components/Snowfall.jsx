import { motion } from 'framer-motion';
import { useMemo } from 'react';

/**
 * Snowfall Component
 * Bright, visible falling snowflakes for all themes
 */
const Snowfall = ({ color = '#ffffff' }) => {
  // Generate 40 snowflakes (increased for better coverage)
  const snowflakes = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 5 + 3, // Larger snowflakes (3-8px)
      duration: Math.random() * 10 + 8,
      delay: Math.random() * 5,
      drift: (Math.random() - 0.5) * 30,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {snowflakes.map((flake) => (
        <motion.div
          key={flake.id}
          className="absolute rounded-full"
          style={{
            left: `${flake.left}%`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            top: '-10px',
            backgroundColor: color,
            boxShadow: `0 0 ${flake.size}px ${color}`,
          }}
          animate={{
            y: ['0vh', '100vh'],
            x: [0, flake.drift, 0],
            opacity: [0.9, 0.7, 0.3],
          }}
          transition={{
            duration: flake.duration,
            delay: flake.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
};

export default Snowfall;
