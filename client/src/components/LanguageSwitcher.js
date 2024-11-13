import React from 'react';
import { useTranslation } from 'react-i18next';
import { Select, useColorModeValue } from '@chakra-ui/react';

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  
  // Use Chakra's color mode values for consistent theming
  const bg = useColorModeValue('gray.100', 'gray.700');
  const color = useColorModeValue('gray.800', 'white');
  const hoverBg = useColorModeValue('gray.200', 'gray.600');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const changeLanguage = (event) => {
    const lng = event.target.value;
    i18n.changeLanguage(lng);
  };

  return (
    <Select
      onChange={changeLanguage}
      value={i18n.language}
      width="auto"
      size="sm"
      bg={bg}
      color={color}
      borderColor={borderColor}
      _hover={{ bg: hoverBg }}
    >
      <option value="en">English</option>
      <option value="sv">Svenska</option>
    </Select>
  );
}

export default LanguageSwitcher;
