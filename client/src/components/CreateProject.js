import React, { useState } from 'react';
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

const CreateProject = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (projectData) => {
    // Parse skills from comma-separated string to array
    const formattedData = {
      ...projectData,
      required_skills: parseSkillsList(projectData.requiredSkills)
    };

    // Validate project data
    const { isValid, errors } = validateProject(formattedData);
    if (!isValid) {
      setError(Object.values(errors)[0]); // Show first error
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': user.token
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || t('createProject.error'));
      }

      toast({
        title: t('createProject.success'),
        status: 'success',
        duration: 3000,
      });
      navigate('/projects');
    } catch (err) {
      console.error('Error creating project:', err);
      setError(err.message);
      toast({
        title: t('createProject.error'),
        description: err.message,
        status: 'error',
        duration: 5000,
      });
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

      <ProjectForm onSubmit={handleSubmit} isLoading={loading} />
    </Box>
  );
};

export default CreateProject;
