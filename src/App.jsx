import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Home from './pages/Home';
import Rules from './pages/Rules';
import RSVP from './pages/RSVP';
import AdminGuestList from './pages/AdminGuestList';
import Snowfall from './components/Snowfall';
import MusicToggle from './components/MusicToggle';
import SleighAnimation from './components/SleighAnimation';
import ThemeSwitcher from './components/ThemeSwitcher';

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
        <Route path="/" element={<Home />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/rsvp" element={<RSVP />} />
        <Route path="/admin/guest-list" element={<AdminGuestList />} />
      </Routes>
    </>
  );
};

/**
 * Main App Component
 * Sets up routing and theme context for the White Elephant Party website
 * Supports dual themes: White Elephant Party & The Great Gift Heist
 */
function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
