import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, BookOpen, TrendingUp, LayoutGrid, ClipboardCheck, SearchX, Menu, X, Trophy, Info, Trash2, Award, ExternalLink
} from 'lucide-react';
import { useAdminStore } from '../context/adminStore'; 
import { useCourseStore } from '../context/courseStore'; 
import AdminUserManagement from './AdminUserManagement';
import AdminCourseManager from './AdminCourseManager';
import AdminExamBuilder from './AdminExamBuilder';
import { useCertificateStore } from '../context/certificateStore';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const {allCertificates, adminFetchCertificates} = useCertificateStore();
  const hasAnnouncedSession = useRef(false);

  const { 
    students, 
    stats: adminStats, 
    activityLogs, 
    fetchStats, 
    fetchActivityLogs,
    fetchStudents 
  } = useAdminStore(); 
  const { courses, fetchCourses } = useCourseStore();

  const addNotification = (message, type = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const clearAllNotifications = () => setNotifications([]);

  useEffect(() => {
    fetchStats();
    fetchActivityLogs();
    fetchStudents();
    fetchCourses();
    adminFetchCertificates();

    if (!hasAnnouncedSession.current) {
      setTimeout(() => {
        addNotification("System synchronization complete. All nodes active.", "info");
      }, 1500);
      hasAnnouncedSession.current = true;
    }
  }, []);


  const starPerformer = useMemo(() => {
    if (!students || students.length === 0) return null;
    const top = [...students].sort((a, b) => {
      const aMax = Math.max(...(a.examResults?.map(r => r.score) || [0]));
      const bMax = Math.max(...(b.examResults?.map(r => r.score) || [0]));
      return bMax - aMax;
    })[0];
    return top;
  }, [students]);

  const allPending = useMemo(() => {
    return (courses || []).reduce((acc, course) => {
      const pending = (course.submissions || []).filter(s => s.status === 'Pending Review');
      return acc + pending.length;
    }, 0);
  }, [courses]);

  const stats = useMemo(() => [
    { 
      label: "Total Students", 
      value: (adminStats.totalStudents || students.length).toLocaleString(), 
      icon: Users, 
      trend: adminStats.trends?.students || "+0%", 
      color: "text-blue-600" 
    },
    { 
      label: "Course Revenue", 
      value: `₦${(adminStats.revenue || 0).toLocaleString()}`, 
      icon: TrendingUp, 
      trend: adminStats.trends?.revenue || "+0%", 
      color: "text-emerald-600" 
    },
    { 
      label: "Pending Exams", 
      value: (allPending).toString(), 
      icon: ClipboardCheck, 
      trend: allPending > 0 ? "Action Needed" : "All Clear", 
      color: "text-purple-600" 
    },
  ], [adminStats, students, allPending]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutGrid },
    { id: 'users', label: 'Students', icon: Users },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'assessments', label: 'Assessments', icon: ClipboardCheck },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 font-body text-slate-900 overflow-x-hidden relative">
      
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none w-full max-w-sm">
        <AnimatePresence>
          {notifications.length > 1 && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              onClick={clearAllNotifications}
              className="pointer-events-auto self-end mb-2 flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg hover:bg-slate-800 transition-all active:scale-95"
            >
              <Trash2 size={12} />
              Clear All
            </motion.button>
          )}
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              layout
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className="pointer-events-auto bg-white/90 backdrop-blur-xl border border-slate-200 shadow-2xl p-4 rounded-2xl flex items-start gap-4"
            >
              <div className={`p-2 rounded-xl shrink-0 ${n.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-brand-blue/10 text-brand-blue'}`}>
                {n.type === 'success' ? <Trophy size={18} /> : <Info size={18} />}
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Notification</p>
                <p className="text-xs font-bold text-slate-700 leading-tight">{n.message}</p>
              </div>
              <button 
                onClick={() => setNotifications(prev => prev.filter(item => item.id !== n.id))}
                className="text-slate-300 hover:text-slate-600 transition-colors"
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <header className="mb-8 md:mb-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight font-heading">Command Center</h1>
            <p className="text-slate-500 text-[9px] md:text-[10px] mt-1 uppercase font-bold tracking-widest opacity-60">City Cruise Professional Ecosystem</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              className="xl:hidden p-3 bg-white rounded-xl shadow-sm border border-slate-200 text-slate-600 active:scale-95 transition-all" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        
        <div className={`${isMobileMenuOpen ? 'flex' : 'hidden'} xl:flex flex-col md:flex-row bg-slate-200/50 p-1.5 rounded-2xl w-full xl:w-fit backdrop-blur-md border border-white/50 shadow-sm gap-1`}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setIsMobileMenuOpen(false); }}
              className={`flex items-center justify-center gap-2 px-4 md:px-5 py-2.5 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                activeTab === tab.id 
                ? 'bg-white text-brand-blue shadow-md scale-[1.02]' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-white/30'
              }`}
            >
              <tab.icon size={14} />
              <span className="whitespace-nowrap">{tab.label}</span>
              {tab.id === 'assessments' && allPending > 0 && (
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              )}
            </button>
          ))}
        </div>
      </header>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div key="ov" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6 md:space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-slate-200 shadow-sm flex items-center justify-between group hover:border-brand-blue/30 transition-all">
                  <div className="min-w-0">
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 truncate">{stat.label}</p>
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900">{stat.value}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${stat.trend.includes('+') || stat.trend === 'Action Needed' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                        {stat.trend}
                      </span>
                    </div>
                  </div>
                  <div className={`p-4 md:p-5 rounded-2xl bg-slate-50 ${stat.color} group-hover:scale-110 transition-transform shrink-0`}><stat.icon size={24} /></div>
                </div>
              ))}
            </div>

            <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-stretch">
              <div className="flex-1 bg-white rounded-[24px] md:rounded-[32px] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                  <h3 className="font-bold text-slate-900 flex items-center gap-3 font-heading uppercase text-xs tracking-widest">
                    <div className={`w-2 h-2 rounded-full ${activityLogs.length > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                    System Logs
                  </h3>
                </div>
                <div className="divide-y divide-slate-50 px-4 overflow-y-auto max-h-[450px] no-scrollbar">
                  {activityLogs.length > 0 ? activityLogs.map((log) => (
                    <div key={log.id} className="p-4 md:p-5 flex items-center justify-between hover:bg-slate-50/80 rounded-2xl transition-all gap-3">
                      <div className="flex items-center gap-3 md:gap-4 min-w-0">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-brand-dark flex items-center justify-center text-white font-bold text-xs md:text-sm shrink-0 uppercase">
                          {log.username?.charAt(0) || 'U'}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-800 truncate">{log.username}</p>
                          <p className="text-xs text-slate-500 truncate">
                            {log.ACTION} <span className="text-brand-blue font-bold">{log.details}</span>
                          </p>
                        </div>
                      </div>
                      <span className="hidden sm:inline-block text-[10px] font-mono font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full shrink-0">
                        {log.created_at ? new Date(log.created_at).toLocaleTimeString() : (log.time || 'Now')}
                      </span>
                    </div>
                  )) : (
                    <div className="flex flex-col items-center justify-center py-24 opacity-30">
                      <SearchX size={40} className="mb-4" />
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Ecosystem Quiet</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full lg:w-[400px] bg-brand-blue rounded-[32px] md:rounded-[40px] p-8 md:p-10 text-white shadow-2xl shadow-brand-blue/30 relative overflow-hidden group flex flex-col justify-between">
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
                      < Trophy size={20} className="text-amber-400" />
                    </div>
                    <p className="text-blue-100 text-[10px] font-black uppercase tracking-[0.3em]">Star Performer</p>
                  </div>

                  <h3 className="text-3xl md:text-4xl font-black mb-4 font-heading leading-none tracking-tighter">
                    {starPerformer ? (starPerformer.username || 'Student') : "Evaluating Talent..."}
                  </h3>
                  
                  <div className="inline-block px-4 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full mb-6">
                    <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                        Active Leader
                    </p>
                  </div>

                  <p className="text-blue-50/80 text-sm leading-relaxed font-medium max-w-[280px]">
                    {starPerformer 
                      ? `Currently leading the cohort with ${starPerformer.completedCourses || 0} completed certifications and top-tier assessment scores.` 
                      : "The next leader is currently analyzing the markets. Check back after next assessment."
                    }
                  </p>
                </div>

                <div className="relative z-10 pt-10 mt-auto">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex -space-x-3 overflow-hidden">
                      {students.slice(0, 4).map((s, i) => (
                        <div key={i} className="w-10 h-10 md:w-11 md:h-11 rounded-full border-4 border-brand-blue bg-blue-400 flex items-center justify-center font-bold text-[10px] uppercase shrink-0">
                          {s.username?.[0] || 'S'}
                        </div>
                      ))}
                      {students.length > 4 && (
                        <div className="w-10 h-10 md:w-11 md:h-11 rounded-full border-4 border-brand-blue bg-white text-brand-blue flex items-center justify-center text-[10px] font-black shrink-0">
                          +{students.length - 4}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <TrendingUp className="absolute bottom-[-60px] right-[-60px] text-white/5 group-hover:text-white/10 transition-all duration-700 pointer-events-none" size={350} />
                <div className="absolute top-[-20px] left-[-20px] w-40 h-40 bg-white/5 blur-[80px] rounded-full" />
              </div>
            </div>

            {/* --- NEW CERTIFIED USERS SECTION --- */}
            <div className="bg-white rounded-[24px] md:rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                <div>
                  <h3 className="font-bold text-slate-900 flex items-center gap-3 font-heading uppercase text-xs tracking-widest">
                    <Award size={18} className="text-brand-blue" />
                    Certification Ledger
                  </h3>
                  <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest mt-1">Verified professionals within the ecosystem</p>
                </div>
                <div className="bg-brand-blue/5 text-brand-blue px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter border border-brand-blue/10">
                  {allCertificates.length} - ISSUED
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">Professional</th>
                      <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">Course</th>
                      <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 text-center">Date Issued</th>
                      <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 text-right">Verification ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {allCertificates.length > 0 ? allCertificates.map((cert, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs uppercase group-hover:bg-brand-blue group-hover:text-white transition-colors">
                              {cert.username?.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">{cert.username}</p>
                              <p className="text-[10px] text-slate-400 font-medium">{cert.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-6">
                          <p className="text-sm font-bold text-slate-700">{cert.course_title || "Professional Certification"}</p>        
                        </td>
                        <td className="p-6 text-center">
                          <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-black">
                            {cert.issue_date ? new Date(cert.issue_date).toLocaleDateString() : "Unknown Date"}
                          </span>
                        </td>
                        <td className="p-6 text-right">
                          <p className="text-sm text-brand-blue font-black uppercase tracking-widest mt-0.5">{cert.certificate_uuid.slice(0, 8) || cert._id?.slice(-8)}</p>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="4" className="py-20 text-center opacity-30">
                          <Trophy size={48} className="mx-auto mb-4 text-slate-300" />
                          <p className="text-[10px] font-bold uppercase tracking-[0.3em]">No Certificates Issued Yet</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'users' && <AdminUserManagement />}
        {activeTab === 'courses' && <AdminCourseManager />}
        {activeTab === 'assessments' && <AdminExamBuilder />}
      </AnimatePresence>
    </div>
  );
};
 
export default AdminDashboard;