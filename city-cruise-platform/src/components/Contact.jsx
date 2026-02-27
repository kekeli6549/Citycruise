import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, Mail, Phone } from 'lucide-react';

const Contact = () => {
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('Message sent successfully!');
    setTimeout(() => setStatus(''), 3000);
  };

  return (
    <section id="contact" className="py-24 px-6 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-100">
          
          {/* Left Panel: Info (High-End Blue) */}
          <div className="md:w-2/5 bg-brand-blue p-12 lg:p-16 text-white flex flex-col justify-between relative">
            <div className="relative z-10 space-y-8">
              <div>
                <h2 className="font-heading text-4xl mb-4">Let's shape your future.</h2>
                <p className="font-body text-blue-100/70">Have questions about our programs? Our team in Abuja is ready to assist you.</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <MapPin size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Abuja Headquarters</p>
                    <p className="text-xs text-blue-100/60 leading-relaxed">Central Business District, Abuja, Nigeria</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Mail size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Email Us</p>
                    <p className="text-xs text-blue-100/60 leading-relaxed">admissions@citycruise.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Background Orbs */}
            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          </div>

          {/* Right Panel: Form */}
          <div className="md:w-3/5 p-12 lg:p-16 bg-white">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Full Name</label>
                  <input type="text" placeholder="John Doe" required className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Email Address</label>
                  <input type="email" placeholder="john@example.com" required className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Message</label>
                <textarea placeholder="How can we help you?" rows="4" required className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all resize-none"></textarea>
              </div>

              <motion.button 
                whileTap={{ scale: 0.98 }}
                className="w-full bg-brand-dark text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-blue transition-all shadow-xl shadow-slate-200"
              >
                Request Call Back
              </motion.button>
              {status && <p className="text-green-600 font-mono text-xs text-center">{status}</p>}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;