import { useMemo } from 'react';
import ExploreObject from '../ExploreObject/ExploreObject';
import styles from './ExploreCanvas.module.css';

const MIN_VISIBLE_PX = 2;
const IDEAL_PX = 60;
const SIGMA = IDEAL_PX * 0.7;

function gaussianOpacity(apparentPx) {
  const diff = apparentPx - IDEAL_PX;
  return Math.exp(-(diff * diff) / (2 * SIGMA * SIGMA));
}

// Z-depth in px based on category — creates real 3D layering
function getZDepth(category, sizeMeters) {
  switch (category) {
    case 'galaxy': return -180;
    case 'deepsky': return -80;
    case 'star_system': return 30;
    case 'planet': return 120;
    default: return 0;
  }
}

export default function ExploreCanvas({
  dataset,
  log10ViewportMeters,
  viewportWidth,
  viewportHeight,
  onObjectClick,
}) {
  const viewportMeters = Math.pow(10, log10ViewportMeters);

  const visibleObjects = useMemo(() => {
    const results = [];
    for (const obj of dataset) {
      if (obj.sizeMeters === null || obj.sizeMeters <= 0) continue;
      const apparentPx = (obj.sizeMeters / viewportMeters) * viewportWidth;
      if (apparentPx < MIN_VISIBLE_PX || apparentPx > viewportHeight * 1.5) continue;
      const opacity = gaussianOpacity(apparentPx);
      if (opacity < 0.015) continue;
      results.push({
        ...obj,
        apparentPx,
        opacity,
        zDepth: getZDepth(obj.category),
      });
    }
    return results;
  }, [dataset, viewportMeters, viewportWidth, viewportHeight]);

  return (
    <div className={styles.canvas}>
      {visibleObjects.map((obj) => (
        <ExploreObject
          key={obj.id}
          data={obj}
          apparentPx={obj.apparentPx}
          opacity={obj.opacity}
          onClick={onObjectClick}
        />
      ))}
      {visibleObjects.length === 0 && (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>继续滚动探索</p>
          <p className={styles.emptySub}>上下滚动鼠标在不同宇宙尺度之间穿梭</p>
          <p className={styles.emptyMeta}>
            当前视界：10<sup>{log10ViewportMeters.toFixed(1)}</sup> 米
          </p>
        </div>
      )}
      <div className={styles.objectCount}>
        {visibleObjects.length} 个可见天体
      </div>
    </div>
  );
}
