const jwt = require('jsonwebtoken');
const db = require('../../config/database');

const auth = async (req, res, next) => {
  const token = req.header('x-auth-token');

  console.log('Received token:', token ? 'Token present' : 'No token');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    console.log('Verifying token');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    const query = 'SELECT id, name, email, role FROM users WHERE id = $1';
    const result = await db.query(query, [decoded.user.id]);

    if (result.rows.length === 0) {
      console.log('No user found for token');
      return res.status(401).json({ msg: 'Token is not valid' });
    }

    req.user = result.rows[0];
    console.log('User authenticated:', req.user);
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ msg: 'Invalid token' });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: 'Token expired' });
    }
    res.status(500).json({ msg: 'Server error during authentication' });
  }
};

module.exports = auth;
