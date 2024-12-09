import React from 'react';
import PropTypes from 'prop-types';
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
      aria-describedby={description ? `desc-${title}` : undefined}
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

AccessibleCard.propTypes = {
  // Required props
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired, // translation key for the card title

  // Optional props
  description: PropTypes.string, // translation key for card description
  role: PropTypes.string,
  
  // Any other valid Box props from Chakra UI
  ...Box.propTypes
};

AccessibleCard.defaultProps = {
  description: undefined,
  role: 'article'
};
