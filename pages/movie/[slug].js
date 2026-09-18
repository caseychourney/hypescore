import Head from 'next/head';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import styles from '../../styles/Home.module.css';

const movieData = {
  'superman': {
    title: 'Superman', year: 2025, release: 'July 11, 2025', runtime: '2h 9m',
    genre: 'Action • Adventure • Sci-Fi', rating: 'PG-13', hype: 92, momentum: 8,
    audience: 8.7, critic: 91, voters: 1842, budget: '$225M', boxOffice: '$618.7M',
    poster: 'https://image.tmdb.org/t/p/w780/ombsmhYUqR4qqOLOxAyr5V8hbyv.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/9whEVuKte4Qi0LI4TzG7hH4wR7G.jpg',
    events: [['JUL 2024','Casting revealed','+4'],['FEB 2025','First teaser','+6'],['MAR 2025','Trailer released','+8'],['JUN 2025','Early reactions','-2']]
  },
  'fantastic-four-first-steps': {
    title: 'The Fantastic Four: First Steps', year: 2025, release: 'July 25, 2025', runtime: '1h 55m',
    genre: 'Action • Adventure • Sci-Fi', rating: 'PG-13', hype: 88, momentum: 5,
    audience: 8.0, critic: 86, voters: 1267, budget: '$200M+', boxOffice: '$521.9M',
    poster: 'https://image.tmdb.org/t/p/w780/x26MtUlwtWD26d0G0FXcppxCJio.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/1G7f4x2Z9w3d0vV8cJ9mJ2yQ2vB.jpg',
    events: [['JUN 2024','Cast revealed','+4'],['NOV 2024','First look','+5'],['FEB 2025','Trailer released','+7'],['JUL 2025','Early reactions','+3']]
  },
  'dune-part-two': {
    title: 'Dune: Part Two', year: 2024, release: 'March 1, 2024', runtime: '2h 46m',
    genre: 'Sci-Fi • Adventure • Drama', rating: 'PG-13', hype: 86, momentum: -2,
    audience: 8.6, critic: 92, voters: 4210, budget: '$190M', boxOffice: '$714.8M',
    poster: 'https://image.tmdb.org/t/p/w780/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/7q6q3h3w5c5v7v0f5m8n2w2g6qM.jpg',
    events: [['MAY 2023','First teaser','+5'],['DEC 2023','Trailer released','+8'],['FEB 2024','Early reactions','+4'],['MAR 2024','Audience reviews','-2']]
  },
  'deadpool-and-wolverine': {
    title: 'Deadpool & Wolverine', year: 2024, release: 'July 26, 2024', runtime: '2h 8m',
    genre: 'Action • Comedy • Marvel', rating: 'R', hype: 89, momentum: 4,
    audience: 8.3, critic: 78, voters: 3875, budget: '$200M', boxOffice: '$1.338B',
    poster: 'https://image.tmdb.org/t/p/w780/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
    events: [['FEB 2024','First teaser','+6'],['APR 2024','Trailer released','+7'],['JUN 2024','New clip','+4'],['JUL 2024','Audience reviews','+4']]
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
              <div className={styles.detailActions}><button className={styles.primaryButton}>Watch trailer <span>▶</span></button><button className={styles.secondaryButton} onClick={() => setSaved(!saved)}>{saved ? 'In My Hype ✓' : '+ My Hype'}</button></div>
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
      </main>
      <footer className={styles.footer}><div><Link href="/" className={styles.brand}><span className={styles.brandMark}>H</span><span>Hype<span>Score</span></span></Link><p>Track the hype. See what delivered.</p></div><p>© 2026 HypeScore</p></footer>
    </div>
  );
}
