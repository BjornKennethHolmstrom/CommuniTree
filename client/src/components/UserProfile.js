import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const UserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        headers: { 'x-auth-token': user.token }
      });
      const data = await response.json();
      setProfile(data);
      setName(data.name || data.username);
      setBio(data.bio || '');
      setSkills(data.skills || []);
    } catch (error) {
      console.error('Error fetching user profile:', error);
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
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      {editing ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="bio" className="block mb-2">Bio</label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="skills" className="block mb-2">Skills (comma-separated)</label>
            <input
              type="text"
              id="skills"
              value={skills.join(', ')}
              onChange={(e) => setSkills(e.target.value.split(',').map(skill => skill.trim()))}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Save Changes
          </button>
        </form>
      ) : (
        <div>
          <p><strong>Name:</strong> {profile.name || profile.username}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Bio:</strong> {profile.bio || 'No bio provided'}</p>
          <p><strong>Skills:</strong> {profile.skills?.join(', ') || 'No skills listed'}</p>
          <p><strong>Member since:</strong> {new Date(profile.created_at).toLocaleDateString()}</p>
          <button onClick={() => setEditing(true)} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4">
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
