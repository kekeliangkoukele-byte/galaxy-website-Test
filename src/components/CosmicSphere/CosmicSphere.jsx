import { useRef, useMemo, useEffect, useCallback } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { distanceToSphereRadius } from '../../utils/constellationCoords';
import styles from './CosmicSphere.module.css';

const VIEW_SPHERICAL = {
  front: { theta: Math.PI / 2, phi: 0 },
  top: { theta: 0.15, phi: 0 },
  side: { theta: Math.PI / 2, phi: Math.PI / 2 },
};

function cameraDist(log10) {
  const sr = distanceToSphereRadius(Math.pow(10, log10));
  return sr * 1.2 + 2;
}

// --- Background stars ---
function Stars() {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const count = 800;
    const positions = new Float32Array(count * 3);
    const r = 50;
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return g;
  }, []);
  return (
    <points>
      <primitive object={geo} />
      <pointsMaterial size={0.08} color="#ffffff" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

// --- Single cosmic object ---
function CosmicObject({ data, worldScale, onClick }) {
  const s = Math.max(0.06, worldScale);
  const color = data.color || '#8b5cf6';
  const isLarge = s > 0.35;
  const showLabel = s > 0.22;
  const x = data.posX, y = data.posY, z = data.posZ;

  const handleClick = useCallback((e) => {
    e.stopPropagation();
    onClick(data);
  }, [onClick, data]);

  return (
    <group position={[x, y, z]}>
      <mesh onClick={handleClick}>
        <sphereGeometry args={[s, 32, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.9} />
      </mesh>

      <mesh>
        <sphereGeometry args={[s * 2.2, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.12} depthWrite={false} />
      </mesh>

      {isLarge && (
        <mesh>
          <sphereGeometry args={[s * 0.35, 16, 16]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.5} depthWrite={false} />
        </mesh>
      )}

      {showLabel && (
        <Html center position={[0, s * 1.6, 0]} distanceFactor={12} style={{ pointerEvents: 'none' }}>
          <div style={{
            textAlign: 'center', whiteSpace: 'nowrap', transform: 'translateZ(0)',
          }}>
            <div style={{
              fontSize: '0.7rem', fontWeight: 600, color: '#fff',
              textShadow: '0 0 10px rgba(0,0,0,0.9), 0 0 4px rgba(0,0,0,0.7)', lineHeight: 1.3,
            }}>{data.name}</div>
            <div style={{
              fontSize: '0.55rem', color: 'rgba(255,255,255,0.45)',
              textShadow: '0 0 6px rgba(0,0,0,0.8)', lineHeight: 1.3,
            }}>{data.nameEn}</div>
          </div>
        </Html>
      )}
    </group>
  );
}

// --- Inner scene content ---
function Scene({ dataset, log10ViewportMeters, viewportWidth, viewportHeight, onObjectClick, activeView, onUserRotate }) {
  const controlsRef = useRef();
  const { camera } = useThree();
  const viewportMeters = Math.pow(10, log10ViewportMeters);

  const objects = useMemo(() => {
    const results = [];
    const IDEAL_PX = 60;
    const SIGMA = 42;
    const camDist = cameraDist(log10ViewportMeters);

    for (const obj of dataset) {
      if (!obj.sizeMeters || obj.sizeMeters <= 0) continue;
      const apparentPx = (obj.sizeMeters / viewportMeters) * viewportWidth;
      if (apparentPx < 2 || apparentPx > viewportHeight * 1.5) continue;
      const diff = apparentPx - IDEAL_PX;
      const opacity = Math.exp(-(diff * diff) / (2 * SIGMA * SIGMA));
      if (opacity < 0.015) continue;

      const worldScale = Math.max(0.05, apparentPx * camDist * 1.041 / viewportWidth);
      results.push({ ...obj, worldScale, apparentPx, opacity });
    }
    return results;
  }, [dataset, viewportMeters, viewportWidth, viewportHeight, log10ViewportMeters]);

  // Smooth camera distance
  useFrame(() => {
    const currentDist = camera.position.length();
    if (currentDist < 0.001) return;
    const targetDist = cameraDist(log10ViewportMeters);
    const newDist = currentDist + (targetDist - currentDist) * 0.06;
    if (Math.abs(newDist - currentDist) > 0.005) {
      camera.position.normalize().multiplyScalar(newDist);
    }
  });

  // Apply view preset
  useEffect(() => {
    if (!activeView || !controlsRef.current) return;
    const preset = VIEW_SPHERICAL[activeView];
    if (!preset) return;
    const d = camera.position.length();
    const x = d * Math.sin(preset.theta) * Math.cos(preset.phi);
    const y = d * Math.cos(preset.theta);
    const z = d * Math.sin(preset.theta) * Math.sin(preset.phi);
    camera.position.set(x, y, z);
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.update();
  }, [activeView, camera]);

  // Detect user rotation after preset
  const wasPreset = useRef(false);
  useEffect(() => {
    if (activeView) wasPreset.current = true;
  }, [activeView]);

  const handleOrbitChange = useCallback(() => {
    if (wasPreset.current && onUserRotate) {
      wasPreset.current = false;
      onUserRotate();
    }
  }, [onUserRotate]);

  useEffect(() => {
    camera.fov = 55;
    camera.updateProjectionMatrix();
  }, [camera]);

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.45}
        dampingFactor={0.08}
        onChange={handleOrbitChange}
        maxPolarAngle={Math.PI - 0.01}
        minPolarAngle={0.01}
      />

      <ambientLight intensity={0.1} />

      <Stars />

      {/* Center reference glow */}
      <mesh>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
      </mesh>

      {objects.map((obj) => (
        <CosmicObject
          key={obj.id}
          data={obj}
          worldScale={obj.worldScale}
          onClick={onObjectClick}
        />
      ))}
    </>
  );
}

export default function CosmicSphere({
  dataset,
  log10ViewportMeters,
  viewportWidth,
  viewportHeight,
  onObjectClick,
  activeView,
  onUserRotate,
}) {
  const initDist = cameraDist(log10ViewportMeters);

  return (
    <div className={styles.container}>
      <Canvas
        camera={{ position: [0, 0, initDist], fov: 55, near: 0.01, far: 200 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={['#0a0a1a']} />
        <Scene
          dataset={dataset}
          log10ViewportMeters={log10ViewportMeters}
          viewportWidth={viewportWidth}
          viewportHeight={viewportHeight}
          onObjectClick={onObjectClick}
          activeView={activeView}
          onUserRotate={onUserRotate}
        />
      </Canvas>
    </div>
  );
}
