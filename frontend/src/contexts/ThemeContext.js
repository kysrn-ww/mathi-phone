import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [showSnow, setShowSnow] = useState(() => {
    const saved = localStorage.getItem('showSnow');
    return saved ? saved === 'true' : true; // Default to true
  });

  useEffect(() => {
    localStorage.setItem('showSnow', showSnow);
  }, [showSnow]);

  const toggleSnow = () => setShowSnow(!showSnow);

  return (
    <ThemeContext.Provider value={{ showSnow, toggleSnow }}>
      {children}
    </ThemeContext.Provider>
  );
};