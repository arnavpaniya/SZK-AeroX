import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function PreOrderModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [formData, setFormData] = useState({ pilotName: '', email: '', cargo: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Setup a faux artificial delay to simulate backend transmission to keep the premium feel
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const response = await fetch('/api/preorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      // Assume success for demo or handle actual response
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({ pilotName: '', email: '', cargo: '' });
        onClose();
      }, 3500);
    } catch (error) {
      console.error(error);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({ pilotName: '', email: '', cargo: '' });
        onClose();
      }, 3500);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 font-inter">
          {/* Deep Blur Backdrop */}
          <motion.div 
            className="absolute inset-0 bg-[#060c18]/80 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal Content */}
          <motion.div 
            className="relative bg-[#0a0f1a] w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl shadow-[#00eaff]/10 border border-[#00eaff]/20"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Tech Decorative Top */}
            <div className="relative h-40 flex items-center justify-center overflow-hidden border-b border-[#00eaff]/10 bg-gradient-to-b from-[#00eaff]/[0.08] to-transparent">
              {/* Scanlines layer */}
              <div 
                className="absolute inset-0 opacity-20 pointer-events-none" 
                style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,238,252,0.3) 2px, rgba(0,238,252,0.3) 3px)', backgroundSize: '100% 4px' }} 
              />
              
              {/* Ambient Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[150px] bg-[#00eaff]/20 rounded-full blur-[80px] pointer-events-none" />

              <motion.div 
                className="relative z-10 p-5 bg-[#060c18]/80 backdrop-blur border border-[#00eaff]/30 rounded-full shadow-[0_0_30px_rgba(0,238,252,0.2)]"
                initial={{ y: 20, opacity: 0 }}
                animate={isSuccess ? { y: -80, opacity: 0, scale: 0.8 } : { y: 0, opacity: 1, scale: 1 }}
                transition={{ duration: isSuccess ? 0.8 : 0.6, type: "spring" }}
              >
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={isSuccess ? "#00eaff" : "#00eaff"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_8px_rgba(0,238,252,0.8)]">
                  <path d="M12 2v20" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  <circle cx="5" cy="5" r="2" />
                  <circle cx="19" cy="5" r="2" />
                  <circle cx="5" cy="19" r="2" />
                  <circle cx="19" cy="19" r="2" />
                </svg>
              </motion.div>
              
              {!isSuccess && (
                <button 
                  onClick={onClose}
                  className="absolute top-4 right-4 text-[#b1c9e2] hover:text-white bg-[#00eaff]/10 border border-[#00eaff]/20 hover:bg-[#00eaff]/20 backdrop-blur-sm p-2 rounded-full transition-all"
                  aria-label="Close"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}

              {/* HUD Elements */}
              <div className="absolute left-6 top-6 text-xs font-mono text-[#00eaff]/40 tracking-widest uppercase">
                SYS_RDY
              </div>
              <div className="absolute right-6 bottom-6 text-xs font-mono text-[#00eaff]/40 tracking-widest uppercase flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00eaff] animate-pulse" />
                LINK OPEN
              </div>
            </div>

            {/* Content Details */}
            <div className="p-8 md:p-10 relative">
              {isSuccess ? (
                <motion.div 
                  className="flex flex-col items-center text-center py-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="w-16 h-16 rounded-full border border-[#00eaff] flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,238,252,0.3)] bg-[#00eaff]/10">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00eaff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <h2 className="font-sans font-bold text-4xl mb-4 text-white tracking-tight">System Secured</h2>
                  <p className="font-inter text-[#b1c9e2] text-lg max-w-sm leading-relaxed">Your SZK AeroX priority dropship coordinates are locked. Standby for comms.</p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="text-center mb-8">
                    <h2 className="font-sans font-bold text-3xl md:text-4xl mb-3 text-white tracking-tight">Secure Your Unit</h2>
                    <p className="font-inter text-[#b1c9e2] text-sm md:text-base max-w-sm mx-auto">Initialize pre-order sequence to reserve your SZK AeroX system.</p>
                  </div>

                  <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2">
                       <label className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-[#00eaff] font-mono flex items-center gap-2" htmlFor="pilotName">
                         <span>[01]</span> Pilot Designation
                       </label>
                       <input 
                         id="pilotName" 
                         type="text" 
                         className="w-full px-5 py-4 bg-[#0a0f1a] border border-[#2a3b4c] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#00eaff] focus:border-[#00eaff] transition-all text-white placeholder-[#2a3b4c] font-inter text-base flex-1 shadow-inner shadow-black/50" 
                         placeholder="Lead Engineer / Buyer Name" 
                         required 
                         value={formData.pilotName}
                         onChange={(e) => setFormData({...formData, pilotName: e.target.value})}
                       />
                     </div>
                     
                     <div className="flex flex-col gap-2">
                       <label className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-[#00eaff] font-mono flex items-center gap-2" htmlFor="email">
                         <span>[02]</span> Comms Link
                       </label>
                       <input 
                         id="email" 
                         type="email" 
                         className="w-full px-5 py-4 bg-[#0a0f1a] border border-[#2a3b4c] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#00eaff] focus:border-[#00eaff] transition-all text-white placeholder-[#2a3b4c] font-inter text-base shadow-inner shadow-black/50" 
                         placeholder="shuzukaaa@aerox.dev" 
                         required 
                         value={formData.email}
                         onChange={(e) => setFormData({...formData, email: e.target.value})}
                       />
                     </div>

                     <div className="flex flex-col gap-2">
                       <label className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-[#00eaff] font-mono flex items-center gap-2" htmlFor="cargo">
                         <span>[03]</span> Drop Coordinates
                       </label>
                       <input 
                         id="cargo" 
                         type="text" 
                         className="w-full px-5 py-4 bg-[#0a0f1a] border border-[#2a3b4c] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#00eaff] focus:border-[#00eaff] transition-all text-white placeholder-[#2a3b4c] font-inter text-base shadow-inner shadow-black/50" 
                         placeholder="Delivery Location / Coordinates" 
                         required 
                         value={formData.cargo}
                         onChange={(e) => setFormData({...formData, cargo: e.target.value})}
                       />
                     </div>

                    <div className="mt-4 pt-4 border-t border-white/5">
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full px-8 py-4 rounded-xl bg-[#00eaff] text-[#0a0e14] font-mono text-sm uppercase tracking-widest font-bold hover:bg-[#33eeff] hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(0,238,252,0.4)] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:scale-100 disabled:hover:shadow-none"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-[#0a0e14]/30 border-t-[#0a0e14] rounded-full animate-spin" />
                            Transmitting...
                          </>
                        ) : (
                          <>
                            Confirm Payload
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="22" y1="2" x2="11" y2="13"></line>
                              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
