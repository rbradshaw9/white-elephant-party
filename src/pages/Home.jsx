import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import PresentStackingGame from '../components/PresentStackingGame';

/**
 * Home Page Component
 * Dual-theme design with hilarious copy and engaging content
 */
const Home = () => {
  const { theme, isHeistTheme } = useTheme();
  
  // Countdown timer logic
  const calculateTimeLeft = () => {
    // Party date in Puerto Rico time (Atlantic Standard Time, UTC-4)
    // December 13, 2025 at 6:30 PM AST
    const partyDate = new Date('2025-12-13T18:30:00-04:00');
    const now = new Date();
    const difference = partyDate - now;

    if (difference > 0) {
      return {
        total: difference,
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000); // Update every second instead of every minute
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen p-6 py-12 z-10" style={{ backgroundColor: theme.palette.background }}>
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Hero Section - Theme-Aware */}
        <motion.div
          className="text-center space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className={`inline-block px-4 py-2 rounded-full border mb-4 ${
              isHeistTheme 
                ? 'bg-gradient-to-r from-blue-600/20 to-cyan-500/20 border-blue-500/30'
                : 'bg-gradient-to-r from-red-500/20 to-emerald-500/20 border-red-500/30'
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <span className={`text-sm font-medium ${isHeistTheme ? 'text-cyan-300' : 'text-emerald-400'}`}>
              {isHeistTheme ? theme.hero.tagline : 'Saturday, December 13, 2025 • 6:30 PM'}
            </span>
          </motion.div>

          <h1 
            className={`text-6xl md:text-8xl lg:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${theme.palette.gradients.hero} leading-tight`}
            style={{ fontFamily: theme.fonts.display }}
          >
            {theme.hero.title}
          </h1>

          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed" style={{ color: theme.palette.text.secondary }}>
            {theme.hero.subtitle}
          </p>

          {/* Countdown */}
          {timeLeft.total > 0 && (
            <motion.div
              className="flex justify-center gap-3 md:gap-6 mt-8 flex-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="glass-card rounded-2xl px-4 md:px-6 py-4">
                <div className="text-3xl md:text-4xl font-bold text-white">{timeLeft.days}</div>
                <div className="text-xs md:text-sm text-slate-400">Days</div>
              </div>
              <div className="glass-card rounded-2xl px-4 md:px-6 py-4">
                <div className="text-3xl md:text-4xl font-bold text-white">{timeLeft.hours}</div>
                <div className="text-xs md:text-sm text-slate-400">Hours</div>
              </div>
              <div className="glass-card rounded-2xl px-4 md:px-6 py-4">
                <div className="text-3xl md:text-4xl font-bold text-white">{timeLeft.minutes}</div>
                <div className="text-xs md:text-sm text-slate-400">Minutes</div>
              </div>
              <div className="glass-card rounded-2xl px-4 md:px-6 py-4">
                <div className="text-3xl md:text-4xl font-bold text-white">{timeLeft.seconds}</div>
                <div className="text-xs md:text-sm text-slate-400">Seconds</div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Link to="/rsvp" className="w-full sm:w-auto">
            <motion.button
              className={`text-lg w-full px-8 py-4 rounded-xl font-semibold transition-all shadow-lg ${
                isHeistTheme
                  ? 'bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:shadow-blue-500/50 text-white'
                  : 'bg-gradient-to-r from-red-500 to-red-600 hover:shadow-red-500/50 text-white'
              }`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              {theme.hero.cta.primary}
            </motion.button>
          </Link>

          <Link to="/rules" className="w-full sm:w-auto">
            <motion.button
              className={`text-lg w-full px-8 py-4 rounded-xl font-semibold transition-all shadow-lg ${
                isHeistTheme
                  ? 'bg-gradient-to-r from-red-600 to-red-700 hover:shadow-red-600/50 text-white'
                  : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:shadow-emerald-500/50 text-white'
              }`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              {theme.hero.cta.secondary}
            </motion.button>
          </Link>
        </motion.div>

        {/* What to Expect Section */}
        <motion.div
          className="glass-card rounded-3xl p-8 md:p-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 text-center">
            What Awaits You
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="space-y-3">
              <div className="text-4xl">🎁</div>
              <h3 className="text-xl font-semibold text-emerald-400">The Gifts</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                $20-40 budget. Anything goes. Last year we had everything from top-shelf tequila to sex toys to landscape lighting. 
                Someone brought a heated bidet seat. Another brought a life-size cardboard cutout of Danny DeVito. 
                The bar is on the floor, but somehow we keep limbo-ing under it.
              </p>
            </div>

            <div className="space-y-3">
              <div className="text-4xl">⚔️</div>
              <h3 className="text-xl font-semibold text-amber-400">The Drama</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Watch friendships tested as people fight over the stupidest gifts.
                Witness the emotional rollercoaster when someone steals your prized tequila for a garden gnome. 
                It's not about winning—it's about the stories you'll tell for years.
              </p>
            </div>

            <div className="space-y-3">
              <div className="text-4xl">�</div>
              <h3 className="text-xl font-semibold text-red-400">The Food</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                We're making chili! Bring something to share if you want (drinks, sides, desserts, whatever). 
                No pressure, but if you show up with just yourself, you might get judged. Just kidding. Maybe.
              </p>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-6">
            <h3 className="text-lg font-semibold mb-3 text-slate-200">Gift Ideas (if you're stuck):</h3>
            <div className="grid sm:grid-cols-2 gap-3 text-sm text-slate-400">
              <div className="flex items-start gap-2">
                <span className="text-emerald-500 mt-1">✓</span>
                <span>Funny socks (bonus points for pizza or taco patterns)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-500 mt-1">✓</span>
                <span>Weird coffee table books ("Cats Who Look Like Hitler" was a hit)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-500 mt-1">✓</span>
                <span>Kitchen gadgets that solve problems nobody has</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-500 mt-1">✓</span>
                <span>Anything from the "As Seen on TV" aisle</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-500 mt-1">✓</span>
                <span>Blankets with animal faces (everyone needs a shark blanket)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-500 mt-1">✓</span>
                <span>Board games for people who peaked in 2008</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Spotify Playlist */}
        <motion.div
          className="glass-card rounded-3xl p-8 md:p-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-300 to-emerald-400">
            🎵 Party Vibes
          </h2>
          <p className="text-slate-300 text-center mb-8">
            Get hyped with our official White Elephant playlist. From classics to chaos.
          </p>
          
          <div className="rounded-xl overflow-hidden shadow-2xl">
            <iframe
              style={{ borderRadius: '12px' }}
              src="https://open.spotify.com/embed/playlist/37i9dQZF1DX0Yxoavh5qJV?utm_source=generator&theme=0"
              width="100%"
              height="380"
              frameBorder="0"
              allowFullScreen=""
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="White Elephant Party Playlist"
            ></iframe>
          </div>
          
          <p className="text-slate-400 text-sm mt-4 text-center">
            Don't have Spotify? We'll also have the vibes going at the party 🎶
          </p>
        </motion.div>

        {/* Past Winners Hall of Fame */}
        <motion.div
          className="glass-card rounded-3xl p-8 md:p-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 text-center">
            Hall of Fame (& Shame)
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/50">
              <div className="text-3xl">🏆</div>
              <div>
                <div className="font-semibold text-amber-400">2024 Most Fought Over</div>
                <div className="text-slate-300 text-sm">Heated blanket that also massages. Got stolen 7 times. Yes, seven.</div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/50">
              <div className="text-3xl">😂</div>
              <div>
                <div className="font-semibold text-emerald-400">2024 Most Hilarious</div>
                <div className="text-slate-300 text-sm">A "Live, Laugh, Love" wall decoration, but it was bacon-themed. Still hanging in someone's kitchen.</div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/50">
              <div className="text-3xl">💀</div>
              <div>
                <div className="font-semibold text-red-400">2024 Biggest Regret</div>
                <div className="text-slate-300 text-sm">USB-powered desk Christmas tree. Played the same 5-second jingle on repeat. Battery mysteriously died that night.</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Game Section - Present Stacking */}
        <motion.div
          className="glass-card rounded-3xl p-6 md:p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <PresentStackingGame />
        </motion.div>

        {/* Party Details */}
        <motion.div
          className="glass-card rounded-3xl p-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          <h3 className="text-2xl font-display font-bold mb-4">The Details</h3>
          <div className="text-slate-300 space-y-2">
            <p className="text-lg">📍 TBD (check your email after RSVP)</p>
            <p className="text-lg">🕖 6:30 PM - Until someone cries or midnight, whichever comes first</p>
            <p className="text-lg">🎁 Bring a wrapped gift ($20-40)</p>
            <p className="text-sm text-slate-400 mt-4">
              <strong>Coming as a couple?</strong> You can bring one gift and play as a team, 
              or bring two gifts and compete against each other. Choose chaos wisely.
            </p>
            <p className="text-sm text-slate-400 italic mt-4">
              "It's not about the destination, it's about the friends you betray along the way."
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Home;
