import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Award, Lock, ShieldCheck, Timer, BookOpen, AlertCircle, CheckCircle2, History, ClipboardCheck, XCircle } from 'lucide-react';
import { useCourseStore } from '../context/courseStore';

const ExamsHub = () => {
  const navigate = useNavigate();
  const { fetchExamHistory, examHistory } = useCourseStore();
  const { enrolledCourses, fetchMyCourses } = useCourseStore();

  useEffect(() => {
    fetchMyCourses();
    fetchExamHistory();
  }, []);

  const availableExams = enrolledCourses
    ? enrolledCourses
      .filter((course) => {
        const total = course.total_lessons || 0;
        const completed = course.completed_lessons || 0;
        const isPercentComplete = total > 0 && completed === total;

        return isPercentComplete;
      })
      .map((course) => ({
        id: course.course_id,
        title: course.title,
        description: course.description,
        courseId: course.id,
        duration: "30 min",
        difficulty: "Standard"
      }))
    : [];

  return (
    <div className="min-h-screen bg-white dark:bg-brand-dark pb-20">
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

        {/* Section 1: Available Exams */}
        <section className="mb-20">
          <div className="flex items-center gap-2 mb-8">
            <BookOpen size={18} className="text-slate-400" />
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Available Assessments</h2>
          </div>
          <div className="grid gap-6">
            {availableExams.map((exam, i) => {
              const isUnlocked = true;
              const result = examHistory?.find(r =>
                Number(r.course_id) === Number(exam.courseId) && r.passed === true
              );

              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className={`relative p-[1px] rounded-[2rem] md:rounded-[2.5rem] ${isUnlocked ? 'bg-gradient-to-r from-brand-blue/20 via-slate-200 to-brand-blue/20 dark:via-slate-800' : 'bg-slate-100 dark:bg-slate-800 opacity-60'}`}
                >
                  <div className="bg-white dark:bg-brand-dark rounded-[1.9rem] md:rounded-[2.4rem] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col md:flex-row items-center gap-6 w-full text-center md:text-left">
                      <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 ${isUnlocked ? 'bg-brand-blue text-white' : 'bg-slate-50 dark:bg-slate-900 text-slate-300'}`}>
                        {result ? <CheckCircle2 size={36} /> : isUnlocked ? <Award size={36} /> : <Lock size={32} />}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg md:text-xl font-heading font-bold text-slate-900 dark:text-white mb-2">{exam.title}</h3>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">
                          <span>{exam.duration}</span>
                          <span>•</span>
                          <span>{exam.difficulty}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      disabled={!isUnlocked || result}
                      onClick={() => navigate(`/exam/${exam.courseId}`)}
                      className={`w-full md:w-auto px-8 py-4 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all ${isUnlocked && !result ? 'bg-slate-900 dark:bg-white text-white dark:text-brand-dark' : 'bg-slate-50 dark:bg-slate-900/50 text-slate-400'}`}
                    >
                      {result ? 'Certified' : isUnlocked ? 'Begin' : 'Locked'}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Section 2: Exam History Table */}
        <section>
          <div className="flex items-center gap-2 mb-8">
            <History size={18} className="text-slate-400" />
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Examination Audit Trail</h2>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/40 rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-white/5">
            {examHistory && examHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-white/5">
                      <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Exam Title</th>
                      <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                      <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Score</th>
                      <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {examHistory.map((entry, index) => {
                      const isPassed = entry.passed === true;
                      return (
                        <tr key={entry.id} className="border-b border-slate-100 dark:border-white/5 last:border-0 hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
                          <td className="p-6">
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{entry.course_title}</p>
                            <p className="text-[10px] font-mono text-slate-400 uppercase">Ref: #{entry.id}</p>
                          </td>
                          <td className="p-6 text-sm text-slate-500 dark:text-slate-400">
                            {new Date(entry.created_at).toLocaleDateString()}
                          </td>
                          <td className="p-6">
                            <span className="text-sm font-mono font-bold text-slate-700 dark:text-slate-300">{entry.total_score}%</span>
                          </td>
                          <td className="p-6 text-right">
                            <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${isPassed ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                              {entry.STATUS}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-20 text-center">
                <ClipboardCheck size={48} className="mx-auto text-slate-200 dark:text-slate-800 mb-4" />
                <p className="text-slate-400 font-mono text-[10px] uppercase tracking-widest">No examination records found in the secure archive.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ExamsHub;