import { useEffect, useRef } from 'react';
import styles from './Section.module.css';

export default function Section({ id, title, intro, children, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.querySelectorAll('.reveal').forEach((child) => {
              child.classList.add('visible');
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id={id} className={`${styles.section} section-padding ${className}`} ref={ref}>
      <div className="container">
        <div className={`${styles.sectionHeader} reveal`}>
          <h2 className={styles.sectionTitle}>
            <span>{title}</span>
          </h2>
          {intro && <p className={styles.sectionIntro}>{intro}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}
