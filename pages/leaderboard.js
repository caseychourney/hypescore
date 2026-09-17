import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

const rows = [
  ['Superman', 92, '+8', 'New trailer'],
  ['Deadpool & Wolverine', 89, '+4', 'New clip'],
  ['The Fantastic Four: First Steps', 88, '+5', 'Casting news'],
  ['Dune: Part Two', 86, '-2', 'Audience reviews'],
];

export default function Leaderboard() {
  return (
    <div className={styles.site}>
      <Head>
        <title>HypeScore — Trending</title>
        <meta name="description" content="The movies gaining and losing the most hype." />
      </Head>
      <header className={styles.nav}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.brand}><span className={styles.brandMark}>H</span><span>Hype<span>Score</span></span></Link>
          <Link href="/" className={styles.textLink}>← Back to Discover</Link>
        </div>
      </header>
      <main className={styles.section}>
        <p className={styles.eyebrow}>LIVE HYPE</p>
        <h1 style={{fontSize:'clamp(42px,6vw,70px)',letterSpacing:'-4px',margin:'0 0 12px'}}>Trending movies.</h1>
        <p style={{color:'#858d9e',maxWidth:620,lineHeight:1.7,marginBottom:35}}>A snapshot of the movies getting the most attention right now. HypeScore changes as the conversation changes.</p>
        <div style={{border:'1px solid rgba(255,255,255,.09)',borderRadius:20,overflow:'hidden',background:'#11141b'}}>
          {rows.map((row,i) => (
            <div key={row[0]} style={{display:'grid',gridTemplateColumns:'55px 1fr 100px 130px',alignItems:'center',gap:18,padding:'22px 24px',borderBottom:i===rows.length-1?'0':'1px solid rgba(255,255,255,.07)'}}>
              <strong style={{color:'#676f80'}}>0{i+1}</strong>
              <div><strong style={{fontSize:15}}>{row[0]}</strong><div style={{color:'#626a7a',fontSize:10,marginTop:5}}>{row[3]}</div></div>
              <strong style={{fontSize:25}}>{row[1]}</strong>
              <span style={{color:row[2].startsWith('+')?'#6ee7a0':'#ff8fae',fontSize:11}}>{row[2]} this week</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
