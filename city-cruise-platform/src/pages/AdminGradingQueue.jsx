import React from 'react';
import { motion } from 'framer-motion';
import { User, BookOpen, Send, CheckCircle } from 'lucide-react';

const AdminGradingQueue = () => {
  const submissions = [
    { id: 1, student: "Kwame Mensah", course: "Global Strategy", date: "Feb 28, 2026", type: "Theory Submission" }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900">Pending Assessments</h2>
      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
        {submissions.map(sub => (
          <div key={sub.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-all cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                <User size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">{sub.student}</h4>
                <p className="text-xs text-slate-500">{sub.course} &bull; {sub.date}</p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest group-hover:bg-brand-blue transition-all">
              Launch Grading <ChevronRight size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminGradingQueue;