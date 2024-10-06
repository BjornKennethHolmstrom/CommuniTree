import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api';

const CommunityList = () => {
  const [communities, setCommunities] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await api.get('/api/communities');
        setCommunities(response.data);
      } catch (error) {
        console.error('Error fetching communities:', error);
      }
    };
    fetchCommunities();
  }, []);

  return (
    <div>
      <h2>{t('Communities')}</h2>
      <ul>
        {communities.map(community => (
          <li key={community.id}>{community.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default CommunityList;
