import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Button, Alert, AlertIcon, VStack, Text, Link, Input, Box } from '@chakra-ui/react';

const FileUpload = ({ projectId }) => {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (projectId && projectId !== 'new') {
      fetchUploadedFiles();
    }
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
    files.forEach(file => formData.append('file', file));

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
    <Box mt={8}>
      <Text fontSize="xl" fontWeight="semibold" mb={4}>Project Files</Text>
      {error && <Alert status="error" mb={4}><AlertIcon />{error}</Alert>}
      {projectId === 'new' ? (
        <Text>File upload will be available after creating the project.</Text>
      ) : (
        <>
          <VStack align="stretch" spacing={2} mb={4}>
            {uploadedFiles.map((file) => (
              <Box key={file.id}>
                <Link href={`/api/projects/files/${file.id}`} isExternal color="blue.500" _hover={{ textDecoration: 'underline' }}>
                  {file.file_name}
                </Link>
                <Text as="span" color="gray.500" ml={2}>({(file.file_size / 1024).toFixed(2)} KB)</Text>
              </Box>
            ))}
          </VStack>
          <form onSubmit={handleUpload}>
            <VStack align="stretch" spacing={2}>
              <Input
                type="file"
                onChange={handleFileChange}
                multiple
                accept="*/*"
                py={1}
              />
              <Button type="submit" isDisabled={files.length === 0} colorScheme="blue">
                Upload Files
              </Button>
            </VStack>
          </form>
        </>
      )}
    </Box>
  );
};

export default FileUpload;
