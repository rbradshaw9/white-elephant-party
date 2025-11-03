import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

/**
 * Gallery Photos Data
 * Placeholder images for last year's party highlights
 * Replace these with actual photos by:
 * 1. Adding photos to /public/images/
 * 2. Updating the 'src' values below
 * Or use image hosting services and update URLs
 */
const PHOTOS = [
  {
    id: 1,
    src: 'https://via.placeholder.com/400x300/FF3B3B/FFFFFF?text=Gift+Madness',
    caption: 'The moment Dave realized he got the singing fish 🐟',
    year: '2024',
  },
  {
    id: 2,
    src: 'https://via.placeholder.com/400x300/2ECC71/FFFFFF?text=Epic+Steal',
    caption: 'Sarah\'s legendary triple-steal move! 🏆',
    year: '2024',
  },
  {
    id: 3,
    src: 'https://via.placeholder.com/400x300/FFD700/000000?text=Winner+Winner',
    caption: 'Jessica with the most coveted gift of the night 🎁',
    year: '2024',
  },
  {
    id: 4,
    src: 'https://via.placeholder.com/400x300/FF3B3B/FFFFFF?text=Group+Photo',
    caption: 'The whole crew ready to rumble! 🎉',
    year: '2024',
  },
  {
    id: 5,
    src: 'https://via.placeholder.com/400x300/2ECC71/FFFFFF?text=Funny+Gift',
    caption: 'That awkward moment when you get toilet paper 🧻',
    year: '2024',
  },
  {
    id: 6,
    src: 'https://via.placeholder.com/400x300/FFD700/000000?text=Party+Time',
    caption: 'Dancing around the gift pile like pros 💃',
    year: '2024',
  },
];

/**
 * Gallery Page Component
 * Displays photo memories from last year's White Elephant party
 * Features:
 * - Responsive photo grid
 * - Image captions with hover effects
 * - Animated photo cards
 * - Navigation back to other pages
 */
const Gallery = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 py-20 z-10">
      {/* Main content container */}
      <div className="max-w-6xl w-full">
        {/* Page header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl mb-4 text-christmas-gold text-shadow-gold">
            📸 Party Gallery 📸
          </h1>
          <p className="text-xl text-snow-white/90 mb-2">
            Relive the chaos from White Elephant 2024!
          </p>
          <p className="text-lg text-christmas-green italic">
            (The gifts were questionable, but the memories are priceless 😂)
          </p>
        </motion.div>

        {/* Photo grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {PHOTOS.map((photo, index) => (
            <motion.div
              key={photo.id}
              className="group relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              {/* Photo card with candy cane border */}
              <div className="candy-cane-border rounded-2xl overflow-hidden">
                <div className="bg-blue-900/95 backdrop-blur-sm p-3">
                  {/* Image container with hover effect */}
                  <div className="relative overflow-hidden rounded-lg">
                    <motion.img
                      src={photo.src}
                      alt={photo.caption}
                      className="w-full h-64 object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    {/* Year badge */}
                    <div className="absolute top-3 right-3 bg-christmas-red text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      {photo.year}
                    </div>

                    {/* Hover overlay with emoji */}
                    <motion.div
                      className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      whileHover={{ opacity: 1 }}
                    >
                      <span className="text-6xl">📷</span>
                    </motion.div>
                  </div>

                  {/* Caption */}
                  <div className="mt-3 text-center">
                    <p className="text-lg text-snow-white font-medium">
                      {photo.caption}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Instructions for customization */}
        <motion.div
          className="bg-christmas-green/20 border-4 border-christmas-green rounded-2xl p-6 mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className="text-center">
            <div className="text-4xl mb-3">💡</div>
            <h3 className="text-2xl font-bold text-christmas-gold mb-2">
              Customize Your Gallery!
            </h3>
            <p className="text-lg text-snow-white">
              Replace the placeholder images with your own party photos!
              <br />
              <span className="text-sm text-snow-white/70 italic">
                (Update the PHOTOS array in src/pages/Gallery.jsx with your image URLs)
              </span>
            </p>
          </div>
        </motion.div>

        {/* Navigation buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Link to="/">
            <motion.button
              className="btn-festive text-xl w-full sm:w-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🏠 Back to Home
            </motion.button>
          </Link>

          <Link to="/rules">
            <motion.button
              className="btn-festive-green text-xl w-full sm:w-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              📜 View Rules
            </motion.button>
          </Link>
        </motion.div>

        {/* Fun footer message */}
        <motion.div
          className="text-center mt-12 pt-8 border-t-2 border-christmas-gold/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <p className="text-sm text-snow-white/70 italic">
            "What happens at White Elephant, gets documented and shared forever!" 📸✨
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Gallery;
