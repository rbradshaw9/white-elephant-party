import { motion } from 'framer-motion';
import { useMemo } from 'react';

/**
 * Snowfall Component
 * Subtle, modern falling snowflakes
 */
const Snowfall = () => {
  // Generate 30 snowflakes (reduced for cleaner look)
  const snowflakes = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 4 + 2, // Smaller snowflakes
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
          className="absolute bg-white/40 rounded-full blur-[0.5px]"
          style={{
            left: `${flake.left}%`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            top: '-10px',
          }}
          animate={{
            y: ['0vh', '100vh'],
            x: [0, flake.drift, 0],
            opacity: [0.6, 0.3, 0],
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
