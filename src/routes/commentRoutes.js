const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth');

router.get('/:projectId/comments', auth, commentController.getComments);
router.post('/:projectId/comments', auth, commentController.addComment);

module.exports = router;
