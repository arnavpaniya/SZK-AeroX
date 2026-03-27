'use client';

import { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows, Center } from '@react-three/drei';
import * as THREE from 'three';

function DroneMesh() {
  const { scene } = useGLTF('/rc_quadcopter.glb');
  const meshRef = useRef<THREE.Group>(null);
  const materialsFixed = useRef(false);

  // Apply dark military treatment to match the main page
  useEffect(() => {
    if (materialsFixed.current) return;
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((mat) => {
          const m = mat as THREE.MeshStandardMaterial;
          m.color.setHex(0x0a0f16);
          m.roughness = 0.6;
          m.metalness = 0.8;
          m.envMapIntensity = 1.0;
        });
      }
    });
    materialsFixed.current = true;
  }, [scene]);

  // Gentle floating and spinning animation
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.position.y = Math.sin(t * 1.5) * 0.1;
    meshRef.current.rotation.y = t * 0.5;
    meshRef.current.rotation.z = Math.sin(t * 0.8) * 0.05;
    meshRef.current.rotation.x = Math.cos(t * 0.8) * 0.05 + 0.1; // slight tilt forward
  });

  return (
    <group ref={meshRef}>
      <Center>
        <primitive object={scene} scale={[1.2, 1.2, 1.2]} />
      </Center>
    </group>
  );
}

export default function SimpleDrone({ className = "w-full h-full" }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 2, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#00eaff" />
        <spotLight position={[0, 5, 0]} intensity={2} angle={0.6} penumbra={1} color="#00eefc" />
        
        <Suspense fallback={null}>
          <DroneMesh />
          <Environment preset="city" />
          <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2} far={4} color="#00eaff" />
        </Suspense>
      </Canvas>
    </div>
  );
}
