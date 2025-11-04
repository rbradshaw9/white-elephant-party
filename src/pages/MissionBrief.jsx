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
      title: 'Acquisition Budget',
      description:
        'Each operative must acquire a decoy package valued between $20-$40. This ensures operational consistency and prevents detection by civilian authorities. Note: Convenience store acquisitions are considered insufficient for this operation. 💼',
      icon: '💰',
      classification: 'FINANCIAL',
    },
    {
      number: 2,
      title: 'Package Concealment',
      description:
        'All decoy packages MUST be properly concealed in wrapping materials. Transparent bags, exposed retail packaging, or identifiable containers compromise operational security. If package contents are visible, mission integrity is compromised. 📦',
      icon: '🔒',
      classification: 'SECURITY',
    },
    {
      number: 3,
      title: 'Agent Sequencing',
      description:
        'Each agent will draw a numerical identifier to establish operational order. First position appears disadvantageous but includes tactical compensation (see Protocol #7). Final position provides maximum intelligence on target preferences. 🎯',
      icon: '🎲',
      classification: 'TACTICAL',
    },
    {
      number: 4,
      title: 'Acquisition Protocol',
      description:
        'During your designated turn: SELECT an unacquired package from the vault OR EXTRACT a previously acquired package from another agent. Strategic extraction is encouraged. Choose your targets wisely. 👁️',
      icon: '⚡',
      classification: 'OPERATIONAL',
    },
    {
      number: 5,
      title: 'Extraction Limits',
      description:
        'Each package may be extracted a maximum of THREE times. After the third extraction, the package enters FROZEN status and becomes permanently secured to its current holder. Early-sequence packages face higher extraction probability. ❄️',
      icon: '🔐',
      classification: 'PROTOCOL',
    },
    {
      number: 6,
      title: 'Immediate Counter-Extraction Prohibited',
      description:
        'If your package is extracted, you are PROHIBITED from immediately counter-extracting the same package. This prevents operational deadlock. Instead, initiate a cascade event by extracting from a different agent. Maximum chaos recommended. 🚨',
      icon: '⛔',
      classification: 'RESTRICTION',
    },
    {
      number: 7,
      title: 'Alpha Agent Compensation',
      description:
        'Agent #1 receives compensatory advantage: a FINAL extraction opportunity at mission conclusion. Any non-frozen package may be targeted. This balances the disadvantage of initial position. Revenge is a valid strategy. 👑',
      icon: '⭐',
      classification: 'ADVANTAGE',
    },
    {
      number: 8,
      title: 'Partner Agent Protocols',
      description:
        'Operatives arriving as a paired unit may: (A) Submit one package and operate as a single tactical unit, OR (B) Submit two packages and compete as individual agents. Option B provides enhanced entertainment value for observers. 🤝',
      icon: '👥',
      classification: 'PARTNERSHIP',
    },
    {
      number: 9,
      title: 'Mission Prime Directive',
      description:
        'Remember: This is a sanctioned training exercise. A highly competitive, alliance-testing, potentially relationship-destabilizing training exercise. Ultimately, the objective is operational bonding and memory creation. And beverages. Primarily memory creation. 🎖️',
      icon: '⚠️',
      classification: 'DIRECTIVE',
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
              DIRECTOR'S NOTE
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Intelligence suggests that while these protocols appear rigid, operational flexibility is expected.
              Maintain professional composure... unless another agent extracts your target package.
              In such events, immediate tactical retaliation against third-party agents is authorized.
              Remember: we're documenting this operation for future training purposes. Make it memorable.
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
