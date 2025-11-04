import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Snowfall from '../components/Snowfall';
import ClassifiedPhoto from '../components/ClassifiedPhoto';
import { Link } from 'react-router-dom';

/**
 * Gallery Component
 * Showcase of last year's White Elephant Party
 * Features:
 * - Surveillance-style photo/video grid
 * - Lightbox modal for full-size viewing
 * - Classified file aesthetic
 */
const Gallery = () => {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'photos', 'videos'

  // Surveillance-themed media with camera IDs and timestamps
  // Note: Files can be in /gallery/ or /media/heist/ or /media/elephant/
  // The Gallery component will display all party media
  const media = [
    {
      id: 1,
      type: 'photo',
      src: '/gallery/2024-cam1.jpg',
      thumbnail: '/gallery/thumbs/2024-cam1.jpg',
      camera: 'CAM-01',
      timestamp: '2024-12-13 19:23:17',
      location: 'Gift Exchange Area',
      caption: 'Gift Unwrapping Protocol - Subject A',
    },
    {
      id: 2,
      type: 'photo',
      src: '/gallery/2024-cam2.jpg',
      thumbnail: '/gallery/thumbs/2024-cam2.jpg',
      camera: 'CAM-02',
      timestamp: '2024-12-13 19:47:42',
      location: 'Main Party Hall',
      caption: 'Group Assembly - All Agents Present',
    },
    {
      id: 3,
      type: 'video',
      src: '/gallery/2024-cam3.mp4',
      thumbnail: '/gallery/thumbs/2024-cam3-thumb.jpg',
      camera: 'CAM-03',
      timestamp: '2024-12-13 20:15:08',
      location: 'Refreshment Station',
      caption: 'Cookie Acquisition in Progress',
    },
    {
      id: 4,
      type: 'photo',
      src: '/gallery/2024-cam4.jpg',
      thumbnail: '/gallery/thumbs/2024-cam4.jpg',
      camera: 'CAM-04',
      timestamp: '2024-12-13 20:33:55',
      location: 'Gift Exchange Area',
      caption: 'Gift Steal Maneuver - Successful',
    },
    {
      id: 5,
      type: 'photo',
      src: '/gallery/2024-cam5.jpg',
      thumbnail: '/gallery/thumbs/2024-cam5.jpg',
      camera: 'CAM-01',
      timestamp: '2024-12-13 21:02:31',
      location: 'Main Party Hall',
      caption: 'Mission Completion - Team Photo',
    },
    {
      id: 6,
      type: 'video',
      src: '/gallery/2024-cam6.mp4',
      thumbnail: '/gallery/thumbs/2024-cam6-thumb.jpg',
      camera: 'CAM-02',
      timestamp: '2024-12-13 21:18:19',
      location: 'Exit Corridor',
      caption: 'Subjects Departing - Operation Complete',
    },
  ];

  // NOTE: When you add your actual media files, update this array to match
  // the number of files you have. The import-media.sh script will help with this!

  const filteredMedia = filter === 'all' 
    ? media 
    : media.filter(m => m.type === (filter === 'photos' ? 'photo' : 'video'));

  const handleMediaClick = (item) => {
    setSelectedMedia(item);
  };

  const handleClose = () => {
    setSelectedMedia(null);
  };

  const handleNext = () => {
    const currentIndex = filteredMedia.findIndex(m => m.id === selectedMedia.id);
    const nextIndex = (currentIndex + 1) % filteredMedia.length;
    setSelectedMedia(filteredMedia[nextIndex]);
  };

  const handlePrev = () => {
    const currentIndex = filteredMedia.findIndex(m => m.id === selectedMedia.id);
    const prevIndex = currentIndex === 0 ? filteredMedia.length - 1 : currentIndex - 1;
    setSelectedMedia(filteredMedia[prevIndex]);
  };

  return (
    <div className="relative min-h-screen">
      <Snowfall />
      
      <div className="relative min-h-screen p-6 py-20 z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-3 mb-4 bg-black/80 px-6 py-3 rounded-full border border-red-500/50">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              <span className="text-red-500 font-mono text-xs font-bold tracking-wider">CLASSIFIED ARCHIVE</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl mb-4 font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-300 to-emerald-400">
              � Surveillance Footage
            </h1>
            <p className="text-xl text-slate-300 mb-2">
              Operation Santa's Manifest - December 13, 2024
            </p>
            <p className="text-sm text-slate-500 font-mono">
              [SECURITY CLEARANCE: LEVEL 3 - PARTY PARTICIPANTS ONLY]
            </p>
            
            {/* Filter Buttons */}
            <div className="flex gap-3 justify-center mt-8">
              {['all', 'photos', 'videos'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-6 py-2 rounded-full font-mono text-sm transition-all ${
                    filter === f
                      ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30 border border-cyan-400'
                      : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 border border-slate-700'
                  }`}
                >
                  {f === 'all' ? '[ALL CAMERAS]' : f === 'photos' ? '[STILLS]' : '[VIDEO]'}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Media Grid with Surveillance Styling */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {filteredMedia.map((item, index) => (
              <motion.div
                key={item.id}
                className="relative group cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                onClick={() => handleMediaClick(item)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {item.type === 'photo' ? (
                  <ClassifiedPhoto
                    src={item.thumbnail}
                    camera={item.camera}
                    timestamp={item.timestamp}
                    location={item.location}
                    caption={item.caption}
                    className="aspect-video"
                  />
                ) : (
                  <div className="relative">
                    <ClassifiedPhoto
                      src={item.thumbnail}
                      camera={item.camera}
                      timestamp={item.timestamp}
                      location={item.location}
                      caption={item.caption}
                      className="aspect-video"
                    />
                    {/* Video Play Indicator */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
                      <div className="w-16 h-16 rounded-full bg-cyan-500/90 flex items-center justify-center border-2 border-cyan-300 shadow-lg shadow-cyan-500/50">
                        <div className="w-0 h-0 border-l-[16px] border-l-black border-y-[10px] border-y-transparent ml-1" />
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Empty State */}
          {filteredMedia.length === 0 && (
            <motion.div
              className="glass-card rounded-3xl p-12 text-center border border-red-500/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-6xl mb-4">�</div>
              <div className="text-slate-400 text-xl font-mono">
                [NO {filter.toUpperCase()} FOOTAGE FOUND]
              </div>
              <div className="text-slate-600 text-sm mt-2">
                Classified files may have been deleted
              </div>
            </motion.div>
          )}

          {/* Back Button */}
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Link to="/">
              <button className="btn-festive text-lg">
                ← Back to Home
              </button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 text-white text-4xl hover:text-red-400 transition-colors z-10"
            >
              ×
            </button>

            {/* Previous Button */}
            {filteredMedia.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                className="absolute left-6 text-white text-6xl hover:text-emerald-400 transition-colors z-10"
              >
                ‹
              </button>
            )}

            {/* Next Button */}
            {filteredMedia.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="absolute right-6 text-white text-6xl hover:text-emerald-400 transition-colors z-10"
              >
                ›
              </button>
            )}

            {/* Media Content */}
            <motion.div
              className="max-w-6xl max-h-[90vh] w-full"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              {selectedMedia.type === 'photo' ? (
                <img
                  src={selectedMedia.src}
                  alt={selectedMedia.caption}
                  className="w-full h-full object-contain rounded-lg"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect fill="%23334155" width="800" height="600"/%3E%3Ctext fill="%2394a3b8" font-family="sans-serif" font-size="32" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3E🎄 Image Not Found%3C/text%3E%3C/svg%3E';
                  }}
                />
              ) : (
                <video
                  src={selectedMedia.src}
                  controls
                  autoPlay
                  className="w-full h-full object-contain rounded-lg"
                >
                  Your browser does not support video playback.
                </video>
              )}
              
              {/* Caption */}
              <div className="text-center mt-4 text-white text-xl font-semibold">
                {selectedMedia.caption}
              </div>
            </motion.div>

            {/* Instructions */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-slate-400 text-sm font-mono">
              {filteredMedia.length > 1 && <span>← → to navigate | </span>}
              Click outside or ESC to close
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard Navigation */}
      <div className="hidden">
        {selectedMedia && (
          <div
            onKeyDown={(e) => {
              if (e.key === 'Escape') handleClose();
              if (e.key === 'ArrowRight') handleNext();
              if (e.key === 'ArrowLeft') handlePrev();
            }}
            tabIndex={0}
          />
        )}
      </div>
    </div>
  );
};

export default Gallery;
