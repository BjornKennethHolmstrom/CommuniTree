const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fileController = require('../controllers/fileController');
const auth = require('../middleware/auth');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', '..', 'uploads'))
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

router.get('/:projectId/files', auth, fileController.getProjectFiles);
router.post('/:projectId/upload', auth, upload.single('file'), fileController.uploadFile);
router.get('/files/:fileId', auth, fileController.downloadFile);

module.exports = router;
