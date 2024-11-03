// src/contexts/PermissionContext.js
import React, { createContext, useContext, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { RolePermissions, UserRoles } from '../config/roles';
import { useTranslation } from 'react-i18next';

const PermissionContext = createContext(null);

export const PermissionProvider = ({ children }) => {
  const { user } = useAuth();
  const { t } = useTranslation();

  // Create memoized permission checks
  const permissionChecks = useMemo(() => {
    if (!user || !user.role) {
      return {
        role: UserRoles.GUEST,
        permissions: RolePermissions[UserRoles.GUEST]
      };
    }

    return {
      role: user.role,
      permissions: RolePermissions[user.role] || RolePermissions[UserRoles.GUEST]
    };
  }, [user]);

  // Create memoized helper functions
  const permissionHelpers = useMemo(() => ({
    checkPermission: (permission, context = null) => {
      const { permissions } = permissionChecks;
      if (!permissions) return false;

      const permissionValue = permissions[permission];
      
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
    },

    hasRole: (role) => {
      return permissionChecks.role === role;
    },

    hasAnyRole: (roles) => {
      return roles.includes(permissionChecks.role);
    },

    // Check if user has higher role than specified
    hasHigherRole: (role) => {
      const roleOrder = Object.values(UserRoles);
      return roleOrder.indexOf(permissionChecks.role) < roleOrder.indexOf(role);
    }
  }), [permissionChecks]);

  const value = {
    ...permissionChecks,
    ...permissionHelpers
  };

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};

// Custom hooks for using permissions
export const usePermissions = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return context;
};

// Specialized hooks for common permission checks
export const useProjectPermissions = (projectId = null, communityId = null) => {
  const { checkPermission } = usePermissions();
  const { user } = useAuth();

  return {
    canCreate: checkPermission('canCreateProjects'),
    canEdit: checkPermission('canManageProjects', {
      id: projectId,
      isOwner: projectId && user?.id === projectId,
      inCommunity: communityId !== null,
      isAssigned: projectId && user?.assignedProjects?.includes(projectId)
    }),
    canDelete: checkPermission('canManageProjects', {
      id: projectId,
      isOwner: projectId && user?.id === projectId,
      inCommunity: communityId !== null
    }),
    canAssign: checkPermission('canManageProjects', {
      id: projectId,
      inCommunity: communityId !== null
    })
  };
};

export const useCommunityPermissions = (communityId = null) => {
  const { checkPermission } = usePermissions();
  
  return {
    canManage: checkPermission('canManageCommunities', { id: communityId }),
    canModerate: checkPermission('canModerateContent', { id: communityId }),
    canManageUsers: checkPermission('canManageUsers', { id: communityId }),
    canCreateEvents: checkPermission('canCreateEvents', { id: communityId }),
    canManageSettings: checkPermission('canManageCommunities', { id: communityId })
  };
};

export const useModeratorPermissions = (communityId = null) => {
  const { checkPermission } = usePermissions();
  
  return {
    canWarnUsers: checkPermission('canModerateContent', { id: communityId }),
    canMuteUsers: checkPermission('canModerateUsers', { id: communityId }),
    canBanUsers: checkPermission('canManageUsers', { id: communityId }),
    canDeleteContent: checkPermission('canModerateContent', { id: communityId }),
    canPinContent: checkPermission('canModerateContent', { id: communityId })
  };
};

// Higher-order component for protecting routes/components
export const withPermission = (WrappedComponent, requiredPermission, context = null) => {
  return function WithPermissionComponent(props) {
    const { checkPermission } = usePermissions();
    const { t } = useTranslation();

    if (!checkPermission(requiredPermission, context)) {
      return (
        <div role="alert" aria-live="polite">
          {t('permissions.accessDenied')}
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
};
