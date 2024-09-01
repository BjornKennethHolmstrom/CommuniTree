import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ProjectDetails = () => {
  const [project, setProject] = useState(null);
  const [volunteers, setVolunteers] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    fetchProjectDetails();
    fetchProjectVolunteers();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      const response = await fetch(`/api/projects/${id}`);
      const data = await response.json();
      setProject(data);
    } catch (error) {
      console.error('Error fetching project details:', error);
    }
  };

  const fetchProjectVolunteers = async () => {
    try {
      const response = await fetch(`/api/projects/${id}/volunteers`);
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: id, user_id: userId }),
      });
      if (response.ok) {
        alert('You have successfully signed up as a volunteer!');
        fetchProjectVolunteers();
      }
    } catch (error) {
      console.error('Error signing up as volunteer:', error);
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
  );
};

export default ProjectDetails;
