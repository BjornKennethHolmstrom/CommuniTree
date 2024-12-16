import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
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

function UserList({
  initialSearchTerm = '',
  showSearch = true,
  showActions = true,
  onUserSelect,
  excludeCurrentUser = true,
  maxUsers,
  sortBy = 'username',
  customFilter
}) {
  const { t } = useTranslation();
  const { api } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/users');
      let filteredUsers = response.data;
      
      if (excludeCurrentUser) {
        filteredUsers = filteredUsers.filter(user => user.id !== currentUser.id);
      }

      if (customFilter) {
        filteredUsers = filteredUsers.filter(customFilter);
      }

      if (maxUsers) {
        filteredUsers = filteredUsers.slice(0, maxUsers);
      }

      setUsers(filteredUsers);
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

  const filteredUsers = users.filter(user => 
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      
      {showSearch && (
        <Input
          placeholder={t('userManagement.search')}
          mb={4}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      )}

      <VStack spacing={4} align="stretch">
        {filteredUsers.map(user => (
          <Box
            key={user.id}
            p={4}
            borderWidth={1}
            borderRadius="lg"
            _hover={{ shadow: 'md' }}
            onClick={() => onUserSelect && onUserSelect(user)}
            cursor={onUserSelect ? 'pointer' : 'default'}
          >
            <Text fontWeight="bold">{user.name || user.username}</Text>
            <Text color="gray.600">{user.email}</Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}

UserList.propTypes = {
  // Optional initial values
  initialSearchTerm: PropTypes.string,

  // Feature flags
  showSearch: PropTypes.bool,
  showActions: PropTypes.bool,
  excludeCurrentUser: PropTypes.bool,

  // Optional callbacks
  onUserSelect: PropTypes.func,

  // Optional configuration
  maxUsers: PropTypes.number,
  sortBy: PropTypes.oneOf(['username', 'name', 'email', 'created_at']),
  customFilter: PropTypes.func,

  // Optional styling
  containerStyle: PropTypes.object,
  userCardStyle: PropTypes.object
};

UserList.defaultProps = {
  initialSearchTerm: '',
  showSearch: true,
  showActions: true,
  excludeCurrentUser: true,
  onUserSelect: undefined,
  maxUsers: undefined,
  sortBy: 'username',
  customFilter: undefined,
  containerStyle: {},
  userCardStyle: {}
};

export default UserList;
