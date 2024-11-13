// Client-side roles configuration
export const UserRoles = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  COMMUNITY_ADMIN: 'COMMUNITY_ADMIN',
  MODERATOR: 'MODERATOR',
  VERIFIED_USER: 'VERIFIED_USER',
  USER: 'USER',
  GUEST: 'GUEST'
};

export const RoleHierarchy = [
  UserRoles.SUPER_ADMIN,
  UserRoles.ADMIN,
  UserRoles.COMMUNITY_ADMIN,
  UserRoles.MODERATOR,
  UserRoles.VERIFIED_USER,
  UserRoles.USER,
  UserRoles.GUEST
];

export const Permissions = {
  // System-level permissions
  MANAGE_SYSTEM: 'MANAGE_SYSTEM',
  MANAGE_ROLES: 'MANAGE_ROLES',
  VIEW_METRICS: 'VIEW_METRICS',
  
  // Community permissions
  MANAGE_COMMUNITIES: 'MANAGE_COMMUNITIES',
  CREATE_COMMUNITY: 'CREATE_COMMUNITY',
  EDIT_COMMUNITY: 'EDIT_COMMUNITY',
  DELETE_COMMUNITY: 'DELETE_COMMUNITY',
  
  // User management permissions
  MANAGE_USERS: 'MANAGE_USERS',
  BAN_USERS: 'BAN_USERS',
  
  // Content moderation permissions
  MODERATE_CONTENT: 'MODERATE_CONTENT',
  DELETE_CONTENT: 'DELETE_CONTENT',
  PIN_CONTENT: 'PIN_CONTENT'
};

export const RolePermissions = {
  [UserRoles.SUPER_ADMIN]: {
    permissions: Object.values(Permissions),
    scope: 'global'
  },
  
  [UserRoles.ADMIN]: {
    permissions: [
      Permissions.MANAGE_COMMUNITIES,
      Permissions.MANAGE_USERS,
      Permissions.MODERATE_CONTENT,
      Permissions.VIEW_METRICS
    ],
    scope: 'global'
  },
  
  [UserRoles.COMMUNITY_ADMIN]: {
    permissions: [
      Permissions.EDIT_COMMUNITY,
      Permissions.MANAGE_USERS,
      Permissions.MODERATE_CONTENT
    ],
    scope: 'community'
  },
  
  [UserRoles.MODERATOR]: {
    permissions: [
      Permissions.MODERATE_CONTENT,
      Permissions.DELETE_CONTENT,
      Permissions.PIN_CONTENT
    ],
    scope: 'community'
  },
  
  [UserRoles.VERIFIED_USER]: {
    permissions: [],
    scope: 'self'
  },
  
  [UserRoles.USER]: {
    permissions: [],
    scope: 'self'
  },
  
  [UserRoles.GUEST]: {
    permissions: [],
    scope: 'none'
  }
};
