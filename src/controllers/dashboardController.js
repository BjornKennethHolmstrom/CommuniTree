// src/controllers/dashboardController.js
const db = require('../../config/database');

const dashboardController = {
  async getUserProjects(req, res) {
    try {
      const userId = req.user.id;
      const query = `
        SELECT id, title, status
        FROM projects
        WHERE creator_id = $1
        ORDER BY created_at DESC
      `;
      const result = await db.query(query, [userId]);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching user projects:', error);
      res.status(500).json({ error: 'Error fetching user projects' });
    }
  },

  async getVolunteerActivities(req, res) {
    try {
      const userId = req.user.id;
      const query = `
        SELECT pv.id, p.id as project_id, p.title as project_title, pv.role, pv.hours
        FROM project_volunteers pv
        JOIN projects p ON pv.project_id = p.id
        WHERE pv.user_id = $1
        ORDER BY pv.joined_at DESC
      `;
      const result = await db.query(query, [userId]);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching volunteer activities:', error);
      res.status(500).json({ error: 'Error fetching volunteer activities' });
    }
  },

  async getImpactStats(req, res) {
    try {
      const userId = req.user.id;
      const query = `
        SELECT 
          (SELECT COUNT(*) FROM projects WHERE creator_id = $1) as projects_created,
          (SELECT COALESCE(SUM(hours), 0) FROM project_volunteers WHERE user_id = $1) as volunteering_hours,
          (SELECT COUNT(DISTINCT location) FROM projects WHERE creator_id = $1) as communities_impacted
      `;
      const result = await db.query(query, [userId]);
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching impact stats:', error);
      res.status(500).json({ error: 'Error fetching impact stats' });
    }
  }
};

module.exports = dashboardController;
