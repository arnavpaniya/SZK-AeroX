'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import SiteFooterSections from '@/components/SiteFooterSections';

/* ═══════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════ */
const CYAN = '#00eaff';
const DARK = '#060c18';

/* ═══════════════════════════════════════════
   Fog / Particle Background
   ═══════════════════════════════════════════ */
function FogParticles() {
  const [dots, setDots] = useState<{ x: number; y: number; s: number; d: number; dl: number }[]>([]);
  useEffect(() => {
    setDots(Array.from({ length: 70 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      s: Math.random() * 2.5 + 0.6,
      d: Math.random() * 8 + 4,
      dl: Math.random() * 5,
    })));
  }, []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {dots.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s, backgroundColor: `${CYAN}33` }}
          animate={{ y: [0, -35, 0], opacity: [0, 0.6, 0] }}
          transition={{ duration: p.d, delay: p.dl, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════
   Fade-In
   ═══════════════════════════════════════════ */
function FadeIn({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 50 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   Use Case Icons
   ═══════════════════════════════════════════ */
const icons: Record<string, React.ReactNode> = {
  disaster: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={CYAN} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18" /><path d="M9 8h1" /><path d="M9 12h1" /><path d="M9 16h1" /><path d="M14 8h1" /><path d="M14 12h1" /><path d="M14 16h1" />
      <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
    </svg>
  ),
  forest: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={CYAN} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 22v-2" /><path d="M7 22v-2" /><path d="M17 13V8l-5-6-5 6v5" /><path d="M12 22V13" /><path d="M3 22h18" />
      <path d="M20 13v-2l-4-5" /><path d="M4 13v-2l4-5" />
    </svg>
  ),
  night: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={CYAN} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z" />
    </svg>
  ),
  fog: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={CYAN} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25" /><line x1="8" y1="16" x2="8.01" y2="16" /><line x1="8" y1="20" x2="8.01" y2="20" />
      <line x1="12" y1="18" x2="12.01" y2="18" /><line x1="12" y1="22" x2="12.01" y2="22" /><line x1="16" y1="16" x2="16.01" y2="16" /><line x1="16" y1="20" x2="16.01" y2="20" />
    </svg>
  ),
  urban: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={CYAN} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="6" width="8" height="16" rx="1" /><rect x="9" y="2" width="6" height="20" rx="1" /><rect x="15" y="10" width="8" height="12" rx="1" />
      <line x1="4" y1="10" x2="6" y2="10" /><line x1="4" y1="14" x2="6" y2="14" /><line x1="12" y1="6" x2="12" y2="6.01" /><line x1="12" y1="10" x2="12" y2="10.01" />
      <line x1="18" y1="14" x2="20" y2="14" />
    </svg>
  ),
  hazard: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={CYAN} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
};

/* ═══════════════════════════════════════════
   Data
   ═══════════════════════════════════════════ */
const useCases = [
  {
    key: 'disaster',
    title: 'Disaster Response',
    desc: 'Identify survivors in earthquakes, floods, and collapsed structures using advanced sensing technologies.',
    detail: 'Thermal and acoustic sensors cut through debris and dust to pinpoint trapped individuals within minutes of deployment.',
    tag: 'Earthquake · Flood · Collapse',
    image: '/uc-disaster.png',
  },
  {
    key: 'forest',
    title: 'Forest & Wilderness Search',
    desc: 'Locate missing individuals in dense forests and remote terrains where visibility is limited.',
    detail: 'Autonomous grid-sweep patterns cover vast wilderness areas, detecting heat signatures beneath canopy cover.',
    tag: 'Remote · Dense Canopy · Terrain',
    image: '/uc-forest.png',
  },
  {
    key: 'night',
    title: 'Night Operations',
    desc: 'Enable effective search missions in complete darkness using thermal detection.',
    detail: 'High-sensitivity IR arrays operate independently of visible light, providing 24/7 rescue capability.',
    tag: 'Zero Light · Thermal IR',
    image: '/uc-night.png',
  },
  {
    key: 'fog',
    title: 'Low Visibility Conditions',
    desc: 'Operate through smoke, fog, and dust where traditional methods fail.',
    detail: 'Multi-modal sensing bypasses optical blockage — sound and heat propagate where light cannot.',
    tag: 'Smoke · Fog · Dust',
    image: '/uc-fog.png',
  },
  {
    key: 'urban',
    title: 'Urban Emergency Response',
    desc: 'Provide aerial insights in accident zones and structural collapses for faster response.',
    detail: 'Real-time situational awareness feeds help incident commanders allocate resources with precision.',
    tag: 'Accidents · Structural · Crowd',
    image: '/uc-urban.png',
  },
  {
    key: 'hazard',
    title: 'Hazardous Area Exploration',
    desc: 'Safely scan dangerous or inaccessible areas without risking human lives.',
    detail: 'Chemical spills, radiation zones, and unstable terrain — the drone goes where humans cannot.',
    tag: 'Chemical · Radiation · Unstable',
    image: '/uc-hazard.png',
  },
];

/* ═══════════════════════════════════════════
   Use Case Card
   ═══════════════════════════════════════════ */
function UseCaseBlock({ uc, index }: { uc: (typeof useCases)[0]; index: number }) {
  const isLeft = index % 2 === 0;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      className={`flex flex-col ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} items-stretch gap-0 rounded-2xl overflow-hidden`}
      style={{ border: '1px solid rgba(0,234,255,0.1)', background: 'rgba(0,234,255,0.02)' }}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Visual panel */}
      <div className="relative w-full md:w-2/5 min-h-[220px] md:min-h-[320px] flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <img src={uc.image} alt={uc.title} className="absolute inset-0 w-full h-full object-cover" />
        {/* Dark overlay */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,20,40,0.6) 0%, rgba(0,10,20,0.75) 100%)' }} />
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: 'linear-gradient(rgba(0,234,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,234,255,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        {/* Icon */}
        <motion.div
          className="relative z-10 w-24 h-24 rounded-2xl flex items-center justify-center backdrop-blur-sm"
          style={{ background: 'rgba(0,234,255,0.08)', border: '1px solid rgba(0,234,255,0.2)', boxShadow: `0 0 30px ${CYAN}0d` }}
          whileHover={{ scale: 1.1, boxShadow: `0 0 50px ${CYAN}22` }}
        >
          {icons[uc.key]}
        </motion.div>
        {/* Corner HUD lines */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-[#00eaff]/20" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-[#00eaff]/20" />
        {/* Number badge */}
        <span className="absolute top-4 right-4 font-mono text-[10px] tracking-[0.3em] text-[#00eaff]/40">
          0{index + 1}
        </span>
      </div>

      {/* Text panel */}
      <div className={`flex-1 p-8 md:p-12 flex flex-col justify-center ${isLeft ? '' : 'md:text-right'}`}>
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] mb-3 block" style={{ color: `${CYAN}88` }}>
          {uc.tag}
        </span>
        <h3 className="font-sans font-bold text-2xl md:text-3xl lg:text-4xl text-white mb-4 tracking-tight">
          {uc.title}
        </h3>
        <p className="text-base md:text-lg text-[#b1c9e2] leading-relaxed font-light mb-3">
          {uc.desc}
        </p>
        <p className="text-sm text-[#7a94a8] leading-relaxed font-light">
          {uc.detail}
        </p>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */
export default function UseCasesPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const heroOp = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <main className="min-h-screen text-white overflow-hidden selection:bg-[#00eaff] selection:text-[#060c18]" style={{ backgroundColor: DARK }}>

      {/* ── NAV ── */}
      <div className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 md:px-10 py-5">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#00eaff] shadow-[0_0_10px_#00eaff] animate-pulse" />
          <Link href="/" className="font-mono text-[11px] text-[#dee3ea] uppercase tracking-[0.25em] hover:text-[#00eaff] transition-colors">SZK AeroX</Link>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="flex items-center gap-3">
          <Link href="/features" className="px-5 py-2 rounded-lg bg-[#0d1a26] text-[#dee3ea] hover:bg-[#1a2738] transition-all font-mono text-[11px] tracking-[0.2em] uppercase border border-[#dee3ea]/20">Features</Link>
          <Link href="/how-it-works" className="px-5 py-2 rounded-lg bg-[#0d1a26] text-[#dee3ea] hover:bg-[#1a2738] transition-all font-mono text-[11px] tracking-[0.2em] uppercase border border-[#dee3ea]/20">How It Works</Link>
          <Link href="/demo" className="px-5 py-2 rounded-lg bg-[#0d1a26] text-[#00eaff] hover:bg-[#122232] hover:shadow-[0_0_20px_rgba(0,238,252,0.15)] transition-all font-mono text-[11px] tracking-[0.2em] uppercase border border-[#00eaff]/30">Demo</Link>
          <Link href="/team" className="px-5 py-2 rounded-lg bg-[#0d1a26] text-[#dee3ea] hover:bg-[#1a2738] transition-all font-mono text-[11px] tracking-[0.2em] uppercase border border-[#dee3ea]/20">Team</Link>
          <Link href="/" className="px-5 py-2 rounded-lg bg-[#0d1a26] text-[#00eaff] hover:bg-[#122232] hover:shadow-[0_0_20px_rgba(0,238,252,0.15)] transition-all font-mono text-[11px] tracking-[0.2em] uppercase border border-[#00eaff]/30">Home</Link>
        </motion.div>
      </div>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/background.png)', opacity: 0.3, filter: 'saturate(0.45) brightness(0.35)' }} />
        <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${DARK} 0%, transparent 30%, transparent 70%, ${DARK} 100%)` }} />
        <motion.div className="absolute top-[-15%] left-[-10%] w-[60vw] h-[60vh] rounded-full blur-[150px] pointer-events-none" style={{ backgroundColor: `${CYAN}06` }}
          animate={{ x: [0, 50, -30, 0], y: [0, 30, -20, 0] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }} />
        <FogParticles />

        <motion.div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl" style={{ y: heroY, opacity: heroOp }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}>
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] mb-6" style={{ color: `${CYAN}88` }}>ShuZukaaa · Real-World Impact</p>
            <h1 className="font-sans font-bold text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-[0.95] tracking-tight"
              style={{ textShadow: `0 0 60px ${CYAN}22` }}>
              Where It Makes a{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00eaff] to-[#0088ff]">Difference</span>
            </h1>
          </motion.div>
          <motion.p className="font-mono text-sm md:text-base uppercase tracking-[0.2em] mb-6" style={{ color: `${CYAN}cc` }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            Real-World Applications of Intelligent Aerial Rescue Systems
          </motion.p>
          <motion.p className="text-base md:text-lg text-[#b1c9e2] leading-relaxed max-w-2xl font-light"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
            Built to operate in the most challenging environments, this UAV system enhances search and rescue missions by improving speed, accuracy, and safety.
          </motion.p>
        </motion.div>

        <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
          animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 2.5, repeat: Infinity }}>
          <span className="font-mono text-[9px] uppercase tracking-[0.3em]" style={{ color: '#849495' }}>Scroll</span>
          <div className="w-5 h-9 rounded-full border border-[#00eaff]/30 flex items-start justify-center p-1.5">
            <motion.div className="w-1 h-1 rounded-full bg-[#00eaff]" animate={{ y: [0, 14, 0] }} transition={{ duration: 2, repeat: Infinity }} />
          </div>
        </motion.div>
      </section>

      {/* ── USE CASES ── */}
      <section className="relative py-32 md:py-40 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#00eaff]/[0.025] rounded-full blur-[160px] pointer-events-none" />

        <FadeIn className="text-center mb-20 md:mb-28">
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="w-16 h-[1px]" style={{ backgroundColor: `${CYAN}44` }} />
            <span className="font-mono text-[10px] uppercase tracking-[0.35em]" style={{ color: `${CYAN}88` }}>Operational Scenarios</span>
            <div className="w-16 h-[1px]" style={{ backgroundColor: `${CYAN}44` }} />
          </div>
          <h2 className="font-sans font-bold text-4xl md:text-5xl lg:text-6xl text-white tracking-tight">
            Engineered for the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00eaff] to-[#0088ff]">Field</span>
          </h2>
        </FadeIn>

        <div className="flex flex-col gap-12 md:gap-16">
          {useCases.map((uc, i) => (
            <UseCaseBlock key={uc.key} uc={uc} index={i} />
          ))}
        </div>
      </section>

      {/* ── WHY IT MATTERS ── */}
      <section className="relative py-32 md:py-40 px-6 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#00eaff]/[0.04] rounded-full blur-[150px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <FadeIn>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-[1px]" style={{ backgroundColor: `${CYAN}44` }} />
              <motion.div className="w-2 h-2 rounded-full" style={{ backgroundColor: CYAN, boxShadow: `0 0 12px ${CYAN}` }}
                animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }} />
              <div className="w-12 h-[1px]" style={{ backgroundColor: `${CYAN}44` }} />
            </div>
            <h2 className="font-sans font-bold text-4xl md:text-5xl lg:text-7xl text-white mb-10 tracking-tight">
              Why It{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00eaff] via-[#0077ee] to-[#00eaff]">Matters</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="text-lg md:text-xl text-[#b1c9e2] leading-relaxed font-light max-w-3xl mx-auto">
              In time-critical situations, <span className="text-white font-medium">faster detection means higher chances of survival</span>. This system reduces delays, improves accuracy, and minimizes risk for rescue teams.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-32 md:py-40 px-6 overflow-hidden">
        <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${DARK}, transparent 40%, transparent 60%, ${DARK})` }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#00eaff]/[0.05] rounded-full blur-[140px] pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <FadeIn>
            <h2 className="font-sans font-bold text-3xl md:text-5xl lg:text-6xl text-white mb-6 tracking-tight" style={{ textShadow: `0 0 40px ${CYAN}22` }}>
              Enhancing Rescue Through{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00eaff] to-[#0088ff]">Technology</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-base md:text-lg text-[#b1c9e2] leading-relaxed font-light mb-12 max-w-xl mx-auto">
              See how intelligent aerial systems are transforming the way rescue teams locate and save lives.
            </p>
          </FadeIn>
          <FadeIn delay={0.2} className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link href="/features"
              className="px-10 py-4 rounded-xl text-sm uppercase tracking-[0.15em] font-mono font-semibold transition-all duration-500 hover:shadow-[0_0_30px_rgba(0,234,255,0.25)]"
              style={{ backgroundColor: `${CYAN}12`, color: CYAN, border: `1px solid ${CYAN}40` }}>
              Explore Features
            </Link>
            <Link href="/"
              className="px-10 py-4 rounded-xl text-sm uppercase tracking-[0.15em] font-mono font-bold text-[#060c18] transition-all duration-500 hover:scale-105 hover:shadow-[0_0_50px_rgba(0,234,255,0.4)]"
              style={{ backgroundColor: CYAN, boxShadow: `0 0 30px ${CYAN}33` }}>
              View Demo
            </Link>
          </FadeIn>
        </div>
      </section>

      <SiteFooterSections />
    </main>
  );
}
