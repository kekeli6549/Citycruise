import React from 'react';

const Mentors = () => {
  const mentors = [
    { name: "Sarah Johnson", role: "Leadership", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800" },
    { name: "Michael Chen", role: "Innovation", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800" },
    { name: "Amara Okafor", role: "Strategy", img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=800" }
  ];

  return (
    <section id="team" className="py-24 bg-white dark:bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <h2 className="font-heading text-5xl text-slate-900 dark:text-white mb-4">The Architects.</h2>
          <p className="text-brand-blue font-mono text-[10px] uppercase tracking-widest font-bold">World-Class Mentorship</p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {mentors.map((mentor, i) => (
            <div key={i} className="group">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-6 border border-slate-100 dark:border-slate-800">
                <img src={mentor.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt={mentor.name} />
              </div>
              <div>
                <p className="font-mono text-[9px] uppercase tracking-widest text-brand-blue font-bold mb-1">{mentor.role}</p>
                <h4 className="font-heading text-2xl text-slate-900 dark:text-white">{mentor.name}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Mentors;