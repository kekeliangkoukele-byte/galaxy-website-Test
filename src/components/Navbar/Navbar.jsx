import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import styles from './Navbar.module.css';

const ROUTE_LINKS = [
  { path: '/', label: '首页' },
  { path: '/galaxies', label: '星系' },
  { path: '/systems', label: '恒星系统' },
  { path: '/deepsky', label: '深空天体' },
  { path: '/explore', label: '宇宙尺度' },
  { path: '/compare', label: '对比' },
];

const HOME_SECTIONS = [
  { id: 'hero', label: '首页' },
  { id: 'overview', label: '概述' },
  { id: 'structure', label: '结构' },
  { id: 'solar-system', label: '太阳系位置' },
  { id: 'celestial-bodies', label: '典型天体' },
  { id: 'exploration', label: '人类探索' },
  { id: 'faq', label: '趣味知识' },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  const [active, setActive] = useState('hero');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 20);

    if (!isHome) return;

    const sections = HOME_SECTIONS.map((l) => document.getElementById(l.id)).filter(Boolean);
    const scrollPos = window.scrollY + 120;

    for (let i = sections.length - 1; i >= 0; i--) {
      if (sections[i] && sections[i].offsetTop <= scrollPos) {
        setActive(HOME_SECTIONS[i].id);
        break;
      }
    }
  }, [isHome]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleSectionClick = (id) => {
    setMenuOpen(false);
    if (!isHome) {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavClick = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo} onClick={() => setMenuOpen(false)}>
          COSMIC GALLERY
        </Link>

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
          {ROUTE_LINKS.map((link) => (
            <button
              key={link.path}
              className={`${styles.link} ${location.pathname === link.path ? styles.active : ''}`}
              onClick={() => handleNavClick(link.path)}
            >
              {link.label}
            </button>
          ))}

          {isHome &&
            HOME_SECTIONS.slice(1).map((link) => (
              <button
                key={link.id}
                className={`${styles.link} ${active === link.id ? styles.active : ''}`}
                onClick={() => handleSectionClick(link.id)}
              >
                {link.label}
              </button>
            ))}
        </div>
      </div>
    </nav>
  );
}
