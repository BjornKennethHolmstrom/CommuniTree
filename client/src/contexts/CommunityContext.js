import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CommunityContext = createContext();

export const CommunityProvider = ({ children }) => {
  const { user } = useAuth();
  const [activeCommunities, setActiveCommunities] = useState([]);
  const [availableCommunities, setAvailableCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user's communities on mount
  useEffect(() => {
    const fetchUserCommunities = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Fetch communities the user is a member of
        const memberResponse = await fetch('/api/users/communities', {
          headers: { 'x-auth-token': user.token }
        });
        const memberData = await memberResponse.json();
        setActiveCommunities(memberData);

        // Fetch all available communities
        const availableResponse = await fetch('/api/communities', {
          headers: { 'x-auth-token': user.token }
        });
        const availableData = await availableResponse.json();
        setAvailableCommunities(availableData);
      } catch (err) {
        console.error('Error fetching communities:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCommunities();
  }, [user]);

  // Toggle community selection
  const toggleCommunity = (communityId) => {
    setActiveCommunities(prev => {
      const isSelected = prev.some(c => c.id === communityId);
      if (isSelected) {
        return prev.filter(c => c.id !== communityId);
      } else {
        const communityToAdd = availableCommunities.find(c => c.id === communityId);
        return [...prev, communityToAdd];
      }
    });
  };

  // Join a community
  const joinCommunity = async (communityId) => {
    try {
      const response = await fetch(`/api/communities/${communityId}/join`, {
        method: 'POST',
        headers: { 'x-auth-token': user.token }
      });
      if (!response.ok) throw new Error('Failed to join community');
      
      // Add to active communities if not already there
      setActiveCommunities(prev => {
        if (prev.some(c => c.id === communityId)) return prev;
        const communityToAdd = availableCommunities.find(c => c.id === communityId);
        return [...prev, communityToAdd];
      });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Leave a community
  const leaveCommunity = async (communityId) => {
    try {
      const response = await fetch(`/api/communities/${communityId}/leave`, {
        method: 'POST',
        headers: { 'x-auth-token': user.token }
      });
      if (!response.ok) throw new Error('Failed to leave community');
      
      // Remove from active communities
      setActiveCommunities(prev => prev.filter(c => c.id !== communityId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Get filtered content based on active communities
  const getFilteredContent = async (contentType, options = {}) => {
    const communityIds = activeCommunities.map(c => c.id).join(',');
    const queryParams = new URLSearchParams({
      ...options,
      communities: communityIds
    });

    try {
      const response = await fetch(`/api/${contentType}?${queryParams}`, {
        headers: { 'x-auth-token': user.token }
      });
      if (!response.ok) throw new Error(`Failed to fetch ${contentType}`);
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return (
    <CommunityContext.Provider value={{
      activeCommunities,
      availableCommunities,
      loading,
      error,
      toggleCommunity,
      joinCommunity,
      leaveCommunity,
      getFilteredContent
    }}>
      {children}
    </CommunityContext.Provider>
  );
};

export const useCommunity = () => {
  const context = useContext(CommunityContext);
  if (context === undefined) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }
  return context;
};
