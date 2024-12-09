import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Select, useColorModeValue } from '@chakra-ui/react';

const LanguageSwitcher = ({
  size = "sm",
  variant = "filled",
  availableLanguages = [
    { code: 'en', label: 'English' },
    { code: 'sv', label: 'Svenska' }
  ],
  onChange
}) => {
  const { i18n } = useTranslation();
  
  const bg = useColorModeValue('gray.100', 'gray.700');
  const color = useColorModeValue('gray.800', 'white');
  const hoverBg = useColorModeValue('gray.200', 'gray.600');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleLanguageChange = (event) => {
    const newLang = event.target.value;
    i18n.changeLanguage(newLang);
    if (onChange) {
      onChange(newLang);
    }
  };

  return (
    <Select
      onChange={handleLanguageChange}
      value={i18n.language}
      width="auto"
      size={size}
      variant={variant}
      bg={bg}
      color={color}
      borderColor={borderColor}
      _hover={{ bg: hoverBg }}
    >
      {availableLanguages.map(lang => (
        <option key={lang.code} value={lang.code}>
          {lang.label}
        </option>
      ))}
    </Select>
  );
};

LanguageSwitcher.propTypes = {
  // Optional styling props
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']),
  variant: PropTypes.oneOf(['outline', 'filled', 'flushed', 'unstyled']),
  
  // Available languages configuration
  availableLanguages: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ),
  
  // Optional callback when language changes
  onChange: PropTypes.func
};

LanguageSwitcher.defaultProps = {
  size: 'sm',
  variant: 'filled',
  availableLanguages: [
    { code: 'en', label: 'English' },
    { code: 'sv', label: 'Svenska' }
  ],
  onChange: undefined
};

export default LanguageSwitcher;
