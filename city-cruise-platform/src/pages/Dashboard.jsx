import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';
import { PlayCircle, Clock, Award, BookOpen, User, X, LogOut, ChevronRight, Camera, KeyRound, Eye, EyeOff } from 'lucide-react';

const Dashboard = () => {
  const { user, logout, login, purchasedCourses } = useAuthStore();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [previewCourse, setPreviewCourse] = useState(null);
  
  // Profile State
  const [editName, setEditName] = useState(user?.firstName || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    // Logic for updating name, image, and passwords
    login({ ...user, firstName: editName, profilePic: profileImage });
    setIsProfileOpen(false);
    // Reset passwords after update
    setCurrentPassword('');
    setNewPassword('');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-brand-dark flex flex-col">
      <nav className="border-b border-slate-100 dark:border-slate-800 px-8 py-4 flex justify-between items-center bg-white dark:bg-brand-dark sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center text-white font-bold">C</div>
          <span className="font-heading font-bold text-slate-900 dark:text-white uppercase tracking-tighter text-sm md:text-base">Student Hub</span>
        </div>
        <div className="flex items-center gap-4">
           <button 
             onClick={() => setIsProfileOpen(true)}
             className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-brand-blue hover:ring-2 ring-brand-blue transition-all overflow-hidden"
           >
             {profileImage ? <img src={profileImage} alt="Profile" className="w-full h-full object-cover" /> : (user?.profilePic ? <img src={user.profilePic} className="w-full h-full object-cover" /> : <User size={20} />)}
           </button>
        </div>
      </nav>

      <main className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
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
          <button 
            onClick={logout} 
            className="group flex items-center gap-3 px-5 py-2.5 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-full text-[10px] font-mono font-bold uppercase text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white transition-all duration-300 shadow-sm"
          >
            <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" /> 
            Exit Hub
          </button>
        </header>

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

        <h2 className="text-2xl font-heading font-bold dark:text-white mb-8">Active Curriculum</h2>
        
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

      {/* WHITE AESTHETIC PROFILE MODAL */}
      <AnimatePresence>
        {isProfileOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                onClick={() => setIsProfileOpen(false)} 
                className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" 
            />
            
            <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }} 
                animate={{ scale: 1, opacity: 1, y: 0 }} 
                exit={{ scale: 0.9, opacity: 0, y: 20 }} 
                className="relative bg-white/95 backdrop-blur-xl w-full max-w-md rounded-[3rem] p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border border-white"
            >
              <button onClick={() => setIsProfileOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-brand-dark transition-colors"><X size={24}/></button>
              
              <div className="flex flex-col items-center mb-10">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
                  <div className="w-28 h-28 rounded-full bg-slate-50 flex items-center justify-center overflow-hidden border-[6px] border-white shadow-xl group-hover:scale-105 transition-transform duration-300">
                    {profileImage ? <img src={profileImage} alt="Preview" className="w-full h-full object-cover" /> : (user?.profilePic ? <img src={user.profilePic} className="w-full h-full object-cover" /> : <User size={48} className="text-slate-200" />)}
                  </div>
                  <div className="absolute bottom-1 right-1 bg-brand-blue text-white p-2.5 rounded-full shadow-lg border-2 border-white"><Camera size={16} /></div>
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                </div>
                <h3 className="text-2xl font-heading font-bold mt-6 text-brand-dark tracking-tight">Identity Settings</h3>
                <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mt-1">Update your professional profile</p>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <label className="text-[9px] font-mono uppercase tracking-widest text-slate-500 font-bold ml-1">Full Legal Name</label>
                  <input 
                    type="text" 
                    value={editName} 
                    onChange={(e) => setEditName(e.target.value)} 
                    className="w-full p-4 bg-slate-100/50 border border-slate-200/50 rounded-2xl outline-none focus:bg-white focus:ring-4 ring-brand-blue/5 focus:border-brand-blue/30 transition-all text-brand-dark font-medium" 
                    placeholder="Innovator Name"
                  />
                </div>

                {/* Password Fields Group */}
                <div className="space-y-4 pt-2">
                    <div className="flex items-center gap-2 mb-2 text-brand-dark/40">
                        <KeyRound size={12} />
                        <span className="text-[9px] font-mono uppercase tracking-widest font-bold">Security Credentials</span>
                        <div className="h-px flex-1 bg-slate-100" />
                    </div>

                    <div className="space-y-2 relative">
                        <input 
                            type={showPassword ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full p-4 bg-slate-100/50 border border-slate-200/50 rounded-2xl outline-none focus:bg-white focus:ring-4 ring-brand-blue/5 focus:border-brand-blue/30 transition-all text-brand-dark text-sm"
                            placeholder="Current Password"
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-blue"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>

                    <div className="space-y-2">
                        <input 
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full p-4 bg-slate-100/50 border border-slate-200/50 rounded-2xl outline-none focus:bg-white focus:ring-4 ring-brand-blue/5 focus:border-brand-blue/30 transition-all text-brand-dark text-sm"
                            placeholder="New Secure Password"
                        />
                    </div>
                </div>

                <button 
                    type="submit" 
                    className="w-full bg-brand-dark text-white py-5 rounded-2xl font-bold uppercase text-[10px] tracking-[0.2em] shadow-xl hover:bg-brand-blue transition-all active:scale-[0.98] mt-4"
                >
                    Apply Changes
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Course Preview Modal */}
      <AnimatePresence>
        {previewCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPreviewCourse(null)} className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" />
            <motion.div layoutId={previewCourse.id} className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2rem] overflow-hidden shadow-2xl border border-white/5">
              <div className="w-full aspect-[21/9] bg-slate-100 dark:bg-black flex items-center justify-center relative border-b border-slate-100 dark:border-slate-800">
                <PlayCircle className="text-brand-blue opacity-50" size={40} />
                <button onClick={() => setPreviewCourse(null)} className="absolute top-4 right-4 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-md transition-colors"><X size={16}/></button>
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-heading font-bold text-slate-900 dark:text-white mb-2">{previewCourse.title}</h3>
                    <div className="flex gap-4 text-[9px] font-mono text-brand-blue uppercase font-bold tracking-widest">
                      <span>{previewCourse.lessons} LESSONS</span>
                      <span>{previewCourse.duration}</span>
                    </div>
                  </div>
                  <div className="text-xl font-heading font-bold text-slate-900 dark:text-white">${previewCourse.price}</div>
                </div>
                <p className="text-slate-500 text-sm mb-8 leading-relaxed max-w-lg">{previewCourse.description}</p>
                <div className="flex gap-4">
                  {purchasedCourses?.includes(previewCourse.id) ? (
                    <button 
                      onClick={() => navigate(`/course/${previewCourse.id}`)}
                      className="flex-1 bg-emerald-600 text-white py-4 rounded-xl font-bold uppercase text-[10px] tracking-widest shadow-lg shadow-emerald-600/20"
                    >
                      Continue Learning
                    </button>
                  ) : (
                    <button 
                      onClick={() => navigate(`/checkout/${previewCourse.id}`, { state: { course: previewCourse } })}
                      className="flex-1 bg-brand-blue text-white py-4 rounded-xl font-bold uppercase text-[10px] tracking-widest shadow-xl shadow-brand-blue/20"
                    >
                      Enroll Now
                    </button>
                  )}
                  <button onClick={() => setPreviewCourse(null)} className="px-8 border border-slate-100 dark:border-slate-800 rounded-xl font-bold uppercase text-[10px] tracking-widest dark:text-white hover:bg-slate-50 transition-colors">Close</button>
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