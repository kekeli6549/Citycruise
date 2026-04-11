import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../context/authstore';
import { initializePayment } from '../api/paymentService';
import { ShieldCheck, CreditCard, Lock, ChevronLeft, CheckCircle2, Globe, ArrowRight, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';

const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { purchaseCourse } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fallback if state is missing
  const course = state?.course || { title: "Executive Leadership Program", price: 499, id: "default" };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await initializePayment(course.id);
      // Paystack returns the redirect URL in response.data.authorization_url
      const data = response.data || response;

      if (data.authorization_url) {
        // Redirect the user to Paystack's secure checkout
        window.location.href = data.authorization_url;
      } else {
        throw new Error("Payment gateway unavailable. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Could not initialize payment. Please try again.");
      setLoading(false);
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
              <span className="text-brand-blue font-mono text-[9px] uppercase tracking-widest font-bold">Secure Gateway</span>
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
                  Encryption powered by PayStack Global
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-slate-600 text-[9px] font-mono uppercase mt-12 hidden lg:block">© 2026 City Cruise International</p>
      </div>

      {/* Right Side: Simplified Action Area */}
      <div className="w-full lg:w-[55%] p-6 md:p-16 lg:p-24 flex items-center justify-center bg-[#0B0F1A]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center space-y-8"
        >
          <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5">
            <div className="w-16 h-16 bg-brand-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <CreditCard className="text-brand-blue" size={32} />
            </div>
            <h2 className="text-xl font-bold text-white mb-3 uppercase tracking-tight">Ready to enroll?</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              Click the button below to open the secure payment portal. You will be redirected back here once the transaction is complete.
            </p>

            {error && (
              <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-[10px] font-mono uppercase tracking-widest">
                {error}
              </div>
            )}

            <button
              onClick={handlePayment}
              disabled={loading}
              className="relative w-full overflow-hidden group bg-brand-blue hover:bg-blue-600 text-white py-5 rounded-[1.5rem] font-bold uppercase text-[10px] md:text-[11px] tracking-[0.2em] transition-all shadow-2xl shadow-brand-blue/20 disabled:opacity-70 active:scale-95 flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Initialize Secure Payment
                  <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </>
              )}
            </button>
          </div>          
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;