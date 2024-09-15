const jwt = require('jsonwebtoken');
const db = require('../../config/database');

const auth = (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const query = 'SELECT id, name, email, role FROM users WHERE id = $1';
    const result = await db.query(query, [decoded.user.id]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ msg: 'Token is not valid' });
    }

    req.user = result.rows[0];
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = auth;
