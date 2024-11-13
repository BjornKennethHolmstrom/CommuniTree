import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorMode } from '@chakra-ui/react';
import { getTheme } from '../theme/locationThemes';
import { getWeather, getLocation } from '../utils/apiUtils';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { colorMode } = useColorMode();
  const [themeName, setThemeName] = useState(() => {
    const savedTheme = localStorage.getItem('userTheme');
    return savedTheme || 'default';
  });
  const [weatherTheme, setWeatherTheme] = useState(null);

  // Fetch weather and set weather theme
  useEffect(() => {
    const fetchWeatherTheme = async () => {
      try {
        const coords = await getLocation();
        const weatherData = await getWeather(coords.latitude, coords.longitude);
        
        // Map weather conditions to themes
        const weatherToTheme = {
          'Clear': 'sunny',
          'Clouds': 'cloudy',
          'Rain': 'rainy',
          'Snow': 'snowy',
          'Thunderstorm': 'stormy'
        };
        
        const newWeatherTheme = weatherToTheme[weatherData.weather[0].main] || null;
        setWeatherTheme(newWeatherTheme);
      } catch (error) {
        console.error('Error fetching weather theme:', error);
        setWeatherTheme(null);
      }
    };

    fetchWeatherTheme();
    // Refresh weather theme every 30 minutes
    const intervalId = setInterval(fetchWeatherTheme, 30 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Combine user theme with weather theme
  const computedTheme = weatherTheme 
    ? getTheme(themeName, colorMode, weatherTheme)
    : getTheme(themeName, colorMode);

  const value = {
    themeName,
    setThemeName,
    weatherTheme,
    theme: computedTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
