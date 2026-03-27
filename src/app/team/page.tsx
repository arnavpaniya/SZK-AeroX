'use client';

import { useRef, Suspense, useEffect, useState } from 'react';
import { useScroll, useTransform, motion, useInView } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, Center } from '@react-three/drei';
import * as THREE from 'three';
import Link from 'next/link';
import SiteFooterSections from '@/components/SiteFooterSections';

/* ═══════════════════════════════════════════
   SVG Icons
   ═══════════════════════════════════════════ */
const Github = (props: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a5.4 5.4 0 0 0-1.5-3.8 5.4 5.4 0 0 0-.1-3.7s-1.2-.4-3.9 1.4a13.3 13.3 0 0 0-7 0C6.2 1.6 5 2 5 2a5.4 5.4 0 0 0-.1 3.7A5.4 5.4 0 0 0 3 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"></path></svg>;
const Linkedin = (props: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>;
const Instagram = (props: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;
const ArrowLeft = (props: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>;

/* ═══════════════════════════════════════════
   Types & Data
   ═══════════════════════════════════════════ */
type Socials = { github?: string; linkedin?: string; instagram?: string };

type TeamMember = {
  name: string;
  role: string;
  bio: string;
  image: string;
  socials: Socials;
};

const teamMembers: TeamMember[] = [
  {
    name: "Arnav Paniya",
    role: "Lead Systems Engineer",
    bio: "Architecting the core UAV framework, integrating sensor fusion pipelines and real-time decision systems.",
    image: "/arnav.jpg",
    socials: { github: "https://github.com/arnavpaniya", linkedin: "https://www.linkedin.com/in/arnav-paniya/", instagram: "https://www.instagram.com/arnav._.paniya/" }
  },
  {
    name: "Harshit N M",
    role: "Aerodynamics Specialist",
    bio: "Designing the drone airframe for maximum stability and endurance in turbulent rescue environments.",
    image: "/harshit.jpg",
    socials: { linkedin: "https://www.linkedin.com/in/harshit-n-m-b3457a2a5", instagram: "https://www.instagram.com/harshit_nm31" }
  },
  {
    name: "Rithesh S",
    role: "Avionics & Software",
    bio: "Building the onboard intelligence — from flight controllers to AI-driven audio signal processing.",
    image: "/rithesh.jpg",
    socials: { linkedin: "https://www.linkedin.com/in/rithesh-s-206112335", instagram: "https://www.instagram.com/rithesh.06" }
  },
  {
    name: "Adithya S P",
    role: "Hardware Architecture",
    bio: "Engineering the sensor arrays and power systems that keep the UAV operational in harsh conditions.",
    image: "/adithya.jpg",
    socials: { linkedin: "https://www.linkedin.com/in/adithya-s-p-066628357", instagram: "https://www.instagram.com/adithya._.10" }
  }
];

/* ═══════════════════════════════════════════
   Particle Field (Hero Background)
   ═══════════════════════════════════════════ */
function ParticleField() {
  const [particles, setParticles] = useState<{ x: number; y: number; size: number; delay: number; duration: number }[]>([]);

  useEffect(() => {
    const p = Array.from({ length: 60 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 5,
      duration: Math.random() * 8 + 4,
    }));
    setParticles(p);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-[#00eaff]/30"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════
   Section Fade-In Wrapper
   ═══════════════════════════════════════════ */
function FadeInSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   Mini Drone Model (Team Section)
   ═══════════════════════════════════════════ */
function MiniDrone({ scrollProgress }: { scrollProgress: any }) {
  const { scene } = useGLTF('/rc_quadcopter.glb');
  const groupRef = useRef<THREE.Group>(null);

  const rotY = useTransform(scrollProgress, [0, 1], [0, Math.PI * 2]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.15;
      groupRef.current.rotation.y = rotY.get();
      // Cursor reactivity
      const tiltX = (state.pointer.y * Math.PI) / 12;
      const tiltZ = -(state.pointer.x * Math.PI) / 12;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, tiltX, 0.08);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, tiltZ, 0.08);
    }
  });

  return (
    <group ref={groupRef}>
      <Center scale={1.4}>
        <primitive object={scene} rotation={[0, Math.PI, 0]} />
      </Center>
    </group>
  );
}

/* ═══════════════════════════════════════════
   Team Member Card (Glassmorphic)
   ═══════════════════════════════════════════ */
function TeamCard({ member, index }: { member: TeamMember; index: number }) {
  const isLeft = index % 2 === 0;

  return (
    <FadeInSection delay={index * 0.15}>
      <motion.div
        className={`group flex flex-col md:flex-row items-center gap-6 p-6 md:p-8 rounded-2xl
          backdrop-blur-[20px] bg-[#00eaff]/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.3)]
          hover:bg-[#00eaff]/[0.12] hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(0,234,255,0.15)]
          transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${isLeft ? 'md:self-start' : 'md:self-end'}`}
        style={{ border: '1px solid rgba(0, 234, 255, 0.12)' }}
        whileHover={{ scale: 1.02 }}
      >
        {/* Avatar */}
        <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-[#00eaff]/20 group-hover:border-[#00eaff]/50 transition-colors duration-500 shrink-0 shadow-[0_0_20px_rgba(0,234,255,0.1)]">
          <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        </div>

        {/* Info */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h3 className="font-manrope text-xl md:text-2xl font-bold text-white tracking-tight mb-1">{member.name}</h3>
          <p className="font-mono text-xs md:text-sm text-[#00eaff] uppercase tracking-[0.2em] mb-3">{member.role}</p>
          <p className="font-inter text-sm md:text-base text-[#b1c9e2] leading-relaxed mb-4 max-w-md">{member.bio}</p>

          {/* Socials */}
          <div className="flex items-center gap-3">
            {member.socials.github && (
              <a href={member.socials.github} target="_blank" rel="noopener noreferrer" className="text-[#849495] hover:text-white hover:scale-110 transition-all">
                <Github width={18} height={18} strokeWidth={1.5} />
              </a>
            )}
            {member.socials.linkedin && (
              <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#849495] hover:text-[#0a66c2] hover:scale-110 transition-all">
                <Linkedin width={18} height={18} strokeWidth={1.5} />
              </a>
            )}
            {member.socials.instagram && (
              <a href={member.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-[#849495] hover:text-[#E1306C] hover:scale-110 transition-all">
                <Instagram width={18} height={18} strokeWidth={1.5} />
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </FadeInSection>
  );
}

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */
export default function TeamPage() {
  const teamSectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: teamScroll } = useScroll({
    target: teamSectionRef,
    offset: ["start end", "end start"]
  });

  return (
    <main className="min-h-screen bg-[#060c18] text-white overflow-hidden selection:bg-[#00eaff] selection:text-[#060c18]">

      {/* ──────────────────────────────────────
          HERO SECTION
          ────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/background.png)', opacity: 0.3, filter: 'saturate(0.45) brightness(0.35)' }} />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #060c18 0%, transparent 30%, transparent 70%, #060c18 100%)' }} />
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00eaff]/[0.06] rounded-full blur-[150px] pointer-events-none" />
        <ParticleField />

        {/* Nav */}
        <div className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 md:px-10 py-5">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#00eaff] shadow-[0_0_10px_#00eaff] animate-pulse" />
            <Link href="/" className="font-mono text-[11px] text-[#dee3ea] uppercase tracking-[0.25em] hover:text-[#00eaff] transition-colors">SZK AeroX</Link>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="flex items-center gap-3">
            <Link href="/features" className="px-5 py-2 rounded-lg bg-[#0d1a26] text-[#dee3ea] hover:bg-[#1a2738] transition-all font-mono text-[11px] tracking-[0.2em] uppercase border border-[#dee3ea]/20">Features</Link>
            <Link href="/use-cases" className="px-5 py-2 rounded-lg bg-[#0d1a26] text-[#dee3ea] hover:bg-[#1a2738] transition-all font-mono text-[11px] tracking-[0.2em] uppercase border border-[#dee3ea]/20">Use Cases</Link>
            <Link href="/how-it-works" className="px-5 py-2 rounded-lg bg-[#0d1a26] text-[#dee3ea] hover:bg-[#1a2738] transition-all font-mono text-[11px] tracking-[0.2em] uppercase border border-[#dee3ea]/20">How It Works</Link>
            <Link href="/demo" className="px-5 py-2 rounded-lg bg-[#0d1a26] text-[#00eaff] hover:bg-[#122232] hover:shadow-[0_0_20px_rgba(0,238,252,0.15)] transition-all font-mono text-[11px] tracking-[0.2em] uppercase border border-[#00eaff]/30">Demo</Link>
            <Link href="/" className="px-5 py-2 rounded-lg bg-[#0d1a26] text-[#dee3ea] hover:bg-[#1a2738] transition-all font-mono text-[11px] tracking-[0.2em] uppercase border border-[#dee3ea]/20">Home</Link>
          </motion.div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl">
          <motion.h1
            className="font-sans font-bold text-6xl md:text-8xl lg:text-9xl text-white mb-6 drop-shadow-[0_0_40px_rgba(0,234,255,0.3)]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            ShuZukaaa
          </motion.h1>

          <motion.p
            className="font-mono text-sm md:text-base text-[#00eaff] uppercase tracking-[0.3em] mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Engineering Intelligence for Search &amp; Rescue
          </motion.p>

          <motion.p
            className="font-inter text-base md:text-lg text-[#b1c9e2] leading-relaxed max-w-2xl font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            We are a team of innovators building intelligent UAV systems designed to locate and assist humans in critical situations. By combining thermal imaging, sound localization, and AI-driven analysis, our technology enhances rescue operations in environments where visibility is low and time is limited.
          </motion.p>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-[#00eaff]/30 flex items-start justify-center p-1.5">
            <motion.div className="w-1.5 h-1.5 rounded-full bg-[#00eaff]" animate={{ y: [0, 16, 0] }} transition={{ duration: 2, repeat: Infinity }} />
          </div>
        </motion.div>
      </section>

      {/* ──────────────────────────────────────
          PROJECT OVERVIEW
          ────────────────────────────────────── */}
      <section className="relative py-32 px-6 md:px-12 max-w-5xl mx-auto">
        <FadeInSection>
          <h2 className="font-sans font-bold text-4xl md:text-6xl text-white mb-12 text-center drop-shadow-lg">
            What We Are Building
          </h2>
        </FadeInSection>

        <FadeInSection delay={0.1}>
          <p className="font-inter text-base md:text-lg text-[#b1c9e2] leading-relaxed mb-8 font-light">
            Our project focuses on developing an advanced unmanned aerial system capable of detecting human presence in challenging environments such as disaster zones, dense forests, and low-visibility conditions.
          </p>
        </FadeInSection>

        <FadeInSection delay={0.2}>
          <p className="font-inter text-base md:text-lg text-[#b1c9e2] leading-relaxed mb-10 font-light">
            Traditional rescue missions often face delays due to environmental limitations and lack of real-time data. Our UAV addresses this by integrating:
          </p>
        </FadeInSection>

        <FadeInSection delay={0.3}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {[
              { icon: '🌡️', text: 'Thermal imaging to detect heat signatures' },
              { icon: '🎙️', text: 'Microphone arrays for sound source localization' },
              { icon: '🧠', text: 'AI algorithms to filter noise and identify human signals' },
              { icon: '📡', text: 'Real-time transmission for faster decision-making' },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-4 p-5 rounded-xl bg-[#00eaff]/[0.04] backdrop-blur-sm"
                style={{ border: '1px solid rgba(0, 234, 255, 0.1)' }}
                whileHover={{ backgroundColor: 'rgba(0, 234, 255, 0.08)' }}
              >
                <span className="text-2xl">{item.icon}</span>
                <p className="font-inter text-[#dee3ea] text-sm md:text-base">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </FadeInSection>

        <FadeInSection delay={0.4}>
          <p className="font-inter text-base md:text-lg text-[#00eaff]/80 leading-relaxed font-light text-center italic">
            This system is designed to reduce response time, improve accuracy, and ultimately save lives.
          </p>
        </FadeInSection>
      </section>

      {/* ──────────────────────────────────────
          INTERACTIVE TEAM SECTION
          ────────────────────────────────────── */}
      <section ref={teamSectionRef} className="relative py-32 px-6 md:px-12 overflow-hidden">
        {/* Section glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00eaff]/[0.04] rounded-full blur-[120px] pointer-events-none" />

        <FadeInSection className="text-center mb-20">
          <h2 className="font-sans font-bold text-4xl md:text-6xl text-white mb-4 drop-shadow-lg">Meet the Minds</h2>
          <p className="font-inter text-[#b1c9e2] text-lg font-light max-w-xl mx-auto">
            The pioneers engineering the future of unmanned aerial vehicles at ShuZukaaa.
          </p>
        </FadeInSection>

        {/* 3D Drone + Cards Layout */}
        <div className="max-w-6xl mx-auto relative">
          {/* Centered Drone Canvas */}
          <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-0 w-[400px] h-[400px] z-0">
            <Canvas camera={{ position: [0, 0, 6], fov: 40 }}>
              <ambientLight intensity={1.5} />
              <pointLight position={[5, 5, 5]} color="#00eaff" intensity={3} />
              <pointLight position={[-5, -5, 5]} color="#b1c9e2" intensity={1.5} />
              <Suspense fallback={null}>
                <Environment preset="night" />
                <MiniDrone scrollProgress={teamScroll} />
              </Suspense>
            </Canvas>
          </div>

          {/* Team Cards – alternating left/right */}
          <div className="flex flex-col gap-8 md:gap-12 relative z-10 lg:pt-[200px]">
            {teamMembers.map((member, i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? 'md:justify-start' : 'md:justify-end'}`}>
                <div className="w-full md:w-[60%] lg:w-[45%]">
                  <TeamCard member={member} index={i} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────
          PHILOSOPHY
          ────────────────────────────────────── */}
      <section className="relative py-32 px-6 md:px-12 max-w-4xl mx-auto text-center">
        <FadeInSection>
          <h2 className="font-sans font-bold text-4xl md:text-6xl text-white mb-10 drop-shadow-lg">Our Approach</h2>
        </FadeInSection>
        <FadeInSection delay={0.15}>
          <p className="font-inter text-base md:text-lg text-[#b1c9e2] leading-relaxed mb-6 font-light">
            At ShuZukaaa, we believe technology should directly impact human lives. Our approach combines engineering precision, creative problem-solving, and a deep understanding of real-world challenges.
          </p>
        </FadeInSection>
        <FadeInSection delay={0.25}>
          <p className="font-inter text-base md:text-lg text-[#b1c9e2] leading-relaxed font-light">
            We focus on building systems that are not only innovative but also practical, reliable, and scalable in critical scenarios.
          </p>
        </FadeInSection>
      </section>

      {/* ──────────────────────────────────────
          VISION
          ────────────────────────────────────── */}
      <section className="relative py-32 px-6 md:px-12 max-w-4xl mx-auto text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00eaff]/[0.03] rounded-full blur-[100px] pointer-events-none" />
        <FadeInSection>
          <h2 className="font-sans font-bold text-4xl md:text-6xl text-white mb-10 drop-shadow-lg">Our Vision</h2>
        </FadeInSection>
        <FadeInSection delay={0.15}>
          <p className="font-inter text-xl md:text-2xl text-[#dee3ea] leading-relaxed mb-6 font-light">
            To redefine search and rescue operations using intelligent aerial systems.
          </p>
        </FadeInSection>
        <FadeInSection delay={0.25}>
          <p className="font-inter text-base md:text-lg text-[#b1c9e2] leading-relaxed font-light">
            We aim to create technology that minimizes risk, maximizes efficiency, and ensures that help reaches those in need as quickly as possible.
          </p>
        </FadeInSection>
      </section>

      {/* ──────────────────────────────────────
          CTA
          ────────────────────────────────────── */}
      <section className="relative py-32 px-6 md:px-12 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-[#0d1525] to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#00eaff]/[0.05] rounded-full blur-[130px] pointer-events-none" />

        <FadeInSection className="relative z-10">
          <h2 className="font-manrope text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-12 tracking-tight drop-shadow-2xl">
            Building Technology That<br />
            <span className="text-[#00eaff] drop-shadow-[0_0_20px_rgba(0,234,255,0.5)]">Saves Lives</span>
          </h2>
        </FadeInSection>

        <FadeInSection delay={0.2} className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-5">
          <Link
            href="/"
            className="px-10 py-4 rounded-xl bg-[#00eaff]/10 text-[#00eaff] font-mono text-sm uppercase tracking-[0.15em]
              hover:bg-[#00eaff]/20 hover:shadow-[0_0_30px_rgba(0,234,255,0.25)] transition-all duration-500"
            style={{ border: '1px solid rgba(0, 234, 255, 0.25)' }}
          >
            Explore Project
          </Link>
          <a
            href="mailto:team@shuzukaaa.com"
            className="px-10 py-4 rounded-xl bg-[#00eaff] text-[#0a0f1a] font-mono text-sm uppercase tracking-[0.15em] font-bold
              hover:shadow-[0_0_40px_rgba(0,234,255,0.5)] hover:scale-105 transition-all duration-500"
          >
            Contact Team
          </a>
        </FadeInSection>
      </section>

      <SiteFooterSections />
    </main>
  );
}
