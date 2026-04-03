import React from 'react';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon, title, desc }) => (
  <motion.div 
    whileHover={{ y: -8 }}
    className="glass-card p-8 rounded-[2.5rem] flex flex-col items-center text-center border-white/50 transition-all duration-300"
  >
    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-6 border border-slate-100 shadow-sm">
      <span className="text-brand-blue text-3xl">{icon}</span>
    </div>
    <h3 className="font-heading text-2xl text-slate-900 mb-3 font-bold">{title}</h3>
    <p className="font-body text-slate-500 text-sm leading-relaxed">{desc}</p>
  </motion.div>
);

const Features = () => {
  return (
    <section id="expertise" className="py-24 px-6 bg-white relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-heading text-5xl text-slate-900">Why City Cruise International?</h2>
          <p className="font-body text-slate-500 max-w-2xl mx-auto text-lg">
            A registered leader in integrated logistics and facility management, providing elite standards across Nigeria.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <FeatureCard 
            icon="🚗"
            title="Elite Car Hire"
            desc="Our premier fleet offers luxury and reliability for individual and corporate needs. From city cruises to long-term hire, we redefine urban mobility."
          />
          <FeatureCard 
            icon="✨"
            title="Expert Cleaning"
            desc="Offering specialized corporate and residential cleaning services. We use international standards to ensure your workspace is pristine and safe."
          />
          <FeatureCard 
            icon="🎓"
            title="Service Academy"
            desc="We train professional cleaning personnel and drivers. Our certified curriculum equips individuals with elite skills for the global service industry."
          />
        </div>
      </div>
    </section>
  );
};

export default Features;