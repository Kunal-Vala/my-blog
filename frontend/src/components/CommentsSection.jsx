import { useState, useEffect } from 'react'
import { commentService } from '../api/commentService'
import './CommentsSection.css'

export default function CommentsSection({ postId }) {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null)

  useEffect(() => {
    fetchComments()
  }, [postId])

  const fetchComments = async () => {
    try {
      setLoading(true)
      const data = await commentService.getCommentsByPost(postId)
      setComments(data)
      setError(null)
    } catch (err) {
      setError(err)
      console.error('Error fetching comments:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    if (!token) {
      setError('You must be logged in to comment')
      return
    }

    try {
      setSubmitting(true)
      await commentService.createComment({
        postId,
        content: newComment,
        published: true,
      })
      setNewComment('')
      fetchComments()
    } catch (err) {
      setError(err)
      console.error('Error creating comment:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (commentId) => {
    if (confirm('Delete this comment?')) {
      try {
        await commentService.deleteComment(commentId)
        fetchComments()
      } catch (err) {
        setError(err)
      }
    }
  }

  if (loading) return <div className="comments-section"><p>Loading comments...</p></div>

  return (
    <div className="comments-section">
      <h3>Comments ({comments.length})</h3>

      {error && <div className="error">{error}</div>}

      {token && (
        <form onSubmit={handleSubmit} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            rows="3"
          ></textarea>
          <button type="submit" className="btn-success" disabled={submitting}>
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      )}

      {!token && (
        <p className="login-prompt">
          <a href="/login">Login</a> to leave a comment
        </p>
      )}

      <div className="comments-list">
        {comments.length === 0 ? (
          <p>No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <strong>{comment.author?.username || 'Anonymous'}</strong>
                <span className="comment-date">{new Date(comment.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="comment-content">{comment.content}</p>
              {user?.userId === comment.authorId && (
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="btn-danger-small"
                >
                  Delete
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
