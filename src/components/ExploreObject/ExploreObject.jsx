import { memo } from 'react';
import styles from './ExploreObject.module.css';

const ExploreObject = memo(function ExploreObject({
  data,
  apparentPx,
  opacity,
  onClick,
}) {
  const showLabel = apparentPx > 22;
  const isLarge = apparentPx > 38;
  const size = Math.max(apparentPx, 8);

  let shapeClass = styles.dot;
  if (isLarge) {
    if (data.category === 'galaxy') shapeClass = styles.galaxyLarge;
    else if (data.category === 'deepsky') shapeClass = styles.nebulaLarge;
    else if (data.category === 'star_system') shapeClass = styles.systemLarge;
    else if (data.category === 'planet') shapeClass = styles.planetLarge;
  }

  return (
    <div
      className={styles.object}
      style={{
        left: `${data.x}%`,
        top: `${data.y}%`,
        width: size,
        height: size,
        opacity,
        '--accent': data.color,
        '--z-depth': `${data.zDepth || 0}px`,
      }}
      onClick={(e) => { e.stopPropagation(); onClick(data); }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick(data); }}
      aria-label={`${data.name} — ${data.nameEn}`}
    >
      <div className={`${styles.shape} ${shapeClass}`}>
        {/* Glow ring for large objects */}
        {isLarge && <div className={styles.glowRing} />}
      </div>

      {showLabel && (
        <div className={styles.label}>
          <span className={styles.labelZh}>{data.name}</span>
          <span className={styles.labelEn}>{data.nameEn}</span>
        </div>
      )}
    </div>
  );
}, function areEqual(prev, next) {
  return (
    Math.abs(prev.apparentPx - next.apparentPx) < 0.5 &&
    Math.abs(prev.opacity - next.opacity) < 0.005
  );
});

export default ExploreObject;
