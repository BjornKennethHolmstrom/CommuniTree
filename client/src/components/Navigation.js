import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from './AuthContext';

const Navigation = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex space-x-4">
        <li><Link to="/" className="hover:text-gray-300">{t('menu.home')}</Link></li>
        <li><Link to="/projects" className="hover:text-gray-300">{t('menu.projects')}</Link></li>
        <li><Link to="/events" className="hover:text-gray-300">{t('menu.eventCalendar')}</Link></li>
        {user ? (
          <>
            <li><Link to="/dashboard" className="hover:text-gray-300">{t('menu.dashboard')}</Link></li>
            <li><Link to="/profile" className="hover:text-gray-300">{t('menu.myProfile')}</Link></li>
            <li><button onClick={logout} className="hover:text-gray-300">{t('menu.logout')}</button></li>
          </>
        ) : (
          <li><Link to="/login" className="hover:text-gray-300">{t('menu.login')}</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
