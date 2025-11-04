import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import EVENT_CONFIG from '../config/config';

/**
 * Mission Countdown Component
 * Shows time remaining until The Great Gift Heist
 * Displays daily intel/tips to build excitement
 */
const MissionCountdown = ({ className = '' }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [currentIntel, setCurrentIntel] = useState(0);

  // Mission Intel (rotates daily)
  const intelDrops = [
    {
      icon: '🎁',
      title: 'GIFT INTEL',
      message: 'Budget: $25-$50. Get creative! The best gifts are funny, useful, or wonderfully weird.'
    },
    {
      icon: '🎯',
      title: 'STRATEGY TIP',
      message: 'Opening first can be strategic - you control the initial steal chain. Going last? You have the power of choice.'
    },
    {
      icon: '⚡',
      title: 'RULE REMINDER',
      message: 'Each gift can only be stolen 3 times max. After that, it\'s locked to its current owner. Plan accordingly!'
    },
    {
      icon: '🎪',
      title: 'FUN FACT',
      message: 'The most stolen gift in White Elephant history? Usually something cozy, boozy, or completely absurd.'
    },
    {
      icon: '🔥',
      title: 'PRO TIP',
      message: 'Want chaos? Bring something controversial. Want allies? Bring something universally loved. You decide the vibe.'
    },
    {
      icon: '🎄',
      title: 'PARTY PREP',
      message: 'Wrap your gift well - mysterious packages get stolen more. Or don\'t wrap it at all for psychological warfare.'
    },
    {
      icon: '⏰',
      title: 'TIMING MATTERS',
      message: 'Arrive on time! Late arrivals disrupt the number drawing. Plus, you\'ll miss the pre-game snacks.'
    },
    {
      icon: '🤝',
      title: 'ALLIANCE ALERT',
      message: 'Verbal agreements mean nothing once someone steals your gift. Trust no one. (But be nice, we\'re all friends here.)'
    }
  ];

  useEffect(() => {
    // Calculate time until party
    const calculateTimeLeft = () => {
      const partyDate = new Date(EVENT_CONFIG.date);
      const now = new Date();
      const difference = partyDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Rotate intel daily based on current day
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    setCurrentIntel(dayOfYear % intelDrops.length);
  }, []);

  const intel = intelDrops[currentIntel];

  return (
    <div className={`glass-card rounded-2xl p-6 border border-sky-500/30 bg-gradient-to-br from-sky-500/5 to-cyan-500/5 ${className}`}>
      {/* Countdown Header */}
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">⏰</div>
        <h3 className="text-2xl font-bold text-sky-400 font-display mb-1">
          MISSION COUNTDOWN
        </h3>
        <div className="text-slate-400 text-sm font-mono">
          OPERATION SANTA'S MANIFEST
        </div>
      </div>

      {/* Timer Display */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <motion.div
            className="text-3xl md:text-4xl font-bold text-cyan-400 font-mono"
            key={timeLeft.days}
            initial={{ scale: 1.2, color: '#22d3ee' }}
            animate={{ scale: 1, color: '#67e8f9' }}
            transition={{ duration: 0.3 }}
          >
            {String(timeLeft.days).padStart(2, '0')}
          </motion.div>
          <div className="text-xs text-slate-500 font-mono mt-1">DAYS</div>
        </div>
        <div className="text-center">
          <motion.div
            className="text-3xl md:text-4xl font-bold text-cyan-400 font-mono"
            key={timeLeft.hours}
            initial={{ scale: 1.2, color: '#22d3ee' }}
            animate={{ scale: 1, color: '#67e8f9' }}
            transition={{ duration: 0.3 }}
          >
            {String(timeLeft.hours).padStart(2, '0')}
          </motion.div>
          <div className="text-xs text-slate-500 font-mono mt-1">HRS</div>
        </div>
        <div className="text-center">
          <motion.div
            className="text-3xl md:text-4xl font-bold text-cyan-400 font-mono"
            key={timeLeft.minutes}
            initial={{ scale: 1.2, color: '#22d3ee' }}
            animate={{ scale: 1, color: '#67e8f9' }}
            transition={{ duration: 0.3 }}
          >
            {String(timeLeft.minutes).padStart(2, '0')}
          </motion.div>
          <div className="text-xs text-slate-500 font-mono mt-1">MIN</div>
        </div>
        <div className="text-center">
          <motion.div
            className="text-3xl md:text-4xl font-bold text-cyan-400 font-mono"
            key={timeLeft.seconds}
            initial={{ scale: 1.2, color: '#22d3ee' }}
            animate={{ scale: 1, color: '#67e8f9' }}
            transition={{ duration: 0.3 }}
          >
            {String(timeLeft.seconds).padStart(2, '0')}
          </motion.div>
          <div className="text-xs text-slate-500 font-mono mt-1">SEC</div>
        </div>
      </div>

      {/* Daily Intel Drop */}
      <motion.div
        className="border-t border-sky-500/30 pt-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-start gap-3">
          <div className="text-3xl">{intel.icon}</div>
          <div className="flex-1">
            <div className="text-sky-400 font-bold text-sm font-mono mb-1">
              📡 {intel.title}
            </div>
            <div className="text-slate-300 text-sm leading-relaxed">
              {intel.message}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mission Date */}
      <div className="mt-4 text-center text-xs text-slate-600 font-mono">
        TARGET: {new Date(EVENT_CONFIG.date).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })} @ {EVENT_CONFIG.time}
      </div>
    </div>
  );
};

export default MissionCountdown;
