# hrms-frontend

React + Vite + TypeScript frontend for **HRMS**, a role-based job board where Job Seekers build résumés and apply to postings, and Employers publish job advertisements and review applications.

This is the **frontend** only. The Spring Boot backend, full architecture, and API documentation live in the main repository: **[HRMS](https://github.com/kamiltuncok/HRMS)**.

## Tech Stack

- **React 19** + **Vite 7** + **TypeScript**
- **React Router 7** — routing
- **Zustand** — auth/session state (persisted to localStorage)
- **TanStack Query** — server state and caching
- **Tailwind CSS** + **Radix UI / shadcn** — UI components
- **react-hook-form** + **Zod** — forms and validation
- **axios** — HTTP client (JWT injection, response unwrapping) in `src/lib/apiClient.ts`

The app uses a feature-based structure under `src/features/*` (auth, jobs, employers, profile, applications, …), with the entry point at `src/main.tsx → src/app/App.tsx → src/app/router.tsx`.

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- The [HRMS backend](https://github.com/kamiltuncok/HRMS) running on `http://localhost:8080`

### Configuration

The backend base URL is read from `VITE_API_URL` (defaults to `http://localhost:8080` if unset):

```bash
# .env
VITE_API_URL=http://localhost:8080
```

### Run

```bash
npm install
npm run dev     # dev server on http://localhost:5173
npm run build   # production build
```

> Tip: from the parent folder containing both `HRMS` and `hrms-frontend`, `run_hrms.ps1` (Windows) starts the backend and frontend together.
