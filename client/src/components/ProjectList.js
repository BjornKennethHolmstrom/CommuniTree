import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProjectList = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchProjects(currentPage, search, filter);
  }, [currentPage, search, filter]);

  const fetchProjects = async (page, searchTerm, filterTerm) => {
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
      setProjects(data.projects);
      setTotalPages(data.totalPages);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setCurrentPage(1);
  };

  if (loading) return <div>Loading projects...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Community Projects</h2>
      <Link to="/projects/new" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4 inline-block">
        Create New Project
      </Link>
      <div className="mb-4 flex">
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={handleSearchChange}
          className="border p-2 mr-2 flex-grow"
        />
        <select
          value={filter}
          onChange={handleFilterChange}
          className="border p-2"
        >
          <option value="">All Statuses</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      {projects.length === 0 ? (
        <p>No projects available.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {projects.map((project) => (
              <li key={project.id} className="border p-4 rounded">
                <h3 className="text-xl font-semibold">{project.title}</h3>
                <p className="mt-2">{project.description}</p>
                <p className="mt-2">Status: {project.status}</p>
                <Link to={`/projects/${project.id}`} className="text-blue-500 hover:underline mt-2 inline-block">
                  View Details
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-center">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`mx-1 px-3 py-1 rounded ${
                  currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectList;
