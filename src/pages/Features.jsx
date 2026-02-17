import { useState } from 'react'
import { Calculator, Accessibility, Target, Activity, Trophy, Utensils, Sparkles } from 'lucide-react'
import HealthMetrics from './features/HealthMetrics'
import PostureAnalysis from './features/PostureAnalysis'
import PersonalizedGoals from './features/PersonalizedGoals'
import WorkoutTracker from './features/WorkoutTracker'
import AIDiet from './features/AIDiet'
import AIWorkoutPlan from './features/AIWorkoutPlan'
import Challenges from './Challenges'

function Features({ user }) {
  const [selectedFeature, setSelectedFeature] = useState(null)

  const features = [
    {
      id: 'health-metrics',
      icon: Calculator,
      title: 'Health Metrics',
      subtitle: 'BMR, BMI, and body analysis',
      iconColor: '#8A2BE2',
      component: HealthMetrics
    },
    {
      id: 'posture-analysis',
      icon: Accessibility,
      title: 'Posture Analysis',
      subtitle: 'AI-powered posture correction',
      iconColor: '#20B2AA',
      component: PostureAnalysis
    },
    {
      id: 'personalized-goals',
      icon: Target,
      title: 'Personalized Goals',
      subtitle: 'Set and manage your health goals',
      iconColor: '#FFA500',
      component: PersonalizedGoals
    },
    {
      id: 'workout-tracker',
      icon: Activity,
      title: 'Track Workout',
      subtitle: 'Log and analyze your workouts',
      iconColor: '#FF4500',
      component: WorkoutTracker
    },
    {
      id: 'challenges',
      icon: Trophy,
      title: 'Challenges',
      subtitle: 'Join step challenges and compete',
      iconColor: '#6366F1',
      component: Challenges
    },
    {
      id: 'diet-ai',
      icon: Utensils,
      title: 'Diet AI',
      subtitle: 'Create a daily AI diet plan',
      iconColor: '#16A34A',
      component: AIDiet
    },
    {
      id: 'workout-ai',
      icon: Sparkles,
      title: 'Workout AI',
      subtitle: 'Create and approve a weekly AI plan',
      iconColor: '#2563EB',
      component: AIWorkoutPlan
    }
  ]

  if (selectedFeature) {
    const FeatureComponent = selectedFeature.component
    return (
      <div className="px-6 py-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setSelectedFeature(null)}
            className="px-4 py-2 border border-[#4C5BF1] text-[#4C5BF1] rounded-lg hover:bg-[#4C5BF1] hover:text-white transition"
          >
            ? Back to Features
          </button>
          <h1 className="text-2xl font-semibold">{selectedFeature.title}</h1>
        </div>

        <FeatureComponent user={user} />
      </div>
    )
  }

  return (
    <div className="pt-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Health Hub Features</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon

            return (
              <div
                key={feature.id}
                onClick={() => setSelectedFeature(feature)}
                className="bg-white shadow rounded-xl p-6 text-center cursor-pointer transition transform hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: `${feature.iconColor}20` }}
                >
                  <Icon size={36} color={feature.iconColor} />
                </div>

                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-500">{feature.subtitle}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Features