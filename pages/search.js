import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';

export default function SearchPage(){
  const [q,setQ]=useState('');
  const [results,setResults]=useState([]);
  const [loading,setLoading]=useState(false);
  const [searched,setSearched]=useState(false);
  async function search(event){
    event?.preventDefault();
    const term=q.trim();
    if(!term){setResults([]);setSearched(false);return;}
    setLoading(true);
    try{const r=await fetch('/api/movies?q='+encodeURIComponent(term));const data=await r.json();setResults(data.results||[]);setSearched(true);}
    finally{setLoading(false);}
  }
  useEffect(()=>{const params=new URLSearchParams(window.location.search);const term=params.get('q');if(term){setQ(term);search();}},[]);
  return <div className={styles.site}>
    <Head><title>Search movies — HypeScore</title><meta name="description" content="Search movies, release dates and HypeScores." /></Head>
    <header className={styles.nav}><div className={styles.navInner}><Link href="/" className={styles.brand}><span className={styles.brandMark}>H</span><span>Hype<span>Score</span></span></Link><nav className={styles.navLinks}><Link href="/#most-hyped">Most Hyped</Link><Link href="/#opening">Opening This Week</Link><Link href="/#coming-soon">Coming Soon</Link></nav><Link href="/" className={styles.textLink}>← Home</Link></div></header>
    <main className={styles.searchPage}>
      <p className={styles.eyebrow}>MOVIE SEARCH</p><h1>Find a movie.</h1><p className={styles.searchLead}>Search the HypeScore catalog by title and jump straight into the anticipation.</p>
      <form className={styles.searchForm} onSubmit={search}><input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Try “Spider-Man”, “Dune”, or “Odyssey”" /><button className={styles.primaryButton}>{loading?'Searching…':'Search'}</button></form>
      {searched && <p className={styles.searchMeta}>{results.length} result{results.length===1?'':'s'} for “{q}”</p>}
      <div className={styles.searchResults}>{results.map(movie=><Link key={movie.slug} href={'/movie/'+movie.slug} className={styles.searchMovie}><img src={movie.posterUrl||'/movie-poster-fallback.svg'} alt="" /><div><h2>{movie.title}</h2><span>{movie.releaseDate ? new Intl.DateTimeFormat('en-US',{year:'numeric',month:'short',day:'numeric'}).format(new Date(movie.releaseDate)) : 'Release date unavailable'}</span><strong>{movie.hype || '—'} <small>HYPE</small></strong></div></Link>)}</div>
      {searched && !results.length && <div className={styles.searchEmpty}><strong>No movies found.</strong><span>Try a shorter title or another spelling.</span></div>}
    </main>
    <footer className={styles.footer}><div><Link href="/" className={styles.brand}><span className={styles.brandMark}>H</span><span>Hype<span>Score</span></span></Link><p>Track the hype. See what delivered.</p></div><p>© 2026 HypeScore</p></footer>
  </div>
}
