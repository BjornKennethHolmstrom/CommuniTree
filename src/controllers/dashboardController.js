// src/controllers/dashboardController.js
const db = require('../../config/database');

const dashboardController = {
  async getUserProjects(req, res) {
    console.log('Entering getUserProjects, user:', req.user);
    try {
      const userId = req.user.id;
      console.log('Fetching projects for user:', userId);

      // Log the structure of the projects table
      const tableStructure = await db.query(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'projects'
      `);
      console.log('Projects table structure:', tableStructure.rows);

      const query = `
        SELECT id, title, status
        FROM projects
        WHERE creator_id = $1
        ORDER BY created_at DESC
      `;
      const result = await db.query(query, [userId]);
      console.log('Projects fetched:', result.rows);
      res.json(result.rows);
    } catch (error) {
      console.error('Error in getUserProjects:', error);
      res.status(500).json({ error: 'Error fetching user projects', details: error.message, stack: error.stack });
    }
  },

  async getVolunteerActivities(req, res) {
    console.log('Entering getVolunteerActivities, user:', req.user);
    try {
      const userId = req.user.id;
      console.log('Fetching volunteer activities for user:', userId);

      // Log the structure of the project_volunteers table
      const tableStructure = await db.query(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'project_volunteers'
      `);
      console.log('Project_volunteers table structure:', tableStructure.rows);

      const query = `
        SELECT pv.id, p.id as project_id, p.title as project_title, pv.role, pv.hours
        FROM project_volunteers pv
        JOIN projects p ON pv.project_id = p.id
        WHERE pv.user_id = $1
        ORDER BY pv.joined_at DESC
      `;
      const result = await db.query(query, [userId]);
      console.log('Volunteer activities fetched:', result.rows);
      res.json(result.rows);
    } catch (error) {
      console.error('Error in getVolunteerActivities:', error);
      res.status(500).json({ error: 'Error fetching volunteer activities', details: error.message, stack: error.stack });
    }
  },

  async getImpactStats(req, res) {
    console.log('Entering getImpactStats');
    try {
      const userId = req.user.id;
      console.log('Fetching impact stats for user:', userId);
      const query = `
        SELECT
          (SELECT COUNT(*) FROM projects WHERE creator_id = $1) as projects_created,
          (SELECT COALESCE(SUM(hours), 0) FROM project_volunteers WHERE user_id = $1) as volunteering_hours,
          (SELECT COUNT(DISTINCT location) FROM projects WHERE creator_id = $1) as communities_impacted
      `;
      const result = await db.query(query, [userId]);
      console.log('Impact stats fetched:', result.rows[0]);
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error in getImpactStats:', error);
      res.status(500).json({ error: 'Error fetching impact stats', details: error.message, stack: error.stack });
    }
  }
};

module.exports = dashboardController;
