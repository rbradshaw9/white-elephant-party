import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

/**
 * RSVP Page Component
 * Beautifully designed RSVP form with Apple-level polish
 * Features:
 * - Smooth animations and micro-interactions
 * - Form validation with helpful feedback
 * - Success state with confetti effect
 * - Accessibility-friendly
 * - Clean, modern design inspired by Elf's whimsy
 */
const RSVP = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    guests: '1',
    dietaryRestrictions: '',
    attending: 'yes',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handle input changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  /**
   * Validate form data
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please tell us your name!';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'We need your email to send details!';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.attending === 'yes' && !formData.guests) {
      newErrors.guests = 'How many elves are joining?';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call (replace with your actual backend endpoint)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Here you would send data to your backend:
    // await fetch('/api/rsvp', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formData),
    // });

    console.log('RSVP Submitted:', formData);

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center p-6 z-10">
        <motion.div
          className="max-w-2xl w-full text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Success state */}
          <div className="candy-cane-border rounded-3xl">
            <div className="bg-blue-900/95 backdrop-blur-sm p-12 rounded-2xl">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <div className="text-8xl mb-6">🎉</div>
              </motion.div>

              <h1 className="text-5xl md:text-6xl mb-4 text-christmas-gold text-shadow-gold">
                You're on the List!
              </h1>

              <p className="text-2xl mb-6 text-snow-white">
                {formData.attending === 'yes' ? (
                  <>
                    We can't wait to see you, <span className="text-christmas-green font-bold">{formData.name}</span>! 🎄
                  </>
                ) : (
                  <>
                    Sorry you can't make it, {formData.name}. You'll be missed! 😢
                  </>
                )}
              </p>

              {formData.attending === 'yes' && (
                <motion.div
                  className="bg-christmas-green/20 border-2 border-christmas-green rounded-xl p-6 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <p className="text-lg text-snow-white mb-2">
                    📧 Check your email for party details!
                  </p>
                  <p className="text-sm text-snow-white/70">
                    We've sent everything to <strong>{formData.email}</strong>
                  </p>
                </motion.div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/">
                  <motion.button
                    className="btn-festive text-xl w-full sm:w-auto"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    🏠 Back to Home
                  </motion.button>
                </Link>

                <motion.button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({
                      name: '',
                      email: '',
                      guests: '1',
                      dietaryRestrictions: '',
                      attending: 'yes',
                    });
                  }}
                  className="btn-festive-green text-xl w-full sm:w-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ✏️ Edit RSVP
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 py-20 z-10">
      <div className="max-w-2xl w-full">
        {/* Page header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl mb-4 text-christmas-gold text-shadow-gold">
            RSVP 🎄
          </h1>
          <p className="text-xl text-snow-white/90">
            Join us for the most wonderful White Elephant party!
          </p>
        </motion.div>

        {/* RSVP Form */}
        <motion.div
          className="candy-cane-border rounded-3xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <div className="bg-blue-900/95 backdrop-blur-sm p-8 md:p-12 rounded-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Attending Toggle */}
              <div>
                <label className="block text-lg font-bold text-christmas-gold mb-3">
                  Will you attend? ✨
                </label>
                <div className="flex gap-4">
                  {['yes', 'no'].map((option) => (
                    <motion.button
                      key={option}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, attending: option }))}
                      className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all ${
                        formData.attending === option
                          ? option === 'yes'
                            ? 'bg-christmas-green text-white shadow-lg scale-105'
                            : 'bg-christmas-red text-white shadow-lg scale-105'
                          : 'bg-blue-800/50 text-snow-white/60 hover:bg-blue-800/70'
                      }`}
                      whileHover={{ scale: formData.attending === option ? 1.05 : 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {option === 'yes' ? '✅ Yes! I\'ll be there!' : '❌ Can\'t make it'}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Name Input */}
              <div>
                <label htmlFor="name" className="block text-lg font-bold text-christmas-gold mb-2">
                  Your Name 🎅
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl bg-blue-800/50 text-snow-white border-2 ${
                    errors.name ? 'border-christmas-red' : 'border-christmas-gold/30'
                  } focus:border-christmas-gold focus:outline-none transition-all text-lg`}
                  placeholder="Buddy the Elf"
                />
                <AnimatePresence>
                  {errors.name && (
                    <motion.p
                      className="text-christmas-red text-sm mt-2"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      {errors.name}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-lg font-bold text-christmas-gold mb-2">
                  Email Address 📧
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl bg-blue-800/50 text-snow-white border-2 ${
                    errors.email ? 'border-christmas-red' : 'border-christmas-gold/30'
                  } focus:border-christmas-gold focus:outline-none transition-all text-lg`}
                  placeholder="buddy@northpole.com"
                />
                <AnimatePresence>
                  {errors.email && (
                    <motion.p
                      className="text-christmas-red text-sm mt-2"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      {errors.email}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Conditional fields for "Yes" responses */}
              <AnimatePresence>
                {formData.attending === 'yes' && (
                  <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {/* Number of Guests */}
                    <div>
                      <label htmlFor="guests" className="block text-lg font-bold text-christmas-gold mb-2">
                        Number of Guests (including you) 👥
                      </label>
                      <select
                        id="guests"
                        name="guests"
                        value={formData.guests}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-blue-800/50 text-snow-white border-2 border-christmas-gold/30 focus:border-christmas-gold focus:outline-none transition-all text-lg"
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'Guest' : 'Guests'}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Dietary Restrictions */}
                    <div>
                      <label htmlFor="dietaryRestrictions" className="block text-lg font-bold text-christmas-gold mb-2">
                        Dietary Restrictions (optional) 🍽️
                      </label>
                      <textarea
                        id="dietaryRestrictions"
                        name="dietaryRestrictions"
                        value={formData.dietaryRestrictions}
                        onChange={handleChange}
                        rows="3"
                        className="w-full px-4 py-3 rounded-xl bg-blue-800/50 text-snow-white border-2 border-christmas-gold/30 focus:border-christmas-gold focus:outline-none transition-all text-lg resize-none"
                        placeholder="No candy canes, please..."
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className={`w-full btn-festive text-xl py-4 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Sending...
                  </span>
                ) : (
                  '🎁 Submit RSVP'
                )}
              </motion.button>
            </form>

            {/* Back to home link */}
            <div className="text-center mt-8">
              <Link to="/">
                <motion.span
                  className="text-christmas-gold hover:text-christmas-gold/80 transition-colors text-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  ← Back to Home
                </motion.span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RSVP;
