import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import styles from '../../styles/Home.module.css';

const movieData = {
  'practical-magic-2': {
    title: 'Practical Magic 2', year: 2026, release: 'September 11, 2026', runtime: '2h 10m',
    genre: 'Fantasy • Comedy • Drama', rating: 'PG-13', hype: 87, momentum: 6,
    audience: 6.4, critic: 38, voters: 5200, budget: '$75M', boxOffice: '$55.8M',
    trailerId: 'Ho10_4IX1jE',
    poster: 'https://www.practicalmagicmovie.com/assets/images/mobilebanner.jpg',
    backdrop: 'https://www.practicalmagicmovie.com/assets/images/ipadbannerportrait.jpg',
    events: [['SEP 11','Released in theaters','LIVE'],['SEP 13','Opened at #1','NOW'],['SEP 16','Box office update','NOW']]
  },
  'spider-man-brand-new-day': {
    title: 'Spider-Man: Brand New Day', year: 2026, release: 'July 31, 2026', runtime: '2h 30m',
    genre: 'Action • Adventure • Sci-Fi', rating: 'PG-13', hype: 94, momentum: 3,
    audience: 7.8, critic: 82, voters: 8200, budget: '$225M', boxOffice: '$2.451B',
    trailerId: 'ESpuGLRifs8',
    poster: 'https://media.themoviedb.org/t/p/w300_and_h450_bestv2/9JCQtDCSpPR2ld55yNlEg1VwcQo.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w533_and_h300_bestv2/63JYqhefGrbVg0YqZ3xWqn0pwT2.jpg',
    events: [['JUL 31','Released in theaters','LIVE'],['AUG','Six-week box office run','NOW'],['SEP','Worldwide gross update','NOW']]
  },
  'the-odyssey': {
    title: 'The Odyssey', year: 2026, release: 'July 17, 2026', runtime: '2h 52m',
    genre: 'Action • Adventure • Fantasy', rating: 'R', hype: 91, momentum: 2,
    audience: 8.0, critic: 95, voters: 7600, budget: '$250M', boxOffice: '$1.685B',
    trailerId: 'vyCVVjA28fo',
    poster: 'https://dx35vtwkllhj9.cloudfront.net/universalstudios/the-odyssey/images/regions/ca/updates1/onesheet.jpg',
    backdrop: 'https://dx35vtwkllhj9.cloudfront.net/universalstudios/the-odyssey/images/regions/ca/updates1/onesheet.jpg',
    events: [['JUL 17','Released in theaters','LIVE'],['SEP 12','Passed $1.677B worldwide','NOW'],['SEP','IMAX screenings continue','NOW']]
  },
  'coyote-vs-acme': {
    title: 'Coyote vs. Acme', year: 2026, release: 'August 28, 2026', runtime: '1h 43m',
    genre: 'Adventure • Comedy • Family', rating: 'PG', hype: 79, momentum: 4,
    audience: 7.5, critic: 96, voters: 4100, budget: '$70M', boxOffice: '$66.7M',
    trailerId: 'b76pK6uYQfA',
    poster: 'https://dx35vtwkllhj9.cloudfront.net/ketchup-entertainment/coyote-vs-acme/images/regions/us/onesheet.jpg',
    backdrop: 'https://dx35vtwkllhj9.cloudfront.net/ketchup-entertainment/coyote-vs-acme/images/regions/us/onesheet.jpg',
    events: [['AUG 28','Released in theaters','LIVE'],['SEP','Still playing in theaters','NOW'],['SEP 17','New box office update','NOW']]
  }
};

export async function getStaticPaths() {
  return { paths: Object.keys(movieData).map((slug) => ({ params: { slug } })), fallback: false };
}

export async function getStaticProps({ params }) {
  return { props: { movie: movieData[params.slug], slug: params.slug } };
}

const categories = ['Writing', 'Acting', 'Story', 'Characters', 'Visuals', 'Music', 'Entertainment'];

export default function MoviePage({ movie }) {
  const events = movie.events;
  const [scores, setScores] = useState(Object.fromEntries(categories.map((c) => [c, 8])));
  const [spoiler, setSpoiler] = useState(false);
  const [saved, setSaved] = useState(false);
  const [trailerOpen, setTrailerOpen] = useState(false);

  useEffect(() => {
    if (!trailerOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setTrailerOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [trailerOpen]);

  const overall = useMemo(() => {
    const v = Object.values(scores);
    return (v.reduce((a, b) => a + b, 0) / v.length).toFixed(1);
  }, [scores]);

  const audience100 = Number(overall) * 10;
  const delivered = Math.round(audience100 - movie.hype);

  return (
    <div className={styles.site}>
      <Head>
        <title>{movie.title} — HypeScore</title>
        <meta name="description" content={'HypeScore, audience score and movie reviews for ' + movie.title} />
      </Head>

      <header className={styles.nav}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.brand}><span className={styles.brandMark}>H</span><span>Hype<span>Score</span></span></Link>
          <nav className={styles.navLinks}>
            <Link href="/">Discover</Link><Link href="/leaderboard">Trending</Link><Link href="/">Reviews</Link>
          </nav>
          <button className={styles.profileButton}>My Hype</button>
        </div>
      </header>

      <main>
        <section className={styles.movieHero} style={{backgroundImage:`linear-gradient(90deg,#090b10 8%,rgba(9,11,16,.88) 48%,rgba(9,11,16,.28) 100%),url(${movie.backdrop})`}}>
          <div className={styles.movieHeroInner}>
            <img src={movie.poster} alt={movie.title} className={styles.detailPoster} />
            <div className={styles.detailCopy}>
              <p className={styles.eyebrow}>HYPESCORE MOVIE PROFILE</p>
              <h1>{movie.title}</h1>
              <p className={styles.detailMeta}>{movie.year} · {movie.runtime} · {movie.rating} · {movie.genre}</p>
              <p className={styles.detailLead}>The score people use before they buy the ticket — and the score they check after the credits.</p>
              <div className={styles.detailActions}><button className={styles.primaryButton} onClick={() => setTrailerOpen(true)}>Watch trailer <span>▶</span></button><button className={styles.secondaryButton} onClick={() => setSaved(!saved)}>{saved ? 'In My Hype ✓' : '+ My Hype'}</button></div>
              <div className={styles.detailScores}>
                <div><span>HYPE SCORE</span><strong>{movie.hype}</strong><small>↗ +{movie.momentum} this week</small></div>
                <div><span>CRITIC SCORE</span><strong>{movie.critic}</strong><small>aggregated</small></div>
                <div><span>AUDIENCE</span><strong>{movie.audience}</strong><small>/ 10</small></div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.detailSection}>
          <div className={styles.detailGrid}>
            <div>
              <div className={styles.detailTitle}><p className={styles.eyebrow}>THE HYPE STORY</p><h2>How we got to {movie.hype}.</h2></div>
              <div className={styles.fakeChart}>
                <div className={styles.chartLine}><i style={{height:'35%'}}/><i style={{height:'46%'}}/><i style={{height:'53%'}}/><i style={{height:'71%'}}/><i style={{height:'84%'}}/><i style={{height:'78%'}}/><i style={{height:'92%'}}/></div>
                <div className={styles.chartLabels}><span>Jul</span><span>Sep</span><span>Nov</span><span>Jan</span><span>Mar</span><span>May</span><span>Now</span></div>
              </div>
              <div className={styles.eventList}>{events.map((e) => <div key={e[0]}><small>{e[0]}</small><span>{e[1]}</span><strong className={e[2].startsWith('+') ? styles.positive : styles.negative}>{e[2]}</strong></div>)}</div>
            </div>
            <aside className={styles.methodCard}>
              <p className={styles.eyebrow}>WHAT THE NUMBER MEANS</p>
              <h3>Hype Score is anticipation.</h3>
              <p>It measures how strongly people say they want to see a movie. It is not a review score and it does not mean the movie is good.</p>
              <div className={styles.methodScale}><span>0</span><i/><span>50</span><i/><span>100</span></div>
              <small>{movie.voters.toLocaleString()} current ratings</small>
            </aside>
          </div>
        </section>

        <section className={styles.detailSection}>
          <div className={styles.detailTitle}><p className={styles.eyebrow}>CRITICS VS AUDIENCE</p><h2>Three numbers. Three questions.</h2></div>
          <div className={styles.threeScores}>
            <article><span>🔥 HYPE</span><strong>{movie.hype}</strong><p>How excited people were before watching.</p></article>
            <article><span>🍿 AUDIENCE</span><strong>{movie.audience}</strong><p>How people who watched it rated it.</p></article>
            <article><span>🎯 DELIVERED</span><strong>{delivered > 0 ? '+' : ''}{delivered}</strong><p>Audience reaction compared with pre-watch hype.</p></article>
          </div>
        </section>

        <section className={styles.detailSection}>
          <div className={styles.reviewLayout}>
            <div className={styles.reviewIntro}><p className={styles.eyebrow}>QUICK REVIEW</p><h2>You watched it.<br /><span>Tell us how it felt.</span></h2><p>Seven sliders. One minute. No essay required.</p></div>
            <div className={styles.sliderCard}>
              <div className={styles.sliderTop}><div><span>YOUR OVERALL</span><strong>{overall}</strong><small>/ 10</small></div></div>
              {categories.map((category) => <div className={styles.sliderRow} key={category}><div className={styles.sliderLabel}><span>{category}</span><strong>{scores[category]}</strong></div><input type="range" min="1" max="10" value={scores[category]} onChange={(e) => setScores({...scores,[category]:Number(e.target.value)})} /></div>)}
              <button className={styles.submitButton} onClick={() => setSaved(true)}>{saved ? 'Saved to My Hype ✓' : 'Submit my review'} <span>→</span></button>
            </div>
          </div>
        </section>

        <section className={styles.detailSection}>
          <div className={styles.detailTitle}><p className={styles.eyebrow}>NERD STATS</p><h2>The stuff movie people ask about.</h2></div>
          <div className={styles.nerdGrid}><div><span>Runtime</span><strong>{movie.runtime}</strong></div><div><span>Rating</span><strong>{movie.rating}</strong></div><div><span>Release</span><strong>{movie.release}</strong></div><div><span>Budget</span><strong>{movie.budget}</strong></div><div><span>Box office</span><strong>{movie.boxOffice}</strong></div><div><span>Format</span><strong>IMAX / 2D</strong></div><div><span>Sound</span><strong>Dolby Atmos</strong></div><div><span>After credits</span><strong>2 scenes</strong></div></div>
        </section>

        <section className={styles.detailSection}>
          <div className={styles.spoilerCard}>
            <p className={styles.eyebrow}>SPOILER PROTECTED</p><h2>After-credit scenes</h2>
            {!spoiler ? <><p>There may be post-credit content. Reveal it only if you've finished the movie.</p><button className={styles.secondaryButton} onClick={() => setSpoiler(true)}>Reveal spoiler</button></> : <p><strong>Demo content:</strong> Post-credit information would appear here, behind an explicit spoiler gate, with source/date metadata.</p>}
          </div>
        </section>

        <section className={styles.detailSection}>
          <div className={styles.shareCard}>
            <div><p className={styles.eyebrow}>SHARE THE HYPE</p><h2>{movie.title}</h2><p>HYPESCORE <strong className={styles.shareBig}>{movie.hype}</strong> · ↗ +{movie.momentum}</p></div>
            <button className={styles.shareButton} onClick={() => navigator.clipboard?.writeText(window.location.href)}>Copy share link <span>→</span></button>
          </div>
        </section>
        {trailerOpen && (
          <div className={styles.trailerOverlay} role="dialog" aria-modal="true" aria-label={`Watch the ${movie.title} trailer`} onMouseDown={(event) => { if (event.target === event.currentTarget) setTrailerOpen(false); }}>
            <div className={styles.trailerModal}>
              <div className={styles.trailerHeader}>
                <div><p className={styles.eyebrow}>OFFICIAL TRAILER</p><h2>{movie.title}</h2></div>
                <button className={styles.trailerClose} onClick={() => setTrailerOpen(false)} aria-label="Close trailer">×</button>
              </div>
              <div className={styles.trailerFrame}>
                <iframe src={`https://www.youtube.com/embed/${movie.trailerId}?autoplay=1&rel=0`} title={`${movie.title} official trailer`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
              </div>
              <a className={styles.trailerExternal} href={`https://www.youtube.com/watch?v=${movie.trailerId}`} target="_blank" rel="noreferrer">Open on YouTube ↗</a>
            </div>
          </div>
        )}
      </main>
      <footer className={styles.footer}><div><Link href="/" className={styles.brand}><span className={styles.brandMark}>H</span><span>Hype<span>Score</span></span></Link><p>Track the hype. See what delivered.</p></div><p>© 2026 HypeScore</p></footer>
    </div>
  );
}
