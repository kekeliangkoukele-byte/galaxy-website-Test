import { useState } from 'react';
import styles from './CosmicBackground.module.css';

/**
 * Map object types to procedural CSS background classes.
 * Types from deepSkyObjects: 发射星云, 行星状星云, 超新星遗迹, 疏散星团, 球状星团, 螺旋星系
 * Types from galaxies: 棒旋星系, 螺旋星系, 不规则星系, 矮椭球星系
 */
function getBgClass(type, subType) {
  const t = (type || '').toLowerCase();
  const s = (subType || '').toLowerCase();

  if (t.includes('发射星云') || t.includes('hii') || s.includes('emission')) {
    return styles.bgEmissionNebula;
  }
  if (t.includes('行星状星云') || s.includes('planetary')) {
    return styles.bgPlanetaryNebula;
  }
  if (t.includes('超新星遗迹') || s.includes('supernova')) {
    return styles.bgSupernovaRemnant;
  }
  if (t.includes('疏散星团') || s.includes('open')) {
    return styles.bgOpenCluster;
  }
  if (t.includes('球状星团') || s.includes('globular')) {
    return styles.bgGlobularCluster;
  }
  if (t.includes('螺旋星系') || t.includes('棒旋星系') || s.includes('spiral')) {
    return styles.bgSpiralGalaxy;
  }
  if (t.includes('不规则') || s.includes('irregular')) {
    return styles.bgIrregularGalaxy;
  }
  if (t.includes('矮椭球') || t.includes('矮星系') || s.includes('dwarf')) {
    return styles.bgDwarfGalaxy;
  }
  return styles.bgDefault;
}

export default function CosmicBackground({
  type,
  subType,
  imageUrl,
  height = 400,
  children,
  className = '',
}) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const bgClass = getBgClass(type, subType);
  const showImage = imageUrl && !imgError;

  return (
    <div className={`${styles.wrapper} ${className}`} style={{ height }}>
      {/* Procedural CSS background (always visible) */}
      <div className={bgClass} />

      {/* Real image overlay if available */}
      {showImage && (
        <div
          className={styles.bgImage}
          style={{
            backgroundImage: `url(${imageUrl})`,
            opacity: imgLoaded ? 0.55 : 0,
          }}
        >
          <img
            src={imageUrl}
            alt=""
            style={{ display: 'none' }}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
          />
        </div>
      )}

      {/* Dark gradient overlay for text readability */}
      <div className={styles.overlay} />

      {/* Content slot */}
      {children && <div className={styles.content}>{children}</div>}
    </div>
  );
}
