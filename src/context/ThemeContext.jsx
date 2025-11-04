import { createContext, useContext, useState, useEffect } from 'react';
import whiteElephantTheme from '../themes/whiteElephantTheme';
import greatGiftHeistTheme from '../themes/greatGiftHeistTheme';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Check for stored theme preference or default to white elephant
  const [currentTheme, setCurrentTheme] = useState(() => {
    const stored = localStorage.getItem('partyTheme');
    return stored === 'great-gift-heist' ? greatGiftHeistTheme : whiteElephantTheme;
  });

  // Update localStorage and document when theme changes
  useEffect(() => {
    localStorage.setItem('partyTheme', currentTheme.slug);
    
    // Update document title and meta tags
    document.title = `${currentTheme.name} - December 13, 2025`;
    
    // Update theme color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', currentTheme.palette.background);
    }
    
    // Apply font to document root
    document.documentElement.style.setProperty('--font-display', currentTheme.fonts.display);
    document.documentElement.style.setProperty('--font-body', currentTheme.fonts.body);
  }, [currentTheme]);

  const toggleTheme = () => {
    setCurrentTheme(prev => 
      prev.slug === 'white-elephant' ? greatGiftHeistTheme : whiteElephantTheme
    );
  };

  const setTheme = (themeName) => {
    if (themeName === 'white-elephant' || themeName === 'elephant') {
      setCurrentTheme(whiteElephantTheme);
    } else if (themeName === 'great-gift-heist' || themeName === 'heist') {
      setCurrentTheme(greatGiftHeistTheme);
    }
  };

  const value = {
    theme: currentTheme,
    toggleTheme,
    setTheme,
    isHeistTheme: currentTheme.slug === 'great-gift-heist',
    isElephantTheme: currentTheme.slug === 'white-elephant',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
