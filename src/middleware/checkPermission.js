// src/middleware/checkPermission.js

const db = require('../../config/database');

const checkPermission = (resourceType) => async (req, res, next) => {
  try {
    const userId = req.user.id;
    const resourceId = req.params.id;

    let query;
    switch (resourceType) {
      case 'project':
        query = 'SELECT creator_id FROM projects WHERE id = $1';
        break;
      case 'event':
        query = 'SELECT creator_id FROM events WHERE id = $1';
        break;
      // Add more cases for other resource types as needed
      default:
        return res.status(400).json({ msg: 'Invalid resource type' });
    }

    const result = await db.query(query, [resourceId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: 'Resource not found' });
    }

    if (result.rows[0].creator_id !== userId) {
      return res.status(403).json({ msg: 'Not authorized to perform this action' });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = checkPermission;
