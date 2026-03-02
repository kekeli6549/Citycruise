import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';
import { useAdminStore } from '../context/adminStore'; 
import { coursesData } from '../data/coursesData';
import CertificateGenerator, { downloadCertificate } from '../components/CertificateGenerator';
import { 
  PlayCircle, Clock, Award, BookOpen, User, X, 
  LogOut, ChevronRight, Camera, KeyRound, Sparkles, 
  FileText, RefreshCcw, ClipboardCheck, Download,
  Trophy, AlertTriangle
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout, login, certificates } = useAuthStore();
  const { gradedNotifications, clearNotification } = useAdminStore(); 
  const navigate = useNavigate();
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeNotification, setActiveNotification] = useState(null);
  
  const [editName, setEditName] = useState(user?.firstName || '');
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);
  const certificateRef = useRef(null);
  const [selectedCourseForCert, setSelectedCourseForCert] = useState(null);

  const courses = coursesData;

  useEffect(() => {
    const myResult = gradedNotifications.find(n => n.studentId === user?.id && !n.viewed);
    if (myResult) {
      setActiveNotification(myResult);
    }
  }, [gradedNotifications, user?.id]);

  const handleDismissNotification = () => {
    if (activeNotification) {
      clearNotification(activeNotification.id);
      setActiveNotification(null);
    }
  };

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

  const handleDownload = async (course) => {
    if (!course) return;
    setSelectedCourseForCert(course);
    setIsDownloading(true);
    
    // Small timeout to allow the hidden CertificateGenerator to update with the new course data
    setTimeout(async () => {
      await downloadCertificate(certificateRef, course.title);
      setIsDownloading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-brand-dark flex flex-col">
      {/* Hidden high-res certificate for PDF generation */}
      <CertificateGenerator 
        user={user} 
        course={selectedCourseForCert} 
        certificateRef={certificateRef} 
      />

      {/* RESULT NOTIFICATION OVERLAY */}
      <AnimatePresence>
        {activeNotification && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] p-10 shadow-2xl border border-white/20 text-center relative overflow-hidden"
            >
              <div className={`absolute top-0 left-0 w-full h-2 ${activeNotification.passed ? 'bg-emerald-500' : 'bg-red-500'}`} />
              
              <div className={`w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center ${activeNotification.passed ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                {activeNotification.passed ? <Trophy size={40} /> : <AlertTriangle size={40} />}
              </div>

              <p className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-slate-400 mb-2">Board Decision Rendered</p>
              <h2 className="text-3xl font-heading font-bold text-slate-900 dark:text-white mb-4">
                {activeNotification.passed ? 'Assessment Passed' : 'Assessment Failed'}
              </h2>
              
              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl mb-8">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Course: {activeNotification.courseName}</p>
                <p className="text-4xl font-black text-slate-900 dark:text-white">{activeNotification.score}%</p>
              </div>

              <div className="space-y-3">
                {activeNotification.passed ? (
                  <button 
                    onClick={() => {
                      const courseObj = courses.find(c => c.id === activeNotification.courseId);
                      handleDownload(courseObj || { title: activeNotification.courseName, id: activeNotification.courseId });
                      handleDismissNotification();
                    }}
                    className="w-full py-4 bg-brand-blue text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-xl shadow-brand-blue/20 hover:scale-[1.02] transition-transform"
                  >
                    Download Certificate
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      navigate(`/course/${activeNotification.courseId}`);
                      handleDismissNotification();
                    }}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-transform"
                  >
                    Review Course Material
                  </button>
                )}
                <button 
                  onClick={handleDismissNotification}
                  className="w-full py-4 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-slate-600 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
            <img src={user.profilePic} className="w-full h-full object-cover" alt="User" />
          ) : (
            <User size={20} />
          ))}
        </button>
      </nav>

      <main className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full">
        <header className="mb-16 text-left">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-brand-blue/10 text-brand-blue text-[10px] font-bold uppercase tracking-widest rounded-full">Elite Member</span>
            <Sparkles size={14} className="text-amber-500" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="text-4xl md:text-6xl font-heading font-bold text-slate-900 dark:text-white leading-tight"
          >
            Peace & Progress, <br />
            <span className="text-brand-blue">{user?.firstName || 'Innovator'}</span>.
          </motion.h1>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-20">
          {[
            { label: "Mastery Progress", val: "03", icon: BookOpen, color: "text-blue-500" },
            { label: "Learning Hours", val: "24.5", icon: Clock, color: "text-purple-500" },
            { label: "Global Badges", val: certificates?.length.toString().padStart(2, '0') || "00", icon: Award, color: "text-amber-500" },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-slate-50/50 dark:bg-slate-900/40 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 backdrop-blur-sm group hover:border-brand-blue/30 transition-colors">
              <stat.icon className={`${stat.color} mb-6 group-hover:scale-110 transition-transform`} size={28} />
              <h3 className="text-4xl font-heading font-bold dark:text-white mb-1">{stat.val}</h3>
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {courses.map((course, idx) => {
            const hasPassed = certificates?.includes(course.id);
            
            return (
              <motion.div key={course.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + (idx * 0.1) }} className="group bg-white dark:bg-slate-900/40 rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800/60 flex flex-col md:flex-row shadow-sm hover:shadow-2xl transition-all duration-500">
                <div className="w-full md:w-56 h-48 md:h-auto bg-slate-100 dark:bg-slate-800 flex items-center justify-center relative shrink-0">
                  {hasPassed ? <Award className="text-amber-500" size={56} /> : <PlayCircle className="text-brand-blue" size={56} />}
                </div>
                <div className="p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white mb-3 group-hover:text-brand-blue transition-colors">{course.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 line-clamp-2">{course.description}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {hasPassed && (
                      <button 
                        onClick={() => handleDownload(course)}
                        disabled={isDownloading}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-100 transition-colors disabled:opacity-50"
                      >
                        {isDownloading && selectedCourseForCert?.id === course.id ? (
                          <RefreshCcw size={14} className="animate-spin" />
                        ) : (
                          <FileText size={14} />
                        )}
                        {isDownloading && selectedCourseForCert?.id === course.id ? 'Generating...' : 'Print Certificate'}
                      </button>
                    )}

                    {course.progress === 100 && !hasPassed && (
                      <button onClick={() => navigate(`/exam/${course.id}`)} className="flex items-center gap-2 px-6 py-2 bg-brand-blue text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:shadow-lg hover:shadow-brand-blue/20 transition-all">
                        <ClipboardCheck size={14} /> Take Final Assessment
                      </button>
                    )}

                    {course.progress < 100 && (
                      <button onClick={() => navigate(`/course/${course.id}`)} className="px-6 py-2 bg-slate-900 dark:bg-brand-blue text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-brand-blue transition-colors">Resume</button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      <AnimatePresence>
        {isProfileOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              onClick={() => setIsProfileOpen(false)} 
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} 
              className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl overflow-y-auto max-h-[90vh] no-scrollbar border border-white/10"
            >
              <button onClick={() => setIsProfileOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-brand-blue transition-colors">
                <X size={20}/>
              </button>
              
              <div className="flex flex-col items-center mb-8">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
                  <div className="w-24 h-24 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl">
                    {profileImage ? (
                      <img src={profileImage} alt="Preview" className="w-full h-full object-cover" />
                    ) : (user?.profilePic ? (
                      <img src={user.profilePic} className="w-full h-full object-cover" alt="Profile" />
                    ) : (
                      <User size={40} className="text-slate-200" />
                    ))}
                  </div>
                  <div className="absolute bottom-0 right-0 bg-brand-blue text-white p-2 rounded-full border-2 border-white dark:border-slate-900 transition-transform group-hover:scale-110">
                    <Camera size={14} />
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                </div>
                <h3 className="text-2xl font-heading font-bold mt-6 text-slate-900 dark:text-white">Profile Settings</h3>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold ml-1">Full Name</label>
                  <input 
                    type="text" 
                    value={editName} 
                    onChange={(e) => setEditName(e.target.value)} 
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 ring-brand-blue/20 dark:text-white text-sm" 
                    placeholder="Innovator Name"
                  />
                </div>

                <div className="pt-2">
                  <div className="flex items-center gap-2 mb-4 text-slate-400">
                    <KeyRound size={12} /> 
                    <span className="text-[9px] font-mono uppercase tracking-widest">Security & Access</span>
                  </div>
                  <input 
                    type="password" 
                    placeholder="Current Password" 
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none mb-4 dark:text-white text-sm focus:ring-2 ring-brand-blue/20" 
                  />
                  <input 
                    type="password" 
                    placeholder="New Password" 
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none dark:text-white text-sm focus:ring-2 ring-brand-blue/20" 
                  />
                </div>

                <button type="submit" className="w-full bg-brand-blue text-white py-4 rounded-2xl font-bold uppercase text-[10px] tracking-widest shadow-xl hover:bg-blue-600 transition-all">
                  Save Identity
                </button>
              </form>

              <button 
                onClick={logout}
                className="w-full mt-4 flex items-center justify-center gap-2 text-red-500 font-bold text-[10px] uppercase tracking-widest p-4 rounded-2xl border border-red-50 dark:border-red-900/10 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
              >
                <LogOut size={14} /> Log Out
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;