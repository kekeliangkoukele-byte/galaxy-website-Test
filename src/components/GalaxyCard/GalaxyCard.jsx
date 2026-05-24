import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './GalaxyCard.module.css';

export default function GalaxyCard({ galaxy, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
    >
      <Link
        to={`/galaxy/${galaxy.id}`}
        className={styles.card}
        style={{
          '--accent-color': galaxy.color,
          '--glow-color': galaxy.color ? `${galaxy.color}22` : undefined,
        }}
      >
        <div className={styles.cardBanner} />
        <div className={styles.header}>
          <span className={styles.name}>{galaxy.name}</span>
          <span className={styles.nameEn}>{galaxy.nameEn}</span>
        </div>
        <div className={styles.typeTag}>{galaxy.type}</div>
        <p className={styles.desc}>{galaxy.description}</p>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>距离</span>
            <span className={styles.statValue}>{galaxy.distance}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>直径</span>
            <span className={styles.statValue}>{galaxy.diameter}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>恒星数量</span>
            <span className={styles.statValue}>{galaxy.starCount}</span>
          </div>
        </div>
        <span className={styles.arrow}>&rarr;</span>
      </Link>
    </motion.div>
  );
}
