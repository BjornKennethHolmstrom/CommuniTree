import React, { useState, useEffect } from 'react';
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
  useToast,
  HStack
} from '@chakra-ui/react';

function EditUserForm({
  user,
  onUserUpdated,
  onCancel,
  onError,
  showSuccessToast = true,
  showErrorToast = true,
  additionalFields = [],
  customValidation,
  disabledFields = []
}) {
  const { t } = useTranslation();
  const { user: authUser } = useAuth();
  const toast = useToast();
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    ...additionalFields.reduce((acc, field) => ({ 
      ...acc, 
      [field.key]: user[field.key] || '' 
    }), {})
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

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

      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': authUser.token
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      const data = await response.json();
      
      if (showSuccessToast) {
        toast({
          title: t('editUserForm.updateSuccess'),
          status: 'success',
          duration: 3000
        });
      }

      if (onUserUpdated) {
        onUserUpdated(data);
      }
    } catch (error) {
      setError(error.message);
      if (onError) {
        onError(error);
      }
      
      if (showErrorToast) {
        toast({
          title: t('editUserForm.errorUpdating'),
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
          <FormLabel>{t('editUserForm.username')}</FormLabel>
          <Input
            name="username"
            value={formData.username}
            onChange={handleChange}
            isDisabled={disabledFields.includes('username')}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>{t('editUserForm.email')}</FormLabel>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            isDisabled={disabledFields.includes('email')}
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
              isDisabled={disabledFields.includes(field.key)}
              placeholder={t(field.placeholder)}
            />
          </FormControl>
        ))}

        <HStack spacing={4} width="100%" justify="flex-end">
          {onCancel && (
            <Button
              variant="outline"
              onClick={onCancel}
              isDisabled={isSubmitting}
            >
              {t('editUserForm.cancel')}
            </Button>
          )}
          <Button
            type="submit"
            colorScheme="blue"
            isLoading={isSubmitting}
          >
            {t('editUserForm.updateUser')}
          </Button>
        </HStack>
      </VStack>
    </form>
  );
}

EditUserForm.propTypes = {
  // Required props
  user: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired
  }).isRequired,

  // Optional callbacks
  onUserUpdated: PropTypes.func,
  onCancel: PropTypes.func,
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

  // Field configuration
  disabledFields: PropTypes.arrayOf(PropTypes.string),

  // Optional styling
  containerStyle: PropTypes.object
};

EditUserForm.defaultProps = {
  onUserUpdated: undefined,
  onCancel: undefined,
  onError: undefined,
  showSuccessToast: true,
  showErrorToast: true,
  additionalFields: [],
  customValidation: undefined,
  disabledFields: [],
  containerStyle: {}
};

export default EditUserForm;
