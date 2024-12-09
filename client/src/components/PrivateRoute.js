import React from 'react';
import PropTypes from 'prop-types';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Spinner, Center, Alert, AlertIcon } from '@chakra-ui/react';

const PrivateRoute = ({ 
  redirectPath = '/login',
  requireAuth = true,
  requiredRoles = [],
  loadingComponent,
  unauthorizedComponent
}) => {
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show custom or default loading component
  if (loading) {
    if (loadingComponent) {
      return loadingComponent;
    }
    return (
      <Center h="200px">
        <Spinner size="xl" />
      </Center>
    );
  }

  // Check authentication
  if (requireAuth && !user) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requiredRoles.length > 0 && user) {
    const hasRequiredRole = requiredRoles.includes(user.role);
    if (!hasRequiredRole) {
      if (unauthorizedComponent) {
        return unauthorizedComponent;
      }
      return (
        <Alert status="error">
          <AlertIcon />
          {t('common.unauthorized')}
        </Alert>
      );
    }
  }

  return <Outlet />;
};

PrivateRoute.propTypes = {
  // Optional redirect path for unauthenticated users
  redirectPath: PropTypes.string,
  
  // Whether authentication is required (can be used for public routes that need user data)
  requireAuth: PropTypes.bool,
  
  // Array of required roles for accessing the route
  requiredRoles: PropTypes.arrayOf(PropTypes.string),
  
  // Custom components for different states
  loadingComponent: PropTypes.element,
  unauthorizedComponent: PropTypes.element
};

PrivateRoute.defaultProps = {
  redirectPath: '/login',
  requireAuth: true,
  requiredRoles: [],
  loadingComponent: undefined,
  unauthorizedComponent: undefined
};

export default PrivateRoute;
