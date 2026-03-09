import React from 'react';
import { useAdminStore } from '../context/adminStore';
import { useAuthStore } from '../context/authStore';
import { RefreshCcw, ChevronRight, User } from 'lucide-react';

const AdminGradingQueue = () => {
  const { pendingSubmissions, fetchPendingSubmissions, finalizeGrading, isLoading } = useAdminStore();
  const { recordExamResult } = useAuthStore();

  React.useEffect(() => {
    fetchPendingSubmissions();
  }, [fetchPendingSubmissions]);

  const handleGrade = async (subId) => {
    const theoryScore = 10; 
    await finalizeGrading(subId, theoryScore, recordExamResult);
  };

  return (
    <div className="space-y-6 px-4 md:px-0">
      <div className="flex justify-between items-center">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900">Pending Assessments</h2>
        <button 
          onClick={fetchPendingSubmissions} 
          className="p-2.5 hover:bg-slate-100 rounded-full transition-colors bg-white border border-slate-100 shadow-sm"
        >
          <RefreshCcw size={20} className={isLoading ? 'animate-spin text-brand-blue' : 'text-slate-600'} />
        </button>
      </div>

      <div className="bg-white rounded-[24px] md:rounded-[32px] border border-slate-200 shadow-sm overflow-hidden min-h-[200px]">
        {isLoading ? (
          <div className="p-12 flex justify-center"><RefreshCcw className="animate-spin text-brand-blue" size={32} /></div>
        ) : pendingSubmissions.length > 0 ? (
          pendingSubmissions.map(sub => (
            <div key={sub.id} className="p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-slate-50 transition-all cursor-pointer group border-b border-slate-100 last:border-0 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                  <User size={20} />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-900 truncate">{sub.studentName || sub.student}</h4>
                  <p className="text-xs text-slate-500 truncate">{sub.courseTitle || sub.course} &bull; {sub.date || sub.submittedAt}</p>
                </div>
              </div>
              <button 
                onClick={() => handleGrade(sub.id)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest group-hover:bg-brand-blue transition-all"
              >
                Launch Grading <ChevronRight size={14} />
              </button>
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-slate-400 font-mono text-[10px] md:text-xs uppercase tracking-widest">
            No pending assessments at this time.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGradingQueue;