// src/components/CommunityDetails.js
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { Box, Heading, Text, VStack, HStack, Button, Alert, AlertIcon } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';

const CommunityDetails = ({
  communityId,
  showMemberList = true,
  showWeather = true,
  showActions = true,
  onJoin,
  onLeave,
  onEdit,
  onDelete,
  customActions = [],
  additionalFields = []
}) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { user } = useAuth();
  const [community, setCommunity] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (communityId || id) {
      fetchCommunityDetails();
      checkMembership();
    }
  }, [communityId, id]);

  const fetchCommunityDetails = async () => {
    try {
      const response = await fetch(`/api/communities/${id}`, {
        headers: { 'x-auth-token': user.token }
      });
      if (!response.ok) throw new Error('Failed to fetch community details');
      const data = await response.json();
      setCommunity(data);
    } catch (error) {
      console.error('Error fetching community details:', error);
    }
  };

  const checkMembership = async () => {
    try {
      const response = await fetch(`/api/communities/${id}/membership`, {
        headers: { 'x-auth-token': user.token }
      });
      if (!response.ok) throw new Error('Failed to check membership');
      const data = await response.json();
      setIsMember(data.isMember);
    } catch (error) {
      console.error('Error checking membership:', error);
    }
  };

  const handleJoinLeave = async () => {
    try {
      const url = `/api/communities/${id}/${isMember ? 'leave' : 'join'}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'x-auth-token': user.token }
      });
      if (!response.ok) throw new Error(`Failed to ${isMember ? 'leave' : 'join'} community`);
      setIsMember(!isMember);
    } catch (error) {
      console.error('Error joining/leaving community:', error);
    }
  };

  if (!community) return <Text>{t('communityDetails.loading')}</Text>;

  return (
    <Box>
      <Heading>{community.name}</Heading>
      <VStack align="start" spacing={4} mt={4}>
        <Text>{community.description}</Text>
        <HStack>
          <Text>{t('communityDetails.location')}:</Text>
          <Text>{`${community.latitude}, ${community.longitude}`}</Text>
        </HStack>
        <Text>{t('communityDetails.timezone')}: {community.timezone}</Text>
        <Button onClick={handleJoinLeave}>
          {isMember ? t('communityDetails.leave') : t('communityDetails.join')}
        </Button>
      </VStack>
    </Box>
  );
};

CommunityDetails.propTypes = {
  // Optional community ID (if not provided in URL)
  communityId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),

  // Feature flags
  showMemberList: PropTypes.bool,
  showWeather: PropTypes.bool,
  showActions: PropTypes.bool,

  // Callbacks
  onJoin: PropTypes.func,
  onLeave: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,

  // Custom actions
  customActions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
      icon: PropTypes.elementType,
      condition: PropTypes.func
    })
  ),

  // Additional fields configuration
  additionalFields: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      render: PropTypes.func
    })
  ),

  // Community shape (for documentation)
  community: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    location: PropTypes.string,
    timezone: PropTypes.string,
    member_count: PropTypes.number,
    created_at: PropTypes.string
  }),

  // Optional styling
  containerStyle: PropTypes.object,
  headerStyle: PropTypes.object,
  contentStyle: PropTypes.object
};

CommunityDetails.defaultProps = {
  communityId: undefined,
  showMemberList: true,
  showWeather: true,
  showActions: true,
  onJoin: undefined,
  onLeave: undefined,
  onEdit: undefined,
  onDelete: undefined,
  customActions: [],
  additionalFields: [],
  containerStyle: {},
  headerStyle: {},
  contentStyle: {}
};

export default CommunityDetails;
