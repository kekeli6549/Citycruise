import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../context/authStore';
import { PlayCircle, Clock, Award, BookOpen, User, X, LogOut, ChevronRight, Settings } from 'lucide-react';

const Dashboard = () => {
  const { user, logout, login } = useAuthStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [previewCourse, setPreviewCourse] = useState(null);
  const [editName, setEditName] = useState(user?.firstName || '');

  const courses = [
    { id: 1, title: "Global Strategy & Leadership", progress: 65, duration: "12 hrs", lessons: 24, description: "Master international markets and high-performance team building." },
    { id: 2, title: "International Finance Mastery", progress: 12, duration: "18 hrs", lessons: 32, description: "Advanced capital management for the modern global professional." },
    { id: 3, title: "UI/UX for Fintech Platforms", progress: 0, duration: "10 hrs", lessons: 18, description: "Designing secure, high-trust financial interfaces." },
  ];

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    login({ ...user, firstName: editName });
    setIsProfileOpen(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-brand-dark flex flex-col">
      {/* Dashboard Top Nav */}
      <nav className="border-b border-slate-100 dark:border-slate-800 px-8 py-4 flex justify-between items-center bg-white dark:bg-brand-dark sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center text-white font-bold">C</div>
          <span className="font-heading font-bold text-slate-900 dark:text-white uppercase tracking-tighter">Student Hub</span>
        </div>
        
        <div className="flex items-center gap-4">
           <button 
             onClick={() => setIsProfileOpen(true)}
             className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-brand-blue hover:ring-2 ring-brand-blue transition-all"
           >
             <User size={20} />
           </button>
        </div>
      </nav>

      <main className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl font-heading font-bold text-slate-900 dark:text-white"
            >
              Welcome, <span className="text-brand-blue">{user?.firstName || 'Innovator'}</span>.
            </motion.h1>
            <p className="text-slate-400 font-mono text-[10px] uppercase tracking-[0.3em] mt-2">DASHBOARD / OVERVIEW</p>
          </div>
          <button onClick={logout} className="flex items-center gap-2 text-[10px] font-mono uppercase text-red-500 hover:opacity-70 transition-opacity">
            <LogOut size={14} /> Exit Hub
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { label: "Enrolled", val: "03", icon: BookOpen },
            { label: "Learning Hours", val: "24.5", icon: Clock },
            { label: "Certifications", val: "01", icon: Award },
          ].map((stat, i) => (
            <div key={i} className="bg-slate-50 dark:bg-slate-900/40 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800">
              <stat.icon className="text-brand-blue mb-4" size={24} />
              <h3 className="text-3xl font-heading font-bold dark:text-white">{stat.val}</h3>
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Courses Grid */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-heading font-bold dark:text-white">Active Curriculum</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {courses.map((course) => (
            <motion.div 
              key={course.id}
              onClick={() => setPreviewCourse(course)}
              whileHover={{ y: -8 }}
              className="cursor-pointer group bg-white dark:bg-slate-900/40 rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row shadow-sm hover:shadow-2xl transition-all"
            >
              <div className="w-full md:w-56 h-56 bg-brand-blue/5 flex items-center justify-center relative overflow-hidden">
                <PlayCircle className="text-brand-blue relative z-10 group-hover:scale-125 transition-transform" size={48} />
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white mb-2">{course.title}</h3>
                  <p className="text-slate-500 text-sm line-clamp-2 mb-6">{course.description}</p>
                </div>
                <div className="space-y-4">
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-blue" style={{ width: `${course.progress}%` }} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{course.progress}% COMPLETE</span>
                    <ChevronRight size={16} className="text-brand-blue group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Modal: Profile Edit */}
      <AnimatePresence>
        {isProfileOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsProfileOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white dark:bg-brand-dark w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl border border-white/20">
              <button onClick={() => setIsProfileOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900"><X size={20}/></button>
              <h3 className="text-2xl font-heading font-bold mb-2 dark:text-white">Profile Settings</h3>
              <p className="text-slate-500 text-sm mb-8">Update your professional identity.</p>
              
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Display Name</label>
                  <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 ring-brand-blue transition-all dark:text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none" />
                </div>
                <button type="submit" className="w-full bg-brand-blue text-white py-4 rounded-2xl font-bold uppercase text-[10px] tracking-widest shadow-lg shadow-brand-blue/30">Save Changes</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Course Preview */}
      <AnimatePresence>
        {previewCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPreviewCourse(null)} className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" />
            <motion.div layoutId={previewCourse.id} className="relative bg-white dark:bg-slate-900 w-full max-w-3xl rounded-[3rem] overflow-hidden shadow-2xl">
              <div className="aspect-video bg-black flex items-center justify-center relative">
                <p className="text-white/40 font-mono text-xs uppercase tracking-widest">Preview Video Playing...</p>
                <button onClick={() => setPreviewCourse(null)} className="absolute top-6 right-6 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"><X size={20}/></button>
              </div>
              <div className="p-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-3xl font-heading font-bold text-slate-900 dark:text-white mb-2">{previewCourse.title}</h3>
                    <div className="flex gap-4 text-[10px] font-mono text-brand-blue uppercase font-bold">
                      <span>{previewCourse.lessons} LESSONS</span>
                      <span>{previewCourse.duration} TOTAL</span>
                    </div>
                  </div>
                  <div className="text-2xl font-heading font-bold text-slate-900 dark:text-white">$499</div>
                </div>
                <p className="text-slate-500 mb-8 leading-relaxed">{previewCourse.description} This intensive course includes live sessions, downloadable assets, and exclusive alumni network access.</p>
                <div className="flex gap-4">
                  <button className="flex-1 bg-brand-blue text-white py-5 rounded-2xl font-bold uppercase text-[11px] tracking-widest shadow-xl shadow-brand-blue/20">Buy Now</button>
                  <button onClick={() => setPreviewCourse(null)} className="px-8 border border-slate-100 dark:border-slate-800 rounded-2xl font-bold uppercase text-[11px] tracking-widest dark:text-white">Close</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;