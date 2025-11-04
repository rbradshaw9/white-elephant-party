import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';

/**
 * Admin Guest List Viewer
 * Protected page to view all RSVPs from backend
 */
const AdminGuestList = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [guestList, setGuestList] = useState({ rsvps: [], stats: {} });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = () => {
    // Store the password as the auth token
    localStorage.setItem('adminToken', password);
    fetchGuestList(password);
  };

  const fetchGuestList = async (token) => {
    setLoading(true);
    setError('');

    try {
      const data = await api.getGuestList(token || localStorage.getItem('adminToken'));
      setGuestList(data);
      setIsAuthenticated(true);
    } catch (err) {
      setError(err.message || 'Failed to fetch guest list');
      setIsAuthenticated(false);
      localStorage.removeItem('adminToken');
    } finally {
      setLoading(false);
    }
  };

  // Check for existing auth on mount
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      fetchGuestList(token);
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center p-6 z-10">
        <motion.div
          className="max-w-md w-full glass-card rounded-3xl p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-emerald-400 mb-6 text-center">
            🔒 Classified Access
          </h1>
          <p className="text-slate-300 mb-6 text-center">Enter admin password to view agent roster</p>
          
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            className="w-full px-4 py-3 rounded-xl bg-slate-800/50 text-white border-2 border-slate-700 focus:border-emerald-500 focus:outline-none transition-all mb-4"
            placeholder="Admin password"
          />
          
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full btn-festive text-lg py-3"
          >
            {loading ? '🔓 Authenticating...' : '🔐 Access Agent Roster'}
          </button>

          {error && (
            <motion.p
              className="text-red-400 text-center mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.p>
          )}
        </motion.div>
      </div>
    );
  }

  const { rsvps, stats } = guestList;

  return (
    <div className="relative min-h-screen p-6 py-20 z-10">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl md:text-7xl mb-4 font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-300 to-emerald-400">
            📋 Agent Roster
          </h1>
          <p className="text-slate-400 mb-4">Classified Agent Registry - Eyes Only</p>
          <button
            onClick={() => fetchGuestList()}
            className="text-emerald-400 hover:text-emerald-300 transition-colors font-mono text-sm"
          >
            🔄 REFRESH DATABASE
          </button>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            className="glass-card rounded-2xl p-6 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-3xl font-bold text-emerald-400">{stats.attending || 0}</div>
            <div className="text-slate-400 text-sm mt-1">Active Agents</div>
          </motion.div>

          <motion.div
            className="glass-card rounded-2xl p-6 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-3xl font-bold text-red-400">{stats.notAttending || 0}</div>
            <div className="text-slate-400 text-sm mt-1">Declined</div>
          </motion.div>

          <motion.div
            className="glass-card rounded-2xl p-6 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-3xl font-bold text-amber-400">{stats.totalGuests || 0}</div>
            <div className="text-slate-400 text-sm mt-1">Total Operatives</div>
          </motion.div>

          <motion.div
            className="glass-card rounded-2xl p-6 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-3xl font-bold text-blue-400">{stats.total || 0}</div>
            <div className="text-slate-400 text-sm mt-1">Total RSVPs</div>
          </motion.div>
        </div>

        {/* Guest List Table */}
        <motion.div
          className="glass-card rounded-3xl p-6 overflow-x-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {rsvps.length === 0 ? (
            <p className="text-slate-400 text-center py-12">No RSVPs yet</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-300 font-semibold">Agent Name</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-semibold">Codename</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-semibold">Contact</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-semibold">+Guests</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-semibold">Dietary</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-semibold">Recruited</th>
                </tr>
              </thead>
              <tbody>
                {rsvps.map((rsvp, index) => (
                  <tr
                    key={index}
                    className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-3 px-4 text-white font-semibold">{rsvp.name}</td>
                    <td className="py-3 px-4">
                      {rsvp.codename ? (
                        <span className="text-emerald-400 font-mono text-sm">
                          🎯 {rsvp.codename}
                        </span>
                      ) : (
                        <span className="text-slate-500 text-sm">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-300 text-sm">{rsvp.email}</div>
                      {rsvp.phone && (
                        <div className="text-slate-500 text-xs">{rsvp.phone}</div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          rsvp.attending === 'yes'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {rsvp.attending === 'yes' ? '✓ ACTIVE' : '✗ DECLINED'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300 text-center">
                      {rsvp.attending === 'yes' ? rsvp.guests : '—'}
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-sm max-w-xs truncate">
                      {rsvp.dietaryRestrictions || '—'}
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-xs font-mono">
                      {new Date(rsvp.submittedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </motion.div>

        {/* Export Button */}
        {rsvps.length > 0 && (
          <motion.div
            className="text-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <button
              onClick={() => {
                const csv = [
                  ['Name', 'Codename', 'Email', 'Phone', 'Attending', 'Guests', 'Dietary', 'Reminders', 'Submitted'],
                  ...rsvps.map(r => [
                    r.name,
                    r.codename || '',
                    r.email,
                    r.phone || '',
                    r.attending,
                    r.guests || '',
                    r.dietaryRestrictions || '',
                    r.reminderPreference || '',
                    new Date(r.submittedAt).toLocaleString(),
                  ]),
                ]
                  .map(row => row.join(','))
                  .join('\n');

                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `agent-roster-${new Date().toISOString().split('T')[0]}.csv`;
                link.click();
                URL.revokeObjectURL(url);
              }}
              className="btn-festive-green text-base px-6 py-3"
            >
              📥 Export Agent Database
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminGuestList;
