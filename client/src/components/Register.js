// src/components/Register.js with RegisterFormField integration
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  VStack,
  Heading,
  Text,
  Link,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import RegisterFormField from './RegisterFormField';

const Register = ({ redirectPath, onRegistrationSuccess }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { api } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setServerError('');

    try {
      const response = await api.post('/auth/register', formData);
      if (onRegistrationSuccess) {
        onRegistrationSuccess(response.data);
      }
      navigate(redirectPath);
    } catch (error) {
      const errorMessage = error.response?.data?.msg 
        || error.response?.data?.errors?.[0]?.msg 
        || t('register.genericError');
      setServerError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={8} p={6} borderWidth={1} borderRadius="lg">
      <VStack spacing={6}>
        <Heading as="h1" size="xl">
          {t('register.title')}
        </Heading>

        {serverError && (
          <Alert status="error">
            <AlertIcon />
            {serverError}
          </Alert>
        )}

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <VStack spacing={4}>
            <RegisterFormField
              field="username"
              value={formData.username}
              error={errors.username}
              onChange={handleChange}
              config={Register.fieldConfig.username}
              t={t}
            />

            <RegisterFormField
              field="email"
              value={formData.email}
              error={errors.email}
              onChange={handleChange}
              config={Register.fieldConfig.email}
              t={t}
            />

            <RegisterFormField
              field="name"
              value={formData.name}
              error={errors.name}
              onChange={handleChange}
              config={Register.fieldConfig.name}
              t={t}
            />

            <RegisterFormField
              field="password"
              value={formData.password}
              error={errors.password}
              onChange={handleChange}
              config={Register.fieldConfig.password}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
              t={t}
            />

            <Button
              type="submit"
              colorScheme="blue"
              width="full"
              isLoading={isSubmitting}
            >
              {t('register.submit')}
            </Button>
          </VStack>
        </form>

        <Text>
          {t('register.haveAccount')}{' '}
          <Link as={RouterLink} to="/login" color="blue.500">
            {t('register.loginLink')}
          </Link>
        </Text>
      </VStack>
    </Box>
  );
};

Register.propTypes = {
  // Optional props
  redirectPath: PropTypes.string,
  onRegistrationSuccess: PropTypes.func,
  
  // You could also add validation rules prop if you want to make validation configurable
  validationRules: PropTypes.shape({
    usernameMinLength: PropTypes.number,
    passwordMinLength: PropTypes.number,
    requireSpecialChar: PropTypes.bool,
    requireNumber: PropTypes.bool
  })
};

Register.defaultProps = {
  redirectPath: '/dashboard',
  onRegistrationSuccess: () => {},
  validationRules: {
    usernameMinLength: 3,
    passwordMinLength: 8,
    requireSpecialChar: true,
    requireNumber: true
  }
};

// Add form field configuration type
Register.fieldConfig = {
  username: {
    type: 'text',
    required: true,
    translationKey: 'register.username',
    placeholderKey: 'register.usernamePlaceholder'
  },
  email: {
    type: 'email',
    required: true,
    translationKey: 'register.email',
    placeholderKey: 'register.emailPlaceholder'
  },
  name: {
    type: 'text',
    required: true,
    translationKey: 'register.name',
    placeholderKey: 'register.namePlaceholder'
  },
  password: {
    type: 'password',
    required: true,
    translationKey: 'register.password',
    placeholderKey: 'register.passwordPlaceholder'
  }
};

export default Register;
