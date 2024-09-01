import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AddUserForm from './AddUserForm';
import UserDetails from './UserDetails';
import EditUserForm from './EditUserForm';
import { useAuth } from './AuthContext';

function UserList() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetch('/api/users', {
      headers: {
        'x-auth-token': user.token
      }
    })
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
  };

  const handleUserAdded = (newUser) => {
    setUsers([...users, newUser]);
  };

  const handleUserUpdated = (updatedUser) => {
    setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
    setEditingUser(null);
  };

  const handleDeleteUser = (userId) => {
    fetch(`/api/users/${userId}`, { 
      method: 'DELETE',
      headers: {
        'x-auth-token': user.token
      }
    })
      .then(() => {
        setUsers(users.filter(user => user.id !== userId));
      })
      .catch(error => console.error('Error deleting user:', error));
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>{t('userManagement.title')}</h2>
      <AddUserForm onUserAdded={handleUserAdded} />
      <input
        type="text"
        placeholder={t('userManagement.search')}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul>
        {filteredUsers.map(user => (
          <li key={user.id}>
            {user.username} - {user.email}
            <button onClick={() => setSelectedUser(user)}>{t('userManagement.details')}</button>
            <button onClick={() => setEditingUser(user)}>{t('userManagement.edit')}</button>
            <button onClick={() => handleDeleteUser(user.id)}>{t('userManagement.delete')}</button>
          </li>
        ))}
      </ul>
      {selectedUser && (
        <UserDetails 
          userId={selectedUser.id} 
          onClose={() => setSelectedUser(null)} 
        />
      )}
      {editingUser && (
        <EditUserForm 
          user={editingUser} 
          onUserUpdated={handleUserUpdated}
          onCancel={() => setEditingUser(null)}
        />
      )}
    </div>
  );
}

export default UserList;
