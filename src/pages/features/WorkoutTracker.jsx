import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { Activity, Plus, Trash2, Clock, Flame, CalendarDays } from 'lucide-react'
import { format } from 'date-fns'
import { getLatestApprovedPlan } from '../../services/weeklyWorkoutPlan'

function WorkoutTracker() {
  const [workouts, setWorkouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [weeklyPlan, setWeeklyPlan] = useState(null)
  const [planError, setPlanError] = useState('')

  const [formData, setFormData] = useState({
    workoutType: 'Running',
    startTime: new Date().toISOString().slice(0, 16),
    durationMinutes: 30,
    calories: 0,
    met: 6.0
  })

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    setLoading(true)
    await Promise.all([fetchWorkouts(), fetchWeeklyPlan()])
    setLoading(false)
  }

  const fetchWorkouts = async () => {
    try {
      const res = await axios.get('/workouts/logs?limit=50')
      if (res.data.success) {
        setWorkouts(res.data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch workouts:', error)
    }
  }

  const fetchWeeklyPlan = async () => {
    const result = await getLatestApprovedPlan()
    if (result.success) {
      setWeeklyPlan(result.data)
      setPlanError(result.localOnly ? 'Showing locally saved plan (backend unavailable).' : '')
    } else {
      setPlanError(result.error || 'Unable to load weekly plan')
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

  const handleDelete = async () => {
    alert('Delete endpoint is not available in backend yet.')
  }

  const workoutTypes = [
    'Running', 'Walking', 'Cycling', 'Swimming', 'Weight Training',
    'Yoga', 'Pilates', 'Dancing', 'HIIT', 'Rowing', 'Elliptical', 'Other'
  ]

  const parsedSchedule = useMemo(() => {
    const planText = weeklyPlan?.planText || ''
    if (!planText.trim()) return []

    const lines = planText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)

    return lines
      .map((line) => line.replace(/^-\s*/, ''))
      .filter((line) => /^Day\s+\d+:/i.test(line))
      .slice(0, 7)
  }, [weeklyPlan])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex justify-center items-center text-gray-500 text-xl h-48">Loading...</div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
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

      <div className="bg-white shadow rounded-lg p-5 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <CalendarDays size={18} className="text-blue-600" />
          <h2 className="text-lg font-semibold text-slate-900">Weekly Workout Schedule</h2>
        </div>

        {!weeklyPlan ? (
          <p className="text-sm text-slate-500">No approved weekly plan yet. Generate one in Workout AI.</p>
        ) : (
          <>
            <p className="text-sm text-slate-600 mb-2">
              Goal: <span className="font-medium">{weeklyPlan.goal}</span>
            </p>
            {parsedSchedule.length ? (
              <div className="space-y-1 text-sm text-slate-700">
                {parsedSchedule.map((line, idx) => (
                  <p key={idx}>• {line}</p>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">Plan found, but no day-wise lines were detected.</p>
            )}
          </>
        )}

        {planError ? <p className="text-xs text-orange-600 mt-2">{planError}</p> : null}
      </div>

      {workouts.length === 0 ? (
        <div className="bg-white shadow rounded-lg text-center p-12">
          <Activity size={64} className="mx-auto mb-6 text-gray-400" />
          <h2 className="text-2xl font-semibold mb-2">No Workouts Logged</h2>
          <p className="text-gray-500 mb-8">Start tracking your workouts to see your progress.</p>

          <button
            className="px-4 py-2 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg mx-auto"
            onClick={() => setShowModal(true)}
          >
            <Plus size={18} />
            Log Your First Workout
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {workouts.map((workout) => (
            <div key={workout._id} className="bg-white shadow rounded-lg p-5">
              <div className="flex justify-between mb-3">
                <div>
                  <h3 className="text-xl font-semibold">{workout.workoutType}</h3>
                  <p className="text-gray-500">{format(new Date(workout.startTime), 'MMM dd, yyyy • h:mm a')}</p>
                </div>

                <button
                  className="p-2 text-gray-400 hover:text-red-500 transition"
                  onClick={handleDelete}
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="flex gap-6 text-gray-600 text-sm">
                <div className="flex items-center gap-2">
                  <Clock size={18} />
                  <span>{Math.round(workout.durationSeconds / 60)} min</span>
                </div>

                <div className="flex items-center gap-2">
                  <Flame size={18} />
                  <span>{Math.round(workout.calories)} cal</span>
                </div>

                {workout.met ? (
                  <div className="flex items-center gap-2">
                    <Activity size={18} />
                    <span>MET: {workout.met}</span>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal ? (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4 z-50"
          onClick={() => setShowModal(false)}
        >
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Log Workout</h2>
              <button className="text-gray-500 hover:text-red-500 text-2xl font-bold" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Workout Type</label>
                <select
                  value={formData.workoutType}
                  onChange={(e) => setFormData({ ...formData, workoutType: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:border-indigo-500 outline-none"
                >
                  {workoutTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block mb-1 font-medium">Start Time</label>
                <input
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1 font-medium">Duration (minutes)</label>
                <input
                  type="number"
                  value={formData.durationMinutes}
                  onChange={(e) => {
                    const minutes = Number.parseInt(e.target.value, 10) || 0
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

              <div className="mb-4">
                <label className="block mb-1 font-medium">MET Value</label>
                <select
                  value={formData.met}
                  onChange={(e) => {
                    const met = Number.parseFloat(e.target.value)
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

              <div className="mb-4">
                <label className="block mb-1 font-medium">Calories Burned</label>
                <input
                  type="number"
                  value={formData.calories}
                  onChange={(e) => setFormData({ ...formData, calories: Number.parseInt(e.target.value, 10) || 0 })}
                  className="w-full p-3 border rounded-lg focus:border-indigo-500 outline-none"
                  min="0"
                />
                <p className="text-gray-400 text-sm mt-1">Auto-calculated based on duration and MET</p>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                  Log Workout
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default WorkoutTracker