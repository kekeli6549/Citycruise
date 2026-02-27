import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, PlayCircle, Star, Users, ArrowUpRight, SearchX } from 'lucide-react';

const CoursesPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("Alphabetical"); // Alphabetical, Most Viewed
  const [occupation, setOccupation] = useState("All");

  const occupations = ["All", "Finance", "Leadership", "Technology", "Design"];

  const courses = [
    { id: "1", title: "Global Strategy & Leadership", views: 1240, category: "Leadership", instructor: "Dr. Arinze K.", duration: "12 hrs", price: 499, img: "bg-blue-600/10" },
    { id: "2", title: "International Finance Mastery", views: 2100, category: "Finance", instructor: "Sarah J.", duration: "18 hrs", price: 599, img: "bg-emerald-600/10" },
    { id: "3", title: "UI/UX for Fintech Platforms", views: 980, category: "Technology", instructor: "David O.", duration: "10 hrs", price: 399, img: "bg-purple-600/10" },
    { id: "4", title: "Diaspora Wealth Management", views: 3500, category: "Finance", instructor: "Marcus T.", duration: "14 hrs", price: 450, img: "bg-amber-600/10" },
    { id: "5", title: "AI-Driven Business Logistics", views: 1560, category: "Technology", instructor: "Elena R.", duration: "16 hrs", price: 520, img: "bg-cyan-600/10" },
  ];

  const filteredCourses = courses
    .filter(c => (occupation === "All" || c.category === occupation))
    .filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (filter === "Alphabetical") return a.title.localeCompare(b.title);
      if (filter === "Most Viewed") return b.views - a.views;
      return 0;
    });

  return (
    <div className="min-h-screen bg-white dark:bg-brand-dark p-6 md:p-12 lg:pl-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-16">
          <p className="text-brand-blue font-mono text-[10px] uppercase tracking-[0.4em] mb-4">Curriculum Catalog</p>
          <h1 className="text-5xl font-heading font-bold text-slate-900 dark:text-white leading-tight">
            Master the <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-blue-400">Next Frontier.</span>
          </h1>
        </header>

        {/* Filter Bar */}
        <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row gap-6 items-center mb-12 backdrop-blur-xl">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search curriculum..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-6 py-4 bg-white dark:bg-brand-dark rounded-2xl outline-none focus:ring-4 ring-brand-blue/5 border border-transparent focus:border-brand-blue/20 transition-all dark:text-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            <div className="flex items-center gap-2 bg-white dark:bg-brand-dark px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-800">
              <SlidersHorizontal size={14} className="text-brand-blue" />
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="bg-transparent outline-none text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300"
              >
                <option>Alphabetical</option>
                <option>Most Viewed</option>
              </select>
            </div>

            <div className="flex gap-2">
              {occupations.map(occ => (
                <button
                  key={occ}
                  onClick={() => setOccupation(occ)}
                  className={`px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${occupation === occ ? 'bg-brand-blue text-white shadow-lg' : 'bg-white dark:bg-brand-dark text-slate-400 border border-slate-100 dark:border-slate-800'}`}
                >
                  {occ}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredCourses.length > 0 ? filteredCourses.map((course) => (
              <motion.div
                layout
                key={course.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -10 }}
                className="group relative bg-white dark:bg-slate-900/40 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col"
              >
                <div className={`h-64 ${course.img} flex items-center justify-center relative overflow-hidden`}>
                  <PlayCircle className="text-brand-blue opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 duration-500" size={64} />
                  <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-bold uppercase tracking-widest text-brand-dark">
                    {course.category}
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white group-hover:text-brand-blue transition-colors">{course.title}</h3>
                    <ArrowUpRight className="text-slate-300 group-hover:text-brand-blue transition-all" />
                  </div>
                  
                  <div className="flex items-center gap-4 mb-8">
                    <div className="flex items-center gap-1.5">
                      <Users size={14} className="text-slate-400" />
                      <span className="text-xs text-slate-400 font-medium">{(course.views / 1000).toFixed(1)}k</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Star size={14} className="text-amber-400 fill-amber-400" />
                      <span className="text-xs text-slate-400 font-medium">4.9</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-6 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center">
                    <div>
                      <p className="text-[9px] font-mono text-slate-400 uppercase tracking-tighter">Investment</p>
                      <p className="text-2xl font-bold dark:text-white">${course.price}</p>
                    </div>
                    <button 
                      onClick={() => navigate(`/checkout/${course.id}`, { state: { course } })}
                      className="bg-slate-900 dark:bg-brand-blue text-white px-6 py-3 rounded-xl font-bold uppercase text-[9px] tracking-widest hover:shadow-xl transition-all active:scale-95"
                    >
                      Enroll Now
                    </button>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full py-32 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-6">
                  <SearchX className="text-slate-300" size={40} />
                </div>
                <h3 className="text-2xl font-heading font-bold dark:text-white">No courses found</h3>
                <p className="text-slate-400 text-sm mt-2">Try adjusting your filters or search keywords.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;