import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'

function GoogleSignIn({ onSuccess, onError, buttonText = 'Continue with Google' }) {
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        console.log('🔵 Google OAuth successful, fetching user info...')
        
        // Get user info from Google using access token
        const userInfoResponse = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`
            }
          }
        )

        console.log('✅ Got user info from Google:', userInfoResponse.data)
        const { email, name, picture } = userInfoResponse.data

        if (!email) {
          throw new Error('Email not provided by Google')
        }

        // Send to backend - backend expects email, name, and idToken
        console.log('📤 Sending to backend:', { email, name: name || email.split('@')[0] })
        
        const backendResponse = await axios.post('/auth/google', {
          email,
          name: name || email.split('@')[0],
          idToken: tokenResponse.access_token, // Backend stores this as googleId
          accessToken: tokenResponse.access_token,
          photoUrl: picture
        })

        console.log('📥 Backend response:', backendResponse.data)

        if (backendResponse.data.success) {
          const { user, token } = backendResponse.data
          const authToken = token || user.token
          
          if (!authToken) {
            throw new Error('No token received from backend')
          }
          
          localStorage.setItem('token', authToken)
          console.log('✅ Google sign in successful!')
          onSuccess(authToken, {
            id: user.id,
            name: user.name,
            email: user.email
          })
        } else {
          const errorMsg = backendResponse.data.message || 'Google sign in failed'
          console.error('❌ Backend returned error:', errorMsg)
          onError(errorMsg)
        }
      } catch (error) {
        console.error('❌ Google sign in error:', error)
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        })
        
        let errorMessage = 'Failed to sign in with Google'
        
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message
        } else if (error.message) {
          errorMessage = error.message
        } else if (error.response?.status === 500) {
          errorMessage = 'Backend server error. Please check your backend is running.'
        } else if (error.response?.status === 404) {
          errorMessage = 'Backend endpoint not found. Check your API URL.'
        } else if (error.code === 'ERR_NETWORK') {
          errorMessage = 'Network error. Check your internet connection and API URL.'
        }
        
        onError(errorMessage)
      }
    },
    onError: (error) => {
      console.error('❌ Google OAuth error:', error)
      if (error.error !== 'popup_closed_by_user') {
        onError(error.error || 'Google sign in was cancelled or failed')
      }
    }
  })

  return (
    <button
  type="button"
  onClick={handleGoogleLogin}
  className="w-full flex items-center justify-center gap-3 whitespace-nowrap border border-gray-300 rounded-lg py-3 bg-white text-gray-700 font-medium shadow-sm hover:bg-gray-50 transition"
>
  <svg width="18" height="18" viewBox="0 0 18 18">
    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
    <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.348 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/>
  </svg>

  {buttonText}
</button>

  )
}

export default GoogleSignIn

