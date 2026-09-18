# HypeScore

HypeScore measures audience anticipation for movies and tracks what happened after release.

## Product loop

DISCOVER -> HYPE -> WATCH -> RATE -> COMPARE -> SHARE

HypeScore is not a quality score. It measures how strongly people currently want to see a movie. Audience Score and Critic Score remain separate. At release, the final pre-release Hype Score is permanently captured so Hype Delivered can compare expectation with outcome.

## 2.0 foundation

The current 2.0 branch includes:
- redesigned discovery and movie detail experience
- versioned HypeScore calculation engine
- automated engine tests
- PostgreSQL/Prisma data model for users, votes, events, snapshots, watches, reviews, publishers and shares

Demo screens still use mock data. The next implementation layer is connecting these models to authenticated API routes and a real database.

## Architecture rules

- People create the score; events explain movements.
- One active pre-watch vote per user/movie.
- Watched and invalidated votes leave the live anticipation pool but remain auditable.
- Historical snapshots are append-only and versioned.
- Release Hype is immutable.
- Reviews are post-watch and never rewrite historical Hype.
- Public scores expose sample context and update time.
- Publisher widgets are read-only distribution surfaces.
- Methodology changes create a new engine version; history is never silently rewritten.

## Local setup

1. Install dependencies with npm install.
2. Copy .env.example to .env.local and set DATABASE_URL.
3. Generate the Prisma client with npx prisma generate.
4. Create/apply a migration with npx prisma migrate dev --name init against PostgreSQL.
5. Run npm test.
6. Run npm run dev.

Never commit secrets or production database credentials.

## Important product constraint

Do not launch the publisher/viral distribution layer before the score has passed real-data back-testing. Distribution will amplify the measurement, including its weaknesses.


## Real movie catalog

HypeScore now has a server-side TMDB importer and a database-backed homepage. TMDB's API supports movie search, discover filters, current theatrical releases, upcoming releases, and movie details; authentication should use a server-side Bearer token rather than exposing a credential in browser code.

Configure these server environment variables before running a sync:

- `TMDB_API_READ_ACCESS_TOKEN` — TMDB API Read Access Token.
- `HYPESCORE_SYNC_SECRET` — secret used to protect the sync endpoint.
- `HYPESCORE_REGION` — optional ISO region, defaults to `US`.

Then send an authenticated POST request to `/api/sync-movies?pages=3`. The importer pulls Now Playing, Upcoming and Popular movies, de-duplicates them, and stores the catalog in Prisma. HypeScore values are intentionally not copied from TMDB; they remain HypeScore's own audience-anticipation signal.

TMDB watch-provider data has separate JustWatch attribution requirements, so that data should be added only with the required attribution in the product.
