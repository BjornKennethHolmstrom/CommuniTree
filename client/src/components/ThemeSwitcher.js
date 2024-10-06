import React from 'react';
import { Select, Button, HStack, useColorMode } from '@chakra-ui/react';
import { useTheme } from '../contexts/ThemeContext';
import { themes } from '../theme/locationThemes';
import { useTranslation } from 'react-i18next';

const ThemeSwitcher = () => {
  const { themeName, setThemeName, theme } = useTheme();
  const { colorMode, toggleColorMode } = useColorMode();
  const { t } = useTranslation();

  return (
    <HStack spacing={2}>
      <Select
        value={themeName}
        onChange={(e) => setThemeName(e.target.value)}
        width="auto"
        color={theme.colors.brand[700]}
        bg={theme.colors.brand[50]}
        _hover={{ bg: theme.colors.brand[100] }}
        borderColor={theme.colors.brand[500]}
      >
        {Object.keys(themes).filter(theme => theme !== 'darkMode').map((theme) => (
          <option key={theme} value={theme}>
            {t(`themes.${theme}`)}
          </option>
        ))}
      </Select>
      <Button
        onClick={toggleColorMode}
        bg={theme.colors.brand[500]}
        color={theme.colors.brand[50]}
        _hover={{ bg: theme.colors.brand[600] }}
      >
        {colorMode === 'light' ? t('themes.darkMode') : t('themes.lightMode')}
      </Button>
    </HStack>
  );
};

export default ThemeSwitcher;
