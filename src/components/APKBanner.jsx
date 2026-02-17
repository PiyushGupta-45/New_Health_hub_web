import { useState, useEffect, useRef } from "react"
import { Download, X, Smartphone, Megaphone } from "lucide-react"
import { useLocation } from "react-router-dom"

function APKBanner() {
  const [visible, setVisible] = useState(false)
  const location = useLocation()
  const hideTimerRef = useRef(null)

  const APK_DOWNLOAD_URL = "https://github.com/PiyushGupta-45/New_Health_hub/releases/download/1.0.6/app-release.apk"

  const startAutoHide = () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    hideTimerRef.current = setTimeout(() => {
      setVisible(false)
    }, 5000)
  }

  const showBanner = () => {
    setVisible(true)
    startAutoHide()
  }

  useEffect(() => {
    if (location.pathname.startsWith("/home")) {
      const appearTimer = setTimeout(() => {
        showBanner()
      }, 800)

      return () => {
        clearTimeout(appearTimer)
        if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
      }
    }

    setVisible(false)
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
  }, [location.pathname])

  if (!location.pathname.startsWith("/home")) return null

  return (
    <>
      {!visible && (
        <button
          onClick={showBanner}
          className="fixed bottom-5 left-4 z-[9998] flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition"
          title="Show APK banner"
        >
          <Megaphone size={16} />
          <span className="text-sm font-medium">Download app</span>
        </button>
      )}

      {visible && (
        <div
          className="
            fixed bottom-5 left-1/2 -translate-x-1/2
            z-[9999] w-[calc(100%-2rem)] max-w-[600px]
            animate-[fadeSlideUp_0.35s_ease-out]
          "
        >
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
              <p className="font-semibold">Get the HealthHub App</p>
              <p className="text-sm opacity-90">Download the Android APK</p>
            </div>

            <button
              onClick={() => window.open(APK_DOWNLOAD_URL)}
              className="bg-white text-blue-600 px-3 py-2 rounded-lg font-semibold shadow hover:bg-white/90 transition"
            >
              <Download size={18} />
            </button>

            <button
              onClick={() => {
                setVisible(false)
                if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
              }}
              className="p-2 text-white hover:bg-white/20 rounded-lg transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default APKBanner