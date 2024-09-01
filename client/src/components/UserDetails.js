import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

function UserDetails({ userId, onClose }) {
  const [user, setUser] = useState(null);
  const { user: authUser } = useAuth();

  useEffect(() => {
    fetch(`/api/users/${userId}`, {
      headers: {
        'x-auth-token': authUser.token
      }
    })
      .then(response => response.json())
      .then(data => setUser(data))
      .catch(error => console.error('Error fetching user details:', error));
  }, [userId, authUser.token]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="user-details">
      <h3>{user.username}</h3>
      <p>Email: {user.email}</p>
      <p>Created at: {new Date(user.created_at).toLocaleString()}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default UserDetails;
