# Scientis-Hunt

Examination and assessment platform — Next.js frontend + Spring Boot backend + MongoDB.

## Stack

| Layer    | Technology                                     |
| -------- | ---------------------------------------------- |
| Frontend | Next.js 14, React 18, Tailwind CSS             |
| Backend  | Spring Boot 3.4, Java 17, Maven                |
| Database | MongoDB 6+                                     |
| Auth     | HttpOnly-cookie JWT + CSRF + optional TOTP MFA |
| Roles    | SUPER_ADMIN, SCHOOL_ADMIN, TEACHER, STUDENT    |

---

## Quick Start (local dev)

### Prerequisites

- **Java 17+** — `java -version`
- **Maven 3.8+** — `mvn -version`
- **Node.js 18+** — `node -version`
- **MongoDB** — local install **or** a free [MongoDB Atlas](https://cloud.mongodb.com) cluster

### 1 — Clone and install dependencies

```bash
git clone <repo-url>
cd sci-hunt
npm run install:all        # installs root devDeps + frontend npm packages
```

### 2 — Configure backend environment

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` and set at minimum:

```
MONGODB_URI=mongodb://localhost:27017/scientis_hunt
JWT_SECRET=<at-least-32-random-characters>
```

> **Atlas example:**  
> `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/scientis_hunt?retryWrites=true&w=majority`

Then export the variables in your shell **before** running the app:

**PowerShell (Windows):**

```powershell
Get-Content backend\.env | ForEach-Object {
    if ($_ -match '^\s*([^#=]+)=(.+)$') {
        [System.Environment]::SetEnvironmentVariable($Matches[1].Trim(), $Matches[2].Trim(), 'Process')
    }
}
```

**bash / zsh (Mac/Linux):**

```bash
export $(grep -v '^#' backend/.env | xargs)
```

### 3 — Configure frontend environment

```bash
cp frontend/.env.local.example frontend/.env.local
```

The default `NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api` works for local dev — no change needed unless the backend runs on a different port.

### 4 — Start both servers

```bash
npm run dev
```

This uses `concurrently` to start:

- **Backend** → `http://localhost:8080`
- **Frontend** → `http://localhost:3000`

**Windows one-command clean start** (kills stale ports, starts MongoDB service, then runs both):

```powershell
powershell -ExecutionPolicy Bypass -File start.ps1
```

### 5 — First login (Super Admin)

The backend auto-creates a super-admin on first startup if none exists:
| Field | Value |
|----------|-------|
| Email | `admin@scientishunt.local` _(or value of `BOOTSTRAP_SUPER_ADMIN_EMAIL`)_ |
| Password | `Admin@123456` _(or value of `BOOTSTRAP_SUPER_ADMIN_PASSWORD`)_ |

**Change this password immediately after first login.**

---

## Role Registration

| Role         | How to create                          |
| ------------ | -------------------------------------- |
| STUDENT      | Public self-registration (`/register`) |
| SCHOOL_ADMIN | Public self-registration (`/register`) |
| TEACHER      | Created by a School Admin              |
| SUPER_ADMIN  | Auto-seeded on first startup           |

---

## Dashboard Preview (no database needed)

Open **http://localhost:3000/preview** while the frontend is running.  
Switch between all 4 role dashboards using mock data — no login or MongoDB required.

---

## Auth Endpoints

| Method | Path                                       | Auth          |
| ------ | ------------------------------------------ | ------------- |
| GET    | `/api/auth/csrf`                           | public        |
| POST   | `/api/auth/register`                       | public        |
| POST   | `/api/auth/login`                          | public        |
| POST   | `/api/auth/mfa/verify`                     | public        |
| POST   | `/api/auth/refresh`                        | public        |
| POST   | `/api/auth/logout`                         | authenticated |
| GET    | `/api/auth/me`                             | authenticated |
| POST   | `/api/auth/mfa/setup`                      | authenticated |
| POST   | `/api/admin/users/{userId}/reset-password` | SUPER_ADMIN   |

---

## Project Structure

```
sci-hunt/
├── backend/          Spring Boot API (Java 17)
│   ├── src/main/java/com/scientishunt/
│   │   ├── auth/     Auth controller, service, models, DTOs
│   │   └── security/ JWT, cookies, CORS, Security config
│   └── src/main/resources/application.yml
├── frontend/         Next.js app
│   ├── src/app/      Pages (Next.js App Router)
│   ├── src/components/  UI components & dashboards
│   ├── src/context/  AuthProvider (auth state)
│   └── src/lib/      Axios instance with CSRF + refresh
├── start.ps1         Windows clean-start script
└── package.json      Root scripts (dev, install:all)
```

---

## Security Notes

- `JWT_SECRET` must be **at least 32 characters** of random data — never commit it
- `SECURE_COOKIES=true` in production (requires HTTPS)
- `FRONTEND_ORIGIN` must match the exact origin of the deployed frontend (no trailing slash)
- The `backend/.env` file is git-ignored — only `backend/.env.example` is committed

## MongoDB Collections

- users
- refresh_tokens
- schools
- questions
- exams
- attempts
