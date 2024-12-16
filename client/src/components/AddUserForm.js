import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Alert,
  AlertIcon,
  useToast
} from '@chakra-ui/react';

function AddUserForm({
  onUserAdded,
  onError,
  showSuccessToast = true,
  showErrorToast = true,
  additionalFields = [],
  customValidation,
  clearAfterSubmit = true
}) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const toast = useToast();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    ...additionalFields.reduce((acc, field) => ({ ...acc, [field.key]: '' }), {})
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      ...additionalFields.reduce((acc, field) => ({ ...acc, [field.key]: '' }), {})
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (customValidation) {
        const validationError = customValidation(formData);
        if (validationError) {
          throw new Error(validationError);
        }
      }

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': user.token
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to add user');
      }

      const data = await response.json();
      
      if (showSuccessToast) {
        toast({
          title: t('addUserForm.success'),
          status: 'success',
          duration: 3000
        });
      }

      if (clearAfterSubmit) {
        resetForm();
      }

      if (onUserAdded) {
        onUserAdded(data);
      }
    } catch (error) {
      setError(error.message);
      if (onError) {
        onError(error);
      }
      
      if (showErrorToast) {
        toast({
          title: t('addUserForm.errorAdding'),
          description: error.message,
          status: 'error',
          duration: 5000
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={4}>
        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}

        <FormControl isRequired>
          <FormLabel>{t('addUserForm.username')}</FormLabel>
          <Input
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder={t('addUserForm.usernamePlaceholder')}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>{t('addUserForm.email')}</FormLabel>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={t('addUserForm.emailPlaceholder')}
          />
        </FormControl>

        {additionalFields.map(field => (
          <FormControl key={field.key} isRequired={field.required}>
            <FormLabel>{t(field.label)}</FormLabel>
            <Input
              type={field.type || 'text'}
              name={field.key}
              value={formData[field.key]}
              onChange={handleChange}
              placeholder={t(field.placeholder)}
            />
          </FormControl>
        ))}

        <Button
          type="submit"
          colorScheme="blue"
          isLoading={isSubmitting}
          width="full"
        >
          {t('addUserForm.addUser')}
        </Button>
      </VStack>
    </form>
  );
}

AddUserForm.propTypes = {
  // Optional callbacks
  onUserAdded: PropTypes.func,
  onError: PropTypes.func,

  // Toast configuration
  showSuccessToast: PropTypes.bool,
  showErrorToast: PropTypes.bool,

  // Additional fields configuration
  additionalFields: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string,
      required: PropTypes.bool,
      placeholder: PropTypes.string
    })
  ),

  // Custom validation
  customValidation: PropTypes.func,

  // Form behavior
  clearAfterSubmit: PropTypes.bool,

  // Optional styling
  containerStyle: PropTypes.object
};

AddUserForm.defaultProps = {
  onUserAdded: undefined,
  onError: undefined,
  showSuccessToast: true,
  showErrorToast: true,
  additionalFields: [],
  customValidation: undefined,
  clearAfterSubmit: true,
  containerStyle: {}
};

export default AddUserForm;
