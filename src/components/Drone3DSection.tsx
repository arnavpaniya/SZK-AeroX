'use client';

import { useRef, Suspense, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows, Center } from '@react-three/drei';
import { useScroll, useTransform, useSpring, motion } from 'framer-motion';
import * as THREE from 'three';

/* ═══════════════════════════════════════════════
   COLORS
   ═══════════════════════════════════════════════ */
const CYAN = '#00d4ff';
const RED = '#ff4757';
const DARK = '#04080e';

/* ═══════════════════════════════════════════════
   Waveform bars component for Phase 4
   ═══════════════════════════════════════════════ */
function ChaoticWaveform() {
  const [bars, setBars] = useState<number[]>(Array(46).fill(0.3));

  useEffect(() => {
    const interval = setInterval(() => {
      setBars(Array(46).fill(0).map(() => 0.1 + Math.random() * 0.9));
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-end justify-center gap-[2px] h-16 mt-6">
      {bars.map((h, i) => (
        <div
          key={i}
          className="w-[3px] rounded-full transition-all duration-75"
          style={{
            height: `${h * 100}%`,
            backgroundColor: RED,
            opacity: 0.6 + h * 0.4,
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Sonar cone visual for Phase 5
   ═══════════════════════════════════════════════ */
function SonarCone() {
  return (
    <div className="absolute left-1/2 top-[58%] -translate-x-1/2 pointer-events-none">
      {[1, 2, 3].map((ring) => (
        <motion.div
          key={ring}
          className="absolute left-1/2 -translate-x-1/2 rounded-full border border-[#00d4ff]/20"
          style={{
            width: `${ring * 120}px`,
            height: `${ring * 40}px`,
            top: `${ring * 15}px`,
            background: `radial-gradient(ellipse, rgba(0,212,255,${0.08 / ring}) 0%, transparent 70%)`,
          }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 2 + ring * 0.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Drone 3D Model — S-curve + zoom lunge + mouse
   ═══════════════════════════════════════════════ */
function DroneModel({
  scrollVec,
  mouseVec,
}: {
  scrollVec: THREE.Vector2;
  mouseVec: THREE.Vector2;
}) {
  const { scene } = useGLTF('/rc_quadcopter.glb');
  const meshRef = useRef<THREE.Group>(null);
  const materialsFixed = useRef(false);

  // Fix materials once after mount — preserve textures but boost visibility
  useEffect(() => {
    if (materialsFixed.current) return;
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        materials.forEach((mat) => {
          const stdMat = mat as THREE.MeshStandardMaterial;
          // Brighten black base colors but keep textures
          if (stdMat.color && stdMat.color.r + stdMat.color.g + stdMat.color.b < 0.15) {
            stdMat.color.set('#556070');
          }
          // Boost emissive for dark scene visibility
          if (!stdMat.emissiveMap) {
            stdMat.emissive = new THREE.Color('#1a2a3a');
            stdMat.emissiveIntensity = 0.5;
          }
          stdMat.metalness = Math.min(stdMat.metalness, 0.7);
          stdMat.roughness = Math.max(stdMat.roughness, 0.25);
          stdMat.needsUpdate = true;
        });
      }
    });
    materialsFixed.current = true;
  }, [scene]);

  // Smooth values for lerping
  const smooth = useRef({ x: 0, y: 0.5, z: 0, rotX: 0, rotY: 0, mx: 0, my: 0 });
  const time = useRef(0);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    time.current += delta;

    const t = scrollVec.x; // 0..1
    const s = smooth.current;
    const lerpSpeed = Math.min(delta * 2.5, 1);

    // === S-CURVE flight path ===
    let targetX = 0;
    let targetY = 0.3;
    let targetZ = 0;

    if (t < 0.17) {
      const p = t / 0.17;
      targetX = 0;
      targetY = THREE.MathUtils.lerp(3, 0.3, p);
      targetZ = THREE.MathUtils.lerp(-2, 0, p);
    } else if (t < 0.33) {
      const p = (t - 0.17) / 0.16;
      targetX = THREE.MathUtils.lerp(0, 3, p);
      targetY = 0.2;
      targetZ = 0;
    } else if (t < 0.50) {
      const p = (t - 0.33) / 0.17;
      targetX = THREE.MathUtils.lerp(3, -3, p);
      targetY = 0.3;
      targetZ = 0;
    } else if (t < 0.67) {
      const p = (t - 0.50) / 0.17;
      targetX = THREE.MathUtils.lerp(-3, 0, p);
      targetY = 0.2;
      targetZ = THREE.MathUtils.lerp(0, 4, p);
    } else if (t < 0.83) {
      const p = (t - 0.67) / 0.16;
      targetX = THREE.MathUtils.lerp(0, 2.5, p);
      targetY = 0.3;
      targetZ = THREE.MathUtils.lerp(4, 0, p);
    } else {
      const p = (t - 0.83) / 0.17;
      targetX = THREE.MathUtils.lerp(2.5, 0, p);
      targetY = 0.2;
      targetZ = THREE.MathUtils.lerp(0, 2, p);
    }

    // Hover bob
    targetY += Math.sin(time.current * 1.8) * 0.08;

    // Lerp position
    s.x += (targetX - s.x) * lerpSpeed;
    s.y += (targetY - s.y) * lerpSpeed;
    s.z += (targetZ - s.z) * lerpSpeed;

    meshRef.current.position.set(s.x, s.y, s.z);

    // === MOUSE TRACKING ===
    const targetMX = mouseVec.x * 0.6;
    const targetMY = mouseVec.y * 0.3;
    s.mx += (targetMX - s.mx) * Math.min(delta * 1.5, 1);
    s.my += (targetMY - s.my) * Math.min(delta * 1.5, 1);

    meshRef.current.position.x += s.mx;
    meshRef.current.position.y += s.my * 0.3;

    // === ROTATION ===
    const baseRotY = t * Math.PI * 3;
    const tiltX = -s.my * 0.15;
    const tiltZ = -s.mx * 0.08;

    s.rotX += (tiltX - s.rotX) * lerpSpeed;
    s.rotY += (baseRotY - s.rotY) * lerpSpeed;

    meshRef.current.rotation.set(s.rotX, s.rotY, tiltZ);
  });

  return (
    <group ref={meshRef} scale={0.012}>
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  );
}

/* ═══════════════════════════════════════════════
   Three.js Scene
   ═══════════════════════════════════════════════ */
function Scene({
  scrollVec,
  mouseVec,
}: {
  scrollVec: THREE.Vector2;
  mouseVec: THREE.Vector2;
}) {
  return (
    <>
      <ambientLight intensity={1.0} />
      <directionalLight position={[5, 8, 5]} intensity={2.0} castShadow color="#ffffff" />
      <directionalLight position={[-4, 3, -4]} intensity={1.0} color={CYAN} />
      <pointLight position={[0, 3, 5]} intensity={1.5} color="#ffffff" distance={20} />
      <pointLight position={[2, -1, 3]} intensity={0.8} color={CYAN} distance={15} />
      <spotLight position={[0, 8, 2]} intensity={1.0} angle={0.6} penumbra={1} color="#ffffff" />

      <DroneModel scrollVec={scrollVec} mouseVec={mouseVec} />

      <ContactShadows
        position={[0, -2.5, 0]}
        opacity={0.2}
        scale={14}
        blur={3}
        far={5}
        color={CYAN}
      />

      <Environment preset="city" />
    </>
  );
}

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════ */
export default function Drone3DSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseVec = useMemo(() => new THREE.Vector2(0, 0), []);
  const scrollVec = useMemo(() => new THREE.Vector2(0, 0), []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 25,
    mass: 0.8,
  });

  // Phase opacities (6 phases)
  const p1 = useTransform(smoothScroll, [0, 0.04, 0.12, 0.16], [0, 1, 1, 0]);
  const p2 = useTransform(smoothScroll, [0.14, 0.19, 0.28, 0.32], [0, 1, 1, 0]);
  const p3 = useTransform(smoothScroll, [0.30, 0.35, 0.45, 0.49], [0, 1, 1, 0]);
  const p4 = useTransform(smoothScroll, [0.48, 0.52, 0.62, 0.66], [0, 1, 1, 0]);
  const p5 = useTransform(smoothScroll, [0.64, 0.69, 0.79, 0.83], [0, 1, 1, 0]);
  const p6 = useTransform(smoothScroll, [0.82, 0.87, 0.96, 1.0], [0, 1, 1, 1]);

  // Y offsets for text parallax
  const y1 = useTransform(smoothScroll, [0, 0.04, 0.16], [60, 0, -60]);
  const y2 = useTransform(smoothScroll, [0.14, 0.19, 0.32], [60, 0, -60]);
  const y3 = useTransform(smoothScroll, [0.30, 0.35, 0.49], [60, 0, -60]);
  const y4 = useTransform(smoothScroll, [0.48, 0.52, 0.66], [60, 0, -60]);
  const y5 = useTransform(smoothScroll, [0.64, 0.69, 0.83], [60, 0, -60]);
  const y6 = useTransform(smoothScroll, [0.82, 0.87, 1.0], [60, 0, 0]);

  // Sky background brightness (darkens mid-scroll, brightens at end)
  const skyBrightness = useTransform(smoothScroll, [0, 0.3, 0.7, 1.0], [0.4, 0.15, 0.15, 0.35]);

  // Pipe scroll to Three.js
  smoothScroll.on('change', (v) => { scrollVec.x = v; });

  // Mouse tracking
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseVec.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseVec.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, [mouseVec]);

  // Show sonar in phase 5
  const sonarOpacity = useTransform(smoothScroll, [0.66, 0.71, 0.80, 0.84], [0, 1, 1, 0]);

  return (
    <div ref={containerRef} className="h-[800vh] relative" style={{ backgroundColor: DARK }}>

      {/* ── Sticky Viewport ── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* Sky background image */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
          style={{
            backgroundImage: 'url(/background.png)',
            opacity: skyBrightness,
            filter: 'saturate(0.4)',
          }}
        />

        {/* Dark overlay gradients */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(to bottom, ${DARK} 0%, transparent 25%, transparent 75%, ${DARK} 100%)`,
          }}
        />

        {/* Radial vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at center, transparent 30%, ${DARK} 100%)` }}
        />

        {/* Three.js Canvas */}
        <div className="absolute inset-0 z-10">
          <Canvas
            camera={{ position: [0, 1, 7], fov: 40 }}
            gl={{ antialias: true, alpha: true }}
            style={{ background: 'transparent' }}
          >
            <Suspense fallback={null}>
              <Scene scrollVec={scrollVec} mouseVec={mouseVec} />
            </Suspense>
          </Canvas>
        </div>

        {/* Sonar cone — Phase 5 */}
        <motion.div style={{ opacity: sonarOpacity }} className="z-20">
          <SonarCone />
        </motion.div>

        {/* ═══════ PHASE 1 — HERO ═══════ */}
        <motion.div
          style={{ opacity: p1, y: y1 }}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none"
        >
          {/* Eyebrow */}
          <p
            className="font-[family-name:var(--font-jetbrains)] text-[11px] uppercase tracking-[0.4em] mb-8"
            style={{ color: `${CYAN}99` }}
          >
            SZK AeroX · Audio SAR Intelligence
          </p>

          {/* Headline */}
          <h1 className="font-[family-name:var(--font-bebas)] text-[6rem] md:text-[9rem] lg:text-[12rem] leading-[0.85] text-center uppercase text-white">
            When Vision
          </h1>
          <h1
            className="font-[family-name:var(--font-bebas)] text-[6rem] md:text-[9rem] lg:text-[12rem] leading-[0.85] text-center uppercase"
            style={{ color: CYAN, textShadow: `0 0 60px ${CYAN}55, 0 0 120px ${CYAN}22` }}
          >
            Fails
          </h1>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-12 flex flex-col items-center gap-3"
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <span
              className="font-[family-name:var(--font-jetbrains)] text-[9px] uppercase tracking-[0.3em]"
              style={{ color: '#849495' }}
            >
              Scroll
            </span>
            <motion.div
              className="w-[1px] h-8"
              style={{ backgroundColor: `${CYAN}66` }}
              animate={{ scaleY: [0.3, 1, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>

        {/* ═══════ PHASE 2 — PROBLEM (text LEFT, drone RIGHT) ═══════ */}
        <motion.div
          style={{ opacity: p2, y: y2 }}
          className="absolute inset-0 z-30 flex items-center pointer-events-none px-8 md:px-16 lg:px-24"
        >
          <div className="max-w-xl">
            <p
              className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-[0.35em] mb-5"
              style={{ color: `${CYAN}88` }}
            >
              01 · The Battlefield
            </p>
            <h2
              className="font-[family-name:var(--font-bebas)] text-[3.5rem] md:text-[5rem] lg:text-[6.5rem] leading-[0.9] uppercase text-white mb-6"
              style={{ textShadow: '0 4px 30px rgba(0,0,0,0.8)' }}
            >
              Disaster Zones Hide Their Victims.
            </h2>
            <p
              className="font-[family-name:var(--font-dmsans)] text-base md:text-lg font-light leading-relaxed max-w-md"
              style={{ color: 'rgba(255,255,255,0.45)' }}
            >
              Visual sensors fail where they&apos;re needed most — in smoke, fog, collapsed structures,
              and total darkness. Cameras become blind. Thermal fades. Survivors vanish.
            </p>
          </div>
        </motion.div>

        {/* ═══════ PHASE 3 — GAP (text RIGHT, drone LEFT) ═══════ */}
        <motion.div
          style={{ opacity: p3, y: y3 }}
          className="absolute inset-0 z-30 flex items-center justify-end pointer-events-none px-8 md:px-16 lg:px-24"
        >
          <div className="max-w-xl text-right">
            <p
              className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-[0.35em] mb-5"
              style={{ color: `${CYAN}88` }}
            >
              02 · The Overlooked Signal
            </p>
            <h2
              className="font-[family-name:var(--font-bebas)] text-[3.5rem] md:text-[5rem] lg:text-[6.5rem] leading-[0.9] uppercase text-white mb-6"
              style={{ textShadow: '0 4px 30px rgba(0,0,0,0.8)' }}
            >
              But Survivors Make Sound.
            </h2>
            <p
              className="font-[family-name:var(--font-dmsans)] text-base md:text-lg font-light leading-relaxed ml-auto max-w-md"
              style={{ color: 'rgba(255,255,255,0.45)' }}
            >
              Screams, calls for help, tapping on rubble — the human voice persists even at zero visibility.
              Sound travels where light cannot.
            </p>
          </div>
        </motion.div>

        {/* ═══════ PHASE 4 — CHALLENGE (centered, drone CLOSE) ═══════ */}
        <motion.div
          style={{ opacity: p4, y: y4 }}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none px-8"
        >
          <p
            className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-[0.35em] mb-5"
            style={{ color: `${RED}cc` }}
          >
            03 · The Problem
          </p>
          <h2
            className="font-[family-name:var(--font-bebas)] text-[3.5rem] md:text-[5rem] lg:text-[7rem] leading-[0.9] uppercase text-white text-center"
            style={{ textShadow: '0 4px 30px rgba(0,0,0,0.8)' }}
          >
            The Drone Itself
          </h2>
          <h2
            className="font-[family-name:var(--font-bebas)] text-[3.5rem] md:text-[5rem] lg:text-[7rem] leading-[0.9] uppercase text-center"
            style={{ color: RED, textShadow: `0 0 40px ${RED}44, 0 0 80px ${RED}22` }}
          >
            Is The Noise.
          </h2>

          {/* Chaotic waveform */}
          <ChaoticWaveform />

          <p
            className="font-[family-name:var(--font-jetbrains)] text-[9px] uppercase tracking-[0.25em] mt-4"
            style={{ color: 'rgba(255,255,255,0.25)' }}
          >
            Motor + propeller ego-noise saturating all audio channels
          </p>
        </motion.div>

        {/* ═══════ PHASE 5 — SOLUTION (text LEFT, drone RIGHT with sonar) ═══════ */}
        <motion.div
          style={{ opacity: p5, y: y5 }}
          className="absolute inset-0 z-30 flex items-center pointer-events-none px-8 md:px-16 lg:px-24"
        >
          <div className="max-w-xl">
            <p
              className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-[0.35em] mb-5"
              style={{ color: CYAN }}
            >
              04 · The Solution
            </p>
            <h2
              className="font-[family-name:var(--font-bebas)] text-[3rem] md:text-[4.5rem] lg:text-[6rem] leading-[0.9] uppercase text-white mb-6"
              style={{ textShadow: '0 4px 30px rgba(0,0,0,0.8)' }}
            >
              Acoustic Intelligence On The Wing.
            </h2>
            <p
              className="font-[family-name:var(--font-dmsans)] text-base font-light leading-relaxed max-w-md mb-8"
              style={{ color: 'rgba(255,255,255,0.4)' }}
            >
              A MEMS microphone array cancels rotor noise in real-time, enabling Direction of Arrival
              estimation for human distress signals.
            </p>

            {/* Tech stack items */}
            <div className="flex flex-col gap-5">
              {[
                { algo: 'GCC-PHAT + MUSIC Algorithm', desc: 'Direction of Arrival estimation' },
                { algo: 'Adaptive Noise Cancellation', desc: 'Real-time ego-noise removal' },
                { algo: 'CNN / CRNN Classifier', desc: 'Distress signal identification' },
              ].map((item) => (
                <div key={item.algo} className="flex items-start gap-3">
                  <div className="w-[2px] h-10 rounded-full mt-1" style={{ backgroundColor: `${CYAN}66` }} />
                  <div>
                    <p className="font-[family-name:var(--font-jetbrains)] text-[11px] uppercase tracking-[0.15em] text-white/80">
                      {item.algo}
                    </p>
                    <p className="font-[family-name:var(--font-dmsans)] text-[13px] font-light" style={{ color: 'rgba(255,255,255,0.35)' }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ═══════ PHASE 6 — OUTCOME (centered, drone close, bg brightens) ═══════ */}
        <motion.div
          style={{ opacity: p6, y: y6 }}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none px-8"
        >
          <h2
            className="font-[family-name:var(--font-bebas)] text-[3.5rem] md:text-[5rem] lg:text-[7rem] leading-[0.9] uppercase text-white text-center"
            style={{ textShadow: '0 4px 30px rgba(0,0,0,0.8)' }}
          >
            Sound Becomes Direction.
          </h2>
          <h2
            className="font-[family-name:var(--font-bebas)] text-[3.5rem] md:text-[5rem] lg:text-[7rem] leading-[0.9] uppercase text-center mb-12"
            style={{ color: CYAN, textShadow: `0 0 60px ${CYAN}44, 0 0 120px ${CYAN}22` }}
          >
            Direction Becomes Rescue.
          </h2>

          {/* Bottom badge */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-[1px]" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: CYAN, boxShadow: `0 0 12px ${CYAN}` }}
              animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <p
              className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-[0.3em]"
              style={{ color: 'rgba(255,255,255,0.35)' }}
            >
              SZK AeroX · Spectre · SAR System
            </p>
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: CYAN, boxShadow: `0 0 12px ${CYAN}` }}
              animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            />
            <div className="w-12 h-[1px]" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />
          </div>
        </motion.div>

      </div>
    </div>
  );
}
