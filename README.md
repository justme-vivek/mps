# MPS — Modern Public School

Monorepo with two packages:

| Folder | Stack | Purpose |
|---|---|---|
| `backend/` | Node.js, Express 5, MongoDB (Mongoose), ImageKit, JWT | REST API for content + auth + media |
| `mobile/` | React Native (JavaScript), Expo, expo-router, NativeWind | The MPS mobile app (Android/iOS) |

The old Vite/React web frontend has been replaced by the Expo app.

## Roles

- **Guest** — can browse notices, events, gallery, faculty, downloads list. Cannot favourite/download/share.
- **User** (`role: "user"`) — everything a guest can, plus favourites, PDF downloads, share.
- **Admin** (`role: "admin"`) — lands in the Admin Dashboard; full content/media management.

There is a **single login screen** for everyone. Admin accounts can only be created with the
dev-time seed script — no API can ever create an admin.

## Setup

### 1. Backend

```bash
cd backend
npm install
# create backend/.env with the required vars (see backend/README.md)
npm run seed:admin       # creates/updates the admin account (dev-time only)
npm run dev              # starts API on http://localhost:5000
```

### 2. Mobile app

```bash
cd mobile
npm install
npx expo start           # scan QR with Expo Go (Android/iOS)
```

Set the API URL the app should talk to in `mobile/.env`:

```env
EXPO_PUBLIC_API_URL=http://<your-lan-ip>:5000/api
```

(On a real device, use your machine's LAN IP instead of `localhost`.)

Start by copying [`mobile/.env.example`](mobile/.env.example) to `mobile/.env`.
The backend uses the same pattern: copy [`backend/.env.example`](backend/.env.example)
to `backend/.env` and fill in the required credentials. Both `.env` files are
ignored by Git; only the safe `.env.example` templates are tracked.

## Root scripts

- `npm run backend` — start backend in dev mode
- `npm run app` — start Expo dev server
- `npm run seed:admin` — seed the admin account
- `npm run install:all` — install deps for both packages
