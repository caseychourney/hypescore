# HypeScore Engine Specification

## Core rule
Hype Score is an observed audience-intent metric, not an arbitrary collection of event bonuses.

Bad: trailer +7, casting +4, poster +3. That is subjective and easy to manipulate.

Better: people submit anticipation; the engine calculates the score; events explain movements rather than directly awarding points.

## Vote model
YES = 1.0, MAYBE = 0.5, NO = 0.0. Each user has one active pre-watch vote per movie. Users may change it. Historical votes remain auditable.

## Bayesian smoothing
A neutral prior equivalent to 20 votes at the midpoint prevents tiny samples from displaying extreme scores. Real votes dominate as the effective sample grows.

## Recency
Current anticipation should emphasize recent intent. v1 uses a configurable 45-day half-life. Historical votes are retained; only their current influence decays.

## Trust layer
The scoring engine accepts a 0–1 trust weight from a separate abuse/risk system. The scoring engine does not decide whether an account is fraudulent.

## Momentum
Momentum is separate from Hype Score. Example: Hype Score 84, Momentum +9. Hype answers how hyped people are; Momentum answers how quickly that is changing.

## Events
Events include posters, teasers, trailers, casting, production news, release-date changes, critic reactions, controversy, viral moments, box-office news and streaming announcements. Events should explain movements, not receive subjective point bonuses.

## Release transition
At release, calculate and permanently store the final pre-release Hype Score. After release, collect post-watch Audience Scores separately. Never let later audience reviews rewrite the historical pre-release score.

## Audience Score
Audience Score is derived from completed post-watch reviews. Quick Review categories: Writing, Acting, Story, Characters, Visuals, Music/Sound and Entertainment. Never mix this score into live Hype.

## Hype Delivered
Hype Delivered = Audience Score - Release Hype Score. Use a tolerance band: +5 or more = delivered; -5 or less = missed; otherwise = met expectations. These thresholds should be tested with real data before being treated as permanent.

## Sample size
Always show rating count with the score. Never imply mature certainty from a tiny sample.

## Anti-gaming
Identity, vote history, risk detection, scoring and audit should be separate systems. Use one active vote per user/movie, rate limits, anomaly detection, duplicate-account detection, coordinated-vote detection, minimum sample thresholds and immutable audit history.

## Publisher distribution
Provide a public HypeScore endpoint and embeddable widget with title, score, momentum, rating count, last-updated time, branding and a link back to the movie page. This is a key distribution mechanism for movie websites and social pages.

## Share cards
Every card should include context such as HYPESCORE 84, +9 THIS WEEK, 12,481 RATINGS and HypeScore.net. Never present Hype Score as a guarantee of quality.

## Back-testing requirements
Test that one user cannot materially move a mature movie; coordinated small groups cannot create large jumps; new movies still establish a useful early signal; old votes decay predictably; changing votes works correctly; invalidations affect current scores but remain auditable; release snapshots never change; and audience reviews never rewrite historical hype.

## Versioning
Every score snapshot stores the engine version, such as hypescore_engine_v1. Methodology changes must not silently rewrite historical results.