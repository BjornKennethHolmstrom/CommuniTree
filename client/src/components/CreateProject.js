import React, { useState } from 'react';
import ProjectForm from './ProjectForm';
import { useAuth } from './AuthContext';
import { Alert, AlertIcon, AlertTitle, AlertDescription, Box, Heading } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const CreateProject = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (projectData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': user.token
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        throw new Error(t('createProject.error'));
      }

      setSuccess(true);
    } catch (error) {
      console.error('Error creating project:', error);
      setError(error.message);
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
      {success && (
        <Alert status="success" mb={4}>
          <AlertIcon />
          <AlertDescription>{t('createProject.success')}</AlertDescription>
        </Alert>
      )}
      <ProjectForm onSubmit={handleSubmit} isLoading={loading} />
    </Box>
  );
};

export default CreateProject;
