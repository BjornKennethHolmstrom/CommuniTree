import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const PrivateRoute = () => {
  const { t } = useTranslation();
  const { user, loading } = useAuth();

  if (loading) {
    return <div>{t('common.loading')}</div>;
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
