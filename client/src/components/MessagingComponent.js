import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Select,
  Text,
  Alert,
  AlertIcon,
  Textarea,
  Divider,
  Spinner
} from '@chakra-ui/react';

const MessagingComponent = ({
  showUserSelector = true,
  showMessageHistory = true,
  maxMessages = 50,
  refreshInterval,
  preSelectedUser,
  onMessageSend,
  onMessageRead,
  customMessageRenderer,
  placeholderText
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [recipient, setRecipient] = useState(preSelectedUser || '');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMessages();
    if (showUserSelector) {
      fetchUsers();
    }
    if (refreshInterval) {
      const interval = setInterval(fetchMessages, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/messages', {
        headers: { 'x-auth-token': user.token }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      setError(t('messaging.fetchError') + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users', {
        headers: { 'x-auth-token': user.token }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      setError(t('messaging.usersFetchError') + error.message);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': user.token
        },
        body: JSON.stringify({ recipient_id: recipient, content: newMessage })
      });
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      setError(t('messaging.sendError') + error.message);
    }
  };

  if (loading) return <div>{t('messaging.loading')}</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">{t('messaging.title')}</h2>
      <div className="mb-4">
        {messages.length === 0 ? (
          <p>{t('messaging.noMessages')}</p>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="border p-2 mb-2">
              <p><strong>{message.sender_name}:</strong> {message.content}</p>
              <small>{new Date(message.created_at).toLocaleString()}</small>
            </div>
          ))
        )}
      </div>
      <form onSubmit={sendMessage}>
        <div className="mb-4">
          <label htmlFor="recipient" className="block mb-2">{t('messaging.recipient')}</label>
          <select
            id="recipient"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">{t('messaging.selectRecipient')}</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="newMessage" className="block mb-2">{t('messaging.newMessage')}</label>
          <textarea
            id="newMessage"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          ></textarea>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          {t('messaging.sendMessage')}
        </button>
      </form>
    </div>
  );
};

MessagingComponent.propTypes = {
  // Display options
  showUserSelector: PropTypes.bool,
  showMessageHistory: PropTypes.bool,
  maxMessages: PropTypes.number,
  refreshInterval: PropTypes.number,
  placeholderText: PropTypes.string,

  // Pre-selected values
  preSelectedUser: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),

  // Callbacks
  onMessageSend: PropTypes.func,
  onMessageRead: PropTypes.func,
  onError: PropTypes.func,
  onUsersLoad: PropTypes.func,

  // Custom rendering
  customMessageRenderer: PropTypes.func,

  // Message shape (for documentation)
  message: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    content: PropTypes.string.isRequired,
    sender_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    sender_name: PropTypes.string.isRequired,
    recipient_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    created_at: PropTypes.string.isRequired,
    read: PropTypes.bool
  }),

  // Styling
  containerStyle: PropTypes.object,
  messageStyle: PropTypes.object,
  inputStyle: PropTypes.object
};

MessagingComponent.defaultProps = {
  showUserSelector: true,
  showMessageHistory: true,
  maxMessages: 50,
  refreshInterval: undefined,
  preSelectedUser: undefined,
  onMessageSend: undefined,
  onMessageRead: undefined,
  onError: undefined,
  onUsersLoad: undefined,
  customMessageRenderer: undefined,
  placeholderText: undefined,
  containerStyle: {},
  messageStyle: {},
  inputStyle: {}
};

export default MessagingComponent;
