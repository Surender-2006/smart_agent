# EcoGrid AI — Setup & Installation Guide

## Prerequisites

| Requirement | Version | Check Command |
|---|---|---|
| Node.js | v18 or higher | `node -v` |
| npm | v9 or higher | `npm -v` |
| MongoDB | v6 or higher | `mongod --version` |
| Git | Any | `git --version` |

---

## Step 1 — Clone / Open the Project

```
cd "c:\Users\suren\OneDrive\Desktop\Smart Agent"
```

---

## Step 2 — Start MongoDB

MongoDB must be running before starting the backend.

**Option A — Run manually:**
```bash
mongod
```

**Option B — Windows Service (auto-start):**
If MongoDB is installed as a Windows service, it starts automatically.
Verify it is running:
```bash
sc query MongoDB
```

MongoDB will connect to: `mongodb://localhost:27017/smart-agent`

---

## Step 3 — Configure Backend Environment

The `.env` file is located at `backend/.env`.

```env
MONGODB_URI=mongodb://localhost:27017/smart-agent
PORT=5001
OPENAI_API_KEY=           # Optional — leave blank to use demo data
LLM_MODEL=gpt-4o-mini     # Optional
```

> **Note:** If `OPENAI_API_KEY` is not set, all 8 agents will use built-in realistic demo data. The system works fully without an API key.

---

## Step 4 — Start the Backend

Open a terminal and run:

```bash
cd "c:\Users\suren\OneDrive\Desktop\Smart Agent\backend"
npm install
npm start
```

**Expected output:**
```
🗄️  MongoDB connected
Server running on port 5001
✅ Auto-seeded devices
```

> **Port conflict?** If you see `EADDRINUSE: port 5001`, run:
> ```bash
> netstat -ano | findstr :5001
> taskkill /PID <PID_NUMBER> /F
> npm start
> ```

---

## Step 5 — Start the Frontend

Open a **second terminal** and run:

```bash
cd "c:\Users\suren\OneDrive\Desktop\Smart Agent\frontend"
npm install
npm run dev
```

**Expected output:**
```
  VITE v8.x.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

---

## Step 6 — Open in Browser

Navigate to: **http://localhost:5173**

---

## Login Credentials

Use the following credentials to test each role:

| Role | Email | Password |
|---|---|---|
| Consumer | consumer@ecogrid.com | password123 |
| EB Officer | officer@ecogrid.com | password123 |
| Grid Operator | operator@ecogrid.com | password123 |

> Check `backend/seed.js` or `backend/routes/auth.js` for the actual seeded credentials in your installation.

---

## Running Both Servers — Quick Reference

| Terminal | Directory | Command | URL |
|---|---|---|---|
| Terminal 1 | System | `mongod` | `localhost:27017` |
| Terminal 2 | `backend/` | `npm start` | `localhost:5001` |
| Terminal 3 | `frontend/` | `npm run dev` | `localhost:5173` |

---

## Seeding the Database

To manually seed sample IoT devices:

```bash
cd backend
npm run seed
```

The backend also auto-seeds devices on first startup if the devices collection is empty.

---

## Enabling Real AI (OpenAI)

To use real GPT responses instead of demo data:

1. Get an API key from https://platform.openai.com
2. Add it to `backend/.env`:
   ```env
   OPENAI_API_KEY=sk-your-key-here
   LLM_MODEL=gpt-4o-mini
   ```
3. Restart the backend: `npm start`

All 8 agents will now use GPT for responses. Demo data fallback remains active if the API call fails.

---

## Build for Production

### Frontend Build
```bash
cd frontend
npm run build
```
Output is in `frontend/dist/` — serve with any static file server.

### Backend Production
```bash
cd backend
NODE_ENV=production npm start
```

---

## Common Issues & Fixes

| Issue | Cause | Fix |
|---|---|---|
| `EADDRINUSE: port 5001` | Previous backend still running | `taskkill /PID <pid> /F` |
| `MongoDB connection failed` | MongoDB not running | Start `mongod` |
| `Cannot GET /api/...` | Backend not started | Run `npm start` in backend/ |
| UI not updating | Browser cache | Press `Ctrl + Shift + R` |
| Agent returns no response | Backend not running | Check backend terminal |
| `Module not found` | Dependencies not installed | Run `npm install` |

---

## Development Tips

- Frontend hot-reloads automatically on file save (Vite HMR)
- Backend requires manual restart on file changes (`npm start`)
- All `/api/*` requests from frontend are proxied to `localhost:5001` via `vite.config.js`
- MongoDB data persists between restarts in the `smart-agent` database
