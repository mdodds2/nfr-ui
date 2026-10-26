# Quality Attributes Report Builder (nfr-ui)

React + Vite front end for building non-functional requirement (quality attribute) reports. Backend: [nfr-api](https://github.com/mdodds2/nfr-api).

## Prerequisites

- Node.js 22 (matches CI)
- [nfr-api](https://github.com/mdodds2/nfr-api) running locally on `http://localhost:8080`

## Getting started

```bash
git clone https://github.com/mdodds2/nfr-ui.git
cd nfr-ui
npm install
npm run dev
```

The app runs at http://localhost:5173 (the dev server also listens on your network via `--host 0.0.0.0`).

## Environment variables

| Variable | Purpose | Local default |
|---|---|---|
| `VITE_API_URL` | Base URL of nfr-api | `http://localhost:8080` |
| `VITE_SWAGGER_URL` | Swagger UI link on the About page | `http://localhost:8080/swagger-ui/index.html` |
| `VITE_APP_TITLE` | Title shown in the header and browser tab | `Quality Attributes Report Builder` |

- `.env` holds local development defaults.
- `.env.production` is used by `npm run build`.
- `.env.local` is for personal overrides and is not committed.
- `.env.example` lists every variable.

Vite bakes these values into the bundle at build time, so they are public. Never put secrets in them.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## Authentication

Login uses HTTP-only cookies set by nfr-api. The API client (`src/util/http.js`) sends cookies on every request, refreshes the session once on a 401 and retries, and logs out if the refresh fails. The UI origin must be allowed by the API's CORS configuration.

## CI

GitHub Actions runs lint and build on every push and pull request to `develop`.
