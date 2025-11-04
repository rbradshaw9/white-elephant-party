import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

/**
 * Agent Recruitment Component (Heist Theme)
 * Intelligence Division agent registration
 * Features:
 * - Mission acceptance workflow
 * - Codename assignment on confirmation
 * - Tactical styling with clearance levels
 * - Calendar export for mission briefing
 */
const AgentRecruitment = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    guests: '1',
    dietaryRestrictions: '',
    attending: 'yes',
    reminderPreference: 'week',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assignedCodename, setAssignedCodename] = useState('');

  // Generate agent codename
  const generateCodename = () => {
    const adjective = theme.codenames.adjectives[Math.floor(Math.random() * theme.codenames.adjectives.length)];
    const noun = theme.codenames.nouns[Math.floor(Math.random() * theme.codenames.nouns.length)];
    return `${adjective} ${noun}`;
  };

  // Generate calendar file
  const generateCalendarFile = () => {
    const event = {
      title: 'OPERATION SANTA\'S MANIFEST',
      description: 'CLASSIFIED: North Pole Intelligence Division - Gift Acquisition Mission ($20-40 decoy package required)',
      location: 'Tactical HQ (Classified)',
      start: '20251213T190000', // 19:00 hours (7:00 PM AST)
      end: '20251213T230000',   // 23:00 hours (11:00 PM AST)
      timezone: 'America/Puerto_Rico',
    };

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Operation Santa\'s Manifest//EN',
      'BEGIN:VTIMEZONE',
      'TZID:America/Puerto_Rico',
      'BEGIN:STANDARD',
      'DTSTART:19700101T000000',
      'TZOFFSETFROM:-0400',
      'TZOFFSETTO:-0400',
      'TZNAME:AST',
      'END:STANDARD',
      'END:VTIMEZONE',
      'BEGIN:VEVENT',
      `DTSTART;TZID=America/Puerto_Rico:${event.start}`,
      `DTEND;TZID=America/Puerto_Rico:${event.end}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description}`,
      `LOCATION:${event.location}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\n');

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'operation-santas-manifest.ics';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Agent identification required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Secure communication channel required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid communication protocol format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Mission acceptance failed');
      }

      // Generate codename on successful submission
      setAssignedCodename(generateCodename());
      setIsSubmitted(true);
    } catch (error) {
      console.error('Agent registration error:', error);
      alert('Mission acceptance failed. Please retry or contact Command directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center p-6 z-10">
        {/* Success Classification Banner */}
        <motion.div
          className="fixed top-0 left-0 right-0 bg-gradient-to-r from-emerald-900/90 via-emerald-800/90 to-emerald-900/90 border-b-2 border-emerald-500 z-50 py-2"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
        >
          <div className="text-center flex items-center justify-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-emerald-200 font-mono text-sm tracking-wider">
              ✓ CLEARANCE GRANTED — AGENT ACTIVATED — MISSION ACCEPTED ✓
            </span>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          </div>
        </motion.div>

        <motion.div
          className="max-w-2xl w-full text-center mt-16"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="glass-card rounded-lg p-12 border border-sky-500/30">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}>
              <div className="text-7xl mb-6">🎖️</div>
            </motion.div>

            <h1 className="text-5xl md:text-6xl mb-4 font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-400 drop-shadow-[0_0_30px_rgba(56,189,248,0.3)]">
              {formData.attending === 'yes' ? 'MISSION ACCEPTED' : 'AGENT DECLINED'}
            </h1>

            {formData.attending === 'yes' ? (
              <>
                <p className="text-2xl mb-6 text-slate-300 font-mono">
                  Welcome to the team, <span className="text-sky-400 font-semibold">{formData.name}</span>
                </p>

                {/* Codename Assignment */}
                <motion.div
                  className="glass-card rounded-lg p-6 mb-6 border-2 border-sky-500/50 bg-gradient-to-br from-sky-500/10 to-cyan-500/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="text-xs font-mono text-sky-400/60 mb-2 tracking-wider">ASSIGNED CODENAME</div>
                  <div className="text-4xl font-display font-bold text-sky-400 mb-2 tracking-wide">
                    {assignedCodename}
                  </div>
                  <div className="text-sm text-slate-400 font-mono">
                    This is your operational identifier for the mission
                  </div>
                </motion.div>

                {/* Mission Details */}
                <motion.div
                  className="glass-card rounded-lg p-6 mb-8 border border-sky-500/30"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <p className="text-slate-300 mb-4 font-mono">
                    📡 Mission briefing sent to: <span className="text-sky-400">{formData.email}</span>
                  </p>
                  <p className="text-sm text-slate-400 mb-4">
                    {formData.reminderPreference === 'week' && "Intelligence update scheduled: T-minus 7 days"}
                    {formData.reminderPreference === 'day' && "Intelligence update scheduled: T-minus 24 hours"}
                    {formData.reminderPreference === 'both' && "Intelligence updates scheduled: T-7 days and T-24 hours"}
                    {formData.reminderPreference === 'none' && "No reminders requested - you're operating dark"}
                  </p>
                  <button
                    onClick={generateCalendarFile}
                    className="px-8 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg font-semibold shadow-lg shadow-sky-500/20 hover:shadow-xl hover:shadow-sky-500/30 transition-all duration-300 w-full"
                  >
                    📅 Download Mission Schedule
                  </button>
                </motion.div>

                {/* Mission Reminder */}
                <motion.div
                  className="glass-card rounded-lg p-4 mb-6 border border-amber-500/30 bg-amber-500/5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="flex items-center gap-3 text-amber-400">
                    <span className="text-2xl">⚠️</span>
                    <p className="text-sm font-mono">
                      REMINDER: Acquire $20-40 decoy package. Proper concealment required.
                    </p>
                  </div>
                </motion.div>
              </>
            ) : (
              <p className="text-2xl mb-8 text-slate-300">
                Mission declined. Agent <span className="text-slate-400">{formData.name}</span> marked unavailable.
              </p>
            )}

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <button className="px-8 py-3 bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-600 w-full sm:w-auto">
                  ← Command Center
                </button>
              </Link>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setAssignedCodename('');
                  setFormData({ 
                    name: '', 
                    email: '', 
                    guests: '1', 
                    dietaryRestrictions: '', 
                    attending: 'yes', 
                    reminderPreference: 'week' 
                  });
                }}
                className="px-8 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg font-semibold shadow-lg shadow-sky-500/20 hover:shadow-xl hover:shadow-sky-500/30 transition-all duration-300 w-full sm:w-auto"
              >
                Modify Registration
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 py-20 z-10">
      {/* Classification Banner */}
      <motion.div
        className="fixed top-0 left-0 right-0 bg-gradient-to-r from-sky-900/90 via-sky-800/90 to-sky-900/90 border-b-2 border-sky-500 z-50 py-2"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
      >
        <div className="text-center flex items-center justify-center gap-3">
          <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse" />
          <span className="text-sky-200 font-mono text-sm tracking-wider">
            🔐 AGENT RECRUITMENT — CLEARANCE REQUIRED — SECURE CHANNEL 🔐
          </span>
          <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse" />
        </div>
      </motion.div>

      <div className="max-w-2xl w-full">
        <motion.div 
          className="text-center mb-12 mt-8" 
          initial={{ opacity: 0, y: -30 }} 
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="inline-block mb-4 px-4 py-1 bg-sky-500/20 border border-sky-500/30 rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-sky-400 font-mono text-sm tracking-wider">
              RECRUITMENT PROTOCOL ACTIVE
            </span>
          </motion.div>
          <h1 className="text-5xl md:text-7xl mb-4 font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-400 drop-shadow-[0_0_30px_rgba(56,189,248,0.3)]">
            AGENT RECRUITMENT
          </h1>
          <p className="text-xl text-slate-300 font-mono">Join Operation Santa's Manifest</p>
        </motion.div>

        <motion.div 
          className="glass-card rounded-lg p-8 md:p-12 border border-sky-500/20" 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mission Acceptance Toggle */}
            <div>
              <label className="block text-lg font-semibold text-white mb-3 font-display">Mission Status</label>
              <div className="flex gap-3">
                {[
                  { value: 'yes', label: 'Accept Mission', color: 'sky' },
                  { value: 'no', label: 'Decline Mission', color: 'red' }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, attending: option.value }))}
                    className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all border-2 ${
                      formData.attending === option.value
                        ? option.color === 'sky'
                          ? 'bg-sky-500 border-sky-400 text-white shadow-lg shadow-sky-500/20'
                          : 'bg-red-500 border-red-400 text-white shadow-lg shadow-red-500/20'
                        : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-700/50 hover:border-slate-600'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Agent Name */}
            <div>
              <label htmlFor="name" className="block text-lg font-semibold text-white mb-2 font-display">
                Agent Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg bg-slate-800/50 text-white border-2 font-mono ${
                  errors.name ? 'border-red-500' : 'border-slate-700'
                } focus:border-sky-500 focus:outline-none transition-all`}
                placeholder="Enter agent identification"
              />
              <AnimatePresence>
                {errors.name && (
                  <motion.p 
                    className="text-red-400 text-sm mt-2 font-mono" 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                  >
                    ⚠️ {errors.name}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Secure Email */}
            <div>
              <label htmlFor="email" className="block text-lg font-semibold text-white mb-2 font-display">
                Secure Communication Channel
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg bg-slate-800/50 text-white border-2 font-mono ${
                  errors.email ? 'border-red-500' : 'border-slate-700'
                } focus:border-sky-500 focus:outline-none transition-all`}
                placeholder="agent@classified.com"
              />
              <AnimatePresence>
                {errors.email && (
                  <motion.p 
                    className="text-red-400 text-sm mt-2 font-mono" 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                  >
                    ⚠️ {errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Conditional Mission Details */}
            <AnimatePresence>
              {formData.attending === 'yes' && (
                <motion.div 
                  className="space-y-6" 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  exit={{ opacity: 0, height: 0 }}
                >
                  {/* Number of Agents */}
                  <div>
                    <label htmlFor="guests" className="block text-lg font-semibold text-white mb-2 font-display">
                      Number of Operatives
                    </label>
                    <select
                      id="guests"
                      name="guests"
                      value={formData.guests}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-slate-800/50 text-white border-2 border-slate-700 focus:border-sky-500 focus:outline-none transition-all font-mono"
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'Agent' : 'Agents'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Dietary Intel */}
                  <div>
                    <label htmlFor="dietaryRestrictions" className="block text-lg font-semibold text-white mb-2 font-display">
                      Dietary Intelligence (Optional)
                    </label>
                    <textarea
                      id="dietaryRestrictions"
                      name="dietaryRestrictions"
                      value={formData.dietaryRestrictions}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-3 rounded-lg bg-slate-800/50 text-white border-2 border-slate-700 focus:border-sky-500 focus:outline-none transition-all resize-none font-mono"
                      placeholder="Report any operational dietary restrictions..."
                    />
                  </div>

                  {/* Intelligence Updates */}
                  <div>
                    <label htmlFor="reminderPreference" className="block text-lg font-semibold text-white mb-2 font-display">
                      Intelligence Updates
                    </label>
                    <select
                      id="reminderPreference"
                      name="reminderPreference"
                      value={formData.reminderPreference}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-slate-800/50 text-white border-2 border-slate-700 focus:border-sky-500 focus:outline-none transition-all font-mono"
                    >
                      <option value="week">T-minus 7 days</option>
                      <option value="day">T-minus 24 hours</option>
                      <option value="both">Both updates</option>
                      <option value="none">Operating dark (no updates)</option>
                    </select>
                    <p className="text-slate-400 text-sm mt-2 font-mono">
                      📡 Mission reminders to acquire your decoy package
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Mission */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg font-semibold text-lg shadow-lg shadow-sky-500/20 hover:shadow-xl hover:shadow-sky-500/30 transition-all duration-300 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Processing...' : formData.attending === 'yes' ? 'Accept Mission' : 'Decline Mission'}
            </button>
          </form>

          <div className="text-center mt-6">
            <Link to="/" className="text-slate-400 hover:text-sky-400 transition-colors font-mono text-sm">
              ← Return to Command Center
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AgentRecruitment;
