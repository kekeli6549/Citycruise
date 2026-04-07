import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, PlayCircle, Star, Users, ArrowUpRight, SearchX, ChevronDown, Check } from 'lucide-react';
import { useCourseStore } from '../context/courseStore';
import { useAuthStore } from '../context/authStore';

const CourseSkeleton = () => (
  <div className="bg-slate-50 dark:bg-slate-900/40 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col animate-pulse">
    <div className="h-64 bg-slate-200 dark:bg-slate-800" />
    <div className="p-8 space-y-4">
      <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-3/4" />
      <div className="flex gap-4">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/4" />
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/4" />
      </div>
      <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-full" />
      </div>
    </div>
  </div>
);

const CoursesPage = () => {
  const navigate = useNavigate();
  const { courses, userFetchCourses, enrolledCourses, fetchMyCourses, fetchCategories, isLoading } = useCourseStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("Alphabetical");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    userFetchCourses();
    fetchMyCourses();
    fetchCategories();
  }, [userFetchCourses, fetchMyCourses, fetchCategories]);

  const filterOptions = ["Alphabetical", "Most Viewed"];

  const filteredCourses = (courses || [])
    .filter(c => c.title?.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (filter === "Alphabetical") return a.title?.localeCompare(b.title);
      if (filter === "Most Viewed") return (b.enrollment_count || 0) - (a.enrollment_count || 0);
      return 0;
    });

  return (
    <div className="min-h-screen bg-white dark:bg-brand-dark p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16">
          <p className="text-brand-blue font-mono text-[10px] uppercase tracking-[0.4em] mb-4">Curriculum Catalog</p>
          <h1 className="text-5xl font-heading font-bold text-slate-900 dark:text-white leading-tight">
            Master the <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-blue-400">Next Frontier.</span>
          </h1>
        </header>

        {/* Search & Filter Bar */}
        <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex flex-row gap-6 items-center mb-12 backdrop-blur-xl relative z-40">
          <div className="relative flex-1">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search curriculum..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-6 py-4 bg-white dark:bg-brand-dark rounded-2xl outline-none focus:ring-4 ring-brand-blue/5 border border-transparent focus:border-brand-blue/20 transition-all dark:text-white"
            />
          </div>

          <div className="relative shrink-0">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-3 bg-white dark:bg-brand-dark px-5 py-3 h-[58px] rounded-xl border border-slate-100 dark:border-slate-800 transition-all hover:border-brand-blue/30 active:scale-95"
            >
              <SlidersHorizontal size={14} className="text-brand-blue" />
              <span className="hidden md:inline text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300 min-w-[100px] text-left">
                {filter}
              </span>
              <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isFilterOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl z-20 overflow-hidden p-2"
                  >
                    {filterOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setFilter(opt);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors ${filter === opt
                          ? 'bg-brand-blue/10 text-brand-blue'
                          : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                          }`}
                      >
                        {opt}
                        {filter === opt && <Check size={12} />}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => <CourseSkeleton key={i} />)
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredCourses.length > 0 ? filteredCourses.map((course) => {
                const isOwned = enrolledCourses?.some(enrolled => String(enrolled.id) === String(course.id));
                 return (
                  <motion.div
                    layout
                    key={course.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ y: -12 }}
                    className="group relative bg-white dark:bg-slate-900/40 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/60 overflow-hidden flex flex-col transition-all duration-500 hover:border-brand-blue/30 hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.15)]"
                  >
                    <div className={`h-64 flex items-center justify-center relative overflow-hidden`}>
                      <div className={`absolute inset-0 bg-cover bg-center`} style={{ backgroundImage: `url(${import.meta.env.VITE_API_URL}${course.cover_image})` }} />
                      <PlayCircle className="text-white opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 duration-500 drop-shadow-2xl" size={64} />

                      <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-[8px] font-black uppercase tracking-[0.2em] text-black">
                        {course.category_tag}
                      </div>
                    </div>

                    <div className="p-8 flex flex-col flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white group-hover:text-brand-blue transition-colors leading-tight">{course.title}</h3>
                        <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl group-hover:bg-brand-blue group-hover:text-white transition-all shrink-0">
                          <ArrowUpRight size={16} />
                        </div>
                      </div>

                      <h3 className="text-xs mb-4 font-heading font-light text-slate-900 dark:text-white group-hover:text-brand-blue transition-colors leading-tight">{course.description}</h3>
                      <div className="flex items-center gap-6 mb-8">
                        <div className="flex items-center gap-2">
                          <Users size={14} className="text-slate-400 group-hover:text-brand-blue transition-colors" />
                          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-tighter">{(course.enrollment_count / 1000).toFixed(1)} Students</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star size={14} className="text-amber-400 fill-amber-400" />
                          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-tighter">5.0 Rating</span>
                        </div>
                      </div>

                      <div className="mt-auto pt-6 border-t border-slate-50 dark:border-slate-800/60 flex flex-col gap-4">
                        <div className="flex flex-col">
                          <p className="text-[8px] font-mono text-slate-400 uppercase tracking-widest mb-1">Investment Value</p>
                          <p className="text-2xl font-black dark:text-white tracking-tighter break-all">
                            {isOwned ? (
                              <span className="text-emerald-500 flex items-center gap-1.5"><Check size={18} /> OWNED</span>
                            ) : (
                              `$${Number(course.price || 0).toLocaleString()}`
                            )}
                          </p>
                        </div>
                        <button
                          onClick={() => isOwned ? navigate(`/course/${course.id}`) : navigate(`/checkout/${course.id}`, { state: { course } })}
                          className={`w-full py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all active:scale-95 ${isOwned
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                            : 'bg-slate-900 dark:bg-brand-blue text-white shadow-lg shadow-brand-blue/20 hover:shadow-brand-blue/40'
                            }`}
                        >
                          {isOwned ? "Access Course" : "Enroll Now"}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              }) : (
                <div className="col-span-full py-32 flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-6 border border-slate-100 dark:border-slate-800">
                    <SearchX className="text-slate-300" size={40} />
                  </div>
                  <h3 className="text-2xl font-heading font-bold dark:text-white">No courses found</h3>
                  <p className="text-slate-400 text-sm mt-2">Try adjusting your filters or search keywords.</p>
                </div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;