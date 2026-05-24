import { Link } from 'react-router-dom';
import { heroContent } from '../../data/content';
import styles from './Hero.module.css';

export default function Hero() {
  const scrollToOverview = () => {
    document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className={styles.hero}>
      {/* Cosmic depth orbs */}
      <div className={`${styles.orb} ${styles.orb1}`} />
      <div className={`${styles.orb} ${styles.orb2}`} />
      <div className={`${styles.orb} ${styles.orb3}`} />
      <div className={`${styles.orb} ${styles.orb4}`} />

      {/* Galaxy swirl */}
      <svg className={styles.galaxySvg} viewBox="0 0 900 900" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="coreGlow" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#f5a623" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#f5a623" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g fill="none" stroke="#8b5cf6" strokeWidth="1.2" opacity="0.5">
          {Array.from({ length: 7 }, (_, i) => (
            <ellipse
              key={i}
              cx="450" cy="450"
              rx={100 + i * 60}
              ry={65 + i * 48}
              transform={`rotate(${i * 22}, 450, 450)`}
            />
          ))}
        </g>
        <circle cx="450" cy="450" r="80" fill="url(#coreGlow)" />
      </svg>

      <div className={styles.content}>
        <span className={styles.badge}>Explore the Cosmos</span>
        <h1 className={styles.title}>{heroContent.title}</h1>
        <p className={styles.subtitle}>{heroContent.subtitle}</p>
        <div className={styles.ctaGroup}>
          <button className={styles.cta} onClick={scrollToOverview}>
            {heroContent.cta}
            <span className={styles.arrow}>&darr;</span>
          </button>
          <Link to="/galaxies" className={styles.ctaSecondary}>
            浏览宇宙星系馆 &rarr;
          </Link>
          <Link to="/explore" className={styles.ctaTertiary}>
            探索宇宙尺度 &rarr;
          </Link>
        </div>
      </div>

      <div className={styles.scrollHint}>
        <span />
        向下滚动
      </div>
    </section>
  );
}
