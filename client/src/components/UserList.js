import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  VStack,
  Heading,
  Text,
  Input,
  Button,
  Alert,
  AlertIcon,
  useDisclosure,
  Spinner,
} from '@chakra-ui/react';

function UserList() {
  const { t } = useTranslation();
  const { api } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.response?.data?.message || 'Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={8}>
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error" mb={4}>
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <Box maxW="4xl" mx="auto" mt={8}>
      <Heading mb={6}>{t('userManagement.title')}</Heading>
      
      <Input
        placeholder={t('userManagement.search')}
        mb={4}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <VStack spacing={4} align="stretch">
        {users
          .filter(user => 
            user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map(user => (
            <Box
              key={user.id}
              p={4}
              borderWidth={1}
              borderRadius="lg"
              _hover={{ shadow: 'md' }}
            >
              <Text fontWeight="bold">{user.name || user.username}</Text>
              <Text color="gray.600">{user.email}</Text>
            </Box>
          ))}
      </VStack>
    </Box>
  );
}

export default UserList;
