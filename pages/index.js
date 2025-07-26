
import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>HypeScore</title>
        <meta name="description" content="Track hype scores for movies, TV shows, and games" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to HypeScore.net</h1>
        <p className={styles.description}>See if it's worth the hype.</p>
        <div className={styles.card}>
          <h2>Deadpool & Wolverine (2024)</h2>
          <img src="/poster.jpg" alt="Movie Poster" width="200" />
          <p>🎬 Are you going to see it?</p>
          <button>Yes!</button>
          <button>Maybe</button>
          <button>No</button>
        </div>
      </main>
    </div>
  )
}
