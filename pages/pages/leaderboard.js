import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Leaderboard() {
  const topMovies = [
    { title: 'Deadpool & Wolverine', hype: 89 },
    { title: 'Dune: Part Two', hype: 82 },
    { title: 'Joker: Folie à Deux', hype: 77 },
    { title: 'Gladiator II', hype: 71 },
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>HypeScore | Leaderboard</title>
        <meta name="description" content="Top hyped movies ranked by HypeScore votes" />
      </Head>

      <h1 className={styles.title}>🔥 Top Hyped Movies</h1>

      <div style={{ width: '100%', maxWidth: '600px' }}>
        {topMovies.map((movie, i) => (
          <div key={i} className={styles.card}>
            <h2>{i + 1}. {movie.title}</h2>
            <p style={{ fontSize: '1.5rem', color: '#facc15' }}>Hype Score: {movie.hype}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}
