'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import PreOrderModal from './PreOrderModal';

const CYAN = '#2563eb';
const DARK = '#f8fafc';

export default function GlobalNav() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '/features' },
    { label: 'Use Cases', href: '/use-cases' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Demo', href: '/demo' },
  ];

  return (
    <>
      <PreOrderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* TOP DESKTOP NAV */}
      <motion.div
        className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 md:px-10 py-5 transition-all duration-300 ${
          scrolled ? 'bg-slate-50/80 backdrop-blur-md border-b border-blue-600/10 py-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)]' : ''
        }`}
      >
        {/* Left Side: Sidebar Toggle & Branding */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="group flex flex-col justify-center gap-1.5 w-10 h-10 rounded-lg bg-slate-100/50 border border-blue-600/20 hover:border-blue-600/50 transition-colors p-2.5"
            aria-label="Open Sidebar"
          >
            <div className="w-full h-[2px] bg-blue-600 rounded-full transition-transform group-hover:scale-x-110 origin-left" />
            <div className="w-2/3 h-[2px] bg-blue-600 rounded-full transition-transform group-hover:scale-x-125 origin-left" />
            <div className="w-full h-[2px] bg-blue-600 rounded-full transition-transform group-hover:scale-x-110 origin-left" />
          </button>

          <Link href="/" className="flex items-center gap-3 relative group">
            <div className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_10px_#3b82f6] animate-pulse" />
            <span className="font-mono text-[11px] text-slate-700 uppercase tracking-[0.25em] group-hover:text-blue-600 transition-colors">
              SZK AeroX
            </span>
          </Link>
        </motion.div>

        {/* Right Side Desktop Links */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="hidden md:flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2 text-blue-600 hover:text-slate-900 transition-colors font-mono text-[11px] tracking-[0.2em] uppercase"
          >
            Pre-Order
          </button>
          <Link href="/team" className="px-5 py-2 text-slate-700 hover:text-blue-600 transition-colors font-mono text-[11px] tracking-[0.2em] uppercase">
            Our Team
          </Link>
          <Link href="/team#contact" className="px-5 py-2 text-slate-700 hover:text-blue-600 transition-colors font-mono text-[11px] tracking-[0.2em] uppercase">
            Contact Us
          </Link>
          <Link href="/team#faq" className="px-5 py-2 text-slate-700 hover:text-blue-600 transition-colors font-mono text-[11px] tracking-[0.2em] uppercase">
            FAQ
          </Link>
        </motion.div>
      </motion.div>

      {/* SIDEBAR DRAWER */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm"
              onClick={() => setIsSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 z-[200] w-[300px] bg-slate-50 border-r border-blue-600/20 shadow-[20px_0_60px_rgba(0,0,0,0.8)] flex flex-col pt-24 px-8 pb-10"
            >
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="absolute top-6 right-6 p-2 text-slate-500 hover:text-blue-600 transition-colors"
                aria-label="Close Sidebar"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              <div className="flex flex-col gap-6 w-full">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-blue-600/60 mb-4">
                  Navigation Menu
                </span>
                
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className={`text-2xl font-sans font-bold tracking-tight transition-all duration-300 hover:text-blue-600 hover:translate-x-2 block ${
                        pathname === link.href ? 'text-blue-600' : 'text-slate-900'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-auto flex flex-col gap-4 md:hidden">
                <div className="w-full h-[1px] bg-blue-600/10 mb-4" />
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-3 text-blue-600 hover:text-slate-900 font-mono text-[11px] tracking-[0.2em] uppercase transition-colors"
                >
                  Pre-Order
                </button>
                <Link href="/team" className="w-full text-center py-3 text-slate-700 hover:text-blue-600 font-mono text-[11px] tracking-[0.2em] uppercase transition-colors">
                  Our Team
                </Link>
                <div className="flex justify-between gap-4 mt-2">
                  <Link href="/team#contact" className="flex-1 text-center py-3 text-slate-700 hover:text-blue-600 font-mono text-[11px] tracking-[0.2em] uppercase transition-colors">
                    Contact Us
                  </Link>
                  <Link href="/team#faq" className="flex-1 text-center py-3 text-slate-700 hover:text-blue-600 font-mono text-[11px] tracking-[0.2em] uppercase transition-colors">
                    FAQ
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
