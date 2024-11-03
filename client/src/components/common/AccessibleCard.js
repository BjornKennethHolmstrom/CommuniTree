// AccessibleCard.js
import React from 'react';
import { Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export const AccessibleCard = ({
  children,
  title,
  description,
  role = "article",
  ...props
}) => {
  const { t } = useTranslation();

  return (
    <Box
      role={role}
      aria-labelledby={`title-${title}`}
      aria-describedby={`desc-${title}`}
      tabIndex={0}
      borderWidth="1px"
      borderRadius="lg"
      p={4}
      {...props}
    >
      <span id={`title-${title}`} className="sr-only">
        {t(title)}
      </span>
      {description && (
        <span id={`desc-${title}`} className="sr-only">
          {t(description)}
        </span>
      )}
      {children}
    </Box>
  );
};
