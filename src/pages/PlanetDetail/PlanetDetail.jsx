import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../../components/PageTransition/PageTransition';
import PlanetScene from '../../components/PlanetScene/PlanetScene';
import LazyImage from '../../components/LazyImage/LazyImage';
import { useCompare } from '../../contexts/CompareContext';
import planets from '../../data/planets';
import systems from '../../data/systems';
import galaxies from '../../data/galaxies';
import styles from './PlanetDetail.module.css';

export default function PlanetDetail() {
  const { planetId } = useParams();
  const planet = planets.find((p) => p.id === planetId);
  const { comparePlanets, addPlanet, removePlanet } = useCompare();

  if (!planet) {
    return (
      <PageTransition>
        <div className={styles.page}>
          <div className="container">
            <Link to="/systems" className={styles.backLink}>&larr; 返回恒星系统</Link>
            <h1 style={{ color: '#fff' }}>行星未找到</h1>
          </div>
        </div>
      </PageTransition>
    );
  }

  const parentSystem = systems.find((s) => s.id === planet.systemId);
  const parentGalaxy = parentSystem ? galaxies.find((g) => g.id === parentSystem.galaxyId) : null;
  const isCompared = comparePlanets.some((p) => p.id === planet.id);

  const statPairs = [
    { label: '类型', value: planet.type },
    { label: '半径', value: planet.radius },
    { label: '质量', value: planet.mass },
    { label: '距恒星距离', value: planet.distanceFromStar },
    { label: '公转周期', value: planet.orbitalPeriod },
    { label: '温度', value: planet.temperature },
    { label: '宜居带', value: planet.habitableZone === true ? '是 (位于宜居带内)' : planet.habitableZone === false ? '否' : '未知' },
  ];

  return (
    <PageTransition>
      <div className={styles.page} style={{ '--planet-color': planet.color }}>
        <div className="container">
          <Link to={parentSystem ? `/system/${parentSystem.id}` : '/systems'} className={styles.backLink}>
            &larr; {parentSystem ? `返回 ${parentSystem.name}` : '返回恒星系统'}
          </Link>

          <div className={styles.layout}>
            <div>
              <div className={styles.header}>
                <div className={styles.nameRow}>
                  <h1 className={styles.name}>{planet.name}</h1>
                  <span className={styles.nameEn}>{planet.nameEn}</span>
                </div>
                <span className={styles.typeTag}>{planet.type}</span>
                <p className={styles.description}>{planet.description}</p>
              </div>

              {planet.highlights && (
                <div className={styles.highlights}>
                  <span className={styles.highlightLabel}>观测亮点</span>
                  <p>{planet.highlights}</p>
                </div>
              )}

              <div className={styles.statsSection}>
                <h2 className={styles.sectionTitle}>物理参数</h2>
                <div className={styles.statsGrid}>
                  {statPairs.map((stat, i) => (
                    <motion.div key={stat.label} className={styles.statCard}
                      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.15 + i * 0.04 }}>
                      <span className={styles.statLabel}>{stat.label}</span>
                      <span className={styles.statValue}>{stat.value}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className={styles.actions}>
                <button
                  className={`${styles.compareBtn} ${isCompared ? styles.compared : ''}`}
                  onClick={() => isCompared ? removePlanet(planet.id) : addPlanet(planet)}
                >
                  {isCompared ? '已加入对比' : '加入对比'}
                </button>
              </div>

              <div className={styles.relatedLinks}>
                {parentSystem && (
                  <Link to={`/system/${parentSystem.id}`} className={styles.relatedLink}>
                    所属恒星系统：{parentSystem.name}
                  </Link>
                )}
                {parentGalaxy && (
                  <Link to={`/galaxy/${parentGalaxy.id}`} className={styles.relatedLink}>
                    所在星系：{parentGalaxy.name}
                  </Link>
                )}
              </div>

              {planet.source && (
                <p className={styles.source}>数据来源：{planet.source}</p>
              )}
            </div>

            {/* Right column */}
            <div className={styles.sidebar}>
              <PlanetScene color={planet.color} name={planet.name} />
              <div className={styles.visualName}>{planet.name}</div>
              <div className={styles.visualSystem}>{parentSystem ? parentSystem.name : '未知系统'}</div>

              {planet.image && (
                <div style={{ marginTop: 24 }}>
                  <LazyImage src={planet.image?.url} alt={planet.name} caption={planet.image?.caption} credit={planet.image?.credit} source={planet.image?.source} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
