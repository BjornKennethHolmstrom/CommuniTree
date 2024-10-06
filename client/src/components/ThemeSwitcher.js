import React, { useEffect, useState } from 'react';
import { Select } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import api from '../api';

const weatherThemes = {
  Clear: 'sunny',
  Clouds: 'cloudy',
  Rain: 'rainy',
  Snow: 'snowy',
  Thunderstorm: 'stormy'
};

const ThemeSwitcher = ({ onThemeChange }) => {
  const { t } = useTranslation();
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [weatherTheme, setWeatherTheme] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await api.get(`/api/communities/${currentCommunityId}/weather`);
        const weatherData = response.data;
        const theme = weatherThemes[weatherData.weather] || 'default';
        setWeatherTheme(theme);
        onThemeChange(theme);
      } catch (error) {
        console.error('Error fetching weather:', error);
      }
    };

    fetchWeather();
    // Set up an interval to fetch weather every 30 minutes
    const intervalId = setInterval(fetchWeather, 30 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleThemeChange = (event) => {
    const newTheme = event.target.value;
    setSelectedTheme(newTheme);
    onThemeChange(newTheme);
  };

  return (
    <Select value={selectedTheme} onChange={handleThemeChange}>
      <option value="default">{t('themes.default')}</option>
      <option value="dark">{t('themes.darkMode')}</option>
      <option value="light">{t('themes.lightMode')}</option>
      {weatherTheme && (
        <option value={weatherTheme}>
          {t(`themes.${weatherTheme}`)}
        </option>
      )}
    </Select>
  );
};

export default ThemeSwitcher;
