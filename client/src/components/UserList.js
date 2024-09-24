import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import AddUserForm from './AddUserForm';
import UserDetails from './UserDetails';
import EditUserForm from './EditUserForm';
import { useAuth } from './AuthContext';
import {
  Button, Input, Alert, AlertIcon,
  Box, VStack, Heading, Text, Flex, Spacer,
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalCloseButton, ModalBody, useDisclosure
} from '@chakra-ui/react';

function UserList() {
  const { t } = useTranslation();
  const { api } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error.response?.data?.msg || 'Failed to fetch users');
    }
  }, [api]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleUserAdded = (newUser) => {
    setUsers([...users, newUser]);
  };

  const handleUserUpdated = (updatedUser) => {
    setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
    setEditingUser(null);
  };

  const handleDeleteUser = async (userId) => {
    try {
      await api.delete(`/users/${userId}`);
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      setError(error.response?.data?.msg || 'Failed to delete user');
    }
  };

  const filteredUsers = Array.isArray(users)
    ? users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <Box maxW="4xl" mx="auto" mt={8}>
      <Heading as="h2" size="xl" mb={4}>{t('userManagement.title')}</Heading>
      <Button onClick={onOpen} colorScheme="blue" mb={4}>
        {t('userManagement.addUser')}
      </Button>
      <Input
        placeholder={t('userManagement.search')}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        mb={4}
      />
      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}
      <VStack spacing={4} align="stretch">
        {filteredUsers.map(user => (
          <Box key={user.id} borderWidth={1} borderRadius="lg" p={4}>
            <Flex align="center">
              <Text>{user.username} - {user.email}</Text>
              <Spacer />
              <Button size="sm" onClick={() => setSelectedUser(user)} mr={2}>
                {t('userManagement.details')}
              </Button>
              <Button size="sm" onClick={() => setEditingUser(user)} mr={2}>
                {t('userManagement.edit')}
              </Button>
              <Button size="sm" colorScheme="red" onClick={() => handleDeleteUser(user.id)}>
                {t('userManagement.delete')}
              </Button>
            </Flex>
          </Box>
        ))}
      </VStack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('userManagement.addUser')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <AddUserForm onUserAdded={handleUserAdded} onClose={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
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
    </Box>
  );
}

export default UserList;
