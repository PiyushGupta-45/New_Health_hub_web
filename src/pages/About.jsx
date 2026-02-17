import { Info, Code, Heart, Activity } from 'lucide-react'

function About() {
  const features = [
    {
      icon: '👣',
      title: 'Step Tracking',
      description: 'Track your daily steps with real-time monitoring'
    },
    {
      icon: '🎯',
      title: 'Goal Setting',
      description: 'Set personalized health goals and get reminders'
    },
    {
      icon: '🤖',
      title: 'Posture Analysis',
      description: 'AI-powered posture correction and analysis'
    },
    {
      icon: '👥',
      title: 'Community',
      description: 'Join communities and connect with others'
    }
  ]

  const technologies = ['React', 'Vite', 'Node.js', 'MongoDB', 'AI/ML']

  return (
    <div className="pb-10">

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#1E40AF] to-[#2563EB] text-white text-center px-6 py-12 rounded-3xl mb-10 shadow-lg">

        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-md mb-4">
          <Activity size={48} color="#1E40AF" />
        </div>

        <h1 className="text-4xl font-bold">FitTrack</h1>
        <p className="text-white/90 text-lg mt-1">Your Personal Health Companion</p>

        <span className="inline-block mt-4 bg-white/20 px-4 py-1 rounded-full text-sm font-semibold">
          Version 1.0.0
        </span>
      </div>


      <div className="max-w-6xl mx-auto px-6">

        {/* Features Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Features</h2>

          <div className="flex flex-col gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white shadow rounded-xl p-4 flex items-center gap-4"
              >
                <div className="text-4xl">{feature.icon}</div>

                <div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-gray-500">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white shadow rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Info size={24} color="#4C5BF1" />
            <h2 className="text-xl font-semibold">About</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            FitTrack helps you reach fitness goals with intelligent tracking,
            personalized insights, and a friendly community. We make wellness
            simple and actionable for everyone.
          </p>
        </div>

        {/* Technology Section */}
        <div className="bg-white shadow rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Code size={24} color="#10B981" />
            <h2 className="text-xl font-semibold">Built With</h2>
          </div>

          <div className="flex flex-wrap gap-3">
            {technologies.map((tech, index) => (
              <span
                key={index}
                className="px-4 py-2 rounded-full border border-indigo-300 bg-indigo-50 text-indigo-600 font-semibold text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="flex justify-center items-center gap-2 text-gray-700">
            <Heart size={16} fill="#ef4444" color="#ef4444" />
            Made with love for your health
          </p>

          <p className="text-gray-500 mt-1">© 2025 FitTrack. All rights reserved.</p>
        </div>

      </div>
    </div>
  )
}

export default About
