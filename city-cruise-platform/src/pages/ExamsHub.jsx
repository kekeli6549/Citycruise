import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Award, Lock, ShieldCheck, Timer, BookOpen, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../context/authStore';

const ExamsHub = () => {
  const navigate = useNavigate();
  const { purchasedCourses, completedCourses } = useAuthStore();

  const allExams = [
    { id: "1", title: "Global Strategy Certification", courseId: "1", questions: 15, duration: "30 min", difficulty: "Advanced" },
    { id: "2", title: "International Finance Professional", courseId: "2", questions: 20, duration: "45 min", difficulty: "Expert" },
    { id: "3", title: "Fintech UI/UX Specialist", courseId: "3", questions: 12, duration: "20 min", difficulty: "Intermediate" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-brand-dark">
      <div className="p-6 md:p-12 max-w-5xl mx-auto">
        <header className="mb-12 md:mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-brand-blue/10 rounded-xl flex items-center justify-center text-brand-blue shrink-0">
              <ShieldCheck size={24} />
            </div>
            <p className="text-brand-blue font-mono text-[10px] uppercase tracking-[0.4em]">Credentialing Center</p>
          </div>
          <h1 className="text-3xl md:text-5xl font-heading font-bold text-slate-900 dark:text-white leading-tight">
            Validate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-blue-400">Authority.</span>
          </h1>
        </header>

        <div className="grid gap-6">
          {allExams.map((exam) => {
            const isOwned = purchasedCourses?.includes(exam.courseId);
            const isFinished = completedCourses?.includes(exam.courseId);
            const isUnlocked = isOwned && isFinished;

            return (
              <motion.div
                key={exam.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`relative group p-[1px] rounded-[2rem] md:rounded-[2.5rem] transition-all duration-500 ${isUnlocked ? 'bg-gradient-to-r from-brand-blue/20 via-slate-200 to-brand-blue/20' : 'bg-slate-100 dark:bg-slate-800 opacity-60'}`}
              >
                <div className="bg-white dark:bg-brand-dark rounded-[1.9rem] md:rounded-[2.4rem] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex flex-col md:flex-row items-center gap-6 w-full text-center md:text-left">
                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 ${isUnlocked ? 'bg-brand-blue text-white shadow-2xl shadow-brand-blue/30' : 'bg-slate-50 dark:bg-slate-900 text-slate-300'}`}>
                      {isUnlocked ? <Award size={36} /> : (isOwned && !isFinished) ? <AlertCircle size={32} /> : <Lock size={32} />}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-heading font-bold text-slate-900 dark:text-white mb-3">{exam.title}</h3>
                      <div className="flex flex-wrap justify-center md:justify-start gap-4 text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">
                        <div className="flex items-center gap-2"><BookOpen size={14}/> {exam.questions} Qs</div>
                        <div className="flex items-center gap-2"><Timer size={14}/> {exam.duration}</div>
                        {!isFinished && isOwned && <div className="text-brand-blue">Finish course to unlock</div>}
                      </div>
                    </div>
                  </div>
                  <button 
                    disabled={!isUnlocked}
                    onClick={() => navigate(`/exam/${exam.courseId}`)}
                    className={`w-full md:w-auto px-8 py-4 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all ${isUnlocked ? 'bg-slate-900 dark:bg-white text-white dark:text-brand-dark hover:bg-brand-blue hover:text-white active:scale-95' : 'bg-slate-50 dark:bg-slate-900/50 text-slate-400 cursor-not-allowed'}`}
                  >
                    {isUnlocked ? 'Start Assessment' : isOwned ? 'Incomplete' : 'Locked'}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExamsHub;