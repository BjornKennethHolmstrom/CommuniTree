import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { 
  Button, 
  Heading, 
  Textarea, 
  Alert, 
  AlertIcon, 
  VStack, 
  Text, 
  Box
} from '@chakra-ui/react';

const Comments = ({ 
  projectId,
  maxComments,
  allowReplies = false,
  allowEditing = true,
  allowDeleting = true,
  sortOrder = 'desc',
  onCommentAdd,
  onCommentEdit,
  onCommentDelete,
  refreshInterval
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (projectId && projectId !== 'new') {
      fetchComments();

      if (refreshInterval) {
        const interval = setInterval(fetchComments, refreshInterval);
        return () => clearInterval(interval);
      }
    }
  }, [projectId, refreshInterval]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/comments`, {
        headers: { 'x-auth-token': user.token }
      });
      if (!response.ok) throw new Error('Failed to fetch comments');
      let data = await response.json();
      
      if (sortOrder === 'desc') {
        data = data.reverse();
      }
      
      if (maxComments) {
        data = data.slice(0, maxComments);
      }
      
      setComments(data);
    } catch (err) {
      setError(t('comments.fetchError') + err.message);
    }
  };

  const addComment = async (e) => {
    e.preventDefault();
    setLoading(true);
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
      const addedComment = await response.json();
      
      setNewComment('');
      await fetchComments();
      
      if (onCommentAdd) {
        onCommentAdd(addedComment);
      }
    } catch (err) {
      setError(t('comments.addError') + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box mt={8}>
      <Heading as="h3" size="lg" mb={4}>{t('comments.title')}</Heading>
      {error && <Alert status="error" mb={4}><AlertIcon />{error}</Alert>}
      {projectId === 'new' ? (
        <Text>{t('comments.unavailable')}</Text>
      ) : (
        <>
          <VStack align="stretch" spacing={4} mb={4}>
            {comments.map((comment) => (
              <Box key={comment.id} p={3} borderWidth="1px" borderRadius="md">
                <Text>{comment.content}</Text>
                <Text fontSize="sm" color="gray.500">
                  {t('comments.by')} {comment.user_name} {t('comments.on')} {new Date(comment.created_at).toLocaleString()}
                </Text>
              </Box>
            ))}
          </VStack>
          <form onSubmit={addComment}>
            <VStack align="stretch" spacing={2}>
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={t('comments.commentPlaceholder')}
              />
              <Button type="submit" isDisabled={!newComment.trim()} colorScheme="blue">
                {t('comments.addComment')}
              </Button>
            </VStack>
          </form>
        </>
      )}
    </Box>
  );
};

Comments.propTypes = {
  // Required props
  projectId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,

  // Optional configuration
  maxComments: PropTypes.number,
  allowReplies: PropTypes.bool,
  allowEditing: PropTypes.bool,
  allowDeleting: PropTypes.bool,
  sortOrder: PropTypes.oneOf(['asc', 'desc']),
  refreshInterval: PropTypes.number,

  // Optional callbacks
  onCommentAdd: PropTypes.func,
  onCommentEdit: PropTypes.func,
  onCommentDelete: PropTypes.func,

  // Comment shape (for documentation)
  comment: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    content: PropTypes.string.isRequired,
    user_name: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    parent_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    replies: PropTypes.array
  }),

  // Optional styling
  containerStyle: PropTypes.object,
  commentStyle: PropTypes.object,
  textareaStyle: PropTypes.object
};

Comments.defaultProps = {
  maxComments: undefined,
  allowReplies: false,
  allowEditing: true,
  allowDeleting: true,
  sortOrder: 'desc',
  refreshInterval: undefined,
  onCommentAdd: undefined,
  onCommentEdit: undefined,
  onCommentDelete: undefined,
  containerStyle: {},
  commentStyle: {},
  textareaStyle: {}
};

export default Comments;
