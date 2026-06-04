'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

function CCTVCamera() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.3 + state.clock.elapsedTime * 0.1;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });

  const bodyMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1a1a1a',
    metalness: 0.9,
    roughness: 0.2,
  }), []);

  const lensMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#0a0a0a',
    metalness: 1,
    roughness: 0.1,
    emissive: '#dc2626',
    emissiveIntensity: 0.3,
  }), []);

  const accentMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#dc2626',
    metalness: 0.8,
    roughness: 0.3,
    emissive: '#dc2626',
    emissiveIntensity: 0.5,
  }), []);

  const silverMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#c0c0c0',
    metalness: 0.95,
    roughness: 0.15,
  }), []);

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={groupRef} scale={1.2}>
        {/* Camera Body - Main cylinder */}
        <mesh position={[0, 0, 0]} material={bodyMaterial}>
          <cylinderGeometry args={[0.4, 0.45, 1.2, 32]} />
        </mesh>

        {/* Camera Body - Front cap */}
        <mesh position={[0, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]} material={bodyMaterial}>
          <cylinderGeometry args={[0.42, 0.42, 0.1, 32]} />
        </mesh>

        {/* Lens Housing */}
        <mesh position={[0, -0.65, 0]} material={silverMaterial}>
          <cylinderGeometry args={[0.25, 0.3, 0.3, 32]} />
        </mesh>

        {/* Lens */}
        <mesh position={[0, -0.85, 0]} material={lensMaterial}>
          <cylinderGeometry args={[0.18, 0.2, 0.15, 32]} />
        </mesh>

        {/* Lens Glass */}
        <mesh position={[0, -0.95, 0]}>
          <circleGeometry args={[0.17, 32]} />
          <meshStandardMaterial
            color="#111111"
            metalness={1}
            roughness={0}
            emissive="#dc2626"
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* LED Indicator */}
        <mesh position={[0.15, -0.55, 0.3]} material={accentMaterial}>
          <sphereGeometry args={[0.03, 16, 16]} />
        </mesh>

        {/* IR LEDs ring */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const x = Math.cos(angle) * 0.13;
          const z = Math.sin(angle) * 0.13;
          return (
            <mesh key={i} position={[x, -0.93, z]}>
              <sphereGeometry args={[0.015, 8, 8]} />
              <meshStandardMaterial
                color="#330000"
                emissive="#dc2626"
                emissiveIntensity={0.8}
              />
            </mesh>
          );
        })}

        {/* Mount Bracket */}
        <mesh position={[0, 0.7, 0]} material={silverMaterial}>
          <boxGeometry args={[0.15, 0.3, 0.15]} />
        </mesh>

        {/* Wall Mount Plate */}
        <mesh position={[0, 0.9, 0]} material={bodyMaterial}>
          <cylinderGeometry args={[0.3, 0.3, 0.05, 32]} />
        </mesh>

        {/* Cable */}
        <mesh position={[0, 0.5, -0.2]} material={bodyMaterial}>
          <cylinderGeometry args={[0.03, 0.03, 0.5, 8]} />
        </mesh>

        {/* Red accent ring */}
        <mesh position={[0, -0.5, 0]} material={accentMaterial}>
          <torusGeometry args={[0.35, 0.015, 16, 32]} />
        </mesh>
      </group>
    </Float>
  );
}

function ParticleField() {
  const count = 200;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return pos;
  }, []);

  const ref = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#dc2626"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

export default function CameraModel() {
  return (
    <div className="w-full h-full min-h-[400px]">
      <Canvas
        camera={{ position: [3, 1, 3], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
        <directionalLight position={[-3, 3, -3]} intensity={0.5} color="#dc2626" />
        <pointLight position={[0, -2, 2]} intensity={0.8} color="#dc2626" />
        <spotLight
          position={[0, 5, 0]}
          angle={0.3}
          penumbra={0.8}
          intensity={1.5}
          color="#ffffff"
        />
        <CCTVCamera />
        <ParticleField />
        <Environment preset="night" />
      </Canvas>
    </div>
  );
}
