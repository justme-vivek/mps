# MPS Backend

Custom Node.js API for the MPS mobile app (Expo/React Native).

Stack: **Express 5 · MongoDB (Mongoose 9) · JWT · ImageKit · Multer**

## Project structure

```text
backend/
├── config/                  # database, environment, ImageKit, and mailer setup
├── controllers/             # authentication and content request handlers
├── middleware/              # auth guards and upload validation
├── models/                  # Mongoose schemas
├── routes/                  # API route definitions
├── scripts/                 # development-only utilities such as seedAdmin.js
├── utils/                   # media and OTP helpers
├── server.js                # Express application entry point
├── package.json
├── package-lock.json
├── .env.example             # safe template; copy to .env and fill in locally
└── .gitignore               # dependencies, secrets, logs, and generated files
```

Create these local, git-ignored files before running the apps:

- `backend/.env` — copy from [`backend/.env.example`](.env.example) and set
  MongoDB, JWT, ImageKit, admin seed, and optional SMTP values.
- `mobile/.env` — copy from [`mobile/.env.example`](../mobile/.env.example) and
  set `EXPO_PUBLIC_API_URL` to the backend URL. Use your computer's LAN IP on a
  physical device.

The following user-created/generated paths are also ignored: `node_modules/`,
Expo/native build output, `*.log`, backend `coverage/`, `uploads/`, and `tmp/`.
Never commit real credentials or replace the tracked example files with secrets.

The Expo client lives in [`../mobile`](../mobile), with its routes in
[`../mobile/app`](../mobile/app) and reusable JavaScript/JSX code in
[`../mobile/src`](../mobile/src). Its package-specific ignore rules are in
[`../mobile/.gitignore`](../mobile/.gitignore); the repository-wide rules are in
[`../.gitignore`](../.gitignore).

## Setup

```bash
cd backend
npm install
# create .env with the variables listed below (git-ignored — never commit it)
npm run seed:admin        # creates the admin account (dev-time only)
npm run dev               # API on http://localhost:5000
```

### Environment variables

All configuration lives in `backend/.env`. Required keys:

| Variable | Purpose |
|---|---|
| `PORT` | API port (default 5000) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Long random string used to sign tokens |
| `ADMIN_NAME` / `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Used by `npm run seed:admin` |
| `SEED_RESET_PASSWORD` | `true` → seed script also resets the admin password |
| `IMAGEKIT_PUBLIC_KEY` / `IMAGEKIT_PRIVATE_KEY` / `IMAGEKIT_URL_ENDPOINT` | Media storage |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_SECURE` | Gmail: `smtp.gmail.com` / `465` / `true` |
| `SMTP_USER` / `SMTP_PASS` | Gmail address + 16-char **App Password** (myaccount.google.com/apppasswords) |
| `MAIL_FROM` | `"MPS School <you@gmail.com>"` |
| `CORS_ORIGINS` | Comma-separated browser origins; native app needs none |

> **Dev mode:** with no SMTP configured and `NODE_ENV` ≠ `production`, OTP
> codes are logged to the server console and returned in API responses as
> `devOtp` so the flows are testable without an email provider. In production
> without SMTP, OTP endpoints fail loudly instead.

## Roles & auth model

One `users` collection, one login endpoint. The **server** decides the role:

| Role | Abilities |
|---|---|
| Guest (no token) | Read all content lists & details |
| `user` | Guest + favourites, PDF downloads, share counter |
| `admin` | Everything + full content/media management |

- `POST /api/auth/register/initiate` + `/verify` create normal users **only
  after the emailed OTP is confirmed** — `role` is always forced to `user`.
  No endpoint can create an admin.
- Resetting/changing the password sets `passwordChangedAt`, which invalidates
  every token issued before it.
- Admin accounts come only from `npm run seed:admin` (idempotent).
- JWTs embed `{ id, role }` but the role is **re-read from the DB on every
  request**, so changing a role takes effect immediately.
- Middleware: `protect` (any active account), `adminOnly` (403 otherwise),
  `optionalAuth` (public reads that can still see the user when a token exists).

## Endpoints

### Auth
| Method | Route | Access |
|---|---|---|
| POST | `/api/auth/login` | Public (all roles, rate-limited) |
| GET | `/api/auth/me` | Any logged-in user |

**Registration — OTP-verified (no account exists until the email code is confirmed):**
| Method | Route | Access |
|---|---|---|
| POST | `/api/auth/register/initiate` | Public — `{email}` → sends OTP → `{otpId}` |
| POST | `/api/auth/register/verify` | Public — `{otpId, code, name, password}` → creates user (role forced) → session |

**Forgot password — OTP first, then new password:**
| Method | Route | Access |
|---|---|---|
| POST | `/api/auth/forgot-password/initiate` | Public — `{email}` → OTP (always a generic response) |
| POST | `/api/auth/forgot-password/verify` | Public — `{otpId, code}` → single-use `resetToken` (10 min) |
| POST | `/api/auth/reset-password` | Public (token) — `{resetToken, password}` → saves password, kills all sessions |

**Change password — new password first, then OTP confirmation:**
| Method | Route | Access |
|---|---|---|
| POST | `/api/auth/change-password/initiate` | Any logged-in user |
| POST | `/api/auth/change-password/confirm` | Any logged-in user — `{otpId, code, password}` |

**OTP rules (all flows):** 6-digit code, valid 10 minutes, single-use, hashed
at rest (HMAC-SHA256), max 5 wrong attempts, 60 s resend cooldown, max 5
sends/hour per email+purpose. Resetting/changing the password sets
`passwordChangedAt`, which invalidates every token issued before it.

### Content (reads public · writes admin-only)
| Route | Methods |
|---|---|
| `/api/banners` | GET, GET /:id, POST, PUT /:id, DELETE /:id |
| `/api/notices` | GET, GET /:id, POST, PUT /:id, DELETE /:id |
| `/api/events` | GET, GET /:id, POST, PUT /:id, DELETE /:id |
| `/api/gallery` | GET, GET /:id, POST, PUT /:id, DELETE /:id |
| `/api/faculty` | GET, GET /:id, POST, PUT /:id, DELETE /:id |
| `/api/content/:sectionId` | GET (public), PUT (admin) |
| `/api/settings` | GET (public), PUT (admin) |

### Media library (admin)
| Method | Route | Notes |
|---|---|---|
| POST | `/api/media` | multipart `file` — **images + PDF only** |
| GET | `/api/media?type=image\|pdf` | List assets |
| DELETE | `/api/media/:id` | Deletes from DB **and** ImageKit |

### Downloads (PDF documents)
| Method | Route | Access |
|---|---|---|
| GET | `/api/downloads` | Public |
| POST / PUT / DELETE | `/api/downloads[/:id]` | Admin (PDF required) |
| POST | `/api/downloads/:id/download` | Any logged-in user (increments counter) |

### Favourites (any logged-in user)
| Method | Route | Notes |
|---|---|---|
| GET | `/api/favorites` | Enriched list (`item` embedded) |
| GET | `/api/favorites/ids?itemType=notice` | `{ ids: [...] }` for flagging lists |
| POST | `/api/favorites` | `{ itemType, itemId }` → toggles on/off |
| DELETE | `/api/favorites/:id` | Owner only |

## Media rules (enforced server-side)

- Allowed: **jpg, jpeg, png, gif, webp, pdf** — everything else is rejected.
- Validation is **extension + MIME + magic bytes** (a renamed `.exe` fails).
- Max size 10 MB per file.
- Uploaded to ImageKit under `/mps/<entity>` folders; `fileId` is stored so
  deletes clean up ImageKit too.

## Security

- `helmet` security headers
- Rate limiting: strict on `/api/auth`, light on other `/api` routes
- CORS allowlist (`CORS_ORIGINS`); native apps (no Origin header) always allowed
- zod validation on auth bodies; consistent central error handler
