import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import axios from 'axios'

import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Community from './pages/Community'
import Features from './pages/Features'
import About from './pages/About'
import Challenges from './pages/Challenges'
import Profile from './pages/Profile'
import Layout from './Layout'
import APKBanner from './components/APKBanner'
import './App.css'

// API setup
let API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

if (!API_BASE_URL.endsWith('/api')) {
  API_BASE_URL = API_BASE_URL.replace(/\/$/, '') + '/api'
}

axios.defaults.baseURL = API_BASE_URL

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (token) {
      axios.get('/user/profile')
        .then(res => {
          if (res.data.success) setUser(res.data.user)
          else localStorage.removeItem('token')
        })
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = (token, userData) => {
    localStorage.setItem('token', token)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  if (loading) return <div className="loading">Loading...</div>

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <Router>
        <Routes>

          {/* Public Routes */}
          <Route
            path="/login"
            element={user ? <Navigate to="/home" /> : <Login onLogin={login} />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/home" /> : <Register onLogin={login} />}
          />

          {/* Protected Routes using Layout */}
          <Route element={<Layout user={user} logout={logout} />}>
            <Route path="/home" element={<Home user={user} />} />
            <Route path="/community" element={<Community user={user} />} />
            <Route path="/features" element={<Features user={user} />} />
            <Route path="/about" element={<About />} />
            <Route path="/challenges" element={<Challenges user={user} />} />
            <Route path="/profile" element={<Profile user={user} setUser={setUser} logout={logout} />} />
          </Route>

          {/* Redirect */}
          <Route path="/" element={<Navigate to={user ? "/home" : "/login"} />} />
        </Routes>

        <APKBanner />
      </Router>
    </GoogleOAuthProvider>
  )
}

export default App
