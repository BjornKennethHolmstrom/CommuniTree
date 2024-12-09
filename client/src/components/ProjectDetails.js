import React from 'react';
import PropTypes from 'prop-types';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box, VStack, HStack, Heading, Text, Button, Select,
  Alert, AlertIcon, Container, Divider, Spinner,
  Badge, useToast
} from '@chakra-ui/react';
import { useProject } from '../hooks/useProject';
import { formatProjectStatus, calculateProjectProgress } from '../utils/projectUtils';
import Comments from './Comments';
import FileUpload from './FileUpload';

const ProjectDetails = ({
  onStatusChange,
  onVolunteerSignUp,
  onDelete,
  showComments = true,
  showFileUpload = true,
  allowEditing = true,
  customStatusOptions
}) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  
  const {
    project,
    loading,
    error,
    volunteerStatus,
    updateProject,
    signUpVolunteer,
    refreshProject
  } = useProject(id);

  const handleStatusChange = async (newStatus) => {
    try {
      await updateProject({ status: newStatus });
      if (onStatusChange) {
        onStatusChange(newStatus);
      }
      toast({
        title: t('projectDetails.statusUpdated'),
        status: 'success',
        duration: 3000,
      });
    } catch (err) {
      toast({
        title: t('projectDetails.statusUpdateError'),
        description: err.message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  const handleVolunteerSignUp = async () => {
    try {
      await signUpVolunteer();
      if (onVolunteerSignUp) {
        onVolunteerSignUp(id);
      }
      toast({
        title: t('projectDetails.volunteerSuccess'),
        status: 'success',
        duration: 3000,
      });
    } catch (err) {
      toast({
        title: t('projectDetails.volunteerError'),
        description: err.message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm(t('projectDetails.deleteConfirmation'))) {
      try {
        await updateProject({ deleted: true });
        if (onDelete) {
          onDelete(id);
        }
        navigate('/projects');
        toast({
          title: t('projectDetails.deleteSuccess'),
          status: 'success',
          duration: 3000,
        });
      } catch (err) {
        toast({
          title: t('projectDetails.deleteError'),
          description: err.message,
          status: 'error',
          duration: 5000,
        });
      }
    }
  };

  if (loading) return <Spinner size="xl" />;
  if (error) return <Alert status="error"><AlertIcon />{error}</Alert>;
  if (!project) return <Alert status="warning"><AlertIcon />{t('projectDetails.notFound')}</Alert>;

  const progress = calculateProjectProgress(project);

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Heading as="h2" size="xl">{project.title}</Heading>
          <Badge colorScheme={project.status === 'open' ? 'green' : 'blue'}>
            {formatProjectStatus(project.status)}
          </Badge>
        </HStack>

        <Box>
          <Text>{project.description}</Text>
        </Box>

        <Box>
          <Heading as="h3" size="md" mb={2}>{t('projectDetails.requiredSkills')}</Heading>
          <HStack spacing={2}>
            {project.required_skills?.map((skill, index) => (
              <Badge key={index} colorScheme="purple">{skill}</Badge>
            ))}
          </HStack>
        </Box>

        <Box>
          <Text fontWeight="bold">{t('projectDetails.timeCommitment')}:</Text>
          <Text>{project.time_commitment}</Text>
        </Box>

        <Box>
          <Text fontWeight="bold">{t('projectDetails.location')}:</Text>
          <Text>{project.location}</Text>
        </Box>

        {progress > 0 && (
          <Box>
            <Text fontWeight="bold">{t('projectDetails.progress')}: {progress}%</Text>
            <Box bg="gray.200" h="2" borderRadius="full" mt={2}>
              <Box
                bg="green.500"
                h="100%"
                borderRadius="full"
                width={`${progress}%`}
              />
            </Box>
          </Box>
        )}

        <Box>
          <Heading as="h3" size="md" mb={2}>{t('projectDetails.status')}</Heading>
          <Select
            value={project.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            width="200px"
          >
            <option value="open">{t('projectDetails.statusOpen')}</option>
            <option value="in_progress">{t('projectDetails.statusInProgress')}</option>
            <option value="completed">{t('projectDetails.statusCompleted')}</option>
          </Select>
        </Box>

        <HStack spacing={4}>
          <Button
            colorScheme="blue"
            onClick={handleVolunteerSignUp}
            isDisabled={volunteerStatus === 'signed_up'}
          >
            {volunteerStatus === 'signed_up' 
              ? t('projectDetails.alreadyVolunteered')
              : t('projectDetails.volunteerSignUp')}
          </Button>

          {project.creator_id === id && (
            <>
              <Button onClick={() => navigate(`/projects/${id}/edit`)}>
                {t('common.edit')}
              </Button>
              <Button colorScheme="red" onClick={handleDeleteProject}>
                {t('common.delete')}
              </Button>
            </>
          )}
        </HStack>

        <Divider />

        <FileUpload projectId={id} />

        <Divider />

        <Comments projectId={id} />
      </VStack>
    </Container>
  );
};

ProjectDetails.propTypes = {
  // Optional callbacks
  onStatusChange: PropTypes.func,
  onVolunteerSignUp: PropTypes.func,
  onDelete: PropTypes.func,

  // Feature flags
  showComments: PropTypes.bool,
  showFileUpload: PropTypes.bool,
  allowEditing: PropTypes.bool,

  // Custom status options
  customStatusOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      color: PropTypes.string
    })
  ),

  // Project shape (for documentation)
  project: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    required_skills: PropTypes.arrayOf(PropTypes.string),
    time_commitment: PropTypes.string,
    location: PropTypes.string,
    created_at: PropTypes.string,
    creator_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    milestones: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        title: PropTypes.string,
        completed: PropTypes.bool
      })
    )
  })
};

ProjectDetails.defaultProps = {
  onStatusChange: undefined,
  onVolunteerSignUp: undefined,
  onDelete: undefined,
  showComments: true,
  showFileUpload: true,
  allowEditing: true,
  customStatusOptions: undefined
};

// Status options type definition for documentation
ProjectDetails.statusOptionShape = {
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  color: PropTypes.string
};

export default ProjectDetails;
