const db = require('../../config/database');

const commentController = {
  async getComments(req, res) {
    try {
      const { projectId } = req.params;
      const query = `
        SELECT c.id, c.content, c.created_at, u.name as user_name
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.project_id = $1
        ORDER BY c.created_at DESC
      `;
      const result = await db.query(query, [projectId]);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ error: 'Error fetching comments' });
    }
  },

  async addComment(req, res) {
    try {
      const { projectId } = req.params;
      const { content } = req.body;
      const userId = req.user.id; // Assuming you have user info in the request after authentication

      const query = `
        INSERT INTO comments (project_id, user_id, content)
        VALUES ($1, $2, $3)
        RETURNING id, content, created_at
      `;
      const result = await db.query(query, [projectId, userId, content]);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error adding comment:', error);
      res.status(500).json({ error: 'Error adding comment' });
    }
  }
};

module.exports = commentController;
