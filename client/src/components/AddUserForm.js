import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useTranslation } from 'react-i18next';

function AddUserForm({ onUserAdded }) {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const { user } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': user.token
      },
      body: JSON.stringify({ username, email }),
    })
      .then(response => response.json())
      .then(data => {
        onUserAdded(data);
        setUsername('');
        setEmail('');
      })
      .catch(error => console.error(t('addUserForm.errorAdding'), error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder={t('addUserForm.username')}
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t('addUserForm.email')}
        required
      />
      <button type="submit">{t('addUserForm.addUser')}</button>
    </form>
  );
}

export default AddUserForm;
