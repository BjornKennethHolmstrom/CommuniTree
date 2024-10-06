// src/components/CommunityDetails.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Heading, Text, VStack, HStack, Button } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useAuth } from './AuthContext';

const CommunityDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { user } = useAuth();
  const [community, setCommunity] = useState(null);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    fetchCommunityDetails();
    checkMembership();
  }, [id]);

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

export default CommunityDetails;
