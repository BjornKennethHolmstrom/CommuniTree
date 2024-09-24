import React from 'react';
import { useTranslation } from 'react-i18next';
import { Select } from '@chakra-ui/react';

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (event) => {
    const lng = event.target.value;
    i18n.changeLanguage(lng);
  };

  return (
    <Select
      onChange={changeLanguage}
      value={i18n.language}
      width="120px"
      color="black"
      bg="white"
      _hover={{ bg: "gray.100" }}
    >
      <option value="en">English</option>
      <option value="sv">Svenska</option>
    </Select>
  );
}

export default LanguageSwitcher;
