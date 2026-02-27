import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Award, Lock, CheckCircle2, ArrowRight, ShieldCheck, Timer, BookOpen } from 'lucide-react';
import { useAuthStore } from '../context/authStore';

const ExamsHub = () => {
  const navigate = useNavigate();
  const { purchasedCourses } = useAuthStore();

  const allExams = [
    { id: "1", title: "Global Strategy Certification", courseId: "1", questions: 15, duration: "30 min", difficulty: "Advanced" },
    { id: "2", title: "International Finance Professional", courseId: "2", questions: 20, duration: "45 min", difficulty: "Expert" },
    { id: "3", title: "Fintech UI/UX Specialist", courseId: "3", questions: 12, duration: "20 min", difficulty: "Intermediate" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-brand-dark p-6 md:p-12 lg:pl-32">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <header className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-brand-blue/10 rounded-xl flex items-center justify-center text-brand-blue">
              <ShieldCheck size={24} />
            </div>
            <p className="text-brand-blue font-mono text-[10px] uppercase tracking-[0.4em]">Credentialing Center</p>
          </div>
          <h1 className="text-5xl font-heading font-bold text-slate-900 dark:text-white leading-tight">
            Validate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-blue-400">Authority.</span>
          </h1>
        </header>

        {/* Exams List */}
        <div className="grid gap-6">
          {allExams.map((exam, index) => {
            const isUnlocked = purchasedCourses?.includes(exam.courseId);
            
            return (
              <motion.div
                key={exam.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative group p-[1px] rounded-[2.5rem] transition-all duration-500 ${
                  isUnlocked 
                  ? 'bg-gradient-to-r from-brand-blue/20 via-slate-200 to-brand-blue/20 hover:from-brand-blue/40' 
                  : 'bg-slate-100 dark:bg-slate-800 opacity-60'
                }`}
              >
                <div className="bg-white dark:bg-brand-dark rounded-[2.4rem] p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex items-center gap-6 w-full">
                    {/* Status Icon */}
                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:scale-110 ${
                      isUnlocked 
                      ? 'bg-brand-blue text-white shadow-2xl shadow-brand-blue/30' 
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-300'
                    }`}>
                      {isUnlocked ? <Award size={36} /> : <Lock size={32} />}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white">
                          {exam.title}
                        </h3>
                        {isUnlocked && (
                          <span className="flex items-center gap-1 px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold uppercase tracking-widest rounded-full">
                            <CheckCircle2 size={10} /> Ready
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-6 text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">
                        <div className="flex items-center gap-2">
                          <BookOpen size={14} className="text-brand-blue" />
                          {exam.questions} Questions
                        </div>
                        <div className="flex items-center gap-2">
                          <Timer size={14} className="text-brand-blue" />
                          {exam.duration}
                        </div>
                        <div className="px-3 py-1 border border-slate-100 dark:border-slate-800 rounded-md">
                          {exam.difficulty}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-auto">
                    {isUnlocked ? (
                      <button 
                        onClick={() => navigate(`/exam/${exam.courseId}`)}
                        className="w-full md:w-auto flex items-center justify-center gap-4 bg-slate-900 dark:bg-white text-white dark:text-brand-dark px-10 py-5 rounded-2xl font-bold uppercase text-[10px] tracking-[0.2em] hover:bg-brand-blue hover:text-white transition-all shadow-xl active:scale-95"
                      >
                        Start Assessment <ArrowRight size={16} />
                      </button>
                    ) : (
                      <button 
                        disabled
                        className="w-full md:w-auto flex items-center justify-center gap-4 bg-slate-50 dark:bg-slate-900/50 text-slate-400 px-10 py-5 rounded-2xl font-bold uppercase text-[10px] tracking-[0.2em] cursor-not-allowed border border-slate-100 dark:border-slate-800"
                      >
                        Enroll to Unlock <Lock size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Support Note */}
        <p className="mt-12 text-center text-slate-400 text-xs font-medium italic">
          Pass mark for all professional certifications is 100%. One retake allowed every 24 hours.
        </p>
      </div>
    </div>
  );
};

export default ExamsHub;