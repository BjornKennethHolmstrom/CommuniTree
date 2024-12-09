import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
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
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { Eye, EyeOff } from 'lucide-react';

const ResetPassword = ({ 
  onResetSuccess, 
  onResetError, 
  redirectDelay = 3000,
  minPasswordLength = 8 
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isValidToken, setIsValidToken] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch(`/api/auth/verify-reset-token/${token}`);
        if (!response.ok) {
          throw new Error('Invalid or expired reset token');
        }
        setIsValidToken(true);
      } catch (err) {
        setError(err.message);
        setIsValidToken(false);
        if (onResetError) {
          onResetError(err);
        }
      }
    };

    verifyToken();
  }, [token, onResetError]);

  const validatePassword = () => {
    if (password.length < minPasswordLength) {
      setError(t('resetPassword.passwordLength'));
      return false;
    }
    if (!/(?=.*[A-Za-z])(?=.*\d)/.test(password)) {
      setError(t('resetPassword.passwordStrength'));
      return false;
    }
    if (password !== confirmPassword) {
      setError(t('resetPassword.passwordsMustMatch'));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.msg || 'Error resetting password');
      }

      setIsSuccess(true);
      if (onResetSuccess) {
        onResetSuccess();
      }
      
      setTimeout(() => {
        navigate('/login');
      }, redirectDelay);
    } catch (err) {
      setError(err.message);
      if (onResetError) {
        onResetError(err);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isValidToken) {
    return (
      <Box maxW="md" mx="auto" mt={8} p={6} borderWidth={1} borderRadius="lg">
        <Alert status="error">
          <AlertIcon />
          {t('resetPassword.invalidToken')}
        </Alert>
        <Link as={RouterLink} to="/forgot-password" color="blue.500" display="block" mt={4}>
          {t('resetPassword.requestNewLink')}
        </Link>
      </Box>
    );
  }

  if (isSuccess) {
    return (
      <Box maxW="md" mx="auto" mt={8} p={6} borderWidth={1} borderRadius="lg">
        <Alert status="success">
          <AlertIcon />
          {t('resetPassword.success')}
        </Alert>
        <Text mt={4} textAlign="center">
          {t('resetPassword.redirecting')}
        </Text>
      </Box>
    );
  }

  return (
    <Box maxW="md" mx="auto" mt={8} p={6} borderWidth={1} borderRadius="lg">
      <VStack spacing={6}>
        <Heading as="h1" size="xl">
          {t('resetPassword.title')}
        </Heading>

        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <VStack spacing={4}>
            <FormControl id="password" isRequired>
              <FormLabel>{t('resetPassword.newPassword')}</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('resetPassword.passwordPlaceholder')}
                />
                <InputRightElement>
                  <IconButton
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    icon={showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    onClick={() => setShowPassword(!showPassword)}
                    variant="ghost"
                    size="sm"
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <FormControl id="confirmPassword" isRequired>
              <FormLabel>{t('resetPassword.confirmPassword')}</FormLabel>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t('resetPassword.confirmPasswordPlaceholder')}
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              width="full"
              isLoading={isSubmitting}
            >
              {t('resetPassword.submit')}
            </Button>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
};

ResetPassword.propTypes = {
  // Optional callbacks
  onResetSuccess: PropTypes.func,
  onResetError: PropTypes.func,
  
  // Optional configuration
  redirectDelay: PropTypes.number,
  minPasswordLength: PropTypes.number,
  
  // Optional customization
  customValidation: PropTypes.func,
  passwordStrengthRules: PropTypes.shape({
    requireSpecialChar: PropTypes.bool,
    requireUppercase: PropTypes.bool,
    requireNumber: PropTypes.bool,
    requireLowercase: PropTypes.bool
  })
};

ResetPassword.defaultProps = {
  onResetSuccess: undefined,
  onResetError: undefined,
  redirectDelay: 3000,
  minPasswordLength: 8,
  customValidation: undefined,
  passwordStrengthRules: {
    requireSpecialChar: true,
    requireUppercase: true,
    requireNumber: true,
    requireLowercase: true
  }
};

export default ResetPassword;
