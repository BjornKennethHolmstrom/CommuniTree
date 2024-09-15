import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import Comments from './Comments';
import FileUpload from './FileUpload';
import ProjectForm from './ProjectForm';

const ProjectDetails = () => {
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

  const { user } = useAuth();

  const canEditEvent = (event) => {
    return user.role === 'admin' || event.organizer_id === user.id;
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
        throw new Error('Failed to fetch project details');
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
        throw new Error('Failed to fetch project volunteers');
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
        throw new Error('Failed to sign up as volunteer');
      }
      alert('You have successfully signed up as a volunteer!');
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
        throw new Error('Failed to update project status');
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
        throw new Error('Failed to update project');
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
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const response = await fetch(`/api/projects/${id}`, {
          method: 'DELETE',
          headers: {
            'x-auth-token': user.token
          }
        });
        if (!response.ok) {
          throw new Error('Failed to delete project');
        }
        navigate('/projects');
      } catch (error) {
        console.error('Error deleting project:', error);
        setError(error.message);
      }
    }
  };

  if (loading) return <div>Loading project details...</div>;
  if (error) return <Alert variant="destructive">{error}</Alert>;
  if (!project) return <div>Project not found</div>;

  return (
    <div className="project-details max-w-4xl mx-auto mt-8">
      {isEditing ? (
        <ProjectForm project={project} onSubmit={handleEditProject} isLoading={loading} />
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-4">{project.title}</h2>
          <p className="mb-2">{project.description}</p>
          <p className="mb-2">Required Skills: {project.required_skills.join(', ')}</p>
          <p className="mb-2">Time Commitment: {project.time_commitment}</p>
          <p className="mb-2">Location: {project.location}</p>
          <Button onClick={handleVolunteerSignUp} className="mb-4">Sign Up as Volunteer</Button>
          
          {canEditProject(project) && (
            <div className="mb-4">
              <Button onClick={() => setIsEditing(true)} className="mr-2">Edit Project</Button>
              <Button onClick={handleDeleteProject} variant="destructive">Delete Project</Button>
            </div>
          )}
          
          <h3 className="text-xl font-semibold mb-2">Current Volunteers</h3>
          <ul className="mb-4">
            {volunteers.map((volunteer) => (
              <li key={volunteer.id}>{volunteer.name}</li>
            ))}
          </ul>

          <div className="mb-4">
            <label className="block mb-2">Update Status:</label>
            <select 
              value={status} 
              onChange={(e) => updateProjectStatus(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <FileUpload projectId={id} />
          <Comments projectId={id} />
        </>
      )}
    </div>
  );
};

export default ProjectDetails;
