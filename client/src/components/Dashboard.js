import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { 
  Box, 
  VStack, 
  HStack, 
  Heading, 
  Text, 
  Button, 
  Alert, 
  AlertIcon, 
  Spinner,
  Container
} from '@chakra-ui/react';

const Dashboard = ({
  showProjects = true,
  showVolunteerActivities = true,
  showImpactStats = true,
  onDataLoad,
  customStats = [],
  maxProjects,
  maxActivities,
  containerSize = "4xl"
}) => {
  const { t } = useTranslation();
  const { user, api } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    projects: [],
    volunteerActivities: [],
    impactStats: null
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [projectsRes, activitiesRes, statsRes] = await Promise.all([
        showProjects ? api.get('/users/projects') : Promise.resolve({ data: [] }),
        showVolunteerActivities ? api.get('/users/volunteer-activities') : Promise.resolve({ data: [] }),
        showImpactStats ? api.get('/users/impact-stats') : Promise.resolve({ data: null })
      ]);

      const data = {
        projects: projectsRes.data,
        volunteerActivities: activitiesRes.data,
        impactStats: statsRes.data
      };

      setDashboardData(data);
      if (onDataLoad) {
        onDataLoad(data);
      }
    } catch (err) {
      setError(t('dashboard.errorFetchingData'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner size="xl" />;
  if (error) return <Alert status="error"><AlertIcon />{error}</Alert>;

  return (
    <Container maxW={containerSize} py={8}>
      <Box maxW="4xl" mx="auto" mt={8}>
        <Heading as="h2" size="xl" mb={6}>{t('pages.dashboard')}</Heading>

        <HStack spacing={4} mb={8}>
          <Box p={5} shadow="md" borderWidth="1px" flex="1" borderRadius="md">
            <Heading fontSize="xl">{t('dashboard.projectsCreated')}</Heading>
            <Text fontSize="3xl" fontWeight="bold">{impactStats?.projectsCreated || 0}</Text>
          </Box>
          <Box p={5} shadow="md" borderWidth="1px" flex="1" borderRadius="md">
            <Heading fontSize="xl">{t('dashboard.volunteeringHours')}</Heading>
            <Text fontSize="3xl" fontWeight="bold">{impactStats?.volunteeringHours || 0}</Text>
          </Box>
          <Box p={5} shadow="md" borderWidth="1px" flex="1" borderRadius="md">
            <Heading fontSize="xl">{t('dashboard.communitiesImpacted')}</Heading>
            <Text fontSize="3xl" fontWeight="bold">{impactStats?.communitiesImpacted || 0}</Text>
          </Box>
        </HStack>

        <VStack align="stretch" spacing={8}>
          <Box>
            <Heading as="h3" size="lg" mb={4}>{t('dashboard.yourProjects')}</Heading>
            {userProjects.length === 0 ? (
              <Text>{t('dashboard.noProjects')}</Text>
            ) : (
              <VStack align="stretch" spacing={4}>
                {userProjects.map(project => (
                  <Box key={project.id} p={4} borderWidth="1px" borderRadius="md">
                    <Heading size="md">{project.title}</Heading>
                    <Text fontSize="sm" color="gray.600" mb={2}>{t('common.status')}: {project.status}</Text>
                    <Button as={Link} to={`/projects/${project.id}`} variant="link">{t('dashboard.viewProject')}</Button>
                  </Box>
                ))}
              </VStack>
            )}
          </Box>

          <Box>
            <Heading as="h3" size="lg" mb={4}>{t('dashboard.yourVolunteerActivities')}</Heading>
            {volunteerActivities.length === 0 ? (
              <Text>{t('dashboard.noVolunteerActivities')}</Text>
            ) : (
              <VStack align="stretch" spacing={4}>
                {volunteerActivities.map(activity => (
                  <Box key={activity.id} p={4} borderWidth="1px" borderRadius="md">
                    <Heading size="md">{activity.project_title}</Heading>
                    <Text fontSize="sm" color="gray.600" mb={2}>{t('dashboard.role')}: {activity.role}</Text>
                    <Text fontSize="sm" color="gray.600" mb={2}>{t('dashboard.hours')}: {activity.hours}</Text>
                    <Button as={Link} to={`/projects/${activity.project_id}`} variant="link">{t('dashboard.viewProject')}</Button>
                  </Box>
                ))}
              </VStack>
            )}
          </Box>
        </VStack>
      </Box>
    </Container>
  );
};

export default Dashboard;
