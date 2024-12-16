import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import {
  Box,
  VStack,
  Text,
  Button,
  Alert,
  AlertIcon,
  Badge,
  Spinner
} from '@chakra-ui/react';

const NotificationComponent = ({
  maxNotifications = 50,
  showUnreadBadge = true,
  autoRefresh = true,
  refreshInterval = 30000,
  onNotificationRead,
  onNotificationClick,
  customNotificationRenderer,
  filterBy,
  groupBy
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    if (autoRefresh && refreshInterval) {
      const interval = setInterval(fetchNotifications, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications', {
        headers: { 'x-auth-token': user.token }
      });
      if (!response.ok) throw new Error('Failed to fetch notifications');
      let data = await response.json();

      if (filterBy) {
        data = data.filter(filterBy);
      }

      if (groupBy) {
        data = groupNotifications(data, groupBy);
      }

      if (maxNotifications) {
        data = data.slice(0, maxNotifications);
      }

      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': user.token
        },
        body: JSON.stringify({ read: true })
      });
      
      if (!response.ok) throw new Error('Failed to mark notification as read');
      
      if (onNotificationRead) {
        onNotificationRead(id);
      }
      
      fetchNotifications();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">{t('notifications.title')}</h2>
      {notifications.length === 0 ? (
        <p>{t('notifications.noNewNotifications')}</p>
      ) : (
        <ul>
          {notifications.map((notification) => (
            <li key={notification.id} className={`border p-2 mb-2 ${notification.read ? 'bg-gray-100' : 'bg-white'}`}>
              <p>{notification.content}</p>
              <small>{new Date(notification.created_at).toLocaleString()}</small>
              {!notification.read && (
                <button onClick={() => markAsRead(notification.id)} className="ml-2 text-blue-500 hover:underline">
                  {t('notifications.markAsRead')}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

NotificationComponent.propTypes = {
  // Configuration
  maxNotifications: PropTypes.number,
  showUnreadBadge: PropTypes.bool,
  autoRefresh: PropTypes.bool,
  refreshInterval: PropTypes.number,

  // Filtering and grouping
  filterBy: PropTypes.func,
  groupBy: PropTypes.string,

  // Callbacks
  onNotificationRead: PropTypes.func,
  onNotificationClick: PropTypes.func,
  onError: PropTypes.func,

  // Custom rendering
  customNotificationRenderer: PropTypes.func,

  // Notification shape (for documentation)
  notification: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    content: PropTypes.string.isRequired,
    type: PropTypes.string,
    read: PropTypes.bool.isRequired,
    created_at: PropTypes.string.isRequired,
    user_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
  }),

  // Styling
  containerStyle: PropTypes.object,
  notificationStyle: PropTypes.object,
  badgeStyle: PropTypes.object
};

NotificationComponent.defaultProps = {
  maxNotifications: 50,
  showUnreadBadge: true,
  autoRefresh: true,
  refreshInterval: 30000,
  onNotificationRead: undefined,
  onNotificationClick: undefined,
  onError: undefined,
  customNotificationRenderer: undefined,
  filterBy: undefined,
  groupBy: undefined,
  containerStyle: {},
  notificationStyle: {},
  badgeStyle: {}
};

export default NotificationComponent;
