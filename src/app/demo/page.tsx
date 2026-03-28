'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import SiteFooterSections from '@/components/SiteFooterSections';

const CYAN = '#00eaff';
const DARK = '#060c18';

function FadeIn({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

export default function DemoPage() {
  return (
    <main className="min-h-screen text-white overflow-hidden selection:bg-[#00eaff] selection:text-[#060c18]" style={{ backgroundColor: DARK }}>

      {/* ── Background elements ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/background.png)', opacity: 0.15, filter: 'saturate(0.3) brightness(0.3)' }} />
        <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${DARK}, transparent 20%, transparent 80%, ${DARK})` }} />
        <motion.div className="absolute top-[20%] left-[-5%] w-[50vw] h-[50vh] rounded-full blur-[160px]" style={{ backgroundColor: `${CYAN}05` }}
          animate={{ x: [0, 40, -20, 0], y: [0, 20, -15, 0] }} transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute bottom-[10%] right-[-5%] w-[40vw] h-[40vh] rounded-full blur-[130px]" style={{ backgroundColor: '#3344ff05' }}
          animate={{ x: [0, -30, 20, 0], y: [0, -20, 30, 0] }} transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }} />
      </div>

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-16 flex flex-col items-center text-center px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] mb-5" style={{ color: `${CYAN}88` }}>
            ShuZukaaa · Live Preview
          </p>
          <h1 className="font-sans font-bold text-5xl md:text-7xl lg:text-8xl text-white mb-5 leading-[0.95] tracking-tight"
            style={{ textShadow: `0 0 60px ${CYAN}22` }}>
            Simulation{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00eaff] to-[#0088ff]">Demo</span>
          </h1>
        </motion.div>
        <motion.p className="text-base md:text-lg text-[#b1c9e2] leading-relaxed max-w-xl font-light"
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }}>
          Experience how the UAV system works in a simulated environment.
        </motion.p>
      </section>

      {/* ── VIDEO SECTION ── */}
      <section className="relative px-6 md:px-12 pb-20 max-w-5xl mx-auto">
        <FadeIn>
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              border: '1px solid rgba(0,234,255,0.15)',
              boxShadow: `0 0 60px ${CYAN}0d, 0 0 120px ${CYAN}06, 0 20px 60px rgba(0,0,0,0.5)`,
            }}
          >
            {/* Corner HUD brackets */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t border-l border-[#00eaff]/25 z-10 pointer-events-none" />
            <div className="absolute top-3 right-3 w-6 h-6 border-t border-r border-[#00eaff]/25 z-10 pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b border-l border-[#00eaff]/25 z-10 pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-[#00eaff]/25 z-10 pointer-events-none" />

            {/* Status badge */}
            <div className="absolute top-5 right-5 z-10 flex items-center gap-2 pointer-events-none">
              <motion.div className="w-2 h-2 rounded-full bg-[#00eaff]"
                animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} />
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#00eaff]/60">Simulation</span>
            </div>

            <video
              className="w-full aspect-video bg-black"
              controls
              playsInline
              preload="metadata"
              poster=""
            >
              <source src="/simulink.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </FadeIn>

        {/* Video label */}
        <FadeIn delay={0.15}>
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="w-12 h-[1px]" style={{ backgroundColor: `${CYAN}33` }} />
            <span className="font-mono text-[9px] uppercase tracking-[0.3em]" style={{ color: '#7a94a8' }}>
              UAV Detection &amp; Tracking Workflow
            </span>
            <div className="w-12 h-[1px]" style={{ backgroundColor: `${CYAN}33` }} />
          </div>
        </FadeIn>
      </section>

      {/* ── ACTION SECTION ── */}
      <section className="relative py-28 md:py-36 px-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#00eaff]/[0.04] rounded-full blur-[130px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <FadeIn>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-[1px]" style={{ backgroundColor: `${CYAN}44` }} />
              <motion.div className="w-2 h-2 rounded-full"
                style={{ backgroundColor: CYAN, boxShadow: `0 0 12px ${CYAN}` }}
                animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }} />
              <div className="w-12 h-[1px]" style={{ backgroundColor: `${CYAN}44` }} />
            </div>
            <h2 className="font-sans font-bold text-3xl md:text-5xl lg:text-6xl text-white mb-4 tracking-tight">
              Try the Simulation{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00eaff] to-[#0088ff]">Yourself</span>
            </h2>
          </FadeIn>

          <FadeIn delay={0.1}>
            <p className="text-base md:text-lg text-[#b1c9e2] leading-relaxed font-light mb-10 max-w-lg mx-auto">
              Follow the step-by-step guide to set up and run the UAV simulation on your own machine.
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <a
              href="https://dontpad.com/simulation"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-12 py-5 rounded-xl text-base uppercase tracking-[0.15em] font-mono font-bold transition-all duration-500 hover:scale-105"
              style={{
                backgroundColor: CYAN,
                color: DARK,
                boxShadow: `0 0 40px ${CYAN}33, 0 0 80px ${CYAN}11`,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 0 60px ${CYAN}55, 0 0 120px ${CYAN}22`; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = `0 0 40px ${CYAN}33, 0 0 80px ${CYAN}11`; }}
            >
              Open Simulation Guide
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
          </FadeIn>
        </div>
      </section>

      {/* ── Bottom links ── */}
      <section className="relative py-16 px-6">
        <FadeIn className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <Link href="/features"
            className="px-8 py-3 rounded-xl text-sm uppercase tracking-[0.15em] font-mono font-semibold transition-all duration-500 hover:shadow-[0_0_25px_rgba(0,234,255,0.2)]"
            style={{ backgroundColor: `${CYAN}10`, color: CYAN, border: `1px solid ${CYAN}33` }}>
            Explore Features
          </Link>
          <Link href="/how-it-works"
            className="px-8 py-3 rounded-xl text-sm uppercase tracking-[0.15em] font-mono font-semibold transition-all duration-500 hover:shadow-[0_0_25px_rgba(0,234,255,0.2)]"
            style={{ backgroundColor: `${CYAN}10`, color: CYAN, border: `1px solid ${CYAN}33` }}>
            How It Works
          </Link>
        </FadeIn>
      </section>

      <SiteFooterSections />
    </main>
  );
}
