import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Send, Timer, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useCourseStore } from '../context/courseStore';
import { useAuthStore } from '../context/authStore';

const ExamPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { courses, submitExamToAdmin } = useCourseStore();
  const { user, recordExamResult } = useAuthStore();
  
  const course = courses.find(c => c.id === courseId);
  const exam = course?.exam;
  
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes default

  useEffect(() => {
    if (timeLeft <= 0) handleSubmit();
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOptionChange = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // 1. Calculate Objective Score
    let objectiveScore = 0;
    const objectiveQuestions = exam.questions.filter(q => q.type === 'objective');
    
    objectiveQuestions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) objectiveScore++;
    });

    const finalScore = (objectiveScore / objectiveQuestions.length) * 100;
    const passed = finalScore >= 70;

    const submissionPayload = {
      studentId: user?.id,
      studentName: `${user?.firstName} ${user?.lastName}`,
      answers: answers,
      score: finalScore,
      submittedAt: new Date().toISOString(),
      status: exam.questions.some(q => q.type === 'theory') ? 'Pending Review' : 'Graded'
    };

    // 2. Push to Admin & Update Student Record
    submitExamToAdmin(courseId, submissionPayload);
    recordExamResult(courseId, course.title, passed, finalScore);

    setTimeout(() => {
      setIsSubmitting(false);
      navigate(`/dashboard/results/${courseId}`, { state: { score: finalScore, passed } });
    }, 2000);
  };

  if (!exam) return <div className="p-20 text-center font-mono">Exam Loading or Not Found...</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-brand-dark pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-brand-dark/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 p-6 flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-brand-blue transition-colors font-bold text-[10px] uppercase tracking-widest">
          <ChevronLeft size={16}/> Abandon Session
        </button>
        
        <div className="flex items-center gap-4 bg-slate-900 text-white px-6 py-2 rounded-full font-mono text-sm">
          <Timer size={16} className="text-brand-blue" />
          {formatTime(timeLeft)}
        </div>

        <button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-brand-blue text-white px-8 py-2.5 rounded-full font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-brand-blue/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
        >
          {isSubmitting ? 'Processing...' : 'Submit Assessment'}
        </button>
      </div>

      <div className="max-w-3xl mx-auto mt-12 px-6">
        <div className="mb-12">
          <h1 className="text-3xl font-heading font-bold dark:text-white mb-2">{course.title}</h1>
          <p className="text-slate-500 text-sm">Final Professional Competency Assessment</p>
        </div>

        <div className="space-y-8">
          {exam.questions.map((q, idx) => (
            <div key={q.id} className="bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl">
              <div className="flex gap-4 mb-6">
                <span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">
                  {idx + 1}
                </span>
                <h3 className="text-lg font-bold dark:text-white leading-relaxed">{q.questionText}</h3>
              </div>

              {q.type === 'objective' ? (
                <div className="grid grid-cols-1 gap-3 ml-12">
                  {q.options.map((opt, i) => (
                    <label key={i} className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${answers[q.id] === opt ? 'border-brand-blue bg-brand-blue/5' : 'border-slate-50 dark:border-slate-800 hover:border-slate-200'}`}>
                      <input 
                        type="radio" 
                        name={q.id} 
                        className="hidden" 
                        onChange={() => handleOptionChange(q.id, opt)}
                      />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${answers[q.id] === opt ? 'border-brand-blue' : 'border-slate-300'}`}>
                        {answers[q.id] === opt && <div className="w-2.5 h-2.5 bg-brand-blue rounded-full" />}
                      </div>
                      <span className={`text-sm ${answers[q.id] === opt ? 'text-brand-blue font-bold' : 'text-slate-600 dark:text-slate-400'}`}>{opt}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="ml-12">
                  <textarea 
                    placeholder="Provide your professional detailed response..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-6 text-sm dark:text-white focus:ring-2 focus:ring-brand-blue transition-all min-h-[150px]"
                    onChange={(e) => handleOptionChange(q.id, e.target.value)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExamPage;