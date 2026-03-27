'use client';

import { useRef, Suspense, useMemo, useEffect, useState, useCallback } from 'react';
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
   Drag state shared across components
   ═══════════════════════════════════════════════ */
interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  deltaX: number;
  deltaY: number;
  accumulated: { x: number; y: number };
}

/* ═══════════════════════════════════════════════
   Waveform bars — Phase 4
   ═══════════════════════════════════════════════ */
function ChaoticWaveform() {
  const [bars, setBars] = useState<number[]>(Array(36).fill(0.3));
  useEffect(() => {
    const id = setInterval(() => {
      setBars(Array(36).fill(0).map(() => 0.1 + Math.random() * 0.9));
    }, 80);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex items-end justify-center gap-[2px] h-10 mt-4">
      {bars.map((h, i) => (
        <div key={i} className="w-[3px] rounded-full transition-all duration-75"
          style={{ height: `${h * 100}%`, backgroundColor: RED, opacity: 0.5 + h * 0.5 }} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Sonar cone — Phase 5
   ═══════════════════════════════════════════════ */
function SonarCone() {
  return (
    <div className="absolute left-1/2 top-[58%] -translate-x-1/2 pointer-events-none">
      {[1, 2, 3].map((ring) => (
        <motion.div key={ring}
          className="absolute left-1/2 -translate-x-1/2 rounded-full border border-[#00d4ff]/20"
          style={{
            width: `${ring * 120}px`, height: `${ring * 40}px`, top: `${ring * 15}px`,
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
   Drone 3D Model
   - Scroll-driven S-curve flight
   - Phase 2: nose-down dive
   - Phase 5: full 360° spin
   - Cursor follow (position offset)
   - Drag-to-rotate (manual orbit)
   - Dark military materials preserved
   ═══════════════════════════════════════════════ */
function DroneModel({
  scrollVec,
  mouseVec,
  dragRef,
}: {
  scrollVec: THREE.Vector2;
  mouseVec: THREE.Vector2;
  dragRef: React.MutableRefObject<DragState>;
}) {
  const { scene } = useGLTF('/rc_quadcopter.glb');
  const meshRef = useRef<THREE.Group>(null);
  const materialsFixed = useRef(false);

  /* ── Dark military material treatment ── */
  useEffect(() => {
    if (materialsFixed.current) return;
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((mat) => {
          const m = mat as THREE.MeshStandardMaterial;
          m.transparent = false;
          m.opacity = 1;
          m.depthWrite = true;
          m.depthTest = true;

          // Lift pure-invisible black to dark charcoal — keep all other original colors
          if (m.color) {
            const { r, g, b } = m.color;
            if (r + g + b < 0.08) {
              m.color.set('#1c2128');
            }
          }

          // Subtle emissive so body reads in dark scene
          if (!m.emissiveMap) {
            m.emissive = new THREE.Color('#0d1520');
            m.emissiveIntensity = 1.4;
          }

          m.metalness = Math.min((m.metalness || 0.3) + 0.15, 0.7);
          m.roughness = Math.max((m.roughness || 0.4), 0.25);
          m.needsUpdate = true;
        });
        mesh.visible = true;
        mesh.castShadow = true;
      }
    });
    materialsFixed.current = true;
  }, [scene]);

  const smooth = useRef({
    x: 0, y: 0.5, z: 0,
    rotX: 0, rotY: 0,
    mx: 0, my: 0,
    userRotX: 0, userRotY: 0,
    spinAngle: 0,
  });
  const time = useRef(0);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    time.current += delta;

    const t = scrollVec.x;
    const s = smooth.current;
    const lp = Math.min(delta * 2.2, 1);

    /* ── Flight path with nose-dive (phase 2) and spin (phase 5) ── */
    let tx = 0, ty = 0.0, tz = 0;
    let noseDive = 0;
    let doSpin = false;

    if (t < 0.17) {
      const p = t / 0.17;
      tx = 0;
      ty = THREE.MathUtils.lerp(1.2, 0.0, p);
      tz = 0;
    } else if (t < 0.33) {
      // NOSE-DOWN DIVE — bank left with nose pitched forward/down
      const p = (t - 0.17) / 0.16;
      tx = THREE.MathUtils.lerp(0, -1.0, p);
      ty = THREE.MathUtils.lerp(0.0, -0.2, p);
      tz = 0;
      noseDive = THREE.MathUtils.lerp(0, Math.PI * 0.38, Math.sin(p * Math.PI));
    } else if (t < 0.50) {
      const p = (t - 0.33) / 0.17;
      tx = THREE.MathUtils.lerp(-1.0, 1.0, p);
      ty = 0.0;
      tz = 0;
    } else if (t < 0.67) {
      const p = (t - 0.50) / 0.17;
      tx = THREE.MathUtils.lerp(1.0, 0, p);
      ty = 0.05;
      tz = THREE.MathUtils.lerp(0, 0.8, p);
    } else if (t < 0.83) {
      // FULL 360° SPIN — stays centered, continuous rotation
      const p = (t - 0.67) / 0.16;
      tx = 0;
      ty = 0.05;
      tz = THREE.MathUtils.lerp(0.8, 0, p);
      doSpin = true;
      s.spinAngle += delta * Math.PI * 2.4; // ~1.2 rotations/sec
    } else {
      const p = (t - 0.83) / 0.17;
      tx = 0;
      ty = 0.0;
      tz = 0;
      s.spinAngle *= 0.94; // spin winds down
    }

    // Hover bob
    ty += Math.sin(time.current * 1.6) * 0.055;

    // Lerp position
    s.x += (tx - s.x) * lp;
    s.y += (ty - s.y) * lp;
    s.z += (tz - s.z) * lp;
    meshRef.current.position.set(s.x, s.y, s.z);

    /* ── Cursor follow (position offset) ── */
    const tmx = mouseVec.x * 0.5;
    const tmy = mouseVec.y * 0.22;
    s.mx += (tmx - s.mx) * Math.min(delta * 2.0, 1);
    s.my += (tmy - s.my) * Math.min(delta * 2.0, 1);
    meshRef.current.position.x += s.mx;
    meshRef.current.position.y += s.my * 0.4;

    /* ── Drag-to-rotate ── */
    const drag = dragRef.current;
    if (drag.isDragging) {
      drag.accumulated.x += drag.deltaX * 0.009;
      drag.accumulated.y += drag.deltaY * 0.005;
      drag.deltaX = 0;
      drag.deltaY = 0;
    }
    if (!drag.isDragging) {
      drag.accumulated.x *= 0.97;
      drag.accumulated.y *= 0.97;
    }
    s.userRotY += (drag.accumulated.x - s.userRotY) * Math.min(delta * 5, 1);
    s.userRotX += (drag.accumulated.y - s.userRotX) * Math.min(delta * 5, 1);

    /* ── Final rotation ── */
    const finalRotY = doSpin
      ? s.spinAngle + s.userRotY
      : t * Math.PI * 1.5 + s.userRotY;

    const tiltX = noseDive + (-s.my * 0.1) + s.userRotX;
    const tiltZ = -s.mx * 0.05;

    s.rotX += (tiltX - s.rotX) * lp;
    meshRef.current.rotation.set(s.rotX, finalRotY, tiltZ);
  });

  return (
    <group ref={meshRef} scale={0.85}>
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
  dragRef,
}: {
  scrollVec: THREE.Vector2;
  mouseVec: THREE.Vector2;
  dragRef: React.MutableRefObject<DragState>;
}) {
  return (
    <>
      <ambientLight intensity={2.5} />
      <directionalLight position={[6, 10, 6]} intensity={5.0} castShadow color="#d0e8f0" />
      <directionalLight position={[-5, 4, -3]} intensity={2.5} color="#aabbcc" />
      <directionalLight position={[0, -4, 4]} intensity={1.5} color="#889aaa" />
      <pointLight position={[3, 4, 6]} intensity={4.0} color="#ffffff" distance={28} />
      <pointLight position={[-4, 2, 4]} intensity={2.5} color={CYAN} distance={22} />
      <pointLight position={[0, -2, 5]} intensity={2.0} color="#ffffff" distance={20} />
      <spotLight position={[0, 10, 3]} intensity={4.0} angle={0.5} penumbra={0.8} color="#ffffff" />

      <DroneModel scrollVec={scrollVec} mouseVec={mouseVec} dragRef={dragRef} />

      <ContactShadows position={[0, -2.8, 0]} opacity={0.1} scale={18} blur={4} far={6} color={CYAN} />
      <Environment preset="warehouse" />
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
  const [isDragging, setIsDragging] = useState(false);

  /* ── Drag state ref (mutable, no re-render on each frame) ── */
  const dragRef = useRef<DragState>({
    isDragging: false,
    startX: 0, startY: 0,
    deltaX: 0, deltaY: 0,
    accumulated: { x: 0, y: 0 },
  });

  /* ── Scroll ── */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });
  const smoothScroll = useSpring(scrollYProgress, { stiffness: 50, damping: 25, mass: 0.8 });

  const p1 = useTransform(smoothScroll, [0, 0.04, 0.12, 0.16], [0, 1, 1, 0]);
  const p2 = useTransform(smoothScroll, [0.14, 0.19, 0.28, 0.32], [0, 1, 1, 0]);
  const p3 = useTransform(smoothScroll, [0.30, 0.35, 0.45, 0.49], [0, 1, 1, 0]);
  const p4 = useTransform(smoothScroll, [0.48, 0.52, 0.62, 0.66], [0, 1, 1, 0]);
  const p5 = useTransform(smoothScroll, [0.64, 0.69, 0.79, 0.83], [0, 1, 1, 0]);
  const p6 = useTransform(smoothScroll, [0.82, 0.87, 0.96, 1.0], [0, 1, 1, 1]);

  const y1 = useTransform(smoothScroll, [0, 0.04, 0.16], [35, 0, -35]);
  const y2 = useTransform(smoothScroll, [0.14, 0.19, 0.32], [35, 0, -35]);
  const y3 = useTransform(smoothScroll, [0.30, 0.35, 0.49], [35, 0, -35]);
  const y4 = useTransform(smoothScroll, [0.48, 0.52, 0.66], [35, 0, -35]);
  const y5 = useTransform(smoothScroll, [0.64, 0.69, 0.83], [35, 0, -35]);
  const y6 = useTransform(smoothScroll, [0.82, 0.87, 1.0], [35, 0, 0]);
  const sonarOpacity = useTransform(smoothScroll, [0.66, 0.71, 0.80, 0.84], [0, 1, 1, 0]);

  smoothScroll.on('change', (v) => { scrollVec.x = v; });

  /* ── Cursor follow ── */
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseVec.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseVec.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [mouseVec]);

  /* ── Drag handlers ── */
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragRef.current.isDragging = true;
    dragRef.current.startX = e.clientX;
    dragRef.current.startY = e.clientY;
    dragRef.current.deltaX = 0;
    dragRef.current.deltaY = 0;
    setIsDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current.isDragging) return;
    dragRef.current.deltaX = e.clientX - dragRef.current.startX;
    dragRef.current.deltaY = e.clientY - dragRef.current.startY;
    dragRef.current.startX = e.clientX;
    dragRef.current.startY = e.clientY;
  }, []);

  const onPointerUp = useCallback(() => {
    dragRef.current.isDragging = false;
    setIsDragging(false);
  }, []);

  return (
    <div ref={containerRef} className="h-[800vh] relative" style={{ backgroundColor: DARK }}>

      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* Background — no dark wash, just the sky */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
          backgroundImage: 'url(/background.png)',
          opacity: 0.5,
          filter: 'saturate(0.45) brightness(0.55)',
        }} />

        {/* Only thin top/bottom edge fades — zero mid-screen darkening */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `linear-gradient(to bottom, ${DARK} 0%, transparent 7%, transparent 93%, ${DARK} 100%)`,
        }} />

        {/* Canvas — drag-to-rotate captures pointer */}
        <div
          className="absolute inset-0 z-10"
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          <Canvas
            camera={{ position: [0, 0.1, 3.2], fov: 65 }}
            gl={{ antialias: true, alpha: true }}
            style={{ background: 'transparent' }}
          >
            <Suspense fallback={null}>
              <Scene scrollVec={scrollVec} mouseVec={mouseVec} dragRef={dragRef} />
            </Suspense>
          </Canvas>
        </div>

        {/* Drag hint — fades in then out */}
        <motion.div
          className="absolute bottom-16 right-6 z-40 flex items-center gap-2 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.7, 0.7, 0] }}
          transition={{ duration: 5, delay: 1.5, times: [0, 0.15, 0.75, 1] }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={CYAN} strokeWidth="1.5">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
          </svg>
          <span className="font-[family-name:var(--font-jetbrains)] text-[8px] uppercase tracking-[0.25em]"
            style={{ color: `${CYAN}88` }}>
            Drag to rotate
          </span>
        </motion.div>

        {/* Sonar — Phase 5 */}
        <motion.div style={{ opacity: sonarOpacity }} className="absolute inset-0 z-20 pointer-events-none">
          <SonarCone />
        </motion.div>

        {/* ═══════ PHASE 1 — HERO ═══════ */}
        <motion.div style={{ opacity: p1, y: y1 }}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none">
          <p className="font-[family-name:var(--font-jetbrains)] text-[8px] uppercase tracking-[0.4em] mb-5"
            style={{ color: `${CYAN}77` }}>
            SZK AeroX · Audio SAR Intelligence
          </p>
          <h1 className="font-sans font-bold text-[6rem] md:text-[9rem] lg:text-[12rem] leading-[0.85] text-center uppercase text-white">
            When Vision
          </h1>
          <h1 className="font-sans font-bold text-[6rem] md:text-[9rem] lg:text-[12rem] leading-[0.85] text-center uppercase"
            style={{ color: CYAN, textShadow: `0 0 40px ${CYAN}55` }}>
            Fails
          </h1>
          <motion.div className="absolute bottom-9 flex flex-col items-center gap-2"
            animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 2.5, repeat: Infinity }}>
            <span className="font-[family-name:var(--font-jetbrains)] text-[7px] uppercase tracking-[0.3em]"
              style={{ color: '#849495' }}>Scroll</span>
            <motion.div className="w-[1px] h-5" style={{ backgroundColor: `${CYAN}44` }}
              animate={{ scaleY: [0.3, 1, 0.3] }} transition={{ duration: 2.5, repeat: Infinity }} />
          </motion.div>
        </motion.div>

        {/* ═══════ PHASE 2 — PROBLEM ═══════ */}
        <motion.div style={{ opacity: p2, y: y2 }}
          className="absolute inset-0 z-30 flex items-center pointer-events-none px-6 md:px-12 lg:px-16">
          <div className="max-w-xl">
            <p className="font-[family-name:var(--font-jetbrains)] text-[7px] uppercase tracking-[0.3em] mb-2"
              style={{ color: `${CYAN}77` }}>01 · The Battlefield</p>
            <h2 className="font-sans font-bold text-[3.5rem] md:text-[5rem] lg:text-[6.5rem] leading-[0.9] uppercase text-white mb-6"
              style={{ textShadow: '0 2px 16px rgba(0,0,0,0.9)' }}>
              Disaster Zones Hide Their Victims.
            </h2>
            <p className="font-[family-name:var(--font-dmsans)] text-[11px] font-light leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.45)' }}>
              Visual sensors fail in smoke, fog, collapsed structures, and darkness.
            </p>
          </div>
        </motion.div>

        {/* ═══════ PHASE 3 — GAP ═══════ */}
        <motion.div style={{ opacity: p3, y: y3 }}
          className="absolute inset-0 z-30 flex items-center justify-end pointer-events-none px-6 md:px-12 lg:px-16">
          <div className="max-w-xl text-right">
            <p className="font-[family-name:var(--font-jetbrains)] text-[7px] uppercase tracking-[0.3em] mb-2"
              style={{ color: `${CYAN}77` }}>02 · The Overlooked Signal</p>
            <h2 className="font-sans font-bold text-[3.5rem] md:text-[5rem] lg:text-[6.5rem] leading-[0.9] uppercase text-white mb-6"
              style={{ textShadow: '0 2px 16px rgba(0,0,0,0.9)' }}>
              But Survivors Make Sound.
            </h2>
            <p className="font-[family-name:var(--font-dmsans)] text-[11px] font-light leading-relaxed ml-auto"
              style={{ color: 'rgba(255,255,255,0.45)' }}>
              Sound travels where light cannot. The voice persists at zero visibility.
            </p>
          </div>
        </motion.div>

        {/* ═══════ PHASE 4 — CHALLENGE ═══════ */}
        <motion.div style={{ opacity: p4, y: y4 }}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none px-8">
          <p className="font-[family-name:var(--font-jetbrains)] text-[7px] uppercase tracking-[0.3em] mb-2"
            style={{ color: `${RED}bb` }}>03 · The Problem</p>
          <h2 className="font-sans font-bold text-[3.5rem] md:text-[5rem] lg:text-[7rem] leading-[0.9] uppercase text-white text-center"
            style={{ textShadow: '0 2px 16px rgba(0,0,0,0.9)' }}>
            The Drone Itself
          </h2>
          <h2 className="font-sans font-bold text-[3.5rem] md:text-[5rem] lg:text-[7rem] leading-[0.9] uppercase text-center"
            style={{ color: RED, textShadow: `0 0 24px ${RED}55` }}>
            Is The Noise.
          </h2>
          <ChaoticWaveform />
          <p className="font-[family-name:var(--font-jetbrains)] text-[7px] uppercase tracking-[0.18em] mt-2"
            style={{ color: 'rgba(255,255,255,0.28)' }}>
            Motor + propeller ego-noise saturating all channels
          </p>
        </motion.div>

        {/* ═══════ PHASE 5 — SOLUTION ═══════ */}
        <motion.div style={{ opacity: p5, y: y5 }}
          className="absolute inset-0 z-30 flex items-center pointer-events-none px-6 md:px-12 lg:px-16">
          <div className="max-w-xl">
            <p className="font-[family-name:var(--font-jetbrains)] text-[7px] uppercase tracking-[0.3em] mb-2"
              style={{ color: CYAN }}>04 · The Solution</p>
            <h2 className="font-sans font-bold text-[3rem] md:text-[4.5rem] lg:text-[6rem] leading-[0.9] uppercase text-white mb-6"
              style={{ textShadow: '0 2px 16px rgba(0,0,0,0.9)' }}>
              Acoustic Intelligence On The Wing.
            </h2>
            <p className="font-[family-name:var(--font-dmsans)] text-[10px] font-light leading-relaxed mb-4"
              style={{ color: 'rgba(255,255,255,0.4)' }}>
              MEMS array cancels rotor noise in real-time.
            </p>
            <div className="flex flex-col gap-2.5">
              {[
                { algo: 'GCC-PHAT + MUSIC', desc: 'Direction of Arrival' },
                { algo: 'Adaptive ANC', desc: 'Ego-noise removal' },
                { algo: 'CNN / CRNN', desc: 'Distress classification' },
              ].map((item) => (
                <div key={item.algo} className="flex items-center gap-2">
                  <div className="w-[2px] h-6 rounded-full flex-shrink-0" style={{ backgroundColor: `${CYAN}44` }} />
                  <div>
                    <p className="font-[family-name:var(--font-jetbrains)] text-[8px] uppercase tracking-[0.08em] text-white/60">{item.algo}</p>
                    <p className="font-[family-name:var(--font-dmsans)] text-[10px] font-light" style={{ color: 'rgba(255,255,255,0.3)' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ═══════ PHASE 6 — OUTCOME ═══════ */}
        <motion.div style={{ opacity: p6, y: y6 }}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none px-8">
          <h2 className="font-sans font-bold text-[3.5rem] md:text-[5rem] lg:text-[7rem] leading-[0.9] uppercase text-white text-center"
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.9)' }}>
            Sound Becomes Direction.
          </h2>
          <h2 className="font-sans font-bold text-[3.5rem] md:text-[5rem] lg:text-[7rem] leading-[0.9] uppercase text-center mb-12"
            style={{ color: CYAN, textShadow: `0 0 30px ${CYAN}44` }}>
            Direction Becomes Rescue.
          </h2>
          <div className="flex items-center gap-3">
            <div className="w-6 h-[1px]" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }} />
            <motion.div className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: CYAN, boxShadow: `0 0 6px ${CYAN}` }}
              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }} />
            <p className="font-[family-name:var(--font-jetbrains)] text-[7px] uppercase tracking-[0.22em]"
              style={{ color: 'rgba(255,255,255,0.28)' }}>SZK AeroX · Spectre · SAR</p>
            <motion.div className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: CYAN, boxShadow: `0 0 6px ${CYAN}` }}
              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }} />
            <div className="w-6 h-[1px]" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }} />
          </div>
        </motion.div>

      </div>
    </div>
  );
}
