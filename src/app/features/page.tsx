'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import SiteFooterSections from '@/components/SiteFooterSections';
import GlobalNav from '@/components/GlobalNav';
import SimpleDrone from '@/components/SimpleDrone';

/* ═══════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════ */
const CYAN = '#00eaff';
const DARK = '#060c18';

/* ═══════════════════════════════════════════
   Animated Particle Background
   ═══════════════════════════════════════════ */
function ParticleField() {
  const [particles, setParticles] = useState<{ x: number; y: number; size: number; delay: number; dur: number }[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 80 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2.5 + 0.8,
        delay: Math.random() * 6,
        dur: Math.random() * 10 + 5,
      }))
    );
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: `${CYAN}44`,
          }}
          animate={{ y: [0, -40, 0], opacity: [0, 0.7, 0] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════
   Fade-In Section Wrapper
   ═══════════════════════════════════════════ */
function FadeIn({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   Feature Icon SVGs
   ═══════════════════════════════════════════ */
const featureIcons: Record<string, React.ReactNode> = {
  thermal: (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={CYAN} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v4" /><path d="M6.93 6.93l2.83 2.83" /><path d="M2 12h4" /><path d="M17.24 6.93l-2.83 2.83" /><path d="M22 12h-4" />
      <circle cx="12" cy="12" r="4" /><path d="M12 18v4" /><path d="M6.93 17.07l2.83-2.83" /><path d="M17.24 17.07l-2.83-2.83" />
    </svg>
  ),
  sound: (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={CYAN} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  ),
  ai: (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={CYAN} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
    </svg>
  ),
  data: (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={CYAN} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  navigation: (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={CYAN} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </svg>
  ),
  environment: (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={CYAN} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
};

/* ═══════════════════════════════════════════
   Feature Data
   ═══════════════════════════════════════════ */
const features = [
  {
    key: 'thermal',
    title: 'Thermal Imaging',
    desc: 'Detect human heat signatures even in complete darkness, smoke, or fog.',
    detail: 'Our IR sensor array captures high-fidelity thermal data across wavelengths optimized for human body temperature detection.',
  },
  {
    key: 'sound',
    title: 'Sound Source Localization',
    desc: 'Advanced microphone arrays identify and locate human sounds amidst environmental noise.',
    detail: 'MEMS mic arrays with GCC-PHAT and MUSIC algorithms deliver precise Direction of Arrival estimation in real-time.',
  },
  {
    key: 'ai',
    title: 'AI-Powered Detection',
    desc: 'Intelligent algorithms filter false signals and accurately identify human presence.',
    detail: 'CNN and CRNN classifiers trained on distress signals distinguish human calls from ambient noise with high accuracy.',
  },
  {
    key: 'data',
    title: 'Real-Time Data Transmission',
    desc: 'Instantly transmit location and insights to rescue teams for faster decision-making.',
    detail: 'Low-latency encrypted telemetry streams position, audio markers, and thermal overlays to command dashboards.',
  },
  {
    key: 'navigation',
    title: 'Autonomous Navigation',
    desc: 'Smart flight paths enable efficient area coverage with minimal manual intervention.',
    detail: 'Coverage-path algorithms combined with obstacle avoidance ensure systematic sweep of target search zones.',
  },
  {
    key: 'environment',
    title: 'Multi-Environment Operation',
    desc: 'Designed to perform reliably across forests, disaster zones, and urban environments.',
    detail: 'IP55-rated airframe with adaptive flight modes for wind, confined spaces, and low-visibility conditions.',
  },
];

/* ═══════════════════════════════════════════
   Feature Card
   ═══════════════════════════════════════════ */
function FeatureCard({ feature, index }: { feature: (typeof features)[0]; index: number }) {
  const isLeft = index % 2 === 0;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      className={`flex flex-col ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-14`}
      initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Icon / Visual */}
      <div className="flex-shrink-0">
        <motion.div
          className="w-28 h-28 md:w-36 md:h-36 rounded-2xl flex items-center justify-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(0,234,255,0.08) 0%, rgba(0,234,255,0.02) 100%)',
            border: '1px solid rgba(0,234,255,0.15)',
            boxShadow: '0 0 40px rgba(0,234,255,0.06)',
          }}
          whileHover={{ scale: 1.08, boxShadow: '0 0 60px rgba(0,234,255,0.15)' }}
          transition={{ duration: 0.4 }}
        >
          {/* Scan line effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(to bottom, transparent 0%, ${CYAN}08 50%, transparent 100%)`,
              backgroundSize: '100% 40px',
            }}
            animate={{ backgroundPosition: ['0% -40px', '0% 200px'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
          {featureIcons[feature.key]}
        </motion.div>
      </div>

      {/* Text */}
      <div className={`flex-1 ${isLeft ? 'text-left' : 'md:text-right text-left'}`}>
        <div className={`flex items-center gap-3 mb-3 ${!isLeft ? 'md:justify-end' : ''}`}>
          <div className="w-8 h-[1px]" style={{ backgroundColor: `${CYAN}55` }} />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: `${CYAN}99` }}>
            0{index + 1}
          </span>
        </div>
        <h3 className="font-sans font-bold text-2xl md:text-3xl lg:text-4xl text-white mb-3 tracking-tight">
          {feature.title}
        </h3>
        <p className="text-base md:text-lg text-[#b1c9e2] leading-relaxed font-light mb-3 max-w-lg">
          {feature.desc}
        </p>
        <p className="text-sm text-[#849495] leading-relaxed font-light max-w-lg">
          {feature.detail}
        </p>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */
export default function FeaturesPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <main
      className="min-h-screen text-white overflow-hidden selection:bg-[#00eaff] selection:text-[#060c18]"
      style={{ backgroundColor: DARK }}
    >
      <GlobalNav />

      {/* ──────────────────────────────────────
          HERO SECTION
          ────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/background.png)',
            opacity: 0.35,
            filter: 'saturate(0.5) brightness(0.4)',
          }}
        />

        {/* Floating 3D Drone */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-50 mix-blend-screen mix-blend-lighten" style={{ transform: 'scale(1.1) translateY(-5%)' }}>
          <SimpleDrone />
        </div>

        {/* Dark gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, ${DARK} 0%, transparent 30%, transparent 70%, ${DARK} 100%)`,
          }}
        />

        {/* Moving gradient accent */}
        <motion.div
          className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vh] rounded-full blur-[160px] pointer-events-none"
          style={{ backgroundColor: `${CYAN}08` }}
          animate={{ x: [0, 60, -40, 0], y: [0, 40, -30, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[-15%] right-[-10%] w-[50vw] h-[50vh] rounded-full blur-[140px] pointer-events-none"
          style={{ backgroundColor: '#4466ff06' }}
          animate={{ x: [0, -50, 30, 0], y: [0, -40, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />

        <ParticleField />

        {/* Hero Content */}
        <motion.div
          className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <p
              className="font-mono text-[10px] uppercase tracking-[0.4em] mb-6"
              style={{ color: `${CYAN}88` }}
            >
              ShuZukaaa · Advanced UAV Technology
            </p>
            <h1
              className="font-sans font-bold text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-[0.95] tracking-tight"
              style={{ textShadow: `0 0 60px ${CYAN}22, 0 4px 30px rgba(0,0,0,0.6)` }}
            >
              Powering{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00eaff] to-[#0088ff]">
                Intelligent
              </span>{' '}
              Rescue
            </h1>
          </motion.div>

          <motion.p
            className="font-mono text-sm md:text-base uppercase tracking-[0.2em] mb-6"
            style={{ color: `${CYAN}cc` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Advanced Features Built for Critical Situations
          </motion.p>

          <motion.p
            className="text-base md:text-lg text-[#b1c9e2] leading-relaxed max-w-2xl font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            Our UAV integrates cutting-edge sensing, AI, and real-time communication to operate effectively in the most challenging environments.
          </motion.p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <span className="font-mono text-[9px] uppercase tracking-[0.3em]" style={{ color: '#849495' }}>
            Explore
          </span>
          <div className="w-5 h-9 rounded-full border border-[#00eaff]/30 flex items-start justify-center p-1.5">
            <motion.div
              className="w-1 h-1 rounded-full bg-[#00eaff]"
              animate={{ y: [0, 14, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* ──────────────────────────────────────
          CORE FEATURES SECTION
          ────────────────────────────────────── */}
      <section className="relative py-32 md:py-40 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
        {/* Section glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#00eaff]/[0.03] rounded-full blur-[150px] pointer-events-none" />

        <FadeIn className="text-center mb-20 md:mb-28">
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="w-16 h-[1px]" style={{ backgroundColor: `${CYAN}44` }} />
            <span className="font-mono text-[10px] uppercase tracking-[0.35em]" style={{ color: `${CYAN}88` }}>
              Core Capabilities
            </span>
            <div className="w-16 h-[1px]" style={{ backgroundColor: `${CYAN}44` }} />
          </div>
          <h2 className="font-sans font-bold text-4xl md:text-5xl lg:text-6xl text-white tracking-tight">
            Built for the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00eaff] to-[#0088ff]">
              Impossible
            </span>
          </h2>
        </FadeIn>

        <div className="flex flex-col gap-24 md:gap-32">
          {features.map((feature, i) => (
            <FeatureCard key={feature.key} feature={feature} index={i} />
          ))}
        </div>
      </section>

      {/* ──────────────────────────────────────
          WHY IT MATTERS
          ────────────────────────────────────── */}
      <section className="relative py-32 md:py-40 px-6 overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#00eaff]/[0.04] rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <FadeIn>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-[1px]" style={{ backgroundColor: `${CYAN}44` }} />
              <motion.div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: CYAN, boxShadow: `0 0 12px ${CYAN}` }}
                animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="w-12 h-[1px]" style={{ backgroundColor: `${CYAN}44` }} />
            </div>
            <h2 className="font-sans font-bold text-4xl md:text-5xl lg:text-7xl text-white mb-10 tracking-tight">
              Why It{' '}
              <span
                className="text-transparent bg-clip-text bg-gradient-to-r from-[#00eaff] via-[#0077ee] to-[#00eaff]"
                style={{ textShadow: `0 0 40px ${CYAN}33` }}
              >
                Matters
              </span>
            </h2>
          </FadeIn>

          <FadeIn delay={0.15}>
            <p className="text-lg md:text-xl text-[#b1c9e2] leading-relaxed font-light max-w-3xl mx-auto">
              Every feature is engineered with one goal —{' '}
              <span className="text-white font-medium">to reduce rescue time and increase survival chances</span>.
              By combining multiple sensing technologies into one intelligent system, ShuZukaaa delivers a powerful
              solution for real-world emergencies.
            </p>
          </FadeIn>

          {/* Stats row */}
          <FadeIn delay={0.3}>
            <div className="grid grid-cols-3 gap-6 mt-16 max-w-2xl mx-auto">
              {[
                { value: '<5s', label: 'Detection Latency' },
                { value: '360°', label: 'Audio Coverage' },
                { value: '99.2%', label: 'Signal Accuracy' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p
                    className="font-sans font-bold text-3xl md:text-4xl mb-2"
                    style={{ color: CYAN, textShadow: `0 0 20px ${CYAN}44` }}
                  >
                    {stat.value}
                  </p>
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#849495]">{stat.label}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ──────────────────────────────────────
          CTA SECTION
          ────────────────────────────────────── */}
      <section className="relative py-32 md:py-40 px-6 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, ${DARK}, transparent 40%, transparent 60%, ${DARK})`,
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#00eaff]/[0.05] rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <FadeIn>
            <h2
              className="font-sans font-bold text-3xl md:text-5xl lg:text-6xl text-white mb-6 tracking-tight"
              style={{ textShadow: `0 0 40px ${CYAN}22` }}
            >
              Experience the Future of{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00eaff] to-[#0088ff]">
                Rescue Technology
              </span>
            </h2>
          </FadeIn>

          <FadeIn delay={0.1}>
            <p className="text-base md:text-lg text-[#b1c9e2] leading-relaxed font-light mb-12 max-w-xl mx-auto">
              See how ShuZukaaa&apos;s intelligent UAV system is transforming search and rescue operations worldwide.
            </p>
          </FadeIn>

          <FadeIn delay={0.2} className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link
              href="/team"
              className="px-10 py-4 rounded-xl text-sm uppercase tracking-[0.15em] font-mono font-semibold transition-all duration-500"
              style={{
                backgroundColor: `${CYAN}12`,
                color: CYAN,
                border: `1px solid ${CYAN}40`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${CYAN}22`;
                e.currentTarget.style.boxShadow = `0 0 30px ${CYAN}25`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = `${CYAN}12`;
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Explore Use Cases
            </Link>
            <Link
              href="/"
              className="px-10 py-4 rounded-xl text-sm uppercase tracking-[0.15em] font-mono font-bold text-[#060c18] transition-all duration-500 hover:scale-105"
              style={{
                backgroundColor: CYAN,
                boxShadow: `0 0 30px ${CYAN}33`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 0 50px ${CYAN}55`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = `0 0 30px ${CYAN}33`;
              }}
            >
              View Demo
            </Link>
          </FadeIn>
        </div>
      </section>

      <SiteFooterSections />
    </main>
  );
}
