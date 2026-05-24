import { useMemo } from 'react';
import styles from './StarField.module.css';

function generateStars(count) {
  return Array.from({ length: count }, (_, i) => {
    const size = Math.random() * 2.5 + 0.5;
    return {
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      width: `${size}px`,
      height: `${size}px`,
      '--duration': `${Math.random() * 3 + 2}s`,
      '--delay': `${Math.random() * 4}s`,
      opacity: Math.random() * 0.5 + 0.3,
    };
  });
}

export default function StarField({ count = 200 }) {
  const stars = useMemo(() => generateStars(count), [count]);

  return (
    <div className={styles.starfield}>
      {stars.map((star) => (
        <span
          key={star.id}
          className={styles.star}
          style={star}
        />
      ))}
    </div>
  );
}
