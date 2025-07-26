// pages/index.js
import Head from 'next/head';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import Link from 'next/link';

export default function Home() {
  const [movie, setMovie] = useState(null);
  const [votes, setVotes] = useState({ yes: 12, maybe: 6, no: 2 });

  const totalVotes = votes.yes + votes.maybe + votes.no;

  useEffect(() => {
    async function fetchMovie() {
      const res = await fetch(
        `https://www.omdbapi.com/?t=Deadpool+%26+Wolverine&y=2024&apikey=15e40a81`
      );
      const data = await res.json();
      setMovie(data);
    }
    fetchMovie();
  }, []);

  const handleVote = (type) => {
    setVotes({ ...votes, [type]: votes[type] + 1 });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>HypeScore</title>
        <meta name="description" content="Rate and review the latest movies, shows, and games with live Hype Scores." />
      </Head>

      <header className={styles.header}>
        <h1>🔥 HypeScore</h1>
        <p>Track what’s worth watching. Vote. Discuss. Decide.</p>
      </header>

      <main className={styles.main}> 
        {movie ? (
          <div className={styles.card}>
            <h2>🎬 {movie.Title} ({movie.Year})</h2>
            {movie.Poster && movie.Poster !== 'N/A' ? (
              <img src={movie.Poster} alt={`${movie.Title} Poster`} style={{ width: '300px', borderRadius: '8px' }} />
            ) : (
              <p>No poster available</p>
            )}

            <p>{movie.Plot}</p>

            <div className={styles.buttons}>
              <button onClick={() => handleVote('yes')}>🔥 Hype</button>
              <button onClick={() => handleVote('maybe')}>🤔 Maybe</button>
              <button onClick={() => handleVote('no')}>💤 Nah</button>
            </div>

            <div className={styles.results}>
              <div className={styles.barContainer}>
                <div className={styles.yesBar} style={{ width: `${(votes.yes / totalVotes) * 100}%` }} />
                <div className={styles.maybeBar} style={{ width: `${(votes.maybe / totalVotes) * 100}%` }} />
                <div className={styles.noBar} style={{ width: `${(votes.no / totalVotes) * 100}%` }} />
              </div>
              <p>
                🔥 {votes.yes} Hype | 🤔 {votes.maybe} Maybe | 💤 {votes.no} Nah
              </p>
            </div>
          </div>
        ) : (
          <p>Loading movie data...</p>
        )}
      </main>

      <footer className={styles.footer}>
        <p>Built with Next.js • Domain: hypescore.net</p>
        <p style={{ marginTop: '1rem' }}>
          <Link href="/leaderboard">🎬 View Leaderboard</Link>
        </p>
      </footer>
    </div>
  );
}


