import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Send, Timer, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useCourseStore } from '../context/courseStore';
import { useAuthStore } from '../context/authStore';

import { getCourseExam, submitExam } from '../api/examService';

const ExamPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { courses, submitExamToAdmin, fetchCourseDetails } = useCourseStore();
  const { user, recordExamResult } = useAuthStore();
  
  const [course, setCourse] = useState(courses.find(c => c.id === courseId));
  const [examData, setExamData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadExam = async () => {
      try {
        setIsLoading(true);
        if (!course) {
          const fetchedCourse = await fetchCourseDetails(courseId);
          setCourse(fetchedCourse);
        }
        const data = await getCourseExam(courseId);
        setExamData(data.data || data);
      } catch (err) {
        setError(err.response?.data?.message || "Assessment payload not found.");
      } finally {
        setIsLoading(false);
      }
    };
    loadExam();
  }, [courseId, course, fetchCourseDetails]);

  const exam = examData?.exam || examData;
  const questions = examData?.questions || [];
  
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
    if (!exam || isSubmitting) return;
    setIsSubmitting(true);
    
    // 1. Prepare answers for API
    const formattedAnswers = questions.map(q => {
      const answer = answers[q.id];
      if (q.type === 'objective') {
        return { questionId: q.id, selectedOption: q.options.indexOf(answer) };
      }
      return { questionId: q.id, theoryAnswer: answer };
    });

    try {
      const response = await submitExam(courseId, { answers: formattedAnswers });
      const data = response.data || response;
      
      // Navigate back to a summary or the dashboard
      navigate(`/dashboard`, { 
        state: { 
          examSubmitted: true,
          courseTitle: course.title,
          status: data.status,
          score: data.objectiveScore
        } 
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit assessment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-brand-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  if (error && !exam) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold dark:text-white mb-2">Access Denied</h2>
        <p className="text-slate-400 mb-6">{error}</p>
        <button onClick={() => navigate(-1)} className="text-brand-blue font-bold uppercase text-[10px] tracking-widest">Return to Dashboard</button>
      </div>
    );
  }

  if (!exam) return <div className="p-20 text-center font-mono text-slate-400 uppercase tracking-widest">Awaiting Board Assessment...</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-brand-dark pb-20">
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-brand-dark/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 p-6 flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-brand-blue transition-colors font-bold text-[10px] uppercase tracking-widest">
          <ChevronLeft size={16}/> Abandon Session
        </button>
        
        <div className="flex items-center gap-4 bg-slate-900 text-white px-6 py-2 rounded-full font-mono text-sm shadow-xl shadow-slate-900/20">
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
          <span className="text-brand-blue font-black text-[10px] uppercase tracking-[0.3em] mb-2 block">Official Board Examination</span>
          <h1 className="text-3xl font-bold dark:text-white mb-2 tracking-tight">{course.title}</h1>
          <p className="text-slate-500 text-sm font-medium italic font-body">Standardized Professional Competency Assessment</p>
        </div>

        <div className="space-y-8">
          {exam.questions.map((q, idx) => (
            <div key={q.id} className="bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 p-10 rounded-[40px] shadow-sm">
              <div className="flex gap-6 mb-8">
                <span className="w-10 h-10 shrink-0 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-xs font-black text-brand-blue">
                  {idx + 1}
                </span>
                <h3 className="text-lg font-bold dark:text-white leading-relaxed pt-1 font-heading">{q.text}</h3>
              </div>

              {q.type === 'objective' ? (
                <div className="grid grid-cols-1 gap-3 ml-16">
                  {q.options.map((opt, i) => (
                    <label key={i} className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${answers[q.id] === opt ? 'border-brand-blue bg-brand-blue/5' : 'border-slate-50 dark:border-slate-800 hover:border-slate-100'}`}>
                      <input 
                        type="radio" 
                        name={q.id} 
                        className="hidden" 
                        onChange={() => handleOptionChange(q.id, opt)}
                      />
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${answers[q.id] === opt ? 'border-brand-blue bg-brand-blue' : 'border-slate-200'}`}>
                        {answers[q.id] === opt && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <span className={`text-sm font-bold ${answers[q.id] === opt ? 'text-brand-blue' : 'text-slate-600 dark:text-slate-400'}`}>{opt}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="ml-16">
                  <textarea 
                    placeholder="Structure your professional response here..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-[24px] p-8 text-sm dark:text-white focus:ring-2 focus:ring-brand-blue transition-all min-h-[200px] outline-none font-medium font-body"
                    onChange={(e) => handleOptionChange(q.id, e.target.value)}
                  />
                  <p className="mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                    <AlertCircle size={12}/> Requires Board Review
                  </p>
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