import Head from 'next/head';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import styles from '../../styles/Home.module.css';

const movieData = {
  'practical-magic-2': { title:'Practical Magic 2', year:2026, release:'September 11, 2026', runtime:'2h 10m', genre:'Fantasy • Comedy • Drama', rating:'PG-13', hype:87, momentum:6, audience:6.4, criticAverage:3.8, voters:5200, criticReviews:84, budget:'$75M', boxOffice:'$55.8M', trailerId:'Ho10_4IX1jE', poster:'https://www.practicalmagicmovie.com/assets/images/mobilebanner.jpg' },
  'spider-man-brand-new-day': { title:'Spider-Man: Brand New Day', year:2026, release:'July 31, 2026', runtime:'2h 30m', genre:'Action • Adventure • Sci-Fi', rating:'PG-13', hype:94, momentum:3, audience:7.8, criticAverage:8.2, voters:8200, criticReviews:214, budget:'$225M', boxOffice:'$2.451B', trailerId:'ESpuGLRifs8', poster:'https://media.themoviedb.org/t/p/w300_and_h450_bestv2/9JCQtDCSpPR2ld55yNlEg1VwcQo.jpg' },
  'the-odyssey': { title:'The Odyssey', year:2026, release:'July 17, 2026', runtime:'2h 52m', genre:'Action • Adventure • Fantasy', rating:'R', hype:91, momentum:2, audience:8.0, criticAverage:9.5, voters:7600, criticReviews:176, budget:'$250M', boxOffice:'$1.685B', trailerId:'vyCVVjA28fo', poster:'https://dx35vtwkllhj9.cloudfront.net/universalstudios/the-odyssey/images/regions/ca/updates1/onesheet.jpg' },
  'coyote-vs-acme': { title:'Coyote vs. Acme', year:2026, release:'August 28, 2026', runtime:'1h 43m', genre:'Adventure • Comedy • Family', rating:'PG', hype:79, momentum:4, audience:7.5, criticAverage:9.6, voters:4100, criticReviews:73, budget:'$70M', boxOffice:'$66.7M', trailerId:'b76pK6uYQfA', poster:'https://dx35vtwkllhj9.cloudfront.net/ketchup-entertainment/coyote-vs-acme/images/regions/us/onesheet.jpg' },
};

const triviaBySlug = {
  'practical-magic-2': ['The sequel reunites Sandra Bullock and Nicole Kidman nearly three decades after the original.','Joey King and Maisie Williams play the next generation of the Owens family.','Principal photography took place in England.'],
  'spider-man-brand-new-day': ['The film follows the events of Spider-Man: No Way Home.','Decoy names were reportedly used to protect casting secrets during production.','The movie includes an old-school Star Wars callback.'],
  'the-odyssey': ['The film was shot entirely with IMAX film cameras.','Production used locations across Greece, Italy, Morocco, Iceland and Scotland.','More than two million feet of IMAX 70mm film was used.'],
  'coyote-vs-acme': ['The film was originally planned for a 2023 release.','Ketchup Entertainment acquired the film for theatrical release.','The movie combines live action with Looney Tunes animation.'],
};

const categories = ['Writing','Acting','Story','Characters','Visuals','Music','Entertainment'];

export async function getStaticPaths() {
  return { paths:Object.keys(movieData).map((slug) => ({params:{slug}})), fallback:false };
}
export async function getStaticProps({params}) {
  return { props:{ movie:movieData[params.slug], slug:params.slug } };
}

export default function MoviePage({ movie, slug }) {
  const [reviewTab, setReviewTab] = useState('critics');
  const [infoTab, setInfoTab] = useState('basic');
  const [mode, setMode] = useState('quick');
  const [scores, setScores] = useState(Object.fromEntries(categories.map((c)=>[c,8])));
  const [saved, setSaved] = useState(false);
  const [trailerOpen, setTrailerOpen] = useState(false);

  const overall = useMemo(() => {
    const values = Object.values(scores);
    return (values.reduce((a,b)=>a+b,0)/values.length).toFixed(1);
  }, [scores]);

  return (
    <div className={styles.site}>
      <Head><title>{movie.title} — HypeScore</title><meta name="description" content={'HypeScore movie page for ' + movie.title} /></Head>

      <header className={styles.nav}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.brand}><span className={styles.brandMark}>H</span><span>Hype<span>Score</span></span></Link>
          <nav className={styles.navLinks}><Link href="/">Opening This Week</Link><Link href="/#coming-soon">Coming Soon</Link><Link href="/#trailers">Trailers</Link></nav>
          <div className={styles.cleanNavRight}><Link href="/leaderboard">Trending</Link><button className={styles.profileButton}>My Hype</button></div>
        </div>
      </header>

      <main className={styles.movieClean}>
        <section className={styles.movieTop}>
          <img className={styles.movieTopPoster} src={movie.poster} alt={movie.title} />
          <div className={styles.movieTopInfo}>
            <p className={styles.eyebrow}>MOVIE</p>
            <h1>{movie.title}</h1>
            <p className={styles.movieTopMeta}>{movie.year} · {movie.runtime} · {movie.rating} · {movie.genre}</p>
            <div className={styles.movieScoreLine}>
              <div className={styles.bigHype}><span>HYPE SCORE</span><strong>{movie.hype}</strong><small>↗ {movie.momentum} this week</small></div>
              <div><span>CRITICS</span><strong>{movie.criticAverage.toFixed(1)}</strong><small>{movie.criticReviews} reviews</small></div>
              <div><span>AUDIENCE</span><strong>{movie.audience.toFixed(1)}</strong><small>{movie.voters.toLocaleString()} ratings</small></div>
            </div>
            <div className={styles.movieTopActions}>
              <button className={styles.primaryButton} onClick={()=>setTrailerOpen(true)}>▶ Watch trailer</button>
              <a className={styles.secondaryButton} href="https://www.fandango.com/" target="_blank" rel="noreferrer">Get tickets</a>
            </div>
          </div>
        </section>

        <section className={styles.reviewBlock}>
          <div className={styles.blockHead}><div><p className={styles.eyebrow}>THE REVIEWS</p><h2>What people think</h2></div>
            <div className={styles.segmented}><button className={reviewTab==='critics'?styles.activeSegment:''} onClick={()=>setReviewTab('critics')}>Critics</button><button className={reviewTab==='audience'?styles.activeSegment:''} onClick={()=>setReviewTab('audience')}>Audience</button></div>
          </div>
          {reviewTab==='critics' ? (
            <div className={styles.reviewSummary}><strong>{movie.criticAverage.toFixed(1)}</strong><div><b>Professional average</b><span>{movie.criticReviews} reviews aggregated</span></div><p>Kept separate from HypeScore so anticipation and professional opinion never become the same number.</p></div>
          ) : (
            <div className={styles.reviewSummary}><strong>{movie.audience.toFixed(1)}</strong><div><b>Audience average</b><span>{movie.voters.toLocaleString()} ratings</span></div><p>What people who actually watched the movie thought of it.</p></div>
          )}
        </section>

        <section className={styles.quickReviewBlock}>
          <div className={styles.blockHead}><div><p className={styles.eyebrow}>YOUR TAKE</p><h2>Rate the movie</h2></div>
            <div className={styles.segmented}><button className={mode==='quick'?styles.activeSegment:''} onClick={()=>setMode('quick')}>Quick Review</button><button className={mode==='write'?styles.activeSegment:''} onClick={()=>setMode('write')}>Write a Review</button></div>
          </div>
          {mode==='quick' ? (
            <div className={styles.quickReviewCompact}>
              <div className={styles.quickOverall}><span>YOUR SCORE</span><strong>{overall}</strong><small>/ 10</small></div>
              <div className={styles.compactSliders}>{categories.map((category)=><label key={category}><span>{category}</span><b>{scores[category]}</b><input type="range" min="1" max="10" value={scores[category]} onChange={(e)=>setScores({...scores,[category]:Number(e.target.value)})}/></label>)}</div>
              <button className={styles.primaryButton} onClick={()=>setSaved(true)}>{saved?'Review saved ✓':'Save Quick Review'}</button>
            </div>
          ) : (
            <div className={styles.writeReview}>
              <textarea placeholder="What did you think? Tell other movie people what worked, what didn't, and whether it lived up to the hype." />
              <div><button className={styles.primaryButton} onClick={()=>setSaved(true)}>{saved?'Review saved ✓':'Post Review'}</button></div>
            </div>
          )}
        </section>

        <section className={styles.infoBlock}>
          <div className={styles.infoTabs}>
            <button className={infoTab==='basic'?styles.infoActive:''} onClick={()=>setInfoTab('basic')}>Movie Info</button>
            <button className={infoTab==='nerds'?styles.infoActive:''} onClick={()=>setInfoTab('nerds')}>For the Nerds 🤓</button>
            <button className={infoTab==='trivia'?styles.infoActive:''} onClick={()=>setInfoTab('trivia')}>Trivia</button>
          </div>

          {infoTab==='basic' && <div className={styles.infoGrid}>
            <div><span>Release</span><strong>{movie.release}</strong></div><div><span>Runtime</span><strong>{movie.runtime}</strong></div><div><span>Rating</span><strong>{movie.rating}</strong></div><div><span>Genre</span><strong>{movie.genre}</strong></div><div><span>Budget</span><strong>{movie.budget}</strong></div><div><span>Box Office</span><strong>{movie.boxOffice}</strong></div>
          </div>}

          {infoTab==='nerds' && <div className={styles.infoGrid}>
            <div><span>Aspect Ratio</span><strong>2.39:1</strong></div><div><span>Format</span><strong>IMAX / 2D</strong></div><div><span>Sound</span><strong>Dolby Atmos</strong></div><div><span>Camera</span><strong>See production notes</strong></div><div><span>Budget</span><strong>{movie.budget}</strong></div><div><span>Box Office</span><strong>{movie.boxOffice}</strong></div>
          </div>}

          {infoTab==='trivia' && <div className={styles.triviaList}>{(triviaBySlug[slug]||[]).map((item,i)=><article key={item}><b>0{i+1}</b><p>{item}</p></article>)}</div>}
        </section>

        <section className={styles.deliveredLine}>
          <span>HYPE DELIVERED</span><strong>{movie.audience.toFixed(1)} audience vs {movie.hype} pre-release hype</strong>
          <small>{Math.round(movie.audience*10-movie.hype) >= 5 ? 'Delivered above expectations' : Math.round(movie.audience*10-movie.hype) <= -5 ? 'Below the pre-release expectation' : 'Met the pre-release expectation'}</small>
        </section>
      </main>

      {trailerOpen && <div className={styles.trailerOverlay} onMouseDown={(e)=>{if(e.target===e.currentTarget)setTrailerOpen(false)}}><div className={styles.trailerModal}><div className={styles.trailerHeader}><div><p className={styles.eyebrow}>TRAILER</p><h2>{movie.title}</h2></div><button className={styles.trailerClose} onClick={()=>setTrailerOpen(false)}>×</button></div><div className={styles.trailerFrame}><iframe src={'https://www.youtube.com/embed/'+movie.trailerId+'?autoplay=1&rel=0'} title={movie.title+' trailer'} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /></div></div></div>}

      <footer className={styles.footer}><div><Link href="/" className={styles.brand}><span className={styles.brandMark}>H</span><span>Hype<span>Score</span></span></Link><p>Track the hype. See what delivered.</p></div><p>© 2026 HypeScore</p></footer>
    </div>
  );
}
