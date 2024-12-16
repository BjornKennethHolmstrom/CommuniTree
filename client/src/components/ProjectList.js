import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCommunity } from '../contexts/CommunityContext';
import { useError } from '../contexts/ErrorContext';
import { useAuth } from '../contexts/AuthContext';
import { formatProjectStatus, filterProjects, sortProjects, parseSkillsList } from '../utils/projectUtils';
import {
  Box,
  Button,
  Input,
  Select,
  Alert,
  AlertIcon,
  VStack,
  Heading,
  Text,
  Flex,
  Badge,
  HStack,
} from '@chakra-ui/react';

const ProjectList = ({ 
  initialFilter,
  initialSort = 'date',
  pageSize = 10,
  showSearch = true,
  showFilters = true,
  showCreateButton = true,
  onProjectSelect
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { showError } = useError();
  const { activeCommunities } = useCommunity();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState(initialFilter);
  const [skillsFilter, setSkillsFilter] = useState('');
  const [sortBy, setSortBy] = useState(initialSort);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchProjects = async (page, searchTerm, filterTerm, skills) => {
    if (!hasMore && page > 1) return;

    setLoading(true);
    try {
      const communityIds = activeCommunities.map(c => c.id).join(',');
      const parsedSkills = parseSkillsList(skills);
      
      const queryParams = new URLSearchParams({
        page: page,
        limit: 10,
        search: searchTerm,
        filter: filterTerm,
        communities: communityIds,
        skills: parsedSkills.join(',')
      });

      const response = await fetch(`/api/projects?${queryParams}`, {
        headers: {
          'x-auth-token': user.token
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      
      const data = await response.json();
      
      if (page === 1) {
        setProjects(data.projects);
      } else {
        setProjects(prev => [...prev, ...data.projects]);
      }
      
      setHasMore(data.projects.length === 10);
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeCommunities.length > 0) {
      setPage(1);
      fetchProjects(1, search, filter, skillsFilter);
    } else {
      setProjects([]);
    }
  }, [search, filter, skillsFilter, activeCommunities]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSkillsFilterChange = (e) => {
    setSkillsFilter(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    const sortedProjects = sortProjects([...projects], e.target.value);
    setProjects(sortedProjects);
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProjects(nextPage, search, filter, skillsFilter);
  };

  const filteredProjects = filterProjects(projects, {
    searchTerm: search,
    status: filter,
    skills: parseSkillsList(skillsFilter)
  });

  const getCommunityName = (communityId) => {
    const community = activeCommunities.find(c => c.id === communityId);
    return community ? community.name : t('projects.unknownCommunity');
  };

  if (activeCommunities.length === 0) {
    return (
      <Alert status="info">
        <AlertIcon />
        {t('projects.selectCommunity')}
      </Alert>
    );
  }

  return (
    <Box maxW="4xl" mx="auto" mt={8}>
      <Flex justify="space-between" align="center" mb={4}>
        <Heading as="h2" size="xl">{t('projects.title')}</Heading>
        <Button as={Link} to="/projects/new" colorScheme="blue">
          {t('projects.createNew')}
        </Button>
      </Flex>

      <Flex mb={4} gap={4}>
        <Input
          placeholder={t('projects.searchPlaceholder')}
          value={search}
          onChange={handleSearchChange}
          flex={1}
        />
        <Select
          value={filter}
          onChange={handleFilterChange}
          w="200px"
        >
          <option value="">{t('projects.filterAll')}</option>
          <option value="open">{t('projects.filterOpen')}</option>
          <option value="in_progress">{t('projects.filterInProgress')}</option>
          <option value="completed">{t('projects.filterCompleted')}</option>
        </Select>
        <Select
          value={sortBy}
          onChange={handleSortChange}
          w="200px"
        >
          <option value="date">{t('projects.sortDate')}</option>
          <option value="status">{t('projects.sortStatus')}</option>
        </Select>
      </Flex>

      <Input
        placeholder={t('projects.skillsFilterPlaceholder')}
        value={skillsFilter}
        onChange={handleSkillsFilterChange}
        mb={4}
      />

      {filteredProjects.length === 0 && !loading ? (
        <Text>{t('projects.noProjects')}</Text>
      ) : (
        <VStack spacing={4} align="stretch">
          {filteredProjects.map((project) => (
            <Box
              key={project.id}
              borderWidth={1}
              borderRadius="lg"
              p={4}
              _hover={{ shadow: 'md' }}
            >
              <Flex justify="space-between" align="start">
                <Box>
                  <Heading as="h3" size="md">{project.title}</Heading>
                  <HStack spacing={2} mt={2}>
                    <Badge colorScheme={
                      project.status === 'open' ? 'green' : 
                      project.status === 'in_progress' ? 'blue' : 'gray'
                    }>
                      {formatProjectStatus(project.status)}
                    </Badge>
                    <Badge colorScheme="purple">
                      {getCommunityName(project.community_id)}
                    </Badge>
                  </HStack>
                  <Text mt={2}>{project.description}</Text>
                  {project.required_skills?.length > 0 && (
                    <HStack mt={2} spacing={2}>
                      {project.required_skills.map((skill, index) => (
                        <Badge key={index} colorScheme="cyan">{skill}</Badge>
                      ))}
                    </HStack>
                  )}
                </Box>
                <Button
                  as={Link}
                  to={`/projects/${project.id}`}
                  variant="ghost"
                  colorScheme="blue"
                  size="sm"
                >
                  {t('projects.viewDetails')}
                </Button>
              </Flex>
            </Box>
          ))}
        </VStack>
      )}

      {hasMore && !loading && (
        <Button
          onClick={loadMore}
          mt={4}
          mx="auto"
          display="block"
          colorScheme="blue"
          variant="outline"
        >
          {t('projects.loadMore')}
        </Button>
      )}

      {loading && (
        <Text textAlign="center" mt={4}>{t('projects.loading')}</Text>
      )}
    </Box>
  );
};

ProjectList.propTypes = {
  // Optional initial values
  initialFilter: PropTypes.string,
  initialSort: PropTypes.oneOf(['date', 'status', 'title']),
  pageSize: PropTypes.number,

  // Feature flags
  showSearch: PropTypes.bool,
  showFilters: PropTypes.bool,
  showCreateButton: PropTypes.bool,

  // Optional callbacks
  onProjectSelect: PropTypes.func,

  // Optional styling
  containerStyle: PropTypes.object,
  listStyle: PropTypes.object
};

ProjectList.defaultProps = {
  initialFilter: '',
  initialSort: 'date',
  pageSize: 10,
  showSearch: true,
  showFilters: true,
  showCreateButton: true,
  onProjectSelect: undefined,
  containerStyle: {},
  listStyle: {}
};

export default ProjectList;
