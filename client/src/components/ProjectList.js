import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { debounce } from 'lodash';
import {
  Button, Input, Select, Alert, AlertIcon,
  Box, VStack, Heading, Text, Flex
} from '@chakra-ui/react';

const ProjectList = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');

  const fetchProjects = useCallback(async (page, searchTerm, filterTerm) => {
    if (!hasMore) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/projects?page=${page}&limit=10&search=${searchTerm}&filter=${filterTerm}`, {
        headers: {
          'x-auth-token': user.token
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data = await response.json();
      setProjects(prevProjects => [...prevProjects, ...data.projects]);
      setHasMore(data.projects.length === 10);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [user.token, hasMore]);

  const debouncedFetch = useCallback(
    debounce((search, filter) => {
      setProjects([]);
      setPage(1);
      fetchProjects(1, search, filter);
    }, 300),
    [fetchProjects]
  );

  useEffect(() => {
    debouncedFetch(search, filter);
  }, [search, filter, debouncedFetch]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
    fetchProjects(page + 1, search, filter);
  };

  return (
    <Box maxW="4xl" mx="auto" mt={8}>
      <Heading as="h2" size="xl" mb={4}>{t('projects.title')}</Heading>
      <Link to="/projects/new">
        <Button colorScheme="blue" mb={4}>{t('projects.createNew')}</Button>
      </Link>
      <Flex mb={4}>
        <Input
          placeholder={t('projects.searchPlaceholder')}
          value={search}
          onChange={handleSearchChange}
          mr={2}
        />
        <Select value={filter} onChange={handleFilterChange}>
          <option value="">{t('projects.filterAll')}</option>
          <option value="open">{t('projects.filterOpen')}</option>
          <option value="in_progress">{t('projects.filterInProgress')}</option>
          <option value="completed">{t('projects.filterCompleted')}</option>
        </Select>
      </Flex>
      {error && <Alert status="error" mb={4}><AlertIcon />{error}</Alert>}
      {projects.length === 0 && !loading ? (
        <Text>{t('projects.noProjects')}</Text>
      ) : (
        <VStack spacing={4} align="stretch">
          {projects.map((project) => (
            <Box key={project.id} borderWidth={1} borderRadius="lg" p={4}>
              <Heading as="h3" size="md">{project.title}</Heading>
              <Text mt={2}>{project.description}</Text>
              <Text mt={2}>{t('projects.status')}: {project.status}</Text>
              <Button as={Link} to={`/projects/${project.id}`} variant="link" mt={2}>
                {t('projects.viewDetails')}
              </Button>
            </Box>
          ))}
        </VStack>
      )}
      {loading && <Text textAlign="center" mt={4}>{t('projects.loading')}</Text>}
      {hasMore && !loading && (
        <Button onClick={loadMore} mt={4} mx="auto" display="block">
          {t('projects.loadMore')}
        </Button>
      )}
    </Box>
  );
};

export default ProjectList;
