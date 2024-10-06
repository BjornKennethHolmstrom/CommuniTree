const db = require('../../config/database');

const Project = {
  async create(projectData) {
    try {
      const { title, description, creator_id, required_skills, time_commitment, location, community_id } = projectData;
      const query = `
        INSERT INTO projects (title, description, creator_id, required_skills, time_commitment, location, community_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;
      const values = [title, description, creator_id, required_skills, time_commitment, location, community_id];
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating project:', error);
      throw new Error('Failed to create project');
    }
  },

  async getAll(limit, offset, search, filter, communityId) {
    try {
      let query = 'SELECT * FROM projects WHERE deleted_at IS NULL';
      let countQuery = 'SELECT COUNT(*) FROM projects WHERE deleted_at IS NULL';
      const queryParams = [];
      let whereClause = '';

      if (communityId) {
        whereClause += ' AND community_id = $' + (queryParams.length + 1);
        queryParams.push(communityId);
      }

      if (search) {
        whereClause += ' WHERE (title ILIKE $1 OR description ILIKE $1)';
        queryParams.push(`%${search}%`);
      }

      if (filter) {
        whereClause += whereClause ? ' AND' : ' WHERE';
        whereClause += ' status = $' + (queryParams.length + 1);
        queryParams.push(filter);
      }

      query += whereClause + ' ORDER BY created_at DESC LIMIT $' + (queryParams.length + 1) + ' OFFSET $' + (queryParams.length + 2);
      countQuery += whereClause;

      queryParams.push(limit, offset);

      const countResult = await db.query(countQuery, queryParams.slice(0, -2));
      const projectsResult = await db.query(query, queryParams);

      return {
        projects: projectsResult.rows,
        total: parseInt(countResult.rows[0].count)
      };
    } catch (error) {
      console.error('Error getting all projects:', error);
      throw new Error('Failed to get all projects');
    }
  },

  async getById(id) {
    try {
      if (id === 'new') {
        // Return an empty project object for new projects
        return { id: 'new', title: '', description: '', required_skills: [], time_commitment: '', location: '' };
      }
      const query = 'SELECT * FROM projects WHERE id = $1';
      const result = await db.query(query, [parseInt(id, 10)]);
      return result.rows[0];
    } catch (error) {
      console.error('Error getting by Id:', error);
      throw new Error('Failed to get by Id');
    }
  },

  async update(id, projectData) {
    try {
      const { title, description, status, required_skills, time_commitment, location } = projectData;
      const query = `
        UPDATE projects
        SET title = $1, description = $2, status = $3, required_skills = $4, time_commitment = $5, location = $6, updated_at = CURRENT_TIMESTAMP
        WHERE id = $7
        RETURNING *
      `;
      const values = [title, description, status, required_skills, time_commitment, location, id];
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error updating project data:', error);
      throw new Error('Failed to update project data');
    }
  },

  async softDelete(id) {
    try {
      const query = 'UPDATE projects SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1';
      await db.query(query, [id]);
    } catch (error) {
      console.error('Error soft deleting project:', error);
      throw new Error('Failed to soft delete project');
    }
  },

  async restore(id) {
    try {
      const query = 'UPDATE projects SET deleted_at = NULL WHERE id = $1';
      await db.query(query, [id]);
    } catch (error) {
      console.error('Error restoring project:', error);
      throw new Error('Failed to restore project');
    }
  },

  async addVolunteer(project_id, user_id) {
    try {
      const query = `
        INSERT INTO project_volunteers (project_id, user_id)
        VALUES ($1, $2)
        RETURNING *
      `;
      const result = await db.query(query, [project_id, user_id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error adding volunteer:', error);
      throw new Error('Failed to add volunteer');
    }
  },

  async getVolunteers(project_id) {
    try {
      if (project_id === 'new') {
        // Return an empty array for new projects
        return [];
      }
      const query = `
        SELECT u.id, u.name, u.email, pv.status, pv.joined_at
        FROM project_volunteers pv
        JOIN users u ON pv.user_id = u.id
        WHERE pv.project_id = $1
      `;
      const result = await db.query(query, [parseInt(project_id, 10)]);
      return result.rows;
    } catch (error) {
      console.error('Error getting volunteers', error);
      throw new Error('Failed to get volunteers');
    }
  }
};

module.exports = Project;
