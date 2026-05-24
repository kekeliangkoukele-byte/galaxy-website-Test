import { useMemo } from 'react';
import styles from './StarField.module.css';

const LAYERS = [
  { count: 40, minSize: 1.5, maxSize: 3, speed: 'slow', opacityMin: 0.15, opacityMax: 0.55 },
  { count: 80, minSize: 1, maxSize: 2.2, speed: 'medium', opacityMin: 0.2, opacityMax: 0.7 },
  { count: 120, minSize: 0.5, maxSize: 1.5, speed: 'fast', opacityMin: 0.25, opacityMax: 0.85 },
];

function generateLayer(count, minSize, maxSize, opacityMin, opacityMax) {
  return Array.from({ length: count }, (_, i) => {
    const size = Math.random() * (maxSize - minSize) + minSize;
    const opacity = Math.random() * (opacityMax - opacityMin) + opacityMin;
    return {
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      width: `${size}px`,
      height: `${size}px`,
      opacity,
      '--twinkle-duration': `${Math.random() * 4 + 2.5}s`,
      '--twinkle-delay': `${Math.random() * 5}s`,
      '--drift-duration': `${Math.random() * 30 + 40}s`,
    };
  });
}

export default function StarField({ count = 200 }) {
  const layers = useMemo(
    () => LAYERS.map((l) => generateLayer(l.count, l.minSize, l.maxSize, l.opacityMin, l.opacityMax)),
    []
  );

  return (
    <div className={styles.starfield}>
      {layers.map((stars, layerIdx) =>
        stars.map((star) => (
          <span
            key={`l${layerIdx}-${star.id}`}
            className={`${styles.star} ${styles[`layer${layerIdx}`]}`}
            style={star}
          />
        ))
      )}
    </div>
  );
}
