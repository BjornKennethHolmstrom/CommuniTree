// src/components/CommunityForm.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Heading, VStack, Input, Textarea, Button } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useAuth } from './AuthContext';

const CommunityForm = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [community, setCommunity] = useState({
    name: '',
    description: '',
    latitude: '',
    longitude: '',
    timezone: ''
  });

  useEffect(() => {
    if (id && id !== 'new') {
      fetchCommunityDetails();
    }
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCommunity(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = id && id !== 'new' ? `/api/communities/${id}` : '/api/communities';
      const method = id && id !== 'new' ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': user.token
        },
        body: JSON.stringify(community)
      });
      if (!response.ok) throw new Error('Failed to save community');
      navigate('/communities');
    } catch (error) {
      console.error('Error saving community:', error);
    }
  };

  return (
    <Box>
      <Heading>{id === 'new' ? t('communityForm.create') : t('communityForm.edit')}</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <Input
            name="name"
            value={community.name}
            onChange={handleChange}
            placeholder={t('communityForm.name')}
            required
          />
          <Textarea
            name="description"
            value={community.description}
            onChange={handleChange}
            placeholder={t('communityForm.description')}
          />
          <Input
            name="latitude"
            value={community.latitude}
            onChange={handleChange}
            placeholder={t('communityForm.latitude')}
            type="number"
            step="0.000001"
            required
          />
          <Input
            name="longitude"
            value={community.longitude}
            onChange={handleChange}
            placeholder={t('communityForm.longitude')}
            type="number"
            step="0.000001"
            required
          />
          <Input
            name="timezone"
            value={community.timezone}
            onChange={handleChange}
            placeholder={t('communityForm.timezone')}
            required
          />
          <Button type="submit">{t('communityForm.save')}</Button>
        </VStack>
      </form>
    </Box>
  );
};

export default CommunityForm;
