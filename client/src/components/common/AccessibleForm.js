// AccessibleForm.js
import React from 'react';
import { Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export const AccessibleForm = ({
  children,
  formTitle,
  description,
  onSubmit,
  ...props
}) => {
  const { t } = useTranslation();

  return (
    <Box
      as="form"
      role="form"
      aria-labelledby={`form-${formTitle}`}
      onSubmit={onSubmit}
      {...props}
    >
      <h2 id={`form-${formTitle}`} className="sr-only">
        {t(formTitle)}
      </h2>
      {description && (
        <span className="sr-only">
          {t(description)}
        </span>
      )}
      {children}
    </Box>
  );
};
