import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Rules from './pages/Rules';
import Gallery from './pages/Gallery';
import Snowfall from './components/Snowfall';
import MusicToggle from './components/MusicToggle';

/**
 * Main App Component
 * Sets up routing for the White Elephant Party website
 * Includes persistent snowfall animation and background music toggle
 */
function App() {
  return (
    <Router>
      {/* Snowfall animation visible on all pages */}
      <Snowfall />
      
      {/* Background music toggle - fixed position in top right */}
      <MusicToggle />
      
      {/* Main content routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/gallery" element={<Gallery />} />
      </Routes>
    </Router>
  );
}

export default App;
