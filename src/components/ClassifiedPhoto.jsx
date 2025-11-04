import PropTypes from 'prop-types';

/**
 * ClassifiedPhoto Component
 * Renders photo with security camera/classified file styling
 * - Camera ID and timestamp
 * - Classified watermark
 * - Grayscale with hover color
 * - Optional caption
 */
const ClassifiedPhoto = ({ 
  src, 
  camera = "CAM-01",
  timestamp,
  location = "",
  caption,
  classified = true,
  className = "",
  onError 
}) => {
  const defaultError = (e) => {
    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23334155" width="400" height="300"/%3E%3Ctext fill="%2394a3b8" font-family="monospace" font-size="16" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3E[FOOTAGE CORRUPTED]%3C/text%3E%3C/svg%3E';
  };

  return (
    <div className={`relative overflow-hidden rounded-lg group ${className}`}>
      {/* Photo with grayscale filter */}
      <img 
        src={src} 
        alt={caption || `Camera ${camera} footage`}
        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500 ease-in-out"
        onError={onError || defaultError}
      />

      {/* Camera Info - Top Left */}
      <div className="absolute top-2 left-2 bg-black/90 border border-green-500/50 rounded z-10">
        <div className="px-2 py-1 space-y-0.5">
          <div className="text-green-400 font-mono text-xs font-bold tracking-wider">
            [{camera}]
          </div>
          {location && (
            <div className="text-green-400/70 font-mono text-[10px]">
              {location}
            </div>
          )}
          {timestamp && (
            <div className="text-green-400 font-mono text-[10px]">
              {timestamp}
            </div>
          )}
        </div>
      </div>

      {/* Classified Watermark */}
      {classified && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div 
            className="text-red-500 text-2xl md:text-4xl font-bold transform rotate-45 border-4 border-red-500 px-6 md:px-10 py-2 md:py-3 opacity-20 group-hover:opacity-10 transition-opacity"
            style={{ letterSpacing: '0.2em' }}
          >
            CLASSIFIED
          </div>
        </div>
      )}

      {/* Caption Overlay - Bottom */}
      {caption && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-white text-sm font-mono">
            SUBJECT: {caption}
          </p>
        </div>
      )}

      {/* Scan Lines Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)'
        }}
      />

      {/* Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.3) 100%)'
        }}
      />
    </div>
  );
};

ClassifiedPhoto.propTypes = {
  src: PropTypes.string.isRequired,
  camera: PropTypes.string,
  timestamp: PropTypes.string,
  location: PropTypes.string,
  caption: PropTypes.string,
  classified: PropTypes.bool,
  className: PropTypes.string,
  onError: PropTypes.func
};

export default ClassifiedPhoto;
