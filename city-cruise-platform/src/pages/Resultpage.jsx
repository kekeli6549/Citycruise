import React, { useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Award, ChevronRight, RefreshCcw, Home, Download, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useCourseStore } from '../context/courseStore';
import { useAuthStore } from '../context/authstore';
import CertificateGenerator, { downloadCertificate } from './CertificateGenerator';

const ResultsPage = () => {
  const { courseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const certificateRef = useRef();
  
  const { courses } = useCourseStore();
  const { user } = useAuthStore();
  
  // Destructure status from state to handle Theory exams
  const { score, passed, status, hasTheory } = location.state || { score: 0, passed: false, status: 'Graded', hasTheory: false };
  const course = courses.find(c => c.id === courseId);

  if (!course) return null;

  const isPending = status === 'Pending Review' || (hasTheory && status !== 'Graded');

  return (
    <div className="min-h-screen bg-white dark:bg-brand-dark flex flex-col items-center justify-center p-6">
      {/* Hidden Certificate Component for PDF Generation */}
      {passed && !isPending && (
        <CertificateGenerator 
          user={user} 
          course={course} 
          certificateRef={certificateRef} 
        />
      )}

      <div className="max-w-xl w-full text-center">
        <div className="mb-8 flex justify-center">
          {isPending ? (
            <div className="w-24 h-24 bg-amber-500 rounded-full flex items-center justify-center shadow-xl shadow-amber-500/20">
              <Clock className="text-white" size={48} />
            </div>
          ) : passed ? (
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500 blur-3xl opacity-20 animate-pulse" />
              <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center relative z-10 shadow-xl shadow-emerald-500/20">
                <CheckCircle2 className="text-white" size={48} />
              </div>
            </div>
          ) : (
            <div className="w-24 h-24 bg-rose-500 rounded-full flex items-center justify-center shadow-xl shadow-rose-500/20">
              <XCircle className="text-white" size={48} />
            </div>
          )}
        </div>

        <h1 className="text-4xl font-heading font-bold dark:text-white mb-2">
          {isPending ? 'Assessment Received' : passed ? 'Assessment Validated' : 'Review Required'}
        </h1>
        <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.3em] mb-12">
          {course.title} • Result ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
        </p>

        <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-3xl p-10 mb-8">
          <span className="text-slate-400 font-mono text-[10px] uppercase tracking-widest block mb-2">
            {isPending ? 'Current Objective Score' : 'Final Proficiency Score'}
          </span>
          <div className="text-6xl font-heading font-bold dark:text-white mb-4">
            {Math.round(score)}<span className="text-brand-blue text-2xl">%</span>
          </div>
          <div className={`inline-block px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
            isPending ? 'bg-amber-500/10 text-amber-500' : passed ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
          }`}>
            {isPending ? 'Awaiting Board Review' : passed ? 'Certified Professional' : 'Minimum 70% Required'}
          </div>
          
          {isPending && (
            <p className="text-[10px] text-slate-400 mt-6 font-medium italic leading-relaxed">
              Your theory responses have been sent to the board of directors. <br/> 
              You will be notified once grading is finalized.
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4">
          {isPending ? (
             <button 
                onClick={() => navigate('/dashboard')}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-slate-900/20"
              >
                Return to Dashboard
             </button>
          ) : passed ? (
            <button 
              onClick={() => downloadCertificate(certificateRef, course.title)}
              className="w-full bg-brand-blue text-white py-4 rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-lg shadow-brand-blue/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <Download size={16} /> Claim Professional Certificate
            </button>
          ) : (
            <button 
              onClick={() => navigate(`/exam/${courseId}`)}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <RefreshCcw size={16} /> Re-attempt Assessment
            </button>
          )}

          {!isPending && (
            <button 
                onClick={() => navigate('/dashboard')}
                className="w-full bg-transparent border border-slate-200 dark:border-slate-800 dark:text-white py-4 rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
                <Home size={16} /> Return to Hub
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;