import { useState } from 'react'
import { Calculator } from 'lucide-react'

function HealthMetrics({ user }) {
  const [weight, setWeight] = useState(70)
  const [height, setHeight] = useState(175)
  const [age, setAge] = useState(25)
  const [gender, setGender] = useState('Male')
  const [workoutDuration, setWorkoutDuration] = useState(30)
  const [workoutIntensity, setWorkoutIntensity] = useState('medium')

  const calculateBMI = () => {
    const heightInMeters = height / 100
    return (weight / (heightInMeters * heightInMeters)).toFixed(1)
  }

  const getBMIStatus = (bmi) => {
    if (bmi < 18.5) return { status: 'Underweight', color: '#3B82F6' }
    if (bmi < 25) return { status: 'Healthy', color: '#10B981' }
    if (bmi < 30) return { status: 'Overweight', color: '#F59E0B' }
    return { status: 'Obese', color: '#EF4444' }
  }

  const calculateBMR = () => {
    if (gender === 'Male') {
      return Math.round(10 * weight + 6.25 * height - 5 * age + 5)
    } else {
      return Math.round(10 * weight + 6.25 * height - 5 * age - 161)
    }
  }

  const getMET = () => {
    const metValues = { low: 3.0, medium: 6.0, high: 9.0 }
    return metValues[workoutIntensity] || 6.0
  }

  const calculateCaloriesBurned = () => {
    const bmr = calculateBMR()
    const met = getMET()
    const caloriesPerMinute = (bmr / 1440) * met
    return Math.round(caloriesPerMinute * workoutDuration)
  }

  const bmi = parseFloat(calculateBMI())
  const bmiInfo = getBMIStatus(bmi)
  const bmr = calculateBMR()
  const calories = calculateCaloriesBurned()

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Health Metrics Calculator</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Left Card - Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Your Details</h2>

          {/* Weight */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Weight (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
              className="w-full p-3 border rounded-lg focus:border-blue-500 outline-none"
            />
          </div>

          {/* Height */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Height (cm)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
              className="w-full p-3 border rounded-lg focus:border-blue-500 outline-none"
            />
          </div>

          {/* Age */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(parseInt(e.target.value) || 0)}
              className="w-full p-3 border rounded-lg focus:border-blue-500 outline-none"
            />
          </div>

          {/* Gender */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full p-3 border rounded-lg focus:border-blue-500 outline-none"
            >
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>

          {/* Duration */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Workout Duration (minutes)</label>
            <input
              type="number"
              value={workoutDuration}
              onChange={(e) => setWorkoutDuration(parseInt(e.target.value) || 0)}
              className="w-full p-3 border rounded-lg focus:border-blue-500 outline-none"
            />
          </div>

          {/* Intensity */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Workout Intensity</label>
            <select
              value={workoutIntensity}
              onChange={(e) => setWorkoutIntensity(e.target.value)}
              className="w-full p-3 border rounded-lg focus:border-blue-500 outline-none"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {/* Right Card - Results */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Results</h2>

          {/* BMI */}
          <div
            className="bg-gray-50 rounded-lg p-5 mb-4 border-l-4"
            style={{ borderColor: bmiInfo.color }}
          >
            <div className="flex items-center gap-3 mb-2">
              <Calculator size={24} color={bmiInfo.color} />
              <h3 className="text-lg font-semibold">BMI</h3>
            </div>

            <div className="text-4xl font-bold" style={{ color: bmiInfo.color }}>
              {bmi}
            </div>
            <div className="text-lg font-semibold" style={{ color: bmiInfo.color }}>
              {bmiInfo.status}
            </div>
          </div>

          {/* BMR */}
          <div className="bg-gray-50 rounded-lg p-5 mb-4 border-l-4 border-blue-600">
            <div className="flex items-center gap-3 mb-2">
              <Calculator size={24} color="#2563EB" />
              <h3 className="text-lg font-semibold">BMR (Basal Metabolic Rate)</h3>
            </div>

            <div className="text-4xl font-bold text-blue-600">{bmr.toLocaleString()} cal/day</div>
            <p className="text-gray-500">Calories burned at rest</p>
          </div>

          {/* Calories Burned */}
          <div className="bg-gray-50 rounded-lg p-5 border-l-4 border-green-500">
            <div className="flex items-center gap-3 mb-2">
              <Calculator size={24} color="#10B981" />
              <h3 className="text-lg font-semibold">Estimated Calories Burned</h3>
            </div>

            <div className="text-4xl font-bold text-green-600">{calories} cal</div>
            <p className="text-gray-500">
              For {workoutDuration} min of {workoutIntensity} intensity workout
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HealthMetrics
