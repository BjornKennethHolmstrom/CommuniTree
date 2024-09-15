const db = require('../../config/database');
const path = require('path');
const fs = require('fs');

const fileController = {
  async getProjectFiles(req, res) {
    try {
      const { projectId } = req.params;
      const query = `
        SELECT id, file_name, file_type, file_size, uploaded_at
        FROM file_uploads
        WHERE project_id = $1
        ORDER BY uploaded_at DESC
      `;
      const result = await db.query(query, [projectId]);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching project files:', error);
      res.status(500).json({ error: 'Error fetching project files' });
    }
  },

  async uploadFile(req, res) {
    try {
      const { projectId } = req.params;
      const userId = req.user.id; // Assuming you have user info in the request after authentication

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const { filename, mimetype, size } = req.file;
      const filePath = path.join('uploads', filename);

      const query = `
        INSERT INTO file_uploads (project_id, user_id, file_name, file_path, file_type, file_size)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, file_name, file_type, file_size, uploaded_at
      `;
      const result = await db.query(query, [projectId, userId, filename, filePath, mimetype, size]);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ error: 'Error uploading file' });
    }
  },

  async downloadFile(req, res) {
    try {
      const { fileId } = req.params;
      const query = 'SELECT file_path, file_name FROM file_uploads WHERE id = $1';
      const result = await db.query(query, [fileId]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'File not found' });
      }

      const { file_path, file_name } = result.rows[0];
      const filePath = path.join(__dirname, '..', '..', file_path);

      res.download(filePath, file_name, (err) => {
        if (err) {
          console.error('Error downloading file:', err);
          res.status(500).json({ error: 'Error downloading file' });
        }
      });
    } catch (error) {
      console.error('Error processing file download:', error);
      res.status(500).json({ error: 'Error processing file download' });
    }
  }
};

module.exports = fileController;
