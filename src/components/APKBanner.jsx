import { useState, useEffect } from 'react'
import { Download, X, Smartphone } from 'lucide-react'
import './APKBanner.css'

function APKBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  // GitHub release link - update this with your actual release URL
  // Example: https://github.com/yourusername/healthhub/releases/latest
  // Or direct APK link: https://github.com/yourusername/healthhub/releases/download/v1.0.0/app-release.apk
  const APK_DOWNLOAD_URL = import.meta.env.VITE_APK_DOWNLOAD_URL || 'https://github.com/yourusername/healthhub/releases/latest'

  useEffect(() => {
    // Check if user has dismissed the banner
    const dismissed = localStorage.getItem('apk_banner_dismissed')
    if (dismissed) {
      setIsDismissed(true)
      return
    }

    // Show banner on mobile devices or after a delay
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    
    if (isMobile) {
      // Show immediately on mobile
      setIsVisible(true)
    } else {
      // Show after 3 seconds on desktop
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    localStorage.setItem('apk_banner_dismissed', 'true')
  }

  const handleDownload = () => {
    window.open(APK_DOWNLOAD_URL, '_blank')
  }

  if (isDismissed || !isVisible) {
    return null
  }

  return (
    <div className="apk-banner">
      <div className="apk-banner-content">
        <div className="apk-banner-icon">
          <Smartphone size={24} />
        </div>
        <div className="apk-banner-text">
          <strong>Get the FitTrack Mobile App</strong>
          <span>Download the Android APK for the best experience</span>
        </div>
        <button className="btn btn-primary apk-banner-btn" onClick={handleDownload}>
          <Download size={18} />
          Download APK
        </button>
        <button className="apk-banner-close" onClick={handleDismiss} title="Dismiss">
          <X size={20} />
        </button>
      </div>
    </div>
  )
}

export default APKBanner

