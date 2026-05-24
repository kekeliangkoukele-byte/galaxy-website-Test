import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import { motion } from 'framer-motion';
import styles from './PlanetScene.module.css';

function RotatingSphere({ color = '#3b82f6', autoRotate = true }) {
  const ref = useRef();

  useFrame((_, delta) => {
    if (ref.current && autoRotate) {
      ref.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <Sphere ref={ref} args={[1.4, 64, 64]}>
      <meshStandardMaterial
        color={color}
        roughness={0.7}
        metalness={0.1}
      />
    </Sphere>
  );
}

function FallbackDisplay({ color, name }) {
  return (
    <div className={styles.fallback}>
      <div
        className={styles.fallbackSphere}
        style={{
          '--planet-color': color,
          background: `radial-gradient(circle at 35% 35%, color-mix(in srgb, ${color} 60%, white), ${color} 40%, color-mix(in srgb, ${color} 70%, black) 100%)`,
          boxShadow: `0 0 60px color-mix(in srgb, ${color} 30%, transparent)`,
        }}
      />
      <span className={styles.fallbackName}>{name}</span>
    </div>
  );
}

export default function PlanetScene({ color = '#3b82f6', name = '', hasWebGL = true }) {
  if (!hasWebGL) {
    return <FallbackDisplay color={color} name={name} />;
  }

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Canvas
        camera={{ position: [0, 0.5, 4.5], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 3, 5]} intensity={0.9} />
        <pointLight position={[-3, 1, -2]} intensity={0.3} color="#8b5cf6" />
        <Suspense fallback={null}>
          <RotatingSphere color={color} />
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            minDistance={2.5}
            maxDistance={8}
            autoRotate={false}
          />
        </Suspense>
      </Canvas>
      <div className={styles.hint}>拖拽旋转 · 滚轮缩放</div>
    </motion.div>
  );
}
