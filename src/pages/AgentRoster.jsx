import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Snowfall from '../components/Snowfall';
import api from '../utils/api';

/**
 * Public Agent Roster
 * Shows all attending agents and their codenames
 * No authentication required - anyone can see who's coming!
 */
const AgentRoster = () => {
  const [guestList, setGuestList] = useState({ rsvps: [], stats: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPublicRoster = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await api.getPublicRoster();
      setGuestList(data);
    } catch (err) {
      setError('Unable to load agent roster');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicRoster();
  }, []);

  const { rsvps, stats } = guestList;
  const attendingGuests = rsvps.filter(r => r.attending === 'yes');

  return (
    <div className="relative min-h-screen">
      <Snowfall />
      
      <div className="relative min-h-screen p-6 py-20 z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-7xl mb-4 font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-300 to-emerald-400">
              🎯 Agent Roster
            </h1>
            <p className="text-slate-300 text-lg mb-4">
              Meet your fellow operatives for The Great Gift Heist
            </p>
            <button
              onClick={fetchPublicRoster}
              className="text-emerald-400 hover:text-emerald-300 transition-colors font-mono text-sm"
            >
              🔄 REFRESH ROSTER
            </button>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <motion.div
              className="glass-card rounded-2xl p-6 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-4xl font-bold text-emerald-400">{stats.attending || 0}</div>
              <div className="text-slate-400 text-sm mt-1">Active Agents</div>
            </motion.div>

            <motion.div
              className="glass-card rounded-2xl p-6 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-4xl font-bold text-amber-400">{stats.totalGuests || 0}</div>
              <div className="text-slate-400 text-sm mt-1">Total Operatives</div>
              <div className="text-slate-500 text-xs mt-1">(including guests)</div>
            </motion.div>

            <motion.div
              className="glass-card rounded-2xl p-6 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-4xl font-bold text-blue-400">{attendingGuests.length}</div>
              <div className="text-slate-400 text-sm mt-1">Codenames Assigned</div>
            </motion.div>
          </div>

          {/* Agent Grid */}
          {loading ? (
            <motion.div
              className="glass-card rounded-3xl p-12 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-slate-400">Loading agent roster...</div>
            </motion.div>
          ) : error ? (
            <motion.div
              className="glass-card rounded-3xl p-12 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-red-400">{error}</div>
            </motion.div>
          ) : attendingGuests.length === 0 ? (
            <motion.div
              className="glass-card rounded-3xl p-12 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-6xl mb-4">🎯</div>
              <div className="text-slate-400 text-xl">No agents recruited yet</div>
              <div className="text-slate-500 text-sm mt-2">Be the first to join the mission!</div>
            </motion.div>
          ) : (
            <motion.div
              className="glass-card rounded-3xl p-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {attendingGuests.map((agent, index) => (
                  <motion.div
                    key={index}
                    className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-emerald-500/50 transition-all"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="text-white font-semibold">{agent.name}</div>
                        {agent.codename && (
                          <div className="text-emerald-400 font-mono text-sm mt-1">
                            🎯 {agent.codename}
                          </div>
                        )}
                      </div>
                      {agent.guests > 1 && (
                        <div className="text-amber-400 text-sm font-mono">
                          +{agent.guests - 1}
                        </div>
                      )}
                    </div>
                    {agent.guests > 1 && (
                      <div className="text-slate-400 text-xs mt-2">
                        Bringing {agent.guests - 1} additional {agent.guests === 2 ? 'guest' : 'guests'}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Fun Footer */}
          <motion.div
            className="text-center mt-8 text-slate-500 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div>🎄 The more the merrier! 🎄</div>
            <div className="mt-1">Can't wait to see everyone at the heist!</div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AgentRoster;
