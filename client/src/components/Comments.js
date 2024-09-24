import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Button, Heading, Textarea, Alert, AlertIcon, VStack, Text, Box } from '@chakra-ui/react';

const Comments = ({ projectId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (projectId && projectId !== 'new') {
      fetchComments();
    }
  }, [projectId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/comments`, {
        headers: { 'x-auth-token': user.token }
      });
      if (!response.ok) throw new Error('Failed to fetch comments');
      const data = await response.json();
      setComments(data);
    } catch (err) {
      setError('Error fetching comments: ' + err.message);
    }
  };

  const addComment = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/projects/${projectId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': user.token
        },
        body: JSON.stringify({ content: newComment })
      });
      if (!response.ok) throw new Error('Failed to add comment');
      setNewComment('');
      fetchComments();
    } catch (err) {
      setError('Error adding comment: ' + err.message);
    }
  };

  return (
    <Box mt={8}>
      <Heading as="h3" size="lg" mb={4}>Comments</Heading>
      {error && <Alert status="error" mb={4}><AlertIcon />{error}</Alert>}
      {projectId === 'new' ? (
        <Text>Comments will be available after creating the project.</Text>
      ) : (
        <>
          <VStack align="stretch" spacing={4} mb={4}>
            {comments.map((comment) => (
              <Box key={comment.id} p={3} borderWidth="1px" borderRadius="md">
                <Text>{comment.content}</Text>
                <Text fontSize="sm" color="gray.500">
                  By {comment.user_name} on {new Date(comment.created_at).toLocaleString()}
                </Text>
              </Box>
            ))}
          </VStack>
          <form onSubmit={addComment}>
            <VStack align="stretch" spacing={2}>
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
              />
              <Button type="submit" isDisabled={!newComment.trim()} colorScheme="blue">
                Add Comment
              </Button>
            </VStack>
          </form>
        </>
      )}
    </Box>
  );
};

export default Comments;
