import { useAdminStore } from '../context/adminStore';
import { useAuthStore } from '../context/authStore';
import { RefreshCcw, ChevronRight } from 'lucide-react';

const AdminGradingQueue = () => {
  const { pendingSubmissions, fetchPendingSubmissions, finalizeGrading, isLoading } = useAdminStore();
  const { recordExamResult } = useAuthStore();

  React.useEffect(() => {
    fetchPendingSubmissions();
  }, []);

  const handleGrade = async (subId) => {
    // Current UI doesn't have a score input, let's assume 10 points for now as a placeholder
    // In a real scenario, this would open a modal with an input field
    const theoryScore = 10; 
    await finalizeGrading(subId, theoryScore, recordExamResult);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900">Pending Assessments</h2>
        <button onClick={fetchPendingSubmissions} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <RefreshCcw size={18} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden min-h-[200px]">
        {isLoading ? (
          <div className="p-12 flex justify-center"><RefreshCcw className="animate-spin text-brand-blue" size={32} /></div>
        ) : pendingSubmissions.length > 0 ? (
          pendingSubmissions.map(sub => (
            <div key={sub.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-all cursor-pointer group border-b border-slate-100 last:border-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                  <User size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{sub.studentName || sub.student}</h4>
                  <p className="text-xs text-slate-500">{sub.courseTitle || sub.course} &bull; {sub.date || sub.submittedAt}</p>
                </div>
              </div>
              <button 
                onClick={() => handleGrade(sub.id)}
                className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest group-hover:bg-brand-blue transition-all"
              >
                Launch Grading <ChevronRight size={14} />
              </button>
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-slate-400 font-mono text-xs uppercase tracking-widest">No pending assessments at this time.</div>
        )}
      </div>
    </div>
  );
};

export default AdminGradingQueue;