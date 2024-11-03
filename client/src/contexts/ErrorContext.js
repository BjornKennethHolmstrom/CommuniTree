import React, { createContext, useContext, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const toast = useToast();
  const { t } = useTranslation();

  const showError = (message) => {
    setError(message);
    toast({
      title: t('errorContext.errorOccurred'),
      description: message,
      status: "error",
      duration: 5000,
      isClosable: true,
      closeButtonText: t('errorContext.dismiss'),
    });
  };

  const clearError = () => setError(null);

  return (
    <ErrorContext.Provider value={{ error, showError, clearError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};
