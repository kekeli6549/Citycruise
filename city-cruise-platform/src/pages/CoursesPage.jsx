import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, PlayCircle, Star, Users, ArrowUpRight, SearchX, ChevronDown, Check, LockOpen } from 'lucide-react';
import { coursesData } from '../data/coursesData';
import { useAuthStore } from '../context/authStore';

const CoursesPage = () => {
  const navigate = useNavigate();
  const { purchasedCourses } = useAuthStore();

  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("Alphabetical");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [occupation, setOccupation] = useState("All");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const data = await getAllCourses();
        setCourses(data || []);
      } catch (err) {
        setError("Failed to load curriculum. Please try again later.");
        console.error("Course Fetch Error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const occupations = ["All", "Finance", "Leadership", "Technology", "Design"];
  const filterOptions = ["Alphabetical", "Most Viewed"];

  const filteredCourses = (courses || [])
    .filter(c => (occupation === "All" || c.category === occupation))
    .filter(c => c.title?.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (filter === "Alphabetical") return a.title?.localeCompare(b.title);
      if (filter === "Most Viewed") return (b.views || 0) - (a.views || 0);
      return 0;
    });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-brand-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-brand-dark p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16">
          <p className="text-brand-blue font-mono text-[10px] uppercase tracking-[0.4em] mb-4">Curriculum Catalog</p>
          <h1 className="text-5xl font-heading font-bold text-slate-900 dark:text-white leading-tight">
            Master the <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-blue-400">Next Frontier.</span>
          </h1>
        </header>

        <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row gap-6 items-center mb-12 backdrop-blur-xl relative z-40">
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

          <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:w-auto">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative shrink-0">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center gap-3 bg-white dark:bg-brand-dark px-5 py-3 rounded-xl border border-slate-100 dark:border-slate-800 transition-all hover:border-brand-blue/30 active:scale-95"
                >
                  <SlidersHorizontal size={14} className="text-brand-blue" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300 min-w-[100px] text-left">
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

              <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 w-full md:w-auto">
                {occupations.map(occ => (
                  <button
                    key={occ}
                    onClick={() => setOccupation(occ)}
                    className={`px-5 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap shrink-0 ${occupation === occ ? 'bg-brand-blue text-white shadow-lg' : 'bg-white dark:bg-brand-dark text-slate-400 border border-slate-100 dark:border-slate-800'}`}
                  >
                    {occ}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredCourses.length > 0 ? filteredCourses.map((course) => {
              const isOwned = purchasedCourses?.some(id => String(id) === String(course.id));
              return (
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
                        <p className="text-2xl font-bold dark:text-white">{isOwned ? "Owned" : `$${course.price || '0'}`}</p>                      </div>
                      <button
                        onClick={() => isOwned ? navigate(`/course/${course.id}`) : navigate(`/checkout/${course.id}`, { state: { course } })}
                        className={`px-6 py-3 rounded-xl font-bold uppercase text-[9px] tracking-widest transition-all active:scale-95 ${isOwned ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-900 dark:bg-brand-blue text-white hover:shadow-xl'}`}
                      >
                        {isOwned ? "Go to Course" : "Enroll Now"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            }) : (
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