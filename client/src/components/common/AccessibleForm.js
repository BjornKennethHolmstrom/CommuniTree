import React from 'react';
import PropTypes from 'prop-types';
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

AccessibleForm.propTypes = {
  // Required props
  children: PropTypes.node.isRequired,
  formTitle: PropTypes.string.isRequired, // translation key for form title
  onSubmit: PropTypes.func.isRequired,

  // Optional props
  description: PropTypes.string, // translation key for form description
  
  // Any other valid Box props from Chakra UI
  ...Box.propTypes
};

AccessibleForm.defaultProps = {
  description: undefined
};
