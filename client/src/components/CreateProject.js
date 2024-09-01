import React from 'react';
import ProjectForm from './ProjectForm';

const CreateProject = () => {
  const handleSubmit = async (projectData) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        throw new Error('Failed to create project');
      }

      // Handle successful creation (e.g., show a success message or redirect)
    } catch (error) {
      console.error('Error creating project:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Create New Project</h2>
      <ProjectForm onSubmit={handleSubmit} />
    </div>
  );
};
