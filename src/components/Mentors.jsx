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
    <section id="team" className="py-24 bg-white dark:bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <h2 className="font-heading text-5xl text-slate-900 dark:text-white mb-4">The Architects.</h2>
          <p className="text-brand-blue font-mono text-xs uppercase tracking-[0.3em] font-bold">
            Expert Leadership & Training
          </p>
        </div>

        {/* Updated grid to md:grid-cols-2 for perfect alignment of two items */}
        <div className="grid md:grid-cols-2 gap-10">
          {mentors.map((mentor, i) => (
            <div key={i} className="group">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-6 border border-slate-100 dark:border-slate-800">
                <img 
                  src={mentor.img} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                  alt={mentor.name} 
                />
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-blue font-bold mb-2">
                  {mentor.role}
                </p>
                <h4 className="font-heading text-2xl text-slate-900 dark:text-white">
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