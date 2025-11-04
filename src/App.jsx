import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AccessProvider, useAccess } from './context/AccessContext';
import Home from './pages/Home';
import Rules from './pages/Rules';
import RSVP from './pages/RSVP';
import AdminGuestList from './pages/AdminGuestList';
import AccessGate from './pages/AccessGate';
import Snowfall from './components/Snowfall';
import MusicToggle from './components/MusicToggle';
import SleighAnimation from './components/SleighAnimation';
import ThemeSwitcher from './components/ThemeSwitcher';
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

  return (
    <>
      {/* Snowfall animation - visible on all pages, color changes per theme */}
      <Snowfall color={theme.effects.particleColor} />
      
      {/* Sleigh animation - only for White Elephant theme */}
      {isElephantTheme && <SleighAnimation />}
      
      {/* Theme switcher - fixed position top left */}
      <ThemeSwitcher />
      
      {/* Background music toggle - fixed position top right */}
      <MusicToggle />
      
      {/* Main content routes */}
      <Routes>
        <Route path="/access" element={<AccessGate />} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/rules" element={<ProtectedRoute><Rules /></ProtectedRoute>} />
        <Route path="/rsvp" element={<ProtectedRoute><RSVP /></ProtectedRoute>} />
        <Route path="/admin/guest-list" element={<ProtectedRoute><AdminGuestList /></ProtectedRoute>} />
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
