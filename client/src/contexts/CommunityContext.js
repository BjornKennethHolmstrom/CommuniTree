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
        setActiveCommunities([]);
        setAvailableCommunities([]);
        setLoading(false);
        return;
      }

      try {
        // Fetch communities the user is a member of
        const memberResponse = await fetch('/api/users/communities', {
          headers: { 'x-auth-token': user.token }
        });
        const memberData = await memberResponse.json();
        setActiveCommunities(Array.isArray(memberData) ? memberData : []);

        // Fetch all available communities
        const availableResponse = await fetch('/api/communities', {
          headers: { 'x-auth-token': user.token }
        });
        const availableData = await availableResponse.json();
        setAvailableCommunities(Array.isArray(availableData) ? availableData : []);
      } catch (err) {
        console.error('Error fetching communities:', err);
        setError(err.message);
        setActiveCommunities([]);
        setAvailableCommunities([]);
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
        return communityToAdd ? [...prev, communityToAdd] : prev;
      }
    });
  };

  // Join a community
  const joinCommunity = async (communityId) => {
    if (!user) return;
    
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
        return communityToAdd ? [...prev, communityToAdd] : prev;
      });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Leave a community
  const leaveCommunity = async (communityId) => {
    if (!user) return;

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

  const value = {
    activeCommunities,
    availableCommunities,
    loading,
    error,
    toggleCommunity,
    joinCommunity,
    leaveCommunity
  };

  return (
    <CommunityContext.Provider value={value}>
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
