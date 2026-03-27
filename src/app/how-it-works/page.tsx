'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useScroll, useTransform, useSpring } from 'framer-motion';
import Link from 'next/link';
import SiteFooterSections from '@/components/SiteFooterSections';

/* ═══════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════ */
const CYAN = '#00eaff';
const DARK = '#060c18';

/* ═══════════════════════════════════════════
   Particles
   ═══════════════════════════════════════════ */
function Particles() {
  const [dots, setDots] = useState<{ x: number; y: number; s: number; d: number; dl: number }[]>([]);
  useEffect(() => {
    setDots(Array.from({ length: 60 }, () => ({
      x: Math.random() * 100, y: Math.random() * 100,
      s: Math.random() * 2 + 0.6, d: Math.random() * 9 + 4, dl: Math.random() * 5,
    })));
  }, []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {dots.map((p, i) => (
        <motion.div key={i} className="absolute rounded-full"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s, backgroundColor: `${CYAN}33` }}
          animate={{ y: [0, -30, 0], opacity: [0, 0.6, 0] }}
          transition={{ duration: p.d, delay: p.dl, repeat: Infinity, ease: 'easeInOut' }} />
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
   Step Data
   ═══════════════════════════════════════════ */
const steps = [
  {
    title: 'Area Scanning',
    desc: 'The UAV surveys the environment using onboard sensors, covering large areas efficiently.',
    visual: 'scan',
  },
  {
    title: 'Thermal Detection',
    desc: 'Thermal imaging identifies human heat signatures even in darkness, smoke, or fog.',
    visual: 'thermal',
  },
  {
    title: 'Sound Localization',
    desc: 'Microphone arrays detect and locate human sounds such as calls for help.',
    visual: 'sound',
  },
  {
    title: 'AI Processing',
    desc: 'Onboard AI filters noise, analyzes inputs, and confirms human presence.',
    visual: 'ai',
  },
  {
    title: 'Target Identification',
    desc: 'The system pinpoints the exact location and locks onto the target.',
    visual: 'lock',
  },
  {
    title: 'Real-Time Transmission',
    desc: 'Live data is transmitted to rescue teams for immediate action.',
    visual: 'transmit',
  },
];

/* ═══════════════════════════════════════════
   Step Visual Effects
   ═══════════════════════════════════════════ */
function StepVisual({ type }: { type: string }) {
  switch (type) {
    case 'scan':
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Grid */}
          <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'linear-gradient(rgba(0,234,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,234,255,0.8) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          {/* Sweep */}
          <motion.div className="absolute w-full h-[2px]" style={{ background: `linear-gradient(to right, transparent, ${CYAN}44, transparent)` }}
            animate={{ y: [-100, 100] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }} />
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={CYAN} strokeWidth="1.2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" /><path d="M2 12h20" /></svg>
        </div>
      );
    case 'thermal':
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          {[60, 90, 120].map((s, i) => (
            <motion.div key={i} className="absolute rounded-full"
              style={{ width: s, height: s, border: `1px solid rgba(255,${100 + i * 60},0,${0.15 - i * 0.03})`, background: `radial-gradient(circle, rgba(255,${80 + i * 50},0,${0.08 - i * 0.02}), transparent)` }}
              animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }} />
          ))}
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ff6644" strokeWidth="1.5"><path d="M12 2v4" /><circle cx="12" cy="12" r="4" /><path d="M12 18v4" /><path d="M4.93 4.93l2.83 2.83" /><path d="M16.24 16.24l2.83 2.83" /><path d="M2 12h4" /><path d="M18 12h4" /><path d="M4.93 19.07l2.83-2.83" /><path d="M16.24 7.76l2.83-2.83" /></svg>
        </div>
      );
    case 'sound':
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          {[1, 2, 3].map((r) => (
            <motion.div key={r} className="absolute rounded-full" style={{ width: r * 60, height: r * 60, border: `1px solid ${CYAN}${Math.round(30 / r).toString(16)}` }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0.2, 0.6] }}
              transition={{ duration: 1.5 + r * 0.3, repeat: Infinity, ease: 'easeOut', delay: r * 0.2 }} />
          ))}
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={CYAN} strokeWidth="1.5"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /></svg>
        </div>
      );
    case 'ai':
      return (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
          {/* Neural network dots */}
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div key={i} className="absolute rounded-full"
              style={{ width: 4, height: 4, backgroundColor: `${CYAN}66`, left: `${20 + (i % 4) * 20}%`, top: `${25 + Math.floor(i / 4) * 25}%` }}
              animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 1.5, delay: i * 0.12, repeat: Infinity }} />
          ))}
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={CYAN} strokeWidth="1.3"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
        </div>
      );
    case 'lock':
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          <motion.div className="absolute w-20 h-20 border-2 border-[#00eaff]/40 rounded-sm"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.8, 0.3], borderColor: [`${CYAN}33`, `${CYAN}aa`, `${CYAN}33`] }}
            transition={{ duration: 2, repeat: Infinity }} />
          {/* Crosshair */}
          <div className="absolute w-16 h-16"><div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#00eaff]/60" /><div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#00eaff]/60" /><div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#00eaff]/60" /><div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#00eaff]/60" /></div>
          <motion.div className="w-3 h-3 rounded-full" style={{ backgroundColor: CYAN, boxShadow: `0 0 15px ${CYAN}` }}
            animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
        </div>
      );
    case 'transmit':
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          {[1, 2, 3].map((w) => (
            <motion.div key={w} className="absolute" style={{ width: w * 40, height: w * 20, borderTop: `1px solid ${CYAN}${Math.round(40 / w).toString(16).padStart(2, '0')}`, borderRadius: '50% 50% 0 0' }}
              animate={{ opacity: [0, 0.8, 0], y: [0, -10, -20] }}
              transition={{ duration: 2, delay: w * 0.3, repeat: Infinity }} />
          ))}
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={CYAN} strokeWidth="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
        </div>
      );
    default:
      return null;
  }
}

/* ═══════════════════════════════════════════
   Scroll-Driven Step Section
   ═══════════════════════════════════════════ */
function StepSection({ step, index, total }: { step: (typeof steps)[0]; index: number; total: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      className="flex flex-col md:flex-row items-center gap-8 md:gap-16"
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Visual */}
      <div className="w-full md:w-2/5 aspect-square max-w-[300px] rounded-2xl relative overflow-hidden"
        style={{ background: 'rgba(0,234,255,0.03)', border: '1px solid rgba(0,234,255,0.12)' }}>
        <StepVisual type={step.visual} />
        {/* Corner brackets */}
        <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-[#00eaff]/20" />
        <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-[#00eaff]/20" />
      </div>

      {/* Text */}
      <div className="flex-1">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-mono text-sm font-bold"
            style={{ backgroundColor: `${CYAN}15`, color: CYAN, border: `1px solid ${CYAN}33`, boxShadow: `0 0 15px ${CYAN}11` }}>
            {index + 1}
          </div>
          <div className="flex-1 h-[1px]" style={{ background: `linear-gradient(to right, ${CYAN}33, transparent)` }} />
        </div>
        <h3 className="font-sans font-bold text-2xl md:text-3xl lg:text-4xl text-white mb-3 tracking-tight">
          {step.title}
        </h3>
        <p className="text-base md:text-lg text-[#b1c9e2] leading-relaxed font-light max-w-lg">
          {step.desc}
        </p>
        {index < total - 1 && (
          <div className="hidden md:block mt-8 ml-5 w-[1px] h-16" style={{ background: `linear-gradient(to bottom, ${CYAN}22, transparent)` }} />
        )}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */
export default function HowItWorksPage() {
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
          <Link href="/use-cases" className="px-5 py-2 rounded-lg bg-[#0d1a26] text-[#dee3ea] hover:bg-[#1a2738] transition-all font-mono text-[11px] tracking-[0.2em] uppercase border border-[#dee3ea]/20">Use Cases</Link>
          <Link href="/demo" className="px-5 py-2 rounded-lg bg-[#0d1a26] text-[#00eaff] hover:bg-[#122232] hover:shadow-[0_0_20px_rgba(0,238,252,0.15)] transition-all font-mono text-[11px] tracking-[0.2em] uppercase border border-[#00eaff]/30">Demo</Link>
          <Link href="/team" className="px-5 py-2 rounded-lg bg-[#0d1a26] text-[#dee3ea] hover:bg-[#1a2738] transition-all font-mono text-[11px] tracking-[0.2em] uppercase border border-[#dee3ea]/20">Team</Link>
          <Link href="/" className="px-5 py-2 rounded-lg bg-[#0d1a26] text-[#00eaff] hover:bg-[#122232] hover:shadow-[0_0_20px_rgba(0,238,252,0.15)] transition-all font-mono text-[11px] tracking-[0.2em] uppercase border border-[#00eaff]/30">Home</Link>
        </motion.div>
      </div>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/background.png)', opacity: 0.3, filter: 'saturate(0.45) brightness(0.35)' }} />
        <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${DARK} 0%, transparent 28%, transparent 72%, ${DARK} 100%)` }} />
        <motion.div className="absolute bottom-[-10%] right-[-8%] w-[55vw] h-[55vh] rounded-full blur-[140px] pointer-events-none" style={{ backgroundColor: `${CYAN}06` }}
          animate={{ x: [0, -40, 20, 0], y: [0, 30, -20, 0] }} transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }} />
        <Particles />

        <motion.div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl" style={{ y: heroY, opacity: heroOp }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}>
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] mb-6" style={{ color: `${CYAN}88` }}>ShuZukaaa · System Overview</p>
            <h1 className="font-sans font-bold text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-[0.95] tracking-tight"
              style={{ textShadow: `0 0 60px ${CYAN}22` }}>
              How It{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00eaff] to-[#0088ff]">Works</span>
            </h1>
          </motion.div>
          <motion.p className="font-mono text-sm md:text-base uppercase tracking-[0.2em] mb-6" style={{ color: `${CYAN}cc` }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            From Detection to Rescue — In Real Time
          </motion.p>
          <motion.p className="text-base md:text-lg text-[#b1c9e2] leading-relaxed max-w-2xl font-light"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
            An intelligent system that combines sensing, AI, and real-time communication to locate and assist humans in critical situations.
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

      {/* ── STEPS ── */}
      <section className="relative py-32 md:py-40 px-6 md:px-12 lg:px-20 max-w-6xl mx-auto">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#00eaff]/[0.025] rounded-full blur-[150px] pointer-events-none" />

        <FadeIn className="text-center mb-20 md:mb-28">
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="w-16 h-[1px]" style={{ backgroundColor: `${CYAN}44` }} />
            <span className="font-mono text-[10px] uppercase tracking-[0.35em]" style={{ color: `${CYAN}88` }}>Process Flow</span>
            <div className="w-16 h-[1px]" style={{ backgroundColor: `${CYAN}44` }} />
          </div>
          <h2 className="font-sans font-bold text-4xl md:text-5xl lg:text-6xl text-white tracking-tight">
            Six Steps to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00eaff] to-[#0088ff]">Rescue</span>
          </h2>
        </FadeIn>

        <div className="flex flex-col gap-20 md:gap-28">
          {steps.map((step, i) => (
            <StepSection key={step.visual} step={step} index={i} total={steps.length} />
          ))}
        </div>
      </section>

      {/* ── SIMPLIFIED FLOW ── */}
      <section className="relative py-20 px-6 overflow-hidden">
        <FadeIn className="max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-0">
            {['Scan', 'Detect', 'Analyze', 'Locate', 'Respond'].map((label, i, arr) => (
              <div key={label} className="flex items-center gap-4">
                <div className="px-5 py-3 rounded-xl text-sm font-mono uppercase tracking-[0.15em] font-semibold"
                  style={{ backgroundColor: `${CYAN}10`, color: CYAN, border: `1px solid ${CYAN}25`, boxShadow: `0 0 15px ${CYAN}08` }}>
                  {label}
                </div>
                {i < arr.length - 1 && (
                  <div className="hidden md:flex items-center">
                    <div className="w-8 h-[1px]" style={{ background: `linear-gradient(to right, ${CYAN}66, ${CYAN}22)` }} />
                    <div className="w-0 h-0 border-t-[4px] border-b-[4px] border-l-[6px] border-transparent" style={{ borderLeftColor: `${CYAN}44` }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* ── WHY IT WORKS ── */}
      <section className="relative py-32 md:py-40 px-6 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#00eaff]/[0.04] rounded-full blur-[150px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <FadeIn>
            <h2 className="font-sans font-bold text-4xl md:text-5xl lg:text-7xl text-white mb-10 tracking-tight">
              Built for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00eaff] via-[#0077ee] to-[#00eaff]">Precision & Speed</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="text-lg md:text-xl text-[#b1c9e2] leading-relaxed font-light max-w-3xl mx-auto">
              By combining multiple sensing technologies with intelligent processing, the system{' '}
              <span className="text-white font-medium">reduces search time, improves accuracy, and enhances safety</span> for rescue teams.
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
              See It in{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00eaff] to-[#0088ff]">Action</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-base md:text-lg text-[#b1c9e2] leading-relaxed font-light mb-12 max-w-xl mx-auto">
              Explore how the full system pipeline turns sensor data into life-saving decisions in real time.
            </p>
          </FadeIn>
          <FadeIn delay={0.2} className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link href="/"
              className="px-10 py-4 rounded-xl text-sm uppercase tracking-[0.15em] font-mono font-bold text-[#060c18] transition-all duration-500 hover:scale-105 hover:shadow-[0_0_50px_rgba(0,234,255,0.4)]"
              style={{ backgroundColor: CYAN, boxShadow: `0 0 30px ${CYAN}33` }}>
              View Demo
            </Link>
            <Link href="/features"
              className="px-10 py-4 rounded-xl text-sm uppercase tracking-[0.15em] font-mono font-semibold transition-all duration-500 hover:shadow-[0_0_30px_rgba(0,234,255,0.25)]"
              style={{ backgroundColor: `${CYAN}12`, color: CYAN, border: `1px solid ${CYAN}40` }}>
              Explore Features
            </Link>
          </FadeIn>
        </div>
      </section>

      <SiteFooterSections />
    </main>
  );
}
