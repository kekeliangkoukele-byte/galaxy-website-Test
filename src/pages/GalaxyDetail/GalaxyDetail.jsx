import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../../components/PageTransition/PageTransition';
import CosmicBackground from '../../components/CosmicBackground/CosmicBackground';
import LazyImage from '../../components/LazyImage/LazyImage';
import { useCompare } from '../../contexts/CompareContext';
import galaxies from '../../data/galaxies';
import systems from '../../data/systems';
import styles from './GalaxyDetail.module.css';

export default function GalaxyDetail() {
  const { galaxyId } = useParams();
  const galaxy = galaxies.find((g) => g.id === galaxyId);
  const { compareGalaxies, addGalaxy, removeGalaxy } = useCompare();
  const isCompared = compareGalaxies.some((g) => g.id === galaxy?.id);

  if (!galaxy) {
    return (
      <PageTransition>
        <div className={styles.page}>
          <div className="container">
            <Link to="/galaxies" className={styles.backLink}>&larr; 返回星系列表</Link>
            <h1 style={{ color: '#fff' }}>星系未找到</h1>
          </div>
        </div>
      </PageTransition>
    );
  }

  const relatedSystems = systems.filter((s) => s.galaxyId === galaxy.id);

  return (
    <PageTransition>
      <div className={styles.page} style={{ '--accent-color': galaxy.color }}>
        <div className="container">
          <Link to="/galaxies" className={styles.backLink}>&larr; 返回星系列表</Link>

          {/* Hero: cosmic background with overlay text */}
          <CosmicBackground
            type={galaxy.type}
            imageUrl={galaxy.image?.url}
            height={400}
          >
            <div className={styles.heroContent}>
              <div className={styles.heroHeader}>
                <h1 className={styles.heroName}>{galaxy.name}</h1>
                <span className={styles.heroNameEn}>{galaxy.nameEn}</span>
              </div>
              <div className={styles.heroTags}>
                <span className={styles.typeTag}>{galaxy.type}</span>
                <button
                  className={`${styles.compareBtn} ${isCompared ? styles.compared : ''}`}
                  onClick={() => isCompared ? removeGalaxy(galaxy.id) : addGalaxy(galaxy)}
                >
                  {isCompared ? '已加入对比' : '加入对比'}
                </button>
              </div>
            </div>
          </CosmicBackground>

          <p className={styles.description}>{galaxy.description}</p>

          {/* Stats */}
          <div className={styles.statsGrid}>
            {[
              { label: '类型', value: galaxy.type },
              { label: '所属星系群', value: galaxy.group },
              { label: '距离', value: galaxy.distance },
              { label: '直径', value: galaxy.diameter },
              { label: '恒星数量', value: galaxy.starCount },
              { label: '年龄', value: galaxy.age },
              { label: '质量', value: galaxy.mass },
            ].map((stat, i) => (
              <motion.div key={stat.label} className={styles.statCard}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}>
                <span className={styles.statLabel}>{stat.label}</span>
                <span className={styles.statValue}>{stat.value}</span>
              </motion.div>
            ))}
          </div>

          {/* Features */}
          {galaxy.features && galaxy.features.length > 0 && (
            <>
              <h2 className={styles.sectionTitle}>主要特征</h2>
              <ul className={styles.featureList}>
                {galaxy.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </>
          )}

          {/* Notable objects */}
          {galaxy.notableObjects && galaxy.notableObjects.length > 0 && (
            <>
              <h2 className={styles.sectionTitle}>代表性天体</h2>
              <div className={styles.tagCloud}>
                {galaxy.notableObjects.map((obj, i) => (
                  <span key={i} className={styles.notableTag}>{obj}</span>
                ))}
              </div>
            </>
          )}

          {/* Structure */}
          <h2 className={styles.sectionTitle}>星系结构</h2>
          <div className={styles.structureGrid}>
            {Object.entries(galaxy.structure).map(([key, desc], i) => {
              const labels = { core: '核心（核球）', disk: '星系盘', arms: '旋臂', halo: '星系晕' };
              return (
                <motion.div key={key} className={styles.structureCard}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.06 }}>
                  <div className={styles.structureLabel}>{labels[key] || key}</div>
                  <p className={styles.structureDesc}>{desc}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Image reference */}
          {galaxy.image && (
            <div style={{ marginTop: 32 }}>
              <LazyImage
                src={galaxy.image.url}
                alt={galaxy.name}
                caption={galaxy.image.caption}
                credit={galaxy.image.credit}
                source={galaxy.image.source}
              />
            </div>
          )}

          {/* Note */}
          {galaxy.note && <div className={styles.note}>{galaxy.note}</div>}

          {/* Related systems */}
          {relatedSystems.length > 0 && (
            <>
              <h2 className={styles.sectionTitle}>已知恒星系统</h2>
              <div className={styles.systemsGrid}>
                {relatedSystems.map((sys, i) => (
                  <motion.div key={sys.id}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.06 }}>
                    <Link to={`/system/${sys.id}`} className={styles.systemCard}>
                      <div className={styles.systemName}>{sys.name}</div>
                      <span className={styles.systemNameEn}>{sys.nameEn}</span>
                      <div className={styles.systemType}>{sys.type}</div>
                      <p className={styles.systemDesc}>{sys.description}</p>
                      <span className={styles.systemArrow}>查看详情 &rarr;</span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {relatedSystems.length === 0 && galaxy.hasSystems === false && (
            <div className={styles.noData}>
              该星系暂无已确认的恒星系统数据，天文学家正在持续观测中。
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
