import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCommunity } from '../contexts/CommunityContext';
import { useError } from '../contexts/ErrorContext';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Image,
  Button,
  Grid,
  GridItem,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Avatar,
  Wrap,
  WrapItem,
  Card,
  CardHeader,
  CardBody,
  Divider
} from '@chakra-ui/react';

const CommunityLanding = ({
  communityId,
  showEvents = true,
  showProjects = true,
  showMembers = true,
  showWeather = true,
  maxProjects = 3,
  maxEvents = 3,
  maxMembers = 10,
  onJoin,
  onLeave,
  customTabs = [],
  customStats = []
}) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { user } = useAuth();
  const { joinCommunity, leaveCommunity } = useCommunity();
  const { showError } = useError();
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentProjects, setRecentProjects] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [members, setMembers] = useState([]);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    const fetchCommunityData = async () => {
      setLoading(true);
      try {
        const [communityRes, projectsRes, eventsRes, membersRes, membershipRes] = await Promise.all([
          fetch(`/api/communities/${id}`, {
            headers: { 'x-auth-token': user.token }
          }),
          fetch(`/api/communities/${id}/projects?limit=3`, {
            headers: { 'x-auth-token': user.token }
          }),
          fetch(`/api/communities/${id}/events?upcoming=true&limit=3`, {
            headers: { 'x-auth-token': user.token }
          }),
          fetch(`/api/communities/${id}/members?limit=10`, {
            headers: { 'x-auth-token': user.token }
          }),
          fetch(`/api/communities/${id}/membership`, {
            headers: { 'x-auth-token': user.token }
          })
        ]);

        const [communityData, projectsData, eventsData, membersData, membershipData] = await Promise.all([
          communityRes.json(),
          projectsRes.json(),
          eventsRes.json(),
          membersRes.json(),
          membershipRes.json()
        ]);

        setCommunity(communityData);
        setRecentProjects(projectsData);
        setUpcomingEvents(eventsData);
        setMembers(membersData);
        setIsMember(membershipData.isMember);
      } catch (error) {
        showError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityData();
  }, [id, user.token, showError]);

  const handleJoinLeave = async () => {
    try {
      if (isMember) {
        await leaveCommunity(id);
        setIsMember(false);
      } else {
        await joinCommunity(id);
        setIsMember(true);
      }
    } catch (error) {
      showError(error.message);
    }
  };

  if (loading) {
    return <Box p={8}>{t('common.loading')}</Box>;
  }

  if (!community) {
    return <Box p={8}>{t('community.notFound')}</Box>;
  }

  return (
    <Container maxW="container.xl" py={8}>
      {/* Hero Section */}
      <Box 
        position="relative" 
        h="300px" 
        mb={8} 
        borderRadius="lg" 
        overflow="hidden"
      >
        <Image
          src={community.cover_image_url || '/api/placeholder/1200/300'}
          alt={community.name}
          objectFit="cover"
          w="100%"
          h="100%"
        />
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          bg="blackAlpha.600"
          p={6}
          color="white"
        >
          <Heading size="2xl">{community.name}</Heading>
          <Text mt={2}>{community.description}</Text>
        </Box>
      </Box>

      {/* Community Stats */}
      <Grid templateColumns="repeat(4, 1fr)" gap={6} mb={8}>
        <GridItem>
          <Stat>
            <StatLabel>{t('community.members')}</StatLabel>
            <StatNumber>{community.member_count}</StatNumber>
          </Stat>
        </GridItem>
        <GridItem>
          <Stat>
            <StatLabel>{t('community.projects')}</StatLabel>
            <StatNumber>{recentProjects.length}</StatNumber>
          </Stat>
        </GridItem>
        <GridItem>
          <Stat>
            <StatLabel>{t('community.upcomingEvents')}</StatLabel>
            <StatNumber>{upcomingEvents.length}</StatNumber>
          </Stat>
        </GridItem>
        <GridItem>
          <Button
            colorScheme={isMember ? "red" : "blue"}
            onClick={handleJoinLeave}
            size="lg"
            w="100%"
          >
            {isMember ? t('community.leave') : t('community.join')}
          </Button>
        </GridItem>
      </Grid>

      {/* Main Content Tabs */}
      <Tabs variant="enclosed" colorScheme="blue">
        <TabList>
          <Tab>{t('community.about')}</Tab>
          <Tab>{t('community.recentProjects')}</Tab>
          <Tab>{t('community.upcomingEvents')}</Tab>
          <Tab>{t('community.members')}</Tab>
        </TabList>

        <TabPanels>
          {/* About Tab */}
          <TabPanel>
            <VStack align="stretch" spacing={4}>
              <Box>
                <Heading size="md" mb={2}>{t('community.tags')}</Heading>
                <Wrap>
                  {community.tags?.map(tag => (
                    <WrapItem key={tag}>
                      <Badge colorScheme="blue">{tag}</Badge>
                    </WrapItem>
                  ))}
                </Wrap>
              </Box>
              <Divider />
              <Box>
                <Heading size="md" mb={2}>{t('community.location')}</Heading>
                <Text>{community.location}</Text>
              </Box>
            </VStack>
          </TabPanel>

          {/* Recent Projects Tab */}
          <TabPanel>
            <VStack align="stretch" spacing={4}>
              {recentProjects.map(project => (
                <Card key={project.id}>
                  <CardHeader>
                    <Heading size="md">{project.title}</Heading>
                  </CardHeader>
                  <CardBody>
                    <Text>{project.description}</Text>
                    <HStack mt={4}>
                      <Badge colorScheme="green">{project.status}</Badge>
                      <Button size="sm" variant="link">
                        {t('community.viewProject')}
                      </Button>
                    </HStack>
                  </CardBody>
                </Card>
              ))}
            </VStack>
          </TabPanel>

          {/* Upcoming Events Tab */}
          <TabPanel>
            <VStack align="stretch" spacing={4}>
              {upcomingEvents.map(event => (
                <Card key={event.id}>
                  <CardHeader>
                    <Heading size="md">{event.title}</Heading>
                  </CardHeader>
                  <CardBody>
                    <Text>{event.description}</Text>
                    <HStack mt={4}>
                      <Text fontWeight="bold">{new Date(event.start_time).toLocaleDateString()}</Text>
                      <Button size="sm" variant="link">
                        {t('community.viewEvent')}
                      </Button>
                    </HStack>
                  </CardBody>
                </Card>
              ))}
            </VStack>
          </TabPanel>

          {/* Members Tab */}
          <TabPanel>
            <Wrap spacing={4}>
              {members.map(member => (
                <WrapItem key={member.id}>
                  <VStack>
                    <Avatar 
                      name={member.name} 
                      src={member.avatar_url}
                      size="lg"
                    />
                    <Text fontWeight="bold">{member.name}</Text>
                    <Badge colorScheme="blue">{member.role}</Badge>
                  </VStack>
                </WrapItem>
              ))}
            </Wrap>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

CommunityLanding.propTypes = {
  // Optional community ID (if not provided in URL)
  communityId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),

  // Feature flags
  showEvents: PropTypes.bool,
  showProjects: PropTypes.bool,
  showMembers: PropTypes.bool,
  showWeather: PropTypes.bool,

  // Limits
  maxProjects: PropTypes.number,
  maxEvents: PropTypes.number,
  maxMembers: PropTypes.number,

  // Callbacks
  onJoin: PropTypes.func,
  onLeave: PropTypes.func,

  // Custom components
  customTabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      content: PropTypes.elementType.isRequired,
      icon: PropTypes.elementType
    })
  ),

  // Custom statistics
  customStats: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]).isRequired,
      icon: PropTypes.elementType
    })
  ),

  // Optional styling
  containerStyle: PropTypes.object,
  headerStyle: PropTypes.object,
  tabsStyle: PropTypes.object
};

CommunityLanding.defaultProps = {
  communityId: undefined,
  showEvents: true,
  showProjects: true,
  showMembers: true,
  showWeather: true,
  maxProjects: 3,
  maxEvents: 3,
  maxMembers: 10,
  onJoin: undefined,
  onLeave: undefined,
  customTabs: [],
  customStats: [],
  containerStyle: {},
  headerStyle: {},
  tabsStyle: {}
};

export default CommunityLanding;
