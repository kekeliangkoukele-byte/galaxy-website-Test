import { footerContent } from '../../data/content';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.quote}>&ldquo;{footerContent.text}&rdquo;</p>
      <div className={styles.divider} />
      <p className={styles.copyright}>{footerContent.copyright}</p>
    </footer>
  );
}
