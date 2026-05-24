import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../../components/PageTransition/PageTransition';
import deepSkyObjects from '../../data/deepSkyObjects';
import styles from './DeepSkyList.module.css';

const TYPES = ['全部', '发射星云', '行星状星云', '超新星遗迹', '疏散星团', '球状星团', '螺旋星系'];

export default function DeepSkyList() {
  const [typeFilter, setTypeFilter] = useState('全部');

  const filtered = useMemo(() => {
    if (typeFilter === '全部') return deepSkyObjects;
    return deepSkyObjects.filter((o) => o.type.includes(typeFilter));
  }, [typeFilter]);

  return (
    <PageTransition>
      <div className={styles.page}>
        <div className="container">
          <div className={styles.hero}>
            <h1 className={styles.title}><span>深空天体目录</span></h1>
            <p className={styles.subtitle}>
              探索梅西耶天体与著名深空天体——星云、星团和星系中的宇宙奇观
            </p>
          </div>

          <div className={styles.filters}>
            {TYPES.map((t) => (
              <button
                key={t}
                className={`${styles.filterBtn} ${typeFilter === t ? styles.active : ''}`}
                onClick={() => setTypeFilter(t)}
              >
                {t}
              </button>
            ))}
          </div>

          <div className={styles.grid}>
            {filtered.map((obj, i) => (
              <motion.div
                key={obj.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link to={`/deepsky/${obj.id}`} className={styles.card} style={{ '--accent-color': obj.color }}>
                  <div className={styles.cardBanner} />
                  <div className={styles.header}>
                    <span className={styles.name}>{obj.name}</span>
                    <span className={styles.catalog}>{obj.catalog}</span>
                  </div>
                  <div className={styles.tags}>
                    <span className={styles.typeTag}>{obj.type}</span>
                    <span className={styles.constTag}>{obj.constellation}</span>
                  </div>
                  <p className={styles.desc}>{obj.description}</p>
                  <div className={styles.meta}>
                    <span>距离：{obj.distance}</span>
                    <span>大小：{obj.diameter}</span>
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
