import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Box, VStack, HStack, Button, Table, Thead, Tbody, Tr, Th, Td,
  useDisclosure, Alert, AlertIcon, Badge, IconButton,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, Text
} from '@chakra-ui/react';
import { Settings, Users, AlertTriangle, Edit, Trash2 } from 'lucide-react';
import { usePermissions } from '../../contexts/PermissionContext';
import { AccessibleButton, AccessibleCard } from '../common';
import CommunityForm from './CommunityForm';

const CommunityManagement = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { checkPermission } = usePermissions();
  const [communities, setCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/communities', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch communities');
      const data = await response.json();
      setCommunities(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (community) => {
    setSelectedCommunity(community);
    onOpen();
  };

  const handleDelete = async (communityId) => {
    if (!window.confirm(t('communities.deleteConfirmation'))) return;
    
    try {
      const response = await fetch(`/api/communities/${communityId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to delete community');
      await fetchCommunities();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Box>
            <h1 className="text-2xl font-bold">
              {t('communities.management')}
            </h1>
            <Text color="gray.600">
              {t('communities.managementDescription')}
            </Text>
          </Box>
          {checkPermission('canManageCommunities') && (
            <AccessibleButton
              action="communities.create"
              colorScheme="blue"
              onClick={() => {
                setSelectedCommunity(null);
                onOpen();
              }}
            >
              {t('communities.createNew')}
            </AccessibleButton>
          )}
        </HStack>

        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}

        <AccessibleCard title="communities.list">
          <Table>
            <Thead>
              <Tr>
                <Th>{t('communities.name')}</Th>
                <Th>{t('communities.members')}</Th>
                <Th>{t('communities.status')}</Th>
                <Th>{t('communities.moderationQueue')}</Th>
                <Th>{t('common.actions')}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {communities.map(community => (
                <Tr key={community.id}>
                  <Td>{community.name}</Td>
                  <Td>{community.memberCount}</Td>
                  <Td>
                    <Badge 
                      colorScheme={community.active ? 'green' : 'gray'}
                    >
                      {community.active ? t('common.active') : t('common.inactive')}
                    </Badge>
                  </Td>
                  <Td>
                    {community.moderationCount > 0 && (
                      <Badge colorScheme="red">
                        {community.moderationCount}
                      </Badge>
                    )}
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        aria-label={t('communities.settings')}
                        icon={<Settings size={16} />}
                        size="sm"
                        onClick={() => handleEdit(community)}
                      />
                      <IconButton
                        aria-label={t('communities.manageUsers')}
                        icon={<Users size={16} />}
                        size="sm"
                        onClick={() => handleNavigate(`/communities/${community.id}/users`)}
                      />
                      <IconButton
                        aria-label={t('communities.moderation')}
                        icon={<AlertTriangle size={16} />}
                        size="sm"
                        onClick={() => handleNavigate(`/communities/${community.id}/moderation`)}
                      />
                      <IconButton
                        aria-label={t('common.delete')}
                        icon={<Trash2 size={16} />}
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleDelete(community.id)}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </AccessibleCard>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedCommunity 
              ? t('communities.editCommunity') 
              : t('communities.createCommunity')}
          </ModalHeader>
          <ModalBody>
            <CommunityForm 
              community={selectedCommunity}
              onSubmit={async (data) => {
                try {
                  const method = selectedCommunity ? 'PUT' : 'POST';
                  const url = selectedCommunity 
                    ? `/api/communities/${selectedCommunity.id}`
                    : '/api/communities';
                    
                  const response = await fetch(url, {
                    method,
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(data)
                  });

                  if (!response.ok) throw new Error('Failed to save community');
                  await fetchCommunities();
                  onClose();
                } catch (err) {
                  setError(err.message);
                }
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CommunityManagement;
