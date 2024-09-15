import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';

const FileUpload = ({ projectId }) => {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUploadedFiles();
  }, [projectId]);

  const fetchUploadedFiles = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/files`, {
        headers: { 'x-auth-token': user.token }
      });
      if (!response.ok) throw new Error('Failed to fetch files');
      const data = await response.json();
      setUploadedFiles(data);
    } catch (err) {
      setError('Error fetching files: ' + err.message);
    }
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    files.forEach(file => formData.append('file', file)); // Change 'files' to 'file'

    try {
      const response = await fetch(`/api/projects/${projectId}/upload`, {
        method: 'POST',
        headers: { 'x-auth-token': user.token },
        body: formData
      });
      if (!response.ok) throw new Error('Failed to upload files');
      setFiles([]);
      fetchUploadedFiles();
    } catch (err) {
      setError('Error uploading files: ' + err.message);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Project Files</h3>
      {error && <Alert variant="destructive" className="mb-4">{error}</Alert>}
      <ul className="mb-4">
        {uploadedFiles.map((file) => (
          <li key={file.id} className="mb-2">
            <a href={`/api/projects/files/${file.id}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              {file.file_name}
            </a>
            <span className="text-gray-500 ml-2">({(file.file_size / 1024).toFixed(2)} KB)</span>
          </li>
        ))}
      </ul>
      <form onSubmit={handleUpload} className="space-y-2">
        <input
          type="file"
          onChange={handleFileChange}
          multiple
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
        <Button type="submit" disabled={files.length === 0}>
          Upload Files
        </Button>
      </form>
    </div>
  );
};
