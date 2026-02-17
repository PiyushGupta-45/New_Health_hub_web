# Environment Setup for Frontend

Create a `.env` file in the project root and set:

```env
VITE_API_BASE_URL=https://your-backend-url.com/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
VITE_HF_API_KEY=your-huggingface-key
VITE_HF_MODEL=Qwen/Qwen2.5-7B-Instruct
VITE_HF_BASE_URL=https://router.huggingface.co/v1
```

## Notes

- `VITE_API_BASE_URL` should include `/api`.
- `VITE_GOOGLE_CLIENT_ID` is required for Google Sign-In.
- `VITE_HF_API_KEY` is required for `Diet AI`, `Workout AI`, and chatbot.
- Restart dev server after editing `.env`.

## Run

```bash
npm install
npm run dev
```