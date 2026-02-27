import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Award, Home, X } from 'lucide-react';

const ExamPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('intro'); // intro, test, result
  const [score, setScore] = useState(0);

  const questions = [
    { q: "What is the primary driver of Diaspora-led investment?", options: ["Local Philanthropy", "Strategic Knowledge Transfer", "Tax Avoidance", "Legacy Projects"], correct: 1 },
    { q: "Which framework is used for high-trust Fintech scaling?", options: ["Agile", "STITCH-V", "Waterfall", "Nexus"], correct: 1 }
  ];

  // Exit button for Focus Mode
  const ExitButton = () => (
    <button 
      onClick={() => navigate('/exams')}
      className="fixed top-8 right-8 p-3 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-red-500 transition-colors z-50"
    >
      <X size={20} />
    </button>
  );

  if (step === 'intro') return (
    <div className="min-h-screen bg-slate-50 dark:bg-brand-dark flex items-center justify-center p-6 relative">
      <ExitButton />
      <div className="max-w-xl w-full bg-white dark:bg-slate-900 shadow-2xl rounded-[3rem] p-12 text-center">
        <Award className="text-brand-blue mx-auto mb-6" size={64} />
        <h1 className="text-3xl font-heading font-bold mb-4 dark:text-white">Final Assessment</h1>
        <p className="text-slate-500 mb-8 font-body">
          This exam consists of {questions.length} questions. <br />
          You need <span className="text-brand-blue font-bold">100%</span> to receive your certification.
        </p>
        <button 
          onClick={() => setStep('test')} 
          className="w-full bg-brand-blue text-white py-5 rounded-2xl font-bold uppercase text-[10px] tracking-widest shadow-xl shadow-brand-blue/30 active:scale-95 transition-transform"
        >
          Begin Exam
        </button>
      </div>
    </div>
  );

  if (step === 'result') return (
    <div className="min-h-screen bg-white dark:bg-brand-dark flex items-center justify-center p-6 text-center">
      <div className="max-w-md">
        <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/40">
          <CheckCircle2 className="text-white" size={48} />
        </div>
        <h1 className="text-4xl font-heading font-bold mb-4 dark:text-white">Certified.</h1>
        <p className="text-slate-500 mb-12 font-body">Congratulations. Your professional certification has been added to your profile.</p>
        <button 
          onClick={() => navigate('/dashboard')} 
          className="flex items-center gap-3 bg-slate-900 dark:bg-brand-blue text-white px-10 py-5 rounded-2xl mx-auto font-bold uppercase text-[10px] tracking-widest hover:shadow-xl transition-all active:scale-95"
        >
          <Home size={16} /> Return to Hub
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-brand-dark p-6 md:p-20 relative">
      <ExitButton />
      <div className="max-w-3xl mx-auto pt-12">
        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full mb-16 overflow-hidden">
          <div className="h-full bg-brand-blue w-1/2 transition-all duration-700" />
        </div>
        
        <p className="font-mono text-[10px] text-brand-blue uppercase tracking-[0.3em] mb-4">Question 01 of 02</p>
        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-12 dark:text-white leading-tight">
          {questions[0].q}
        </h2>

        <div className="grid gap-4">
          {questions[0].options.map((opt, i) => (
            <button 
              key={i} 
              onClick={() => setStep('result')} 
              className="group flex items-center text-left p-6 md:p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 hover:border-brand-blue hover:bg-brand-blue/5 transition-all active:scale-[0.98]"
            >
              <span className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center font-mono text-[10px] text-slate-400 mr-6 group-hover:bg-brand-blue group-hover:text-white transition-colors">
                0{i+1}
              </span>
              <span className="font-bold text-lg dark:text-white">{opt}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExamPage;