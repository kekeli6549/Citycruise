import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative min-h-screen lg:min-h-[90vh] flex items-center overflow-hidden bg-white dark:bg-brand-dark pt-28 pb-12 lg:py-0">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center w-full">
        
        <motion.div 
          initial={{ opacity: 0, x: -50 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.8 }}
          className="z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 mb-6 lg:mb-8">
            <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-brand-blue dark:text-blue-400">Elite Fleet & Services</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-heading text-slate-900 dark:text-white leading-[1.1] lg:leading-[0.9] mb-6 lg:mb-8">
            Premium <span className="text-brand-blue italic">Fleet</span> Hire & Services.
          </h1>
          
          <p className="text-base lg:text-lg text-slate-500 dark:text-slate-400 max-w-md mb-8 lg:mb-10 leading-relaxed">
            From luxury city cruises and vehicle hire to professional corporate cleaning and expert personnel training.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <Link to="/signup" className="w-full sm:w-auto text-center bg-brand-blue text-white px-10 py-5 rounded-2xl font-bold shadow-2xl shadow-brand-blue/30 hover:scale-105 transition-all">
              Book Your Cruise
            </Link>
            <button className="flex items-center gap-3 font-bold text-slate-900 dark:text-white group">
              <div className="w-12 h-12 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center group-hover:bg-brand-blue group-hover:text-white transition-all">
                <Play size={18} />
              </div>
              Watch Film
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full"
        >
          <div className="rounded-[2rem] lg:rounded-[3rem] overflow-hidden shadow-2xl border-4 lg:border-8 border-white dark:border-slate-800">
            <img 
              src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1200&auto=format&fit=crop" 
              className="w-full h-[300px] md:h-[450px] lg:h-[600px] object-cover" 
              alt="City Cruise Luxury Fleet" 
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;