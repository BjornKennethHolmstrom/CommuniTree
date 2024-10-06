import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useTranslation } from 'react-i18next';

function EditUserForm({ user, onUserUpdated, onCancel }) {
  const { t } = useTranslation();
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const { user: authUser } = useAuth();

  useEffect(() => {
    setUsername(user.username);
    setEmail(user.email);
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`/api/users/${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': authUser.token
      },
      body: JSON.stringify({ username, email }),
    })
      .then(response => response.json())
      .then(data => {
        onUserUpdated(data);
      })
      .catch(error => console.error(t('editUserForm.errorUpdating'), error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder={t('editUserForm.username')}
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t('editUserForm.email')}
        required
      />
      <button type="submit">{t('editUserForm.updateUser')}</button>
      <button type="button" onClick={onCancel}>{t('editUserForm.cancel')}</button>
    </form>
  );
}

export default EditUserForm;
