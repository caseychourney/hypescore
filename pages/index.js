// pages/index.js
import Head from 'next/head';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [movie, setMovie] = useState(null);
  const [votes, setVotes] = useState({ yes: 0, maybe: 0, no: 0 });

  const totalVotes = votes.yes + votes.maybe + votes.no;

  useEffect(() => {
    async function fetchMovie() {
      const res = await fetch(
        `https://www.omdbapi.com/?t=Deadpool+%26+Wolverine&y=2024&apikey=15e40a81`
      );
      const data = await res.json();
      console.log('🎬 Fetched movie:', data); // 👈 This will show us what’s returned
      setMovie(data);
    }

    fetchMovie();
  }, []);

  const handleVote = (type) => {
    console.log(`🔥 You clicked: ${type}`); // 👈 Just to confirm click works
    setVotes((prev) => ({
      ...prev,
      [type]: prev[type] + 1
    }));
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>HypeScore.net</title>
        <meta name="description" content="See if it's worth the hype." />
      </Head>

      <header className={styles.header}>
        <h1>Welcome to HypeScore.net</h1>
        <p>See if it's worth the hype.</p>
      </header>

      <main className={styles.main}>
        {movie ? (
          <div className={styles.card}>
            <h2>{movie.Title} ({movie.Year})</h2>

            {movie.Poster && movie.Poster !== 'N/A' ? (
              <img
                src={movie.Poster}
                alt="Movie Poster"
                className={styles.poster}
              />
            ) : (
              <p>No poster available</p>
            )}

            <p>🎥 Are you going to see it?</p>

            <div className={styles.buttons}>
              <button onClick={() => handleVote('yes')}>Yes!</button>
              <button onClick={() => handleVote('maybe')}>Maybe</button>
              <button onClick={() => handleVote('no')}>No</button>
            </div>

            <div className={styles.results}>
              <div className={styles.barContainer}>
                <div
                  className={styles.yesBar}
                  style={{ width: `${(votes.yes / totalVotes) * 100 || 0}%` }}
                />
                <div
                  className={styles.maybeBar}
                  style={{ width: `${(votes.maybe / totalVotes) * 100 || 0}%` }}
                />
                <div
                  className={styles.noBar}
                  style={{ width: `${(votes.no / totalVotes) * 100 || 0}%` }}
                />
              </div>
              <p>
                🔥 {votes.yes} Hype | 🤔 {votes.maybe} Maybe | 💤 {votes.no} Nah
              </p>
            </div>
          </div>
        ) : (
          <p>Loading movie...</p>
        )}
      </main>

      <footer className={styles.footer}>
        <p>Made with ❤️ by Casey</p>
      </footer>
    </div>
  );
}

