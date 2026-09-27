
import React, { useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

interface TabletProps {
  position?: [number, number, number];
  theme?: 'orange' | 'light' | 'dark';
}

const Tablet: React.FC<TabletProps> = ({ position, theme = 'orange' }) => {
  const scanLineRef = useRef<THREE.Mesh>(null);
  const reflectionRef = useRef<THREE.Group>(null);
  const [displayText, setDisplayText] = useState("MATRICS CORPORATION");
  
  const isLight = theme === 'light';
  const isOrange = theme === 'orange';
  
  const { tabletShape, screenGeometry } = useMemo(() => {
    const shape = new THREE.Shape();
    const w = 7.1, h = 4.6, r = 0.35;
    shape.moveTo(-w/2+r, -h/2);
    shape.lineTo(w/2-r, -h/2);
    shape.quadraticCurveTo(w/2, -h/2, w/2, -h/2+r);
    shape.lineTo(w/2, h/2-r);
    shape.quadraticCurveTo(w/2, h/2, w/2-r, h/2);
    shape.lineTo(-w/2+r, h/2);
    shape.quadraticCurveTo(-w/2, h/2, -w/2, h/2-r);
    shape.lineTo(-w/2, -h/2+r);
    shape.quadraticCurveTo(-w/2, -h/2, -w/2+r, -h/2);
    
    return {
      tabletShape: shape,
      screenGeometry: new THREE.ShapeGeometry(shape)
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayText(prev => prev === "MATRICS CORPORATION" ? "MATRICS TARANG" : "MATRICS CORPORATION");
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useFrame((state) => {
    if (scanLineRef.current) {
      scanLineRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 2.2;
    }
    if (reflectionRef.current) {
      reflectionRef.current.position.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;
      reflectionRef.current.position.z = Math.cos(state.clock.getElapsedTime() * 0.2) * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* Chassis - Sculpted aerospace brushed aluminum in light mode, dark titanium in dark mode */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <extrudeGeometry args={[tabletShape, { depth: 0.1, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05 }]} />
        <meshStandardMaterial 
          color={isLight ? "#dbe1ea" : "#1a0d00"} 
          roughness={isLight ? 0.22 : 0.1} 
          metalness={isLight ? 0.85 : 0.9} 
        />
      </mesh>

      {/* Screen Base */}
      <mesh position={[0, 0.081, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <primitive object={screenGeometry} attach="geometry" />
        <meshStandardMaterial 
          color={isLight ? "#0f172a" : "#000000"} 
          roughness={0.06} 
          metalness={0.6} 
          emissive="#db5319" 
          emissiveIntensity={isLight ? 0.08 : 0.05} 
        />
      </mesh>

      {/* Edge-to-Edge Visual UI Elements */}
      <group position={[0, 0.082, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        {/* Subtle Grid */}
        <mesh>
          <primitive object={screenGeometry} attach="geometry" />
          <meshBasicMaterial 
            color="#db5319" 
            transparent 
            opacity={isLight ? 0.12 : 0.08} 
            wireframe 
          />
        </mesh>
        
        {/* Scanning Line */}
        <mesh ref={scanLineRef}>
          <planeGeometry args={[7.1, 0.025]} />
          <meshBasicMaterial color="#ea580c" transparent opacity={isLight ? 0.75 : 0.6} />
        </mesh>

        {/* Reflected Brand Name */}
        <group ref={reflectionRef}>
          <Text
            position={[0, 0, 0.001]}
            fontSize={0.35}
            color={isLight ? "#e2e8f0" : "white"}
            anchorX="center"
            anchorY="middle"
            fillOpacity={isLight ? 0.15 : 0.08}
            letterSpacing={0.5}
            scale={[-1, 1, 1]}
          >
            {displayText}
          </Text>
        </group>

        {/* Corner Markers */}
        <group>
            {[[-3.4, -2.15], [3.4, -2.15], [3.4, 2.15], [-3.4, 2.15]].map((pos, i) => (
                <mesh key={i} position={[pos[0], pos[1], 0]} rotation={[0, 0, Math.PI / 4]}>
                    <ringGeometry args={[0.05, 0.07, 4]} />
                    <meshBasicMaterial color="#db5319" transparent opacity={isLight ? 0.6 : 0.4} />
                </mesh>
            ))}
        </group>
      </group>
      
      {/* Screen Gloss Overlay */}
      <mesh position={[0, 0.085, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <primitive object={screenGeometry} attach="geometry" />
        <meshStandardMaterial 
          color="#ffffff"
          transparent
          opacity={isLight ? 0.06 : 0.04}
          roughness={0}
          metalness={1}
        />
      </mesh>
    </group>
  );
};

export default Tablet;
