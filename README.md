# OpenStates Politicians Explorer

A fullstack application that consumes the [OpenStates API](https://v3.openstates.org/docs) to display US politicians, cached in PostgreSQL and served via a React frontend.

## Tech Stack

- **Backend:** Express + TypeScript + Prisma
- **Frontend:** Vite + React 18 + TypeScript + styled-components + @tanstack/react-query
- **Database:** PostgreSQL 16
- **Infrastructure:** Docker Compose (3 containers)

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose
- An OpenStates API token — get one at [open.pluralpolicy.com](https://open.pluralpolicy.com/accounts/profile/)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd openstates
```

### 2. Create the `.env` file

Copy the example and fill in your API token:

```bash
cp .env.example .env
```

Open `.env` and set your token:

```
OPENSTATES_API_TOKEN=your_token_here
```

All other variables have sensible defaults and can be left as-is.

### 3. Start the stack

```bash
docker compose up -d --build
```

This builds and starts three containers:

| Service  | Port | Description                      |
|----------|------|----------------------------------|
| frontend | 8080 | React app served via nginx       |
| backend  | 3000 | Express API                     |
| db       | 5432 | PostgreSQL                       |

### 4. Access the application

Open [http://localhost:8080](http://localhost:8080) in your browser.

## API Endpoints

| Method | Endpoint              | Description                          |
|--------|-----------------------|--------------------------------------|
| GET    | `/health`             | Health check                         |
| GET    | `/api/people`         | List people (supports `?page`, `perPage`, `?state`, `?party`) |
| GET    | `/api/people/filters` | Distinct states and parties           |
| POST   | `/api/sync?jurisdiction=X` | Sync a jurisdiction from OpenStates |

### Sync a jurisdiction

Use the preset buttons on the frontend, or call the API directly:

```bash
curl -X POST "http://localhost:3000/api/sync?jurisdiction=ga"
```

You can also use the full ID:

```bash
curl -X POST "http://localhost:3000/api/sync?jurisdiction=ocd-jurisdiction/country:us/state:ga/government"
```

### Scheduled sync (optional)

Set `SYNC_JURISDICTION` in `.env` to enable automatic daily sync:

```
SYNC_JURISDICTION=ga
SYNC_CRON=0 0 * * *
```

Leave `SYNC_JURISDICTION` empty to disable.

## Useful Commands

```bash
# Start (build if needed)
docker compose up -d --build

# Stop
docker compose down

# Stop and delete database data
docker compose down -v

# View logs
docker compose logs -f backend
docker compose logs -f frontend

# Run backend tests (from backend/ directory)
cd backend && npm test

# Type check
cd backend && npx tsc --noEmit
cd frontend && npx tsc --noEmit
```

## Project Structure

```
openstates/
├── docker-compose.yml
├── .env                  # Environment variables (gitignored)
├── .env.example          # Template for environment variables
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── eslint.config.js
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── src/
│   │   ├── server.ts     # Bootstrap
│   │   ├── app.ts        # Express composition
│   │   ├── config/       # Environment config
│   │   ├── infra/        # Prisma client + OpenStates HTTP client
│   │   ├── models/       # Type definitions (person, sync)
│   │   ├── modules/
│   │   │   ├── people/   # GET /api/people, /api/people/filters
│   │   │   └── sync/     # POST /api/sync, scheduler
│   │   └── shared/       # Middlewares, errors, utils (logger, sleep)
│   └── tests/            # Unit + integration tests (vitest)
└── frontend/
    ├── Dockerfile
    ├── nginx.conf        # SPA routing + /api proxy to backend
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    └── src/
        ├── main.tsx      # Providers (QueryClient, Theme, Filters)
        ├── App.tsx        # Page shell + header
        ├── models/        # Type definitions (person, filter)
        ├── components/    # Shared UI (Spinner, EmptyState, ErrorState, Pagination, ThemeToggle)
        ├── context/       # React context (filter + theme reducers)
        ├── features/
        │   └── people/    # PeopleList, PeopleFilters, PersonCard, SyncPanel, usePeople hook
        ├── services/      # API client layer (fetch wrapper, people, sync)
        ├── styles/        # Global styles, theme (light/dark), styled-components types
        └── utils/         # Helpers (apiErrorMessage)
```
