import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Box, Heading, Text, VStack, HStack, Button, Alert, AlertIcon, Spinner } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const { t } = useTranslation();
  const { user, api } = useAuth();
  const [userProjects, setUserProjects] = useState([]);
  const [volunteerActivities, setVolunteerActivities] = useState([]);
  const [impactStats, setImpactStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && user.token) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [projectsRes, activitiesRes, statsRes] = await Promise.all([
        api.get('/users/projects'),
        api.get('/users/volunteer-activities'),
        api.get('/users/impact-stats')
      ]);

      setUserProjects(projectsRes.data);
      setVolunteerActivities(activitiesRes.data);
      setImpactStats(statsRes.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      console.error('Error response:', err.response);
      setError(t('dashboard.errorFetchingData', { message: err.message, details: err.response?.data?.details || '' }));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <Alert status="error"><AlertIcon />{error}</Alert>;


  return (
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
  );
};

export default Dashboard;
