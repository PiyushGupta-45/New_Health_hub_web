# Environment Setup for Frontend

Create a `.env` file in the project root and set:

```env
VITE_API_BASE_URL=https://your-backend-url.com/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

## Notes

- `VITE_API_BASE_URL` should include `/api`.
- `VITE_GOOGLE_CLIENT_ID` is required for Google Sign-In.
- AI features (`Diet AI`, `Workout AI`, chatbot) now call backend `/api/ai/generate`.
- Do not expose Hugging Face keys in frontend `VITE_` vars.
- Restart dev server after editing `.env`.

## Backend requirement for AI

Set these on backend (Render) environment:

```env
HF_API_KEY=your-huggingface-key
HF_MODEL=Qwen/Qwen2.5-7B-Instruct
HF_BASE_URL=https://router.huggingface.co/v1
```

## Run

```bash
npm install
npm run dev
```