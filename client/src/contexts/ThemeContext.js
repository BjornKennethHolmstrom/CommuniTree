import React, { createContext, useState, useContext, useEffect } from 'react';
import { getTheme, themes } from '../theme/locationThemes';
import useLocationTheme from '../hooks/useLocationTheme';
import { useColorMode } from '@chakra-ui/react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const locationTheme = useLocationTheme();
  const { colorMode } = useColorMode();
  const [themeName, setThemeName] = useState(() => {
    const savedTheme = localStorage.getItem('userTheme');
    return savedTheme && themes[savedTheme] ? savedTheme : 'default';
  });

  useEffect(() => {
    if (!localStorage.getItem('userTheme') && themes[locationTheme]) {
      setThemeName(locationTheme);
    }
  }, [locationTheme]);

  useEffect(() => {
    localStorage.setItem('userTheme', themeName);
  }, [themeName]);

  const theme = getTheme(themeName, colorMode);

  const value = {
    themeName,
    setThemeName,
    theme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
