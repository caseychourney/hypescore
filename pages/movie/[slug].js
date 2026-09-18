import Head from 'next/head';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import styles from '../../styles/Home.module.css';
import { prisma } from '../../lib/prisma';
import { getFallbackMovie } from '../../lib/fallbackMovies';

const categories = ['Writing','Acting','Story','Characters','Visuals','Music','Entertainment'];
const fallback = {
  title:'Movie', year:null, release:'Release date unavailable', runtime:'—', genre:'—', rating:'—', hype:0, momentum:0,
  audience:0, criticAverage:0, voters:0, criticReviews:0, budget:'—', boxOffice:'—', poster:null, overview:'Movie details are being added.',
  tagline:'', trailerUrl:'', cast:[], crew:[], providers:[], trivia:[]
};

function money(value) {
  if (value == null) return '—';
  const n = Number(value);
  if (!n) return '—';
  if (n >= 1e9) return '$' + (n/1e9).toFixed(n >= 1e10 ? 0 : 2) + 'B';
  if (n >= 1e6) return '$' + (n/1e6).toFixed(1) + 'M';
  return '$' + n.toLocaleString();
}
function minutes(value) { if (!value) return '—'; const h=Math.floor(value/60), m=value%60; return h ? h+'h '+(m?m+'m':'') : m+'m'; }
function formatDate(value) { return value ? new Intl.DateTimeFormat('en-US',{month:'long',day:'numeric',year:'numeric'}).format(new Date(value)) : 'Release date unavailable'; }
function normalizeMovie(m) {
  if (!m) return fallback;
  return { title:m.title, year:m.releaseDate ? new Date(m.releaseDate).getFullYear() : null, release:formatDate(m.releaseDate), runtime:minutes(m.runtimeMinutes), genre:Array.isArray(m.genres)?m.genres.join(' • '):'—', rating:m.certification||'—', hype:m.hype||0, momentum:m.momentum||0, audience:m.audienceAverage||0, criticAverage:m.criticAverage||0, voters:m.audienceRatingCount||0, criticReviews:m.criticReviewCount||0, budget:money(m.budgetUsd), boxOffice:money(m.boxOfficeWorldwideUsd), poster:m.posterUrl, overview:m.overview||'No synopsis has been added yet.', tagline:m.tagline||'', trailerUrl:m.trailerUrl||'', cast:m.cast||[], crew:m.crew||[], providers:m.watchProviders||[], trivia:[] };
}

export async function getStaticPaths() { return { paths:[], fallback:'blocking' }; }
export async function getStaticProps({params}) {
  try {
    const movie = await prisma.movie.findUnique({ where:{slug:params.slug}, include:{ cast:{include:{person:true},orderBy:{billingOrder:'asc'}}, crew:{include:{person:true}}, watchProviders:true, releaseSnapshot:{select:{score:true}}, snapshots:{orderBy:{capturedAt:'desc'},take:1,select:{score:true}} } });
    if (!movie) {
      const fallbackMovie = getFallbackMovie(params.slug);
      if (!fallbackMovie) return { notFound:true };
      return { props:{ movie:JSON.parse(JSON.stringify(fallbackMovie)) }, revalidate:300 };
    }
    const fallbackMovie = getFallbackMovie(params.slug);
    const mergedMovie = fallbackMovie ? {
      ...fallbackMovie,
      ...movie,
      posterUrl: movie.posterUrl || fallbackMovie.posterUrl,
      backdropUrl: movie.backdropUrl || fallbackMovie.backdropUrl,
      overview: movie.overview || fallbackMovie.overview,
      tagline: movie.tagline || fallbackMovie.tagline,
      genres: Array.isArray(movie.genres) && movie.genres.length ? movie.genres : fallbackMovie.genres,
      runtimeMinutes: movie.runtimeMinutes || fallbackMovie.runtimeMinutes,
      certification: movie.certification || fallbackMovie.certification,
      originalLanguage: movie.originalLanguage || fallbackMovie.originalLanguage,
      productionCompanies: movie.productionCompanies || fallbackMovie.productionCompanies,
      trailerUrl: movie.trailerUrl || fallbackMovie.trailerUrl,
      hype: movie.releaseSnapshot?.score ?? movie.snapshots?.[0]?.score ?? fallbackMovie.hype ?? 0
    } : {
      ...movie,
      hype: movie.releaseSnapshot?.score ?? movie.snapshots?.[0]?.score ?? 0
    };
    return { props:{ movie:JSON.parse(JSON.stringify(mergedMovie)) }, revalidate:300 };
  } catch (error) {
    console.error('Movie page lookup failed', error);
    const fallbackMovie = getFallbackMovie(params.slug);
    if (!fallbackMovie) return { notFound: true };
    return { props: { movie: JSON.parse(JSON.stringify(fallbackMovie)) }, revalidate: 300 };
  }
}

export default function MoviePage({movie:rawMovie}) {
  const movie=normalizeMovie(rawMovie);
  const [reviewTab,setReviewTab]=useState('critics'),[infoTab,setInfoTab]=useState('basic'),[mode,setMode]=useState('quick'),[saved,setSaved]=useState(false),[trailerOpen,setTrailerOpen]=useState(false);
  const [scores,setScores]=useState(Object.fromEntries(categories.map(c=>[c,8])));
  const overall=useMemo(()=>{const v=Object.values(scores);return (v.reduce((a,b)=>a+b,0)/v.length).toFixed(1)},[scores]);
  const trailerId=movie.trailerUrl ? movie.trailerUrl.split('v=')[1]?.split('&')[0] || movie.trailerUrl.split('/').pop() : '';
  const hypeDelivered=movie.audience ? Math.round(movie.audience*10-movie.hype) : null;
  return <div className={styles.site}>
    <Head><title>{movie.title} — HypeScore</title><meta name="description" content={(movie.overview||'') .slice(0,155)} /></Head>
    <header className={styles.nav}><div className={styles.navInner}><Link href="/" className={styles.brand}><span className={styles.brandMark}>H</span><span>Hype<span>Score</span></span></Link><nav className={styles.navLinks}><Link href="/#most-hyped">Most Hyped</Link><Link href="/#opening">Opening This Week</Link><Link href="/#coming-soon">Coming Soon</Link></nav><div className={styles.cleanNavRight}><Link href="/leaderboard">Top Hyped</Link><button className={styles.profileButton}>My Hype</button></div></div></header>
    <main className={styles.movieClean}>
      <section className={styles.movieTop}><div>{movie.poster ? <img className={styles.movieTopPoster} src={movie.poster} alt={movie.title}/> : <div className={styles.movieTopPoster}/>}</div><div className={styles.movieTopInfo}><p className={styles.eyebrow}>MOVIE</p><h1>{movie.title}</h1>{movie.tagline&&<p className={styles.cleanSubhead}>{movie.tagline}</p>}<p className={styles.movieTopMeta}>{movie.year||'—'} · {movie.runtime} · {movie.rating} · {movie.genre}</p><div className={styles.movieScoreLine}><div className={styles.bigHype}><span>HYPE SCORE</span><strong>{movie.hype||'—'}</strong><small>{movie.momentum ? '↗ '+movie.momentum+' this week':'Live audience signal'}</small></div><div><span>CRITICS</span><strong>{movie.criticAverage?movie.criticAverage.toFixed(1):'—'}</strong><small>{movie.criticReviews||0} reviews</small></div><div><span>AUDIENCE</span><strong>{movie.audience?movie.audience.toFixed(1):'—'}</strong><small>{movie.voters.toLocaleString()} ratings</small></div></div><div className={styles.movieTopActions}>{trailerId&&<button className={styles.primaryButton} onClick={()=>setTrailerOpen(true)}>▶ Watch trailer</button>}<a className={styles.secondaryButton} href="https://www.fandango.com/" target="_blank" rel="noreferrer">Get tickets</a></div></div></section>
      <section className={styles.reviewBlock}><div className={styles.blockHead}><div><p className={styles.eyebrow}>THE REVIEWS</p><h2>What people think</h2></div><div className={styles.segmented}><button className={reviewTab==='critics'?styles.activeSegment:''} onClick={()=>setReviewTab('critics')}>Critics</button><button className={reviewTab==='audience'?styles.activeSegment:''} onClick={()=>setReviewTab('audience')}>Audience</button></div></div>{reviewTab==='critics'?<div className={styles.reviewSummary}><strong>{movie.criticAverage?movie.criticAverage.toFixed(1):'—'}</strong><div><b>Professional average</b><span>{movie.criticReviews||0} reviews</span></div><p>Professional opinion stays separate from HypeScore.</p></div>:<div className={styles.reviewSummary}><strong>{movie.audience?movie.audience.toFixed(1):'—'}</strong><div><b>Audience average</b><span>{movie.voters.toLocaleString()} ratings</span></div><p>Audience reaction after people have actually watched the movie.</p></div>}</section>
      <section className={styles.quickReviewBlock}><div className={styles.blockHead}><div><p className={styles.eyebrow}>YOUR TAKE</p><h2>Rate the movie</h2></div><div className={styles.segmented}><button className={mode==='quick'?styles.activeSegment:''} onClick={()=>setMode('quick')}>Quick Review</button><button className={mode==='write'?styles.activeSegment:''} onClick={()=>setMode('write')}>Write a Review</button></div></div>{mode==='quick'?<div className={styles.quickReviewCompact}><div className={styles.quickOverall}><span>YOUR SCORE</span><strong>{overall}</strong><small>/ 10</small></div><div className={styles.compactSliders}>{categories.map(c=><label key={c}><span>{c}</span><b>{scores[c]}</b><input type="range" min="1" max="10" value={scores[c]} onChange={e=>setScores({...scores,[c]:Number(e.target.value)})}/></label>)}</div><button className={styles.primaryButton} onClick={()=>setSaved(true)}>{saved?'Review saved ✓':'Save Quick Review'}</button></div>:<div className={styles.writeReview}><textarea placeholder="What did you think? Tell other movie people what worked, what didn't, and whether it lived up to the hype."/><div><button className={styles.primaryButton} onClick={()=>setSaved(true)}>{saved?'Review saved ✓':'Post Review'}</button></div></div>}</section>
      <section className={styles.infoBlock}><div className={styles.infoTabs}><button className={infoTab==='basic'?styles.infoActive:''} onClick={()=>setInfoTab('basic')}>Movie Info</button><button className={infoTab==='nerds'?styles.infoActive:''} onClick={()=>setInfoTab('nerds')}>For the Nerds 🤓</button></div>{infoTab==='basic'&&<><div className={styles.infoGrid}><div><span>Release</span><strong>{movie.release}</strong></div><div><span>Runtime</span><strong>{movie.runtime}</strong></div><div><span>Rating</span><strong>{movie.rating}</strong></div><div><span>Genre</span><strong>{movie.genre}</strong></div><div><span>Budget</span><strong>{movie.budget}</strong></div><div><span>Worldwide Box Office</span><strong>{movie.boxOffice}</strong></div></div><div className={styles.castSection}><div className={styles.castSectionHead}><p className={styles.eyebrow}>CAST</p><h3>Who's in it</h3></div><div className={styles.castGrid}>{movie.cast.slice(0,18).map((c,i)=><Link key={c.id||i} href={'/person/'+(c.person?.slug||'')} className={styles.castCard}><span className={styles.castName}>{c.person?.name||'Cast member'}</span><small>{c.characterName||'Cast'}</small></Link>)}</div></div><div className={styles.movieSynopsis}><span>Synopsis</span><p>{movie.overview}</p></div></>}{infoTab==='nerds'&&<div className={styles.infoGrid}><div><span>Original Language</span><strong>{rawMovie.originalLanguage||'—'}</strong></div><div><span>Source</span><strong>{rawMovie.sourceProvider||'—'}</strong></div><div><span>TMDB ID</span><strong>{rawMovie.tmdbId||'—'}</strong></div><div><span>Trailer</span><strong>{movie.trailerUrl?'Available':'Not added'}</strong></div><div><span>Production Companies</span><strong>{Array.isArray(rawMovie.productionCompanies)?rawMovie.productionCompanies.map(x=>x.name||x).join(', '):'—'}</strong></div></div>}</section>
      <section className={styles.deliveredLine}><span>HYPE DELIVERED</span><strong>{hypeDelivered===null?'Waiting for audience ratings':(hypeDelivered>=5?'+':'')+hypeDelivered+' points vs pre-release hype'}</strong><small>{hypeDelivered===null?'Requires post-watch audience data':hypeDelivered>=5?'Delivered above expectations':hypeDelivered<=-5?'Below the pre-release expectation':'Met expectations'}</small></section>
    </main>
    {trailerOpen&&<div className={styles.trailerOverlay} onMouseDown={e=>{if(e.target===e.currentTarget)setTrailerOpen(false)}}><div className={styles.trailerModal}><div className={styles.trailerHeader}><div><p className={styles.eyebrow}>TRAILER</p><h2>{movie.title}</h2></div><button className={styles.trailerClose} onClick={()=>setTrailerOpen(false)}>×</button></div><div className={styles.trailerFrame}><iframe src={'https://www.youtube.com/embed/'+trailerId+'?autoplay=1&rel=0'} title={movie.title+' trailer'} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen/></div></div></div>}
    <footer className={styles.footer}><div><Link href="/" className={styles.brand}><span className={styles.brandMark}>H</span><span>Hype<span>Score</span></span></Link><p>Track the hype. See what delivered.</p></div><p>© 2026 HypeScore</p></footer>
  </div>;
}
