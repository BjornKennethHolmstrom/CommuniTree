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
  Grid,
  Badge,
  Alert,
  AlertIcon,
  Spinner
} from '@chakra-ui/react';

const CommunityList = ({
  showSearch = true,
  showFilters = true,
  showCreateButton = true,
  maxCommunities,
  filterOptions = [],
  sortOptions = [],
  onCommunitySelect,
  onCommunityJoin,
  customFilters,
  customRenderer,
  layout = 'grid'
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');

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

CommunityList.propTypes = {
  // Feature flags
  showSearch: PropTypes.bool,
  showFilters: PropTypes.bool,
  showCreateButton: PropTypes.bool,

  // Configuration
  maxCommunities: PropTypes.number,
  layout: PropTypes.oneOf(['grid', 'list']),

  // Filter and sort options
  filterOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ),
  sortOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ),

  // Custom functions
  customFilters: PropTypes.func,
  customRenderer: PropTypes.func,

  // Callbacks
  onCommunitySelect: PropTypes.func,
  onCommunityJoin: PropTypes.func,
  onError: PropTypes.func,

  // Community shape (for documentation)
  community: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    member_count: PropTypes.number,
    tags: PropTypes.arrayOf(PropTypes.string),
    cover_image_url: PropTypes.string,
    created_at: PropTypes.string
  }),

  // Optional styling
  containerStyle: PropTypes.object,
  cardStyle: PropTypes.object,
  searchStyle: PropTypes.object
};

CommunityList.defaultProps = {
  showSearch: true,
  showFilters: true,
  showCreateButton: true,
  maxCommunities: undefined,
  layout: 'grid',
  filterOptions: [],
  sortOptions: [],
  customFilters: undefined,
  customRenderer: undefined,
  onCommunitySelect: undefined,
  onCommunityJoin: undefined,
  onError: undefined,
  containerStyle: {},
  cardStyle: {},
  searchStyle: {}
};

export default CommunityList;
