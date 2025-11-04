import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * Bottom Navigation Bar
 * Persistent navigation for easy access to main pages
 * Theme-aware labels (North Pole vs Heist terminology)
 */
const BottomNav = () => {
  const location = useLocation();
  const { isHeistTheme } = useTheme();
  const [agentCodename, setAgentCodename] = useState(null);

  useEffect(() => {
    // Check if user has completed registration
    const savedCodename = sessionStorage.getItem('agentCodename');
    setAgentCodename(savedCodename);
  }, [location]);

  // Hide nav on access gate page
  if (location.pathname === '/access') {
    return null;
  }

  const navItems = [
    {
      path: '/',
      icon: isHeistTheme ? '🏠' : '🎄',
      label: isHeistTheme ? 'Home' : 'Workshop',
      active: location.pathname === '/'
    },
    {
      path: '/gallery',
      icon: isHeistTheme ? '📹' : '📸',
      label: isHeistTheme ? 'Footage' : 'Memories',
      active: location.pathname === '/gallery'
    },
    {
      path: '/roster',
      icon: isHeistTheme ? '👥' : '🧝',
      label: isHeistTheme ? 'Roster' : 'Elves',
      active: location.pathname === '/roster'
    },
    {
      path: agentCodename ? `/agent/${agentCodename}` : '/hq',
      icon: isHeistTheme ? '🎯' : '🎁',
      label: agentCodename ? 'My Card' : 'Join',
      active: location.pathname.startsWith('/agent')
    },
    {
      path: '/hq',
      icon: isHeistTheme ? '📡' : '🎅',
      label: isHeistTheme ? 'HQ' : 'North Pole',
      active: location.pathname === '/hq'
    }
  ];

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-heist-blue/30 pb-safe"
    >
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex justify-around items-center">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 min-w-[60px] transition-all ${
                item.active
                  ? isHeistTheme ? 'text-heist-blue scale-110' : 'text-emerald-400 scale-110'
                  : isHeistTheme ? 'text-slate-400 hover:text-heist-blue/70' : 'text-slate-400 hover:text-emerald-400/70'
              }`}
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="text-2xl"
              >
                {item.icon}
              </motion.div>
              <span className="text-xs font-mono font-semibold">
                {item.label}
              </span>
              {item.active && (
                <motion.div
                  layoutId="activeTab"
                  className={`absolute -bottom-1 w-12 h-1 rounded-t ${
                    isHeistTheme ? 'bg-heist-blue' : 'bg-emerald-400'
                  }`}
                />
              )}
            </Link>
          ))}
        </div>
      </div>
    </motion.nav>
  );
};

export default BottomNav;
