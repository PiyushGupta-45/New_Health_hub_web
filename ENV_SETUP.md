# Environment Setup for Frontend

## Setting Up the API Base URL

The frontend needs to know where your deployed backend is located. Follow these steps:

### 1. Create `.env` file

Create a `.env` file in the `frontend` directory:

```bash
cd frontend
touch .env
```

### 2. Add your backend URL

Add the following line to the `.env` file, replacing with your actual deployed backend URL:

```env
VITE_API_BASE_URL=https://your-deployed-backend-url.com/api
```

**Important Notes:**
- The URL should include `/api` at the end
- Use `https://` for production
- Do NOT include a trailing slash after `/api`
- Example: `https://fittrack-api.herokuapp.com/api` or `https://api.yourdomain.com/api`
- **If you forget `/api`, the app will automatically add it, but it's better to include it explicitly**

### 3. Example URLs

```env
# For Heroku deployment
VITE_API_BASE_URL=https://your-app.herokuapp.com/api

# For Railway deployment
VITE_API_BASE_URL=https://your-app.railway.app/api

# For Render deployment
VITE_API_BASE_URL=https://your-app.onrender.com/api

# For custom domain
VITE_API_BASE_URL=https://api.yourdomain.com/api

# For local development (fallback if not set)
# Defaults to: http://localhost:5000/api

# Google OAuth Client ID (required for Google Sign-In)
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### Google Sign-In Setup

To enable Google Sign-In, you need to:

1. **Get Google OAuth Client ID:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Go to "Credentials" → "Create Credentials" → "OAuth client ID"
   - Choose "Web application"
   - Add authorized JavaScript origins:
     - `http://localhost:3000` (for development)
     - Your production domain (e.g., `https://yourdomain.com`)
   - Add authorized redirect URIs:
     - `http://localhost:3000` (for development)
     - Your production domain
   - Copy the Client ID

2. **Add to `.env` file:**
   ```env
   VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   ```

3. **Restart the development server**

### 4. Restart Development Server

After creating/updating the `.env` file, restart your development server:

```bash
npm run dev
```

### 5. Verify Configuration

The app will log the API base URL in the browser console on startup. Check the console to verify it's using the correct URL.

## Troubleshooting

- **CORS Errors**: Make sure your backend has CORS enabled for your frontend domain
- **401 Unauthorized**: Check that your backend JWT_SECRET matches
- **404 Not Found**: Verify the API URL includes `/api` at the end
- **Connection Refused**: Check that your backend is actually deployed and running

