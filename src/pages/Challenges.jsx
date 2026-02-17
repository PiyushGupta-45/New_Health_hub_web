import { useState, useEffect } from 'react'
import axios from 'axios'
import { Trophy, Plus, Users, Target, TrendingUp, Calendar, Trash2 } from 'lucide-react'
import { format } from 'date-fns'

function Challenges({ user }) {
  const [challenges, setChallenges] = useState([])
  const [myChallenges, setMyChallenges] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('public')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedChallenge, setSelectedChallenge] = useState(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetSteps: 10000,
    startDate: '',
    endDate: ''
  })

  useEffect(() => {
    fetchChallenges()
  }, [])

  const fetchChallenges = async () => {
    try {
      const [publicRes, myRes] = await Promise.all([
        axios.get('/challenges/list'),
        axios.get('/challenges/my-challenges')
      ])

      if (publicRes.data.success) setChallenges(publicRes.data.data || [])
      if (myRes.data.success) setMyChallenges(myRes.data.data || [])

    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateChallenge = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('/challenges/create', formData)
      if (res.data.success) {
        setShowCreateModal(false)
        setFormData({
          title: '',
          description: '',
          targetSteps: 10000,
          startDate: '',
          endDate: ''
        })
        fetchChallenges()
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create challenge')
    }
  }

  const handleJoinChallenge = async (id) => {
    try {
      await axios.post(`/challenges/${id}/join`)
      fetchChallenges()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to join challenge')
    }
  }

  const handleDeleteChallenge = async (id) => {
    if (!window.confirm('Delete this challenge permanently?')) return
    try {
      await axios.delete(`/challenges/${id}`)
      fetchChallenges()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete challenge')
    }
  }

  const handleViewDetails = async (id) => {
    try {
      const res = await axios.get(`/challenges/${id}`)
      if (res.data.success) {
        setSelectedChallenge(res.data.data)
      }
    } catch {
      alert('Failed to load details')
    }
  }

  const badgeStyles = {
    active: 'bg-green-100 text-green-700',
    upcoming: 'bg-blue-100 text-blue-700',
    completed: 'bg-yellow-100 text-yellow-700'
  }

  if (loading) {
    return (
      <div className="px-6 text-center text-gray-600 text-lg">Loading...</div>
    )
  }

  // ------------------------ DETAILS PAGE ------------------------
  if (selectedChallenge) {
    const sorted = [...selectedChallenge.participants].sort((a, b) => b.steps - a.steps)
    const userId = user._id || user.id
    const myData = sorted.find(p => p.userId == userId)
    const myRank = myData ? sorted.indexOf(myData) + 1 : null

    return (
      <div className="px-6 pb-10">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setSelectedChallenge(null)}
            className="px-4 py-2 border border-[#4C5BF1] text-[#4C5BF1] rounded-lg 
            hover:bg-[#4C5BF1] hover:text-white transition"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold">{selectedChallenge.title}</h1>
        </div>

        <div className="bg-white shadow rounded-xl p-6">

          {/* Status + Info */}
          <div className="flex justify-between mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${badgeStyles[selectedChallenge.status]}`}>
              {selectedChallenge.status}
            </span>

            <div className="text-right">
              <p><strong>Target:</strong> {selectedChallenge.targetSteps.toLocaleString()} steps</p>
              <p><strong>Duration:</strong> {format(new Date(selectedChallenge.startDate),'MMM dd')} - {format(new Date(selectedChallenge.endDate),'MMM dd, yyyy')}</p>
            </div>
          </div>

          {selectedChallenge.description && (
            <p className="text-gray-600 mb-4">{selectedChallenge.description}</p>
          )}

          {/* My Progress */}
          {myData && (
            <div className="bg-gray-100 rounded-xl p-5 mb-6">
              <h3 className="text-lg font-semibold mb-4">Your Progress</h3>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-[#4C5BF1]">{myData.steps.toLocaleString()}</div>
                  <p className="text-gray-500 text-sm">Steps</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#4C5BF1]">{myRank}</div>
                  <p className="text-gray-500 text-sm">Rank</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#4C5BF1]">
                    {((myData.steps / selectedChallenge.targetSteps) * 100).toFixed(1)}%
                  </div>
                  <p className="text-gray-500 text-sm">Complete</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-300 h-3 rounded-full mt-4">
                <div
                  className="h-full rounded-full bg-[#4C5BF1]"
                  style={{
                    width: `${Math.min((myData.steps / selectedChallenge.targetSteps) * 100, 100)}%`
                  }}
                />
              </div>
            </div>
          )}

          {/* Leaderboard */}
          <h3 className="text-xl font-semibold mb-3">Leaderboard</h3>
          <div className="flex flex-col gap-3">
            {sorted.map((p, index) => (
              <div
                key={p.userId}
                className={`flex items-center gap-4 bg-gray-100 rounded-xl p-4 ${p.userId == userId ? 'border-2 border-[#4C5BF1] bg-indigo-50' : ''}`}
              >
                <div className="w-10 text-center font-semibold text-gray-500">
                  {index === 0 && <Trophy size={24} color="#fbbf24" />}
                  {index === 1 && <Trophy size={24} color="#94a3b8" />}
                  {index === 2 && <Trophy size={24} color="#f97316" />}
                  {index > 2 && `#${index + 1}`}
                </div>

                <div className="flex-1">
                  <p className="font-semibold">{p.userName}</p>
                  <p className="text-gray-500 text-sm">{p.steps.toLocaleString()} steps</p>
                </div>

                <p className="font-semibold text-[#4C5BF1]">
                  {((p.steps / selectedChallenge.targetSteps) * 100).toFixed(1)}%
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    )
  }

  // ------------------------ LIST PAGE ------------------------
  const displayChallenges = view === 'my'
    ? myChallenges
    : challenges.filter(c => !myChallenges.some(m => m._id === c._id))

  return (
    <div className="px-6 pb-10">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Challenges</h1>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-[#4C5BF1] text-white rounded-lg hover:bg-[#3f4ed9] flex items-center gap-2 transition"
        >
          <Plus size={18} /> Create Challenge
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 ${
            view === 'public'
              ? 'text-[#4C5BF1] border-b-2 border-[#4C5BF1] font-semibold'
              : 'text-gray-500'
          }`}
          onClick={() => setView('public')}
        >
          Public Challenges
        </button>

        <button
          className={`px-4 py-2 ${
            view === 'my'
              ? 'text-[#4C5BF1] border-b-2 border-[#4C5BF1] font-semibold'
              : 'text-gray-500'
          }`}
          onClick={() => setView('my')}
        >
          My Challenges
        </button>
      </div>

      {/* No Challenges */}
      {displayChallenges.length === 0 ? (
        <div className="bg-white shadow rounded-xl p-10 text-center">
          <Trophy size={64} className="mx-auto text-gray-400" />
          <h2 className="text-xl font-semibold mt-4">No Challenges</h2>
          <p className="text-gray-500">
            {view === 'my'
              ? "You haven't joined any challenges yet"
              : "No public challenges available"}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {displayChallenges.map(challenge => (
            <div key={challenge._id} className="bg-white shadow rounded-xl p-6">

              <div className="flex justify-between mb-3">
                <h3 className="text-xl font-semibold">{challenge.title}</h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${badgeStyles[challenge.status]}`}
                >
                  {challenge.status}
                </span>
              </div>

              {challenge.description && (
                <p className="text-gray-500 mb-3">{challenge.description}</p>
              )}

              <div className="flex flex-col gap-2 mb-4 text-gray-700">
                <div className="flex items-center gap-2">
                  <Target size={18} /> {challenge.targetSteps.toLocaleString()} steps
                </div>
                <div className="flex items-center gap-2">
                  <Users size={18} /> {challenge.participantCount} participants
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={18} />
                  {format(new Date(challenge.startDate), 'MMM dd')} - 
                  {format(new Date(challenge.endDate), 'MMM dd')}
                </div>
              </div>

              {challenge.isParticipant && challenge.mySteps !== undefined && (
                <div className="mb-4">
                  <p className="text-gray-500 mb-1">
                    Your progress: {challenge.mySteps.toLocaleString()} / {challenge.targetSteps.toLocaleString()}
                  </p>

                  <div className="w-full bg-gray-300 h-3 rounded-full">
                    <div
                      className="h-full rounded-full bg-[#4C5BF1]"
                      style={{
                        width: `${Math.min((challenge.mySteps / challenge.targetSteps) * 100, 100)}%`
                      }}
                    />
                  </div>
                </div>
              )}

              <button
                onClick={() =>
                  challenge.isParticipant
                    ? handleViewDetails(challenge._id)
                    : handleJoinChallenge(challenge._id)
                }
                className="w-full mt-3 px-4 py-2 bg-[#4C5BF1] text-white rounded-lg hover:bg-[#3f4ed9] flex items-center justify-center gap-2 transition"
              >
                {challenge.isParticipant ? <TrendingUp size={18} /> : <Plus size={18} />}
                {challenge.isParticipant ? 'View Details' : 'Join Challenge'}
              </button>
              {view === 'my' && challenge.isCreator && (
                <button
                  onClick={() => handleDeleteChallenge(challenge._id)}
                  className="w-full mt-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center justify-center gap-2 transition"
                >
                  <Trash2 size={18} />
                  Delete Challenge
                </button>
              )}

            </div>
          ))}
        </div>
      )}

      {/* Create Challenge Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4">
          <div className="bg-white shadow-xl rounded-xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Create Challenge</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-red-500 text-xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateChallenge} className="space-y-4">

              <div>
                <label className="font-medium">Challenge Title</label>
                <input
                  className="w-full mt-1 p-3 border rounded-lg border-gray-300 focus:border-[#4C5BF1] outline-none"
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="font-medium">Description</label>
                <textarea
                  className="w-full mt-1 p-3 border rounded-lg border-gray-300 focus:border-[#4C5BF1]"
                  rows="3"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="font-medium">Target Steps</label>
                <input
                  type="number"
                  required
                  min="1"
                  className="w-full mt-1 p-3 border rounded-lg border-gray-300"
                  value={formData.targetSteps}
                  onChange={(e) =>
                    setFormData({ ...formData, targetSteps: parseInt(e.target.value) || 1 })
                  }
                />
              </div>

              <div>
                <label className="font-medium">Start Date</label>
                <input
                  type="date"
                  required
                  className="w-full mt-1 p-3 border rounded-lg border-gray-300"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="font-medium">End Date</label>
                <input
                  type="date"
                  required
                  className="w-full mt-1 p-3 border rounded-lg border-gray-300"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  className="px-4 py-2 border border-[#4C5BF1] text-[#4C5BF1] rounded-lg hover:bg-[#4C5BF1] hover:text-white"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#4C5BF1] text-white rounded-lg hover:bg-[#3f4ed9]"
                >
                  Create Challenge
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default Challenges
