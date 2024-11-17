import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useProject = (projectId) => {
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [volunteerStatus, setVolunteerStatus] = useState(null);

  const fetchProject = useCallback(async () => {
    if (!projectId || projectId === 'new') {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        headers: {
          'x-auth-token': user.token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch project');
      }

      const data = await response.json();
      setProject(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setProject(null);
    } finally {
      setLoading(false);
    }
  }, [projectId, user.token]);

  const updateProject = async (updateData) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': user.token
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error('Failed to update project');
      }

      const updatedProject = await response.json();
      setProject(updatedProject);
      setError(null);
      return updatedProject;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUpVolunteer = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/projects/volunteer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': user.token
        },
        body: JSON.stringify({ project_id: projectId })
      });

      if (!response.ok) {
        throw new Error('Failed to sign up as volunteer');
      }

      const result = await response.json();
      setVolunteerStatus('signed_up');
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
    return () => {
      setProject(null);
      setLoading(false);
      setError(null);
    };
  }, [fetchProject]);

  return {
    project,
    loading,
    error,
    volunteerStatus,
    updateProject,
    signUpVolunteer,
    refreshProject: fetchProject
  };
};
