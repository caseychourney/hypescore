// pages/index.js
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useState } from 'react';
import Link from 'next/link';
export default function Home() {
  const [votes, setVotes] = useState({ yes: 12, maybe: 6, no: 2 });

  const totalVotes = votes.yes + votes.maybe + votes.no;

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
        <div className={styles.card}>
          <h2>🎬 Deadpool & Wolverine (2024)</h2>
          <img src="/poster.jpg" alt="Deadpool Poster" className={styles.poster} />
          <p>Is this going to be the movie of the year?</p>

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
      </main>

      <footer className={styles.footer}>
        Built with Next.js • Domain: hypescore.net
      </footer>
    </div>
  );
}
