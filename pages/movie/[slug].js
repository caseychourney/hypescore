import Head from 'next/head';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import styles from '../../styles/Home.module.css';
import { prisma } from '../../lib/prisma';
import { getFallbackMovie } from '../../lib/fallbackMovies';

const categories = ['Writing','Acting','Story','Characters','Visuals','Music','Entertainment'];

const fallback = {
  title:'Movie', year:null, release:'Release date unavailable', runtime:'—', genre:'—', rating:'—',
  hype:0, momentum:0, audience:0, criticAverage:0, voters:0, criticReviews:0,
  budget:'—', boxOffice:'—', poster:null, overview:'Movie details are being added.',
  tagline:'', trailerUrl:'', cast:[], crew:[], providers:[]
};

function money(value) {
  if (value == null) return '—';
  const n = Number(value);
  if (!n) return '—';
  if (n >= 1e9) return '$' + (n / 1e9).toFixed(n >= 1e10 ? 0 : 2) + 'B';
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(1) + 'M';
  return '$' + n.toLocaleString();
}

function minutes(value) {
  if (!value) return '—';
  const h = Math.floor(value / 60);
  const m = value % 60;
  return h ? h + 'h ' + (m ? m + 'm' : '') : m + 'm';
}

function formatDate(value) {
  return value
    ? new Intl.DateTimeFormat('en-US', { month:'long', day:'numeric', year:'numeric' }).format(new Date(value))
    : 'Release date unavailable';
}

function youtubeId(value) {
  if (!value) return '';
  try {
    const url = new URL(value);
    if (url.hostname.includes('youtu.be')) return url.pathname.replace(/^\//,'').split('/')[0];
    if (url.searchParams.get('v')) return url.searchParams.get('v');
    const match = url.pathname.match(/(?:embed|shorts)\/([^/?]+)/);
    return match ? match[1] : '';
  } catch {
    return value.split('v=')[1]?.split('&')[0] || '';
  }
}

function normalizeMovie(m) {
  if (!m) return fallback;
  return {
    title:m.title || 'Movie',
    year:m.releaseDate ? new Date(m.releaseDate).getFullYear() : null,
    release:formatDate(m.releaseDate),
    runtime:minutes(m.runtimeMinutes),
    genre:Array.isArray(m.genres) ? m.genres.join(' • ') : '—',
    rating:m.certification || '—',
    hype:m.hype || 0,
    momentum:m.momentum || 0,
    audience:m.audienceAverage || 0,
    criticAverage:m.criticAverage || 0,
    voters:m.audienceRatingCount || 0,
    criticReviews:m.criticReviewCount || 0,
    budget:money(m.budgetUsd),
    boxOffice:money(m.boxOfficeWorldwideUsd),
    poster:m.posterUrl || null,
    backdrop:m.backdropUrl || m.posterUrl || null,
    overview:m.overview || 'No synopsis has been added yet.',
    tagline:m.tagline || '',
    trailerUrl:m.trailerUrl || '',
    cast:Array.isArray(m.cast) ? m.cast : [],
    crew:Array.isArray(m.crew) ? m.crew : [],
    providers:Array.isArray(m.watchProviders) ? m.watchProviders : []
  };
}

export async function getStaticPaths() {
  return { paths:[], fallback:'blocking' };
}

export async function getStaticProps({ params }) {
  try {
    const movie = await prisma.movie.findUnique({
      where:{ slug:params.slug },
      include:{
        cast:{ include:{ person:true }, orderBy:{ billingOrder:'asc' } },
        crew:{ include:{ person:true } },
        watchProviders:true,
        releaseSnapshot:{ select:{ score:true, effectiveVotes:true, rawVotes:true, releaseAt:true } },
        snapshots:{ orderBy:{ capturedAt:'desc' }, take:20, select:{ score:true, capturedAt:true } },
        events:{ where:{ moderation:'APPROVED' }, orderBy:{ occurredAt:'desc' }, take:12 }
      }
    });

    if (!movie) {
      const fallbackMovie = getFallbackMovie(params.slug);
      if (!fallbackMovie) return { notFound:true };
      return { props:{ movie:JSON.parse(JSON.stringify(fallbackMovie)) }, revalidate:300 };
    }

    const fallbackMovie = getFallbackMovie(params.slug);
    const mergedMovie = fallbackMovie ? {
      ...fallbackMovie,
      ...movie,
      posterUrl:movie.posterUrl || fallbackMovie.posterUrl,
      backdropUrl:movie.backdropUrl || fallbackMovie.backdropUrl,
      overview:movie.overview || fallbackMovie.overview,
      tagline:movie.tagline || fallbackMovie.tagline,
      genres:Array.isArray(movie.genres) && movie.genres.length ? movie.genres : fallbackMovie.genres,
      runtimeMinutes:movie.runtimeMinutes || fallbackMovie.runtimeMinutes,
      certification:movie.certification || fallbackMovie.certification,
      originalLanguage:movie.originalLanguage || fallbackMovie.originalLanguage,
      productionCompanies:movie.productionCompanies || fallbackMovie.productionCompanies,
      trailerUrl:movie.trailerUrl || fallbackMovie.trailerUrl,
      hype:movie.releaseSnapshot?.score ?? movie.snapshots?.[0]?.score ?? fallbackMovie.hype ?? 0
    } : {
      ...movie,
      hype:movie.releaseSnapshot?.score ?? movie.snapshots?.[0]?.score ?? 0
    };

    return { props:{ movie:JSON.parse(JSON.stringify(mergedMovie)) }, revalidate:300 };
  } catch (error) {
    console.error('Movie page lookup failed', error);
    const fallbackMovie = getFallbackMovie(params.slug);
    if (!fallbackMovie) return { notFound:true };
    return { props:{ movie:JSON.parse(JSON.stringify(fallbackMovie)) }, revalidate:300 };
  }
}

export default function MoviePage({ movie:rawMovie }) {
  const movie = normalizeMovie(rawMovie);
  const [reviewTab,setReviewTab] = useState('critics');
  const [infoTab,setInfoTab] = useState('basic');
  const [mode,setMode] = useState('quick');
  const [saved,setSaved] = useState(false);
  const [trailerOpen,setTrailerOpen] = useState(false);
  const [posterBroken,setPosterBroken] = useState(false);
  const [scores,setScores] = useState(Object.fromEntries(categories.map(c => [c,8])));
  const [hypeChoice,setHypeChoice] = useState('');
  const [hypeSaving,setHypeSaving] = useState(false);
  const [hypeMessage,setHypeMessage] = useState('');

  const overall = useMemo(() => {
    const values = Object.values(scores);
    return (values.reduce((a,b) => a + b, 0) / values.length).toFixed(1);
  }, [scores]);

  const trailerId = youtubeId(movie.trailerUrl);
  const hypeDelivered = movie.audience ? Math.round(movie.audience * 10 - movie.hype) : null;
  const posterSrc = posterBroken ? '/movie-poster-fallback.svg' : movie.poster;
  const cast = movie.cast.filter(c => c.person?.slug).slice(0,18);
  const directors = movie.crew.filter(c => c.person?.slug && String(c.job || '').toLowerCase().includes('director')).slice(0,4);

  async function voteHype(choice) {
    setHypeSaving(true);
    setHypeMessage('');
    try {
      const response = await fetch('/api/movies/' + rawMovie.id + '/vote', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({ choice })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to save');
      setHypeChoice(choice);
      setHypeMessage('Your Hype is saved.');
    } catch (error) {
      setHypeMessage(error.message);
    } finally {
      setHypeSaving(false);
    }
  }

  function openTrailer() {
    setTrailerOpen(true);
  }

  return (
    <div className={styles.site}>
      <Head>
        <title>{movie.title} — HypeScore</title>
        <meta name="description" content={(movie.overview || '').slice(0,155)} />
      </Head>

      <header className={styles.nav}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.brand}><span className={styles.brandMark}>H</span><span>Hype<span>Score</span></span></Link>
          <nav className={styles.navLinks}>
            <Link href="/#most-hyped">Most Hyped</Link>
            <Link href="/#opening">Opening This Week</Link>
            <Link href="/#theatres">In Theatres</Link>
            <Link href="/#coming-soon">Coming Soon</Link>
          </nav>
          <div className={styles.cleanNavRight}>
            <Link href="/leaderboard">Top Hyped</Link>
            <button className={styles.profileButton}>My Hype</button>
          </div>
        </div>
      </header>

      <main>
        <section className={styles.movieHero} style={{ '--movie-backdrop': movie.backdrop ? `url("${movie.backdrop}")` : 'none' }}>
          <div className={styles.movieHeroShade} />
          <div className={styles.movieHeroInner}>
            <div className={styles.movieBreadcrumb}>
              <Link href="/">Movies</Link><span>/</span><span>{movie.title}</span>
            </div>

            <div className={styles.movieHeroGrid}>
              <div className={styles.moviePosterColumn}>
                <div className={styles.moviePosterFrame}>
                  <img
                    className={styles.movieHeroPoster}
                    src={posterSrc}
                    alt={movie.title + ' poster'}
                    onError={() => setPosterBroken(true)}
                  />
                  <div className={styles.posterBadge}><strong>{movie.hype || '—'}</strong><span>HYPE</span></div>
                </div>
              </div>

              <div className={styles.movieHeroCopy}>
                <p className={styles.eyebrow}>HYPESCORE MOVIE PAGE</p>
                <h1>{movie.title}</h1>
                {movie.tagline && <p className={styles.movieTagline}>{movie.tagline}</p>}

                <div className={styles.movieMetaLine}>
                  <span>{movie.year || '—'}</span><i>•</i><span>{movie.runtime}</span><i>•</i><span>{movie.rating}</span>
                  {movie.genre !== '—' && <><i>•</i><span>{movie.genre}</span></>}
                </div>

                <div className={styles.movieHeroScores}>
                  <div className={styles.heroHype}>
                    <span>HYPE SCORE</span>
                    <strong>{movie.hype || '—'}</strong>
                    <small>{movie.momentum ? '↗ ' + movie.momentum + ' this week' : 'Audience anticipation'}</small>
                  </div>
                  <div>
                    <span>CRITICS</span>
                    <strong>{movie.criticAverage ? movie.criticAverage.toFixed(1) : '—'}</strong>
                    <small>{movie.criticReviews || 0} reviews</small>
                  </div>
                  <div>
                    <span>AUDIENCE</span>
                    <strong>{movie.audience ? movie.audience.toFixed(1) : '—'}</strong>
                    <small>{movie.voters.toLocaleString()} ratings</small>
                  </div>
                </div>

                <div className={styles.movieHeroActions}>
                  <button className={styles.primaryButton} onClick={openTrailer}>▶ Watch Trailer</button>
                  <a className={styles.secondaryButton} href="https://www.fandango.com/" target="_blank" rel="noreferrer">Get Tickets <span>↗</span></a>
                  <button className={styles.ghostButton}>＋ My Hype</button>
                </div>

                <div className={styles.hypeVoteBox}>
                  <div><span className={styles.hypeVoteLabel}>YOUR HYPE</span><strong>Would you watch it?</strong><small>One vote. Change it anytime before you watch.</small></div>
                  <div className={styles.hypeVoteButtons}>
                    {['YES','MAYBE','NO'].map(choice => <button key={choice} className={hypeChoice === choice ? styles.hypeVoteActive : ''} disabled={hypeSaving} onClick={() => voteHype(choice)}>{choice === 'YES' ? '🔥 ' : choice === 'MAYBE' ? '🤔 ' : '✋ '}{choice}</button>)}
                  </div>
                  {hypeMessage && <span className={styles.hypeVoteMessage}>{hypeMessage}</span>}
                </div>

                <div className={styles.heroMicrocopy}>
                  <span>Hype is anticipation — not a quality score.</span>
                  <Link href="/#top-hyped">See how HypeScore works →</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className={styles.movieSubnav}>
          <div>
            <a href="#overview">Overview</a>
            <a href="#reviews">Reviews</a>
            <a href="#your-take">Your Take</a>
            <a href="#movie-info">Movie Info</a>
            <a href="#hype-test">Hype Test</a>
          </div>
        </div>

        <div className={styles.movieBody}>
          <section className={styles.movieIntro} id="overview">
            <div>
              <p className={styles.eyebrow}>THE MOVIE</p>
              <h2>What you need to know</h2>
            </div>
            <div>
              <p>{movie.overview}</p>
              <div className={styles.introFacts}>
                <span><b>{movie.release}</b><small>Release date</small></span>
                <span><b>{movie.runtime}</b><small>Runtime</small></span>
                <span><b>{movie.rating}</b><small>Certification</small></span>
              </div>
            </div>
          </section>

          <section className={styles.movieScoreCards}>
            <article><span>HYPE</span><strong>{movie.hype || '—'}</strong><small>Pre-watch anticipation</small></article>
            <article><span>CRITICS</span><strong>{movie.criticAverage ? movie.criticAverage.toFixed(1) : '—'}</strong><small>{movie.criticReviews || 0} professional reviews</small></article>
            <article><span>AUDIENCE</span><strong>{movie.audience ? movie.audience.toFixed(1) : '—'}</strong><small>Post-watch audience reaction</small></article>
            <article><span>BOX OFFICE</span><strong>{movie.boxOffice}</strong><small>Worldwide gross</small></article>
          </section>

          {Array.isArray(rawMovie.snapshots) && rawMovie.snapshots.length > 1 && (
            <section className={styles.hypeHistory}>
              <div className={styles.hypeHistoryHead}>
                <div><p className={styles.eyebrow}>HYPE OVER TIME</p><h2>Watch the anticipation move.</h2></div>
                <span>{rawMovie.snapshots.length} snapshots</span>
              </div>
              <div className={styles.hypeBars}>
                {[...rawMovie.snapshots].reverse().map((point, i) => (
                  <div key={point.capturedAt || i} className={styles.hypeBarCol} title={new Date(point.capturedAt).toLocaleDateString()}>
                    <div className={styles.hypeBar} style={{ height: Math.max(8, Math.round((point.score / 100) * 100)) + '%' }}><b>{point.score}</b></div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className={styles.hypeExplainer}>
            <div className={styles.hypeExplainerLead}>
              <p className={styles.eyebrow}>HOW HYPESCORE WORKS</p>
              <h2>Anticipation, not a quality score.</h2>
              <p>HypeScore measures whether people want to see a movie before they watch it. After release, audience ratings show whether the movie delivered on that expectation.</p>
            </div>
            <div className={styles.hypeSteps}>
              <div><b>01</b><strong>People vote</strong><span>Yes, Maybe or No.</span></div>
              <div><b>02</b><strong>Hype moves</strong><span>The live score reflects current anticipation.</span></div>
              <div><b>03</b><strong>Did it deliver?</strong><span>Audience reaction is compared with release-day hype.</span></div>
            </div>
          </section>

          <section className={styles.eventTimeline} id="hype-timeline">
            <div className={styles.blockHead}><div><p className={styles.eyebrow}>THE TIMELINE</p><h2>What changed the hype</h2></div><span className={styles.cleanSectionNote}>Verified events only</span></div>
            {Array.isArray(rawMovie.events) && rawMovie.events.length ? <div className={styles.eventRows}>{rawMovie.events.map((event,i) => <article key={event.id || i}><time>{new Date(event.occurredAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</time><div><strong>{event.headline || event.type}</strong><p>{event.summary || 'A movie event was recorded.'}</p>{event.sourceName && <small>{event.sourceName}</small>}</div></article>)}</div> : <div className={styles.emptyTimeline}><strong>The story starts here.</strong><span>As verified movie events happen, HypeScore will show what changed and why.</span></div>}
          </section>

          <section className={styles.reviewBlock} id="reviews">
            <div className={styles.blockHead}>
              <div><p className={styles.eyebrow}>THE REVIEWS</p><h2>What people think</h2></div>
              <div className={styles.segmented}>
                <button className={reviewTab === 'critics' ? styles.activeSegment : ''} onClick={() => setReviewTab('critics')}>Critics</button>
                <button className={reviewTab === 'audience' ? styles.activeSegment : ''} onClick={() => setReviewTab('audience')}>Audience</button>
              </div>
            </div>
            {reviewTab === 'critics' ? (
              <div className={styles.reviewSummary}><strong>{movie.criticAverage ? movie.criticAverage.toFixed(1) : '—'}</strong><div><b>Professional average</b><span>{movie.criticReviews || 0} reviews</span></div><p>Professional opinion stays separate from HypeScore.</p></div>
            ) : (
              <div className={styles.reviewSummary}><strong>{movie.audience ? movie.audience.toFixed(1) : '—'}</strong><div><b>Audience average</b><span>{movie.voters.toLocaleString()} ratings</span></div><p>Audience reaction after people have actually watched the movie.</p></div>
            )}
          </section>

          <section className={styles.quickReviewBlock} id="your-take">
            <div className={styles.blockHead}>
              <div><p className={styles.eyebrow}>YOUR TAKE</p><h2>Rate the movie</h2></div>
              <div className={styles.segmented}>
                <button className={mode === 'quick' ? styles.activeSegment : ''} onClick={() => setMode('quick')}>Quick Review</button>
                <button className={mode === 'write' ? styles.activeSegment : ''} onClick={() => setMode('write')}>Write a Review</button>
              </div>
            </div>
            {mode === 'quick' ? (
              <div className={styles.quickReviewCompact}>
                <div className={styles.quickOverall}><span>YOUR SCORE</span><strong>{overall}</strong><small>/ 10</small></div>
                <div className={styles.compactSliders}>{categories.map(c => <label key={c}><span>{c}</span><b>{scores[c]}</b><input type="range" min="1" max="10" value={scores[c]} onChange={e => setScores({...scores,[c]:Number(e.target.value)})}/></label>)}</div>
                <button className={styles.primaryButton} onClick={() => setSaved(true)}>{saved ? 'Review saved ✓' : 'Save Quick Review'}</button>
              </div>
            ) : (
              <div className={styles.writeReview}><textarea placeholder="What did you think? Tell other movie people what worked, what didn't, and whether it lived up to the hype."/><div><button className={styles.primaryButton} onClick={() => setSaved(true)}>{saved ? 'Review saved ✓' : 'Post Review'}</button></div></div>
            )}
          </section>

          <section className={styles.infoBlock} id="movie-info">
            <div className={styles.infoTabs}>
              <button className={infoTab === 'basic' ? styles.infoActive : ''} onClick={() => setInfoTab('basic')}>Movie Info</button>
              <button className={infoTab === 'nerds' ? styles.infoActive : ''} onClick={() => setInfoTab('nerds')}>For the Nerds 🤓</button>
            </div>

            {infoTab === 'basic' && (
              <>
                <div className={styles.infoGrid}>
                  <div><span>Release</span><strong>{movie.release}</strong></div>
                  <div><span>Runtime</span><strong>{movie.runtime}</strong></div>
                  <div><span>Rating</span><strong>{movie.rating}</strong></div>
                  <div><span>Genre</span><strong>{movie.genre}</strong></div>
                  <div><span>Budget</span><strong>{movie.budget}</strong></div>
                  <div><span>Worldwide Box Office</span><strong>{movie.boxOffice}</strong></div>
                </div>

                {(cast.length > 0 || directors.length > 0) && (
                  <div className={styles.castSection}>
                    <div className={styles.castSectionHead}><p className={styles.eyebrow}>CAST & CREW</p><h3>Who's in it</h3></div>
                    <div className={styles.castGrid}>
                      {directors.map((c,i) => (
                        <Link key={'d'+(c.id || i)} href={'/person/' + c.person.slug} className={styles.castCard}>
                          <div className={styles.castPhotoWrap}>
                            {c.person.photoUrl ? <img src={c.person.photoUrl} alt="" /> : <span>{c.person.name?.charAt(0) || '?'}</span>}
                          </div>
                          <span className={styles.castName}>{c.person.name}</span>
                          <small>Director</small>
                        </Link>
                      ))}
                      {cast.map((c,i) => (
                        <Link key={c.id || i} href={'/person/' + c.person.slug} className={styles.castCard}>
                          <div className={styles.castPhotoWrap}>
                            {c.person.photoUrl ? <img src={c.person.photoUrl} alt="" /> : <span>{c.person.name?.charAt(0) || '?'}</span>}
                          </div>
                          <span className={styles.castName}>{c.person.name}</span>
                          <small>{c.characterName || 'Cast'}</small>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <div className={styles.movieSynopsis}><span>Synopsis</span><p>{movie.overview}</p></div>

                {movie.providers.length > 0 && (
                  <div className={styles.watchSection}>
                    <div><p className={styles.eyebrow}>WHERE TO WATCH</p><h3>Watch it your way</h3></div>
                    <div className={styles.providerGrid}>
                      {movie.providers.map((p,i) => <a key={p.id || i} href={p.url || '#'} target="_blank" rel="noreferrer"><span>{p.name}</span><small>{p.kind || 'Watch'}</small></a>)}
                    </div>
                  </div>
                )}
              </>
            )}

            {infoTab === 'nerds' && (
              <div className={styles.infoGrid}>
                <div><span>Original Language</span><strong>{rawMovie.originalLanguage || '—'}</strong></div>
                <div><span>Source</span><strong>{rawMovie.sourceProvider || '—'}</strong></div>
                <div><span>TMDB ID</span><strong>{rawMovie.tmdbId || '—'}</strong></div>
                <div><span>Trailer</span><strong>{movie.trailerUrl ? 'Available' : 'Search link available'}</strong></div>
                <div><span>Production Companies</span><strong>{Array.isArray(rawMovie.productionCompanies) ? rawMovie.productionCompanies.map(x => x.name || x).join(', ') : '—'}</strong></div>
              </div>
            )}
          </section>

          <section className={styles.deliveredPanel} id="hype-test">
            <div><p className={styles.eyebrow}>THE HYPESCORE TEST</p><h2>Did it deliver?</h2></div>
            <div className={styles.deliveredMain}><strong>{hypeDelivered === null ? '—' : (hypeDelivered >= 0 ? '+' : '') + hypeDelivered}</strong><span>{hypeDelivered === null ? 'Waiting for post-watch audience ratings' : 'points vs. pre-release hype'}</span></div>
            <small>{hypeDelivered === null ? 'Hype Delivered appears once enough audience ratings are available.' : hypeDelivered >= 5 ? 'Audience reaction landed above the expectation set before release.' : hypeDelivered <= -5 ? 'Audience reaction landed below the expectation set before release.' : 'Audience reaction landed close to the expectation set before release.'}</small>
          </section>
        </div>
      </main>

      {trailerOpen && (
        <div className={styles.trailerOverlay} onMouseDown={e => { if (e.target === e.currentTarget) setTrailerOpen(false); }}>
          <div className={styles.trailerModal}>
            <div className={styles.trailerHeader}><div><p className={styles.eyebrow}>OFFICIAL TRAILER</p><h2>{movie.title}</h2></div><button className={styles.trailerClose} aria-label="Close trailer" onClick={() => setTrailerOpen(false)}>×</button></div>
            <div className={styles.trailerFrame}>
              {trailerId ? (
                <iframe src={'https://www.youtube.com/embed/' + trailerId + '?autoplay=1&rel=0'} title={movie.title + ' trailer'} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
              ) : (
                <div className={styles.trailerUnavailable}><strong>Trailer coming soon</strong><span>We're still adding the official trailer for this movie.</span></div>
              )}
            </div>
          </div>
        </div>
      )}

      <footer className={styles.footer}>
        <div><Link href="/" className={styles.brand}><span className={styles.brandMark}>H</span><span>Hype<span>Score</span></span></Link><p>Track the hype. See what delivered.</p></div>
        <p>© 2026 HypeScore</p>
      </footer>
    </div>
  );
}
