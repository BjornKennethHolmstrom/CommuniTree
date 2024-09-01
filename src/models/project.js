const db = require('../../config/database');

const Project = {
  async create(projectData) {
    const { title, description, creator_id, required_skills, time_commitment, location } = projectData;
    const query = `
      INSERT INTO projects (title, description, creator_id, required_skills, time_commitment, location)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [title, description, creator_id, required_skills, time_commitment, location];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async getAll(limit, offset, search, filter) {
    let query = 'SELECT * FROM projects';
    let countQuery = 'SELECT COUNT(*) FROM projects';
    const queryParams = [];
    let whereClause = '';

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
  },

  async getById(id) {
    const query = 'SELECT * FROM projects WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  },

  async update(id, projectData) {
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
  },

  async delete(id) {
    const query = 'DELETE FROM projects WHERE id = $1';
    await db.query(query, [id]);
  },

  async addVolunteer(project_id, user_id) {
    const query = `
      INSERT INTO project_volunteers (project_id, user_id)
      VALUES ($1, $2)
      RETURNING *
    `;
    const result = await db.query(query, [project_id, user_id]);
    return result.rows[0];
  },

  async getVolunteers(project_id) {
    const query = `
      SELECT u.id, u.name, u.email, pv.status, pv.joined_at
      FROM project_volunteers pv
      JOIN users u ON pv.user_id = u.id
      WHERE pv.project_id = $1
    `;
    const result = await db.query(query, [project_id]);
    return result.rows;
  }
};

module.exports = Project;
