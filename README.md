# Fishtank Unified Platform

**⚠️ IMPORTANT: Backend Removed**  
This UI now uses local mocks in `src/mocks/`. All backend, cloud, and database code has been completely removed.

See **`BACKEND_PURGE_COMPLETE.md`** for comprehensive details on what was removed and how to restore backend functionality.

---

## Quick Start

### Unified Landing Page
```bash
npm install
npm run dev
```
Visit: http://localhost:5173

### Independent Role Apps

**Creator App** (Port 5174)
```bash
cd src/roles/creator
npm install
npm run dev -- --port 5174
```

**Innovator App** (Port 5175)
```bash
cd src/roles/innovator
npm install
npm run dev -- --port 5175
```

**Investor App** (Port 5176)
```bash
cd src/roles/investor
npm install
npm run dev -- --port 5176
```

---

## Architecture

- **Pure Client-Side**: Zero network calls, no backend dependencies
- **Mock Data**: All data comes from `src/mocks/`
- **No Authentication**: Auth pages navigate directly to app (no barriers)
- **Offline-Capable**: Runs without internet connection

---

## Project Structure

```
/
├── src/
│   ├── mocks/              # Mock data layer (NEW)
│   │   ├── data/          # JSON fixtures
│   │   └── api.ts         # Mock API functions
│   ├── pages/             # Unified landing pages
│   ├── router/            # App routing
│   ├── state/             # Zustand stores
│   └── roles/             # Independent role apps
│       ├── creator/       # Creator app (port 5174)
│       ├── innovator/     # Innovator app (port 5175)
│       └── investor/      # Investor app (port 5176)
├── BACKEND_PURGE_COMPLETE.md   # Full purge documentation
└── package.json           # Root dependencies
```

---

## What Was Removed

- ❌ Supabase (auth, database, realtime)
- ❌ All SQL migrations (36 files)
- ❌ Environment variables
- ❌ Backend API calls
- ❌ Cloud SDKs and services

---

## Tech Stack (Client-Side Only)

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Routing**: React Router v6
- **State**: Zustand (local only)
- **Forms**: React Hook Form + Zod
- **UI**: Radix UI primitives
- **Icons**: Lucide React
- **Charts**: Recharts

---

For restoration instructions and full deletion details, see `BACKEND_PURGE_COMPLETE.md`.
