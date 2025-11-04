import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * MusicToggle Component
 * Provides play/pause control for background sleigh bells music
 * Fixed position in top-right corner of the screen
 * Note: For production, replace with actual sleigh bells audio file
 */
const MusicToggle = () => {
  const [isPlaying, setIsPlaying] = useState(false);
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
    }
  };

  // Set volume on mount
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3; // 30% volume
    }
  }, []);

  return (
    <>
      {/* 
        Audio element - Using a free Christmas music sample
        You can replace with your own audio file in /public/audio/
      */}
      <audio 
        ref={audioRef} 
        loop
        preload="auto"
      >
        <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Music toggle button - fixed top right with festive styling */}
      <motion.button
        onClick={toggleMusic}
        className="fixed top-6 right-6 z-50 bg-gradient-to-br from-amber-400 to-amber-500 text-slate-900 p-4 rounded-full shadow-xl hover:shadow-2xl transition-all hover:from-amber-300 hover:to-amber-400"
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
    </>
  );
};

export default MusicToggle;
