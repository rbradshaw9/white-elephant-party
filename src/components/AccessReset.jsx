import { useAccess } from '../context/AccessContext';
import { useNavigate } from 'react-router-dom';

/**
 * AccessReset Component
 * Dev tool to reset access and return to gate
 * Only shows in development mode
 */
const AccessReset = () => {
  const { revokeAccess, hasAccess } = useAccess();
  const navigate = useNavigate();

  if (process.env.NODE_ENV !== 'development' || !hasAccess) {
    return null;
  }

  const handleReset = () => {
    if (window.confirm('Reset access and return to terminal?')) {
      revokeAccess();
      navigate('/access');
    }
  };

  return (
    <button
      onClick={handleReset}
      className="fixed bottom-4 right-4 bg-red-500/80 hover:bg-red-600 text-white px-3 py-2 rounded text-xs font-mono shadow-lg z-50 backdrop-blur"
      title="DEV: Reset access and return to gate"
    >
      🔓 Reset Access
    </button>
  );
};

export default AccessReset;
