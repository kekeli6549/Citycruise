import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, CheckCircle2, HelpCircle, 
  FileText, AlignLeft, Layers, Save, X, 
  GripVertical, ChevronRight, Award, AlertCircle, Check
} from 'lucide-react';

const AdminExamBuilder = () => {
  const [view, setView] = useState('builder'); // 'builder' or 'grading'
  const [questions, setQuestions] = useState([
    { id: 1, type: 'objective', text: 'What is the primary goal of Global Strategy?', options: ['Profit', 'Expansion', 'Sustainability', 'All of above'], correct: 3 },
    { id: 2, type: 'theory', text: 'Explain the impact of Diaspora investment on local emerging markets.', points: 20 }
  ]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isGapModalOpen, setIsGapModalOpen] = useState(false);

  // Mock data for Pending Submissions
  const [pendingSubmissions, setPendingSubmissions] = useState([
    { id: 'sub_1', student: 'Kwame Mensah', course: 'Global Strategy', date: 'Feb 28, 2026', theoryAnswers: [{ qId: 2, text: 'The diaspora provides critical seed capital...' }], objScore: 70 },
  ]);
  const [gradingScore, setGradingScore] = useState("");

  const coursesWithoutExams = [
    { id: "3", title: "UI/UX for Fintech Platforms" }
  ];

  const addQuestion = (type) => {
    const newQ = type === 'objective' 
      ? { id: Date.now(), type: 'objective', text: '', options: ['', '', '', ''], correct: 0 }
      : { id: Date.now(), type: 'theory', text: '', points: 10 };
    setQuestions([...questions, newQ]);
    setSelectedIdx(questions.length);
  };

  const removeQuestion = (id) => {
    const filtered = questions.filter(q => q.id !== id);
    setQuestions(filtered);
    if (selectedIdx >= filtered.length) {
      setSelectedIdx(Math.max(0, filtered.length - 1));
    }
  };

  const finalizeGrade = (subId) => {
    const totalScore = pendingSubmissions.find(s => s.id === subId).objScore + parseInt(gradingScore || 0);
    const pass = totalScore >= 85;
    alert(`Final Score: ${totalScore}%. Student will receive ${pass ? 'Certificate' : 'Retake Option'}.`);
    setPendingSubmissions(pendingSubmissions.filter(s => s.id !== subId));
    setGradingScore("");
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex gap-2">
           <button onClick={() => setView('builder')} className={`px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${view === 'builder' ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' : 'text-slate-500 hover:bg-slate-50'}`}>Builder</button>
           <button onClick={() => setView('grading')} className={`px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all relative ${view === 'grading' ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' : 'text-slate-500 hover:bg-slate-50'}`}>
             Pending Grading
             {pendingSubmissions.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] flex items-center justify-center rounded-full border-2 border-white">{pendingSubmissions.length}</span>}
           </button>
        </div>
        <button onClick={() => setIsGapModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-amber-50 text-amber-700 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-amber-100 transition-all border border-amber-100">
           <AlertCircle size={14} /> Course Gaps
        </button>
      </div>

      <AnimatePresence mode="wait">
        {view === 'builder' ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col lg:flex-row h-[70vh] bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
            {/* LEFT: Question Navigator */}
            <div className="w-full lg:w-80 border-r border-slate-100 flex flex-col bg-slate-50/30">
              <div className="p-6 border-b border-slate-100 bg-white">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <Layers size={18} className="text-brand-blue" /> Exam Schema
                </h3>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {questions.map((q, i) => (
                  <button key={q.id} onClick={() => setSelectedIdx(i)} className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all border ${selectedIdx === i ? 'bg-white border-brand-blue shadow-sm ring-1 ring-brand-blue/10' : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-100'}`}>
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${q.type === 'objective' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                      {q.type === 'objective' ? <CheckCircle2 size={12} /> : <FileText size={12} />}
                    </div>
                    <span className="text-xs font-bold truncate">Q{i + 1}: {q.text || 'Untitled Question'}</span>
                  </button>
                ))}
              </div>

              <div className="p-4 bg-white border-t border-slate-100 grid grid-cols-2 gap-2">
                <button onClick={() => addQuestion('objective')} className="p-3 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2"><Plus size={14} /> Objective</button>
                <button onClick={() => addQuestion('theory')} className="p-3 border border-slate-200 text-slate-600 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-50"><Plus size={14} /> Theory</button>
              </div>
            </div>

            {/* RIGHT: Editor Canvas */}
            <div className="flex-1 overflow-y-auto bg-white p-10">
              {questions[selectedIdx] ? (
                <div className="max-w-2xl mx-auto space-y-10">
                  <div className="flex justify-between items-center">
                    <span className="px-4 py-1.5 bg-slate-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-500">{questions[selectedIdx].type} Question Configuration</span>
                    <button onClick={() => removeQuestion(questions[selectedIdx].id)} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                  </div>
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-slate-900">Question Prompt</label>
                    <textarea className="w-full p-6 bg-slate-50 border-none rounded-[24px] text-lg focus:ring-2 ring-brand-blue/10 outline-none placeholder:text-slate-300 min-h-[150px]" placeholder="Ask something profound..." value={questions[selectedIdx].text} onChange={(e) => { const updated = [...questions]; updated[selectedIdx].text = e.target.value; setQuestions(updated); }} />
                  </div>
                  {questions[selectedIdx].type === 'objective' ? (
                    <div className="space-y-4">
                      <label className="text-sm font-bold text-slate-900">Answer Options</label>
                      <div className="grid gap-3">
                        {questions[selectedIdx].options.map((opt, optIdx) => (
                          <div key={optIdx} className="flex gap-3 group">
                            <button onClick={() => { const updated = [...questions]; updated[selectedIdx].correct = optIdx; setQuestions(updated); }} className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all ${questions[selectedIdx].correct === optIdx ? 'bg-brand-blue border-brand-blue text-white shadow-lg' : 'border-slate-100 text-slate-300 hover:border-slate-200'}`}>{String.fromCharCode(65 + optIdx)}</button>
                            <input type="text" value={opt} className="flex-1 p-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 ring-brand-blue/10 outline-none" placeholder={`Option ${optIdx + 1}`} onChange={(e) => { const updated = [...questions]; updated[selectedIdx].options[optIdx] = e.target.value; setQuestions(updated); }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 border-2 border-dashed border-slate-100 rounded-[32px] bg-slate-50/30">
                      <div className="flex items-center gap-4 mb-4 text-slate-400">
                        <AlignLeft size={24} />
                        <p className="text-xs italic font-medium">Theory questions require manual grading by the board of directors.</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Grading Weight (Points)</label>
                        <input type="number" className="w-32 p-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-900" value={questions[selectedIdx].points || 0} onChange={(e) => { const updated = [...questions]; updated[selectedIdx].points = parseInt(e.target.value); setQuestions(updated); }} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-4">
                  <HelpCircle size={48} strokeWidth={1} />
                  <p className="font-medium">Select or create a question to begin building.</p>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingSubmissions.map(sub => (
              <div key={sub.id} className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xl font-bold text-slate-900">{sub.student}</h4>
                    <p className="text-xs text-brand-blue font-bold uppercase tracking-widest mt-1">{sub.course}</p>
                  </div>
                  <span className="px-3 py-1 bg-slate-50 text-slate-400 text-[10px] font-mono rounded-full">{sub.date}</span>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-3">Student's Response</p>
                  <p className="text-sm text-slate-700 leading-relaxed italic">"{sub.theoryAnswers[0].text}"</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-2">Award Theory Points (Max 30)</label>
                    <input type="number" value={gradingScore} onChange={(e) => setGradingScore(e.target.value)} className="w-full p-4 bg-slate-50 border-none rounded-xl text-sm" placeholder="e.g. 25" />
                  </div>
                  <button onClick={() => finalizeGrade(sub.id)} className="h-[52px] px-8 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest self-end hover:bg-brand-blue transition-all">Submit Grade</button>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Course Gap Modal */}
      <AnimatePresence>
        {isGapModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsGapModalOpen(false)} className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Unassigned Exams</h3>
              <div className="space-y-3">
                {coursesWithoutExams.map(c => (
                  <div key={c.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group hover:bg-brand-blue/5 transition-colors">
                    <div>
                      <p className="text-sm font-bold text-slate-900">{c.title}</p>
                      <p className="text-[10px] text-red-400 font-bold uppercase">No Assessment Linked</p>
                    </div>
                    <button onClick={() => { setIsGapModalOpen(false); setView('builder'); }} className="p-2 bg-white rounded-xl shadow-sm text-brand-blue opacity-0 group-hover:opacity-100 transition-all"><Plus size={18}/></button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminExamBuilder;