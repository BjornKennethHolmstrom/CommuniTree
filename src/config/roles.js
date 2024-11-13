// Server-side roles configuration
const UserRoles = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  COMMUNITY_ADMIN: 'COMMUNITY_ADMIN',
  MODERATOR: 'MODERATOR',
  VERIFIED_USER: 'VERIFIED_USER',
  USER: 'USER',
  GUEST: 'GUEST'
};

const RoleHierarchy = [
  UserRoles.SUPER_ADMIN,
  UserRoles.ADMIN,
  UserRoles.COMMUNITY_ADMIN,
  UserRoles.MODERATOR,
  UserRoles.VERIFIED_USER,
  UserRoles.USER,
  UserRoles.GUEST
];

const Permissions = {
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

const RolePermissions = {
  [UserRoles.SUPER_ADMIN]: Object.values(Permissions),
  [UserRoles.ADMIN]: [
    Permissions.MANAGE_COMMUNITIES,
    Permissions.MANAGE_USERS,
    Permissions.MODERATE_CONTENT,
    Permissions.VIEW_METRICS
  ],
  [UserRoles.COMMUNITY_ADMIN]: [
    Permissions.EDIT_COMMUNITY,
    Permissions.MANAGE_USERS,
    Permissions.MODERATE_CONTENT
  ],
  [UserRoles.MODERATOR]: [
    Permissions.MODERATE_CONTENT,
    Permissions.DELETE_CONTENT,
    Permissions.PIN_CONTENT
  ],
  [UserRoles.VERIFIED_USER]: [],
  [UserRoles.USER]: [],
  [UserRoles.GUEST]: []
};

module.exports = {
  UserRoles,
  RoleHierarchy,
  Permissions,
  RolePermissions
};
