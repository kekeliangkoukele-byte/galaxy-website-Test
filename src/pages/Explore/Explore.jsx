import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import PageTransition from '../../components/PageTransition/PageTransition';
import CosmicSphere from '../../components/CosmicSphere/CosmicSphere';
import ScaleBar from '../../components/ScaleBar/ScaleBar';
import ExploreInfoPanel from '../../components/ExploreInfoPanel/ExploreInfoPanel';
import ExploreOnboarding from '../../components/ExploreOnboarding/ExploreOnboarding';
import buildExploreDataset from '../../utils/buildExploreData';
import styles from './Explore.module.css';

const LOG_MAX = 23;
const LOG_MIN = 6;
const LOG_RANGE = LOG_MAX - LOG_MIN;
const PX_PER_ORDER = 3000;
const SCROLL_HEIGHT = LOG_RANGE * PX_PER_ORDER;

const SESSION_KEY = 'explore-scroll-top';

const VIEW_PRESETS = [
  { id: 'front', label: '正面', icon: '◉' },
  { id: 'top', label: '俯视', icon: '◎' },
  { id: 'side', label: '侧视', icon: '◐' },
];

function scrollToLog10(scrollTop, vpHeight) {
  const maxScroll = Math.max(SCROLL_HEIGHT - vpHeight, 1);
  const progress = Math.max(0, Math.min(1, scrollTop / maxScroll));
  return LOG_MAX - progress * LOG_RANGE;
}

export default function Explore() {
  const containerRef = useRef(null);
  const [viewportSize, setViewportSize] = useState({ width: 1200, height: 800 });
  const [log10Viewport, setLog10Viewport] = useState(LOG_MAX);
  const [selectedObject, setSelectedObject] = useState(null);
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const [activeView, setActiveView] = useState('front');

  const dataset = useMemo(() => {
    try { return buildExploreDataset(); }
    catch (e) { console.error('buildExploreDataset failed:', e); return []; }
  }, []);

  // Measure viewport
  useEffect(() => {
    const measure = () => {
      setViewportSize({ width: window.innerWidth, height: window.innerHeight });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Handle scroll
  const handleScroll = useCallback(() => {
    const c = containerRef.current;
    if (!c) return;
    const st = c.scrollTop;
    setScrollTop(st);
    setLog10Viewport(scrollToLog10(st, viewportSize.height));
  }, [viewportSize.height]);

  // Restore scroll position
  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    const c = containerRef.current;
    if (!c) return;
    if (saved) {
      const top = parseFloat(saved);
      if (!isNaN(top) && top > 0) {
        c.scrollTop = top;
        setScrollTop(top);
        setLog10Viewport(scrollToLog10(top, viewportSize.height));
      }
    }
    return () => {
      if (containerRef.current) {
        sessionStorage.setItem(SESSION_KEY, String(containerRef.current.scrollTop));
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const save = () => {
      if (containerRef.current) {
        sessionStorage.setItem(SESSION_KEY, String(containerRef.current.scrollTop));
      }
    };
    window.addEventListener('beforeunload', save);
    return () => window.removeEventListener('beforeunload', save);
  }, []);

  const handleViewPreset = useCallback((preset) => {
    setActiveView(preset.id);
  }, []);

  const handleUserRotate = useCallback(() => {
    setActiveView('');
  }, []);

  const handleObjectClick = useCallback((obj) => {
    setSelectedObject(obj);
  }, []);

  const handleClosePanel = useCallback(() => {
    setSelectedObject(null);
  }, []);

  const handleOnboardingDismiss = useCallback(() => {
    setOnboardingDone(true);
  }, []);

  const maxScroll = Math.max(SCROLL_HEIGHT - viewportSize.height, 1);
  const scrollProgress = scrollTop / maxScroll;

  return (
    <PageTransition>
      <div className={styles.page} ref={containerRef} onScroll={handleScroll}>
        <div className={styles.viewport}>
          {/* View preset buttons */}
          <div className={styles.viewControls} data-no-drag>
            {VIEW_PRESETS.map((vp) => (
              <button
                key={vp.id}
                className={`${styles.viewBtn} ${activeView === vp.id ? styles.viewBtnActive : ''}`}
                onClick={() => handleViewPreset(vp)}
                title={vp.label}
              >
                <span className={styles.viewBtnIcon}>{vp.icon}</span>
                <span className={styles.viewBtnLabel}>{vp.label}</span>
              </button>
            ))}
          </div>

          {/* Three.js spherical scene */}
          <CosmicSphere
            dataset={dataset}
            log10ViewportMeters={log10Viewport}
            viewportWidth={viewportSize.width}
            viewportHeight={viewportSize.height}
            onObjectClick={handleObjectClick}
            activeView={activeView}
            onUserRotate={handleUserRotate}
          />

          {/* Center crosshair */}
          <div className={styles.centerDot} />

          <ScaleBar log10ViewportMeters={log10Viewport} />
          <ExploreInfoPanel object={selectedObject} onClose={handleClosePanel} />
        </div>

        <div className={styles.spacer} style={{ height: SCROLL_HEIGHT }} />

        {/* Scroll hint */}
        <div className={styles.scrollHint}>
          <span className={styles.hintLine} />
          滚动缩放 &middot; 拖拽旋转 &middot; 点击探索
        </div>

        {/* Progress bar */}
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${scrollProgress * 100}%` }} />
        </div>

        <ExploreOnboarding onDismiss={handleOnboardingDismiss} />
      </div>
    </PageTransition>
  );
}
