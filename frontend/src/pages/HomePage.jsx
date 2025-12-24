import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { postService } from '../api/postService'
import DOMPurify from 'dompurify'

import './HomePage.css'

export default function HomePage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const data = await postService.getAllPosts()
      setPosts(data)
      setError(null)
    } catch (err) {
      setError(err)
      console.error('Error fetching posts:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="container"><p>Loading posts...</p></div>
  if (error) return <div className="container error">Error: {error}</div>

  return (
    <div className="container">
      <div className="home-header">
        <h2>All Posts</h2>
        <button onClick={fetchPosts} className="btn-primary">Refresh</button>
      </div>

      {posts.length === 0 ? (
        <p>No posts available</p>
      ) : (
        <div className="posts-grid">
          {posts.map((post) => (
            <div key={post.id} className="post-card">
              <h3>{post.title}</h3>
              <p className="post-meta">
                By {post.author?.username || 'Unknown'} • {new Date(post.createdAt).toLocaleDateString()}
              </p>
              {
                (() => {
                  const textOnly = DOMPurify.sanitize(post.content || '', {
                    ALLOWED_TAGS: [],
                    ALLOWED_ATTR: [],
                  })
                  const excerpt = textOnly.length > 140 ? `${textOnly.slice(0, 140)}…` : textOnly
                  return <p className="post-excerpt">{excerpt}</p>
                })()
              }
              <div className="post-tags">
                {post.tags?.map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
              <Link to={`/post/${post.id}`} className="btn-primary">Read More</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
