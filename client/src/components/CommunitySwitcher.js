import React, { useState } from 'react';
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
  Flex
} from '@chakra-ui/react';
import { Search, ChevronDown, X, Check, Plus } from 'lucide-react';

function CommunitySwitcher() {
  const {
    activeCommunities,
    availableCommunities,
    toggleCommunity,
    joinCommunity,
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
                ? "Select Communities"
                : activeCommunities.length === 1
                ? activeCommunities[0].name
                : `${activeCommunities.length} Communities`}
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
            <Search />
            <Input
              placeholder="Search communities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              variant="unstyled"
            />
          </HStack>
        </Box>
        <Divider />
        <VStack align="stretch" maxH="300px" overflow="auto" p={2}>
          {filteredCommunities.map((community) => {
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
                        {community.member_count} members
                      </Text>
                    </Box>
                  </HStack>
                  {isMember ? (
                    <IconButton
                      size="sm"
                      variant={isActive ? "solid" : "ghost"}
                      colorScheme={isActive ? "green" : "gray"}
                      icon={isActive ? <Check /> : <Plus />}
                      onClick={() => toggleCommunity(community.id)}
                      aria-label={isActive ? "Remove from active" : "Add to active"}
                    />
                  ) : (
                    <Button
                      size="sm"
                      colorScheme="blue"
                      onClick={() => handleJoinCommunity(community.id)}
                    >
                      Join
                    </Button>
                  )}
                </Flex>
              </Box>
            );
          })}
        </VStack>
        {activeCommunities.length > 0 && (
          <>
            <Divider />
            <Box p={4}>
              <Button
                size="sm"
                variant="ghost"
                colorScheme="red"
                leftIcon={<X />}
                onClick={() => toggleCommunity(activeCommunities.map(c => c.id))}
              >
                Clear Selection
              </Button>
            </Box>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}

export default CommunitySwitcher;
