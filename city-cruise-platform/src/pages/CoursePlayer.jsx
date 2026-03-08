import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Play, CheckCircle, Award, FileText, Info, Download, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../context/authStore';
import { markLessonComplete, getLessonDetails } from '../api/courseService';

const CoursePlayer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { courses, fetchCourseDetails, isLoading: storeLoading } = useCourseStore();
  const { completeCourse, completedCourses, completedLessons: globalCompletedLessons, addCompletedLesson } = useAuthStore();
  
  const [isLoading, setIsLoading] = useState(!courses.find(c => c.id === courseId));
  const course = courses.find(c => c.id === courseId);
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [lessonData, setLessonData] = useState(null);

  useEffect(() => {
    if (!course) {
      fetchCourseDetails(courseId).finally(() => setIsLoading(false));
    }
  }, [courseId, course, fetchCourseDetails]);

  useEffect(() => {
    if (course && !activeLessonId) {
      setActiveLessonId(course.lessons[0]?.id);
    }
  }, [course, activeLessonId]);

  useEffect(() => {
    if (activeLessonId) {
      getLessonDetails(activeLessonId).then(data => setLessonData(data.data || data));
    }
  }, [activeLessonId]);
  
  // Track completed lessons for this specific course
  const courseLessons = course?.lessons || [];
  const completedInThisCourse = courseLessons.filter(lesson => globalCompletedLessons.includes(lesson.id));
  const allLessonsDone = courseLessons.length > 0 && completedInThisCourse.length === courseLessons.length;

  // Fix: Calculate progressPercentage
  const progressPercentage = courseLessons.length > 0 
    ? Math.round((completedInThisCourse.length / courseLessons.length) * 100) 
    : 0;

  const activeLesson = lessonData || course?.lessons.find(l => l.id === activeLessonId) || course?.lessons[0];
  const activeIndex = course?.lessons.findIndex(l => l.id === activeLessonId);
  const isCompleted = completedCourses.includes(courseId);

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    let videoId = '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      videoId = match[2];
    } else {
      return null;
    }
    return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`;
  };

  const handleLessonComplete = async () => {
    try {
      await markLessonComplete(activeLessonId);
      
      // Save to global auth store
      if (!globalCompletedLessons.includes(activeLessonId)) {
        addCompletedLesson(activeLessonId);
      }

      // Auto-advance logic
      if (activeIndex < course.lessons.length - 1) {
        const nextLessonId = course.lessons[activeIndex + 1].id;
        setTimeout(() => {
          setActiveLessonId(nextLessonId);
        }, 600);
      }
    } catch (err) {
      console.error("Failed to mark lesson as complete:", err);
    }
  };

  if (isLoading || storeLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-brand-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

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

  const embedUrl = getYouTubeEmbedUrl(activeLesson?.videoUrl);

  return (
    <div className="min-h-screen bg-white dark:bg-brand-dark flex flex-col">
      {/* Enhanced Header UI */}
      <div className="border-b border-slate-100 dark:border-slate-800/50 p-6 flex justify-between items-center bg-white/40 dark:bg-brand-dark/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="group flex items-center gap-2 text-slate-400 hover:text-brand-blue transition-all font-bold text-[10px] uppercase tracking-widest"
          >
            <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center group-hover:border-brand-blue transition-colors">
              <ChevronLeft size={16}/>
            </div>
            Back to Hub
          </button>
          
          <div className="hidden md:block h-8 w-[1px] bg-slate-200 dark:bg-slate-800" />
          
          <div className="hidden md:block">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-brand-blue" />
              <h1 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white line-clamp-1">{course?.title}</h1>
            </div>
            <p className="text-[9px] text-slate-400 mt-0.5 font-mono uppercase tracking-tighter">Module: {activeIndex + 1} of {course?.lessons.length}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <AnimatePresence mode="wait">
            {isCompleted ? (
              <motion.button 
                key="exam-btn"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={startExam} 
                className="flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
              >
                <Award size={14} /> {course?.exam ? 'Initiate Assessment' : 'Exam Pending'}
              </motion.button>
            ) : allLessonsDone ? (
              <motion.button 
                key="complete-btn"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleFinishCourse} 
                className="bg-brand-blue text-white px-6 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-xl shadow-brand-blue/30 active:scale-95 transition-all flex items-center gap-2"
              >
                Complete Curriculum <ArrowRight size={14} />
              </motion.button>
            ) : (
              <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-slate-100 dark:bg-slate-800/50 rounded-xl">
                <div className="flex -space-x-1">
                  {courseLessons.map((l, i) => (
                    <div 
                      key={i} 
                      className={`w-1.5 h-1.5 rounded-full ${globalCompletedLessons.includes(l.id) ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`} 
                    />
                  ))}
                </div>
                <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">
                  {completedInThisCourse.length}/{courseLessons.length} Verified
                </span>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {/* Video Player */}
          <div className="bg-black aspect-video flex items-center justify-center relative group overflow-hidden">
            {embedUrl ? (
              <iframe
                className="w-full h-full z-10"
                src={embedUrl}
                title={activeLesson?.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <p className="text-white/20 font-mono text-[10px] uppercase tracking-[0.5em] animate-pulse">Encryption: AES-256 Active</p>
                <div className="absolute bottom-10 left-10 text-white">
                  <span className="text-brand-blue font-black text-[10px] uppercase tracking-widest mb-2 block">Link Missing</span>
                  <h2 className="text-3xl font-bold tracking-tight">No Video Content Link Found</h2>
                </div>
              </>
            )}
          </div>

          {/* Lesson Details */}
          <div className="p-6 md:p-12 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-brand-blue/10 text-brand-blue rounded-2xl">
                        <Info size={24}/>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Lesson Intelligence</h3>
                      <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{activeLesson?.title}</p>
                    </div>
                </div>

                <button 
                    onClick={handleLessonComplete}
                    disabled={globalCompletedLessons.includes(activeLessonId)}
                    className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all ${
                        globalCompletedLessons.includes(activeLessonId) 
                        ? 'bg-emerald-50 text-emerald-500 border border-emerald-100 cursor-default' 
                        : 'bg-slate-900 text-white hover:bg-brand-blue shadow-2xl shadow-slate-900/20 active:scale-95'
                    }`}
                >
                    {globalCompletedLessons.includes(activeLessonId) ? (
                        <><CheckCircle size={14} /> Content Secured</>
                    ) : (
                        <><Play size={14} /> Mark as Complete & Next</>
                    )}
                </button>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-900/40 rounded-[32px] p-8 md:p-10 mb-12 border border-slate-100 dark:border-slate-800/50">
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-lg">
                    {activeLesson?.summary || "No summary intelligence available for this module."}
                </p>
            </div>

            {/* Resources Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 whitespace-nowrap">Tactical Resources</h4>
                  <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeLesson?.resources?.map((res, i) => (
                        <div key={i} className="flex items-center justify-between p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl group hover:border-brand-blue/50 transition-all cursor-pointer shadow-sm hover:shadow-xl hover:shadow-brand-blue/5">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 group-hover:text-brand-blue transition-colors">
                                    <FileText size={20}/>
                                </div>
                                <div>
                                    <p className="text-sm font-bold dark:text-white group-hover:text-brand-blue transition-colors">{res.name}</p>
                                    <p className="text-[10px] text-slate-400 font-mono">{res.size}</p>
                                </div>
                            </div>
                            <Download size={18} className="text-slate-300 group-hover:text-brand-blue" />
                        </div>
                    ))}
                    {(!activeLesson?.resources || activeLesson.resources.length === 0) && (
                        <div className="col-span-2 py-8 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[32px]">
                          <p className="text-xs text-slate-400 italic">No additional digital assets for this intelligence module.</p>
                        </div>
                    )}
                </div>
            </div>
          </div>
        </div>

        {/* Sidebar Curriculum */}
        <div className="w-full lg:w-[400px] border-l border-slate-100 dark:border-slate-800/50 p-8 bg-slate-50/20 dark:bg-brand-dark/20 overflow-y-auto no-scrollbar h-auto lg:h-full">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-xs uppercase tracking-[0.2em] dark:text-white">Curriculum Map</h3>
            <span className="text-[10px] font-mono text-brand-blue font-bold">{progressPercentage}%</span>
          </div>
          
          <div className="space-y-3">
            {course?.lessons.map((lesson, idx) => {
              const isActive = activeLessonId === lesson.id;
              const isDone = globalCompletedLessons.includes(lesson.id);
              
              return (
                <div 
                  key={lesson.id} 
                  onClick={() => setActiveLessonId(lesson.id)}
                  className={`p-5 rounded-[24px] border cursor-pointer transition-all duration-300 group ${
                    isActive 
                    ? 'border-brand-blue bg-white dark:bg-slate-900 shadow-2xl shadow-brand-blue/10 scale-[1.02]' 
                    : 'border-transparent hover:bg-slate-100/50 dark:hover:bg-slate-800/30'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs transition-all ${
                      isActive ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/30' : 
                      isDone ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}>
                      {isDone ? <CheckCircle size={14} /> : idx + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className={`text-sm font-bold leading-tight transition-colors ${isActive ? 'text-brand-blue' : 'text-slate-700 dark:text-slate-300'}`}>{lesson.title}</h4>
                      <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] font-mono text-slate-400">{lesson.duration || 'Video'}</span>
                          {isDone && (
                              <span className="text-[9px] font-black uppercase text-emerald-500 tracking-tighter">Verified</span>
                          )}
                      </div>
                    </div>
                    {isActive && (
                      <motion.div layoutId="active-indicator" className="w-1.5 h-1.5 bg-brand-blue rounded-full shadow-[0_0_10px_#0066FF]" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          <AnimatePresence>
            {isCompleted && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 p-8 bg-emerald-500 rounded-[32px] text-white shadow-2xl shadow-emerald-500/20 border border-white/10"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                    <CheckCircle size={18} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest">Enrollment Verified</p>
                </div>
                <p className="text-emerald-50 text-[11px] leading-relaxed font-medium">
                  {course?.exam ? "Intelligence gathered. The Board is ready for your assessment." : "Curriculum exhausted. Final certification status pending Board publication."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  ); 
};

export default CoursePlayer;