import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, CheckCircle2, HelpCircle, 
  FileText, AlignLeft, Layers, AlertCircle, Send
} from 'lucide-react';
import { useCourseStore } from '../context/courseStore';
import { useAuthStore } from '../context/authStore'; 

const AdminExamBuilder = () => {
  const { courses, updateCourse, updateSubmissionStatus } = useCourseStore();
  const recordExamResult = useAuthStore(state => state.recordExamResult);

  const [view, setView] = useState('builder'); 
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id);
  const [questions, setQuestions] = useState([
    { id: 1, type: 'objective', text: 'What is the primary goal of Global Strategy?', options: ['Profit', 'Expansion', 'Sustainability', 'All of above'], correct: 3 },
    { id: 2, type: 'theory', text: 'Explain the impact of Diaspora investment on local emerging markets.', points: 20 }
  ]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [gradingScore, setGradingScore] = useState("");

  const allPending = courses.reduce((acc, course) => {
    const pending = (course.submissions || [])
      .filter(s => s.status === 'Pending Review')
      .map(s => ({ ...s, courseId: course.id, courseTitle: course.title }));
    return [...acc, ...pending];
  }, []);

  const addQuestion = (type) => {
    const newQ = type === 'objective' 
      ? { id: Date.now(), type: 'objective', text: '', options: ['', '', '', ''], correct: 0 }
      : { id: Date.now(), type: 'theory', text: '', points: 10 };
    setQuestions([...questions, newQ]);
    setSelectedIdx(questions.length);
  };

  const handlePublishExam = () => {
    const targetCourse = courses.find(c => c.id === selectedCourseId);
    if (targetCourse) {
      updateCourse(selectedCourseId, {
        exam: {
          examId: `EXAM-${Date.now()}`,
          questions: [...questions],
          publishedAt: new Date().toISOString()
        }
      });
      alert(`Success: Exam published to ${targetCourse.title}`);
    }
  };

  const handleFinalizeGrade = (submission) => {
    if (!gradingScore) return alert("Please assign a theory score first.");
    const theoryPoints = parseInt(gradingScore);
    const finalScore = Math.min(100, Math.round((submission.objectiveScore * 0.5) + theoryPoints));
    const passed = finalScore >= 70;

    updateSubmissionStatus(submission.courseId, submission.id, { 
      status: 'Graded', 
      finalScore: finalScore,
      passed: passed 
    });

    recordExamResult(submission.courseId, submission.courseTitle, passed, finalScore);
    alert(`Grading Complete: ${finalScore}% - ${passed ? 'PASSED' : 'FAILED'}`);
    setGradingScore("");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex gap-2">
           <button onClick={() => setView('builder')} className={`px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${view === 'builder' ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' : 'text-slate-500 hover:bg-slate-50'}`}>Builder</button>
           <button onClick={() => setView('grading')} className={`px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest relative transition-all ${view === 'grading' ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' : 'text-slate-500 hover:bg-slate-50'}`}>
             Board Review
             {allPending.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] flex items-center justify-center rounded-full border-2 border-white">{allPending.length}</span>}
           </button>
        </div>
        
        {view === 'builder' && (
          <div className="flex items-center gap-3">
            <select value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)} className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold uppercase tracking-widest outline-none text-slate-600 font-black cursor-pointer">
              {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
            <button onClick={handlePublishExam} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"><Send size={14} /> Commit to Live</button>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {view === 'builder' ? (
          <motion.div key="builder" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col lg:flex-row h-[75vh] bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
            <div className="w-full lg:w-80 border-r border-slate-100 flex flex-col bg-slate-50/30">
              <div className="p-6 border-b border-slate-100 bg-white"><h3 className="font-black text-slate-900 text-sm flex items-center gap-2 uppercase tracking-tighter"><Layers size={18} className="text-brand-blue" /> Exam Schema</h3></div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {questions.map((q, i) => (
                  <button key={q.id} onClick={() => setSelectedIdx(i)} className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all border-2 ${selectedIdx === i ? 'bg-white border-brand-blue shadow-xl shadow-brand-blue/5' : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-100'}`}>
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${q.type === 'objective' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>{q.type === 'objective' ? <CheckCircle2 size={12} /> : <FileText size={12} />}</div>
                    <span className="text-[11px] font-bold truncate uppercase tracking-tight">Q{i + 1}: {q.text || 'Untitled Node'}</span>
                  </button>
                ))}
              </div>
              <div className="p-4 bg-white border-t border-slate-100 grid grid-cols-2 gap-2">
                <button onClick={() => addQuestion('objective')} className="p-4 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-brand-blue transition-colors"><Plus size={14} /> Objectives</button>
                <button onClick={() => addQuestion('theory')} className="p-4 border-2 border-slate-100 text-slate-600 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"><Plus size={14} /> Theory</button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-white p-12">
              {questions[selectedIdx] ? (
                <div className="max-w-2xl mx-auto space-y-10">
                  <div className="flex justify-between items-center">
                    <span className="px-4 py-1.5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em]">{questions[selectedIdx].type}</span>
                    <button onClick={() => { const f = questions.filter(q => q.id !== questions[selectedIdx].id); setQuestions(f); setSelectedIdx(0); }} className="text-red-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-xl"><Trash2 size={20} /></button>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Question Intelligence</label>
                    <textarea className="w-full p-8 bg-slate-50 border-none rounded-[32px] text-lg font-bold text-slate-900 focus:ring-2 ring-brand-blue/10 outline-none min-h-[150px] transition-all" value={questions[selectedIdx].text} onChange={(e) => { const u = [...questions]; u[selectedIdx].text = e.target.value; setQuestions(u); }} placeholder="Define the challenge..." />
                  </div>
                  {questions[selectedIdx].type === 'objective' ? (
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Response Keys</label>
                      <div className="grid gap-4">
                        {questions[selectedIdx].options.map((opt, oIdx) => (
                          <div key={oIdx} className="flex gap-4 items-center">
                            <button onClick={() => { const u = [...questions]; u[selectedIdx].correct = oIdx; setQuestions(u); }} className={`w-14 h-14 shrink-0 rounded-[20px] flex items-center justify-center border-2 font-black transition-all ${questions[selectedIdx].correct === oIdx ? 'bg-brand-blue border-brand-blue text-white shadow-lg' : 'border-slate-100 text-slate-300'}`}>{String.fromCharCode(65 + oIdx)}</button>
                            <input type="text" value={opt} className="flex-1 p-5 bg-slate-50 border-none rounded-[20px] text-sm font-bold text-slate-900" onChange={(e) => { const u = [...questions]; u[selectedIdx].options[oIdx] = e.target.value; setQuestions(u); }} placeholder={`Option ${String.fromCharCode(65 + oIdx)}`} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-10 border-2 border-dashed border-slate-100 rounded-[40px] bg-slate-50/30 text-center">
                        <div className="flex flex-col items-center gap-4 text-slate-400 mb-6"><AlignLeft size={40} className="opacity-20"/><p className="text-[11px] font-bold uppercase tracking-widest max-w-[200px]">Theoretical prompts require manual board intervention.</p></div>
                        <div className="flex items-center justify-center gap-3">
                             <span className="text-[10px] font-black uppercase text-slate-500">Weight:</span>
                             <input type="number" className="w-24 p-4 bg-white border border-slate-100 rounded-2xl font-black text-center text-brand-blue" value={questions[selectedIdx].points || 0} onChange={(e) => { const u = [...questions]; u[selectedIdx].points = parseInt(e.target.value); setQuestions(u); }} />
                        </div>
                    </div>
                  )}
                </div>
              ) : <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-4 opacity-50"><HelpCircle size={64} strokeWidth={1} /><p className="font-black uppercase tracking-widest text-xs">Architectural Workspace Empty</p></div>}
            </div>
          </motion.div>
        ) : (
          <motion.div key="grading" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {allPending.length > 0 ? allPending.map(sub => (
              <div key={sub.id} className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm space-y-8">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-2xl font-black text-slate-900 tracking-tight">{sub.studentName}</h4>
                    <p className="text-[10px] text-brand-blue font-black uppercase tracking-[0.2em] mt-2">{sub.courseTitle}</p>
                  </div>
                  <span className="px-4 py-1.5 bg-slate-50 text-slate-400 text-[10px] font-black uppercase rounded-full border border-slate-100">Review Required</span>
                </div>
                <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100">
                  <p className="text-[10px] font-black text-brand-blue uppercase mb-4 tracking-widest">Candidate Argument</p>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium italic">"{Object.values(sub.answers)[0] || "No response provided."}"</p>
                </div>
                <div className="flex items-end gap-6">
                  <div className="flex-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase block mb-3 tracking-widest">Award Competency Points (0-50)</label>
                    <input type="number" value={gradingScore} onChange={(e) => setGradingScore(e.target.value)} className="w-full p-5 bg-slate-50 border-none rounded-[20px] font-black text-brand-blue" placeholder="e.g. 45" />
                  </div>
                  <button onClick={() => handleFinalizeGrade(sub)} className="h-[64px] px-10 bg-slate-900 text-white rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-brand-blue transition-all shadow-xl shadow-slate-900/10">Authorize Grade</button>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-32 text-center opacity-30 flex flex-col items-center">
                  <CheckCircle2 size={64} className="mb-6 text-emerald-500" strokeWidth={1} />
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-900">Board Queue Cleared</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminExamBuilder;