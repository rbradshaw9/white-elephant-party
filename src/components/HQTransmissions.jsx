import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTransmissions } from '../utils/saveAISession';

/**
 * HQ Transmissions Component
 * Displays global messages from HQ (announcements, mission intel, updates)
 * Fetches active transmissions from Supabase and displays them in a terminal-style format
 */
const HQTransmissions = ({ className = '' }) => {
  const [transmissions, setTransmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTransmissions();
    
    // Refresh transmissions every 30 seconds
    const interval = setInterval(fetchTransmissions, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchTransmissions = async () => {
    try {
      const data = await getTransmissions(true); // Only active transmissions
      setTransmissions(data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch transmissions:', err);
      setError('Unable to connect to HQ transmissions');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-400 border-red-500/50 bg-red-500/10';
      case 'high':
        return 'text-amber-400 border-amber-500/50 bg-amber-500/10';
      case 'medium':
        return 'text-sky-400 border-sky-500/50 bg-sky-500/10';
      case 'low':
        return 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10';
      default:
        return 'text-green-400 border-green-500/50 bg-green-500/10';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'urgent':
        return '🚨';
      case 'high':
        return '⚠️';
      case 'medium':
        return '📡';
      case 'low':
        return '📨';
      default:
        return '📡';
    }
  };

  if (loading) {
    return (
      <div className={`glass-card rounded-2xl p-6 border border-green-500/30 ${className}`}>
        <div className="text-center">
          <div className="animate-pulse text-green-400 font-mono">
            🔄 CONNECTING TO HQ...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`glass-card rounded-2xl p-6 border border-red-500/30 ${className}`}>
        <div className="text-center text-red-400 font-mono">
          ⚠️ {error}
        </div>
      </div>
    );
  }

  if (transmissions.length === 0) {
    return (
      <div className={`glass-card rounded-2xl p-6 border border-slate-700/50 ${className}`}>
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-700">
          <div className="text-2xl">📡</div>
          <h3 className="text-lg font-bold text-slate-300 font-mono">HQ TRANSMISSIONS</h3>
        </div>
        <div className="text-center text-slate-500 font-mono text-sm">
          No active transmissions from HQ
        </div>
      </div>
    );
  }

  return (
    <div className={`glass-card rounded-2xl p-6 border border-green-500/30 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-green-500/30">
        <div className="text-2xl animate-pulse">📡</div>
        <h3 className="text-lg font-bold text-green-400 font-mono">HQ TRANSMISSIONS</h3>
        <div className="ml-auto">
          <button
            onClick={fetchTransmissions}
            className="text-green-400 hover:text-green-300 text-xs font-mono transition-colors"
            title="Refresh transmissions"
          >
            🔄 REFRESH
          </button>
        </div>
      </div>

      {/* Transmissions List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {transmissions.map((transmission, index) => (
            <motion.div
              key={transmission.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 }}
              className={`border-l-4 pl-4 py-3 rounded-r ${getPriorityColor(transmission.priority)}`}
            >
              {/* Priority & Timestamp */}
              <div className="flex items-center gap-2 mb-2 text-xs font-mono opacity-70">
                <span>{getPriorityIcon(transmission.priority)}</span>
                <span className="uppercase">{transmission.priority || 'MEDIUM'} PRIORITY</span>
                <span className="ml-auto">
                  {new Date(transmission.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              {/* Message */}
              <div className="font-mono text-sm leading-relaxed whitespace-pre-wrap">
                {transmission.message}
              </div>

              {/* From */}
              {transmission.created_by && (
                <div className="mt-2 text-xs font-mono opacity-50">
                  — {transmission.created_by}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-green-500/30">
        <div className="text-xs text-green-500/60 font-mono text-center">
          SECURE CHANNEL • END-TO-END ENCRYPTED
        </div>
      </div>
    </div>
  );
};

export default HQTransmissions;
