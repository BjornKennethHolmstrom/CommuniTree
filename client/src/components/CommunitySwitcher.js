import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useCommunity } from '../contexts/CommunityContext';
import {
  Box,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  VStack,
  HStack,
  Text,
  Badge,
  IconButton,
  Input,
  Divider,
  Avatar,
  Flex,
  Spinner
} from '@chakra-ui/react';
import { Search, ChevronDown, X, Check, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CommunitySwitcher = ({
  maxSelected,
  searchDebounceMs = 300,
  showBadgeCount = true,
  showAvatar = true,
  showSearch = true,
  onSelectionChange,
  customFilter,
  customSort,
  buttonVariant = 'outline'
}) => {
  const { t } = useTranslation();
  const {
    activeCommunities,
    availableCommunities,
    toggleCommunity,
    joinCommunity,
    loading
  } = useCommunity();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCommunities = availableCommunities.filter(community =>
    community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    community.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleJoinCommunity = async (communityId) => {
    try {
      await joinCommunity(communityId);
    } catch (error) {
      console.error('Failed to join community:', error);
    }
  };

  if (loading) {
    return <Spinner size="sm" />;
  }

  return (
    <Popover placement="bottom-start">
      <PopoverTrigger>
        <Button
          variant="outline"
          rightIcon={<ChevronDown />}
          w="200px"
          justifyContent="space-between"
        >
          <HStack spacing={2}>
            <Text>
              {activeCommunities.length === 0
                ? t('community.selector.title')
                : activeCommunities.length === 1
                ? activeCommunities[0].name
                : t('community.selector.multipleSelected', { count: activeCommunities.length })}
            </Text>
            {activeCommunities.length > 0 && (
              <Badge colorScheme="green" borderRadius="full">
                {activeCommunities.length}
              </Badge>
            )}
          </HStack>
        </Button>
      </PopoverTrigger>
      <PopoverContent w="300px" p={0}>
        <Box p={4}>
          <HStack spacing={2}>
            <Search size={16} />
            <Input
              placeholder={t('community.selector.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              variant="unstyled"
            />
          </HStack>
        </Box>
        <Divider />
        <VStack align="stretch" maxH="300px" overflow="auto" p={2}>
          {filteredCommunities.length === 0 ? (
            <Text p={4} textAlign="center" color="gray.500">
              {t('community.selector.noCommunitiesFound')}
            </Text>
          ) : (
            filteredCommunities.map((community) => {
              const isActive = activeCommunities.some(c => c.id === community.id);
              const isMember = availableCommunities.some(c => c.id === community.id);

              return (
                <Box
                  key={community.id}
                  p={2}
                  _hover={{ bg: "gray.100" }}
                  borderRadius="md"
                  cursor="pointer"
                >
                  <Flex justify="space-between" align="center">
                    <HStack spacing={3}>
                      <Avatar
                        size="sm"
                        name={community.name}
                        src={community.cover_image_url}
                      />
                      <Box>
                        <Text fontWeight="medium">{community.name}</Text>
                        <Text fontSize="sm" color="gray.500">
                          {t('community.selector.memberCount', { count: community.member_count || 0 })}
                        </Text>
                      </Box>
                    </HStack>
                    {isMember ? (
                      <IconButton
                        size="sm"
                        variant={isActive ? "solid" : "ghost"}
                        colorScheme={isActive ? "green" : "gray"}
                        icon={isActive ? <Check size={16} /> : <Plus size={16} />}
                        onClick={() => toggleCommunity(community.id)}
                        aria-label={isActive ? t('community.selector.removeFromActive') : t('community.selector.addToActive')}
                      />
                    ) : (
                      <Button
                        size="sm"
                        colorScheme="blue"
                        onClick={() => handleJoinCommunity(community.id)}
                      >
                        {t('community.selector.join')}
                      </Button>
                    )}
                  </Flex>
                </Box>
              )
            })
          )}
        </VStack>
        {activeCommunities.length > 0 && (
          <>
            <Divider />
            <Box p={4}>
              <Button
                size="sm"
                variant="ghost"
                colorScheme="red"
                leftIcon={<X size={16} />}
                onClick={() => toggleCommunity(activeCommunities.map(c => c.id))}
              >
                {t('community.selector.clearSelection')}
              </Button>
            </Box>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}

CommunitySwitcher.propTypes = {
  // Configuration
  maxSelected: PropTypes.number,
  searchDebounceMs: PropTypes.number,
  showBadgeCount: PropTypes.bool,
  showAvatar: PropTypes.bool,
  showSearch: PropTypes.bool,
  buttonVariant: PropTypes.string,

  // Callbacks
  onSelectionChange: PropTypes.func,

  // Custom functions
  customFilter: PropTypes.func,
  customSort: PropTypes.func,

  // Optional styling
  containerStyle: PropTypes.object,
  buttonStyle: PropTypes.object,
  menuStyle: PropTypes.object,
  itemStyle: PropTypes.object,

  // Community shape (for documentation)
  community: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    cover_image_url: PropTypes.string,
    member_count: PropTypes.number
  })
};

CommunitySwitcher.defaultProps = {
  maxSelected: undefined,
  searchDebounceMs: 300,
  showBadgeCount: true,
  showAvatar: true,
  showSearch: true,
  buttonVariant: 'outline',
  onSelectionChange: undefined,
  customFilter: undefined,
  customSort: undefined,
  containerStyle: {},
  buttonStyle: {},
  menuStyle: {},
  itemStyle: {}
};

export default CommunitySwitcher;
