import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Award, Lock, ShieldCheck, Timer, BookOpen, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../context/authStore';
import { useCourseStore } from '../context/courseStore';

const ExamsHub = () => {
  const navigate = useNavigate();
  const { user, purchasedCourses, completedCourses } = useAuthStore();
  const { courses } = useCourseStore();

  // Map courses to exam objects, only showing those that have an exam published
  const availableExams = courses
    .filter(course => course.exam)
    .map(course => ({
      id: course.exam.examId,
      title: course.title,
      courseId: course.id,
      questions: course.exam.questions.length,
      duration: "30 min", // Default duration
      difficulty: "Professional"
    }));

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
          {availableExams.length > 0 ? availableExams.map((exam) => {
            const isOwned = purchasedCourses?.includes(exam.courseId);
            const isFinished = completedCourses?.includes(exam.courseId);
            const isUnlocked = isOwned && isFinished;
            
            // Check if user already has a result for this exam
            const result = user?.examResults?.find(r => r.courseId === exam.courseId);

            return (
              <motion.div
                key={exam.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`relative group p-[1px] rounded-[2rem] md:rounded-[2.5rem] transition-all duration-500 ${isUnlocked ? 'bg-gradient-to-r from-brand-blue/20 via-slate-200 to-brand-blue/20 dark:via-slate-800' : 'bg-slate-100 dark:bg-slate-800 opacity-60'}`}
              >
                <div className="bg-white dark:bg-brand-dark rounded-[1.9rem] md:rounded-[2.4rem] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex flex-col md:flex-row items-center gap-6 w-full text-center md:text-left">
                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 duration-500 ${isUnlocked ? 'bg-brand-blue text-white shadow-2xl shadow-brand-blue/30' : 'bg-slate-50 dark:bg-slate-900 text-slate-300'}`}>
                      {result ? <CheckCircle2 size={36} /> : isUnlocked ? <Award size={36} /> : (isOwned && !isFinished) ? <AlertCircle size={32} /> : <Lock size={32} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center gap-2 mb-3">
                         <h3 className="text-lg md:text-xl font-heading font-bold text-slate-900 dark:text-white">{exam.title}</h3>
                         {result && (
                           <span className={`w-fit mx-auto md:mx-0 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${result.passed ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                             {result.passed ? 'Certified' : 'Failed'} • {result.score}%
                           </span>
                         )}
                      </div>
                      <div className="flex flex-wrap justify-center md:justify-start gap-4 text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">
                        <div className="flex items-center gap-2"><BookOpen size={14}/> {exam.questions} Qs</div>
                        <div className="flex items-center gap-2"><Timer size={14}/> {exam.duration}</div>
                        {!isFinished && isOwned && <div className="text-brand-blue flex items-center gap-1"><AlertCircle size={12}/> Complete curriculum to unlock</div>}
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    disabled={!isUnlocked || result?.passed}
                    onClick={() => navigate(`/exam/${exam.courseId}`)}
                    className={`w-full md:w-auto px-8 py-4 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all ${isUnlocked && !result?.passed ? 'bg-slate-900 dark:bg-white text-white dark:text-brand-dark hover:bg-brand-blue hover:text-white active:scale-95 shadow-xl shadow-slate-900/10' : 'bg-slate-50 dark:bg-slate-900/50 text-slate-400 cursor-not-allowed'}`}
                  >
                    {result?.passed ? 'Board Certified' : isUnlocked ? 'Start Assessment' : isOwned ? 'Module Locked' : 'Curriculum Required'}
                  </button>
                </div>
              </motion.div>
            );
          }) : (
            <div className="py-20 text-center">
              <p className="text-slate-400 font-mono text-[10px] uppercase tracking-widest">No examinations have been ratified by the board yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamsHub;