import { useState, useEffect, useCallback } from 'react';
import { navLinks } from '../../data/content';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [active, setActive] = useState('hero');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 20);

    const sections = navLinks.map((l) => document.getElementById(l.id)).filter(Boolean);
    const scrollPos = window.scrollY + 120;

    for (let i = sections.length - 1; i >= 0; i--) {
      if (sections[i] && sections[i].offsetTop <= scrollPos) {
        setActive(navLinks[i].id);
        break;
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleClick = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <a href="#hero" className={styles.logo} onClick={(e) => { e.preventDefault(); handleClick('hero'); }}>
          MILKY WAY
        </a>

        <button
          className={styles.menuBtn}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span style={menuOpen ? { transform: 'rotate(45deg) translateY(5px)' } : undefined} />
          <span style={menuOpen ? { opacity: 0 } : undefined} />
          <span style={menuOpen ? { transform: 'rotate(-45deg) translateY(-5px)' } : undefined} />
        </button>

        <div className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
          {navLinks.map((link) => (
            <button
              key={link.id}
              className={`${styles.link} ${active === link.id ? styles.active : ''}`}
              onClick={() => handleClick(link.id)}
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
