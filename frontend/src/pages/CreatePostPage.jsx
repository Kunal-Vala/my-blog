import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { postService } from '../api/postService'
import './CreatePostPage.css'

export default function CreatePostPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    published: false,
    tags: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and content are required')
      return
    }

    try {
      setLoading(true)
      setError(null)
      const tags = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag)

      const postData = {
        ...formData,
        tags,
      }
      const newPost = await postService.createPost(postData)
      setSuccess('Post created successfully!')
      setTimeout(() => {
        navigate(`/post/${newPost.id}`)
      }, 1000)
    } catch (err) {
      setError(err)
      console.error('Error creating post:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="create-post-wrapper">
        <h2>Create New Post</h2>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <form onSubmit={handleSubmit} className="post-form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter post title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Content *</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Enter post content"
              rows="10"
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags (comma-separated)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g., react, javascript, web"
            />
          </div>

          <div className="form-group checkbox">
            <label htmlFor="published">
              <input
                type="checkbox"
                id="published"
                name="published"
                checked={formData.published}
                onChange={handleChange}
              />
              Publish immediately
            </label>
          </div>

          <button type="submit" className="btn-success" disabled={loading}>
            {loading ? 'Creating...' : 'Create Post'}
          </button>
        </form>
      </div>
    </div>
  )
}
