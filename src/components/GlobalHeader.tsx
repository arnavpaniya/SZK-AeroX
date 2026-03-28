'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import PreOrderModal from './PreOrderModal';

export default function GlobalHeader() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPreOrderOpen, setIsPreOrderOpen] = useState(false);

  // Define navigation links for the sidebar
  const links = [
    { label: 'Home', href: '/' },
    { label: 'Demo', href: '/demo' },
    { label: 'Features', href: '/features' },
    { label: 'How it Works', href: '/how-it-works' },
    { label: 'Use Cases', href: '/use-cases' },
    { label: 'Our Team', href: '/team' },
  ];

  return (
    <>
      {/* Fixed Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-6 md:p-8 pointer-events-none mix-blend-difference text-white">
           {/* Left side */}
           <div className="flex items-center gap-6 pointer-events-auto">
             <button 
               onClick={() => setIsSidebarOpen(true)}
               className="flex flex-col gap-1.5 p-2 hover:scale-105 transition-transform" 
               aria-label="Open Menu"
             >
               <div className="w-7 h-[2px] bg-current"></div>
               <div className="w-7 h-[2px] bg-current"></div>
               <div className="w-5 h-[2px] bg-current"></div>
             </button>
             <Link href="/" className="font-sans font-bold text-xl md:text-2xl uppercase tracking-[0.2em] hover:scale-[1.02] transition-transform">
               SZK AeroX
             </Link>
           </div>
           
           {/* Right side */}
           <div className="flex items-center gap-8 pointer-events-auto font-mono text-xs md:text-sm tracking-[0.15em] uppercase">
             <Link href="/team" className="hover:scale-105 transition-transform">Our Team</Link>
             <button 
               onClick={() => setIsPreOrderOpen(true)}
               className="hover:scale-105 transition-transform uppercase tracking-[0.15em]"
             >
               Pre Order
             </button>
           </div>
      </header>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            className="fixed inset-0 z-[100] flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer" 
              onClick={() => setIsSidebarOpen(false)}
            />
            {/* Sidebar content */}
            <motion.div 
              className="relative w-full max-w-sm bg-[#0a0e14] h-full shadow-2xl flex flex-col p-8 md:p-12 border-r border-[#00eaff]/10"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="self-end mb-12 text-[#849495] hover:text-white transition-colors p-2"
                aria-label="Close menu"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              
              <nav className="flex flex-col gap-8">
                {links.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className="font-sans text-2xl font-bold uppercase tracking-widest text-[#b1c9e2] hover:text-white hover:translate-x-3 transition-all duration-300"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-16 sm:mt-auto pt-8 border-t border-[#00eaff]/10">
                <button 
                  onClick={() => {
                    setIsSidebarOpen(false);
                    // Slight delay allows sidebar to close smoothly before modal pops
                    setTimeout(() => setIsPreOrderOpen(true), 200);
                  }}
                  className="w-full py-4 rounded-xl bg-[#00eaff] text-[#0a0e14] font-mono font-bold uppercase tracking-widest hover:shadow-[0_0_30px_rgba(0,238,252,0.4)] transition-all"
                >
                  Pre Order Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pre-Order Modal */}
      <PreOrderModal 
        isOpen={isPreOrderOpen} 
        onClose={() => setIsPreOrderOpen(false)} 
      />
    </>
  );
}
