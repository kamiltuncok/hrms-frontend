# Hedef İş — React 19 HRMS / Applicant Tracking Frontend

<div align="center">

![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-5.90-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-5.0-443E38?style=for-the-badge)
![Radix UI](https://img.shields.io/badge/Radix_UI-Primitives-161618?style=for-the-badge&logo=radixui&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-4.3-3E67B1?style=for-the-badge&logo=zod&logoColor=white)

**A feature-sliced React 19 single-page application for a job marketplace — public job search, candidate
registration and application tracking, a seven-tab résumé builder, and an employer hiring portal with a
job-posting form and an applicant review workspace.**

This repository contains **the frontend only**. Every data-bearing screen talks to a separately
maintained Spring Boot backend over HTTP; this repo neither contains nor documents that service.

</div>

---

## Screenshots

Real captures of this React application running locally (`npm run dev`, Chrome, 1440 × 1000 desktop
viewport unless noted).

> **Capture conditions.** The backend API was **not running**, so every list driven by a server response
> renders in its empty or error state. Layout, navigation, forms, validation chrome and component styling
> are exactly what the application produces. Screens that require an authenticated session were **not**
> captured — no token was forged and no auth state was injected to reach them. See
> [Screens not captured](#screens-not-captured) for the full list and the reason for each.

### Job Seeker Experience

**Landing page.** Hero headline, combined keyword + city search, and the statistics strip.

> The four figures in that strip (`10,000+`, `5,000+`, `81`, `%94`) are **static marketing copy
> hardcoded in `HeroSection.tsx`** — they are not live platform metrics.

![Landing page](docs/screenshots/home-hero.png)

**Job search (`/jobs`).** The public job board: keyword input, city selector, search action, a filter
sidebar, a live result counter and a sort control — shown here in its *no results* empty state, because
the job list comes from `GET /api/jobadvertisements/getactive`.

![Job search](docs/screenshots/job-search.png)

**Responsive layout.** The same job search screen at a 414 px viewport: the header collapses to the mark
plus a single call-to-action, and the search bar stacks vertically.

<img src="docs/screenshots/responsive-mobile.png" alt="Responsive job search" width="340" />

### Authentication

| Candidate login | Password recovery request |
|---|---|
| ![Candidate login](docs/screenshots/candidate-login.png) | ![Password recovery](docs/screenshots/password-recovery.png) |

**Registration — dual role.** One page, two Radix tab panels with different schemas: the job-seeker form
collects name, e-mail, national ID and birth year; the employer form collects company name, website,
phone and corporate e-mail.

| Job seeker registration | Employer registration |
|---|---|
| ![Candidate registration](docs/screenshots/candidate-registration.png) | ![Employer registration](docs/screenshots/employer-registration.png) |

**Reset-password token guard.** Visiting `/reset-password` without a valid token renders the rejection
state rather than the password form — the page validates the token before showing any input. No reset
e-mail was triggered to produce this capture.

![Password reset token guard](docs/screenshots/password-reset.png)

### Screens not captured

| Screen | Route | Reason |
|---|---|---|
| Job details | `/jobs/:id` | Entirely server-rendered from `GET /api/jobadvertisements/getbyid`. With the API down the page shows only a *Veri Yükleme Hatası / Network Error* block — nothing of the real detail layout is visible. |
| Employer directory | `/employers` | Same: `GET /api/employers/getall` fails and the page shows only a retry prompt. |
| Candidate dashboard / profile | `/profile` | `ProtectedRoute` redirects to `/login` without an authenticated session. |
| Application tracking | `/profile/applied-jobs` | `ProtectedRoute`; also needs `GET /api/jobapplications/getbyjobseekerid`. |
| Résumé builder | `/profile/edit` | `ProtectedRoute`. The single most substantial screen in the app (910 lines, seven tabs) — documented in detail [below](#interactive-résumé-builder), but not reachable without a real login. |
| Employer job posting form | `/jobs/post` | `ProtectedRoute requiredRole="Employer"`. |
| Applicant review workspace | `/jobs/applications` | `ProtectedRoute requiredRole="Employer"`. |
| `/dashboard` | `/dashboard` | Protected, and currently a placeholder: the route renders `<div className="p-8">Protected Dashboard Area</div>`. There is no dashboard implementation behind it. |

Reaching any protected screen would have required writing a fabricated session into the persisted
Zustand store or minting a fake JWT. Neither was done. No application was submitted, no job was
published, no document or photo was uploaded, and no password-reset e-mail was sent.

---

## Project Overview

**Hedef İş** is a two-sided hiring marketplace frontend.

| Capability | Status |
|---|---|
| Public job board with keyword, city, category and work-model filtering | Implemented; filter UI verified, results require the API |
| Job detail page with application action | Implemented; not visually verifiable without the API |
| Candidate registration, login, password recovery and reset | Implemented; all four screens verified rendering |
| Candidate application history with status badges | Implemented; behind auth |
| Seven-tab résumé builder (summary, socials, account, experience, education, skills & languages, CV) | Implemented; behind auth |
| CV and profile-photo upload | Implemented; behind auth, not exercised |
| Employer job-posting form | Implemented; behind an Employer-role guard |
| Employer applicant review with accept/reject and status counters | Implemented; behind an Employer-role guard |
| `/dashboard` route | Placeholder only — renders a single static `div` |

Nothing in this README claims a workflow has been *tested end to end*. The sections below describe what
the source implements; the screenshot gallery marks what was visually confirmed.

---

## Job Seeker Experience

### Job search and job details

`JobSearchPage` composes a search bar, a filter sidebar and a result list. The `useJobSearch` hook holds
the search state and keeps it in the URL, so a search is shareable and survives a reload:

* `?keyword=` — free-text match against title, company and description, using a Turkish-aware
  case-insensitive comparison (`turkishCaseInsensitiveSearch`, which handles the dotted/dotless `i`).
* `?cityId=` — city selection, options from `GET /api/cities/getall`.
* `?category=` — category selection, options from `GET /api/categories/getall`.
* Work-model and employment-type toggles, plus a newest/oldest sort and a result counter.

Two filter groups render **conditionally on API data**: the work-model checkbox group is wrapped in
`{workModels.length > 0 && ...}`, and the category select falls back to a *Yükleniyor…* placeholder.
That is why the captured screenshot shows the category control alone.

The list fetches once through TanStack Query (`queryKey: ['jobs', 'active']` →
`GET /api/jobadvertisements/getactive`) and filters client-side, with skeleton placeholders while the
query is in flight and a dedicated *no matching listings* empty state with a reset action.

`JobDetailPage` loads one advertisement via `GET /api/jobadvertisements/getbyid?id=` and renders the
posting alongside an apply action that posts to `/api/jobapplications/add`.

### Candidate dashboard and application tracking

`ProfilePage` dispatches on the stored role, rendering `ProfileJobseeker` or `ProfileEmployer` from the
same route. `AppliedJobsPage` lists the signed-in candidate's applications from
`GET /api/jobapplications/getbyjobseekerid`, rendering each through `AppliedJobCard` with a status badge
drawn from the `PENDING` / `ACCEPTED` / `REJECTED` set the backend returns.

> Both screens are behind `ProtectedRoute` and were not captured.

### Interactive résumé builder

`EditProfileJobseeker` is the largest screen in the application — a tabbed editor built on Radix Tabs
with seven panels:

| Tab | Contents | API |
|---|---|---|
| **Profesyonel Özet** | Free-text professional summary | `POST /api/resumes/add` or `/update` |
| **Sosyal Hesaplar** | GitHub, LinkedIn and portfolio URLs | same résumé save endpoint |
| **Hesap Bilgileri** | Phone, address, birth date | `PUT /api/jobseekers/update?id=` |
| **İş Deneyimi** | Company, position, start/end dates; add and remove entries | `POST /api/jobexperiences/add`, `/delete?id=` |
| **Eğitim** | School, department, dates; add and remove entries | `POST /api/schools/add`, `/delete?id=` |
| **Yetenekler & Diller** | Technical skills, plus languages with a proficiency level | `POST /api/skills/add` · `/api/languages/add` and their `/delete?id=` counterparts |
| **CV / Özgeçmiş** | PDF upload, download, and a *no CV yet* empty state | `POST /api/resumes/uploadcv?jobSeekerId=` (multipart), `GET /api/resumes/downloadcv?jobSeekerId=` (blob) |

A separate profile-photo upload posts multipart form data to
`POST /api/resumes/uploadphoto?jobSeekerId=`, with `POST /api/files/upload-profile-image` available in
`fileService`. Each sub-entity (experience, education, skill, language) is its own form with its own
Zod schema and its own mutation, so a failure in one section does not discard the others.

> Not captured: `/profile/edit` is behind `ProtectedRoute`. No CV or photo was uploaded.

---

## Employer & Hiring Management Portal

Both employer screens are guarded by `<ProtectedRoute requiredRole="Employer" />`, which compares the
stored role against `ROLE_EMPLOYER` and redirects non-employers to `/`.

**`JobPostPage` (`/jobs/post`)** — a React Hook Form + Zod advertisement form: job title (from
`GET /api/jobtitles/getall`, narrowable by category via `getbycategory`), city, work model, employment
type, salary range, open positions, application deadline and description. Submits to
`POST /api/jobadvertisements/add`.

**`EmployerApplicationsPage` (`/jobs/applications`)** — the applicant review workspace:

* Loads applications for the signed-in employer from `GET /api/jobapplications/getbyemployerid`.
* Status counter tiles for `PENDING` / `ACCEPTED` / `REJECTED` plus an *all* total, computed with `useMemo`.
* A status filter row and a keyword search over the applicant list.
* Per-applicant cards exposing the candidate's résumé and cover letter.
* Accept and reject actions on pending applications, issued as a TanStack mutation against
  `PUT /api/jobapplications/updatestatus?id=&status=`, with a `sonner` toast on success and a query
  invalidation to refresh the list.

> Not captured: both routes require an Employer-role session. No advertisement was published and no
> application status was modified.

---

## Authentication, Session Management & Route Guards

### Flow

1. `LoginPage` validates with `loginSchema` and posts to `POST /api/auth/login`.
2. On success the response `{ token, user }` is handed to `useAuthStore.login()`.
3. The store normalises the role — stripping repeated `ROLE_` prefixes, re-deriving a canonical
   `ROLE_EMPLOYER` / `ROLE_JOBSEEKER` / admin name and a matching numeric id — then sets
   `isAuthenticated: true`.
4. `apiClient`'s request interceptor reads `useAuthStore.getState().token` and sets
   `Authorization: Bearer <token>` on every subsequent request.
5. A `401` from any endpoint calls `useAuthStore.getState().logout()`, clearing the session.

Registration posts to `/api/auth/registerforjobseeker` or `/api/auth/registerforemployer`. Password
recovery posts an e-mail to `/api/auth/forgot-password`; the reset page first calls
`GET /api/auth/validate-reset-token` and only renders the new-password form if the token validates —
which is exactly the rejection state visible in the screenshot above.

### Where the session lives

The Zustand store is wrapped in `persist` with `createJSONStorage(() => localStorage)` under the key
`auth_data`. The JWT is therefore stored in `localStorage` in plain text.

> **This is not a hardened session design, and this README does not claim otherwise.** Anything that can
> run JavaScript on the origin can read `localStorage`, so the token is exposed to XSS. There is no
> refresh-token rotation and no httpOnly cookie. Client-side role checks are a routing and UX
> affordance only — real authorization has to be enforced by the backend on every request.

### Guards

`ProtectedRoute` is a layout route that renders an `<Outlet />` only when `isAuthenticated` is true,
redirecting to `/login` otherwise. Passing `requiredRole` adds a role comparison that redirects
mismatched users to `/`.

| Access level | Routes |
|---|---|
| **Public** | `/`, `/jobs`, `/jobs/:id`, `/employers`, `/employers/:id`, `/login`, `/register`, `/forgot-password`, `/reset-password` |
| **Any authenticated user** | `/profile`, `/profile/edit`, `/profile/applied-jobs`, `/profile/:id`, `/dashboard` |
| **Employer only** | `/jobs/post`, `/jobs/applications` |

---

## Frontend Architecture

### Feature-sliced organisation

Each business domain owns its pages, components, hooks, services and types. Cross-cutting concerns live
in `src/components`, `src/lib` and `src/shared`.

```
src/
├── app/
│   ├── App.tsx                  # QueryClientProvider + RouterProvider + Toaster
│   ├── router.tsx               # createBrowserRouter route tree
│   └── components/
│       ├── ProtectedRoute.tsx   # auth + role layout route
│       └── layout/AppLayout.tsx # responsive header, nav, footer, <Outlet />
├── features/
│   ├── auth/                    # pages, authService, useAuthStore, Zod schemas
│   ├── jobs/                    # search, detail, posting, employer applications
│   ├── applications/            # candidate application history
│   ├── profile/                 # profile + résumé builder (jobseeker & employer variants)
│   ├── employers/               # employer directory
│   ├── home/                    # landing page sections
│   ├── categories/ cities/ jobtitles/   # reference-data hooks and selects
├── components/
│   ├── ui/                      # Radix + Tailwind primitives (21 components)
│   ├── common/                  # JobCard, SearchInput, EmptyState, ErrorState, …
│   └── skeletons/               # loading placeholders
├── lib/
│   ├── apiClient.ts             # axios instance + interceptors
│   ├── queryClient.ts           # TanStack Query defaults
│   └── utils.ts                 # cn() class merger
├── shared/                      # constants and utilities
└── types/                       # cross-feature types
```

A feature slice typically looks like `pages/` + `components/` + `hooks/` + `services/` + `types/`, with
the service layer the only place that touches `apiClient`. The `@` alias maps to `./src` (declared in
both `vite.config.ts` and `tsconfig`).

### State management: Zustand vs TanStack Query

The two libraries are split along a clean seam, and the split is deliberate:

| | **Zustand** (`useAuthStore`) | **TanStack Query** |
|---|---|---|
| Owns | client/session state — the JWT, the current user, the derived role | server state — everything fetched from the backend |
| Lifetime | persisted to `localStorage`, survives reloads | cached in memory, 5-minute `staleTime`, discarded on reload |
| Invalidation | explicit (`login`, `logout`, `updateUser`) | automatic via `queryKey` + `invalidateQueries` after mutations |
| Read outside React | yes — `useAuthStore.getState()` in the axios interceptor | no |

No server data is copied into Zustand, and no auth token is kept in a query cache. Query defaults
(`src/lib/queryClient.ts`): `retry: 1`, `refetchOnWindowFocus: false`, `staleTime: 5 minutes`.

### Form validation: React Hook Form + Zod

Every form uses `useForm` with `zodResolver` from `@hookform/resolvers`, so validation rules live in one
schema and are inferred into TypeScript types with `z.infer`. From `src/features/auth/types/schemas.ts`:

```ts
const passwordValidation = z.string()
  .min(8, 'Şifre en az 8 karakter olmalıdır')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
    'Şifre en az 1 büyük harf, 1 küçük harf, 1 rakam ve 1 özel karakter içermelidir');

export const registerJobSeekerSchema = z.object({
  email: z.string().email('Geçersiz e-posta adresi'),
  password: passwordValidation,
  confirmPassword: z.string(),
  firstName: z.string().min(2, 'Ad en az 2 karakter olmalıdır'),
  lastName: z.string().min(2, 'Soyad en az 2 karakter olmalıdır'),
  identityNumber: z.string().length(11, 'TCKN 11 haneli olmalıdır'),
  birthYear: z.number().int().min(1900).max(new Date().getFullYear()),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Şifreler eşleşmiyor', path: ['confirmPassword'],
});

export type RegisterJobSeekerValues = z.infer<typeof registerJobSeekerSchema>;
```

`registerEmployerSchema` mirrors it with `companyName`, `webAddress` (`z.string().url()`) and
`phoneNumber`. Cross-field rules — password confirmation in both registration schemas and in
`resetPasswordSchema` — are expressed with `.refine()` and reported on the `confirmPassword` path, so
the message renders under the right input. Validation messages are authored in Turkish, matching the
application's UI language.

### Shared UI: Radix UI + Tailwind CSS

`src/components/ui/` holds 21 unstyled-primitive wrappers in the shadcn/ui style: `accordion`,
`avatar`, `badge`, `button`, `calendar`, `card`, `checkbox`, `command`, `dialog`, `dropdown-menu`,
`form`, `input`, `label`, `popover`, `scroll-area`, `select`, `separator`, `skeleton`, `tabs`,
`textarea`, `tooltip`.

Each composes a headless Radix primitive — which supplies focus management, keyboard navigation and
ARIA wiring — with Tailwind classes. Variants are declared with `class-variance-authority`, and
`cn()` (`clsx` + `tailwind-merge`) merges caller overrides without specificity conflicts. The pattern
means the application's own code never reimplements a dropdown, dialog or tab, and accessibility comes
from the primitive rather than from ad-hoc markup.

`src/components/common/` layers app-aware pieces on top: `JobCard`, `SearchInput`, `LocationSelector`,
`PaginationControls`, `EmptyState`, `ErrorState`, `SmartCompanyLogo`, `ScrollToTop`. Toasts come from
`sonner`, icons from `lucide-react`, animation from `framer-motion`, and date handling from `date-fns`
with `react-day-picker`.

---

## Technology Stack

| Area | Technology |
|---|---|
| Framework | React 19.2 |
| Language | TypeScript 5.9 |
| Build | Vite 7.3 with `@vitejs/plugin-react` |
| Routing | React Router DOM 7.13 (`createBrowserRouter`) |
| Server state | TanStack Query 5.90 |
| Client/session state | Zustand 5.0 with `persist` middleware |
| HTTP | axios 1.13 with request/response interceptors |
| Forms | React Hook Form 7.71 + `@hookform/resolvers` |
| Validation | Zod 4.3 |
| Styling | Tailwind CSS 3.4, `tailwindcss-animate`, `tailwind-merge`, `class-variance-authority` |
| UI primitives | Radix UI (14 packages), `cmdk` |
| Icons / motion / dates | `lucide-react`, `framer-motion`, `date-fns`, `react-day-picker` |
| Notifications | `sonner` |
| Linting | ESLint 9 (flat config) with `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh` |

---

## Installation & Local Development

### Prerequisites

* **Node.js 20.19+ or 22.12+** — required by Vite 7. Other versions print an engine warning and may fail.
* npm 9+

### Setup

```bash
git clone https://github.com/kamiltuncok/hrms-frontend.git
cd hrms-frontend
npm install
cp .env.example .env     # see the next section
npm run dev
```

Vite serves the application at **http://localhost:5173/**.

The landing page, job search, and all authentication screens render without a backend. Job details, the
employer directory, and every protected screen need the API.

### Scripts

| Command | Effect |
|---|---|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | `tsc -b && vite build` — type-check, then bundle to `dist/` |
| `npm run preview` | Serve the production bundle locally |
| `npm run lint` | ESLint across the repository |

---

## Environment Configuration

A **`.env.example` is present** in the repository and contains a single variable:

```bash
# Backend API base URL
VITE_API_URL=http://localhost:8080
```

Copy it to `.env` and adjust the host if your backend runs elsewhere. Vite only exposes variables
prefixed with `VITE_` to client code.

The value is consumed once, in `src/lib/apiClient.ts`, with a hardcoded fallback:

```ts
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
```

So if `VITE_API_URL` is unset the client still targets `http://localhost:8080`. Note that Vite inlines
env values at build time — changing `.env` requires restarting the dev server or rebuilding.

---

## Frontend-to-Backend API Integration

All HTTP traffic flows through the single axios instance in `src/lib/apiClient.ts`.

### Interceptors

**Request** — reads the token straight from the Zustand store (`useAuthStore.getState().token`, outside
React, which is why the store is used rather than a context) and sets the `Authorization` header when a
token exists.

**Response** — handles a backend quirk: the API wraps payloads in a `DataResult` envelope and sometimes
returns a *business* failure with HTTP 200 and `success: false`. The interceptor rejects those as
errors, so a failed operation never reaches a component looking like a success:

```ts
if (data && typeof data === 'object' && 'success' in data) {
  if (!data.success) return Promise.reject(new Error(data.message || 'API request failed'));
}
```

On an error it normalises the message (preferring a detailed `data` string over the top-level
`message`), logs out on `401`, and logs a diagnostic on `403`.

### Endpoints called by this frontend

Transcribed from the service modules under `src/features/*/services/`. The contracts are owned and
implemented by the separate backend.

**Auth** — `src/features/auth/services/authService.ts`

| Method | Endpoint |
|---|---|
| `POST` | `/api/auth/login` |
| `POST` | `/api/auth/registerforjobseeker` |
| `POST` | `/api/auth/registerforemployer` |
| `POST` | `/api/auth/forgot-password` |
| `POST` | `/api/auth/reset-password` |
| `GET`  | `/api/auth/validate-reset-token` |

**Job advertisements** — `jobService.ts`

| Method | Endpoint |
|---|---|
| `GET`  | `/api/jobadvertisements/getactive` |
| `GET`  | `/api/jobadvertisements/getbyid?id=` |
| `POST` | `/api/jobadvertisements/add` |

**Job applications** — `jobApplicationService.ts`, `applicationService.ts`

| Method | Endpoint |
|---|---|
| `POST` | `/api/jobapplications/add` |
| `GET`  | `/api/jobapplications/getbyjobid?id=` |
| `GET`  | `/api/jobapplications/getbyjobseekerid?jobSeekerId=` |
| `GET`  | `/api/jobapplications/getbyemployerid?employerId=` |
| `PUT`  | `/api/jobapplications/updatestatus?id=&status=` |

**Résumé & profile** — `resumeService.ts`, `jobSeekerService.ts`, `fileService.ts`

| Method | Endpoint |
|---|---|
| `GET`  | `/api/resumes/getbyjobseekerid?jobSeekerId=` |
| `POST` | `/api/resumes/add`, `/api/resumes/update` |
| `POST` | `/api/resumes/uploadcv?jobSeekerId=` *(multipart)* |
| `GET`  | `/api/resumes/downloadcv?jobSeekerId=` *(blob)* |
| `POST` | `/api/resumes/uploadphoto?jobSeekerId=` *(multipart)* |
| `POST` | `/api/files/upload-profile-image` *(multipart)* |
| `GET`  | `/api/jobseekers/getbyid?id=` |
| `PUT`  | `/api/jobseekers/update?id=` |
| `POST` | `/api/jobexperiences/add`, `/api/jobexperiences/delete?id=` |
| `POST` | `/api/schools/add`, `/api/schools/delete?id=` |
| `POST` | `/api/skills/add`, `/api/skills/delete?id=` |
| `POST` | `/api/languages/add`, `/api/languages/delete?id=` |

**Employers** — `employerService.ts`

| Method | Endpoint |
|---|---|
| `GET` | `/api/employers/getall` |
| `GET` | `/api/employers/getbyid?id=` |
| `PUT` | `/api/employers/update?id=` |

**Reference data** — `cityService.ts`, `categoryService.ts`, `jobTitleService.ts`

| Method | Endpoint |
|---|---|
| `GET` | `/api/cities/getall` |
| `GET` | `/api/categories/getall`, `/api/categories/getbyid?id=` |
| `GET` | `/api/jobtitles/getall`, `/api/jobtitles/getbycategory?categoryId=` |

---

## Production Build & Preview

```bash
npm run build      # tsc -b && vite build  → dist/
npm run preview    # serve dist/ locally
```

`build` type-checks before bundling, so a type error fails the build rather than shipping.

Because the app uses `createBrowserRouter` with real paths, any static host serving `dist/` must
**rewrite unknown paths to `index.html`**, or a direct hit on `/jobs/42` will 404.

---

## Repository Links

| | |
|---|---|
| **Frontend (this repository)** | https://github.com/kamiltuncok/hrms-frontend |

The backend is a separate Spring Boot service, maintained outside this repository and intentionally not
documented here.

---

## License

Released under the terms in [LICENSE](LICENSE).
