import { motion } from 'framer-motion';
import { useMemo } from 'react';

/**
 * Snowfall Component
 * Creates animated falling snowflakes using Framer Motion
 * Snowflakes have random sizes, positions, and fall speeds for natural effect
 */
const Snowfall = () => {
  // Generate 50 snowflakes with random properties
  const snowflakes = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      // Random horizontal position (0-100% of screen width)
      left: Math.random() * 100,
      // Random size between 2-8px
      size: Math.random() * 6 + 2,
      // Random fall duration between 5-15 seconds
      duration: Math.random() * 10 + 5,
      // Random delay to stagger animation starts
      delay: Math.random() * 5,
      // Random horizontal drift
      drift: (Math.random() - 0.5) * 50,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {snowflakes.map((flake) => (
        <motion.div
          key={flake.id}
          className="absolute bg-white rounded-full opacity-80"
          style={{
            left: `${flake.left}%`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            top: '-10px',
          }}
          animate={{
            y: ['0vh', '100vh'],
            x: [0, flake.drift, 0],
            opacity: [0.8, 0.4, 0],
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
