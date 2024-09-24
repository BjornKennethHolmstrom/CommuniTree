const Project = require('../models/project');

const projectController = {
  async createProject(req, res) {
    try {
      const project = await Project.create(req.body);
      res.status(201).json(project);
    } catch (error) {
      res.status(500).json({ error: 'Error creating project' });
    }
  },

  async getAllProjects(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const search = req.query.search || '';
      const filter = req.query.filter || '';

      const { projects, total } = await Project.getAll(limit, offset, search, filter);
      const totalPages = Math.ceil(total / limit);

      res.json({
        projects,
        currentPage: page,
        totalPages,
        totalProjects: total
      });
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ error: 'Error fetching projects' });
    }
  },

  async getProjectById(req, res) {
    try {
      const project = await Project.getById(req.params.id);
      if (project) {
        res.json(project);
      } else {
        res.status(404).json({ error: 'Project not found' });
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      res.status(500).json({ error: 'Error fetching project' });
    }
  },

  async updateProject(req, res) {
    try {
      const project = await Project.update(req.params.id, req.body);
      if (project) {
        res.json(project);
      } else {
        res.status(404).json({ error: 'Project not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error updating project' });
    }
  },

  async deleteProject(req, res) {
    try {
      await Project.delete(req.params.id);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Error deleting project' });
    }
  },

  async signUpVolunteer(req, res) {
    try {
      const { project_id, user_id } = req.body;
      const volunteer = await Project.addVolunteer(project_id, user_id);
      res.status(201).json(volunteer);
    } catch (error) {
      res.status(500).json({ error: 'Error signing up volunteer' });
    }
  },

  async getProjectVolunteers(req, res) {
    try {
      const volunteers = await Project.getVolunteers(req.params.id);
      res.json(volunteers);
    } catch (error) {
      console.error('Error fetching project volunteers:', error);
      res.status(500).json({ error: 'Error fetching project volunteers' });
    }
  }
};

module.exports = projectController;
