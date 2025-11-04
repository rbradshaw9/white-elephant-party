import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Snowfall from '../components/Snowfall';
import HQTransmissions from '../components/HQTransmissions';
import MissionCountdown from '../components/MissionCountdown';
import { getAttendingAgents } from '../utils/saveAgentData';

/**
 * Public Agent Roster
 * Shows all attending agents and their codenames from Supabase
 * No authentication required - anyone can see who's coming!
 */
const AgentRoster = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPublicRoster = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await getAttendingAgents();
      setAgents(data);
    } catch (err) {
      setError('Unable to load agent roster');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicRoster();
  }, []);

  const totalOperatives = agents.reduce((sum, agent) => sum + (agent.guest_count || 0) + 1, 0);

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
              <div className="text-4xl font-bold text-emerald-400">{agents.length}</div>
              <div className="text-slate-400 text-sm mt-1">Active Agents</div>
            </motion.div>

            <motion.div
              className="glass-card rounded-2xl p-6 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-4xl font-bold text-amber-400">{totalOperatives}</div>
              <div className="text-slate-400 text-sm mt-1">Total Operatives</div>
              <div className="text-slate-500 text-xs mt-1">(including guests)</div>
            </motion.div>

            <motion.div
              className="glass-card rounded-2xl p-6 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-4xl font-bold text-blue-400">{agents.length}</div>
              <div className="text-slate-400 text-sm mt-1">Codenames Assigned</div>
            </motion.div>
          </div>

          {/* Mission Countdown */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <MissionCountdown />
          </motion.div>

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
          ) : agents.length === 0 ? (
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
                {agents.map((agent, index) => (
                  <Link key={index} to={`/agent/${agent.codename}`}>
                    <motion.div
                      className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-emerald-500/50 transition-all cursor-pointer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="text-white font-semibold">{agent.real_name}</div>
                          {agent.codename && (
                            <div className="text-emerald-400 font-mono text-sm mt-1">
                              🎯 {agent.codename}
                            </div>
                          )}
                        </div>
                        {agent.guest_count > 0 && (
                          <div className="text-amber-400 text-sm font-mono">
                            +{agent.guest_count}
                          </div>
                        )}
                      </div>
                      {agent.guest_count > 0 && (
                        <div className="text-slate-400 text-xs mt-2">
                          Bringing {agent.guest_count} additional {agent.guest_count === 1 ? 'guest' : 'guests'}
                        </div>
                      )}
                      {agent.guest_names && agent.guest_names.length > 0 && (
                        <div className="text-slate-500 text-xs mt-1">
                          {agent.guest_names.slice(0, 2).join(', ')}
                          {agent.guest_names.length > 2 && '...'}
                        </div>
                      )}
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {/* HQ Transmissions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-8"
          >
            <HQTransmissions />
          </motion.div>

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
