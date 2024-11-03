import { UserRoles, RolePermissions } from '../config/roles';

export const checkPermission = (userRole, permission, context = null) => {
  const rolePermissions = RolePermissions[userRole];
  if (!rolePermissions) return false;

  const permissionValue = rolePermissions[permission];
  
  // Handle boolean permissions
  if (typeof permissionValue === 'boolean') {
    return permissionValue;
  }
  
  // Handle array permissions (for scoped access)
  if (Array.isArray(permissionValue)) {
    if (!context) return false;
    
    return permissionValue.some(scope => {
      switch (scope) {
        case 'assigned':
          return context.isAssigned;
        case 'own':
          return context.isOwner;
        case 'community':
          return context.inCommunity;
        default:
          return scope === context.id;
      }
    });
  }
  
  return false;
};

// Helper hooks for common permission checks
export const usePermissions = (userRole) => {
  return {
    canManageSystem: checkPermission(userRole, 'canManageSystem'),
    canManageCommunities: (communityId) => 
      checkPermission(userRole, 'canManageCommunities', { id: communityId }),
    canManageUsers: (communityId) => 
      checkPermission(userRole, 'canManageUsers', { id: communityId }),
    canModerateContent: (communityId) => 
      checkPermission(userRole, 'canModerateContent', { id: communityId }),
    canManageProjects: (projectContext) => 
      checkPermission(userRole, 'canManageProjects', projectContext)
  };
};
