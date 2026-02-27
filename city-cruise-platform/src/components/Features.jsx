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
          <h2 className="font-heading text-5xl text-slate-900">Why Choose City Cruise?</h2>
          <p className="font-body text-slate-500 max-w-2xl mx-auto text-lg">
            We combine global diaspora excellence with local relevance to deliver an unmatched learning experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <FeatureCard 
            icon="🎓"
            title="Expert Courses"
            desc="Curated curriculums designed by industry leaders. Our content is updated quarterly to ensure global relevance."
          />
          <FeatureCard 
            icon="🌐"
            title="Global Expertise"
            desc="Learn from professionals with international experience. Connect with mentors from top global institutions."
          />
          <FeatureCard 
            icon="✅"
            title="Proven Results"
            desc="Trackable growth and certified achievements. Our graduates report significant career advancement within 6 months."
          />
        </div>
      </div>
    </section>
  );
};

export default Features;