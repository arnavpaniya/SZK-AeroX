'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import PreOrderModal from './PreOrderModal';

const FRAME_COUNT = 192;
const currentFrame = (index: number) => `/frames /${index.toString().padStart(5, '0')}.png`;

export default function HeroScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const frameIndex = useTransform(scrollYProgress, [0, 1], [1, FRAME_COUNT]);

  // === Phase Opacity Maps ===
  const initialOpacity = useTransform(frameIndex, [1, 15, 30], [1, 1, 0]);
  const initialY = useTransform(frameIndex, [15, 30], [0, -50]);

  // Spec cards
  const spec1Opacity = useTransform(frameIndex, [40, 50, 70, 80], [0, 1, 1, 0]);
  const spec1Y = useTransform(frameIndex, [40, 50, 70, 80], [30, 0, 0, -30]);
  const spec2Opacity = useTransform(frameIndex, [90, 100, 120, 130], [0, 1, 1, 0]);
  const spec2Y = useTransform(frameIndex, [90, 100, 120, 130], [30, 0, 0, -30]);
  const spec3Opacity = useTransform(frameIndex, [140, 150, 170, 180], [0, 1, 1, 0]);
  const spec3Y = useTransform(frameIndex, [140, 150, 170, 180], [30, 0, 0, -30]);

  // Final
  const finalOpacity = useTransform(frameIndex, [180, 190, 192], [0, 1, 1]);
  const finalY = useTransform(frameIndex, [180, 190, 192], [30, 0, 0]);

  // HUD elements
  const hudOpacity = useTransform(frameIndex, [25, 40, 175, 190], [0, 0.8, 0.8, 0]);
  const droneGlow = useTransform(frameIndex, [170, 192], [
    "drop-shadow(0px 0px 0px rgba(0,238,252,0))",
    "drop-shadow(0px 10px 60px rgba(0,238,252,0.3))"
  ]);

  // === Canvas Loader ===
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      img.onload = () => {
        loadedCount++;
        if (loadedCount === FRAME_COUNT) {
          setImages(loadedImages);
          renderFrame(1);
        }
      };
      loadedImages.push(img);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderFrame = (index: number) => {
    if (images.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const img = images[index - 1];
    if (img) {
      const scaleBoost = 1.10;
      const hRatio = canvas.width / img.width;
      const vRatio = canvas.height / img.height;
      const ratio = Math.max(hRatio, vRatio) * scaleBoost;
      const cx = (canvas.width - img.width * ratio) / 2;
      const cy = (canvas.height - img.height * ratio) / 2;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, img.width, img.height, cx, cy, img.width * ratio, img.height * ratio);
    }
  };

  useEffect(() => {
    return frameIndex.on("change", (latest) => renderFrame(Math.floor(latest)));
  }, [frameIndex, images]);

  useEffect(() => {
    const handleResize = () => renderFrame(Math.floor(frameIndex.get()));
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [frameIndex, images]);

  return (
    <div ref={containerRef} className="h-[250vh] bg-[#0a0e14] text-white relative z-0">

      <PreOrderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* ── Fixed Nav ── */}
      <div className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 md:px-10 py-5">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-3"
        >
          <div className="w-2 h-2 rounded-full bg-[#00eefc] shadow-[0_0_10px_#00eefc] animate-pulse" />
          <span className="font-mono text-[11px] text-[#dee3ea] uppercase tracking-[0.25em]">SZK AeroX</span>
        </motion.div>

        {/* Nav buttons */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-3"
        >
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2.5 rounded-lg bg-[#0d1a26] text-[#00eefc] hover:bg-[#122232] hover:shadow-[0_0_20px_rgba(0,238,252,0.15)] transition-all duration-400 font-mono text-[11px] tracking-[0.2em] uppercase border border-[#00eefc]/30"
          >
            Pre-Order
          </button>
          <Link
            href="/team"
            className="px-6 py-2.5 rounded-lg bg-[#0d1a26] text-[#dee3ea] hover:bg-[#1a2738] transition-all duration-400 font-mono text-[11px] tracking-[0.2em] uppercase border border-[#dee3ea]/20"
          >
            Our Team
          </Link>
        </motion.div>
      </div>

      {/* ── Sticky Viewport ── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">

        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e14] via-[#0d1220] to-[#0a0e14] -z-20 pointer-events-none" />

        {/* Ambient fog lights */}
        <div className="absolute inset-0 -z-15 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute top-[-15%] left-[-15%] w-[60vw] h-[60vh] bg-[#00eefc]/[0.06] rounded-full blur-[140px]"
            animate={{ x: [0, 40, -40, 0], y: [0, 30, -30, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-[-15%] right-[-15%] w-[60vw] h-[60vh] bg-[#b1c9e2]/[0.04] rounded-full blur-[150px]"
            animate={{ x: [0, -30, 30, 0], y: [0, -40, 40, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Canvas — drone frames */}
        <motion.canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: droneGlow }}
        />

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e14]/60 via-[#0a0e14]/20 to-[#0a0e14]/70 pointer-events-none" />

        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 50%, #0a0e14 100%)' }} />

        {/* ── HUD Chrome (visible during mid-scroll) ── */}
        <motion.div style={{ opacity: hudOpacity }} className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Top-left telemetry */}
          <div className="absolute top-20 left-6 md:left-10 font-mono text-[10px] text-[#00eefc]/60 uppercase tracking-widest leading-loose">
            <div>ALT: 12,400 FT</div>
            <div>SPD: 42 KTS</div>
            <div>HDG: 284° NW</div>
          </div>

          {/* Top-right status */}
          <div className="absolute top-20 right-6 md:right-10 text-right font-mono text-[10px] uppercase tracking-widest leading-loose">
            <div className="text-[#dee3ea]/40">Sentinel-01</div>
            <div className="flex items-center gap-1.5 justify-end">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00eefc] animate-pulse shadow-[0_0_4px_#00eefc]" />
              <span className="text-[#00eefc]/70">Active</span>
            </div>
          </div>

          {/* Bottom-right coordinates */}
          <div className="absolute bottom-6 right-6 md:right-10 text-right font-mono text-[10px] text-[#849495] uppercase tracking-wider">
            <div>LAT: 45.3211°</div>
            <div>LONG: -121.6544°</div>
          </div>

          {/* Crosshair center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 pointer-events-none">
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#00eefc]/30" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#00eefc]/30" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#00eefc]/30" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#00eefc]/30" />
          </div>

          {/* Scan lines */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,238,252,0.5) 2px, rgba(0,238,252,0.5) 3px)', backgroundSize: '100% 4px' }} />
        </motion.div>

        {/* ── Content Layers ── */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-10">

          {/* Initial Title */}
          <motion.div
            style={{ opacity: initialOpacity, y: initialY }}
            className="absolute top-[18%] flex flex-col items-center text-center pointer-events-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="font-calligraphy text-[5rem] md:text-[8rem] lg:text-[10rem] leading-none mb-4 font-bold text-white" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8), 0 0 60px rgba(0,238,252,0.25)' }}>
                SZK AeroX
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="font-mono text-[#00eefc] text-sm md:text-lg tracking-[0.3em] uppercase font-medium" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.9)' }}
            >
              Engineering Intelligence for the Unseen
            </motion.p>
          </motion.div>

          {/* Spec 1: Precision Engineered */}
          <motion.div
            style={{ opacity: spec1Opacity, y: spec1Y }}
            className="absolute left-[6%] md:left-[10%] top-[35%] max-w-md"
          >
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00eefc] shadow-[0_0_6px_#00eefc]" />
                <span className="font-mono text-[11px] text-[#00eefc]/80 uppercase tracking-[0.2em]">System Architecture</span>
              </div>
              <h2 className="font-calligraphy text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.7)' }}>
                Precision Engineered
              </h2>
              <div className="w-10 h-0.5 bg-gradient-to-r from-[#00eefc] to-transparent" />
            </div>
          </motion.div>

          {/* Spec 2: Layered Intelligence */}
          <motion.div
            style={{ opacity: spec2Opacity, y: spec2Y }}
            className="absolute right-[6%] md:right-[10%] top-[45%] max-w-md flex flex-col items-end"
          >
            <div className="p-6 text-right">
              <div className="flex items-center gap-2 justify-end mb-3">
                <span className="font-mono text-[11px] text-[#00eefc]/80 uppercase tracking-[0.2em]">Sensor Fusion</span>
                <div className="w-1.5 h-1.5 rounded-full bg-[#00eefc] shadow-[0_0_6px_#00eefc]" />
              </div>
              <h2 className="font-calligraphy text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.7)' }}>
                Layered Intelligence
              </h2>
              <div className="w-10 h-0.5 bg-gradient-to-l from-[#00eefc] to-transparent ml-auto" />
            </div>
          </motion.div>

          {/* Spec 3: Built for Real-World */}
          <motion.div
            style={{ opacity: spec3Opacity, y: spec3Y }}
            className="absolute left-[6%] md:left-[10%] top-[55%] max-w-md"
          >
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00eefc] shadow-[0_0_6px_#00eefc]" />
                <span className="font-mono text-[11px] text-[#00eefc]/80 uppercase tracking-[0.2em]">Field Operations</span>
              </div>
              <h2 className="font-calligraphy text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.7)' }}>
                Built for Real-World Challenges
              </h2>
              <div className="w-10 h-0.5 bg-gradient-to-r from-[#00eefc] to-transparent" />
            </div>
          </motion.div>

          {/* Final CTA */}
          <motion.div
            style={{ opacity: finalOpacity, y: finalY }}
            className="absolute bottom-[10%] flex flex-col items-center text-center pointer-events-auto"
          >
            <h2 className="font-calligraphy text-4xl md:text-6xl lg:text-7xl text-white mb-4 font-bold" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,238,252,0.2)' }}>
              Every layer built with purpose
            </h2>
            <p className="font-manrope text-[#d4e4f5] text-base md:text-lg font-normal mb-8 max-w-xl" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.7)' }}>
              Where precision engineering meets intelligent autonomy
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-10 py-4 rounded-xl bg-[#00eefc] text-[#0a0e14] text-base font-mono font-bold uppercase tracking-[0.15em] hover:scale-105 hover:shadow-[0_0_40px_rgba(0,238,252,0.4)] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
            >
              Explore System
            </button>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 flex flex-col items-center gap-3"
            style={{ opacity: useTransform(frameIndex, [1, 20], [0.6, 0]) }}
          >
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#849495]">Scroll to begin</span>
            <div className="w-5 h-8 rounded-full border border-[#00eefc]/30 flex items-start justify-center p-1">
              <motion.div
                className="w-1 h-1 rounded-full bg-[#00eefc]"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
