import React from 'react';
import PropTypes from 'prop-types';
import { Select, useColorMode } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';

const ThemeSwitcher = ({ 
  size = "sm",
  variant = "filled",
  showColorModeOptions = true,
  availableThemes = ['default', 'forest', 'ocean', 'desert']
}) => {
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
      size={size}
      variant={variant}
      width="auto"
    >
      {availableThemes.map(theme => (
        <option key={theme} value={theme}>
          {t(`themes.${theme}`)}
        </option>
      ))}
      {showColorModeOptions && (
        <>
          <option value="light">{t('themes.lightMode')}</option>
          <option value="dark">{t('themes.darkMode')}</option>
        </>
      )}
    </Select>
  );
};

ThemeSwitcher.propTypes = {
  // Optional styling props
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']),
  variant: PropTypes.oneOf(['outline', 'filled', 'flushed', 'unstyled']),
  
  // Optional feature flags
  showColorModeOptions: PropTypes.bool,
  
  // Available themes configuration
  availableThemes: PropTypes.arrayOf(PropTypes.string)
};

ThemeSwitcher.defaultProps = {
  size: 'sm',
  variant: 'filled',
  showColorModeOptions: true,
  availableThemes: ['default', 'forest', 'ocean', 'desert']
};

export default ThemeSwitcher;
