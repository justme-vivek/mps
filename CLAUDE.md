# Project Rules

Framework: React Native (Expo SDK 54) mobile app
Backend: Node.js + Express 5 + MongoDB (Mongoose 9) + ImageKit

Language: JavaScript only

Never use:

- TypeScript / TSX
- Firebase
- Any media type other than images (jpg, jpeg, png, gif, webp) and PDF
- localStorage (use expo-secure-store for tokens, async-storage for prefs)

Always use:

- JSX, Functional Components, Hooks
- expo-router (file-based routing)
- NativeWind (Tailwind classes in React Native)
- @tanstack/react-query for server state
- react-hook-form + zod for form validation

## Architecture

- `backend/` — Express API (auth, content CRUD, media, downloads, favourites)
- `mobile/` — Expo app. ONE login screen for every account type; the role
  always comes from the server, never from the client.

### Roles

- **Guest** — browse only (no favourites, downloads, or share)
- **user** — browse + favourites + PDF download + share
- **admin** — Admin Dashboard (full content/media management)

Admin accounts are created ONLY by `npm run seed:admin` (dev time).
No API endpoint can create or escalate to admin.

## Folder Structure

```
mobile/
├── app/                      # expo-router routes
│   ├── _layout.jsx           # Root providers + role-guarded stack
│   ├── login.jsx             # THE single login screen (all roles)
│   ├── (user)/               # Tabs: Home, Notices, Events, Gallery, More
│   │   └── …                 # + detail screens, favourites, downloads, profile
│   └── admin/                # Drawer: dashboard + content CRUD screens
├── src/
│   ├── components/
│   │   ├── ui/               # Primitives: Button, Input, Card, Badge, Toast…
│   │   ├── common/           # Content cards, favourite/share actions
│   │   └── admin/            # FormModal, media pickers, EntityCard
│   ├── features/             # auth, banners, notices, events, gallery,
│   │                         # faculty, downloads, favorites, media,
│   │                         # content, settings (service + hooks per domain)
│   ├── hooks/                # useEntityMutations, usePdfDownload
│   ├── services/             # axios api client, query client
│   ├── config/               # env
│   └── utils/                # format, ik (ImageKit transforms), pickers, pdf, share
├── app.json / babel.config.js / metro.config.js
├── tailwind.config.js / global.css
└── .env                      # EXPO_PUBLIC_API_URL

backend/
├── config/                   # db.js, imagekit.js
├── controllers/              # auth, banner, notice, event, gallery, faculty,
│                             # download, favorite, media, content, settings
├── middleware/               # auth (protect / adminOnly / optionalAuth),
│                             # upload (multer + strict file filter)
├── models/                   # User, Banner, Notice, Event, Gallery, Faculty,
│                             # Download, Favorite, MediaAsset, Content, Settings
├── routes/                   # one router per controller (guards wired)
├── scripts/seedAdmin.js      # dev-only admin creation
├── utils/                    # imageValidation (magic bytes), media (ImageKit)
└── server.js                 # helmet, rate limits, CORS allowlist, error handler
```

## Rules

- Keep components under 300 lines; compose, never duplicate.
- Reads are public (guest browsing); EVERY write is `protect` + `adminOnly`.
- Role is re-read from the database on every authenticated request.
- All uploads are validated by extension AND magic bytes before ImageKit.
- Tokens live only in expo-secure-store; 401 responses auto-clear the session.
- API base URL comes from `EXPO_PUBLIC_API_URL` in `mobile/.env`.
- All secrets/config live in git-ignored `.env` files (`backend/.env`, `mobile/.env`) — never committed.

Never change this architecture unless explicitly instructed.

