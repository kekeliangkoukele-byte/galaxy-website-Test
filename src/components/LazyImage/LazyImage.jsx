import { useState } from 'react';
import styles from './LazyImage.module.css';

const ICONS = {
  galaxy: '\u{1F30C}',
  nebula: '\u{1F4AB}',
  cluster: '\u{2728}',
  default: '\u{1F756}',
};

export default function LazyImage({ src, alt, caption, credit, source, className = '' }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  /* No src at all — show styled placeholder */
  if (!src) {
    return (
      <figure className={`${styles.figure} ${className}`}>
        <div className={styles.imgWrapper}>
          <div className={styles.cosmicBg} />
          <div className={styles.fallback}>
            <span className={styles.fallbackIcon}>{ICONS.default}</span>
            <span className={styles.fallbackText}>暂无图片</span>
          </div>
        </div>
        {(caption || credit || source) && (
          <figcaption className={styles.caption}>
            {caption && <span className={styles.captionText}>{caption}</span>}
            {credit && <span className={styles.credit}>拍摄/处理：{credit}</span>}
            {source && <span className={styles.source}>来源：{source}</span>}
          </figcaption>
        )}
      </figure>
    );
  }

  return (
    <figure className={`${styles.figure} ${className}`}>
      <div className={styles.imgWrapper}>
        {/* Always show cosmic background */}
        <div className={styles.cosmicBg} />

        {/* Skeleton while loading */}
        {!loaded && !error && <div className={styles.skeleton} />}

        {error ? (
          <div className={styles.fallback}>
            <span className={styles.fallbackIcon}>{ICONS.default}</span>
            <span className={styles.fallbackText}>图片加载失败</span>
          </div>
        ) : (
          <img
            src={src}
            alt={alt || caption || ''}
            className={`${styles.img} ${loaded ? styles.loaded : ''}`}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
          />
        )}
      </div>

      {(caption || credit || source) && (
        <figcaption className={styles.caption}>
          {caption && <span className={styles.captionText}>{caption}</span>}
          {credit && <span className={styles.credit}>拍摄/处理：{credit}</span>}
          {source && <span className={styles.source}>来源：{source}</span>}
        </figcaption>
      )}
    </figure>
  );
}
