# Sprint 4: User Management & Security (30-Minute MVP)

This task list divides the implementation plan among the three developers based on their roles from the previous sprints.

## M3: Backend (Auth, DB, Infra)
- [x] Create `AppSetting` model in `backend/models/setting.py` (depot_name, currency, distance_unit).
- [x] Update `backend/database.py` or import into `env.py` to ensure Alembic tracks the new model.
- [x] Generate and apply Alembic migration for `AppSetting`.
- [x] Create Pydantic schemas in `backend/schemas/setting.py`.
- [x] Implement `GET /api/settings` and `PUT /api/settings` in `backend/routers/settings.py`.
- [x] Wire `settings.router` into `backend/main.py`.
- [ ] Add new fields to `User` model (`failed_login_attempts`, `locked_until`, `reset_password_token`, `reset_password_expires`).
- [ ] Create and run Alembic migration for the updated `User` model.
- [ ] Update `POST /api/auth/login` to implement basic account lockout logic (lock after 5 failed attempts for 15 minutes).
- [ ] Implement `POST /api/auth/forgot-password` (Generate token, save to DB, print to console).
- [ ] Implement `POST /api/auth/reset-password` (Validate token, hash new password, update DB).

## M2: Backend (Business Logic - My Role)
- [x] Install `email-validator` package for email legitimacy checks.
- [x] Implement `GET /api/users` (Admin only) to list all users.
- [x] Implement `PUT /api/users/{id}` (Admin only) to edit users.
- [x] Implement `DELETE /api/users/{id}` (Admin only) to remove users.
- [x] Implement `PUT /api/users/me` for users to update their own profile details.
- [x] Integrate email validation logic into user creation and update endpoints.

## M1: Frontend Development
- [ ] Build `UserManagement` page (Data table listing users, with Admin-only access).
- [ ] Build User Create/Edit modal forms within the User Management page.
- [ ] Build `ProfilePage` for users to edit their own details.
- [ ] Build `ForgotPassword` page (Form to request a password reset).
- [ ] Build `ResetPassword` page (Form to enter a new password).
- [ ] Wire up all new frontend components to the new M2 and M3 API endpoints.
