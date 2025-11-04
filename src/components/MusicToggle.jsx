import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * MusicToggle Component
 * Provides play/pause control for background music
 * Fixed position in top-right corner of the screen
 */
const MusicToggle = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const audioRef = useRef(null);

  // Toggle play/pause when button is clicked
  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // Handle play promise to avoid errors
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log('Audio play failed:', error);
          });
        }
      }
      setIsPlaying(!isPlaying);
      setShowTooltip(false); // Hide tooltip after first interaction
    }
  };

  // Set volume on mount and hide tooltip after 10 seconds
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3; // 30% volume
    }
    
    // Hide tooltip after 10 seconds if user hasn't interacted
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 10000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* 
        Audio element - The Great Gift Heist theme song
      */}
      <audio 
        ref={audioRef} 
        loop
        preload="auto"
      >
        <source src="/media/The Great Gift Heist.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Music toggle button - fixed top right with festive styling */}
      <div className="relative">
        <motion.button
          onClick={toggleMusic}
          className={`fixed top-6 right-6 z-50 bg-gradient-to-br from-amber-400 to-amber-500 text-slate-900 p-4 rounded-full shadow-xl hover:shadow-2xl transition-all hover:from-amber-300 hover:to-amber-400 ${
            !isPlaying && showTooltip ? 'animate-pulse' : ''
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title={isPlaying ? 'Pause Music' : 'Play Music'}
          aria-label={isPlaying ? 'Pause Music' : 'Play Music'}
        >
          {isPlaying ? (
            // Pause icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ) : (
            // Play icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
        </motion.button>
        
        {/* Tooltip - only show for 10 seconds on first visit */}
        <AnimatePresence>
          {!isPlaying && showTooltip && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="fixed top-20 right-6 z-50 bg-slate-900/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-mono border border-amber-400/30 shadow-lg"
            >
              🎵 Click for music!
              <div className="absolute -top-2 right-6 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-slate-900/90" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default MusicToggle;
