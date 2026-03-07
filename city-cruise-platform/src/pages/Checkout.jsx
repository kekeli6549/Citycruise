import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../context/authStore';
import { initializePayment } from '../api/paymentService';
import { ShieldCheck, CreditCard, Lock, ChevronLeft, CheckCircle2, Globe, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

const Checkout = () => {
  const { state } = useLocation();
  const { purchaseCourse } = useAuthStore();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  // --- VALIDATION HELPERS ---
  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, ''); // Remove non-digits
    let formatted = val.match(/.{1,4}/g)?.join(' ') || ''; // Add space every 4 digits
    setFormData({ ...formData, cardNumber: formatted.substring(0, 19) });
  };

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (val.length >= 3) {
      val = val.substring(0, 2) + ' / ' + val.substring(2, 4);
    }
    setFormData({ ...formData, expiry: val.substring(0, 7) });
  };

  const handleCvvChange = (e) => {
    const val = e.target.value.replace(/\D/g, ''); // Digits only
    setFormData({ ...formData, cvv: val.substring(0, 3) });
  };

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

  const [error, setError] = useState(null);

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await initializePayment(course.id);
      const data = response.data || response;
      
      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        // Fallback for mock/local testing if URL isn't provided
        setTimeout(() => {
          setLoading(false);
          setShowSuccess(true);
          purchaseCourse(course.id);
          triggerConfetti();
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Payment initialization failed. Please try again.");
      setLoading(true);
      setTimeout(() => setLoading(false), 1000); // UI feedback
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A] flex flex-col lg:flex-row font-body relative overflow-x-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-[-10%] right-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-brand-blue/10 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Left Side: Summary */}
      <div className="w-full lg:w-[45%] p-6 md:p-12 lg:p-16 flex flex-col justify-between relative z-10 border-b lg:border-b-0 lg:border-r border-white/5 bg-gradient-to-b from-transparent to-brand-blue/5">
        <div>
          <button 
            onClick={() => navigate(-1)} 
            className="group flex items-center gap-2 text-slate-500 mb-8 lg:mb-16 hover:text-white transition-all text-[10px] md:text-[11px] font-mono uppercase tracking-widest"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            Return to Hub
          </button>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/20">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse" />
              <span className="text-brand-blue font-mono text-[9px] uppercase tracking-widest font-bold">Secure Checkout</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-heading font-bold text-white leading-tight">
              Invest in your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-blue-400">future self.</span>
            </h1>

            <div className="pt-8 lg:pt-12 space-y-6 md:space-y-8">
              <div className="relative p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-xl">
                <div className="flex justify-between items-start mb-6">
                  <div className="pr-4">
                    <h3 className="text-white font-bold text-lg md:text-xl mb-1">{course.title}</h3>
                    <p className="text-slate-500 text-[10px] md:text-xs uppercase tracking-tight font-mono">Full Access • Professional Certification</p>
                  </div>
                  <Globe className="text-brand-blue/40 shrink-0" size={24} />
                </div>
                
                <div className="flex justify-between items-end border-t border-white/5 pt-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter">Total Investment</p>
                    <div className="text-2xl md:text-3xl font-heading font-bold text-white">${course.price}</div>
                  </div>
                  <ShieldCheck className="text-emerald-500/50 mb-1 shrink-0" size={20} />
                </div>
              </div>

              <div className="flex items-center gap-4 px-4 py-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                <Lock size={14} className="text-emerald-500 shrink-0" />
                <p className="text-[9px] md:text-[10px] text-slate-400 font-mono uppercase tracking-wider leading-relaxed">
                  Payments are encrypted & processed by PayStack
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-slate-600 text-[9px] font-mono uppercase mt-12 hidden lg:block">© 2026 City Cruise International / Global Enrollment</p>
      </div>

      {/* Right Side: Payment Form */}
      <div className="w-full lg:w-[55%] p-6 md:p-16 lg:p-24 flex items-center justify-center bg-[#0B0F1A]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <form onSubmit={handlePayment} className="space-y-6 md:space-y-8">
            <div className="space-y-4 md:space-y-6">
              <div className="group space-y-2">
                <label className="text-[10px] font-mono uppercase text-slate-500 ml-1 tracking-widest">Cardholder Name</label>
                <input 
                  required 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value.toUpperCase()})}
                  className="w-full bg-white/[0.02] border border-white/10 rounded-xl md:rounded-2xl px-5 md:px-6 py-4 text-white outline-none focus:border-brand-blue/50 focus:ring-4 ring-brand-blue/10 transition-all placeholder:text-slate-700 text-sm md:text-base uppercase" 
                  placeholder="AS SEEN ON CARD" 
                />
              </div>

              <div className="group space-y-2 relative">
                <label className="text-[10px] font-mono uppercase text-slate-500 ml-1 tracking-widest">Card Number</label>
                <div className="relative">
                  <input 
                    required 
                    value={formData.cardNumber}
                    onChange={handleCardNumberChange}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl md:rounded-2xl px-12 md:px-14 py-4 text-white outline-none focus:border-brand-blue/50 focus:ring-4 ring-brand-blue/10 transition-all placeholder:text-slate-700 text-sm md:text-base" 
                    placeholder="0000 0000 0000 0000" 
                  />
                  <CreditCard className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-brand-blue transition-colors" size={18} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-slate-500 ml-1 tracking-widest">Expiry</label>
                  <input 
                    required 
                    value={formData.expiry}
                    onChange={handleExpiryChange}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl md:rounded-2xl px-5 md:px-6 py-4 text-white outline-none focus:border-brand-blue/50 transition-all placeholder:text-slate-700 text-sm" 
                    placeholder="MM / YY" 
                  />
                </div>
                <div className="space-y-2 relative">
                  <label className="text-[10px] font-mono uppercase text-slate-500 ml-1 tracking-widest">CVV</label>
                  <div className="relative">
                    <input 
                      required 
                      type="text" 
                      value={formData.cvv}
                      onChange={handleCvvChange}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl md:rounded-2xl px-5 md:px-6 py-4 text-white outline-none focus:border-brand-blue/50 transition-all placeholder:text-slate-700 text-sm" 
                      placeholder="000" 
                    />
                    <Lock size={14} className="absolute right-4 md:right-5 top-1/2 -translate-y-1/2 text-slate-600" />
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-[10px] font-mono uppercase tracking-widest text-center">
                {error}
              </div>
            )}

            <button 
              disabled={loading}
              className="relative w-full overflow-hidden group bg-brand-blue hover:bg-blue-600 text-white py-5 rounded-[1.5rem] font-bold uppercase text-[10px] md:text-[11px] tracking-[0.2em] transition-all shadow-2xl shadow-brand-blue/20 disabled:opacity-70 active:scale-95"
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
          <p className="text-slate-600 text-[9px] font-mono uppercase mt-12 text-center lg:hidden">© 2026 City Cruise International</p>
        </motion.div>
      </div>

      {/* Premium Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 bg-[#0B0F1A]/95 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="bg-[#161B22] border border-white/10 w-full max-w-md rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-12 text-center shadow-2xl"
            >
              <div className="relative w-20 h-20 md:w-24 md:h-24 mx-auto mb-8">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12 }}
                  className="w-full h-full bg-emerald-500 rounded-full flex items-center justify-center"
                >
                  <CheckCircle2 size={40} className="text-white" />
                </motion.div>
                <motion.div 
                  animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 bg-emerald-500 rounded-full -z-10"
                />
              </div>

              <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-2">Verified</h2>
              <p className="text-slate-400 text-xs md:text-sm mb-10 px-2 leading-relaxed">
                Welcome to the elite. Your access to <span className="text-white font-bold">{course.title}</span> is now active.
              </p>

              <button 
                onClick={() => navigate('/dashboard')}
                className="group w-full bg-white text-brand-dark py-4 md:py-5 rounded-xl md:rounded-2xl font-bold uppercase text-[10px] md:text-[11px] tracking-widest flex items-center justify-center gap-3 hover:bg-brand-blue hover:text-white transition-all active:scale-95"
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