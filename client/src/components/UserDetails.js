import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from './AuthContext';

function UserDetails({ userId, onClose }) {
  const { t } = useTranslation();
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

  if (!user) return <div>{t('userDetails.loading')}</div>;

  return (
    <div className="user-details">
      <h3>{user.username}</h3>
      <p>{t('userDetails.email')}: {user.email}</p>
      <p>{t('userDetails.createdAt')}: {new Date(user.created_at).toLocaleString()}</p>
      <button onClick={onClose}>{t('userDetails.close')}</button>
    </div>
  );
}

export default UserDetails;
