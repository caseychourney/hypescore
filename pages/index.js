import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

const openingThisWeek = [
  { slug: 'resident-evil', title: 'Resident Evil', date: 'Sep 18', poster: 'https://www.impawards.com/2026/posters/resident_evil.jpg', hype: 88, tag: 'Opening today' },
  { slug: 'shaun-the-sheep-beast-of-mossy-bottom', title: 'Shaun the Sheep: The Beast of Mossy Bottom', date: 'Sep 18', poster: 'https://www.impawards.com/intl/uk/2026/posters/shaun_the_sheep_the_beast_of_mossy_bottom.jpg', hype: 82, tag: 'Opening today' },
  { slug: 'the-weight', title: 'The Weight', date: 'Sep 18', poster: 'https://www.impawards.com/2026/posters/the_weight.jpg', hype: 76, tag: 'Opening today' },
  { slug: 'practical-magic-2', title: 'Practical Magic 2', date: 'Sep 11', poster: 'https://www.practicalmagicmovie.com/assets/images/mobilebanner.jpg', hype: 87, tag: 'Now playing' },
];

const comingSoon = [
  { slug: 'forgotten-island', title: 'Forgotten Island', date: 'Sep 25', poster: 'https://www.impawards.com/2026/posters/forgotten_island.jpg', hype: 74 },
  { slug: 'heart-of-the-beast', title: 'Heart of the Beast', date: 'Sep 25', poster: 'https://www.impawards.com/2026/posters/heart_of_the_beast.jpg', hype: 80 },
  { slug: 'primetime', title: 'Primetime', date: 'Sep 25', poster: 'https://www.impawards.com/2026/posters/primetime.jpg', hype: 71 },
  { slug: 'dune-part-three', title: 'Dune: Part Three', date: 'Dec 18', poster: 'https://media.themoviedb.org/t/p/w600_and_h900_bestv2/1j4LqYCaZrY1.jpg', hype: 93 },
];

const trailers = [
  { title: 'Resident Evil', label: 'Official Trailer', poster: openingThisWeek[0].poster, slug: 'resident-evil' },
  { title: 'Practical Magic 2', label: 'Latest Trailer', poster: openingThisWeek[3].poster, slug: 'practical-magic-2' },
  { title: 'Digger', label: 'Final Trailer', poster: 'https://dx35vtwkllhj9.cloudfront.net/universalstudios/digger/images/regions/us/onesheet.jpg', slug: 'digger' },
];

function MovieRail({ movies }) {
  return (
    <div className={styles.cleanRail}>
      {movies.map((movie) => (
        <Link key={movie.slug} href={'/movie/' + movie.slug} className={styles.cleanMovie}>
          <div className={styles.cleanPoster}>
            <img src={movie.poster} alt="" />
            <span className={styles.cleanScore}>{movie.hype}</span>
          </div>
          <div className={styles.cleanMovieTitle}>{movie.title}</div>
          <div className={styles.cleanMovieMeta}>{movie.date}{movie.tag ? ' · ' + movie.tag : ''}</div>
        </Link>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className={styles.site}>
      <Head>
        <title>HypeScore — Movie Hype, Reviews & Trailers</title>
        <meta name="description" content="Discover what's opening this week, what's coming soon, and the latest movie trailers." />
      </Head>

      <header className={styles.nav}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.brand}><span className={styles.brandMark}>H</span><span>Hype<span>Score</span></span></Link>
          <nav className={styles.navLinks}>
            <Link href="#opening">Opening This Week</Link>
            <Link href="#coming-soon">Coming Soon</Link>
            <Link href="#trailers">Trailers</Link>
          </nav>
          <div className={styles.cleanNavRight}>
            <Link href="/leaderboard">Trending</Link>
            <button className={styles.profileButton}>My Hype</button>
          </div>
        </div>
      </header>

      <main className={styles.cleanHome}>
        <section className={styles.cleanSection} id="opening">
          <div className={styles.cleanSectionHead}>
            <div><p className={styles.eyebrow}>IN THEATRES NOW</p><h1>Opening This Week</h1></div>
            <span className={styles.cleanSectionNote}>Sep 14–20, 2026</span>
          </div>
          <MovieRail movies={openingThisWeek} />
        </section>

        <section className={styles.cleanSection} id="coming-soon">
          <div className={styles.cleanSectionHead}>
            <div><p className={styles.eyebrow}>UP NEXT</p><h2>Coming Soon</h2></div>
            <Link href="/leaderboard" className={styles.textLink}>View all →</Link>
          </div>
          <MovieRail movies={comingSoon} />
        </section>

        <section className={styles.cleanSection} id="trailers">
          <div className={styles.cleanSectionHead}>
            <div><p className={styles.eyebrow}>NEW LOOKS</p><h2>Latest Trailers</h2><p className={styles.cleanSubhead}>Begin the hype.</p></div>
          </div>
          <div className={styles.trailerRail}>
            {trailers.map((trailer, index) => (
              <Link key={trailer.title} href={'/movie/' + trailer.slug} className={index === 0 ? styles.featureTrailer : styles.smallTrailer}>
                <img src={trailer.poster} alt="" />
                <div className={styles.trailerShade} />
                <div className={styles.trailerCopy}><span>{trailer.label}</span><h3>{trailer.title}</h3><b>▶ Watch trailer</b></div>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.cleanRuleSection}>
          <div><p className={styles.eyebrow}>THE POINT OF HYPESCORE</p><h2>Know the hype.<br />Then see if it delivered.</h2></div>
          <div className={styles.cleanRuleCopy}><p>Every movie gets one place for anticipation, professional reviews, audience reaction and the details movie people care about.</p><Link href="/leaderboard" className={styles.primaryButton}>See trending movies →</Link></div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div><Link href="/" className={styles.brand}><span className={styles.brandMark}>H</span><span>Hype<span>Score</span></span></Link><p>Track the hype. See what delivered.</p></div>
        <p>© 2026 HypeScore</p>
      </footer>
    </div>
  );
}
