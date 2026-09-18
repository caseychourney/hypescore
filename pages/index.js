import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import { getHomeSections } from '../lib/movieCatalog';
import { fallbackMovies } from '../lib/fallbackMovies';

const fallback = {
  mostHyped: fallbackMovies,
  openingThisWeek: fallbackMovies.filter(movie => ['spider-man-brand-new-day','the-odyssey','practical-magic-2'].includes(movie.slug)),
  comingSoon: fallbackMovies.filter(movie => ['dune-part-three'].includes(movie.slug))
};

function formatDate(value) { return value ? new Intl.DateTimeFormat('en-US', { month:'short', day:'numeric' }).format(new Date(value)) : ''; }

function Poster({ movie, className = '' }) {
  return <img className={className} src={movie.posterUrl || '/movie-poster-fallback.svg'} alt="" onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/movie-poster-fallback.svg'; }} />;
}

function MovieRail({ movies }) {
  return <div className={styles.cleanRail}>{movies.map(movie => <Link key={movie.slug} href={'/movie/' + movie.slug} className={styles.cleanMovie}><div className={styles.cleanPoster}><Poster movie={movie} /><span className={styles.cleanScore}>{movie.hype || '—'}</span></div><div className={styles.cleanMovieTitle}>{movie.title}</div><div className={styles.cleanMovieMeta}>{formatDate(movie.releaseDate)}</div></Link>)}</div>;
}

function RankedList({ movies }) {
  return <div className={styles.hypeRankList}>{movies.slice(0,8).map((movie,index) => <Link key={movie.slug} href={'/movie/' + movie.slug} className={styles.hypeRankRow}><span className={styles.hypeRankNumber}>{String(index+1).padStart(2,'0')}</span><Poster movie={movie} /><span className={styles.hypeRankTitle}>{movie.title}<small>{formatDate(movie.releaseDate)}</small></span><strong>{movie.hype}</strong></Link>)}</div>;
}

export async function getServerSideProps() {
  try { return { props: { sections: JSON.parse(JSON.stringify(await getHomeSections())) } }; }
  catch (error) { console.error('Homepage catalog fallback', error); return { props: { sections: fallback } }; }
}

export default function Home({ sections }) {
  const mostHyped = sections.mostHyped?.length ? sections.mostHyped : fallback.mostHyped;
  const topHyped = sections.topHyped?.length ? sections.topHyped : mostHyped;
  const opening = sections.openingThisWeek?.length ? sections.openingThisWeek : fallback.openingThisWeek;
  const theatres = sections.inTheatresNow?.length ? sections.inTheatresNow : opening;
  const coming = sections.comingSoon?.length ? sections.comingSoon : fallback.comingSoon;
  return <div className={styles.site}>
    <Head><title>HypeScore — Movie Hype, Reviews & Trailers</title><meta name="description" content="Discover the movies audiences are most hyped for, what's opening this week, what's in theatres now, and what's coming soon." /></Head>
    <header className={styles.nav}><div className={styles.navInner}><Link href="/" className={styles.brand}><span className={styles.brandMark}>H</span><span>Hype<span>Score</span></span></Link><nav className={styles.navLinks}><Link href="#most-hyped">Most Hyped</Link><Link href="#opening">Opening This Week</Link><Link href="#theatres">In Theatres</Link><Link href="#coming-soon">Coming Soon</Link></nav><div className={styles.cleanNavRight}><Link href="/search" className={styles.searchNav}>Search</Link><Link href="#top-hyped">Top Hyped</Link><button className={styles.profileButton}>My Hype</button></div></div></header>
    <main className={styles.cleanHome}>
      <section className={styles.cleanSection} id="most-hyped"><div className={styles.cleanSectionHead}><div><p className={styles.eyebrow}>THE MOVIES PEOPLE WANT TO SEE</p><h1>Most Hyped</h1></div><Link href="#top-hyped" className={styles.textLink}>See ranking →</Link></div><MovieRail movies={mostHyped} /></section>
      <section className={styles.cleanRuleSection}><div><p className={styles.eyebrow}>THE HYPESCORE DIFFERENCE</p><h2>Know the hype.<br />Then see if it delivered.</h2></div><div className={styles.cleanRuleCopy}><p>HypeScore measures audience anticipation before people watch. The score changes as people vote, giving the homepage a live picture of what audiences want to see.</p></div></section>
      <section className={styles.cleanSection} id="opening"><div className={styles.cleanSectionHead}><div><p className={styles.eyebrow}>RIGHT NOW</p><h2>Opening This Week</h2></div><span className={styles.cleanSectionNote}>Release calendar</span></div><MovieRail movies={opening} /></section>
      <section className={styles.cleanSection} id="top-hyped"><div className={styles.cleanSectionHead}><div><p className={styles.eyebrow}>LIVE RANKING</p><h2>Top Hyped</h2></div><Link href="/leaderboard" className={styles.textLink}>See all →</Link></div><RankedList movies={topHyped} /></section>
      <section className={styles.cleanSection} id="theatres"><div className={styles.cleanSectionHead}><div><p className={styles.eyebrow}>ON THE BIG SCREEN</p><h2>In Theatres Now</h2></div><span className={styles.cleanSectionNote}>Current releases</span></div><MovieRail movies={theatres} /></section>
      <section className={styles.cleanSection} id="coming-soon"><div className={styles.cleanSectionHead}><div><p className={styles.eyebrow}>UP NEXT</p><h2>Coming Soon</h2></div><span className={styles.cleanSectionNote}>Build the anticipation</span></div><MovieRail movies={coming} /></section>
    </main>
    <footer className={styles.footer}><div><Link href="/" className={styles.brand}><span className={styles.brandMark}>H</span><span>Hype<span>Score</span></span></Link><p>Track the hype. See what delivered.</p></div><p>© 2026 HypeScore</p></footer>
  </div>;
}
