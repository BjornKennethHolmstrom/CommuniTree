const express = require('express');
const router = express.Router();
const db = require('../../config/database'); // Adjust this path as needed
const auth = require('../middleware/auth'); // Adjust this path as needed

// Fetch notifications for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new notification
router.post('/', auth, async (req, res) => {
  const { user_id, content, type } = req.body;
  
  // Check if the authenticated user has permission to create notifications
  // This could be an admin check or other logic based on your app's requirements
  if (req.user.id !== user_id && !req.user.isAdmin) {
    return res.status(403).json({ message: 'Not authorized to create notifications for other users' });
  }

  try {
    const result = await db.query(
      'INSERT INTO notifications (user_id, content, type) VALUES ($1, $2, $3) RETURNING *',
      [user_id, content, type]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark a notification as read
router.patch('/:id', auth, async (req, res) => {
  try {
    const result = await db.query(
      'UPDATE notifications SET read = true WHERE id = $1 AND user_id = $2 RETURNING *',
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Notification not found or unauthorized' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
