import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../context/authStore';
import { ShieldCheck, CreditCard, Lock, ChevronLeft, CheckCircle2, Globe, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

const Checkout = () => {
  const { state } = useLocation();
  const { purchaseCourse } = useAuthStore();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Default values if state is lost on refresh
  const course = state?.course || { title: "Executive Leadership Program", price: 499, id: "default" };

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const handlePayment = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate High-End Payment Processing
    setTimeout(() => {
      setLoading(false);
      setShowSuccess(true);
      purchaseCourse(course.id);
      triggerConfetti();
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A] flex flex-col md:flex-row font-body relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-blue/10 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Left Side: Summary */}
      <div className="md:w-[45%] p-8 md:p-16 flex flex-col justify-between relative z-10 border-r border-white/5 bg-gradient-to-b from-transparent to-brand-blue/5">
        <div>
          <button 
            onClick={() => navigate(-1)} 
            className="group flex items-center gap-2 text-slate-500 mb-16 hover:text-white transition-all text-[11px] font-mono uppercase tracking-widest"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            Return to Hub
          </button>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/20">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse" />
              <span className="text-brand-blue font-mono text-[9px] uppercase tracking-widest font-bold">Secure Checkout</span>
            </div>
            
            <h1 className="text-5xl font-heading font-bold text-white leading-tight">
              Invest in your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-blue-400">future self.</span>
            </h1>

            <div className="pt-12 space-y-8">
              <div className="relative p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-xl">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-white font-bold text-xl mb-1">{course.title}</h3>
                    <p className="text-slate-500 text-xs">Full Access • Professional Certification</p>
                  </div>
                  <Globe className="text-brand-blue/40" size={24} />
                </div>
                
                <div className="flex justify-between items-end border-t border-white/5 pt-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter">Total Investment</p>
                    <div className="text-3xl font-heading font-bold text-white">${course.price}</div>
                  </div>
                  <ShieldCheck className="text-emerald-500/50 mb-1" size={20} />
                </div>
              </div>

              <div className="flex items-center gap-4 px-4 py-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                <Lock size={14} className="text-emerald-500" />
                <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                  Payments are encrypted & processed by PayStack
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-slate-600 text-[10px] font-mono uppercase mt-12">© 2026 City Cruise International / Global Enrollment</p>
      </div>

      {/* Right Side: Payment Form */}
      <div className="md:w-[55%] p-8 md:p-24 flex items-center justify-center bg-[#0B0F1A]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <form onSubmit={handlePayment} className="space-y-8">
            <div className="space-y-6">
              <div className="group space-y-2">
                <label className="text-[10px] font-mono uppercase text-slate-500 ml-1 tracking-widest">Cardholder Name</label>
                <input 
                  required 
                  className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-brand-blue/50 focus:ring-4 ring-brand-blue/10 transition-all placeholder:text-slate-700" 
                  placeholder="AS SEEN ON CARD" 
                />
              </div>

              <div className="group space-y-2 relative">
                <label className="text-[10px] font-mono uppercase text-slate-500 ml-1 tracking-widest">Card Number</label>
                <div className="relative">
                  <input 
                    required 
                    className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-14 py-4 text-white outline-none focus:border-brand-blue/50 focus:ring-4 ring-brand-blue/10 transition-all placeholder:text-slate-700" 
                    placeholder="0000 0000 0000 0000" 
                  />
                  <CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-brand-blue transition-colors" size={20} />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 flex gap-1">
                    <div className="w-6 h-4 bg-white/10 rounded-sm" />
                    <div className="w-6 h-4 bg-white/10 rounded-sm" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-slate-500 ml-1 tracking-widest">Expiry Date</label>
                  <input required className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-brand-blue/50 transition-all placeholder:text-slate-700" placeholder="MM / YY" />
                </div>
                <div className="space-y-2 relative">
                  <label className="text-[10px] font-mono uppercase text-slate-500 ml-1 tracking-widest">Security Code</label>
                  <div className="relative">
                    <input required type="password" maxLength={3} className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-brand-blue/50 transition-all placeholder:text-slate-700" placeholder="CVV" />
                    <Lock size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600" />
                  </div>
                </div>
              </div>
            </div>

            <button 
              disabled={loading}
              className="relative w-full overflow-hidden group bg-brand-blue hover:bg-blue-600 text-white py-5 rounded-[1.5rem] font-bold uppercase text-[11px] tracking-[0.2em] transition-all shadow-2xl shadow-brand-blue/20 disabled:opacity-70"
            >
              <span className={loading ? "opacity-0" : "opacity-100 transition-opacity"}>
                Confirm Payment • ${course.price}
              </span>
              
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              )}
            </button>
          </form>
        </motion.div>
      </div>

      {/* Premium Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0B0F1A]/90 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="bg-[#161B22] border border-white/10 w-full max-w-md rounded-[3rem] p-12 text-center shadow-2xl"
            >
              <div className="relative w-24 h-24 mx-auto mb-8">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12 }}
                  className="w-full h-full bg-emerald-500 rounded-full flex items-center justify-center"
                >
                  <CheckCircle2 size={48} className="text-white" />
                </motion.div>
                <motion.div 
                  animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 bg-emerald-500 rounded-full -z-10"
                />
              </div>

              <h2 className="text-3xl font-heading font-bold text-white mb-2">Payment Verified</h2>
              <p className="text-slate-400 text-sm mb-10 px-4">
                Welcome to the elite. Your access to <span className="text-white font-bold">{course.title}</span> is now active.
              </p>

              <button 
                onClick={() => navigate('/dashboard')}
                className="group w-full bg-white text-brand-dark py-5 rounded-2xl font-bold uppercase text-[11px] tracking-widest flex items-center justify-center gap-3 hover:bg-brand-blue hover:text-white transition-all"
              >
                Go to Dashboard
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Checkout;