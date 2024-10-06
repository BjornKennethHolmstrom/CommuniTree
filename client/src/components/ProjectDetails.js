import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useTranslation } from 'react-i18next';
import {
  Box, VStack, HStack, Heading, Text, Button, Select,
  Alert, AlertIcon, Container, Divider, Spinner
} from '@chakra-ui/react';
import Comments from './Comments';
import FileUpload from './FileUpload';

const ProjectDetails = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [volunteers, setVolunteers] = useState([]);
  const { id } = useParams();
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjectDetails();
    fetchProjectVolunteers();
  }, [id]);

  const canEditProject = (project) => {
    return user.role === 'admin' || project.creator_id === user.id;
  };

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/projects/${id}`, {
        headers: {
          'x-auth-token': user.token
        }
      });
      if (!response.ok) {
        throw new Error(t('projectDetails.fetchError'));
      }
      const data = await response.json();
      setProject(data);
      setStatus(data.status);
    } catch (error) {
      console.error('Error fetching project details:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectVolunteers = async () => {
    try {
      const response = await fetch(`/api/projects/${id}/volunteers`, {
        headers: {
          'x-auth-token': user.token
        }
      });
      if (!response.ok) {
        throw new Error(t('projectDetails.volunteersFetchError'));
      }
      const data = await response.json();
      setVolunteers(data);
    } catch (error) {
      console.error('Error fetching project volunteers:', error);
      setError(error.message);
    }
  };

  const handleVolunteerSignUp = async () => {
    try {
      const response = await fetch('/api/projects/volunteer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': user.token
        },
        body: JSON.stringify({ project_id: id }),
      });
      if (!response.ok) {
        throw new Error(t('projectDetails.volunteerSignUpError'));
      }
      alert(t('projectDetails.volunteerSuccess'));
      fetchProjectVolunteers();
    } catch (error) {
      console.error('Error signing up as volunteer:', error);
      setError(error.message);
    }
  };

  const updateProjectStatus = async (newStatus) => {
    try {
      const response = await fetch(`/api/projects/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': user.token
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) {
        throw new Error(t('projectDetails.statusUpdateError'));
      }
      setStatus(newStatus);
      alert('Project status updated successfully');
    } catch (error) {
      console.error('Error updating project status:', error);
      setError(error.message);
    }
  };

  const handleEditProject = async (updatedProjectData) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': user.token
        },
        body: JSON.stringify(updatedProjectData)
      });
      if (!response.ok) {
        throw new Error(t('projectDetails.projectUpdateError'));
      }
      const updatedProject = await response.json();
      setProject(updatedProject);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating project:', error);
      setError(error.message);
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm(t('projectDetails.deleteConfirmation'))) {
      try {
        const response = await fetch(`/api/projects/${id}`, {
          method: 'DELETE',
          headers: {
            'x-auth-token': user.token
          }
        });
        if (!response.ok) {
          throw new Error(t('projectDetails.projectDeleteError'));
        }
        navigate('/projects');
      } catch (error) {
        console.error('Error deleting project:', error);
        setError(error.message);
      }
    }
  };

  if (loading) return <Spinner />;
  if (error) return <Alert status="error"><AlertIcon />{error}</Alert>;
  if (!project) return <Alert status="warning"><AlertIcon />{t('projectDetails.notFound')}</Alert>;

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading as="h2" size="xl">{project.title}</Heading>
        <Text>{project.description}</Text>

        <Box>
          <Text fontWeight="bold">{t('projectDetails.requiredSkills')}:</Text>
          <Text>{project.required_skills?.join(', ') || t('common.none')}</Text>
        </Box>

        <Box>
          <Text fontWeight="bold">{t('projectDetails.timeCommitment')}:</Text>
          <Text>{project.time_commitment || t('common.notSpecified')}</Text>
        </Box>

        <Box>
          <Text fontWeight="bold">{t('projectDetails.location')}:</Text>
          <Text>{project.location || t('common.notSpecified')}</Text>
        </Box>

        <Button colorScheme="blue" onClick={handleVolunteerSignUp}>
          {t('projectDetails.volunteerSignUp')}
        </Button>

        {canEditProject(project) && (
          <HStack spacing={4}>
            <Button onClick={() => setIsEditing(true)}>{t('common.edit')}</Button>
            <Button colorScheme="red" onClick={handleDeleteProject}>{t('common.delete')}</Button>
          </HStack>
        )}

        <Box>
          <Heading as="h3" size="md" mb={2}>{t('projectDetails.currentVolunteers')}</Heading>
          {volunteers.length > 0 ? (
            <VStack align="stretch">
              {volunteers.map((volunteer) => (
                <Text key={volunteer.id}>{volunteer.name}</Text>
              ))}
            </VStack>
          ) : (
            <Text>{t('projectDetails.noVolunteers')}</Text>
          )}
        </Box>

        <Box>
          <Heading as="h3" size="md" mb={2}>{t('projectDetails.updateStatus')}</Heading>
          <Select value={status} onChange={(e) => updateProjectStatus(e.target.value)}>
            <option value="open">{t('projectDetails.statusOpen')}</option>
            <option value="in_progress">{t('projectDetails.statusInProgress')}</option>
            <option value="completed">{t('projectDetails.statusCompleted')}</option>
          </Select>
        </Box>

        <Divider />

        <FileUpload projectId={id} />

        <Divider />

        <Comments projectId={id} />
      </VStack>
    </Container>
  );
};

export default ProjectDetails;
