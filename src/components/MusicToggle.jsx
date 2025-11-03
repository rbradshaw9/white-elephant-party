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
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <>
      {/* 
        Audio element - Replace src with actual sleigh bells audio file
        For now using a placeholder. You can add an MP3 file to /public/audio/
      */}
      <audio ref={audioRef} loop>
        <source src="/audio/sleigh-bells.mp3" type="audio/mpeg" />
      </audio>

      {/* Music toggle button - fixed top right with festive styling */}
      <motion.button
        onClick={toggleMusic}
        className="fixed top-6 right-6 z-50 bg-christmas-gold text-blue-900 p-4 rounded-full shadow-xl hover:shadow-2xl transition-shadow"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title={isPlaying ? 'Pause Music' : 'Play Music'}
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
