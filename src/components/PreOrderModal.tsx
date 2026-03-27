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
      const response = await fetch('/api/preorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setFormData({ pilotName: '', email: '', cargo: '' });
          onClose();
        }, 3000);
      } else {
        alert('Transmission failed. Please try again.');
      }
    } catch (error) {
      console.error(error);
      alert('Transmission error. Check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 font-inter">
          {/* Backdrop */}
          <motion.div 
            className="absolute inset-0 bg-[#0e0e0e]/30 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal Content */}
          <motion.div 
            className="relative bg-white w-full max-w-lg rounded-[2rem] overflow-hidden shadow-2xl shadow-black/20 border border-black/5"
            initial={{ opacity: 0, y: 80, scale: 0.95, rotateX: 5 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: 40, scale: 0.95, rotateX: -5 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            style={{ perspective: 1000 }}
          >
            {/* Flying themed decorative Top / Sky area */}
            <div className={`relative h-48 bg-gradient-to-br flex items-center justify-center overflow-hidden transition-colors duration-500 ${isSuccess ? 'from-emerald-100 to-teal-200' : 'from-[#e0f2fe] to-[#bae6fd]'}`}>
              {/* Decorative flight path dash line */}
              <svg className={`absolute w-[150%] h-full opacity-30 ${isSuccess ? 'stroke-emerald-500' : 'stroke-blue-400'}`} fill="none" viewBox="0 0 400 100">
                <path d="M 0 80 Q 200 -20 400 80" strokeWidth="2" strokeDasharray="6 6" strokeLinecap="round" />
              </svg>

              {/* Minimal Drone / Arrow Icon moving up */}
              <motion.div 
                className="relative z-10 p-4 bg-white/60 backdrop-blur-sm rounded-full shadow-[0_0_20px_rgba(255,255,255,0.8)]"
                initial={{ y: 50, opacity: 0 }}
                animate={isSuccess ? { y: -100, opacity: 0 } : { y: 0, opacity: 1 }}
                transition={{ duration: isSuccess ? 1 : 0.6, type: "spring" }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={isSuccess ? "#059669" : "#005d63"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  <circle cx="5" cy="5" r="2" />
                  <circle cx="19" cy="5" r="2" />
                  <circle cx="5" cy="19" r="2" />
                  <circle cx="19" cy="19" r="2" />
                  <path d="M5 7v10" />
                  <path d="M19 7v10" />
                  <path d="M7 5h10" />
                  <path d="M7 19h10" />
                </svg>
              </motion.div>
              
              {!isSuccess && (
                <button 
                  onClick={onClose}
                  className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 bg-white/50 backdrop-blur-sm p-2 rounded-full transition-colors"
                  aria-label="Close"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>

            {/* Content Details */}
            <div className="p-8 pb-10">
              {isSuccess ? (
                <motion.div 
                  className="flex flex-col items-center text-center py-8"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <h2 className="font-calligraphy text-5xl mb-4 text-[#059669]">Flight Reserved</h2>
                  <p className="text-slate-500 text-lg">Your drone coordinates have been locked in. We will be in touch shortly.</p>
                </motion.div>
              ) : (
                <>
                  <h2 className="font-calligraphy text-4xl mb-2 text-[#1d1d1f]">Initiate Flight Sequence</h2>
                  <p className="text-slate-500 text-sm mb-6">Secure your SZK AeroX drone. Enter your coordinates below to reserve your priority shipment.</p>

                  <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs uppercase tracking-widest text-slate-400 font-semibold" htmlFor="pilotName">Pilot Designation (Name)</label>
                      <input 
                        id="pilotName" 
                        type="text" 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-slate-800" 
                        placeholder="John Doe" 
                        required 
                        value={formData.pilotName}
                        onChange={(e) => setFormData({...formData, pilotName: e.target.value})}
                      />
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <label className="text-xs uppercase tracking-widest text-slate-400 font-semibold" htmlFor="email">Comms Link (Email)</label>
                      <input 
                        id="email" 
                        type="email" 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-slate-800" 
                        placeholder="pilot@domain.com" 
                        required 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs uppercase tracking-widest text-slate-400 font-semibold" htmlFor="cargo">Drop Coordinates (Address)</label>
                      <input 
                        id="cargo" 
                        type="text" 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-slate-800" 
                        placeholder="123 Sector 4, CA" 
                        required 
                        value={formData.cargo}
                        onChange={(e) => setFormData({...formData, cargo: e.target.value})}
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="mt-4 w-full px-8 py-4 rounded-xl bg-[#1d1d1f] text-white text-lg font-medium hover:bg-black hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
                    >
                      {isSubmitting ? 'Transmitting...' : 'Confirm Takeoff'}
                      {!isSubmitting && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="22" y1="2" x2="11" y2="13"></line>
                          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
