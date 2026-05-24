import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import styles from './ExploreInfoPanel.module.css';

const categoryLabels = {
  galaxy: '星系',
  deepsky: '深空天体',
  star_system: '恒星系统',
  planet: '行星',
};

export default function ExploreInfoPanel({ object, onClose }) {
  if (!object) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={object.id}
        className={styles.panel}
        initial={{ x: 380, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 380, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 24 }}
      >
        <button className={styles.closeBtn} onClick={onClose} aria-label="关闭">
          &times;
        </button>

        <div className={styles.header}>
          <span
            className={styles.categoryTag}
            style={{ '--tag-color': object.color }}
          >
            {categoryLabels[object.category] || object.category}
          </span>
          <h3 className={styles.name}>{object.name}</h3>
          <p className={styles.nameEn}>{object.nameEn}</p>
        </div>

        {object.type && <p className={styles.type}>{object.type}</p>}

        <div className={styles.stats}>
          {object.displaySize && (
            <div className={styles.stat}>
              <span className={styles.statValue}>{object.displaySize}</span>
              <span className={styles.statLabel}>
                {object.category === 'planet' ? '半径' : '直径'}
              </span>
            </div>
          )}
        </div>

        {object.snippet && <p className={styles.snippet}>{object.snippet}</p>}

        <Link to={object.route} className={styles.detailLink} onClick={onClose}>
          查看详情 &rarr;
        </Link>
      </motion.div>
    </AnimatePresence>
  );
}
