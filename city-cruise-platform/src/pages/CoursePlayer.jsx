import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Play, CheckCircle, Award, FileText, Info, Download } from 'lucide-react';
import { useAuthStore } from '../context/authStore';
import { useCourseStore } from '../context/courseStore';

const CoursePlayer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { courses } = useCourseStore();
  const { completeCourse, completedCourses } = useAuthStore();
  
  const course = courses.find(c => c.id === courseId);
  const [activeLessonId, setActiveLessonId] = useState(course?.lessons[0]?.id || null);

  const activeLesson = course?.lessons.find(l => l.id === activeLessonId) || course?.lessons[0];
  const isCompleted = completedCourses.includes(courseId);

  const handleFinishCourse = () => {
    completeCourse(courseId);
  };

  const startExam = () => {
    if (course?.exam) {
      navigate(`/exam/${courseId}`);
    } else {
      alert("The Board of Directors has not yet published the final assessment for this course.");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-brand-dark flex flex-col">
      {/* Header */}
      <div className="border-b border-slate-100 dark:border-slate-800 p-6 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-400 hover:text-brand-blue transition-colors font-bold text-sm">
          <ChevronLeft size={18}/> Hub
        </button>
        <div className="text-center">
            <h1 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white">{course?.title}</h1>
            <p className="text-[10px] text-slate-400 mt-1 font-mono uppercase">Secure Enrollment Active</p>
        </div>
        
        {isCompleted ? (
          <button 
            onClick={startExam} 
            className="flex items-center gap-2 bg-emerald-500 text-white px-6 py-2.5 rounded-full font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
          >
            <Award size={14} /> {course?.exam ? 'Take Exam' : 'Exam Pending'}
          </button>
        ) : (
          <button 
            onClick={handleFinishCourse} 
            className="bg-brand-blue text-white px-6 py-2.5 rounded-full font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-brand-blue/20 active:scale-95 transition-all"
          >
            Complete Curriculum
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          {/* Video Player Placeholder */}
          <div className="bg-black aspect-video flex items-center justify-center relative group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <p className="text-white/20 font-mono text-[10px] uppercase tracking-[0.5em] animate-pulse">Encryption: AES-256 Active</p>
            <div className="absolute bottom-10 left-10 text-white">
              <span className="text-brand-blue font-black text-[10px] uppercase tracking-widest mb-2 block">Now Streaming</span>
              <h2 className="text-3xl font-bold tracking-tight">{activeLesson?.title}</h2>
            </div>
          </div>

          {/* Lesson Details & Summaries */}
          <div className="p-10 max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-brand-blue/10 text-brand-blue rounded-lg">
                    <Info size={20}/>
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Lesson Intelligence</h3>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-[32px] p-8 mb-10 border border-slate-100 dark:border-slate-800">
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    {activeLesson?.summary || "No summary intelligence available for this module."}
                </p>
            </div>

            {/* Resources Section */}
            <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Tactical Resources</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeLesson?.resources?.map((res, i) => (
                        <div key={i} className="flex items-center justify-between p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl group hover:border-brand-blue transition-all cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 group-hover:text-brand-blue transition-colors">
                                    <FileText size={20}/>
                                </div>
                                <div>
                                    <p className="text-sm font-bold dark:text-white">{res.name}</p>
                                    <p className="text-[10px] text-slate-400 font-mono">{res.size}</p>
                                </div>
                            </div>
                            <Download size={18} className="text-slate-300 group-hover:text-brand-blue" />
                        </div>
                    ))}
                    {(!activeLesson?.resources || activeLesson.resources.length === 0) && (
                        <p className="text-xs text-slate-400 italic">No additional resources linked to this lesson.</p>
                    )}
                </div>
            </div>
          </div>
        </div>

        {/* Sidebar Curriculum */}
        <div className="w-full lg:w-[400px] border-l border-slate-100 dark:border-slate-800 p-8 bg-slate-50/30 dark:bg-brand-dark overflow-y-auto h-[calc(100vh-88px)]">
          <h3 className="font-bold text-lg mb-8 dark:text-white tracking-tight">Curriculum Structure</h3>
          <div className="space-y-4">
            {course?.lessons.map((lesson, idx) => (
              <div 
                key={lesson.id} 
                onClick={() => setActiveLessonId(lesson.id)}
                className={`p-5 rounded-[24px] border cursor-pointer transition-all duration-300 ${activeLessonId === lesson.id ? 'border-brand-blue bg-white dark:bg-slate-900 shadow-xl shadow-brand-blue/5' : 'border-slate-100 dark:border-slate-800 hover:border-brand-blue/30'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs transition-colors ${activeLessonId === lesson.id ? 'bg-brand-blue text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className={`text-sm font-bold leading-tight ${activeLessonId === lesson.id ? 'text-brand-blue' : 'text-slate-700 dark:text-slate-300'}`}>{lesson.title}</h4>
                    <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] font-mono text-slate-400">{lesson.duration || 'Video'}</span>
                        {lesson.resources?.length > 0 && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-brand-blue/60 uppercase tracking-tighter">
                                <FileText size={10}/> {lesson.resources.length} Files
                            </span>
                        )}
                    </div>
                  </div>
                  {activeLessonId === lesson.id && (
                    <motion.div layoutId="active-indicator" className="w-1.5 h-1.5 bg-brand-blue rounded-full shadow-[0_0_10px_#0066FF]" />
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {isCompleted && (
            <div className="mt-8 p-8 bg-emerald-500 rounded-[32px] text-white shadow-xl shadow-emerald-500/20">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle size={24} />
                <p className="text-sm font-black uppercase tracking-widest">Verification Complete</p>
              </div>
              <p className="text-emerald-50 text-xs leading-relaxed font-medium">
                {course?.exam ? "Intelligence gathered. The Board is ready for your assessment." : "Curriculum exhausted. Final certification status pending Board publication."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  ); 
};

export default CoursePlayer;