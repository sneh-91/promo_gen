# Promo Gen 🎤

An over-the-top wrestling promo generator that lets you build two contenders, run a full microphone battle, generate portraits and TTS voice lines, and get a final judged winner with scores.

## Live App 🚀

https://promo-gen-snehith-reddy-s-projects.vercel.app/

## Stack 🧰

- Frontend: React, Vite
- Backend: FastAPI, Pydantic
- AI: OpenAI text generation, image generation, and TTS

## What It Does 💥

- Builds two custom wrestlers from user-provided profiles
- Generates a turn-based promo exchange
- Produces full-body wrestler portraits
- Produces per-turn promo audio with voice-style steering
- Judges the exchange and declares a winner with scores and reasoning

## Running Locally 🛠️

### Backend ⚙️

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend endpoints:

- `http://localhost:8000/health`
- `http://localhost:8000/docs`

### Frontend 🎨

```powershell
cd frontend
npm install
npm run dev
```

Frontend usually runs at:

- `http://localhost:5173`

## Environment 🔐

### Backend 🔧

Create `backend/.env` locally with at least:

```env
OPENAI_API_KEY=your_key_here
```

Common optional settings:

```env
APP_ACCESS_KEY=your_shared_key
CORS_ORIGINS=["http://localhost:5173"]
DAILY_PROMO_LIMIT=10
MONTHLY_PROMO_LIMIT=100
USAGE_DB_PATH=usage.db
OPENAI_MODEL=gpt-5.4-nano
OPENAI_TTS_MODEL=gpt-4o-mini-tts
```

### Frontend 🌐

Create `frontend/.env` locally with:

```env
VITE_API_BASE=http://localhost:8000
VITE_APP_ACCESS_KEY=your_shared_key
```

## Production ☁️

- Frontend is deployed on Vercel
- Backend is deployed on Railway
- The frontend sends requests to `/api/promo` first, then `/api/judge` in the background while the promo is being displayed
- Backend quota limits are enforced server-side

## Project Layout 📁

- [backend/app/main.py](C:/Users/snehi/projects/promo_gen/backend/app/main.py) - FastAPI app entry
- [backend/app/routers/promo.py](C:/Users/snehi/projects/promo_gen/backend/app/routers/promo.py) - promo and judge endpoints
- [backend/app/services/promo.py](C:/Users/snehi/projects/promo_gen/backend/app/services/promo.py) - promo, portrait, quota, and judge orchestration
- [backend/app/services/wrestler.py](C:/Users/snehi/projects/promo_gen/backend/app/services/wrestler.py) - wrestler prompt assembly and promo turn generation
- [backend/app/services/tts.py](C:/Users/snehi/projects/promo_gen/backend/app/services/tts.py) - TTS generation
- [frontend/src/App.jsx](C:/Users/snehi/projects/promo_gen/frontend/src/App.jsx) - main frontend flow

## Verification ✅

```powershell
cd frontend
npm run build
```

```powershell
python -m compileall backend\app
```

## Technical Notes 🧠

- Promo generation currently uses a server-side `TOTAL_TURNS` constant in [backend/app/services/promo.py](C:/Users/snehi/projects/promo_gen/backend/app/services/promo.py).
- Portrait generation retries once before giving up.
- TTS and transcript generation both use backend voice-style mappings so the selected voice affects both writing and delivery.
- Wrestler profile text is treated as untrusted prompt input and is explicitly delimited before being passed to the model.
- Judge requests are structured and scored independently after promo generation, rather than blocking the promo response.
- Successful `/api/promo` runs count against quota; failed runs do not.

## Notes 📝

- `QUICKSTART.md` is still available if you want a more step-by-step local setup flow.
- Secrets should live in local `.env` files or deployment platform env settings, never in git.
