# Promo Gen Quickstart

This project has a FastAPI backend and a Vite/React frontend.

## Backend

From the project root:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The backend runs at:

```text
http://localhost:8000
```

Useful URLs:

```text
http://localhost:8000/health
http://localhost:8000/docs
```

## Frontend

Open a second terminal from the project root:

```powershell
cd frontend
npm install
npm run dev
```

Vite will print the local frontend URL, usually:

```text
http://localhost:5173
```

## Normal Development Flow

1. Start the backend first with `uvicorn app.main:app --reload`.
2. Start the frontend with `npm run dev`.
3. Open the Vite URL in your browser.
4. Keep both terminals running while developing.

## Build Check

To verify the React frontend builds:

```powershell
cd frontend
npm run build
```
