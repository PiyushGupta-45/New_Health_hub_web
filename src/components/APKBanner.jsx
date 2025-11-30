import { useState, useEffect } from "react"
import { Download, X, Smartphone } from "lucide-react"
import { useLocation } from "react-router-dom"

function APKBanner() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const location = useLocation()

  const APK_DOWNLOAD_URL ="https://github.com/PiyushGupta-45/New_Health_hub/releases/download/1.0.2/app-release.apk"

  useEffect(() => {
    // Only display on home page
    if (!location.pathname.startsWith("/home")) return

    // Do not show again after dismiss
    if (localStorage.getItem("apk_dismissed") === "true") return

    // show after slight delay
    const appearTimer = setTimeout(() => {
      setVisible(true)
    }, 800)

    // auto hide
    const hideTimer = setTimeout(() => {
      setVisible(false)
    }, 4800)

    return () => {
      clearTimeout(appearTimer)
      clearTimeout(hideTimer)
    }
  }, [location.pathname])

  const dismissBanner = () => {
    setVisible(false)
    setDismissed(true)
    localStorage.setItem("apk_dismissed", "true")
  }

  if (!visible || dismissed) return null

  return (
    <div
      className="
        fixed bottom-5 left-1/2 -translate-x-1/2 
        z-[9999] w-[calc(100%-2rem)] max-w-[600px]
        animate-[fadeSlideUp_0.35s_ease-out]
      "
    >
      {/* Animation Keyframes */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translate(-50%, 40px); }
          to   { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>

      <div className="
        flex items-center gap-4
        bg-gradient-to-r from-blue-700 to-blue-500
        text-white px-4 py-3 rounded-xl shadow-xl
      ">
        
        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
          <Smartphone size={26} />
        </div>

        <div className="flex-1">
          <p className="font-semibold">Get the FitTrack App</p>
          <p className="text-sm opacity-90">Download the Android APK</p>
        </div>

        <button
          onClick={() => window.open(APK_DOWNLOAD_URL)}
          className="bg-white text-blue-600 px-3 py-2 rounded-lg font-semibold shadow hover:bg-white/90 transition"
        >
          <Download size={18} />
        </button>

        <button
          onClick={dismissBanner}
          className="p-2 text-white hover:bg-white/20 rounded-lg transition"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  )
}

export default APKBanner
