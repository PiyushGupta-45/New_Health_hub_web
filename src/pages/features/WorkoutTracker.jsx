import { useState, useEffect } from 'react'
import axios from 'axios'
import { Activity, Plus, Trash2, Clock, Flame } from 'lucide-react'
import { format } from 'date-fns'

function WorkoutTracker({ user }) {
  const [workouts, setWorkouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    workoutType: 'Running',
    startTime: new Date().toISOString().slice(0, 16),
    durationMinutes: 30,
    calories: 0,
    met: 6.0
  })

  useEffect(() => {
    fetchWorkouts()
  }, [])

  const fetchWorkouts = async () => {
    try {
      const res = await axios.get('/workouts/logs?limit=50')
      if (res.data.success) {
        setWorkouts(res.data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch workouts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const startTime = new Date(formData.startTime)
      const durationSeconds = formData.durationMinutes * 60

      await axios.post('/workouts/logs', {
        workoutType: formData.workoutType,
        startTime: startTime.toISOString(),
        durationSeconds,
        calories: formData.calories || Math.round(formData.durationMinutes * formData.met * 3.5),
        met: formData.met
      })

      setShowModal(false)
      setFormData({
        workoutType: 'Running',
        startTime: new Date().toISOString().slice(0, 16),
        durationMinutes: 30,
        calories: 0,
        met: 6.0
      })
      fetchWorkouts()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to log workout')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this workout?')) return
    alert('Delete functionality requires backend endpoint')
  }

  const workoutTypes = [
    'Running', 'Walking', 'Cycling', 'Swimming', 'Weight Training',
    'Yoga', 'Pilates', 'Dancing', 'HIIT', 'Rowing', 'Elliptical', 'Other'
  ]

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex justify-center items-center text-gray-500 text-xl h-48">
          Loading...
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Workout Tracker</h1>

        <button
          className="px-4 py-2 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
          onClick={() => setShowModal(true)}
        >
          <Plus size={18} />
          Log Workout
        </button>
      </div>

      {/* No Workouts */}
      {workouts.length === 0 ? (
        <div className="bg-white shadow rounded-lg text-center p-12">
          <Activity size={64} className="mx-auto mb-6 text-gray-400" />
          <h2 className="text-2xl font-semibold mb-2">No Workouts Logged</h2>
          <p className="text-gray-500 mb-8">
            Start tracking your workouts to see your progress.
          </p>

          <button
            className="px-4 py-2 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
            onClick={() => setShowModal(true)}
          >
            <Plus size={18} />
            Log Your First Workout
          </button>
        </div>
      ) : (

        /* Workout List */
        <div className="flex flex-col gap-4">
          {workouts.map(workout => (
            <div key={workout._id} className="bg-white shadow rounded-lg p-5">

              {/* Header */}
              <div className="flex justify-between mb-3">
                <div>
                  <h3 className="text-xl font-semibold">{workout.workoutType}</h3>
                  <p className="text-gray-500">
                    {format(new Date(workout.startTime), 'MMM dd, yyyy • h:mm a')}
                  </p>
                </div>

                <button
                  className="p-2 text-gray-400 hover:text-red-500 transition"
                  onClick={() => handleDelete(workout._id)}
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Stats */}
              <div className="flex gap-6 text-gray-600 text-sm">

                <div className="flex items-center gap-2">
                  <Clock size={18} />
                  <span>{Math.round(workout.durationSeconds / 60)} min</span>
                </div>

                <div className="flex items-center gap-2">
                  <Flame size={18} />
                  <span>{Math.round(workout.calories)} cal</span>
                </div>

                {workout.met && (
                  <div className="flex items-center gap-2">
                    <Activity size={18} />
                    <span>MET: {workout.met}</span>
                  </div>
                )}

              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4 z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Log Workout</h2>
              <button
                className="text-gray-500 hover:text-red-500 text-2xl font-bold"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>

              {/* Workout Type */}
              <div className="mb-4">
                <label className="block mb-1 font-medium">Workout Type</label>
                <select
                  value={formData.workoutType}
                  onChange={(e) => setFormData({ ...formData, workoutType: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:border-indigo-500 outline-none"
                >
                  {workoutTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Start Time */}
              <div className="mb-4">
                <label className="block mb-1 font-medium">Start Time</label>
                <input
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:border-indigo-500 outline-none"
                />
              </div>

              {/* Duration */}
              <div className="mb-4">
                <label className="block mb-1 font-medium">Duration (minutes)</label>
                <input
                  type="number"
                  value={formData.durationMinutes}
                  onChange={(e) => {
                    const minutes = parseInt(e.target.value) || 0
                    setFormData({
                      ...formData,
                      durationMinutes: minutes,
                      calories: Math.round(minutes * formData.met * 3.5)
                    })
                  }}
                  className="w-full p-3 border rounded-lg focus:border-indigo-500 outline-none"
                  min="1"
                />
              </div>

              {/* MET */}
              <div className="mb-4">
                <label className="block mb-1 font-medium">MET Value</label>
                <select
                  value={formData.met}
                  onChange={(e) => {
                    const met = parseFloat(e.target.value)
                    setFormData({
                      ...formData,
                      met,
                      calories: Math.round(formData.durationMinutes * met * 3.5)
                    })
                  }}
                  className="w-full p-3 border rounded-lg focus:border-indigo-500 outline-none"
                >
                  <option value="3.0">Low (3.0)</option>
                  <option value="6.0">Medium (6.0)</option>
                  <option value="9.0">High (9.0)</option>
                </select>
              </div>

              {/* Calories */}
              <div className="mb-4">
                <label className="block mb-1 font-medium">Calories Burned</label>
                <input
                  type="number"
                  value={formData.calories}
                  onChange={(e) =>
                    setFormData({ ...formData, calories: parseInt(e.target.value) || 0 })
                  }
                  className="w-full p-3 border rounded-lg focus:border-indigo-500 outline-none"
                  min="0"
                />
                <p className="text-gray-400 text-sm mt-1">
                  Auto-calculated based on duration and MET
                </p>
              </div>

              {/* Buttons */}
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
                  Log Workout
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default WorkoutTracker
