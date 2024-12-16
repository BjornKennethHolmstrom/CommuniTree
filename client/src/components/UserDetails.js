import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  VStack,
  Heading,
  Text,
  Spinner,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton
} from '@chakra-ui/react';

function UserDetails({ 
  userId, 
  onClose,
  showModal = true,
  showEmail = true,
  showCreatedAt = true,
  additionalFields = [],
  onUserLoad
}) {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user: authUser } = useAuth();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/users/${userId}`, {
          headers: {
            'x-auth-token': authUser.token
          }
        });
        const data = await response.json();
        setUser(data);
        if (onUserLoad) {
          onUserLoad(data);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId, authUser.token, onUserLoad]);

  const renderContent = () => {
    if (loading) return <Spinner />;
    if (error) return <Text color="red.500">{error}</Text>;
    if (!user) return <Text>{t('userDetails.notFound')}</Text>;

    return (
      <VStack align="start" spacing={3}>
        <Heading size="md">{user.username}</Heading>
        {showEmail && <Text>{t('userDetails.email')}: {user.email}</Text>}
        {showCreatedAt && (
          <Text>
            {t('userDetails.createdAt')}: {new Date(user.created_at).toLocaleDateString()}
          </Text>
        )}
        {additionalFields.map(field => (
          <Text key={field.key}>
            {t(field.label)}: {user[field.key]}
          </Text>
        ))}
      </VStack>
    );
  };

  if (!showModal) {
    return <Box p={4}>{renderContent()}</Box>;
  }

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t('userDetails.title')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {renderContent()}
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>{t('userDetails.close')}</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

UserDetails.propTypes = {
  // Required props
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onClose: PropTypes.func.isRequired,

  // Optional display options
  showModal: PropTypes.bool,
  showEmail: PropTypes.bool,
  showCreatedAt: PropTypes.bool,

  // Additional fields configuration
  additionalFields: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ),

  // Optional callbacks
  onUserLoad: PropTypes.func
};

UserDetails.defaultProps = {
  showModal: true,
  showEmail: true,
  showCreatedAt: true,
  additionalFields: [],
  onUserLoad: undefined
};

export default UserDetails;
