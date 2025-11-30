import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { 
  User, Mail, Lock, LogOut, Trash2, PauseCircle, 
  Calendar, Shield, Save, Moon, Sun, X
} from 'lucide-react'
import { format } from 'date-fns'

function Profile({ user, setUser, logout }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeactivating, setIsDeactivating] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || ''
      })
    }
  }, [user])

  const getUserInitial = () =>
    user?.name ? user.name.charAt(0).toUpperCase() : 'U'

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) return alert('Name cannot be empty')

    setLoading(true)
    try {
      const res = await axios.put('/user/profile', {
        name: formData.name.trim()
      })

      if (res.data.success) {
        setUser({ ...user, name: formData.name.trim() })
        alert('Profile updated successfully')
      } else {
        alert(res.data.message)
      }
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to update profile')
    }
    setLoading(false)
  }

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword)
      return alert('All fields required')

    if (passwordData.newPassword.length < 6)
      return alert('Password must be 6+ characters')

    if (passwordData.newPassword !== passwordData.confirmPassword)
      return alert('Passwords do not match')

    setIsChangingPassword(true)
    try {
      const res = await axios.post('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      if (res.data.success) {
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
        setShowPasswordModal(false)
        alert('Password changed')
      }
    } catch (e) {
      alert(e.response?.data?.message || 'Failed')
    }
    setIsChangingPassword(false)
  }

  const handleDeactivateAccount = async () => {
    if (!confirm('Are you sure you want to deactivate your account?')) return

    setIsDeactivating(true)
    try {
      const res = await axios.post('/user/deactivate')
      if (res.data.success) {
        logout()
        navigate('/login')
      }
    } catch (e) {
      alert('Failed to deactivate')
    }
    setIsDeactivating(false)
  }

  const handleDeleteAccount = async () => {
    if (!confirm("Delete account permanently?")) return
    const confirmText = prompt('Type DELETE to confirm:')
    if (confirmText !== 'DELETE') return

    setIsDeleting(true)
    try {
      const res = await axios.delete('/user/delete')
      if (res.data.success) {
        logout()
        navigate('/login')
      }
    } catch (e) {
      alert('Failed to delete account')
    }
    setIsDeleting(false)
  }

  const handleSignOut = () => {
    if (confirm('Sign out?')) {
      logout()
      navigate('/login')
    }
  }

  const formatDate = (d) =>
    d ? format(new Date(d), 'MMM dd, yyyy') : 'Unknown'

  return (
    <div className="pt-24 pb-10 max-w-4xl mx-auto px-4">
      
      {/* Page Header */}
      <h1 className="text-3xl font-bold mb-6">Account Settings</h1>

      {/* Profile Card */}
      <div className="bg-white shadow rounded-xl p-8 text-center mb-6">
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-500 text-white 
            rounded-full flex items-center justify-center text-4xl font-bold">
            {getUserInitial()}
          </div>
        </div>
        <h2 className="text-2xl font-semibold">{user?.name}</h2>
        <p className="text-gray-500">{user?.email}</p>
      </div>

      {/* Profile Information */}
      <div className="bg-white shadow rounded-xl p-6 mb-6">
        <h3 className="text-xl font-bold mb-4">Profile Information</h3>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="font-medium flex items-center gap-2 mb-1">
              <User size={18} /> Name
            </label>
            <input
              type="text"
              className="w-full border rounded-lg p-3"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="font-medium flex items-center gap-2 mb-1">
              <Mail size={18} /> Email
            </label>
            <input
              type="email"
              disabled
              className="w-full border rounded-lg p-3 bg-gray-100 cursor-not-allowed"
              value={formData.email}
            />
            <p className="text-gray-500 text-sm mt-1">Email cannot be changed</p>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg p-3 flex justify-center items-center gap-2"
          >
            <Save size={18} /> {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      {/* Appearance */}
      <div className="bg-white shadow rounded-xl p-6 mb-6">
        <h3 className="text-xl font-bold mb-4">Appearance</h3>

        <div className="flex justify-between items-center p-4 rounded-lg hover:bg-gray-50 cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center">
              {darkMode ? <Moon size={26} /> : <Sun size={26} />}
            </div>
            <div>
              <h4 className="font-semibold">{darkMode ? 'Dark Mode' : 'Light Mode'}</h4>
              <p className="text-gray-500 text-sm">Switch theme</p>
            </div>
          </div>

          <label className="relative inline-block w-12 h-6">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
              className="opacity-0 w-0 h-0"
            />
            <span className="absolute cursor-pointer inset-0 bg-gray-300 rounded-full transition 
              peer-checked:bg-indigo-500 before:absolute before:h-5 before:w-5 before:bg-white 
              before:rounded-full before:bottom-0.5 before:left-0.5 before:transition 
              peer-checked:before:translate-x-6"
            ></span>
          </label>
        </div>
      </div>

      {/* Security */}
      <div className="bg-white shadow rounded-xl p-6 mb-6">
        <h3 className="text-xl font-bold mb-4">Security</h3>

        <div 
          className="flex justify-between items-center p-4 hover:bg-gray-50 cursor-pointer rounded-lg"
          onClick={() => setShowPasswordModal(true)}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center">
              <Lock size={26} className="text-indigo-600" />
            </div>
            <div>
              <h4 className="font-semibold">Change Password</h4>
              <p className="text-gray-500 text-sm">Update your password</p>
            </div>
          </div>
          <span className="text-gray-400 text-xl">→</span>
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white shadow rounded-xl p-6 mb-6">
        <h3 className="text-xl font-bold mb-4">Account Actions</h3>

        {/* Sign Out */}
        <div 
          className="flex justify-between items-center p-4 hover:bg-gray-50 cursor-pointer rounded-lg"
          onClick={handleSignOut}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
              <LogOut size={26} className="text-yellow-600" />
            </div>
            <div>
              <h4 className="font-semibold">Sign Out</h4>
              <p className="text-gray-500 text-sm">Leave your account</p>
            </div>
          </div>
          <span className="text-gray-400 text-xl">→</span>
        </div>

        <div className="border-t my-3"></div>

        {/* Deactivate */}
        <div 
          className="flex justify-between items-center p-4 hover:bg-gray-50 cursor-pointer rounded-lg"
          onClick={handleDeactivateAccount}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
              <PauseCircle size={26} className="text-yellow-600" />
            </div>
            <div>
              <h4 className="font-semibold">Deactivate Account</h4>
              <p className="text-gray-500 text-sm">Temporarily disable</p>
            </div>
          </div>
          <span className="text-gray-400 text-xl">→</span>
        </div>

        <div className="border-t my-3"></div>

        {/* Delete */}
        <div 
          className="flex justify-between items-center p-4 hover:bg-red-50 cursor-pointer rounded-lg"
          onClick={handleDeleteAccount}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
              <Trash2 size={26} className="text-red-600" />
            </div>
            <div>
              <h4 className="font-semibold">Delete Account</h4>
              <p className="text-gray-500 text-sm">Permanently remove</p>
            </div>
          </div>
          <span className="text-gray-400 text-xl">→</span>
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">Account Information</h3>

        <div className="flex items-center gap-4 mb-4">
          <Calendar size={22} className="text-indigo-600" />
          <div>
            <p className="text-gray-500 text-sm">Member Since</p>
            <p className="font-semibold">{formatDate(user?.createdAt)}</p>
          </div>
        </div>

        <div className="border-t my-3"></div>

        <div className="flex items-center gap-4">
          <Shield size={22} className="text-indigo-600" />
          <div>
            <p className="text-gray-500 text-sm">Account Type</p>
            <p className="font-semibold">{user?.googleId ? "Google Account" : "Email Account"}</p>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Change Password</h2>
              <button onClick={() => setShowPasswordModal(false)}>
                <X size={24} />
              </button>
            </div>

            <form 
              onSubmit={(e) => { e.preventDefault(); handleChangePassword() }}
              className="space-y-4"
            >
              <div>
                <label className="font-medium">Current Password</label>
                <input 
                  type="password"
                  className="w-full border rounded-lg p-3 mt-1"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                />
              </div>

              <div>
                <label className="font-medium">New Password</label>
                <input 
                  type="password"
                  className="w-full border rounded-lg p-3 mt-1"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                />
              </div>

              <div>
                <label className="font-medium">Confirm New Password</label>
                <input 
                  type="password"
                  className="w-full border rounded-lg p-3 mt-1"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button" 
                  className="px-4 py-2 border rounded-lg"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                >
                  {isChangingPassword ? "Changing..." : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default Profile
