import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Box, VStack, Heading, Text, Button, Input, Textarea, Spinner, Alert, AlertIcon, FormControl, FormLabel } from '@chakra-ui/react';

const UserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && user.id) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${user.id}`, {
        headers: { 'x-auth-token': user.token }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }
      const data = await response.json();
      setProfile(data);
      setName(data.name || data.username || '');
      setBio(data.bio || '');
      setSkills(data.skills || []);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': user.token
        },
        body: JSON.stringify({ name, bio, skills })
      });
      if (response.ok) {
        setEditing(false);
        fetchUserProfile();
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      setError(error.message);
    }
  };

  if (loading) return <Spinner size="xl" />;
  if (error) return <Alert status="error"><AlertIcon />{error}</Alert>;
  if (!profile) return <Alert status="info"><AlertIcon />No profile data available.</Alert>;

  return (
    <Box maxW="2xl" mx="auto" mt={8}>
      <Heading as="h2" size="xl" mb={4}>My Profile</Heading>
      {editing ? (
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>Bio</FormLabel>
              <Textarea value={bio} onChange={(e) => setBio(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>Skills (comma-separated)</FormLabel>
              <Input
                value={skills.join(', ')}
                onChange={(e) => setSkills(e.target.value.split(',').map(skill => skill.trim()).filter(Boolean))}
              />
            </FormControl>
            <Button type="submit" colorScheme="blue">Save Changes</Button>
          </VStack>
        </form>
      ) : (
        <VStack align="stretch" spacing={4}>
          <Text><strong>Name:</strong> {profile.name || profile.username}</Text>
          <Text><strong>Email:</strong> {profile.email}</Text>
          <Text><strong>Bio:</strong> {profile.bio || 'No bio provided'}</Text>
          <Text><strong>Skills:</strong> {profile.skills?.join(', ') || 'No skills listed'}</Text>
          <Text><strong>Member since:</strong> {new Date(profile.created_at).toLocaleDateString()}</Text>
          <Button onClick={() => setEditing(true)} colorScheme="green">Edit Profile</Button>
        </VStack>
      )}
    </Box>
  );
};

export default UserProfile;
