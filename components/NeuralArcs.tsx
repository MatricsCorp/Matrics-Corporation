
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ArcData {
  points: THREE.Vector3[];
  speed: number;
  offset: number;
}

const NeuralArc: React.FC<{ data: ArcData }> = ({ data }) => {
  const materialRef = useRef<THREE.LineBasicMaterial>(null);

  useFrame((state) => {
    if (materialRef.current) {
      const pulse = Math.sin(state.clock.getElapsedTime() * data.speed + data.offset) * 0.5 + 0.5;
      materialRef.current.opacity = 0.05 + pulse * 0.6;
    }
  });

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(data.points);
  }, [data.points]);

  return (
    <lineLoop>
      <primitive object={geometry} attach="geometry" />
      <lineBasicMaterial ref={materialRef} color="#db5319" transparent opacity={0.4} linewidth={1} />
    </lineLoop>
  );
};

const NeuralArcs: React.FC<{ count?: number }> = ({ count = 25 }) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const arcs = useMemo(() => {
    const arcList: ArcData[] = [];
    const radius = 1.05;

    // Major Hubs for organized "inter-continental" look
    const hubs = [
      new THREE.Vector3().setFromSphericalCoords(radius, Math.PI / 4, 0), // Hub A
      new THREE.Vector3().setFromSphericalCoords(radius, Math.PI / 3, Math.PI), // Hub B
      new THREE.Vector3().setFromSphericalCoords(radius, Math.PI / 2.2, Math.PI / 1.1), // Hub C
      new THREE.Vector3().setFromSphericalCoords(radius, Math.PI / 2.5, Math.PI / 4), // Hub D
    ];

    for (let i = 0; i < count; i++) {
      const hubA = hubs[Math.floor(Math.random() * hubs.length)];
      const hubB = hubs[Math.floor(Math.random() * hubs.length)];
      
      const p1 = hubA.clone().applyAxisAngle(new THREE.Vector3(0,1,0), (Math.random()-0.5)*0.2);
      const p2 = hubB.clone().applyAxisAngle(new THREE.Vector3(1,0,0), (Math.random()-0.5)*0.2);
      
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      const dist = p1.distanceTo(p2);
      const cp = mid.clone().normalize().multiplyScalar(radius + Math.max(0.1, dist * 0.5));
      const curve = new THREE.QuadraticBezierCurve3(p1, cp, p2);
      
      // Optimization: Reduce point count for curves on mobile
      const resolution = isMobile ? 32 : 48;
      
      arcList.push({
        points: curve.getPoints(resolution),
        speed: 2 + Math.random() * 3,
        offset: Math.random() * Math.PI * 2
      });
    }
    return arcList;
  }, [count, isMobile]);

  return (
    <group>
      {arcs.map((arc, i) => <NeuralArc key={i} data={arc} />)}
    </group>
  );
};

export default NeuralArcs;
