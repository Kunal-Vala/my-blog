import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CreatePostPage from './pages/CreatePostPage'
import PostDetailPage from './pages/PostDetailPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import './App.css'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  return (
    <Router>
      <nav className="navbar">
        <div className="container">
          <h1 className="logo">My Blog</h1>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            {token ? (
              <>
                <li><Link to="/create">Create Post</Link></li>
                <li><span className="user-name">{user?.username}</span></li>
                <li><button onClick={handleLogout} className="btn-primary">Logout</button></li>
              </>
            ) : (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
              </>
            )}
          </ul>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/post/:id" element={<PostDetailPage />} />
        {token && <Route path="/create" element={<CreatePostPage />} />}
        <Route path="/login" element={<LoginPage setToken={setToken} setUser={setUser} />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  )
}

export default App
