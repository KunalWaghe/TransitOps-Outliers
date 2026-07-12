# TransitOps — Task Tracker

> Live task tracker for the 8-hour TransitOps build.  
> Owners: **M1** = Frontend, **M2** = Backend (business logic), **M3** = Backend (auth, DB, infra).  
> Update status as tasks move: `not_started` → `in_progress` → `done` → `blocked`.

---

## Legend

| Status | Meaning |
|---|---|
| `not_started` | Not picked up yet |
| `in_progress` | Currently being worked on |
| `done` | Complete and merged/verified |
| `blocked` | Blocked — add reason in **Notes** |

---

## Phase 0 — Planning & Setup (Hour 0:00 – 0:45)

| ID | Task | Owner | Status | Notes |
|---|---|---|---|---|
| P0-1 | Finalize plan and agree on API contract | ALL | not_started | Confirm revenue field, dispatcher role naming, email reminder plan |
| P0-2 | Scaffold frontend folder structure, install deps (`react-router-dom`, `axios`, `recharts`, `lucide-react`, `react-hot-toast`) | M1 | in_progress | Vite+React+TS+shadcn scaffold done; ThemeContext exists; deps + `api/`/`components/`/`pages/`/`utils/` folders pending |
| P0-3 | Create Layout + Sidebar + ProtectedRoute components | M1 | not_started | Navigable shell with sidebar |
| P0-4 | Create backend folders: `models/`, `schemas/`, `routers/`, `services/` | M2 | not_started | Empty `__init__.py` files included |
| P0-5 | Define all SQLAlchemy models (User, Role, Vehicle, Driver, Trip, MaintenanceLog, FuelLog, Expense, VehicleDocument) | M2 | not_started | Match domain model in Part 8 |
| P0-6 | Set up Alembic and create initial migration | M3 | done | Migration applied to local Postgres |
| P0-7 | Set up `database.py`, `config.py`, `dependencies.py` | M3 | done | Include `get_db` and `get_current_user` |
| P0-8 | Verify Docker Compose brings up Postgres and app containers | M3 | not_started | `docker compose up --build` smoke test |

---

## Sprint 1 — Auth + Vehicle/Driver CRUD (Hour 0:45 – 3:00)

| ID | Task | Owner | Status | Notes |
|---|---|---|---|---|
| S1-1 | Build Login page with form validation and error handling | M1 | not_started | Redirect to `/` on success |
| S1-2 | Set up AuthContext for login/logout and JWT storage | M1 | not_started | Store role for RBAC |
| S1-3 | Create Axios client with JWT interceptor | M1 | not_started | `frontend/src/api/client.js` |
| S1-4 | Build Vehicle list page with search, filter by status/type, sort | M1 | not_started | Use mock data until API ready |
| S1-5 | Build Vehicle create/edit form with validation | M1 | not_started | Duplicate reg number inline error |
| S1-6 | Build Driver list page with search, filter by status, sort | M1 | not_started | Show expired license warning |
| S1-7 | Build Driver create/edit form with validation | M1 | not_started | License expiry date picker |
| S1-8 | Build reusable `DataTable`, `StatusBadge`, `LoadingSpinner`, `EmptyState` components | M1 | not_started | Shared across all list pages |
| S1-9 | Implement Auth router: `POST /api/auth/login`, `GET /api/auth/me` | M3 | done | JWT via `python-jose` + `passlib` |
| S1-10 | Implement RBAC dependency and role guards | M3 | done | 4 roles: fleet_manager, dispatcher, safety_officer, financial_analyst |
| S1-11 | Create seed script for roles and demo users | M3 | done | `seed.py` |
| S1-12 | Implement Vehicle router + service: CRUD, search, filter, unique reg validation | M2 | done | `routers/vehicles.py`, `services/vehicle_service.py` |
| S1-13 | Implement Driver router + service: CRUD, search, filter, unique license validation | M2 | not_started | `routers/drivers.py`, `services/driver_service.py` |
| S1-14 | **CP1 — Hour 2**: Merge auth + login + DB schema to `main` | ALL | not_started | Login page functional, schema live |
| S1-15 | Wire frontend Vehicle/Driver pages to real APIs | M1 | not_started | Replace mock data with API calls |
| S1-16 | Verify responsive layout on mobile (375px) | M1 | not_started | Use dev tools |

---

## Sprint 2 — Trips + Maintenance + Fuel/Expenses (Hour 3:00 – 5:30)

| ID | Task | Owner | Status | Notes |
|---|---|---|---|---|
| S2-1 | Build Trip list page with status filters and action buttons | M1 | not_started | Draft / Dispatched / Completed / Cancelled |
| S2-2 | Build Trip create form with vehicle/driver dropdowns | M1 | not_started | Only Available + valid options shown |
| S2-3 | Build Trip detail view with dispatch/complete/cancel actions | M1 | not_started | Confirmation dialog on cancel |
| S2-4 | Implement Maintenance list page with create/close actions | M1 | not_started | |
| S2-5 | Implement Maintenance create form | M1 | not_started | Select vehicle, type, cost, notes |
| S2-6 | Implement Fuel log list + create form | M1 | not_started | Vehicle, liters, cost, odometer, date |
| S2-7 | Implement Expense list + create form | M1 | not_started | Category, amount, date, description |
| S2-8 | Implement Trip router + service with all business rules (BR2-BR8) | M2 | not_started | Create, dispatch, complete, cancel with transactions |
| S2-9 | Implement Maintenance router + service with BR9-BR10 | M2 | not_started | Auto-set vehicle to `In Shop` / `Available` |
| S2-10 | Implement Fuel log router + service | M3 | not_started | |
| S2-11 | Implement Expense router + service | M3 | not_started | |
| S2-12 | Expand seed script with vehicles, drivers, trips, fuel, expenses, maintenance | M3 | not_started | Realistic demo data |
| S2-13 | Add `revenue` field to Trip model and schemas | M2 | not_started | Optional decimal for ROI calc |
| S2-14 | **CP2 — Hour 4**: Merge trips + maintenance + fuel/expenses to `main` | ALL | not_started | Trip E2E flow working |
| S2-15 | Wire all CRUD pages to real APIs | M1 | not_started | Replace any remaining mock data |
| S2-16 | Test edge cases: duplicate reg, on-trip delete, cargo capacity, empty dropdowns | M2 | not_started | Verify backend returns correct errors |

---

## Sprint 3 — Dashboard + Charts + Reports (Hour 5:30 – 6:30)

| ID | Task | Owner | Status | Notes |
|---|---|---|---|---|
| S3-1 | Build Dashboard page shell with KPI cards | M1 | not_started | Active Vehicles, Available, In Maintenance, Active Trips, Pending Trips, Drivers On Duty, Fleet Utilization % |
| S3-2 | Add dashboard filter bar (vehicle type, status, region) | M1 | not_started | |
| S3-3 | Implement 3 charts with recharts: fuel efficiency, operational cost, fleet utilization | M1 | not_started | Bar/line/pie |
| S3-4 | Implement Dashboard KPI endpoint `GET /api/dashboard/kpis` | M3 | not_started | Filter by type/status/region |
| S3-5 | Implement Dashboard chart endpoint `GET /api/dashboard/charts` | M3 | not_started | |
| S3-6 | Implement CSV export endpoint `GET /api/reports/export/csv` | M2 | not_started | Financial analyst role only |
| S3-7 | Build Reports page with charts and export button | M1 | not_started | |
| S3-8 | **CP3 — Hour 6**: Merge all P0 features to `main` | ALL | not_started | Dashboard with real data |
| S3-9 | (P1) Implement PDF export endpoint `GET /api/reports/export/pdf` | M2 | not_started | Use `reportlab` |
| S3-10 | (P1) Add dark mode toggle + ThemeContext | M1 | not_started | Verify layout doesn't break |
| S3-11 | (P1) Implement email reminder endpoint for expiring licenses | M3 | not_started | No SMTP; identify 30-day expirations and show in UI |
| S3-12 | (P1) Build UI alert for expiring license reminders | M1 | not_started | |
| S3-13 | (P1) Vehicle document upload (registration, insurance) | M1 / M2 | not_started | Local disk storage, backend endpoint |
| S3-14 | (P1) Add pagination to list views | M1 | not_started | Backend + frontend |

---

## Integration & QA (Hour 6:30 – 7:15)

| ID | Task | Owner | Status | Notes |
|---|---|---|---|---|
| QA-1 | Full E2E walkthrough — click every page, fix UI bugs | M1 | not_started | Responsive check |
| QA-2 | API testing — hit every endpoint, verify business rules | M2 | not_started | Fix 500s |
| QA-3 | Fresh DB seed, verify realistic data, check RBAC permissions | M3 | not_started | |
| QA-4 | Verify all P0 acceptance criteria pass | ALL | not_started | See US-01 through US-08 |
| QA-5 | **CP4 — Hour 7.15**: Everything merged to `main`, app runs clean | ALL | not_started | `docker compose up --build` from clean |

---

## Demo Prep & Final Polish (Hour 7:15 – 8:00)

| ID | Task | Owner | Status | Notes |
|---|---|---|---|---|
| D-1 | Final CSS polish, dark mode verify, empty state check | M1 | not_started | |
| D-2 | README update: setup, URLs, seed, architecture, team | M2 | not_started | |
| D-3 | `.env.example` confirm and cleanup | M3 | not_started | |
| D-4 | Rehearse 90-second demo at least once | ALL | not_started | Follow demo script from Part 18 |
| D-5 | Final check: no console errors, no Python tracebacks, no leftover TODO comments | ALL | not_started | |

---

## P1 — Optional Follow-ups (If Time Permits)

| ID | Task | Owner | Status | Notes |
|---|---|---|---|---|
| P1-1 | Dark mode toggle | M1 | not_started | Listed in Sprint 3 |
| P1-2 | CSV export on reports | M2 | not_started | Listed in Sprint 3 |
| P1-3 | PDF export | M2 | not_started | Listed in Sprint 3 |
| P1-4 | Email reminders for expiring licenses | M3 | not_started | Listed in Sprint 3 |
| P1-5 | Vehicle document uploads | M2 | not_started | Listed in Sprint 3 |
| P1-6 | Pagination on list views | M1 | not_started | Listed in Sprint 3 |

---

## P2 — Cut Items (Do Not Work On)

| ID | Task | Owner | Status | Notes |
|---|---|---|---|---|
| P2-1 | Real email delivery | — | not_started | Out of scope |
| P2-2 | Audit trail / activity log | — | not_started | Nice to have |
| P2-3 | Offline support | — | not_started | Out of scope |
| P2-4 | Advanced analytics (trends, predictions) | — | not_started | Out of scope |
| P2-5 | Map visualization for trips | — | not_started | Out of scope |
| P2-6 | Real-time WebSocket updates | — | not_started | Out of scope |

---

## Quality Checklist (Before Marking Any Feature Done)

| ID | Check | Owner | Status | Notes |
|---|---|---|---|---|
| Q-1 | Responsive on mobile (375px) | M1 | not_started | |
| Q-2 | Consistent color theme (indigo primary) | M1 | not_started | |
| Q-3 | Input validation on both frontend and backend | M2 | not_started | |
| Q-4 | Loading spinner while fetching | M1 | not_started | |
| Q-5 | Error toast on API failure | M1 | not_started | |
| Q-6 | Empty state message when no records exist | M1 | not_started | |
| Q-7 | Real database queries (no hardcoded JSON) | M2 | not_started | |
| Q-8 | Realistic seed data | M3 | not_started | |
| Q-9 | Search/filter works on all list views | M1 | not_started | |
| Q-10 | Confirmation dialog on delete/cancel | M1 | not_started | |
| Q-11 | Success toast on create/update/delete | M1 | not_started | |
| Q-12 | Status badges with color coding | M1 | not_started | |
| Q-13 | Dark mode doesn't break layout | M1 | not_started | P1 |

---

## Final Demo Checklist (Last 30 Minutes)

| ID | Check | Owner | Status | Notes |
|---|---|---|---|---|
| F-1 | All branches merged to `main` | ALL | not_started | |
| F-2 | `docker compose up --build` works from clean state | M3 | not_started | |
| F-3 | No console errors in browser | M1 | not_started | |
| F-4 | No Python tracebacks / 500 errors | M2 | not_started | |
| F-5 | No leftover TODO comments | ALL | not_started | |
| F-6 | Responsive layout verified (mobile + desktop) | M1 | not_started | |
| F-7 | All API endpoints functional end-to-end | M2 | not_started | |
| F-8 | Database seeded with realistic data | M3 | not_started | |
| F-9 | README updated with setup + architecture | M2 | not_started | |
| F-10 | `.env.example` present and accurate | M3 | not_started | |
| F-11 | Demo rehearsed at least once | ALL | not_started | |
| F-12 | Repo clean (no node_modules, no __pycache__ committed) | ALL | not_started | |
| F-13 | Commits present from all 3 teammates | ALL | not_started | |
| F-14 | Dark mode toggle works (P1) | M1 | not_started | |
| F-15 | CSV export works (P1) | M2 | not_started | |

---

## Open Questions / Blockers Log

| Date | Question/Blocker | Raised By | Owner | Status | Resolution |
|---|---|---|---|---|---|
| | Revenue field on Trip — add optional `revenue` decimal? | — | ALL | open | |
| | "Driver" role confusion — use `dispatcher` internally? | — | ALL | open | |
| | Email reminders — no SMTP, just UI alerts + console log? | — | ALL | open | |
| | Excalidraw mockup layout — can anyone share a screenshot? | — | M1 | open | |
| | Is there a judging rubric document we haven't seen? | — | ALL | open | |

---

## How to Update This File

1. When you pick up a task, change its status to `in_progress` and add your name in **Notes** if needed.  
2. When you finish a task, change status to `done` and add a brief note (e.g., "merged in #3").  
3. If you are blocked, change status to `blocked` and write the reason.  
4. During standups, read from this file top to bottom.
