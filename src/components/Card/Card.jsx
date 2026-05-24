import styles from './Card.module.css';

export default function Card({ icon, title, description, accentColor, className = '' }) {
  return (
    <div
      className={`${styles.card} reveal ${className}`}
      style={{
        '--accent-color': accentColor,
        '--glow-color': accentColor ? `${accentColor}22` : undefined,
      }}
    >
      {accentColor && <div className={styles.cardAccent} />}
      {icon && <span className={styles.cardIcon}>{icon}</span>}
      {title && <h3 className={styles.cardTitle}>{title}</h3>}
      {description && <p className={styles.cardDesc}>{description}</p>}
    </div>
  );
}
