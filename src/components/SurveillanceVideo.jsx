import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * SurveillanceVideo Component
 * Renders video with security camera styling
 * - Timestamp overlay
 * - REC indicator
 * - Scan lines effect
 * - VHS/surveillance filters
 */
const SurveillanceVideo = ({ 
  src, 
  camera = "CAM-01", 
  location = "",
  className = "",
  showTimestamp = true,
  showRec = true,
  style = {}
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update timestamp every second for realism
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimestamp = () => {
    const year = currentTime.getFullYear();
    const month = String(currentTime.getMonth() + 1).padStart(2, '0');
    const day = String(currentTime.getDate()).padStart(2, '0');
    const hours = String(currentTime.getHours()).padStart(2, '0');
    const minutes = String(currentTime.getMinutes()).padStart(2, '0');
    const seconds = String(currentTime.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      {/* Video with surveillance filter */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
        style={{
          filter: 'grayscale(0.7) contrast(1.2) brightness(0.85)',
        }}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support video playback.
      </video>

      {/* REC Indicator - Top Left */}
      {showRec && (
        <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/90 px-3 py-1.5 rounded border border-red-500/30">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          <span className="text-red-500 font-mono text-xs font-bold tracking-wider">REC</span>
        </div>
      )}

      {/* Timestamp & Camera ID - Top Right */}
      {showTimestamp && (
        <div className="absolute top-3 right-3 bg-black/90 border border-green-500/50 rounded">
          <div className="px-3 py-1.5 space-y-0.5">
            <div className="text-green-400 font-mono text-xs font-bold tracking-wider">
              [{camera}]
            </div>
            {location && (
              <div className="text-green-400/70 font-mono text-[10px]">
                {location}
              </div>
            )}
            <div className="text-green-400 font-mono text-xs">
              {formatTimestamp()}
            </div>
          </div>
        </div>
      )}

      {/* Scan Lines Effect */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
          animation: 'scan 8s linear infinite'
        }}
      />

      {/* Vignette Effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)'
        }}
      />
    </div>
  );
};

SurveillanceVideo.propTypes = {
  src: PropTypes.string.isRequired,
  camera: PropTypes.string,
  location: PropTypes.string,
  className: PropTypes.string,
  showTimestamp: PropTypes.bool,
  showRec: PropTypes.bool,
  style: PropTypes.object
};

export default SurveillanceVideo;
