import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../../components/PageTransition/PageTransition';
import CosmicBackground from '../../components/CosmicBackground/CosmicBackground';
import LazyImage from '../../components/LazyImage/LazyImage';
import deepSkyObjects from '../../data/deepSkyObjects';
import galaxies from '../../data/galaxies';
import styles from './DeepSkyDetail.module.css';

export default function DeepSkyDetail() {
  const { objectId } = useParams();
  const obj = deepSkyObjects.find((o) => o.id === objectId);

  if (!obj) {
    return (
      <PageTransition>
        <div className={styles.page}>
          <div className="container">
            <Link to="/deepsky" className={styles.backLink}>&larr; 返回深空天体目录</Link>
            <h1 style={{ color: '#fff' }}>天体未找到</h1>
          </div>
        </div>
      </PageTransition>
    );
  }

  const relatedGalaxy = obj.galaxyId ? galaxies.find((g) => g.id === obj.galaxyId) : null;

  return (
    <PageTransition>
      <div className={styles.page} style={{ '--accent-color': obj.color }}>
        <div className="container">
          <Link to="/deepsky" className={styles.backLink}>&larr; 返回深空天体目录</Link>

          {/* Hero: full-width cosmic background with overlay text */}
          <CosmicBackground
            type={obj.type}
            imageUrl={obj.image?.url}
            height={420}
          >
            <div className={styles.heroContent}>
              <div className={styles.heroHeader}>
                <span className={styles.catalogBadge}>{obj.catalog}</span>
                <h1 className={styles.heroTitle}>{obj.name}</h1>
                <span className={styles.heroNameEn}>{obj.nameEn}</span>
              </div>
              <div className={styles.heroTags}>
                <span className={styles.typeTag}>{obj.type}</span>
                <span className={styles.constTag}>{obj.constellation}</span>
              </div>
            </div>
          </CosmicBackground>

          {/* Stats */}
          <div className={styles.statsGrid}>
            {[
              { label: '类型', value: obj.type },
              { label: '所在星座', value: obj.constellation },
              { label: '距离', value: obj.distance },
              { label: '大小', value: obj.diameter },
            ].map((s, i) => (
              <motion.div key={s.label} className={styles.statCard}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}>
                <span className={styles.statLabel}>{s.label}</span>
                <span className={styles.statValue}>{s.value}</span>
              </motion.div>
            ))}
          </div>

          <div className={styles.layout}>
            <div className={styles.main}>
              <p className={styles.desc}>{obj.description}</p>

              <h2 className={styles.sectionTitle}>主要特征</h2>
              <ul className={styles.features}>
                {obj.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>

              {obj.observationTips && (
                <>
                  <h2 className={styles.sectionTitle}>观测指南</h2>
                  <div className={styles.note}>{obj.observationTips}</div>
                </>
              )}

              {relatedGalaxy && (
                <div className={styles.related}>
                  <span>此天体位于</span>
                  <Link to={`/galaxy/${relatedGalaxy.id}`} className={styles.relatedLink}>
                    {relatedGalaxy.name} &rarr;
                  </Link>
                </div>
              )}

              {obj.source && (
                <p className={styles.source}>数据来源：{obj.source}</p>
              )}
            </div>

            <div className={styles.sidebar}>
              {obj.image ? (
                <LazyImage
                  src={obj.image.url}
                  alt={obj.name}
                  caption={obj.image.caption}
                  credit={obj.image.credit}
                  source={obj.image.source}
                />
              ) : (
                <div className={styles.noImageCard}>
                  <div className={styles.noImageBg} />
                  <div className={styles.noImageContent}>
                    <span className={styles.noImageIcon}>&#127756;</span>
                    <span className={styles.noImageText}>暂无实拍图片</span>
                    <span className={styles.noImageSub}>图片区域使用程序化宇宙背景</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
