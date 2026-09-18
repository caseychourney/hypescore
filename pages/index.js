import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import { getHomeSections } from '../lib/movieCatalog';

const fallback = {
  mostHyped: [
    { slug:'spider-man-brand-new-day', title:'Spider-Man: Brand New Day', releaseDate:'2026-07-31', posterUrl:'https://media.themoviedb.org/t/p/w300_and_h450_bestv2/9JCQtDCSpPR2ld55yNlEg1VwcQo.jpg', hype:94 },
    { slug:'the-odyssey', title:'The Odyssey', releaseDate:'2026-07-17', posterUrl:'https://dx35vtwkllhj9.cloudfront.net/universalstudios/the-odyssey/images/regions/ca/updates1/onesheet.jpg', hype:91 },
    { slug:'dune-part-three', title:'Dune: Part Three', releaseDate:'2026-12-18', posterUrl:'https://dx35vtwkllhj9.cloudfront.net/warnerbros/dune-part-three/images/regions/us/onesheet.jpg', hype:93 },
    { slug:'practical-magic-2', title:'Practical Magic 2', releaseDate:'2026-09-11', posterUrl:'https://www.practicalmagicmovie.com/assets/images/mobilebanner.jpg', hype:87 }
  ],
  openingThisWeek: [
    { slug:'resident-evil', title:'Resident Evil', releaseDate:'2026-09-18', posterUrl:'https://www.impawards.com/2026/posters/resident_evil.jpg', hype:88 },
    { slug:'shaun-the-sheep-beast-of-mossy-bottom', title:'Shaun the Sheep: The Beast of Mossy Bottom', releaseDate:'2026-09-18', posterUrl:'https://www.impawards.com/intl/uk/2026/posters/shaun_the_sheep_the_beast_of_mossy_bottom.jpg', hype:82 },
    { slug:'the-weight', title:'The Weight', releaseDate:'2026-09-18', posterUrl:'https://www.impawards.com/2026/posters/the_weight.jpg', hype:76 },
    { slug:'practical-magic-2', title:'Practical Magic 2', releaseDate:'2026-09-11', posterUrl:'https://www.practicalmagicmovie.com/assets/images/mobilebanner.jpg', hype:87 }
  ],
  comingSoon: [
    { slug:'heart-of-the-beast', title:'Heart of the Beast', releaseDate:'2026-09-25', posterUrl:'https://www.impawards.com/2026/posters/heart_of_the_beast.jpg', hype:80 },
    { slug:'primetime', title:'Primetime', releaseDate:'2026-09-25', posterUrl:'https://www.impawards.com/2026/posters/primetime.jpg', hype:71 },
    { slug:'dune-part-three', title:'Dune: Part Three', releaseDate:'2026-12-18', posterUrl:'https://dx35vtwkllhj9.cloudfront.net/warnerbros/dune-part-three/images/regions/us/onesheet.jpg', hype:93 }
  ]
};

function formatDate(value) { return value ? new Intl.DateTimeFormat('en-US', { month:'short', day:'numeric' }).format(new Date(value)) : ''; }

function MovieRail({ movies }) {
  return <div className={styles.cleanRail}>{movies.map(movie => <Link key={movie.slug} href={'/movie/' + movie.slug} className={styles.cleanMovie}><div className={styles.cleanPoster}><img src={movie.posterUrl} alt="" /><span className={styles.cleanScore}>{movie.hype || '—'}</span></div><div className={styles.cleanMovieTitle}>{movie.title}</div><div className={styles.cleanMovieMeta}>{formatDate(movie.releaseDate)}</div></Link>)}</div>;
}

function RankedList({ movies }) {
  return <div className={styles.hypeRankList}>{movies.slice(0,8).map((movie,index) => <Link key={movie.slug} href={'/movie/' + movie.slug} className={styles.hypeRankRow}><span className={styles.hypeRankNumber}>{String(index+1).padStart(2,'0')}</span><img src={movie.posterUrl} alt="" /><span className={styles.hypeRankTitle}>{movie.title}<small>{formatDate(movie.releaseDate)}</small></span><strong>{movie.hype}</strong></Link>)}</div>;
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
    <header className={styles.nav}><div className={styles.navInner}><Link href="/" className={styles.brand}><span className={styles.brandMark}>H</span><span>Hype<span>Score</span></span></Link><nav className={styles.navLinks}><Link href="#most-hyped">Most Hyped</Link><Link href="#opening">Opening This Week</Link><Link href="#theatres">In Theatres</Link><Link href="#coming-soon">Coming Soon</Link></nav><div className={styles.cleanNavRight}><Link href="#top-hyped">Top Hyped</Link><button className={styles.profileButton}>My Hype</button></div></div></header>
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
