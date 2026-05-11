# Promo Gen

WWE-style promo generator with:
- a FastAPI backend for promo generation, judging, portraits, and TTS
- a React/Vite frontend for wrestler setup and promo playback

## Stack

- Backend: FastAPI, OpenAI SDK, Pydantic
- Frontend: React, Vite

## What It Does

- Collects two wrestler profiles
- Generates a back-and-forth promo transcript
- Generates wrestler portraits
- Generates per-turn TTS audio for the promo
- Judges the exchange and declares a winner with scores

## Local Run

### Backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend URLs:

- `http://localhost:8000/health`
- `http://localhost:8000/docs`

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

Usually runs at `http://localhost:5173`.

## Environment

Create `backend/.env` with:

```env
OPENAI_API_KEY=your_key_here
```

Optional settings already supported:

```env
OPENAI_MODEL=gpt-5.4-nano
OPENAI_TTS_MODEL=gpt-4o-mini-tts
```

## Project Layout

- [backend/app/main.py](C:/Users/snehi/projects/promo_gen/backend/app/main.py) - FastAPI app entry
- [backend/app/routers/promo.py](C:/Users/snehi/projects/promo_gen/backend/app/routers/promo.py) - promo and judge endpoints
- [backend/app/services/promo.py](C:/Users/snehi/projects/promo_gen/backend/app/services/promo.py) - promo, portrait, and judge orchestration
- [backend/app/services/tts.py](C:/Users/snehi/projects/promo_gen/backend/app/services/tts.py) - TTS generation
- [frontend/src/App.jsx](C:/Users/snehi/projects/promo_gen/frontend/src/App.jsx) - main app flow

## Build Check

```powershell
cd frontend
npm run build
```

```powershell
python -m compileall backend\app
```

## Notes

- The frontend calls `/api/promo` first, then `/api/judge` in the background while the promo is being displayed.
- Portrait and TTS generation depend on a valid OpenAI API key.
- `QUICKSTART.md` has a slightly more step-by-step setup flow if needed.
