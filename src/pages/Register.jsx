import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { UserPlus, Mail, Lock, User } from 'lucide-react'
import GoogleSignIn from '../components/GoogleSignIn'

function Register({ onLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await axios.post('/auth/signup', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      })

      if (res.data.success) {
        const { user, token } = res.data
        localStorage.setItem('token', token || user.token)

        onLogin(token || user.token, {
          id: user.id,
          name: user.name,
          email: user.email
        })
      } else {
        setError(res.data.message || 'Registration failed')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">

        {/* Header */}
        <div className="text-center mb-6">
          <UserPlus size={48} className="mx-auto text-[#4C5BF1]" />
          <h1 className="text-2xl font-bold mt-4">Create Account</h1>
          <p className="text-gray-500">Join Health Hub today</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-700 border border-red-300 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <div>
            <label className="font-medium text-gray-700 flex items-center gap-2 mb-1">
              <User size={18} />
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Enter your full name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#4C5BF1] focus:ring-[#4C5BF1] outline-none transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="font-medium text-gray-700 flex items-center gap-2 mb-1">
              <Mail size={18} />
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="Enter your email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#4C5BF1] focus:ring-[#4C5BF1] outline-none transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="font-medium text-gray-700 flex items-center gap-2 mb-1">
              <Lock size={18} />
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={6}
              placeholder="Create a password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#4C5BF1] focus:ring-[#4C5BF1] outline-none transition"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4C5BF1] text-white py-3 rounded-lg font-semibold hover:bg-[#3B48C9] transition"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        {/* Divider */}
        {import.meta.env.VITE_GOOGLE_CLIENT_ID && (
          <>
            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="px-3 text-gray-500 text-sm">or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Google Sign In */}
            <GoogleSignIn
              onSuccess={(token, userData) => {
                localStorage.setItem('token', token)
                onLogin(token, userData)
              }}
              onError={(error) => setError(error)}
              buttonText="Sign up with Google"
              className="w-full"
            />

          </>
        )}

        {/* Footer */}
        <p className="text-center text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[#4C5BF1] font-medium hover:underline">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Register
