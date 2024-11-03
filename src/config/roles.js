// src/config/roles.js
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
  PIN_CONTENT: 'PIN_CONTENT',
  
  // Project permissions
  MANAGE_PROJECTS: 'MANAGE_PROJECTS',
  CREATE_PROJECT: 'CREATE_PROJECT',
  EDIT_PROJECT: 'EDIT_PROJECT',
  DELETE_PROJECT: 'DELETE_PROJECT',
  MANAGE_VOLUNTEERS: 'MANAGE_VOLUNTEERS',
  
  // Event permissions
  MANAGE_EVENTS: 'MANAGE_EVENTS',
  CREATE_EVENT: 'CREATE_EVENT',
  EDIT_EVENT: 'EDIT_EVENT',
  DELETE_EVENT: 'DELETE_EVENT',
  
  // Basic permissions
  VIEW_CONTENT: 'VIEW_CONTENT',
  CREATE_COMMENTS: 'CREATE_COMMENTS',
  UPLOAD_FILES: 'UPLOAD_FILES'
};

const RolePermissions = {
  [UserRoles.SUPER_ADMIN]: {
    permissions: Object.values(Permissions),
    scope: 'global'
  },
  
  [UserRoles.ADMIN]: {
    permissions: [
      Permissions.MANAGE_COMMUNITIES,
      Permissions.CREATE_COMMUNITY,
      Permissions.EDIT_COMMUNITY,
      Permissions.DELETE_COMMUNITY,
      Permissions.MANAGE_USERS,
      Permissions.BAN_USERS,
      Permissions.MODERATE_CONTENT,
      Permissions.DELETE_CONTENT,
      Permissions.MANAGE_PROJECTS,
      Permissions.MANAGE_EVENTS,
      Permissions.VIEW_METRICS
    ],
    scope: 'global'
  },
  
  [UserRoles.COMMUNITY_ADMIN]: {
    permissions: [
      Permissions.EDIT_COMMUNITY,
      Permissions.MANAGE_USERS,
      Permissions.MODERATE_CONTENT,
      Permissions.DELETE_CONTENT,
      Permissions.PIN_CONTENT,
      Permissions.MANAGE_PROJECTS,
      Permissions.MANAGE_EVENTS,
      Permissions.VIEW_METRICS
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
    permissions: [
      Permissions.VIEW_CONTENT,
      Permissions.CREATE_PROJECT,
      Permissions.EDIT_PROJECT,
      Permissions.CREATE_EVENT,
      Permissions.EDIT_EVENT,
      Permissions.CREATE_COMMENTS,
      Permissions.UPLOAD_FILES
    ],
    scope: 'self'
  },
  
  [UserRoles.USER]: {
    permissions: [
      Permissions.VIEW_CONTENT,
      Permissions.CREATE_COMMENTS,
      Permissions.UPLOAD_FILES
    ],
    scope: 'self'
  },
  
  [UserRoles.GUEST]: {
    permissions: [
      Permissions.VIEW_CONTENT
    ],
    scope: 'none'
  }
};

module.exports = {
  UserRoles,
  RoleHierarchy,
  Permissions,
  RolePermissions
};
