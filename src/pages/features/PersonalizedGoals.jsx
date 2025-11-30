import { useState, useEffect } from 'react'
import { Target, Plus, Trash2 } from 'lucide-react'
import { format } from 'date-fns'

function PersonalizedGoals({ user }) {
  const [goals, setGoals] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    target: '',
    unit: 'steps',
    deadline: '',
    reminderTime: '09:00'
  })

  useEffect(() => {
    const savedGoals = localStorage.getItem('goals')
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals))
    }
  }, [])

  const saveGoals = (newGoals) => {
    setGoals(newGoals)
    localStorage.setItem('goals', JSON.stringify(newGoals))
  }

  const handleCreateGoal = (e) => {
    e.preventDefault()
    const newGoal = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
      progress: 0
    }
    saveGoals([...goals, newGoal])
    setShowModal(false)
    setFormData({
      name: '',
      target: '',
      unit: 'steps',
      deadline: '',
      reminderTime: '09:00'
    })
  }

  const handleDeleteGoal = (id) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      saveGoals(goals.filter(g => g.id !== id))
    }
  }

  const activityCategories = [
    { value: 'steps', label: 'Steps' },
    { value: 'water', label: 'Water Intake (L)' },
    { value: 'cardio', label: 'Cardio Minutes' },
    { value: 'calories', label: 'Calorie Burn' },
    { value: 'weight', label: 'Weight Loss (kg)' },
    { value: 'distance', label: 'Distance (km)' }
  ]

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Personalized Goals</h1>
        <button
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium flex items-center gap-2 transition"
          onClick={() => setShowModal(true)}
        >
          <Plus size={18} />
          Set Goal
        </button>
      </div>

      {/* No Goals State */}
      {goals.length === 0 ? (
        <div className="bg-white shadow rounded-lg text-center p-10">
          <Target size={64} className="text-gray-400 mx-auto mb-6" />
          <h2 className="text-xl font-semibold mb-2">No Goals Yet</h2>
          <p className="text-gray-500 mb-6">
            Set personalized health goals to track your progress
          </p>
          <button
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium flex items-center gap-2 mx-auto"
            onClick={() => setShowModal(true)}
          >
            <Plus size={18} />
            Create Your First Goal
          </button>
        </div>
      ) : (

        /* Goal Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map(goal => (
            <div
              key={goal.id}
              className="bg-white shadow rounded-lg p-5 flex flex-col"
            >
              
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                  <Target size={24} className="text-orange-500" />
                </div>
                <button
                  className="p-2 text-gray-400 hover:text-red-500 transition"
                  onClick={() => handleDeleteGoal(goal.id)}
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <h3 className="text-lg font-semibold">{goal.name}</h3>

              {/* Progress */}
              <div className="mt-3">
                <div className="flex items-baseline gap-2 text-xl font-semibold">
                  <span className="text-indigo-600">{goal.progress || 0}</span>
                  <span>/</span>
                  <span>{goal.target}</span>
                  <span className="text-sm text-gray-500">{goal.unit}</span>
                </div>

                <div className="w-full h-3 bg-gray-200 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-orange-500 transition-all"
                    style={{
                      width: `${Math.min(((goal.progress || 0) / parseFloat(goal.target)) * 100, 100)}%`
                    }}
                  />
                </div>
              </div>

              {/* Meta */}
              <div className="mt-4 text-sm text-gray-500 flex flex-col gap-1">
                <p>
                  Deadline:{' '}
                  {goal.deadline
                    ? format(new Date(goal.deadline), 'MMM dd, yyyy')
                    : 'No deadline'}
                </p>
                <p>Reminder: {goal.reminderTime}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Set New Goal</h2>
              <button
                className="text-gray-500 hover:text-red-500 text-2xl font-bold"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateGoal}>
              {/* Name */}
              <div className="mb-4">
                <label className="block mb-1 font-medium">Goal Name</label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg focus:border-indigo-500 outline-none"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  placeholder="e.g., Walk 10,000 steps"
                />
              </div>

              {/* Type */}
              <div className="mb-4">
                <label className="block mb-1 font-medium">Activity Type</label>
                <select
                  className="w-full p-3 border rounded-lg focus:border-indigo-500 outline-none"
                  value={formData.unit}
                  onChange={(e) =>
                    setFormData({ ...formData, unit: e.target.value })
                  }
                  required
                >
                  {activityCategories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Target */}
              <div className="mb-4">
                <label className="block mb-1 font-medium">Target Value</label>
                <input
                  type="number"
                  className="w-full p-3 border rounded-lg focus:border-indigo-500 outline-none"
                  value={formData.target}
                  onChange={(e) =>
                    setFormData({ ...formData, target: e.target.value })
                  }
                  required
                  min="1"
                  placeholder="Enter target"
                />
              </div>

              {/* Deadline */}
              <div className="mb-4">
                <label className="block mb-1 font-medium">Deadline</label>
                <input
                  type="date"
                  className="w-full p-3 border rounded-lg focus:border-indigo-500 outline-none"
                  value={formData.deadline}
                  onChange={(e) =>
                    setFormData({ ...formData, deadline: e.target.value })
                  }
                />
              </div>

              {/* Reminder */}
              <div className="mb-4">
                <label className="block mb-1 font-medium">Reminder Time</label>
                <input
                  type="time"
                  className="w-full p-3 border rounded-lg focus:border-indigo-500 outline-none"
                  value={formData.reminderTime}
                  onChange={(e) =>
                    setFormData({ ...formData, reminderTime: e.target.value })
                  }
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default PersonalizedGoals
