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

The PostgreSQL credentials (`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`) are pre-filled in `.env.example` — change them if needed for your environment.

### 3. Start the stack

```bash
docker compose up -d --build
```

This builds and starts three containers:

| Service  | Port | Description                |
| -------- | ---- | -------------------------- |
| frontend | 8080 | React app served via nginx |
| backend  | 3000 | Express API                |
| db       | 5432 | PostgreSQL                 |

### 4. Access the application

Open [http://localhost:8080](http://localhost:8080) in your browser.

## API Endpoints

| Method | Endpoint                   | Description                                                   |
| ------ | -------------------------- | ------------------------------------------------------------- |
| GET    | `/health`                  | Health check                                                  |
| GET    | `/api/people`              | List people (supports `?page`, `perPage`, `?state`, `?party`) |
| GET    | `/api/people/filters`      | Distinct states and parties                                   |
| POST   | `/api/sync?jurisdiction=X` | Sync a jurisdiction from OpenStates                           |

### Sync a jurisdiction

Use the preset buttons on the frontend, or call the API directly:

```bash
curl -X POST "http://localhost:3000/api/sync?jurisdiction=ocd-jurisdiction/country:us/state:ga/government"
```

### Scheduled sync (optional)

Set `SYNC_JURISDICTION` in `.env` to enable automatic daily sync:

```
SYNC_JURISDICTION=ocd-jurisdiction/country:us/state:ga/government
SYNC_CRON=0 0 * * *
```

Leave `SYNC_JURISDICTION` empty to disable.

## Testing

- **Backend** — tests in `backend/tests/` using [Vitest](https://vitest.dev/) + [Supertest](https://github.com/ladakh/supertest):

- **Frontend** — tests next to sources (`*.test.tsx`) using [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/):

```bash
# Run all tests
cd backend && npm test
cd frontend && npm test

# Watch mode
cd backend && npm run test:watch
cd frontend && npm run test:watch

# Coverage (generates HTML report in coverage/)
cd backend && npm run test:coverage
cd frontend && npm run test:coverage
```

### Coverage

|          | Stmts  | Branch | Funcs  | Lines  |
| -------- | ------ | ------ | ------ | ------ |
| Backend  | 94.32% | 96.66% | 100%   | 94.32% |
| Frontend | 96.90% | 89.04% | 97.66% | 96.94% |

## Local Development (without Docker)

<details>
<summary>Click to expand</summary>

Prerequisites: Node.js 20+, PostgreSQL running locally.

```bash
# 1. Start the database (or use an existing PostgreSQL instance)
# Make sure the credentials match DATABASE_URL in .env

# 2. Install and run the backend
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev        # starts on :3000 with hot-reload (tsx watch)

# 3. Install and run the frontend (in another terminal)
cd frontend
npm install
npm run dev        # starts on :5173 with Vite HMR
```

The frontend dev server proxies `/api` requests to `http://localhost:3000` via `VITE_API_URL`.

</details>

## Useful Commands

<details>
<summary>Click to expand</summary>

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

# Type check
cd backend && npm run typecheck
cd frontend && npm run typecheck

# Lint
cd backend && npm run lint
cd frontend && npm run lint

# Format
cd backend && npm run format
cd frontend && npm run format
```

</details>

## Project Structure

<details>
<summary>Click to expand</summary>

```
openstates/
├── docker-compose.yml
├── .env                    # Environment variables (gitignored)
├── .env.example            # Template for environment variables
├── .prettierrc.json        # Prettier config
├── README.md
├── backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   ├── tsconfig.json
│   ├── eslint.config.js
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── src/
│   │   ├── server.ts       # Bootstrap
│   │   ├── app.ts          # Express composition
│   │   ├── config/
│   │   │   └── env.ts      # Environment config
│   │   ├── infra/
│   │   │   ├── database/
│   │   │   │   └── prisma.ts
│   │   │   └── openstates/
│   │   │       ├── openStatesClient.ts
│   │   │       └── openStates.types.ts
│   │   ├── models/
│   │   │   ├── people.ts
│   │   │   └── sync.ts
│   │   ├── modules/
│   │   │   ├── people/
│   │   │   │   ├── people.controller.ts
│   │   │   │   ├── people.repository.ts
│   │   │   │   ├── people.routes.ts
│   │   │   │   └── people.service.ts
│   │   │   └── sync/
│   │   │       ├── sync.controller.ts
│   │   │       ├── sync.mapper.ts
│   │   │       ├── sync.repository.ts
│   │   │       ├── sync.routes.ts
│   │   │       ├── sync.scheduler.ts
│   │   │       └── sync.service.ts
│   │   └── shared/
│   │       ├── errors/
│   │       │   └── AppError.ts
│   │       ├── middlewares/
│   │       │   └── errorHandler.ts
│   │       └── utils/
│   │           ├── logger.ts
│   │           ├── resolveJurisdiction.ts
│   │           └── sleep.ts
│   └── tests/
│       ├── app.routes.test.ts
│       ├── openStatesClient.test.ts
│       ├── people.service.test.ts
│       ├── sync.mapper.test.ts
│       ├── sync.repository.test.ts
│       └── sync.service.test.ts
└── frontend/
    ├── Dockerfile
    ├── .dockerignore
    ├── nginx.conf          # SPA routing + /api proxy to backend
    ├── index.html
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── eslint.config.js
    └── src/
        ├── main.tsx        # Providers (QueryClient, Theme, Filters)
        ├── App.tsx         # Page shell + header
        ├── vite-env.d.ts
        ├── test-setup.ts
        ├── api/
        │   ├── client.ts   # API HTTP client
        │   ├── people.api.ts
        │   └── types.ts
        ├── components/
        │   ├── ConfirmDialog/
        │   ├── EmptyState/
        │   ├── ErrorBoundary/
        │   ├── ErrorState/
        │   ├── Footer/
        │   ├── FullScreenLoader/
        │   ├── Pagination/
        │   ├── Spinner/
        │   └── ThemeToggle/
        │       ├── ComponentName.tsx
        │       └── ComponentName.styles.ts
        ├── context/
        │   ├── PeopleFilterContext.tsx
        │   ├── SyncContext.tsx
        │   ├── ThemeContext.tsx
        │   └── peopleFilterReducer.ts
        ├── features/
        │   └── people/
        │       ├── hooks/
        │       │   └── usePeople.ts
        │       └── components/
        │           ├── PeopleFilters/
        │           ├── PeopleList/
        │           ├── PersonCard/
        │           └── SyncPanel/
        ├── styles/
        │   ├── global.ts
        │   ├── styled.d.ts
        │   └── theme.ts
        └── utils/
            ├── apiErrorMessage.ts
            └── syncHistory.ts
        # Unit tests (*.test.tsx) live alongside their sources
```

</details>
