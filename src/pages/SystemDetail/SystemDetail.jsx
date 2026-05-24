import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../../components/PageTransition/PageTransition';
import systems from '../../data/systems';
import planets from '../../data/planets';
import galaxies from '../../data/galaxies';
import styles from './SystemDetail.module.css';

export default function SystemDetail() {
  const { systemId } = useParams();
  const system = systems.find((s) => s.id === systemId);

  if (!system) {
    return (
      <PageTransition>
        <div className={styles.page}>
          <div className="container">
            <Link to="/galaxies" className={styles.backLink}>&larr; 返回星系列表</Link>
            <h1 style={{ color: '#fff' }}>恒星系统未找到</h1>
          </div>
        </div>
      </PageTransition>
    );
  }

  const relatedPlanets = planets.filter((p) => p.systemId === system.id);
  const parentGalaxy = galaxies.find((g) => g.id === system.galaxyId);

  return (
    <PageTransition>
      <div className={styles.page}>
        <div className="container">
          <Link
            to={parentGalaxy ? `/galaxy/${parentGalaxy.id}` : '/galaxies'}
            className={styles.backLink}
          >
            &larr; {parentGalaxy ? `返回 ${parentGalaxy.name}` : '返回星系列表'}
          </Link>

          {/* Header */}
          <div className={styles.header}>
            <div className={styles.nameRow}>
              <h1 className={styles.name}>{system.name}</h1>
              <span className={styles.nameEn}>{system.nameEn}</span>
            </div>
            <span className={styles.typeTag}>{system.type}</span>
            <p className={styles.description}>{system.description}</p>
          </div>

          {/* Star info */}
          <motion.div
            className={styles.starCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <div className={styles.starName}>主恒星：{system.star.name}</div>
            <div className={styles.starGrid}>
              {Object.entries(system.star)
                .filter(([k]) => k !== 'name')
                .map(([key, val]) => (
                  <div key={key} className={styles.starStat}>
                    <span className={styles.starStatLabel}>
                      {key === 'type' ? '光谱类型' : key === 'mass' ? '质量' : key === 'temperature' ? '温度' : key === 'age' ? '年龄' : key}
                    </span>
                    <span className={styles.starStatValue}>{val}</span>
                  </div>
                ))}
            </div>
          </motion.div>

          {/* Position */}
          {system.position && (
            <>
              <h2 className={styles.sectionTitle}>在银河系中的位置</h2>
              <div className={styles.positionGrid}>
                {Object.entries(system.position).map(([key, val], i) => (
                  <motion.div
                    key={key}
                    className={styles.positionCard}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.06 }}
                  >
                    <span className={styles.positionLabel}>
                      {key === 'arm' ? '所在旋臂' : key === 'distanceToCore' ? '距银心距离' : key === 'orbitalPeriod' ? '绕银心公转周期' : key === 'orbitalSpeed' ? '公转速度' : key}
                    </span>
                    <span className={styles.positionValue}>{val}</span>
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {/* Note */}
          {system.note && <div className={styles.note}>{system.note}</div>}

          {/* Planets */}
          {relatedPlanets.length > 0 && (
            <>
              <h2 className={styles.sectionTitle}>
                行星
                {system.planetCount && <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 400, marginLeft: 8 }}>（共 {system.planetCount} 颗确认行星）</span>}
              </h2>
              <div className={styles.planetGrid}>
                {relatedPlanets.map((planet, i) => (
                  <motion.div
                    key={planet.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + i * 0.06 }}
                  >
                    <Link
                      to={`/planet/${planet.id}`}
                      className={styles.planetCard}
                      style={{ '--planet-color': planet.color }}
                    >
                      <div className={styles.planetAccent} />
                      <div className={styles.planetName}>{planet.name}</div>
                      <span className={styles.planetNameEn}>{planet.nameEn}</span>
                      <div className={styles.planetType}>{planet.type}</div>
                      <p className={styles.planetDesc}>{planet.description}</p>
                      <span className={styles.planetArrow}>查看详情 &rarr;</span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {relatedPlanets.length === 0 && system.planetCount === null && (
            <div className={styles.noData}>
              该系统的行星信息仍在观测确认中。
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
