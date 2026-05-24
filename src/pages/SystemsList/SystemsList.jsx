import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../../components/PageTransition/PageTransition';
import systems from '../../data/systems';
import styles from './SystemsList.module.css';

export default function SystemsList() {
  return (
    <PageTransition>
      <div className={styles.page}>
        <div className="container">
          <div className={styles.hero}>
            <h1 className={styles.title}><span>恒星系统</span></h1>
            <p className={styles.subtitle}>
              探索已知的系外行星系统——从我们所在的太阳系出发，了解宇宙中形形色色的恒星家族
            </p>
          </div>

          <div className={styles.grid}>
            {systems.map((sys, i) => (
              <motion.div
                key={sys.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <Link to={`/system/${sys.id}`} className={styles.card} style={{ '--accent-color': sys.starType.includes('G') ? '#fbbf24' : sys.starType.includes('M') ? '#ef4444' : '#3b82f6' }}>
                  <div className={styles.cardBanner} />
                  <div className={styles.nameRow}>
                    <span className={styles.name}>{sys.name}</span>
                    <span className={styles.nameEn}>{sys.nameEn}</span>
                  </div>
                  <div className={styles.meta}>
                    <span className={styles.tag}>{sys.type}</span>
                    <span className={styles.dist}>{sys.distanceFromEarth}</span>
                  </div>
                  <p className={styles.desc}>{sys.description}</p>
                  <div className={styles.statsRow}>
                    <span>主恒星：{sys.starType}</span>
                    {sys.planetCount && <span>已知行星：{sys.planetCount} 颗</span>}
                  </div>
                  <span className={styles.arrow}>&rarr;</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
