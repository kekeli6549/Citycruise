import React from 'react';
import ment1 from '../assets/ment1.jpg';
import ment2 from '../assets/ment2.jpg';

const Mentors = () => {
  const mentors = [
    { 
      name: "Engr. Sunday Peter", 
      role: "Chief Executive Officer (CEO)", 
      img: ment1 
    },
    { 
      name: "Engr. Onogu Collins Monday", 
      role: "Managing Director (MD)", 
      img: ment2 
    }
  ];

  return (
    <section id="team" className="py-16 md:py-24 bg-white dark:bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12 md:mb-16">
          <h2 className="font-heading text-4xl md:text-5xl text-slate-900 dark:text-white mb-4 leading-tight">The Architects.</h2>
          <p className="text-brand-blue font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold">
            Expert Leadership & Training
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          {mentors.map((mentor, i) => (
            <div key={i} className="group">
              <div className="aspect-[4/5] md:aspect-[3/4] rounded-2xl md:rounded-[2.5rem] overflow-hidden mb-6 border border-slate-100 dark:border-slate-800 shadow-xl">
                <img 
                  src={mentor.img} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100" 
                  alt={mentor.name} 
                />
              </div>
              <div className="px-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-blue font-bold mb-2">
                  {mentor.role}
                </p>
                <h4 className="font-heading text-xl md:text-2xl text-slate-900 dark:text-white">
                  {mentor.name}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Mentors;