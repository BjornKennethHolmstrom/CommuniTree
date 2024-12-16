import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Alert,
  AlertIcon,
  VStack,
  Text,
  Box,
  Link,
  Input,
  Progress
} from '@chakra-ui/react';

const FileUpload = ({ 
  projectId,
  maxFileSize = 5 * 1024 * 1024, // 5MB
  allowedTypes = ['*/*'],
  maxFiles = 10,
  showFileList = true,
  autoUpload = false,
  onUploadSuccess,
  onUploadError,
  onFileSelect,
  customUploadHandler
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

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
      setError(t('fileUpload.fetchError') + err.message);
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
      setError(t('fileUpload.uploadError') + err.message);
    }
  };

  return (
    <Box mt={8}>
      <Text fontSize="xl" fontWeight="semibold" mb={4}>{t('fileUpload.title')}</Text>
      {error && <Alert status="error" mb={4}><AlertIcon />{error}</Alert>}
      {projectId === 'new' ? (
        <Text>{t('fileUpload.unavailable')}</Text>
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
                {t('fileUpload.uploadFiles')}
              </Button>
            </VStack>
          </form>
        </>
      )}
    </Box>
  );
};

FileUpload.propTypes = {
  // Required props
  projectId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,

  // File constraints
  maxFileSize: PropTypes.number,
  allowedTypes: PropTypes.arrayOf(PropTypes.string),
  maxFiles: PropTypes.number,

  // Display options
  showFileList: PropTypes.bool,
  autoUpload: PropTypes.bool,

  // Optional callbacks
  onUploadSuccess: PropTypes.func,
  onUploadError: PropTypes.func,
  onFileSelect: PropTypes.func,
  customUploadHandler: PropTypes.func,

  // Progress reporting
  onProgressChange: PropTypes.func,

  // File validation
  customValidation: PropTypes.func,

  // File object shape (for documentation)
  file: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    file_name: PropTypes.string.isRequired,
    file_type: PropTypes.string.isRequired,
    file_size: PropTypes.number.isRequired,
    uploaded_at: PropTypes.string
  }),

  // Optional styling
  containerStyle: PropTypes.object,
  fileListStyle: PropTypes.object,
  buttonStyle: PropTypes.object
};

FileUpload.defaultProps = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['*/*'],
  maxFiles: 10,
  showFileList: true,
  autoUpload: false,
  onUploadSuccess: undefined,
  onUploadError: undefined,
  onFileSelect: undefined,
  customUploadHandler: undefined,
  onProgressChange: undefined,
  customValidation: undefined,
  containerStyle: {},
  fileListStyle: {},
  buttonStyle: {}
};

export default FileUpload;
