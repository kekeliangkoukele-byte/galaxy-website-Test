import styles from './ScaleBar.module.css';

const SCALE_REGIMES = [
  { log10: 23, label: '星系' },
  { log10: 21, label: '矮星系' },
  { log10: 19, label: '深空天体' },
  { log10: 17, label: '大星云' },
  { log10: 15, label: '小星云' },
  { log10: 13, label: '行星系统' },
  { log10: 11, label: '巨行星' },
  { log10: 9, label: '类地行星' },
  { log10: 7, label: '小行星' },
];

export default function ScaleBar({ log10ViewportMeters }) {
  const logMin = 6;
  const logMax = 23;
  const range = logMax - logMin;

  const progress = ((log10ViewportMeters - logMin) / range) * 100;
  const clampedProgress = Math.max(0, Math.min(100, progress));

  let closestRegime = SCALE_REGIMES[0];
  let minDist = Infinity;
  for (const r of SCALE_REGIMES) {
    const dist = Math.abs(r.log10 - log10ViewportMeters);
    if (dist < minDist) {
      minDist = dist;
      closestRegime = r;
    }
  }

  return (
    <div className={styles.bar}>
      <div className={styles.track}>
        <div
          className={styles.indicator}
          style={{ top: `${100 - clampedProgress}%` }}
        />
        {SCALE_REGIMES.map((r) => {
          const pct = ((r.log10 - logMin) / range) * 100;
          return (
            <div
              key={r.log10}
              className={styles.tick}
              style={{ top: `${100 - pct}%` }}
            >
              <span className={styles.tickLabel}>{r.label}</span>
            </div>
          );
        })}
      </div>
      <div className={styles.currentLabel}>
        <span className={styles.currentScale}>{closestRegime.label}</span>
        <span className={styles.currentPower}>
          10<sup>{log10ViewportMeters.toFixed(1)}</sup> m
        </span>
      </div>
    </div>
  );
}
