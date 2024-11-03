import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { usePermissions } from '../contexts/PermissionContext';
import { useCommunity } from '../contexts/CommunityContext';
import {
  Box,
  Flex,
  Button,
  Text,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  IconButton,
} from '@chakra-ui/react';
import { Settings, Users, Layout, LogOut, ChevronDown } from 'lucide-react';

const Navigation = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { activeCommunities } = useCommunity();
  const location = useLocation();
  const { checkPermission } = usePermissions();

  const isActive = (path) => location.pathname === path;

  // Navigation items with permission checks
  const navItems = [
    {
      label: 'menu.home',
      path: '/',
      visible: true,
    },
    {
      label: 'menu.projects',
      path: '/projects',
      visible: true,
      badge: activeCommunities.length > 0 ? activeCommunities.length : null,
    },
    {
      label: 'menu.eventCalendar',
      path: '/events',
      visible: true,
    },
    {
      label: 'menu.dashboard',
      path: '/dashboard',
      visible: !!user,
    },
  ];

  // Admin menu items with permission checks
  const adminMenuItems = [
    {
      label: 'communityManagement.management',
      path: '/admin/communities',
      icon: Layout,
      permission: 'canManageCommunities',
    },
    {
      label: 'userManagement.title',
      path: '/admin/users',
      icon: Users,
      permission: 'canManageUsers',
    },
    {
      label: 'menu.settings',
      path: '/admin/settings',
      icon: Settings,
      permission: 'canManageSystem',
    },
  ].filter(item => checkPermission(item.permission));

  const hasAdminAccess = adminMenuItems.length > 0;

  return (
    <Box bg="gray.800" color="white" p={4}>
      <Flex maxW="container.xl" mx="auto" align="center" justify="space-between">
        <HStack spacing={4}>
          {navItems.map(item => (
            item.visible && (
              <Link key={item.path} to={item.path}>
                <Button
                  variant="ghost"
                  color="white"
                  _hover={{ bg: 'gray.700' }}
                  isActive={isActive(item.path)}
                >
                  {t(item.label)}
                  {item.badge && (
                    <Text as="span" ml={2} fontSize="sm" color="gray.300">
                      ({item.badge})
                    </Text>
                  )}
                </Button>
              </Link>
            )
          ))}
        </HStack>

        <HStack spacing={4}>
          {hasAdminAccess && (
            <Menu>
              <MenuButton
                as={Button}
                variant="ghost"
                color="white"
                _hover={{ bg: 'gray.700' }}
                rightIcon={<ChevronDown size={16} />}
              >
                {t('menu.admin')}
              </MenuButton>
              <MenuList bg="gray.700">
                {adminMenuItems.map(item => (
                  <MenuItem
                    key={item.path}
                    as={Link}
                    to={item.path}
                    icon={<item.icon size={16} />}
                    _hover={{ bg: 'gray.600' }}
                  >
                    {t(item.label)}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          )}

          {user ? (
            <Menu>
              <MenuButton
                as={Button}
                variant="ghost"
                color="white"
                _hover={{ bg: 'gray.700' }}
                rightIcon={<ChevronDown size={16} />}
              >
                {user.name || user.email}
              </MenuButton>
              <MenuList bg="gray.700">
                <MenuItem
                  as={Link}
                  to="/profile"
                  _hover={{ bg: 'gray.600' }}
                >
                  {t('menu.myProfile')}
                </MenuItem>
                <MenuDivider />
                <MenuItem
                  onClick={logout}
                  icon={<LogOut size={16} />}
                  _hover={{ bg: 'gray.600' }}
                >
                  {t('menu.logout')}
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Link to="/login">
              <Button variant="ghost" color="white" _hover={{ bg: 'gray.700' }}>
                {t('menu.login')}
              </Button>
            </Link>
          )}
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navigation;
