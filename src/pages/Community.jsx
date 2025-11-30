import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Users,
  Plus,
  MessageCircle,
  Hash,
  X,
  Send,
  LogOut
} from 'lucide-react'
import { format } from 'date-fns'

function Community({ user }) {
  const [view, setView] = useState('list')
  const [myCommunities, setMyCommunities] = useState([])
  const [publicCommunities, setPublicCommunities] = useState([])
  const [selectedCommunity, setSelectedCommunity] = useState(null)
  const [messages, setMessages] = useState([])
  const [messageText, setMessageText] = useState('')
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [communityName, setCommunityName] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [isPublic, setIsPublic] = useState(true)

  const PRIMARY = "#4C5BF1"

  // ---------------- FETCH COMMUNITIES ----------------
  useEffect(() => {
    fetchCommunities()
  }, [])

  useEffect(() => {
    if (selectedCommunity && view === "chat") {
      fetchMessages()
      const interval = setInterval(fetchMessages, 3000)
      return () => clearInterval(interval)
    }
  }, [selectedCommunity, view])

  const fetchCommunities = async () => {
    try {
      const [mine, pub] = await Promise.all([
        axios.get('/community/my-communities'),
        axios.get('/community/list')
      ])
      if (mine.data.success) setMyCommunities(mine.data.data || [])
      if (pub.data.success) setPublicCommunities(pub.data.data || [])
    } catch {}
    finally { setLoading(false) }
  }

  const fetchMessages = async () => {
    if (!selectedCommunity) return
    try {
      const res = await axios.get(`/community/messages?communityId=${selectedCommunity._id}&limit=50`)
      if (res.data.success) setMessages(res.data.data || [])
    } catch {}
  }

  // ---------------- CREATE COMMUNITY ----------------
  const handleCreateCommunity = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/community/create', {
        name: communityName,
        isPublic
      })
      setShowCreateModal(false)
      setCommunityName('')
      fetchCommunities()
    } catch {
      alert('Failed to create community')
    }
  }

  // ---------------- JOIN COMMUNITY ----------------
  const handleJoinCommunity = async (id) => {
    try {
      await axios.post(`/community/${id}/join`)
      fetchCommunities()
    } catch {
      alert('Failed to join')
    }
  }

  const handleJoinWithCode = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/community/join-with-code', { joinCode })
      setShowJoinModal(false)
      setJoinCode('')
      fetchCommunities()
    } catch {
      alert('Invalid join code')
    }
  }

  // ---------------- LEAVE COMMUNITY ----------------
  const handleLeaveCommunity = async () => {
    if (!selectedCommunity) return
    if (!confirm("Leave this community?")) return
    try {
      await axios.post('/community/leave', { communityId: selectedCommunity._id })
      setSelectedCommunity(null)
      setView("list")
      fetchCommunities()
    } catch {
      alert("Failed to leave")
    }
  }

  // ---------------- SEND MESSAGE ----------------
  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!messageText.trim() || !selectedCommunity) return

    try {
      await axios.post('/community/messages', {
        message: messageText,
        communityId: selectedCommunity._id
      })
      setMessageText("")
      fetchMessages()
    } catch {
      alert("Failed to send message")
    }
  }

  const openChat = (c) => {
    setSelectedCommunity(c)
    setView("chat")
  }

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-gray-500 text-xl">
        Loading...
      </div>
    )
  }

  // ---------------------------------------------------------
  // --------------------------- CHAT VIEW ---------------------
  // ---------------------------------------------------------
  if (view === "chat" && selectedCommunity) {
    const uid = user._id || user.id

    return (
      <div className="flex flex-col h-screen pt-20">

        {/* Chat Header */}
        <div className="flex items-center gap-4 px-4 py-4 bg-white border-b border-gray-300 shadow-sm">
          <button
            onClick={() => { setView("list"); setSelectedCommunity(null); }}
            className="text-gray-600 hover:text-[#4C5BF1]"
          >
            ← Back
          </button>

          <div className="flex-1">
            <h2 className="text-xl font-semibold">{selectedCommunity.name}</h2>
            <p className="text-gray-500 text-sm">
              {selectedCommunity.memberCount} members
            </p>
          </div>

          {!selectedCommunity.isOwner && (
            <button
              onClick={handleLeaveCommunity}
              className="text-gray-600 hover:text-red-500"
            >
              <LogOut size={22} />
            </button>
          )}
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-gray-100">

          {messages.length === 0 ? (
            <div className="text-center mt-20 text-gray-500">
              <MessageCircle size={48} className="mx-auto mb-4" />
              No messages yet.
            </div>
          ) : (
            messages.map(msg => {
              const isMe =
                msg.userId == uid ||
                msg.userId?.toString() === uid?.toString()

              return (
                <div
                  key={msg._id}
                  className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                    isMe
                      ? "self-end bg-[#4C5BF1] text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {/* Header */}
                  <div
                    className={`flex justify-between mb-1 text-sm ${
                      isMe ? "text-white/80" : "text-gray-600"
                    }`}
                  >
                    <strong>{msg.userName}</strong>
                    <span>{format(new Date(msg.createdAt), "h:mm a")}</span>
                  </div>

                  {/* Message Text */}
                  <div className="break-words">
                    {msg.message}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Input box */}
        <form
          onSubmit={handleSendMessage}
          className="flex gap-2 p-4 bg-white border-t border-gray-300"
        >
          <input
            className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-[#4C5BF1] outline-none"
            placeholder="Type a message..."
            value={messageText}
            onChange={e => setMessageText(e.target.value)}
          />

          <button
            type="submit"
            className="px-4 py-2 bg-[#4C5BF1] text-white rounded-lg hover:bg-[#3f4ed9]"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    )
  }

  // ---------------------------------------------------------
  // ----------------------- COMMUNITY LIST -------------------
  // ---------------------------------------------------------
  return (
    <div className="pt-25 px-20 pb-16 mx-50">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Community</h1>

        <div className="flex gap-2">
          <button
            onClick={() => setShowJoinModal(true)}
            className="px-4 py-2 bg-[#20B2AA] text-white rounded-lg hover:bg-[#159a90] flex items-center gap-2"
          >
            <Hash size={18} />
            Join Code
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-[#4C5BF1] text-white rounded-lg hover:bg-[#3f4ed9] flex items-center gap-2"
          >
            <Plus size={18} />
            Create
          </button>
        </div>
      </div>

      {/* My Communities */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">My Communities</h2>

        {myCommunities.length === 0 ? (
          <div className="bg-white shadow rounded-xl p-6 text-center">
            <Users size={48} className="mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">You haven't joined any communities.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {myCommunities.map(community => (
              <div key={community._id} className="bg-white shadow rounded-xl p-5 flex flex-col">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">{community.name}</h3>
                    <p className="text-gray-500 text-sm">
                      {community.memberCount} members
                    </p>
                  </div>
                  {community.isOwner && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                      Owner
                    </span>
                  )}
                </div>

                <button
                  onClick={() => openChat(community)}
                  className="mt-4 px-4 py-2 bg-[#4C5BF1] text-white rounded-lg hover:bg-[#3f4ed9] flex items-center gap-2"
                >
                  <MessageCircle size={18} />
                  Open Chat
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Public Communities */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Public Communities</h2>

        {publicCommunities.length === 0 ? (
          <div className="bg-white shadow rounded-xl p-6 text-center text-gray-500">
            No public communities.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {publicCommunities
              .filter(c => !myCommunities.some(m => m._id === c._id))
              .map(community => (
                <div
                  key={community._id}
                  className="bg-white shadow rounded-xl p-5 flex flex-col"
                >
                  <h3 className="text-xl font-semibold">{community.name}</h3>
                  <p className="text-gray-500 text-sm mb-4">
                    {community.memberCount} members
                  </p>

                  <button
                    onClick={() => handleJoinCommunity(community._id)}
                    className="px-4 py-2 bg-[#4C5BF1] text-white rounded-lg hover:bg-[#3f4ed9] flex items-center gap-2"
                  >
                    <Plus size={18} />
                    Join
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* ------------ CREATE COMMUNITY MODAL ------------ */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Create Community</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-600 hover:text-red-500"
              >
                <X size={26} />
              </button>
            </div>

            <form onSubmit={handleCreateCommunity} className="space-y-4">

              <div>
                <label className="font-medium">Community Name</label>
                <input
                  type="text"
                  required
                  value={communityName}
                  onChange={e => setCommunityName(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-[#4C5BF1] outline-none"
                  placeholder="Enter community name"
                />
              </div>

              <label className="flex items-center gap-2 text-gray-700">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={e => setIsPublic(e.target.checked)}
                />
                Public Community
              </label>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-[#4C5BF1] text-[#4C5BF1] rounded-lg hover:bg-[#4C5BF1] hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-[#4C5BF1] text-white rounded-lg hover:bg-[#3f4ed9]"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------ JOIN WITH CODE MODAL ------------ */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Join with Code</h2>
              <button
                onClick={() => setShowJoinModal(false)}
                className="text-gray-600 hover:text-red-500"
              >
                <X size={26} />
              </button>
            </div>

            <form onSubmit={handleJoinWithCode} className="space-y-4">

              <div>
                <label className="font-medium">Join Code</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={joinCode}
                  onChange={e => setJoinCode(e.target.value.toUpperCase())}
                  className="mt-1 w-full px-3 py-2 border-2 border-gray-300 rounded-lg tracking-widest uppercase focus:border-[#4C5BF1] outline-none"
                  placeholder="ABC123"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowJoinModal(false)}
                  type="button"
                  className="px-4 py-2 border border-[#4C5BF1] text-[#4C5BF1] rounded-lg hover:bg-[#4C5BF1] hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-[#4C5BF1] text-white rounded-lg hover:bg-[#3f4ed9]"
                >
                  Join
                </button>

              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default Community
