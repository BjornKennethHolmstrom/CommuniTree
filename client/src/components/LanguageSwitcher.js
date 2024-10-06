import React from 'react';
import { useTranslation } from 'react-i18next';
import { Select } from '@chakra-ui/react';
import { useTheme } from '../contexts/ThemeContext';

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { theme } = useTheme();

  const changeLanguage = (event) => {
    const lng = event.target.value;
    i18n.changeLanguage(lng);
  };

  return (
    <Select
      onChange={changeLanguage}
      value={i18n.language}
      width="auto"
      color={theme.colors.brand[700]}
      bg={theme.colors.brand[50]}
      _hover={{ bg: theme.colors.brand[100] }}
      borderColor={theme.colors.brand[500]}
    >
      <option value="en">English</option>
      <option value="sv">Svenska</option>
    </Select>
  );
}

export default LanguageSwitcher;
