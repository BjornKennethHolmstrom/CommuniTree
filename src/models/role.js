// src/models/role.js
const db = require('../../config/database');

const Role = {
  async create(roleData) {
    const { name, description } = roleData;
    const query = `
      INSERT INTO roles (name, description)
      VALUES ($1, $2)
      RETURNING *
    `;
    const result = await db.query(query, [name, description]);
    return result.rows[0];
  },

  async getAll() {
    const query = 'SELECT * FROM roles ORDER BY name';
    const result = await db.query(query);
    return result.rows;
  },

  async getById(id) {
    const query = 'SELECT * FROM roles WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  },

  async update(id, roleData) {
    const { name, description } = roleData;
    const query = `
      UPDATE roles
      SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `;
    const result = await db.query(query, [name, description, id]);
    return result.rows[0];
  },

  async delete(id) {
    const query = 'DELETE FROM roles WHERE id = $1';
    await db.query(query, [id]);
  },

  async assignToUser(userId, roleId, communityId = null, assignedBy = null) {
    const query = `
      INSERT INTO user_roles (user_id, role_id, community_id, assigned_by)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id, role_id, community_id) DO NOTHING
      RETURNING *
    `;
    const result = await db.query(query, [userId, roleId, communityId, assignedBy]);
    return result.rows[0];
  },

  async removeFromUser(userId, roleId, communityId = null) {
    const query = `
      DELETE FROM user_roles
      WHERE user_id = $1 AND role_id = $2 AND community_id IS NOT DISTINCT FROM $3
    `;
    await db.query(query, [userId, roleId, communityId]);
  },

  async getUserRoles(userId) {
    const query = `
      SELECT r.*, ur.community_id
      FROM roles r
      JOIN user_roles ur ON r.id = ur.role_id
      WHERE ur.user_id = $1
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
  },

  async getRolePermissions(roleId) {
    const query = `
      SELECT p.*
      FROM permissions p
      JOIN role_permissions rp ON p.id = rp.permission_id
      WHERE rp.role_id = $1
    `;
    const result = await db.query(query, [roleId]);
    return result.rows;
  }
};

module.exports = Role;
