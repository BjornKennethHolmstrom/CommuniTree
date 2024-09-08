import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const MessagingComponent = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [recipient, setRecipient] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMessages();
    fetchUsers();
  }, []);

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
      setError('Error fetching messages: ' + error.message);
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
      setError('Error fetching users: ' + error.message);
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
      setError('Error sending message: ' + error.message);
    }
  };

  if (loading) return <div>Loading messages...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Messages</h2>
      <div className="mb-4">
        {messages.length === 0 ? (
          <p>No messages yet.</p>
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
          <label htmlFor="recipient" className="block mb-2">Recipient</label>
          <select
            id="recipient"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select a recipient</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="newMessage" className="block mb-2">New Message</label>
          <textarea
            id="newMessage"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          ></textarea>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Send Message
        </button>
      </form>
    </div>
  );
};

export default MessagingComponent;
