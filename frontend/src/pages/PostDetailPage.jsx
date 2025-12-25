import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { postService } from '../api/postService'
import { commentService } from '../api/commentService'
import CommentsSection from '../components/CommentsSection'
import DOMPurify from 'dompurify'
import './PostDetailPage.css'

export default function PostDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    fetchPost()
  }, [id])

  const fetchPost = async () => {
    console.log('[PostDetailPage.fetchPost] Fetching post:', id);
    try {
      setLoading(true)
      const data = await postService.getPostById(id)
      setPost(data)
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      setIsOwner(user.userId === data.authorId)
      setError(null)
    } catch (err) {
      setError(err)
      console.error('Error fetching post:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    console.log('[PostDetailPage.handleDelete] Delete button clicked for post:', id);
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        await postService.deletePost(id)
        navigate('/')
      } catch (err) {
        setError(err)
      }
    }
  }

  if (loading) return <div className="container"><p>Loading post...</p></div>
  if (error) return <div className="container error">Error: {error}</div>
  if (!post) return <div className="container">Post not found</div>

  return (
    <div className="container">
      <div className="post-detail">
        <h1>{post.title}</h1>
        <div className="post-meta-detail">
          <span>By {post.author?.username || 'Unknown'}</span>
          <span>•</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          {post.publishedAt && <span className="published">Published</span>}
        </div>

        {isOwner && (
          <div className="post-actions">
            <button onClick={() => navigate(`/edit/${id}`)} className="btn-primary">
              Edit
            </button>
            <button onClick={handleDelete} className="btn-danger">
              Delete
            </button>
          </div>
        )}

        <div className="post-tags">
          {post.tags?.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>

        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content || '') }}
        />
      </div>

      <CommentsSection postId={id} />
    </div>
  )
}
