import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2, Award, Home, X, AlertCircle, RotateCcw } from 'lucide-react';
import { coursesData } from '../data/coursesData'; 
import { useAuthStore } from '../context/authStore';

const ExamPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const recordExamResult = useAuthStore(state => state.recordExamResult);
  
  const [step, setStep] = useState('intro'); 
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const course = coursesData.find(c => c.id === courseId);
  const exam = course?.exam;
  const questions = exam?.questions || [];

  useEffect(() => {
    if (!exam) { console.error("No exam found"); }
  }, [exam]);

  const handleAnswer = (selectedIndex) => {
    const isCorrect = selectedIndex === questions[currentQuestionIndex].correct;
    const newScore = isCorrect ? score + 1 : score;
    
    if (isCorrect) setScore(newScore);

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      const finalScorePercent = ((newScore) / questions.length) * 100;
      const passed = finalScorePercent === 100;
      
      setIsFinished(passed);
      setStep('result');

      // REPORT TO ECOSYSTEM
      recordExamResult(courseId, course?.title, passed, finalScorePercent);
    }
  };

  const ExitButton = () => (
    <button 
      onClick={() => navigate('/dashboard')}
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
        <p className="text-slate-500 mb-2 font-body text-lg font-bold">{course?.title}</p>
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
        {isFinished ? (
          <>
            <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/40">
              <CheckCircle2 className="text-white" size={48} />
            </div>
            <h1 className="text-4xl font-heading font-bold mb-4 dark:text-white">Certified.</h1>
            <p className="text-slate-500 mb-12 font-body">Congratulations. Your professional certification for "{course?.title}" has been added to your profile.</p>
          </>
        ) : (
          <>
            <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-red-500/40">
              <AlertCircle className="text-white" size={48} />
            </div>
            <h1 className="text-4xl font-heading font-bold mb-4 dark:text-white">Not Quite.</h1>
            <p className="text-slate-500 mb-12 font-body">You scored {Math.round((score/questions.length)*100)}%. A perfect score is required for certification. Review the material and try again.</p>
          </>
        )}
        
        <div className="flex flex-col gap-4">
          {!isFinished && (
             <button 
                onClick={() => {
                    setStep('intro');
                    setCurrentQuestionIndex(0);
                    setScore(0);
                }} 
                className="flex items-center justify-center gap-3 bg-brand-blue text-white px-10 py-5 rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:shadow-xl transition-all active:scale-95"
                >
                <RotateCcw size={16} /> Retake Exam
             </button>
          )}
          <button 
            onClick={() => navigate('/dashboard')} 
            className="flex items-center justify-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:shadow-xl transition-all active:scale-95"
          >
            <Home size={16} /> Return to Hub
          </button>
        </div>
      </div>
    </div>
  );

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercent = ((currentQuestionIndex) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-white dark:bg-brand-dark p-6 md:p-20 relative">
      <ExitButton />
      <div className="max-w-3xl mx-auto pt-12">
        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full mb-16 overflow-hidden">
          <div 
            className="h-full bg-brand-blue transition-all duration-700" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        
        <p className="font-mono text-[10px] text-brand-blue uppercase tracking-[0.3em] mb-4">
            Question {String(currentQuestionIndex + 1).padStart(2, '0')} of {String(questions.length).padStart(2, '0')}
        </p>
        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-12 dark:text-white leading-tight">
          {currentQuestion?.q}
        </h2>

        <div className="grid gap-4">
          {currentQuestion?.options.map((opt, i) => (
            <button 
              key={i} 
              onClick={() => handleAnswer(i)} 
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