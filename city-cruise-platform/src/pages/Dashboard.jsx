import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';
import { useCertificateStore } from '../context/certificateStore';
import { useCourseStore } from '../context/courseStore';
import CertificateGenerator, { downloadCertificate } from '../components/CertificateGenerator';
import {
  PlayCircle, Award, BookOpen, User, X,
  LogOut, Camera, KeyRound, Sparkles,
  FileText, RefreshCcw, ClipboardCheck,
  Trophy, AlertTriangle, ShieldCheck, Zap
} from 'lucide-react';
import { fetchCertificate } from '../api/courseService';

const Dashboard = () => {
  const { user, logout, updateProfile } = useAuthStore();
  const { enrolledCourses, fetchMyCourses, isLoading } = useCourseStore();
  const { certificates, notifications, refreshResults, clearNotification } = useCertificateStore();
  const navigate = useNavigate();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeNotification, setActiveNotification] = useState(null);

  const [editName, setEditName] = useState(user?.username || '');
  const [newPassword, setNewPassword] = useState('');
  const certificateRef = useRef(null);
  const [selectedCourseForCert, setSelectedCourseForCert] = useState(null);

  // Dynamic Status Logic based on Certificates earned
  const getMemberStatus = () => {
    const certCount = certificates?.length || 0;
    if (certCount >= 5) return { label: "Elite Member", color: "bg-brand-blue text-white", icon: <ShieldCheck size={12} />, shadow: "shadow-brand-blue/20" };
    if (certCount >= 2) return { label: "Pro Member", color: "bg-purple-600 text-white", icon: <Zap size={12} />, shadow: "shadow-purple-500/20" };
    return { label: "Standard Member", color: "bg-slate-900 text-white", icon: <User size={12} />, shadow: "shadow-slate-900/20" };
  };

  const status = getMemberStatus();

  // 4. Lifecycle & Backend Sync
  useEffect(() => {
    refreshResults();
    fetchMyCourses();
  }, [fetchMyCourses]);

  useEffect(() => {
    const unviewed = notifications.find(n => !n.viewed);
    if (unviewed) {
      setActiveNotification(unviewed);
    }
  }, [notifications]);

  const handleDismissNotification = () => {
    if (activeNotification) {
      clearNotification(activeNotification.id);
      setActiveNotification(null);
    }
  };

  const getInitials = (name) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const updateData = {
      username: editName,
    };

    if (newPassword) {
      updateData.password = newPassword;
    }

    const result = await updateProfile(updateData);

    if (result.success) {
      setIsProfileOpen(false);
      setNewPassword('');
      logout();
    } else {
      alert(result.message);
    }
  };

  const handleDownload = async (course) => {
    if (!course) return;

    const targetId = course.courseId || course.id;

    if (!targetId) {
      alert("Invalid course reference.");
      return;
    }

    setIsDownloading(true);

    try {
      const result = await fetchCertificate(targetId);

      const certData = result.data;

      const completeCourseData = {
        ...course,
        title: certData.course_title,     // Use the official title from DB
        certId: certData.certificate_uuid, // The actual UUID for the serial number
        issueDate: certData.issue_date     // The actual date it was generated
      };

      setSelectedCourseForCert(completeCourseData);

      setTimeout(async () => {
        try {
          await downloadCertificate(certificateRef, completeCourseData.title);
        } catch (error) {
          console.error("PDF Export failed:", error);
        } finally {
          setIsDownloading(false);
          setSelectedCourseForCert(null);
        }
      }, 800);

    } catch (error) {
      console.error("Certificate fetch error:", error);

      const errorMsg = error.response?.data?.message || "Your certificate is not ready for download yet.";
      alert(errorMsg);

      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-brand-dark flex flex-col selection:bg-brand-blue selection:text-white">
      {/* Hidden Certificate Engine */}
      <CertificateGenerator
        user={user}
        course={selectedCourseForCert}
        certificateRef={certificateRef}
      />

      {/* Notifications Overlay (Exam Results) */}
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
                    onClick={() => handleDownload(activeNotification)}
                    className="w-full py-4 bg-brand-blue text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-xl shadow-brand-blue/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                  >
                    <Award size={16} />
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

      {/* Navbar */}
      <nav className="pl-20 pr-6 md:px-12 py-8 flex justify-between items-center bg-transparent relative z-10">
        <div>
          <p className="text-slate-400 font-mono text-[9px] uppercase tracking-[0.4em]">Navigator / Member Hub</p>
        </div>
        <button
          onClick={() => setIsProfileOpen(true)}
          className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-brand-blue hover:ring-2 ring-brand-blue transition-all overflow-hidden shrink-0 shadow-lg"
        >
          <div className="w-full h-full rounded-full bg-brand-blue flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-2xl">
            <span className="text-lg font-black text-white tracking-tighter">
              {getInitials(editName)}
            </span>
          </div>
        </button>
      </nav>

      {/* Main Dashboard Area */}
      <main className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full">
        <header className="mb-16 text-left">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-6">
            <span className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${status.color} ${status.shadow}`}>
              {status.icon} {status.label}
            </span>
            <div className="h-px w-12 bg-slate-200 dark:bg-slate-800" />
            <Sparkles size={14} className="text-amber-500 animate-pulse" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl md:text-7xl font-heading font-bold text-slate-900 dark:text-white leading-[1.1] tracking-tight"
          >
            Welcome & Progress, <br />
            <span className="text-brand-blue bg-clip-text inline-block italic">
              {user?.username || 'Student'}.
            </span>
          </motion.h1>
        </header>

        {/* Dynamic Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-20">
          {[
            { label: "Mastery Progress", val: (enrolledCourses?.length).toString().padStart(2, '0'), icon: BookOpen, color: "text-blue-500", bg: "bg-blue-50/50" },
            { label: "Global Badges", val: (certificates?.length || 0).toString().padStart(2, '0'), icon: Award, color: "text-amber-500", bg: "bg-amber-50/50" },
            { label: "Completion Rate", val: enrolledCourses.length > 0 ? `${Math.round((certificates?.length || 0) / enrolledCourses.length * 100)}%` : "0%", icon: ClipboardCheck, color: "text-emerald-500", bg: "bg-emerald-50/50" },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white dark:bg-slate-900/40 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 backdrop-blur-sm group hover:border-brand-blue/30 hover:shadow-xl hover:shadow-slate-200/20 transition-all duration-500">
              <div className={`w-14 h-14 rounded-2xl ${stat.bg} dark:bg-slate-800 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                <stat.icon className={`${stat.color}`} size={28} />
              </div>
              <h3 className="text-5xl font-heading font-bold dark:text-white mb-2 tracking-tighter">{stat.val}</h3>
              <p className="text-[11px] font-mono text-slate-400 uppercase tracking-[0.2em] font-bold">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-heading font-bold text-slate-900 dark:text-white">Active Curriculums</h2>
          <div className="h-px flex-1 mx-8 bg-slate-100 dark:bg-slate-800" />
        </div>

        {/* Courses Enrolled List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {isLoading ? (
            <div className="col-span-full py-20 flex flex-col items-center gap-4">
              <RefreshCcw className="animate-spin text-brand-blue" size={40} />
              <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Syncing Intelligence...</p>
            </div>
          ) : enrolledCourses.map((course, idx) => {
            const hasPassed = certificates?.includes(course.id);
            const total = course.total_lessons || 0;
            const completed = course.completed_lessons || 0;
            const progressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

            return (
              <motion.div key={course.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + (idx * 0.1) }} className="group bg-white dark:bg-slate-900/40 rounded-[3rem] overflow-hidden border border-slate-100 dark:border-slate-800/60 flex flex-col md:flex-row shadow-sm hover:shadow-2xl transition-all duration-500">
                <div className="w-full md:w-64 h-56 md:h-auto bg-slate-50 dark:bg-slate-800 flex items-center justify-center relative shrink-0 overflow-hidden">
                  <div
                    style={{
                      backgroundImage: `url(${import.meta.env.VITE_API_URL}${course.cover_image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                    className="absolute inset-0 z-0"
                  />
                  {/* <img src={import.meta.env.VITE_API_URL + course.cover_image} alt={course.title} /> */}
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {hasPassed ? <Award className="text-amber-500 drop-shadow-lg" size={64} /> : <PlayCircle className="text-brand-blue drop-shadow-lg" size={64} />}
                </div>
                <div className="p-10 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-heading font-bold text-slate-900 dark:text-white mb-3 group-hover:text-brand-blue transition-colors leading-tight">{course.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8 line-clamp-2">{course.description}</p>

                    {!hasPassed && (
                      <div className="mb-8">
                        <div className="flex justify-between items-end mb-3">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Knowledge Progress</span>
                          <span className="text-xs font-mono font-bold text-brand-blue">{progressPercentage}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercentage}%` }}
                            transition={{ duration: 1.5, ease: "circOut" }}
                            className="h-full bg-brand-blue shadow-[0_0_15px_rgba(0,102,255,0.4)]"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {hasPassed && (
                      <button
                        onClick={() => handleDownload(course)}
                        disabled={isDownloading}
                        className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:shadow-lg hover:shadow-emerald-500/20 transition-all disabled:opacity-50"
                      >
                        {isDownloading && selectedCourseForCert?.id === course.id ? (
                          <RefreshCcw size={14} className="animate-spin" />
                        ) : (
                          <FileText size={14} />
                        )}
                        {isDownloading && selectedCourseForCert?.id === course.id ? 'Securing PDF...' : 'Download Certificate'}
                      </button>
                    )}

                    {progressPercentage === 100 && !hasPassed && (
                      <button onClick={() => navigate(`/exam/${course.id}`)} className="flex items-center gap-2 px-8 py-3 bg-brand-blue text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:shadow-xl hover:shadow-brand-blue/30 transition-all">
                        <ClipboardCheck size={14} /> Enter Exam Hall
                      </button>
                    )}

                    {progressPercentage < 100 && (
                      <button onClick={() => navigate(`/course/${course.id}`)} className="px-8 py-3 bg-slate-900 dark:bg-brand-blue text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all">
                        {progressPercentage > 0 ? 'Resume Study' : 'Start Curriculum'}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* Identity Sidebar */}
      <AnimatePresence>
        {isProfileOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsProfileOpen(false)}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-xl"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-[3.5rem] p-10 shadow-2xl border border-white/10"
            >
              <button onClick={() => setIsProfileOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-brand-blue">
                <X size={24} />
              </button>

              <div className="flex flex-col items-center mb-10">
                <div className="w-24 h-24 rounded-full bg-brand-blue flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-2xl">
                  <span className="text-3xl font-black text-white tracking-tighter">
                    {getInitials(editName)}
                  </span>
                </div>

                <h3 className="text-3xl font-heading font-bold mt-8 text-slate-900 dark:text-white">Identity Hub</h3>
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-1">Tier: {status.label}</p>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Profile Username</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.5rem] outline-none focus:ring-4 ring-brand-blue/10 dark:text-white text-base font-bold transition-all"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <KeyRound size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Update Password</span>
                  </div>
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.5rem] outline-none dark:text-white text-sm focus:ring-4 ring-brand-blue/10"
                  />
                </div>

                <button type="submit" disabled={isLoading} className="w-full bg-brand-blue text-white py-5 rounded-[1.5rem] font-bold uppercase text-[10px] tracking-[0.3em] shadow-2xl shadow-brand-blue/30 hover:bg-blue-600 transition-all">
                  {isLoading ? "Updating..." : "Save Changes"}
                </button>
              </form>

              <button onClick={logout} className="w-full mt-6 flex items-center justify-center gap-3 text-red-500 font-bold text-[10px] uppercase tracking-widest p-5 rounded-[1.5rem] bg-red-50/50 dark:bg-red-900/10 hover:bg-red-50">
                <LogOut size={16} /> Sign Out
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;