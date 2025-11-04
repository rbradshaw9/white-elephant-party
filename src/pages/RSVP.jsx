import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import AgentRecruitment from './AgentRecruitment';
import EVENT_CONFIG from '../config/config';

/**
 * RSVP Page Component
 * Modern design with smooth validation and animations
 * Conditional rendering for heist theme (Agent Recruitment)
 */
const RSVP = () => {
  const { isHeistTheme } = useTheme();

  // Render heist version if heist theme is active
  if (isHeistTheme) {
    return <AgentRecruitment />;
  }

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guests: '1',
    dietaryRestrictions: '',
    attending: 'yes',
    reminders: true,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate calendar file
  const generateCalendarFile = () => {
    const event = {
      title: EVENT_CONFIG.name,
      description: `Annual White Elephant Gift Exchange - Bring a $${EVENT_CONFIG.giftBudget.min}-$${EVENT_CONFIG.giftBudget.max} gift!`,
      location: `${EVENT_CONFIG.location.name} - ${EVENT_CONFIG.location.address}`,
      start: '20251213T183000', // 6:30 PM AST
      end: '20251213T230000',   // 11:00 PM AST
      timezone: EVENT_CONFIG.timezoneIANA,
    };

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//White Elephant Party//EN',
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
    link.download = 'white-elephant-party-2025.ics';
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
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
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
        throw new Error(data.error || 'Failed to submit RSVP');
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error('RSVP submission error:', error);
      alert('Failed to submit RSVP. Please try again or contact Ryan directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center p-6 z-10">
        <motion.div
          className="max-w-2xl w-full text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="glass-card rounded-3xl p-12">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
              <div className="text-7xl mb-6">🎉</div>
            </motion.div>

            <h1 className="text-5xl md:text-6xl mb-4 font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-300 to-emerald-400">
              You're In!
            </h1>

            <p className="text-2xl mb-6 text-slate-300">
              {formData.attending === 'yes' ? (
                <>Can't wait, <span className="text-emerald-400 font-semibold">{formData.name}</span>!</>
              ) : (
                <>Sorry you can't make it, {formData.name}.</>
              )}
            </p>

            {formData.attending === 'yes' && (
              <motion.div
                className="glass-card rounded-xl p-6 mb-8 border border-emerald-500/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-slate-300 mb-4">📧 Check {formData.email} for details</p>
                {formData.reminders && (
                  <p className="text-sm text-slate-400 mb-4">
                    We'll send you reminders before the party! 🎄
                  </p>
                )}
                <button
                  onClick={generateCalendarFile}
                  className="btn-festive-green text-base w-full"
                >
                  📅 Add to Calendar
                </button>
              </motion.div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <button className="btn-festive text-lg w-full sm:w-auto">← Home</button>
              </Link>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({ name: '', email: '', phone: '', guests: '1', dietaryRestrictions: '', attending: 'yes', reminders: true });
                }}
                className="btn-festive-green text-lg w-full sm:w-auto"
              >
                Edit RSVP
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 py-20 z-10">
      <div className="max-w-2xl w-full">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-5xl md:text-7xl mb-4 font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-300 to-emerald-400">
            RSVP
          </h1>
          <p className="text-xl text-slate-300">Secure your spot at the chaos</p>
        </motion.div>

        <motion.div className="glass-card rounded-3xl p-8 md:p-12" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Attending Toggle */}
            <div>
              <label className="block text-lg font-semibold text-white mb-3">Will you attend?</label>
              <div className="flex gap-3">
                {['yes', 'no'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, attending: option }))}
                    className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all ${
                      formData.attending === option
                        ? option === 'yes'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-red-500 text-white'
                        : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
                    }`}
                  >
                    {option === 'yes' ? "Yes, I'll be there!" : "Can't make it"}
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-lg font-semibold text-white mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl bg-slate-800/50 text-white border-2 ${
                  errors.name ? 'border-red-500' : 'border-slate-700'
                } focus:border-emerald-500 focus:outline-none transition-all`}
                placeholder="Your name"
              />
              <AnimatePresence>
                {errors.name && (
                  <motion.p className="text-red-400 text-sm mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {errors.name}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-lg font-semibold text-white mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl bg-slate-800/50 text-white border-2 ${
                  errors.email ? 'border-red-500' : 'border-slate-700'
                } focus:border-emerald-500 focus:outline-none transition-all`}
                placeholder="your@email.com"
              />
              <AnimatePresence>
                {errors.email && (
                  <motion.p className="text-red-400 text-sm mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Conditional fields */}
            <AnimatePresence>
              {formData.attending === 'yes' && (
                <motion.div className="space-y-6" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  {/* Phone (Optional) */}
                  <div>
                    <label htmlFor="phone" className="block text-lg font-semibold text-white mb-2">
                      Phone Number (optional)
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-800/50 text-white border-2 border-slate-700 focus:border-emerald-500 focus:outline-none transition-all"
                      placeholder="+1 (555) 000-0000"
                    />
                    <p className="text-slate-400 text-xs mt-1">
                      For text reminders (optional)
                    </p>
                  </div>

                  {/* Guests */}
                  <div>
                    <label htmlFor="guests" className="block text-lg font-semibold text-white mb-2">
                      Number of Guests
                    </label>
                    <select
                      id="guests"
                      name="guests"
                      value={formData.guests}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-800/50 text-white border-2 border-slate-700 focus:border-emerald-500 focus:outline-none transition-all"
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Dietary */}
                  <div>
                    <label htmlFor="dietaryRestrictions" className="block text-lg font-semibold text-white mb-2">
                      Dietary Restrictions (optional)
                    </label>
                    <textarea
                      id="dietaryRestrictions"
                      name="dietaryRestrictions"
                      value={formData.dietaryRestrictions}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-3 rounded-xl bg-slate-800/50 text-white border-2 border-slate-700 focus:border-emerald-500 focus:outline-none transition-all resize-none"
                      placeholder="Any allergies or dietary needs?"
                    />
                  </div>

                  {/* Reminder Checkbox */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="reminders"
                      name="reminders"
                      checked={formData.reminders}
                      onChange={(e) => setFormData((prev) => ({ ...prev, reminders: e.target.checked }))}
                      className="w-5 h-5 mt-1 rounded bg-slate-800/50 border-2 border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
                    />
                    <label htmlFor="reminders" className="text-slate-300 cursor-pointer">
                      <div className="font-semibold text-white mb-1">Send me reminders</div>
                      <div className="text-sm text-slate-400">
                        We'll email you before the party to remind you to grab your gift! 🎁
                      </div>
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full btn-festive text-lg py-4 ${isSubmitting ? 'opacity-50' : ''}`}
            >
              {isSubmitting ? 'Sending...' : 'Submit RSVP'}
            </button>
          </form>

          <div className="text-center mt-6">
            <Link to="/" className="text-slate-400 hover:text-slate-300 transition-colors">
              ← Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RSVP;
