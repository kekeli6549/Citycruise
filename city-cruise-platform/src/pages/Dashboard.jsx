import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';
import { PlayCircle, Clock, Award, BookOpen, User, X, LogOut, ChevronRight, Camera, KeyRound, Sparkles } from 'lucide-react';

const Dashboard = () => {
  const { user, logout, login } = useAuthStore();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const [editName, setEditName] = useState(user?.firstName || '');
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);

  const courses = [
    { id: "1", title: "Global Strategy & Leadership", progress: 65, duration: "12 hrs", lessons: 24, description: "Master international markets and high-performance team building.", price: 499 },
    { id: "2", title: "International Finance Mastery", progress: 12, duration: "18 hrs", lessons: 32, description: "Advanced capital management for the modern global professional.", price: 599 },
    { id: "3", title: "UI/UX for Fintech Platforms", progress: 0, duration: "10 hrs", lessons: 18, description: "Designing secure, high-trust financial interfaces.", price: 399 },
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    login({ ...user, firstName: editName, profilePic: profileImage });
    setIsProfileOpen(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-brand-dark flex flex-col">
      {/* Header Area - Added pl-20 on mobile to clear the hamburger menu */}
      <nav className="pl-20 pr-6 md:px-12 py-8 flex justify-between items-center bg-transparent">
        <div>
           <p className="text-slate-400 font-mono text-[9px] uppercase tracking-[0.4em]">Navigator / Member Hub</p>
        </div>
        <button 
          onClick={() => setIsProfileOpen(true)}
          className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-brand-blue hover:ring-2 ring-brand-blue transition-all overflow-hidden shrink-0 shadow-lg"
        >
          {profileImage ? (
            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
          ) : (user?.profilePic ? (
            <img src={user.profilePic} className="w-full h-full object-cover" />
          ) : (
            <User size={20} />
          ))}
        </button>
      </nav>

      <main className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full">
        {/* Welcome Section */}
        <header className="mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-4"
          >
            <span className="px-3 py-1 bg-brand-blue/10 text-brand-blue text-[10px] font-bold uppercase tracking-widest rounded-full">Elite Member</span>
            <Sparkles size={14} className="text-amber-500" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-heading font-bold text-slate-900 dark:text-white leading-tight"
          >
            Peace & Progress, <br />
            <span className="text-brand-blue">{user?.firstName || 'Innovator'}</span>.
          </motion.h1>
          <p className="text-slate-500 dark:text-slate-400 mt-4 max-w-lg text-sm md:text-base leading-relaxed">
            Your legacy is built through daily mastery. Continue where you left off and sharpen your edge.
          </p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-20">
          {[
            { label: "Courses Enrolled", val: "03", icon: BookOpen, color: "text-blue-500" },
            { label: "Learning Hours", val: "24.5", icon: Clock, color: "text-purple-500" },
            { label: "Global Badges", val: "01", icon: Award, color: "text-amber-500" },
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-50/50 dark:bg-slate-900/40 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 backdrop-blur-sm group hover:border-brand-blue/30 transition-colors"
            >
              <stat.icon className={`${stat.color} mb-6 group-hover:scale-110 transition-transform`} size={28} />
              <h3 className="text-4xl font-heading font-bold dark:text-white mb-1">{stat.val}</h3>
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Course Section */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-2xl font-heading font-bold dark:text-white">Active Curriculum</h2>
            <div className="h-1 w-12 bg-brand-blue mt-2 rounded-full" />
          </div>
          <button className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-brand-blue transition-colors">View All</button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {courses.map((course, idx) => (
            <motion.div 
              key={course.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + (idx * 0.1) }}
              onClick={() => navigate(`/course/${course.id}`)}
              className="cursor-pointer group bg-white dark:bg-slate-900/40 rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800/60 flex flex-col md:flex-row shadow-sm hover:shadow-2xl hover:border-brand-blue/20 transition-all duration-500"
            >
              <div className="w-full md:w-56 h-48 md:h-auto bg-slate-100 dark:bg-slate-800 flex items-center justify-center relative overflow-hidden shrink-0">
                <div className="absolute inset-0 bg-brand-blue/5 group-hover:bg-brand-blue/10 transition-colors" />
                <PlayCircle className="text-brand-blue relative z-10 group-hover:scale-110 transition-all duration-500" size={56} strokeWidth={1.5} />
              </div>
              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white mb-3 group-hover:text-brand-blue transition-colors">{course.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-2 mb-8">{course.description}</p>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">{course.progress}% COMPLETE</span>
                    <span className="text-[10px] font-mono text-brand-blue uppercase font-bold">{course.lessons} Modules</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${course.progress}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-brand-blue rounded-full shadow-[0_0_12px_rgba(37,99,235,0.4)]" 
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* PROFILE MODAL */}
      <AnimatePresence>
        {isProfileOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsProfileOpen(false)} className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" />
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} 
                className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl overflow-y-auto max-h-[90vh] no-scrollbar border border-white/10"
            >
              <button onClick={() => setIsProfileOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-brand-blue transition-colors"><X size={20}/></button>
              
              <div className="flex flex-col items-center mb-8">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
                  <div className="w-24 h-24 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl">
                    {profileImage ? <img src={profileImage} alt="Preview" className="w-full h-full object-cover" /> : (user?.profilePic ? <img src={user.profilePic} className="w-full h-full object-cover" /> : <User size={40} className="text-slate-200" />)}
                  </div>
                  <div className="absolute bottom-0 right-0 bg-brand-blue text-white p-2 rounded-full border-2 border-white dark:border-slate-900 transition-transform group-hover:scale-110"><Camera size={14} /></div>
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                </div>
                <h3 className="text-2xl font-heading font-bold mt-6 text-slate-900 dark:text-white">Profile Settings</h3>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold ml-1">Full Name</label>
                  <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 ring-brand-blue/20 dark:text-white text-sm" />
                </div>
                
                <div className="pt-2">
                  <div className="flex items-center gap-2 mb-4 text-slate-400">
                    <KeyRound size={12} /> <span className="text-[9px] font-mono uppercase tracking-widest">Security</span>
                  </div>
                  <input type="password" placeholder="Current Password" className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none mb-4 dark:text-white text-sm" />
                  <input type="password" placeholder="New Password" className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none dark:text-white text-sm" />
                </div>

                <button type="submit" className="w-full bg-brand-blue text-white py-4 rounded-2xl font-bold uppercase text-[10px] tracking-widest shadow-xl hover:bg-blue-600 transition-all">Save Identity</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;