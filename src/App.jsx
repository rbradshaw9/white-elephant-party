import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AccessProvider, useAccess } from './context/AccessContext';
import Home from './pages/Home';
import Rules from './pages/Rules';
import RSVP from './pages/RSVP';
import AdminGuestList from './pages/AdminGuestList';
import AgentRoster from './pages/AgentRoster';
import AccessGate from './pages/AccessGate';
import Gallery from './pages/Gallery';
import AgentCard from './pages/AgentCard';
import HQ from './pages/HQ';
import Snowfall from './components/Snowfall';
import MusicToggle from './components/MusicToggle';
import SleighAnimation from './components/SleighAnimation';
import ThemeSwitcher from './components/ThemeSwitcher';
import AccessReset from './components/AccessReset';
import BottomNav from './components/BottomNav';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import EVENT_CONFIG from './config/config';

/**
 * Protected Route Component
 * Redirects to access gate if user doesn't have access
 */
const ProtectedRoute = ({ children }) => {
  const { hasAccess, isLoading } = useAccess();
  
  // Don't redirect if access gate is disabled
  if (!EVENT_CONFIG.accessGate.enabled || !EVENT_CONFIG.accessGate.requireCode) {
    return children;
  }
  
  if (isLoading) {
    return <div className="min-h-screen bg-black" />; // Loading screen
  }
  
  return hasAccess ? children : <Navigate to="/access" replace />;
};

/**
 * App Content Component
 * Contains theme-aware components
 */
const AppContent = () => {
  const { theme, isElephantTheme } = useTheme();
  const location = useLocation();
  const isAccessGate = location.pathname === '/access';

  return (
    <>
      {/* Snowfall animation - visible on ALL pages including access gate */}
      <Snowfall color={isAccessGate ? '#4ade80' : theme.effects.particleColor} />
      
      {/* Sleigh animation - only for White Elephant theme */}
      {isElephantTheme && !isAccessGate && <SleighAnimation />}
      
      {/* Theme switcher - fixed position top left (not on access gate) */}
      {!isAccessGate && <ThemeSwitcher />}
      
      {/* Background music toggle - fixed position top right (not on access gate) */}
      {!isAccessGate && <MusicToggle />}
      
      {/* Bottom navigation bar */}
      <BottomNav />
      
      {/* PWA install prompt */}
      <PWAInstallPrompt />
      
      {/* Dev tool: Reset access (development only) */}
      <AccessReset />
      
      {/* Main content routes */}
      <Routes>
        <Route path="/access" element={<AccessGate />} />
        <Route path="/" element={<Home />} />
        <Route path="/rules" element={<ProtectedRoute><Rules /></ProtectedRoute>} />
        <Route path="/rsvp" element={<ProtectedRoute><RSVP /></ProtectedRoute>} />
        <Route path="/hq" element={<HQ />} />
        <Route path="/roster" element={<AgentRoster />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/agent/:codename" element={<AgentCard />} />
        <Route path="/admin/guest-list" element={<AdminGuestList />} />
      </Routes>
    </>
  );
};

/**
 * Main App Component
 * Sets up routing and theme context for the White Elephant Party website
 * Supports dual themes: White Elephant Party & The Great Gift Heist
 * Includes access gate protection for heist theme
 */
function App() {
  return (
    <ThemeProvider>
      <AccessProvider>
        <Router>
          <AppContent />
        </Router>
      </AccessProvider>
    </ThemeProvider>
  );
}

export default App;
