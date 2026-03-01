import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, BookOpen, TrendingUp, Activity, 
  Plus, LayoutGrid, ClipboardCheck, Settings 
} from 'lucide-react';
import AdminUserManagement from './AdminUserManagement';
import AdminCourseManager from './AdminCourseManager';
import AdminExamBuilder from './AdminExamBuilder';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: "Total Students", value: "1,284", icon: Users, trend: "+12%", color: "text-blue-600" },
    { label: "Course Revenue", value: "$42,500", icon: TrendingUp, trend: "+8%", color: "text-emerald-600" },
    { label: "Active Lessons", value: "156", icon: BookOpen, trend: "Stable", color: "text-purple-600" },
  ];

  const recentActivity = [
    { id: 1, user: "Kwame Mensah", action: "Completed", target: "Global Strategy", time: "2 mins ago" },
    { id: 2, user: "Amara Oke", action: "Purchased", target: "UI/UX for Fintech", time: "15 mins ago" },
    { id: 3, user: "Zaidu Yusuf", action: "Failed Exam", target: "Finance Mastery", time: "1 hr ago" },
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
          <p className="text-slate-500 text-sm mt-1">Manage your educational ecosystem with surgical precision.</p>
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
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stat.trend.includes('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                        {stat.trend}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">vs last month</span>
                    </div>
                  </div>
                  <div className={`p-5 rounded-2xl bg-slate-50 ${stat.color} group-hover:scale-110 transition-transform`}><stat.icon size={28} /></div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-bold text-slate-900 flex items-center gap-3">
                    <div className="w-2 h-2 bg-brand-blue rounded-full animate-pulse" />
                    Live Ecosystem Activity
                  </h3>
                  <button className="text-[10px] font-bold uppercase tracking-widest text-brand-blue hover:bg-blue-50 px-4 py-2 rounded-lg transition-all">Full Log</button>
                </div>
                <div className="divide-y divide-slate-50 px-4">
                  {recentActivity.map((log) => (
                    <div key={log.id} className="p-5 flex items-center justify-between hover:bg-slate-50/80 rounded-2xl transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm border border-white shadow-sm">
                          {log.user.charAt(0)}
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
                  ))}
                </div>
              </div>

              <div className="bg-brand-blue rounded-[32px] p-8 text-white shadow-2xl shadow-brand-blue/30 relative overflow-hidden group">
                <div className="relative z-10 h-full flex flex-col">
                  <p className="text-blue-200 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">Star Performer</p>
                  <h3 className="text-2xl font-black mb-3 font-heading leading-tight">Global Strategy & Diaspora Wealth</h3>
                  <p className="text-blue-100 text-sm mb-10 leading-relaxed">Dominating the platform with an 84% completion rate this quarter.</p>
                  
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex -space-x-3">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-4 border-brand-blue bg-blue-400 shadow-xl" />
                      ))}
                      <div className="w-10 h-10 rounded-full border-4 border-brand-blue bg-white text-brand-blue flex items-center justify-center text-[10px] font-black">+82</div>
                    </div>
                    <button className="p-3 bg-white/20 backdrop-blur-md rounded-2xl hover:bg-white/30 transition-all">
                        <TrendingUp size={20} />
                    </button>
                  </div>
                </div>
                <TrendingUp className="absolute bottom-[-40px] right-[-40px] text-white/5 group-hover:text-white/10 transition-all duration-700" size={280} />
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