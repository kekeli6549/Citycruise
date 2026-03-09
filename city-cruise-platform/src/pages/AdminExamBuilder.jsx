import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, CheckCircle2, HelpCircle,
  FileText, AlignLeft, Layers, AlertCircle, Send, ChevronDown
} from 'lucide-react';
import { createExam, addQuestion as apiAddQuestion } from '../api/adminService';
import { useCourseStore } from '../context/courseStore';
import { useAdminStore } from '../context/adminStore';
import { useAuthStore } from '../context/authStore';

const AdminExamBuilder = () => {
  const { courses, fetchCourses, isLoading: storeLoading } = useCourseStore();
  const { finalizeGrading } = useAdminStore();
  const { recordExamResult } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [view, setView] = useState('builder');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [questions, setQuestions] = useState([
    { id: 1, type: 'objective', text: 'What is the primary goal of Global Strategy?', options: ['Profit', 'Expansion', 'Sustainability', 'All of above'], correct_option: 3 },
    { id: 2, type: 'theory', text: 'Explain the impact of Diaspora investment on local emerging markets.', points: 20 }
  ]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [gradingScore, setGradingScore] = useState("");

  useEffect(() => {
    fetchCourses();
  }, [courses]);

  const allPending = courses.reduce((acc, course) => {
    const pending = (course.submissions || [])
      .filter(s => s.status === 'Pending Review')
      .map(s => ({ ...s, courseId: course.id, courseTitle: course.title }));
    return [...acc, ...pending];
  }, []);

  const addQuestion = (type) => {
    const newQ = type === 'objective'
      ? { id: Date.now(), type: 'objective', text: '', options: ['', '', '', ''], correct_option: 0 }
      : { id: Date.now(), type: 'theory', text: '', points: 10 };
    setQuestions([...questions, newQ]);
    setSelectedIdx(questions.length);
  };

  const handlePublishExam = async () => {
    const targetCourse = courses.find(c => String(c.id) === String(selectedCourseId));
    if (!targetCourse) return alert("Please select a valid course.");
    if (questions.length === 0) return alert("Please add at least one question.");
    
    setIsLoading(true);
    try {
      const examResponse = await createExam(selectedCourseId, {
        title: `${targetCourse.title} Final Assessment`,
        duration: 30,
        passPercentage: 70
      });
      
      const examId = examResponse.data?.id || examResponse.id;
      
      for (const q of questions) {
        await apiAddQuestion(examId, {
          question_text: q.text,
          type: q.type,
          options: q.type === 'objective' ? q.options : [],
          correct_option: q.type === 'objective' ? q.correct_option : 0,
        });
      }
      
      alert(`Success: Exam published!`);
      fetchCourses();
      setQuestions([]);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to sync exam.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalizeGrade = async (submission) => {
    if (!gradingScore) return alert("Please assign a theory score first.");
    try {
      await finalizeGrading(submission.id, parseInt(gradingScore), recordExamResult);
      alert("Grading Complete.");
      setGradingScore("");
      fetchCourses(); // Refresh list
    } catch (err) {
      alert("Error during grading.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm gap-4">
        <div className="flex w-full sm:w-auto gap-2">
          <button onClick={() => setView('builder')} className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${view === 'builder' ? 'bg-brand-blue text-white' : 'text-slate-500 bg-slate-50'}`}>Builder</button>
          <button onClick={() => setView('grading')} className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest relative transition-all ${view === 'grading' ? 'bg-brand-blue text-white' : 'text-slate-500 bg-slate-50'}`}>
            Board Review
            {allPending.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] flex items-center justify-center rounded-full border-2 border-white">{allPending.length}</span>}
          </button>
        </div>

        {view === 'builder' && (
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <select value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)} className="w-full sm:w-auto p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none text-slate-600">
              {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
            <button 
              onClick={handlePublishExam} 
              disabled={isLoading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              <Send size={14} /> {isLoading ? 'Processing...' : 'Commit to Live'}
            </button>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {view === 'builder' ? (
          <motion.div key="builder" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col lg:flex-row lg:h-[75vh] bg-white rounded-[24px] md:rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
            {/* SCHEMA SIDEBAR */}
            <div className="w-full lg:w-80 border-b lg:border-r border-slate-100 flex flex-col bg-slate-50/30">
              <div className="p-4 md:p-6 border-b border-slate-100 bg-white"><h3 className="font-black text-slate-900 text-sm flex items-center gap-2 uppercase tracking-tighter"><Layers size={18} className="text-brand-blue" /> Exam Schema</h3></div>
              <div className="flex lg:flex-col overflow-x-auto lg:overflow-y-auto p-4 space-x-3 lg:space-x-0 lg:space-y-2">
                {questions.map((q, i) => (
                  <button key={q.id} onClick={() => setSelectedIdx(i)} className={`shrink-0 lg:shrink-1 w-48 lg:w-full flex items-center gap-3 p-4 rounded-2xl transition-all border-2 ${selectedIdx === i ? 'bg-white border-brand-blue shadow-xl' : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-100'}`}>
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${q.type === 'objective' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>{q.type === 'objective' ? <CheckCircle2 size={12} /> : <FileText size={12} />}</div>
                    <span className="text-[10px] md:text-[11px] font-bold truncate uppercase tracking-tight">Q{i + 1}: {q.text || 'Empty'}</span>
                  </button>
                ))}
              </div>
              <div className="p-4 bg-white border-t border-slate-100 grid grid-cols-2 gap-2">
                <button onClick={() => addQuestion('objective')} className="p-3 md:p-4 bg-slate-900 text-white rounded-xl text-[8px] md:text-[9px] font-black uppercase flex items-center justify-center gap-2 hover:bg-brand-blue"><Plus size={14} /> Objective</button>
                <button onClick={() => addQuestion('theory')} className="p-3 md:p-4 border-2 border-slate-100 text-slate-600 rounded-xl text-[8px] md:text-[9px] font-black uppercase flex items-center justify-center gap-2 hover:bg-slate-50"><Plus size={14} /> Theory</button>
              </div>
            </div>

            {/* EDITOR AREA */}
            <div className="flex-1 overflow-y-auto bg-white p-6 md:p-12">
              {questions[selectedIdx] ? (
                <div className="max-w-2xl mx-auto space-y-8 md:space-y-10">
                  <div className="flex justify-between items-center">
                    <span className="px-4 py-1.5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest">{questions[selectedIdx].type}</span>
                    <button onClick={() => { const f = questions.filter(q => q.id !== questions[selectedIdx].id); setQuestions(f); setSelectedIdx(0); }} className="text-red-400 p-2 hover:bg-red-50 rounded-xl"><Trash2 size={20} /></button>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Question Intelligence</label>
                    <textarea className="w-full p-6 md:p-8 bg-slate-50 border-none rounded-[24px] md:rounded-[32px] text-base md:text-lg font-bold text-slate-900 focus:ring-2 ring-brand-blue/10 outline-none min-h-[120px]" value={questions[selectedIdx].text} onChange={(e) => { const u = [...questions]; u[selectedIdx].text = e.target.value; setQuestions(u); }} placeholder="Define the challenge..." />
                  </div>
                  {questions[selectedIdx].type === 'objective' ? (
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Response Keys</label>
                      <div className="grid gap-4">
                        {questions[selectedIdx].options.map((opt, oIdx) => (
                          <div key={oIdx} className="flex gap-3 md:gap-4 items-center">
                            <button onClick={() => { const u = [...questions]; u[selectedIdx].correct_option = oIdx; setQuestions(u); }} className={`w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-[16px] md:rounded-[20px] flex items-center justify-center border-2 font-black transition-all ${questions[selectedIdx].correct_option === oIdx ? 'bg-brand-blue border-brand-blue text-white shadow-lg' : 'border-slate-100 text-slate-300'}`}>{String.fromCharCode(65 + oIdx)}</button>
                            <input type="text" value={opt} className="flex-1 p-4 md:p-5 bg-slate-50 border-none rounded-[16px] md:rounded-[20px] text-[13px] md:text-sm font-bold text-slate-900" onChange={(e) => { const u = [...questions]; u[selectedIdx].options[oIdx] = e.target.value; setQuestions(u); }} placeholder={`Option ${String.fromCharCode(65 + oIdx)}`} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 md:p-10 border-2 border-dashed border-slate-100 rounded-[32px] md:rounded-[40px] bg-slate-50/30 text-center">
                      <div className="flex flex-col items-center gap-4 text-slate-400 mb-6"><AlignLeft size={40} className="opacity-20" /><p className="text-[10px] font-bold uppercase tracking-widest">Theory requires manual intervention.</p></div>
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-[10px] font-black uppercase text-slate-500">Weight:</span>
                        <input type="number" className="w-20 md:w-24 p-3 md:p-4 bg-white border border-slate-100 rounded-2xl font-black text-center text-brand-blue" value={questions[selectedIdx].points || 0} onChange={(e) => { const u = [...questions]; u[selectedIdx].points = parseInt(e.target.value); setQuestions(u); }} />
                      </div>
                    </div>
                  )}
                </div>
              ) : <div className="h-full flex flex-col items-center justify-center text-slate-300 opacity-50"><HelpCircle size={64} strokeWidth={1} /><p className="font-black uppercase tracking-widest text-[10px]">Architectural Workspace Empty</p></div>}
            </div>
          </motion.div>
        ) : (
          <motion.div key="grading" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {allPending.length > 0 ? allPending.map(sub => (
              <div key={sub.id} className="bg-white p-8 md:p-10 rounded-[32px] md:rounded-[40px] border border-slate-200 shadow-sm space-y-8">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{sub.studentName}</h4>
                    <p className="text-[10px] text-brand-blue font-black uppercase tracking-widest mt-2">{sub.courseTitle}</p>
                  </div>
                  <span className="hidden sm:inline-block px-4 py-1.5 bg-slate-50 text-slate-400 text-[10px] font-black uppercase rounded-full border border-slate-100">Review Required</span>
                </div>
                <div className="p-6 md:p-8 bg-slate-50 rounded-[24px] md:rounded-[32px] border border-slate-100">
                  <p className="text-[10px] font-black text-brand-blue uppercase mb-4 tracking-widest">Candidate Argument</p>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium italic">"{Object.values(sub.answers)[0] || "No response provided."}"</p>
                </div>
                <div className="flex flex-col sm:flex-row items-end gap-6">
                  <div className="w-full sm:flex-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase block mb-3">Competency Points (0-50)</label>
                    <input type="number" value={gradingScore} onChange={(e) => setGradingScore(e.target.value)} className="w-full p-5 bg-slate-50 border-none rounded-[20px] font-black text-brand-blue" placeholder="e.g. 45" />
                  </div>
                  <button onClick={() => handleFinalizeGrade(sub)} className="w-full sm:w-auto h-[64px] px-10 bg-slate-900 text-white rounded-[24px] text-[10px] font-black uppercase tracking-widest hover:bg-brand-blue transition-all">Authorize Grade</button>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-32 text-center opacity-30 flex flex-col items-center">
                <CheckCircle2 size={64} className="mb-6 text-emerald-500" strokeWidth={1} />
                <p className="text-xs font-black uppercase tracking-widest text-slate-900">Board Queue Cleared</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminExamBuilder;