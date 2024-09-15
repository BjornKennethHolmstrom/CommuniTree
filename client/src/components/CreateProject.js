import React, { useState } from 'react';
import ProjectForm from './ProjectForm';
import { useAuth } from './AuthContext';
import { Alert } from '@/components/ui/alert';

const CreateProject = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (projectData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': user.token
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        throw new Error('Failed to create project');
      }

      setSuccess(true);
      // Optionally, redirect to the new project page
      // const newProject = await response.json();
      // history.push(`/projects/${newProject.id}`);
    } catch (error) {
      console.error('Error creating project:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Create New Project</h2>
      {error && (
        <Alert variant="destructive" className="mb-4">
          {error}
        </Alert>
      )}
      {success && (
        <Alert className="mb-4">
          Project created successfully!
        </Alert>
      )}
      <ProjectForm onSubmit={handleSubmit} isLoading={loading} />
    </div>
  );
};

export default CreateProject;
