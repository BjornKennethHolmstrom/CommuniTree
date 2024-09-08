import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProjectDetails = () => {
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [volunteers, setVolunteers] = useState([]);
  const { id } = useParams();
  const [status, setStatus] = useState(project.status);


  useEffect(() => {
    fetchProjectDetails();
    fetchProjectVolunteers();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        headers: {
          'x-auth-token': user.token
        }
      });
      const data = await response.json();
      setProject(data);
    } catch (error) {
      console.error('Error fetching project details:', error);
    }
  };

  const fetchProjectVolunteers = async () => {
    try {
      const response = await fetch(`/api/projects/${id}/volunteers`, {
        headers: {
          'x-auth-token': user.token
        }
      });
      const data = await response.json();
      setVolunteers(data);
    } catch (error) {
      console.error('Error fetching project volunteers:', error);
    }
  };

  const handleVolunteerSignUp = async () => {
    try {
      // Assume we have the current user's ID stored in localStorage
      const userId = localStorage.getItem('userId');
      const response = await fetch('/api/projects/volunteer', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': user.token
        },
        body: JSON.stringify({ project_id: id }),
      });
      if (response.ok) {
        alert('You have successfully signed up as a volunteer!');
        fetchProjectVolunteers();
      }
    } catch (error) {
      console.error('Error signing up as volunteer:', error);
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
      if (response.ok) {
        setStatus(newStatus);
        alert('Project status updated successfully');
      }
    } catch (error) {
      console.error('Error updating project status:', error);
    }
  };

  if (!project) return <div>Loading...</div>;

  return (
    <div className="project-details">
      <h2>{project.title}</h2>
      <p>{project.description}</p>
      <p>Required Skills: {project.required_skills.join(', ')}</p>
      <p>Time Commitment: {project.time_commitment}</p>
      <p>Location: {project.location}</p>
      <button onClick={handleVolunteerSignUp}>Sign Up as Volunteer</button>
      
      <h3>Current Volunteers</h3>
      <ul>
        {volunteers.map((volunteer) => (
          <li key={volunteer.id}>{volunteer.name}</li>
        ))}
      </ul>
    </div>
    <div>
      <label>Update Status:</label>
      <select value={status} onChange={(e) => updateProjectStatus(e.target.value)}>
        <option value="open">Open</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
    </div>
  );
};

export default ProjectDetails;
