import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const NotificationComponent = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications', {
        headers: { 'x-auth-token': user.token }
      });
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await fetch(`/api/notifications/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': user.token
        },
        body: JSON.stringify({ read: true })
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>
      {notifications.length === 0 ? (
        <p>No new notifications</p>
      ) : (
        <ul>
          {notifications.map((notification) => (
            <li key={notification.id} className={`border p-2 mb-2 ${notification.read ? 'bg-gray-100' : 'bg-white'}`}>
              <p>{notification.content}</p>
              <small>{new Date(notification.created_at).toLocaleString()}</small>
              {!notification.read && (
                <button onClick={() => markAsRead(notification.id)} className="ml-2 text-blue-500 hover:underline">
                  Mark as read
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationComponent;
