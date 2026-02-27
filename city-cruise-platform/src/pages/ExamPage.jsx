import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Award, ArrowRight, Home } from 'lucide-react';

const ExamPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('intro'); // intro, test, result
  const [score, setScore] = useState(0);

  const questions = [
    { q: "What is the primary driver of Diaspora-led investment?", options: ["Local Philanthropy", "Strategic Knowledge Transfer", "Tax Avoidance", "Legacy Projects"], correct: 1 },
    { q: "Which framework is used for high-trust Fintech scaling?", options: ["Agile", "STITCH-V", "Waterfall", "Nexus"], correct: 1 }
  ];

  if (step === 'intro') return (
    <div className="min-h-screen bg-slate-50 dark:bg-brand-dark flex items-center justify-center p-6">
      <div className="max-w-xl w-full ui-card rounded-[3rem] p-12 text-center">
        <Award className="text-brand-blue mx-auto mb-6" size={64} />
        <h1 className="text-3xl font-heading font-bold mb-4 dark:text-white">Final Assessment</h1>
        <p className="text-slate-500 mb-8">This exam consists of {questions.length} questions. You need 100% to receive your certification.</p>
        <button onClick={() => setStep('test')} className="w-full bg-brand-blue text-white py-5 rounded-2xl font-bold uppercase text-[10px] tracking-widest shadow-xl shadow-brand-blue/30">Begin Exam</button>
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
        <p className="text-slate-500 mb-12">Congratulations. Your professional certification has been added to your profile.</p>
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-2xl mx-auto font-bold uppercase text-[10px] tracking-widest hover:bg-brand-blue transition-colors">
          <Home size={16} /> Return to Hub
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-brand-dark p-12">
      <div className="max-w-3xl mx-auto">
        <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full mb-12 overflow-hidden">
          <div className="h-full bg-brand-blue w-1/2 transition-all" />
        </div>
        <h2 className="text-3xl font-heading font-bold mb-12 dark:text-white">{questions[0].q}</h2>
        <div className="grid gap-4">
          {questions[0].options.map((opt, i) => (
            <button key={i} onClick={() => setStep('result')} className="text-left p-6 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-brand-blue hover:bg-brand-blue/5 transition-all group">
              <span className="font-mono text-[10px] text-slate-400 mr-4">0{i+1}</span>
              <span className="font-bold dark:text-white">{opt}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExamPage;