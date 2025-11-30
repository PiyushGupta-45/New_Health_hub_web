import { Camera, AlertCircle } from 'lucide-react'

function PostureAnalysis({ user }) {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Posture Analysis</h1>
      </div>

      {/* Main Card */}
      <div className="bg-white shadow rounded-lg text-center p-12">

        {/* Icon */}
        <Camera size={64} className="text-gray-400 mx-auto mb-6" />

        <h2 className="text-2xl font-semibold mb-3">AI-Powered Posture Analysis</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          This feature uses camera and AI to analyze your posture in real-time.
        </p>

        {/* Info Alert */}
        <div className="flex gap-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-4 mb-8 text-left">
          <AlertCircle size={20} className="mt-1" />

          <div>
            <strong className="block text-blue-900">Coming Soon</strong>
            <p className="text-sm mt-2">
              Posture analysis requires camera access and is best experienced on mobile devices. 
              This feature will be available in a future update.
            </p>
          </div>
        </div>

        {/* How it Works */}
        <div className="max-w-lg mx-auto text-left">
          <h3 className="text-xl font-semibold mb-4">How it works:</h3>

          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">✓</span>
              Uses your device camera to capture your posture
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">✓</span>
              AI analyzes body alignment and positioning
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">✓</span>
              Provides real-time feedback and corrections
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">✓</span>
              Tracks your posture improvement over time
            </li>
          </ul>
        </div>

      </div>
    </div>
  )
}

export default PostureAnalysis
