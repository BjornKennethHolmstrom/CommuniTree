const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth');
const checkPermission = require('../middleware/checkPermission');

router.post('/', auth, projectController.createProject);
router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProjectById);
router.put('/:id', auth, checkPermission('project'), projectController.updateProject);
router.delete('/:id', auth, checkPermission('project'), projectController.deleteProject);

router.post('/volunteer', projectController.signUpVolunteer);
router.get('/:id/volunteers', projectController.getProjectVolunteers);

module.exports = router;
