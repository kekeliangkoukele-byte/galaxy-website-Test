import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../../components/PageTransition/PageTransition';
import { useCompare } from '../../contexts/CompareContext';
import styles from './Compare.module.css';

function GalaxyCompareTable({ galaxies, onRemove }) {
  if (galaxies.length === 0) {
    return (
      <div className={styles.emptyState}>
        <span className={styles.emptyIcon}>&#127752;</span>
        <p>尚未添加星系到对比列表</p>
        <Link to="/galaxies" className={styles.browseLink}>浏览星系列表 &rarr;</Link>
      </div>
    );
  }

  const rows = [
    { label: '类型', key: 'type' },
    { label: '所属星系群', key: 'group' },
    { label: '距离', key: 'distance' },
    { label: '直径', key: 'diameter' },
    { label: '恒星数量', key: 'starCount' },
    { label: '年龄', key: 'age' },
    { label: '质量', key: 'mass' },
  ];

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.rowLabel}>属性</th>
            {galaxies.map((g) => (
              <th key={g.id}>
                <div className={styles.colHeader}>
                  <span className={styles.colDot} style={{ background: g.color }} />
                  <span>{g.name}</span>
                  <button className={styles.removeBtn} onClick={() => onRemove(g.id)} title="移除">&times;</button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key}>
              <td className={styles.rowLabel}>{row.label}</td>
              {galaxies.map((g) => (
                <td key={g.id}>{g[row.key] || '-'}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PlanetCompareTable({ planets, onRemove }) {
  if (planets.length === 0) {
    return (
      <div className={styles.emptyState}>
        <span className={styles.emptyIcon}>&#127757;</span>
        <p>尚未添加行星到对比列表</p>
        <Link to="/systems" className={styles.browseLink}>浏览恒星系统 &rarr;</Link>
      </div>
    );
  }

  const rows = [
    { label: '类型', key: 'type' },
    { label: '所属系统', key: 'systemName' },
    { label: '半径', key: 'radius' },
    { label: '质量', key: 'mass' },
    { label: '距恒星距离', key: 'distanceFromStar' },
    { label: '公转周期', key: 'orbitalPeriod' },
    { label: '温度', key: 'temperature' },
    {
      label: '宜居带', key: 'habitableZone',
      format: (v) => v === true ? '是' : v === false ? '否' : '未知',
    },
  ];

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.rowLabel}>属性</th>
            {planets.map((p) => (
              <th key={p.id}>
                <div className={styles.colHeader}>
                  <span className={styles.colDot} style={{ background: p.color }} />
                  <span>{p.name}</span>
                  <button className={styles.removeBtn} onClick={() => onRemove(p.id)} title="移除">&times;</button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key}>
              <td className={styles.rowLabel}>{row.label}</td>
              {planets.map((p) => (
                <td key={p.id}>{row.format ? row.format(p[row.key]) : (p[row.key] || '-')}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Compare() {
  const {
    compareGalaxies, comparePlanets,
    removeGalaxy, removePlanet,
    clearGalaxies, clearPlanets,
  } = useCompare();

  return (
    <PageTransition>
      <div className={styles.page}>
        <div className="container">
          <div className={styles.hero}>
            <h1 className={styles.title}><span>数据对比</span></h1>
            <p className={styles.subtitle}>选择多个星系或行星进行并排比较</p>
          </div>

          {/* Galaxies */}
          <motion.div className={styles.section} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>星系对比</h2>
              <div className={styles.sectionActions}>
                <span className={styles.count}>{compareGalaxies.length} / 4</span>
                {compareGalaxies.length > 0 && (
                  <button className={styles.clearBtn} onClick={clearGalaxies}>清空</button>
                )}
              </div>
            </div>
            <GalaxyCompareTable galaxies={compareGalaxies} onRemove={removeGalaxy} />
          </motion.div>

          {/* Planets */}
          <motion.div className={styles.section} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>行星对比</h2>
              <div className={styles.sectionActions}>
                <span className={styles.count}>{comparePlanets.length} / 4</span>
                {comparePlanets.length > 0 && (
                  <button className={styles.clearBtn} onClick={clearPlanets}>清空</button>
                )}
              </div>
            </div>
            <PlanetCompareTable planets={comparePlanets} onRemove={removePlanet} />
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
