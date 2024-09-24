const express = require('express');
const router = express.Router();
const db = require('../../config/database');
const auth = require('../middleware/auth');

// Get all messages for the current user
router.get('/', auth, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT m.*, u.name as sender_name 
       FROM messages m 
       JOIN users u ON m.sender_id = u.id 
       WHERE m.recipient_id = $1 
       ORDER BY m.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send a new message
router.post('/', auth, async (req, res) => {
  const { recipient_id, content } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO messages (sender_id, recipient_id, content) VALUES ($1, $2, $3) RETURNING *',
      [req.user.id, recipient_id, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark a message as read
router.patch('/:id', auth, async (req, res) => {
  try {
    const result = await db.query(
      'UPDATE messages SET read = true WHERE id = $1 AND recipient_id = $2 RETURNING *',
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Message not found or unauthorized' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
