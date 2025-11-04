import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * Heist Home Page - Cinematic Mission-Focused Design
 * Ocean's 11 meets Elf - fully immersive caper experience
 */
const HeistHome = () => {
  const { theme } = useTheme();

  // Countdown timer logic
  const calculateTimeLeft = () => {
    const partyDate = new Date('2025-12-13T19:00:00-04:00'); // 19:00 hours
    const now = new Date();
    const difference = partyDate - now;

    if (difference > 0) {
      return {
        total: difference,
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div 
      className="relative min-h-screen overflow-hidden"
      style={{ 
        background: `linear-gradient(135deg, ${theme.palette.background} 0%, #0a1628 50%, ${theme.palette.background} 100%)` 
      }}
    >
      {/* Animated background overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Light leaks */}
      <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent blur-sm" />
      <div className="absolute top-0 right-1/3 w-1 h-full bg-gradient-to-b from-transparent via-sky-500/20 to-transparent blur-sm" style={{ animationDelay: '0.5s' }} />

      <div className="relative z-10 p-6 py-12 max-w-7xl mx-auto space-y-16">
        
        {/* Classification Banner */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-red-600/20 border border-red-500/50 rounded-full backdrop-blur-sm">
            <span className="text-red-400 font-mono text-xs tracking-wider">{theme.hero.classification}</span>
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </div>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          className="text-center space-y-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h1 
            className="text-7xl md:text-9xl font-bold tracking-tight"
            style={{ 
              fontFamily: theme.fonts.display,
              background: `linear-gradient(135deg, #0ea5e9 0%, #38bdf8 50%, #0284c7 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 80px rgba(14, 165, 233, 0.3)'
            }}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
          >
            {theme.hero.title}
          </motion.h1>

          <motion.div
            className="max-w-3xl mx-auto space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-xl md:text-2xl leading-relaxed" style={{ color: theme.palette.text.secondary }}>
              {theme.hero.subtitle}
            </p>
            
            <div className="flex items-center justify-center gap-2 text-sm font-mono text-cyan-400">
              <span className="inline-block w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <span>{theme.hero.tagline}</span>
            </div>
          </motion.div>

          {/* Mission Countdown */}
          {timeLeft.total > 0 && (
            <motion.div
              className="mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="text-xs uppercase tracking-widest text-slate-400 mb-4 font-mono">
                Mission Countdown
              </div>
              <div className="flex justify-center gap-4 md:gap-6 flex-wrap">
                {[
                  { value: timeLeft.days, label: 'Days' },
                  { value: timeLeft.hours, label: 'Hours' },
                  { value: timeLeft.minutes, label: 'Minutes' },
                  { value: timeLeft.seconds, label: 'Seconds' },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    className="relative group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-500/20 to-blue-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                    <div className="relative bg-slate-900/50 backdrop-blur-md border border-sky-500/30 rounded-2xl px-6 py-4 md:px-8 md:py-6">
                      <div className="text-4xl md:text-5xl font-bold text-white font-mono tabular-nums">
                        {String(item.value).padStart(2, '0')}
                      </div>
                      <div className="text-xs uppercase tracking-wider text-sky-400 mt-1">
                        {item.label}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <Link to="/rsvp" className="w-full sm:w-auto">
              <motion.button
                className="relative group w-full px-10 py-5 text-lg font-bold overflow-hidden rounded-xl"
                style={{ 
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                  color: 'white'
                }}
                whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(14, 165, 233, 0.6)' }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10">{theme.hero.cta.primary}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </motion.button>
            </Link>

            <Link to="/rules" className="w-full sm:w-auto">
              <motion.button
                className="w-full px-10 py-5 text-lg font-bold rounded-xl border-2 transition-all"
                style={{ 
                  borderColor: theme.palette.secondary,
                  color: theme.palette.secondary,
                  background: 'rgba(14, 165, 233, 0.1)'
                }}
                whileHover={{ 
                  scale: 1.05, 
                  backgroundColor: 'rgba(14, 165, 233, 0.2)',
                  boxShadow: '0 0 30px rgba(14, 165, 233, 0.3)'
                }}
                whileTap={{ scale: 0.98 }}
              >
                {theme.hero.cta.secondary}
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Mission Brief Section */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          {/* Glowing border effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-sky-500/20 via-blue-500/20 to-sky-500/20 rounded-3xl blur-xl" />
          
          <div className="relative bg-slate-900/40 backdrop-blur-xl border border-sky-500/30 rounded-3xl p-8 md:p-12">
            {/* Classification header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-sky-500/30">
              <div>
                <div className="text-xs text-red-400 font-mono mb-1">{theme.sections.intel.classification}</div>
                <h2 
                  className="text-3xl md:text-4xl font-bold"
                  style={{ fontFamily: theme.fonts.display, color: theme.palette.text.primary }}
                >
                  {theme.sections.intel.title}
                </h2>
              </div>
              <div className="w-12 h-12 rounded-full bg-sky-500/20 flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {theme.sections.intel.items.map((item, index) => (
                <motion.div
                  key={index}
                  className="group relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative p-6 rounded-2xl bg-slate-900/30 border border-sky-500/20 hover:border-sky-500/40 transition-all">
                    <div className="text-4xl mb-4">{item.icon}</div>
                    <h3 className="text-xl font-bold mb-3 text-sky-400">{item.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: theme.palette.text.secondary }}>
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Codename Generator */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="max-w-2xl mx-auto bg-slate-900/40 backdrop-blur-xl border border-sky-500/30 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: theme.fonts.display, color: theme.palette.accent }}>
              Ready to Join the Operation?
            </h3>
            <p className="text-slate-300 mb-6">
              Enter the access terminal to receive your AI-generated agent codename and register for the mission.
            </p>
            
            <Link to="/access">
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-sky-600 to-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-sky-500/20"
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(14, 165, 233, 0.5)' }}
                whileTap={{ scale: 0.95 }}
              >
                🔐 Enter Access Terminal
              </motion.button>
            </Link>

            <p className="text-xs text-slate-500 mt-4">
              Access Code Required
            </p>
          </div>
        </motion.div>

        {/* Remove the "Access Granted" animation section completely */}
      </div>
    </div>
  );
};

export default HeistHome;
