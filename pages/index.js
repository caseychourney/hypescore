import Head from 'next/head';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import styles from '../styles/Home.module.css';

const movies = [
  {
    id: 1,
    slug: 'practical-magic-2',
    title: 'Practical Magic 2',
    year: 2026,
    genre: 'Fantasy • Comedy • Drama',
    hype: 87,
    change: 6,
    reviews: 5200,
    poster: 'https://www.practicalmagicmovie.com/assets/images/mobilebanner.jpg',
    tagline: 'The Owens sisters are back.',
    event: 'Now playing',
    eventAge: 'this week',
  },
  {
    id: 2,
    slug: 'spider-man-brand-new-day',
    title: 'Spider-Man: Brand New Day',
    year: 2026,
    genre: 'Action • Adventure • Sci-Fi',
    hype: 94,
    change: 3,
    reviews: 8200,
    poster: 'https://media.themoviedb.org/t/p/w300_and_h450_bestv2/9JCQtDCSpPR2ld55yNlEg1VwcQo.jpg',
    tagline: 'A brand new day starts now.',
    event: 'Now playing',
    eventAge: 'this week',
  },
  {
    id: 3,
    slug: 'the-odyssey',
    title: 'The Odyssey',
    year: 2026,
    genre: 'Action • Adventure • Fantasy',
    hype: 91,
    change: 2,
    reviews: 7600,
    poster: 'https://dx35vtwkllhj9.cloudfront.net/universalstudios/the-odyssey/images/regions/ca/updates1/onesheet.jpg',
    tagline: 'The most epic voyage of all time.',
    event: 'Now playing',
    eventAge: 'this week',
  },
  {
    id: 4,
    slug: 'coyote-vs-acme',
    title: 'Coyote vs. Acme',
    year: 2026,
    genre: 'Adventure • Comedy • Family',
    hype: 79,
    change: 4,
    reviews: 4100,
    poster: 'https://dx35vtwkllhj9.cloudfront.net/ketchup-entertainment/coyote-vs-acme/images/regions/us/onesheet.jpg',
    tagline: 'The case against Acme begins.',
    event: 'Now playing',
    eventAge: 'this week',
  },
];

const categories = ['Writing', 'Acting', 'Story', 'Characters', 'Visuals', 'Music', 'Entertainment'];

export default function Home() {
  const [selectedMovie, setSelectedMovie] = useState(movies[0]);
  const [sliders, setSliders] = useState({
    Writing: 8,
    Acting: 9,
    Story: 8,
    Characters: 8,
    Visuals: 10,
    Music: 8,
    Entertainment: 9,
  });
  const [submitted, setSubmitted] = useState(false);
  const [shared, setShared] = useState(false);

  const overall = useMemo(() => {
    const values = Object.values(sliders);
    return (values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1);
  }, [sliders]);

  const postWatchScore = Number(overall) * 10;
  const hypeGap = postWatchScore - selectedMovie.hype;
  const verdict = hypeGap >= 5 ? 'HYPE DELIVERED' : hypeGap <= -5 ? 'HYPE MISSED' : 'HYPE MET EXPECTATIONS';

  const handleSlider = (category, value) => {
    setSubmitted(false);
    setSliders((current) => ({ ...current, [category]: Number(value) }));
  };

  return (
    <div className={styles.site}>
      <Head>
        <title>HypeScore — Is It Worth the Hype?</title>
        <meta name="description" content="Track movie hype before you watch, rate what you saw, and see whether the movie delivered." />
        <meta name="theme-color" content="#0b0d12" />
      </Head>

      <header className={styles.nav}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.brand}>
            <span className={styles.brandMark}>H</span>
            <span>Hype<span>Score</span></span>
          </Link>
          <nav className={styles.navLinks}>
            <Link href="/">Discover</Link>
            <Link href="/leaderboard">Trending</Link>
            <a href="#reviews">Reviews</a>
            <a href="#quick-review">Rate a Movie</a>
          </nav>
          <button className={styles.profileButton}>My Hype</button>
        </div>
      </header>

      <main>
        <section className={styles.hero}>
          <div className={styles.heroGlow} />
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>THE MOVIE HYPE METER</p>
            <h1>Is it worth<br /><span>the hype?</span></h1>
            <p className={styles.heroText}>
              The complete movie destination — hype, critics, audience ratings, box office, cast, reviews and tickets. Track the buzz before release, then see whether the movie actually delivered.
            </p>
            <div className={styles.heroActions}>
              <a className={styles.primaryButton} href="#discover">Explore movies <span>→</span></a>
              <a className={styles.secondaryButton} href="#quick-review">Rate a movie</a>
            </div>
            <div className={styles.heroStats}>
              <div><strong>🔥</strong><span>Hype</span></div>
              <div><strong>🎬</strong><span>Critics</span></div>
              <div><strong>🍿</strong><span>Audience</span></div>
              <div><strong>🎟️</strong><span>Tickets</span></div>
            </div>
          </div>

          <div className={styles.heroPosterWrap}>
            <div className={styles.posterBack} />
            <img src={selectedMovie.poster} alt={selectedMovie.title} className={styles.heroPoster} />
            <div className={styles.floatingScore}>
              <span>HYPE SCORE</span>
              <strong>{selectedMovie.hype}</strong>
              <small>+{selectedMovie.change} this week</small>
            </div>
          </div>
        </section>

        <section className={styles.section} id="discover">
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.eyebrow}>RIGHT NOW</p>
              <h2>Movies people are hyping</h2>
            </div>
            <Link href="/leaderboard" className={styles.textLink}>View leaderboard →</Link>
          </div>

          <div className={styles.movieGrid}>
            {movies.map((movie) => (
              <Link
                key={movie.id}
                href={'/movie/' + movie.slug}
                className={styles.movieCard}
                aria-label={'Open ' + movie.title + ' movie page'}
              >
                <div className={styles.moviePosterWrap}>
                  <img src={movie.poster} alt="" className={styles.moviePoster} />
                  <div className={styles.scorePill}>{movie.hype}</div>
                  {movie.change !== 0 && (
                    <div className={movie.change > 0 ? styles.changeUp : styles.changeDown}>
                      {movie.change > 0 ? '↗' : '↘'} {Math.abs(movie.change)}
                    </div>
                  )}
                </div>
                <div className={styles.movieInfo}>
                  <h3>{movie.title}</h3>
                  <p>{movie.year} · {movie.genre}</p>
                  <span>{movie.reviews.toLocaleString()} audience ratings</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.hypeSection}>
          <div className={styles.hypePanel}>
            <div>
              <p className={styles.eyebrow}>HOW IT WORKS</p>
              <h2>Hype is a moving target.</h2>
              <p>Every trailer, casting reveal, review and major announcement can change how people feel about a movie.</p>
            </div>
            <div className={styles.timeline}>
              <div className={styles.timelineItem}><b>01</b><span>Poster drops</span><strong>+3</strong></div>
              <div className={styles.timelineItem}><b>02</b><span>Trailer launches</span><strong>+7</strong></div>
              <div className={styles.timelineItem}><b>03</b><span>Critics react</span><strong>-2</strong></div>
              <div className={styles.timelineItem}><b>04</b><span>You watch it</span><strong>?</strong></div>
            </div>
          </div>
        </section>

        <section className={styles.scoreStrip}>
          <div><p className={styles.eyebrow}>ONE MOVIE. EVERY ANGLE.</p><h2>Everything you need to decide.</h2><div className={styles.scoreStripGrid}>
            <article><span>🔥</span><strong>HypeScore</strong><p>What audiences want to see before they watch.</p></article>
            <article><span>🎬</span><strong>Critic Average</strong><p>Professional review scores, kept separate from hype.</p></article>
            <article><span>🍿</span><strong>Audience</strong><p>What people who actually watched it thought.</p></article>
            <article><span>💰</span><strong>Box Office</strong><p>Opening weekend, domestic and worldwide performance.</p></article>
            <article><span>🎟️</span><strong>Tickets</strong><p>Find showtimes and continue to Fandango.</p></article>
          </div></div>
        </section>

        <section className={styles.section} id="quick-review">
          <div className={styles.reviewLayout}>
            <div className={styles.reviewIntro}>
              <p className={styles.eyebrow}>QUICK REVIEW</p>
              <h2>Rate it in<br /><span>under a minute.</span></h2>
              <p>No essay required. Slide each category from 1–10 and HypeScore builds your audience score automatically.</p>
              <div className={styles.selectedMovie}>
                <img src={selectedMovie.poster} alt="" />
                <div><strong>{selectedMovie.title}</strong><span>{selectedMovie.year}</span></div>
              </div>
            </div>

            <div className={styles.sliderCard}>
              <div className={styles.sliderTop}>
                <div><span>YOUR OVERALL</span><strong>{overall}</strong><small>/ 10</small></div>
                {submitted && <em>Saved ✓</em>}
              </div>

              {categories.map((category) => (
                <div className={styles.sliderRow} key={category}>
                  <div className={styles.sliderLabel}><span>{category}</span><strong>{sliders[category]}</strong></div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={sliders[category]}
                    onChange={(event) => handleSlider(category, event.target.value)}
                    aria-label={category + ' rating'}
                  />
                </div>
              ))}

              <button className={styles.submitButton} onClick={() => setSubmitted(true)}>
                {submitted ? 'Review saved' : 'Save my quick review'} <span>→</span>
              </button>
              <p className={styles.helper}>Want to say more? Add an optional written review after saving.</p>
            </div>
          </div>
        </section>

        <section className={styles.worthSection}>
          <div className={styles.worthCard}>
            <div className={styles.worthCopy}>
              <p className={styles.eyebrow}>THE BIG QUESTION</p>
              <h2>Did it deliver?</h2>
              <p>HypeScore compares what you expected before watching with what you actually thought afterward.</p>
            </div>
            <div className={styles.worthMeter}>
              <div className={styles.meterLabels}><span>BEFORE</span><strong>{selectedMovie.hype}</strong><span>AFTER</span><strong>{postWatchScore}</strong></div>
              <div className={styles.meterTrack}><div style={{ width: Math.min(100, postWatchScore) + '%' }} /></div>
              <span className={styles.worthBadge}>{verdict}</span>
            </div>
          </div>
        </section>

        <section className={styles.shareSection}>
          <div className={styles.shareCard}>
            <div className={styles.sharePoster}><img src={selectedMovie.poster} alt="" /></div>
            <div className={styles.shareMain}><p className={styles.eyebrow}>SHAREABLE HYPE CARD</p><h2>{selectedMovie.title}</h2><div className={styles.shareScore}>{selectedMovie.hype}</div><span>HYPESCORE</span><p>{selectedMovie.change >= 0 ? '↗' : '↘'} {Math.abs(selectedMovie.change)} this week · {selectedMovie.reviews.toLocaleString()} ratings</p></div>
            <button className={styles.shareButton} onClick={() => setShared(true)}>{shared ? 'Ready to share ✓' : 'Create share card'} <span>→</span></button>
          </div>
        </section>

        <section className={styles.section} id="reviews">
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.eyebrow}>MORE THAN A SCORE</p>
              <h2>Built for movie people.</h2>
            </div>
          </div>
          <div className={styles.featureGrid}>
            <article><span>◉</span><h3>Critics + audience</h3><p>Professional review average, audience score and HypeScore — three different questions, one movie page.</p></article>
            <article><span>⌁</span><h3>Hype timeline</h3><p>Follow the moments that move a movie's anticipation up, down, or sideways.</p></article>
            <article><span>✦</span><h3>Movie intelligence</h3><p>Cast, crew, runtime, format, budget, box office, trivia and where to watch.</p></article>
            <article><span>🎟️</span><h3>Tickets</h3><p>From discovery to showtime. Connect the decision to the ticket purchase.</p></article>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div><Link href="/" className={styles.brand}><span className={styles.brandMark}>H</span><span>Hype<span>Score</span></span></Link><p>Track the hype. See what delivered.</p></div>
        <p>© 2026 HypeScore</p>
      </footer>
    </div>
  );
}
