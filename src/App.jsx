import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import StarField from './components/StarField/StarField';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import { CompareProvider } from './contexts/CompareContext';

/* Lazy-loaded pages */
const Home = lazy(() => import('./pages/Home/Home'));
const GalaxyList = lazy(() => import('./pages/GalaxyList/GalaxyList'));
const GalaxyDetail = lazy(() => import('./pages/GalaxyDetail/GalaxyDetail'));
const SystemsList = lazy(() => import('./pages/SystemsList/SystemsList'));
const SystemDetail = lazy(() => import('./pages/SystemDetail/SystemDetail'));
const PlanetDetail = lazy(() => import('./pages/PlanetDetail/PlanetDetail'));
const DeepSkyList = lazy(() => import('./pages/DeepSkyList/DeepSkyList'));
const DeepSkyDetail = lazy(() => import('./pages/DeepSkyDetail/DeepSkyDetail'));
const Compare = lazy(() => import('./pages/Compare/Compare'));
const Explore = lazy(() => import('./pages/Explore/Explore'));

function PageLoader() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', color: 'var(--color-text-muted)',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 40, height: 40, margin: '0 auto 16px',
          border: '2px solid rgba(255,255,255,0.1)',
          borderTopColor: 'var(--color-accent-purple)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
        <span>加载中...</span>
      </div>
    </div>
  );
}

function RouteTitle({ children }) {
  const titleMap = {
    '/': '银河系 — 探索我们的宇宙家园',
    '/galaxies': '星系列表 — 宇宙星系馆',
    '/systems': '恒星系统 — 宇宙星系馆',
    '/deepsky': '深空天体目录 — 宇宙星系馆',
    '/compare': '数据对比 — 宇宙星系馆',
    '/explore': '宇宙尺度探索 — 宇宙星系馆',
  };

  const location = useLocation();
  const baseTitle = titleMap[location.pathname] || '宇宙星系馆';

  /* Set document title */
  document.title = baseTitle;

  return children;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <RouteTitle>
      <AnimatePresence mode="wait">
        <Suspense fallback={<PageLoader />}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/galaxies" element={<GalaxyList />} />
            <Route path="/galaxy/:galaxyId" element={<GalaxyDetail />} />
            <Route path="/systems" element={<SystemsList />} />
            <Route path="/system/:systemId" element={<SystemDetail />} />
            <Route path="/planet/:planetId" element={<PlanetDetail />} />
            <Route path="/deepsky" element={<DeepSkyList />} />
            <Route path="/deepsky/:objectId" element={<DeepSkyDetail />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/explore" element={<Explore />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </RouteTitle>
  );
}

function AppLayout() {
  const location = useLocation();
  const isExplore = location.pathname === '/explore';

  return (
    <>
      <StarField count={180} />
      <Navbar />
      <AnimatedRoutes />
      {!isExplore && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CompareProvider>
        <AppLayout />
      </CompareProvider>
    </BrowserRouter>
  );
}
