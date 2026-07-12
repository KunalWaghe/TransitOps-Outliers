# Sprint 4: User Management & Security (30-Minute MVP)

This task list divides the implementation plan among the three developers based on their roles from the previous sprints.

## M3: Backend (Auth, DB, Infra)
- [ ] Add new fields to `User` model (`failed_login_attempts`, `locked_until`, `reset_password_token`, `reset_password_expires`).
- [ ] Create and run Alembic migration for the updated `User` model.
- [ ] Update `POST /api/auth/login` to implement basic account lockout logic (lock after 5 failed attempts for 15 minutes).
- [ ] Implement `POST /api/auth/forgot-password` (Generate token, save to DB, print to console).
- [ ] Implement `POST /api/auth/reset-password` (Validate token, hash new password, update DB).

## M2: Backend (Business Logic - My Role)
- [ ] Install `email-validator` package for email legitimacy checks.
- [ ] Implement `GET /api/users` (Admin only) to list all users.
- [ ] Implement `PUT /api/users/{id}` (Admin only) to edit users.
- [ ] Implement `DELETE /api/users/{id}` (Admin only) to remove users.
- [ ] Implement `PUT /api/users/me` for users to update their own profile details.
- [ ] Integrate email validation logic into user creation and update endpoints.

## M1: Frontend Development
- [ ] Build `UserManagement` page (Data table listing users, with Admin-only access).
- [ ] Build User Create/Edit modal forms within the User Management page.
- [ ] Build `ProfilePage` for users to edit their own details.
- [ ] Build `ForgotPassword` page (Form to request a password reset).
- [ ] Build `ResetPassword` page (Form to enter a new password).
- [ ] Wire up all new frontend components to the new M2 and M3 API endpoints.
