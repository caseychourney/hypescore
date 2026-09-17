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
