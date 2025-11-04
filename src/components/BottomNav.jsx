import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

/**
 * Bottom Navigation Bar
 * Persistent navigation for easy access to main pages
 */
const BottomNav = () => {
  const location = useLocation();
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
      icon: '🏠',
      label: 'Home',
      active: location.pathname === '/'
    },
    {
      path: '/roster',
      icon: '👥',
      label: 'Roster',
      active: location.pathname === '/roster'
    },
    {
      path: agentCodename ? `/agent/${agentCodename}` : '/access',
      icon: '🎯',
      label: agentCodename ? 'My Card' : 'Join',
      active: location.pathname.startsWith('/agent')
    },
    {
      path: '/hq',
      icon: '📡',
      label: 'HQ',
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
                  ? 'text-heist-blue scale-110'
                  : 'text-slate-400 hover:text-heist-blue/70'
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
                  className="absolute -bottom-1 w-12 h-1 bg-heist-blue rounded-t"
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
