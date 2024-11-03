// AccessibleButton.js
import React from 'react';
import { Button } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export const AccessibleButton = ({ 
  children, 
  action,
  description,
  isLoading,
  ...props 
}) => {
  const { t } = useTranslation();
  
  return (
    <Button
      aria-label={t(action)}
      aria-description={description ? t(description) : undefined}
      role="button"
      data-testid={`button-${action}`}
      isLoading={isLoading}
      {...props}
    >
      {children}
      <span className="sr-only">{t(action)}</span>
    </Button>
  );
};
