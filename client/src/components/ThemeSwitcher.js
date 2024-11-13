import React from 'react';
import { Select, useColorMode } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';

const ThemeSwitcher = () => {
  const { t } = useTranslation();
  const { colorMode, toggleColorMode } = useColorMode();
  const { themeName, setThemeName } = useTheme();

  const handleThemeChange = (event) => {
    const newTheme = event.target.value;
    if (newTheme === 'dark' || newTheme === 'light') {
      if (colorMode !== newTheme) {
        toggleColorMode();
      }
    } else {
      setThemeName(newTheme);
    }
  };

  return (
    <Select 
      value={colorMode === 'dark' ? 'dark' : (colorMode === 'light' ? 'light' : themeName)} 
      onChange={handleThemeChange}
      size="sm"
      width="auto"
    >
      <option value="default">{t('themes.default')}</option>
      <option value="light">{t('themes.lightMode')}</option>
      <option value="dark">{t('themes.darkMode')}</option>
      <option value="forest">{t('themes.forest')}</option>
      <option value="ocean">{t('themes.ocean')}</option>
      <option value="desert">{t('themes.desert')}</option>
    </Select>
  );
};

export default ThemeSwitcher;
