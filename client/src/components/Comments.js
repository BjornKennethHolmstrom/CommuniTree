import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert } from '@/components/ui/alert';

const Comments = ({ projectId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchComments();
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
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Comments</h3>
      {error && <Alert variant="destructive" className="mb-4">{error}</Alert>}
      <ul className="space-y-4 mb-4">
        {comments.map((comment) => (
          <li key={comment.id} className="border p-3 rounded">
            <p>{comment.content}</p>
            <small className="text-gray-500">
              By {comment.user_name} on {new Date(comment.created_at).toLocaleString()}
            </small>
          </li>
        ))}
      </ul>
      <form onSubmit={addComment} className="space-y-2">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full"
        />
        <Button type="submit" disabled={!newComment.trim()}>
          Add Comment
        </Button>
      </form>
    </div>
  );
};

export default Comments;
