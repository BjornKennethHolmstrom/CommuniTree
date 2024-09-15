import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { debounce } from 'lodash';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Alert } from '@/components/ui/alert';

const ProjectList = () => {
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
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Community Projects</h2>
      <Link to="/projects/new">
        <Button className="mb-4">Create New Project</Button>
      </Link>
      <div className="mb-4 flex space-x-2">
        <Input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={handleSearchChange}
          className="flex-grow"
        />
        <Select value={filter} onChange={handleFilterChange}>
          <option value="">All Statuses</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </Select>
      </div>
      {error && <Alert variant="destructive" className="mb-4">{error}</Alert>}
      {projects.length === 0 && !loading ? (
        <p>No projects available.</p>
      ) : (
        <ul className="space-y-4">
          {projects.map((project) => (
            <li key={project.id} className="border p-4 rounded">
              <h3 className="text-xl font-semibold">{project.title}</h3>
              <p className="mt-2">{project.description}</p>
              <p className="mt-2">Status: {project.status}</p>
              <Link to={`/projects/${project.id}`}>
                <Button variant="link" className="mt-2">View Details</Button>
              </Link>
            </li>
          ))}
        </ul>
      )}
      {loading && <p className="text-center mt-4">Loading projects...</p>}
      {hasMore && !loading && (
        <Button onClick={loadMore} className="mt-4 mx-auto block">
          Load More
        </Button>
      )}
    </div>
  );
};

export default ProjectList;
