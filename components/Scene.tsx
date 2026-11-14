import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, PresentationControls, Environment } from '@react-three/drei';
import Experience from './Experience';
import type { AppTheme, AppView } from '../App';

// Lighting environments are served from this site (same files drei's
// "studio" and "city" presets download from raw.githack.com), so the globe
// no longer depends on a third-party CDN to appear.
const ENV_FILES: Record<'studio' | 'city', string> = {
  studio: '/hdri/studio_small_03_1k.hdr',
  city: '/hdri/potsdamer_platz_1k.hdr',
};

interface SceneProps {
  currentView: AppView;
  theme: AppTheme;
}

const SHADOW_PROPS: Record<AppTheme, { color: string; opacity: number; blur: number; far: number }> = {
  orange: { color: '#4a1500', opacity: 0.48, blur: 2.8, far: 5 },
  light: { color: '#475569', opacity: 0.22, blur: 2.5, far: 4.5 },
  dark: { color: '#000000', opacity: 0.4, blur: 2.5, far: 4.5 },
};

const Scene: React.FC<SceneProps> = ({ currentView, theme }) => {
  const shadowProps = SHADOW_PROPS[theme];

  return (
    <Canvas
      shadows
      // DPR cap is critical for mobile performance
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 9], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={theme === 'orange' ? 1.0 : theme === 'light' ? 0.9 : 0.5} color={theme === 'orange' ? '#fff2e5' : '#ffffff'} />
      <spotLight
        position={[8, 12, 9]}
        angle={0.25}
        penumbra={0.9}
        intensity={theme === 'orange' ? 2.8 : theme === 'light' ? 2.5 : 2}
        color={theme === 'orange' ? '#fff7ed' : '#ffffff'}
        castShadow
      />
      {theme === 'orange' && (
        <directionalLight position={[-8, -4, 4]} intensity={0.6} color="#fed7aa" />
      )}

      <Suspense fallback={null}>
        <PresentationControls
          global
          snap
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 12, Math.PI / 12]}
          azimuth={[-Math.PI / 6, Math.PI / 6]}
          config={{ mass: 2, tension: 400 }}
        >
          <Experience currentView={currentView} theme={theme} />
        </PresentationControls>

        <ContactShadows
          position={[0, -2.5, 0]}
          opacity={shadowProps.opacity}
          color={shadowProps.color}
          scale={16}
          blur={shadowProps.blur}
          far={shadowProps.far}
          resolution={256} // Lower res for better perf
        />
        <Environment files={theme === 'dark' ? ENV_FILES.city : ENV_FILES.studio} />
      </Suspense>
    </Canvas>
  );
};

export default Scene;
