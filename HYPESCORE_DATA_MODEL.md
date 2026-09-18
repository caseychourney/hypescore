# HypeScore 2.0 Data Model

The product is built around a strict separation between **anticipation**, **explanation**, **outcome**, and **distribution**. This prevents the database from accidentally turning HypeScore into another quality-rating system.

## Core entities

### Movie
Identity and canonical metadata for a title.
- id, slug, title
- releaseDate / releaseStatus
- runtime, certification, genres
- poster/backdrop references and source attribution
- external IDs (provider IDs)
- createdAt / updatedAt

### HypeVote
One active pre-watch intent per user/movie.
- id, userId, movieId
- choice: yes | maybe | no
- createdAt / updatedAt
- watchedAt (nullable)
- invalidatedAt (nullable)
- trustWeight (0..1, supplied by risk layer)
- audit metadata

A changed vote updates the active state but does not erase the audit trail.

### HypeEvent
A timestamped event that can explain movement without directly changing the score.
- id, movieId, type, occurredAt
- sourceName, sourceUrl
- headline / summary
- publishedAt
- confidence / moderation state

Examples: trailer, casting, release-date change, critic reaction, controversy, viral moment, box-office or streaming news.

### HypeSnapshot
A historical calculation of the live score.
- id, movieId, capturedAt
- score, effectiveVotes, rawVotes
- engineVersion
- calculation metadata

Snapshots are append-only.

### HypeReleaseSnapshot
The permanent final pre-release record.
- movieId
- releaseAt
- score, effectiveVotes, rawVotes
- engineVersion
- createdAt

This record must never be overwritten by post-release activity.

### Watch
Explicit evidence that a user has watched a movie.
- id, userId, movieId, watchedAt

### Review
Post-watch audience feedback.
- id, userId, movieId
- writing, acting, story, characters, visuals, musicSound, entertainment
- overall
- body
- createdAt / updatedAt
- moderation state

### Publisher
A verified external distribution partner.
- id, name, domain, verification state
- API key / widget configuration references
- createdAt / updatedAt

### Share
A distribution event, not a source of truth for score calculation.
- id, movieId, publisherId/userId
- platform
- cardVersion
- createdAt
- referral metadata

## Relationships

Movie 1—N HypeVote, HypeEvent, HypeSnapshot, Review, Watch, Share.
User 1—N HypeVote, Watch, Review, Share.
Publisher 1—N Share.

## Invariants

1. A user has at most one active HypeVote for a movie.
2. Watched users cannot remain in the live anticipation pool.
3. Invalidated votes remain auditable but are excluded from current score.
4. Snapshots are append-only and versioned.
5. HypeReleaseSnapshot is immutable.
6. Reviews require a watch state before contributing to Audience Score.
7. Events explain score changes; they never add arbitrary points.
8. Historical scores are never silently recomputed under a new methodology.
9. Public score responses expose sample context and last-updated time.
10. Publisher embeds are read-only and cannot write scores.

## Recommended API surface

- GET /api/movies/search
- GET /api/movies/:slug
- GET /api/movies/:id/hype
- POST /api/movies/:id/vote
- GET /api/movies/:id/history
- GET /api/movies/:id/events
- POST /api/movies/:id/review
- GET /api/publishers/widget/:movieId
- GET /api/share/:movieId

## Build order

1. Persistence and identity.
2. Vote write path with one-active-vote invariant.
3. Hype calculation and snapshots.
4. Watch/review transition.
5. Events and source attribution.
6. Public read API.
7. Publisher widget + share cards.
8. Risk and anomaly layer.

Do not build the publisher system before the score is trustworthy. Distribution amplifies whatever the number is; it cannot repair a weak measurement.
