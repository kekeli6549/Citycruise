import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-white dark:bg-brand-dark">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 mb-8">
            <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-brand-blue dark:text-blue-400">Professional Excellence</span>
          </div>
          
          <h1 className="text-6xl lg:text-8xl font-heading text-slate-900 dark:text-white leading-[0.9] mb-8">
            Master <span className="text-brand-blue italic">Tomorrow</span> Today.
          </h1>
          
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-md mb-10 leading-relaxed">
            City Cruise delivers elite educational experiences tailored for the global African professional.
          </p>

          <div className="flex flex-wrap gap-6 items-center">
            <button className="bg-brand-blue text-white px-10 py-5 rounded-2xl font-bold shadow-2xl shadow-brand-blue/30 hover:scale-105 transition-all">
              Explore Programs
            </button>
            <button className="flex items-center gap-3 font-bold text-slate-900 dark:text-white group">
              <div className="w-12 h-12 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center group-hover:bg-brand-blue group-hover:text-white transition-all">
                <Play size={18} />
              </div>
              Watch Film
            </button>
          </div>
        </motion.div>

        <div className="relative">
          <div className="rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white dark:border-slate-800">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop" 
              className="w-full h-[600px] object-cover" 
              alt="Elite Education" 
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;