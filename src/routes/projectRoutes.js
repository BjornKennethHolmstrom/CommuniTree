const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth');

router.post('/', auth, projectController.createProject);
router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProjectById);
router.put('/:id', auth, projectController.updateProject);
router.delete('/:id', auth, projectController.deleteProject);
router.post('/volunteer', projectController.signUpVolunteer);
router.get('/:id/volunteers', projectController.getProjectVolunteers);

module.exports = router;
