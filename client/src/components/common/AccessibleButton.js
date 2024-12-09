import React from 'react';
import PropTypes from 'prop-types';
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

AccessibleButton.propTypes = {
  // Required props
  children: PropTypes.node.isRequired,
  action: PropTypes.string.isRequired, // translation key for the button action
  
  // Optional props
  description: PropTypes.string, // translation key for additional description
  isLoading: PropTypes.bool,
  
  // Any other valid Button props from Chakra UI
  ...Button.propTypes
};

AccessibleButton.defaultProps = {
  description: undefined,
  isLoading: false
};
