import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Link,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';

const ForgotPassword = ({ onSubmitSuccess }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.msg || 'Error requesting password reset');
      }

      setIsSubmitted(true);
      if (onSubmitSuccess) {
        onSubmitSuccess(email);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Box maxW="md" mx="auto" mt={8} p={6} borderWidth={1} borderRadius="lg">
        <Alert
          status="success"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="200px"
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            {t('forgotPassword.checkEmail')}
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            {t('forgotPassword.resetLinkSent')}
          </AlertDescription>
        </Alert>
        <Link as={RouterLink} to="/login" color="blue.500" display="block" mt={4} textAlign="center">
          {t('forgotPassword.backToLogin')}
        </Link>
      </Box>
    );
  }

  return (
    <Box maxW="md" mx="auto" mt={8} p={6} borderWidth={1} borderRadius="lg">
      <VStack spacing={6}>
        <Heading as="h1" size="xl">
          {t('forgotPassword.title')}
        </Heading>

        <Text textAlign="center">
          {t('forgotPassword.description')}
        </Text>

        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <VStack spacing={4}>
            <FormControl id="email" isRequired>
              <FormLabel>{t('forgotPassword.email')}</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('forgotPassword.emailPlaceholder')}
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              width="full"
              isLoading={isSubmitting}
            >
              {t('forgotPassword.submit')}
            </Button>
          </VStack>
        </form>

        <Link as={RouterLink} to="/login" color="blue.500">
          {t('forgotPassword.backToLogin')}
        </Link>
      </VStack>
    </Box>
  );
};

ForgotPassword.propTypes = {
  // Optional callback that runs after successful submission
  onSubmitSuccess: PropTypes.func
};

ForgotPassword.defaultProps = {
  onSubmitSuccess: undefined
};

export default ForgotPassword;
