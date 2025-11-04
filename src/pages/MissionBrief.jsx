import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

/**
 * Mission Brief Component (Heist Theme)
 * Intelligence briefing for Operation Santa's Manifest
 * Features:
 * - Classification headers
 * - Tactical acquisition protocols
 * - Intel-focused presentation
 * - Vault-style visual effects
 */
const MissionBrief = () => {
  const { theme } = useTheme();

  const MISSION_PROTOCOLS = [
    {
      number: 1,
      title: 'Gift Budget: $20-$40',
      description:
        'Bring a wrapped gift worth $20-$40. Something fun people actually want to steal! (No gas station gifts please.) 💼',
      icon: '💰',
      classification: 'BUDGET',
    },
    {
      number: 2,
      title: 'Wrap Your Gift!',
      description:
        'All gifts must be wrapped - no bags, no Amazon boxes. Keep it mysterious! If we can guess what it is, you failed the mission. 📦',
      icon: '🔒',
      classification: 'STEALTH',
    },
    {
      number: 3,
      title: 'Draw Your Number',
      description:
        'Everyone draws a number to decide turn order. Going first might seem bad, but you get revenge later (see Rule 7). Going last means you see everything first! 🎯',
      icon: '🎲',
      classification: 'ORDER',
    },
    {
      number: 4,
      title: 'Pick or Steal',
      description:
        'On your turn: Unwrap a new gift from the pile OR steal someone else\'s opened gift. Stealing is encouraged. Choose wisely. 👁️',
      icon: '⚡',
      classification: 'ACTION',
    },
    {
      number: 5,
      title: 'Each Gift = 3 Steals Max',
      description:
        'A gift can only be stolen 3 times total. After the 3rd steal, it\'s "frozen" and can\'t be stolen anymore. That person keeps it forever. ❄️',
      icon: '🔐',
      classification: 'LIMIT',
    },
    {
      number: 6,
      title: 'No Steal-Backs!',
      description:
        'Someone just stole your gift? Tough luck - you can\'t immediately steal it back. Pick a different gift or steal from someone else. Start a chain reaction! 🚨',
      icon: '⛔',
      classification: 'NO REVENGE',
    },
    {
      number: 7,
      title: 'Player 1 Gets Revenge',
      description:
        'Player #1 gets screwed going first, so they get a FINAL turn at the very end to steal any unfrozen gift. It\'s your chance for payback! 👑',
      icon: '⭐',
      classification: 'BONUS',
    },
    {
      number: 8,
      title: 'Couples: One Gift or Two?',
      description:
        'Coming as a couple? You can bring one gift and play together, OR bring two gifts and compete against each other. Competing is way more fun for everyone watching. 🤝',
      icon: '👥',
      classification: 'TEAMS',
    },
    {
      number: 9,
      title: 'Have Fun!',
      description:
        'It\'s a game! Yeah it gets competitive and friendships will be tested, but it\'s all about having fun together. And the drinks. Mostly the fun. 🎖️',
      icon: '⚠️',
      classification: 'ENJOY',
    },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 py-20 z-10">
      {/* Classification Banner */}
      <motion.div
        className="fixed top-0 left-0 right-0 bg-gradient-to-r from-red-900/90 via-red-800/90 to-red-900/90 border-b-2 border-red-500 z-50 py-2"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-center flex items-center justify-center gap-3">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-red-200 font-mono text-sm tracking-wider">
            ⚠️ CLASSIFIED INTEL — OPERATION SANTA'S MANIFEST — CLEARANCE REQUIRED ⚠️
          </span>
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        </div>
      </motion.div>

      {/* Animated background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      {/* Main content container */}
      <div className="max-w-4xl w-full">
        {/* Page header */}
        <motion.div
          className="text-center mb-12 mt-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-block mb-4 px-4 py-1 bg-sky-500/20 border border-sky-500/30 rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-sky-400 font-mono text-sm tracking-wider">
              TACTICAL BRIEFING DOCUMENT
            </span>
          </motion.div>
          <h1 className="text-5xl md:text-7xl mb-4 font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-400 drop-shadow-[0_0_30px_rgba(56,189,248,0.3)]">
            MISSION BRIEF
          </h1>
          <p className="text-xl text-slate-300 font-mono">
            Critical protocols for Operation Santa's Manifest
          </p>
        </motion.div>

        {/* Mission Protocols */}
        <div className="space-y-4 mb-12">
          {MISSION_PROTOCOLS.map((protocol, index) => (
            <motion.div
              key={protocol.number}
              className="relative group"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              {/* Protocol card */}
              <div className="glass-card rounded-lg p-6 border border-sky-500/20 hover:border-sky-500/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(56,189,248,0.1)]">
                <div className="flex items-start gap-4">
                  {/* Protocol number badge */}
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-sky-500/20">
                    {protocol.number}
                  </div>

                  {/* Protocol content */}
                  <div className="flex-grow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{protocol.icon}</span>
                        <h3 className="text-xl font-semibold text-white font-display">
                          {protocol.title}
                        </h3>
                      </div>
                      <span className="text-xs font-mono text-sky-400/60 px-2 py-1 bg-sky-500/10 rounded border border-sky-500/20">
                        {protocol.classification}
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      {protocol.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Subtle scan line effect on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-b from-transparent via-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none rounded-lg"
                animate={{
                  y: ['-100%', '100%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Director's Message */}
        <motion.div
          className="glass-card rounded-lg p-6 mb-8 border border-sky-500/30 bg-gradient-to-br from-sky-500/5 to-cyan-500/5"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <div className="text-center">
            <div className="text-4xl mb-3">🎖️</div>
            <h3 className="text-2xl font-bold text-sky-400 mb-2 font-display">
              AGENT REMINDER
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Look, we made this sound all official and spy-like, but here's the truth: 
              Don't take it too seriously. Unless someone steals YOUR gift. 
              Then you're legally allowed to hold that grudge until next year's party. 
              We're all here for the chaos anyway. Make it memorable, Agent.
            </p>
          </div>
        </motion.div>

        {/* Navigation buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <Link to="/">
            <motion.button
              className="px-8 py-3 bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-600 w-full sm:w-auto"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              ← Command Center
            </motion.button>
          </Link>

          <Link to="/rsvp">
            <motion.button
              className="px-8 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg font-semibold text-lg shadow-lg shadow-sky-500/20 hover:shadow-xl hover:shadow-sky-500/30 transition-all duration-300 w-full sm:w-auto"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Accept Mission
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default MissionBrief;
