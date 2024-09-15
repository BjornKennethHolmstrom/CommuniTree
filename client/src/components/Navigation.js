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
        <li><Link to="/" className="hover:text-gray-300">{t('home')}</Link></li>
        <li><Link to="/projects" className="hover:text-gray-300">{t('projects')}</Link></li>
        <li><Link to="/events" className="hover:text-gray-300">{t('eventCalendar')}</Link></li>
        {user ? (
          <>
            <li><Link to="/dashboard" className="hover:text-gray-300">{t('dashboard')}</Link></li>
            <li><Link to="/profile" className="hover:text-gray-300">{t('myProfile')}</Link></li>
            <li><button onClick={logout} className="hover:text-gray-300">{t('logout')}</button></li>
          </>
        ) : (
          <li><Link to="/login" className="hover:text-gray-300">{t('login')}</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
