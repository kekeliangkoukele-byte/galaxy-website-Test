import { heroContent } from '../../data/content';
import styles from './Hero.module.css';

export default function Hero() {
  const scrollToOverview = () => {
    document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className={styles.hero}>
      {/* Floating gradient orbs */}
      <div className={`${styles.orb} ${styles.orb1}`} />
      <div className={`${styles.orb} ${styles.orb2}`} />
      <div className={`${styles.orb} ${styles.orb3}`} />

      {/* CSS galaxy swirl */}
      <svg className={styles.galaxySvg} viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.6">
          {Array.from({ length: 6 }, (_, i) => (
            <ellipse
              key={i}
              cx="400" cy="400"
              rx={120 + i * 55}
              ry={80 + i * 45}
              transform={`rotate(${i * 25}, 400, 400)`}
            />
          ))}
        </g>
        <ellipse cx="400" cy="400" rx="60" ry="30" fill="#f59e0b" opacity="0.15" />
      </svg>

      <div className={styles.content}>
        <span className={styles.badge}>Explore the Cosmos</span>
        <h1 className={styles.title}>{heroContent.title}</h1>
        <p className={styles.subtitle}>{heroContent.subtitle}</p>
        <button className={styles.cta} onClick={scrollToOverview}>
          {heroContent.cta}
          <span className={styles.arrow}>&darr;</span>
        </button>
      </div>

      <div className={styles.scrollHint}>
        <span />
        向下滚动
      </div>
    </section>
  );
}
