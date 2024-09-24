const crypto = require('crypto');

const refreshTokenSecret = crypto.randomBytes(64).toString('hex');
console.log('REFRESH_TOKEN_SECRET:', refreshTokenSecret);
