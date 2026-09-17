# HypeScore

HypeScore is a movie discovery and audience-reaction platform built around one question:
**Was the movie worth the hype?**

## Product thesis
HypeScore should not try to become a prettier Rotten Tomatoes. Rotten Tomatoes already owns the familiar critic/audience aggregation model, while Letterboxd owns a strong social film-diary/community model. HypeScore needs a distinct product loop:
**DISCOVER → HYPE → WATCH → RATE → COMPARE → SHARE**

The signature asset is the **Hype Score**: a public, understandable 0–100 signal that tracks audience anticipation before release and can change as trailers, casting, reviews, controversies, release news and other meaningful events happen.

After release, HypeScore compares anticipation with post-watch audience reaction.

## Score architecture
Do not collapse everything into one opaque number.

A movie page should eventually show:
- **Hype Score** — current pre-watch audience anticipation, 0–100.
- **Hype Momentum** — direction and speed of recent change.
- **Audience Score** — post-watch audience reaction.
- **Critic Score** — professional review aggregation, clearly separated from audience sentiment.
- **Hype Delivered** — the gap between pre-watch Hype Score and post-watch Audience Score.
- **Hype History** — a time series showing how anticipation changed and why.

This separation is critical. A 92 Hype Score must not be confused with a 92% positive review score.

## Quick Review
People should be able to rate a movie without writing an essay:
- Writing
- Acting
- Story
- Characters
- Visuals
- Music / Sound
- Entertainment
- Overall

The overall rating is calculated from the category ratings. A written review is optional.

## Viral distribution
HypeScore should produce share-ready Hype Cards for Facebook, Instagram, X, Reddit, TikTok descriptions/captions, Discord, and movie websites/blogs.

A publisher should be able to post something like:

RESIDENT EVIL
HYPESCORE 84
+9 THIS WEEK
HypeScore.net

The card should link back to the movie page.

The goal is not merely to acquire users through search. The score itself should become a piece of movie conversation that websites and social accounts want to embed and share.

## Anti-manipulation
A public score becomes worthless if it can be gamed.

The production system needs:
- One-account/one-current-vote rules.
- Rate limits.
- Bot and duplicate-account detection.
- Suspicious-vote weighting or exclusion.
- Minimum sample sizes before displaying strong claims.
- Separate pre-watch and post-watch states.
- A visible methodology page.
- Audit logs for major score changes.
- Protection against brigading after controversial news.
- Clear labeling when a score is based on a small sample.

Do not launch a fake precision score such as 87.34 when the underlying sample is tiny.

## Data strategy
Use a licensed/appropriate movie data provider for movie metadata, images, release dates and cast data. TMDB's current documentation says its free API access is for non-commercial use with attribution, while commercial projects require contacting TMDB about a commercial license. HypeScore must therefore settle its data/image licensing before commercial launch.

Never expose a private API key in browser-side JavaScript.

## Phases
### Phase 1 — Product foundation
- Modern responsive UI
- Movie discovery
- Movie detail page
- Hype Score display
- Quick Review
- Trending
- Share cards

### Phase 2 — Real data
- Movie API integration
- Server-side API credentials
- Search
- Upcoming/released/streaming movies
- Trailers
- Cast/crew
- Technical/nerd data

### Phase 3 — Accounts + persistence
- Sign up/login
- Watchlist
- My Hype
- Saved reviews
- Follow users
- Activity feed

### Phase 4 — Hype engine
- Hype votes
- Event ingestion
- Hype history
- Momentum
- Release-state transitions
- Hype Delivered calculation

### Phase 5 — Trust + scale
- Verification
- Anti-spam
- Moderation
- Review quality controls
- Publisher accounts
- Embeddable score widgets
- Public API
- Analytics

## The hard questions
Before calling HypeScore the "next Rotten Tomatoes", it must answer:
1. Why would a movie fan use HypeScore instead of Rotten Tomatoes or Letterboxd?
2. Why would a movie website or Facebook page post HypeScore instead of simply posting a Rotten Tomatoes score?
3. Can a new movie get a useful score before it has thousands of users?
4. How do we prevent studios, fan groups or anti-fan groups from manipulating the number?
5. What exactly causes Hype to move?
6. Can the methodology be explained in one paragraph?
7. Can a person understand the score in two seconds?
8. Is the score interesting enough that people will screenshot and share it?
9. Can HypeScore become a source cited by entertainment sites?
10. What proprietary data does HypeScore accumulate that competitors cannot easily copy?

The strongest long-term moat is not the UI. It is a trustworthy historical dataset of what people expected, how that expectation changed, and whether the movie delivered.

## Current status
The HypeScore 2.0 foundation is being developed on the `hypescore-2-0` branch before merging into `main`.