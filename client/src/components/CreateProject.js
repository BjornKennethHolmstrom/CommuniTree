import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Heading,
  useToast
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
import { validateProject, parseSkillsList } from '../utils/projectUtils';
import ProjectForm from './ProjectForm';

const CreateProject = ({
  onCreateSuccess,
  onCreateError,
  redirectOnSuccess = true,
  redirectPath = '/projects',
  showSuccessToast = true,
  showErrorToast = true,
  customValidation
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (projectData) => {
    try {
      setLoading(true);
      setError(null);

      // Additional validation if provided
      if (customValidation) {
        const validationError = customValidation(projectData);
        if (validationError) {
          throw new Error(validationError);
        }
      }

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': user.token
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        throw new Error('Failed to create project');
      }

      const newProject = await response.json();

      if (onCreateSuccess) {
        onCreateSuccess(newProject);
      }

      if (showSuccessToast) {
        toast({
          title: t('createProject.success'),
          status: 'success',
          duration: 3000,
        });
      }

      if (redirectOnSuccess) {
        navigate(redirectPath);
      }
    } catch (err) {
      setError(err.message);
      
      if (onCreateError) {
        onCreateError(err);
      }

      if (showErrorToast) {
        toast({
          title: t('createProject.error'),
          description: err.message,
          status: 'error',
          duration: 5000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="4xl" mx="auto" mt={8}>
      <Heading as="h2" size="xl" mb={4}>{t('createProject.title')}</Heading>
      
      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          <AlertTitle mr={2}>{t('common.error')}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <ProjectForm
        onSubmit={handleSubmit}
        isLoading={loading}
      />
    </Box>
  );
};

CreateProject.propTypes = {
  // Optional callbacks
  onCreateSuccess: PropTypes.func,
  onCreateError: PropTypes.func,
  
  // Navigation options
  redirectOnSuccess: PropTypes.bool,
  redirectPath: PropTypes.string,
  
  // Toast notifications
  showSuccessToast: PropTypes.bool,
  showErrorToast: PropTypes.bool,
  
  // Custom validation
  customValidation: PropTypes.func
};

CreateProject.defaultProps = {
  onCreateSuccess: undefined,
  onCreateError: undefined,
  redirectOnSuccess: true,
  redirectPath: '/projects',
  showSuccessToast: true,
  showErrorToast: true,
  customValidation: undefined
};

export default CreateProject;
