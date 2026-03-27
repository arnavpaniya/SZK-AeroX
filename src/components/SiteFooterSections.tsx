'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const CYAN = '#00eaff';
const DARK = '#060c18';

/* ═══════════════════════════════════════════
   Fade helper
   ═══════════════════════════════════════════ */
function FI({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const r = useRef<HTMLDivElement>(null);
  const v = useInView(r, { once: true, margin: '-60px' });
  return (
    <motion.div ref={r} className={className}
      initial={{ opacity: 0, y: 40 }} animate={v ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   FAQ DATA
   ═══════════════════════════════════════════ */
const faqs = [
  { q: 'How does the UAV detect humans?', a: 'It uses a combination of thermal imaging and sound localization to identify human presence.' },
  { q: 'Can it operate at night?', a: 'Yes, thermal sensors allow detection even in complete darkness.' },
  { q: 'What environments can it work in?', a: 'It is designed for forests, disaster zones, urban areas, and low-visibility conditions.' },
  { q: 'Is the system autonomous?', a: 'It supports semi-autonomous operation with intelligent navigation and detection.' },
  { q: 'How is data shared with rescue teams?', a: 'The system transmits real-time data and coordinates to connected devices.' },
];

/* ═══════════════════════════════════════════
   FAQ ACCORDION ITEM
   ═══════════════════════════════════════════ */
function FAQItem({ q, a, idx }: { q: string; a: string; idx: number }) {
  const [open, setOpen] = useState(false);
  return (
    <FI delay={idx * 0.06}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left rounded-xl p-5 md:p-6 transition-all duration-400"
        style={{
          background: open ? 'rgba(0,234,255,0.05)' : 'rgba(0,234,255,0.02)',
          border: `1px solid ${open ? 'rgba(0,234,255,0.18)' : 'rgba(0,234,255,0.08)'}`,
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-sans font-semibold text-base md:text-lg text-white pr-4">{q}</h3>
          <motion.span
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.3 }}
            className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-lg font-light"
            style={{ color: CYAN, border: `1px solid ${CYAN}33`, backgroundColor: `${CYAN}08` }}
          >
            +
          </motion.span>
        </div>
        <AnimatePresence>
          {open && (
            <motion.p
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="text-sm md:text-base text-[#9eb3c7] leading-relaxed font-light overflow-hidden"
            >
              {a}
            </motion.p>
          )}
        </AnimatePresence>
      </button>
    </FI>
  );
}

/* ═══════════════════════════════════════════
   SOCIAL ICONS
   ═══════════════════════════════════════════ */
const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg>
);
const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
);
const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 7L2 7" /></svg>
);

/* ═══════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════ */
export default function SiteFooterSections() {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormState({ name: '', email: '', message: '' });
  };

  return (
    <>
      {/* ═══════════════════════════════════════
          FAQ SECTION
          ═══════════════════════════════════════ */}
      <section className="relative py-28 md:py-36 px-6 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#00eaff]/[0.025] rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <FI className="text-center mb-14">
            <div className="flex items-center justify-center gap-4 mb-5">
              <div className="w-14 h-[1px]" style={{ backgroundColor: `${CYAN}44` }} />
              <span className="font-mono text-[10px] uppercase tracking-[0.35em]" style={{ color: `${CYAN}88` }}>FAQ</span>
              <div className="w-14 h-[1px]" style={{ backgroundColor: `${CYAN}44` }} />
            </div>
            <h2 className="font-sans font-bold text-3xl md:text-5xl text-white tracking-tight">
              Frequently Asked{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00eaff] to-[#0088ff]">Questions</span>
            </h2>
          </FI>

          <div className="flex flex-col gap-3">
            {faqs.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} idx={i} />)}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CONTACT SECTION
          ═══════════════════════════════════════ */}
      <section className="relative py-28 md:py-36 px-6 overflow-hidden">
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-[#00eaff]/[0.03] rounded-full blur-[130px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto">
          <FI className="text-center mb-14">
            <div className="flex items-center justify-center gap-4 mb-5">
              <div className="w-14 h-[1px]" style={{ backgroundColor: `${CYAN}44` }} />
              <span className="font-mono text-[10px] uppercase tracking-[0.35em]" style={{ color: `${CYAN}88` }}>Contact</span>
              <div className="w-14 h-[1px]" style={{ backgroundColor: `${CYAN}44` }} />
            </div>
            <h2 className="font-sans font-bold text-3xl md:text-5xl text-white tracking-tight">
              Get in{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00eaff] to-[#0088ff]">Touch</span>
            </h2>
          </FI>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
            {/* Left */}
            <FI className="flex flex-col justify-center">
              <p className="text-lg text-[#b1c9e2] leading-relaxed font-light mb-8">
                Interested in the project or want to collaborate?{' '}
                <span className="text-white font-medium">Reach out to us</span>.
              </p>
              <div className="flex flex-col gap-4">
                {[
                  { icon: <MailIcon />, label: 'shuzukaaa@aerox.dev', href: 'mailto:shuzukaaa@aerox.dev' },
                  { icon: <GitHubIcon />, label: 'github.com/shuzukaaa', href: 'https://github.com' },
                  { icon: <LinkedInIcon />, label: 'linkedin.com/company/shuzukaaa', href: 'https://linkedin.com' },
                ].map((item) => (
                  <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-[#7a94a8] hover:text-[#00eaff] transition-colors font-mono">
                    <span className="text-[#00eaff]/60">{item.icon}</span>
                    {item.label}
                  </a>
                ))}
              </div>
            </FI>

            {/* Right — Form */}
            <FI delay={0.1}>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {[
                  { name: 'name', placeholder: 'Your Name', type: 'text' },
                  { name: 'email', placeholder: 'Email Address', type: 'email' },
                ].map((field) => (
                  <input
                    key={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    required
                    value={formState[field.name as keyof typeof formState]}
                    onChange={(e) => setFormState({ ...formState, [field.name]: e.target.value })}
                    className="w-full px-5 py-3.5 rounded-xl text-sm text-white placeholder-[#5a7080] font-light outline-none transition-all duration-400 focus:shadow-[0_0_20px_rgba(0,234,255,0.1)]"
                    style={{ backgroundColor: 'rgba(0,234,255,0.04)', border: '1px solid rgba(0,234,255,0.1)' }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(0,234,255,0.3)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(0,234,255,0.1)'; }}
                  />
                ))}
                <textarea
                  placeholder="Your Message"
                  required
                  rows={4}
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  className="w-full px-5 py-3.5 rounded-xl text-sm text-white placeholder-[#5a7080] font-light outline-none transition-all duration-400 resize-none focus:shadow-[0_0_20px_rgba(0,234,255,0.1)]"
                  style={{ backgroundColor: 'rgba(0,234,255,0.04)', border: '1px solid rgba(0,234,255,0.1)' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(0,234,255,0.3)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(0,234,255,0.1)'; }}
                />
                <motion.button
                  type="submit"
                  className="w-full py-4 rounded-xl text-sm uppercase tracking-[0.15em] font-mono font-bold transition-all duration-500"
                  style={{ backgroundColor: CYAN, color: DARK, boxShadow: `0 0 30px ${CYAN}33` }}
                  whileHover={{ scale: 1.02, boxShadow: `0 0 50px ${CYAN}55` }}
                  whileTap={{ scale: 0.98 }}
                >
                  {submitted ? '✓  Sent!' : 'Send Message'}
                </motion.button>
              </form>
            </FI>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════ */}
      <footer className="relative pt-20 pb-8 px-6 overflow-hidden"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(0,234,255,0.02) 40%, rgba(0,10,20,0.9))' }}>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-14">
            {/* Left — Branding */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-2 h-2 rounded-full bg-[#00eaff] shadow-[0_0_8px_#00eaff]" />
                <span className="font-mono text-sm text-white uppercase tracking-[0.2em] font-semibold">SZK AeroX</span>
              </div>
              <p className="text-sm text-[#7a94a8] font-light leading-relaxed max-w-xs">
                Enhancing rescue operations through intelligent UAV systems.
              </p>
            </div>

            {/* Center — Nav Links */}
            <div className="flex flex-col items-start md:items-center">
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] mb-4" style={{ color: `${CYAN}66` }}>Navigation</span>
              <div className="grid grid-cols-2 gap-x-10 gap-y-2.5">
                {[
                  { label: 'Home', href: '/' },
                  { label: 'Features', href: '/features' },
                  { label: 'Use Cases', href: '/use-cases' },
                  { label: 'How It Works', href: '/how-it-works' },
                  { label: 'Demo', href: '/demo' },
                  { label: 'Our Team', href: '/team' },
                ].map((link) => (
                  <Link key={link.href} href={link.href}
                    className="text-sm text-[#7a94a8] hover:text-[#00eaff] transition-colors font-light">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right — Socials */}
            <div className="flex flex-col items-start md:items-end">
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] mb-4" style={{ color: `${CYAN}66` }}>Connect</span>
              <div className="flex items-center gap-4">
                {[
                  { icon: <GitHubIcon />, href: 'https://github.com', label: 'GitHub' },
                  { icon: <LinkedInIcon />, href: 'https://linkedin.com', label: 'LinkedIn' },
                  { icon: <MailIcon />, href: 'mailto:shuzukaaa@aerox.dev', label: 'Email' },
                ].map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-[#7a94a8] hover:text-[#00eaff] transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,234,255,0.15)]"
                    style={{ backgroundColor: 'rgba(0,234,255,0.05)', border: '1px solid rgba(0,234,255,0.1)' }}>
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Divider + Copyright */}
          <div className="h-[1px] w-full mb-6" style={{ background: `linear-gradient(to right, transparent, ${CYAN}22, transparent)` }} />
          <div className="flex flex-col md:flex-row items-center justify-between gap-2">
            <p className="text-[11px] text-[#4a5f6f] font-mono">
              © 2026 ShuZukaaa · SZK AeroX. All Rights Reserved.
            </p>
            <p className="text-[11px] text-[#4a5f6f] font-mono">
              Built for Search &amp; Rescue
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
