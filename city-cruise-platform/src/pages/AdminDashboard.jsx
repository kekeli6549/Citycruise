import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, BookOpen, TrendingUp, LayoutGrid, ClipboardCheck, SearchX 
} from 'lucide-react';
import { useAuthStore } from '../context/authStore';
import { useAdminStore } from '../context/adminStore'; 
import { useCourseStore } from '../context/courseStore'; // Added to pull live exam data
import AdminUserManagement from './AdminUserManagement';
import AdminCourseManager from './AdminCourseManager';
import AdminExamBuilder from './AdminExamBuilder';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const activityLog = useAuthStore(state => state.activityLog);
  const { students, revenue } = useAdminStore(); 
  const { courses } = useCourseStore();

  // Derived: Real-time count of all pending submissions across all courses
  const allPending = courses.reduce((acc, course) => {
    const pending = (course.submissions || []).filter(s => s.status === 'Pending Review');
    return acc + pending.length;
  }, 0);

  const stats = [
    { label: "Total Students", value: students.length.toLocaleString(), icon: Users, trend: "+12%", color: "text-blue-600" },
    { label: "Course Revenue", value: `$${revenue.toLocaleString()}`, icon: TrendingUp, trend: "+8%", color: "text-emerald-600" },
    { label: "Pending Exams", value: allPending.toString(), icon: ClipboardCheck, trend: allPending > 0 ? "Action Needed" : "All Clear", color: "text-purple-600" },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutGrid },
    { id: 'users', label: 'Students', icon: Users },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'assessments', label: 'Assessments', icon: ClipboardCheck },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-10 font-sans text-slate-900">
      <header className="mb-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Command Center</h1>
          <p className="text-slate-500 text-sm mt-1 uppercase font-bold tracking-widest text-[10px] opacity-60">Rootle Professional Ecosystem</p>
        </div>
        
        <div className="flex bg-slate-200/50 p-1.5 rounded-2xl w-fit backdrop-blur-md border border-white/50 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                activeTab === tab.id 
                ? 'bg-white text-brand-blue shadow-md scale-[1.02]' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-white/30'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
              {tab.id === 'assessments' && allPending > 0 && (
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              )}
            </button>
          ))}
        </div>
      </header>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div 
            key="ov" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }} 
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex items-center justify-between group hover:border-brand-blue/30 transition-all">
                  <div>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                    <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stat.trend.includes('+') || stat.trend === 'Action Needed' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                        {stat.trend}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium italic">Live sync active</span>
                    </div>
                  </div>
                  <div className={`p-5 rounded-2xl bg-slate-50 ${stat.color} group-hover:scale-110 transition-transform`}><stat.icon size={28} /></div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white">
                  <h3 className="font-bold text-slate-900 flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${activityLog.length > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                    System Pulse
                  </h3>
                  <button className="text-[10px] font-bold uppercase tracking-widest text-brand-blue hover:bg-blue-50 px-4 py-2 rounded-lg transition-all border border-blue-50">Audit Logs</button>
                </div>
                <div className="divide-y divide-slate-50 px-4 min-h-[300px]">
                  {activityLog.length > 0 ? activityLog.map((log) => (
                    <div key={log.id} className="p-5 flex items-center justify-between hover:bg-slate-50/80 rounded-2xl transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-bold text-sm shadow-sm border border-slate-800">
                          {log.user?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{log.user}</p>
                          <p className="text-xs text-slate-500">
                            {log.action} <span className="text-brand-blue font-bold">{log.target}</span>
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{log.time}</span>
                    </div>
                  )) : (
                    <div className="flex flex-col items-center justify-center py-24 opacity-30">
                      <SearchX size={40} className="mb-4" />
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Ecosystem Quiet</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-brand-blue rounded-[40px] p-10 text-white shadow-2xl shadow-brand-blue/30 relative overflow-hidden group">
                <div className="relative z-10 h-full flex flex-col">
                  <p className="text-blue-200 text-[10px] font-black uppercase tracking-[0.3em] mb-6">Star Performer</p>
                  <h3 className="text-3xl font-black mb-4 font-heading leading-tight tracking-tighter">Global Strategy & Diaspora Wealth</h3>
                  <p className="text-blue-100 text-sm mb-10 leading-relaxed font-medium">Dominating the platform with an 84% completion rate this quarter.</p>
                  
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex -space-x-3">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="w-11 h-11 rounded-full border-4 border-brand-blue bg-blue-400 shadow-xl" />
                      ))}
                      <div className="w-11 h-11 rounded-full border-4 border-brand-blue bg-white text-brand-blue flex items-center justify-center text-[10px] font-black">+82</div>
                    </div>
                    <button className="p-4 bg-white/20 backdrop-blur-md rounded-[20px] hover:bg-white/30 transition-all border border-white/20">
                        <TrendingUp size={24} />
                    </button>
                  </div>
                </div>
                <TrendingUp className="absolute bottom-[-40px] right-[-40px] text-white/5 group-hover:text-white/10 transition-all duration-700" size={320} />
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