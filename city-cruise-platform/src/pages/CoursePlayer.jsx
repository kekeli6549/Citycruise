import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Play, CheckCircle, Award, FileText, Info, Download, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../context/authStore';
import { useCourseStore } from '../context/courseStore';
import { getLessonDetails } from '../api/courseService';

const CoursePlayer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  // 1. Normalize ID to Number immediately to prevent "=== mismatch"
  const numericCourseId = Number(courseId);

  // 2. Extract state from stores
  // Added userCourseLessons here as per your store update
  const { courses, enrolledCourses, fetchCourseLessons, userCourseLessons, isLoading: storeLoading, completeLesson } = useCourseStore();
  const { completeCourse, completedCourses, completedLessons: globalCompletedLessons, addCompletedLesson } = useAuthStore();

  // 3. Find the course - checks both arrays just in case
  const course = useMemo(() => {
    const list = enrolledCourses?.length > 0 ? enrolledCourses : courses;
    return list.find(c => Number(c.id) === numericCourseId);
  }, [courses, enrolledCourses, numericCourseId]);

  // 4. Lessons Logic: Priority to userCourseLessons, then course.lessons
  const courseLessons = useMemo(() => {
    return (userCourseLessons && userCourseLessons.length > 0) ? userCourseLessons : (course?.lessons || []);
  }, [userCourseLessons, course]);

  const [isLoading, setIsLoading] = useState(!course || courseLessons.length === 0);
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [lessonData, setLessonData] = useState(null);

  // Effect: Fetch lessons if missing
  useEffect(() => {
    if (numericCourseId) {
      fetchCourseLessons(numericCourseId).finally(() => setIsLoading(false));
    }
  }, [numericCourseId, fetchCourseLessons]);

  // Effect: Set initial active lesson once lessons load
  useEffect(() => {
    if (courseLessons.length > 0 && !activeLessonId) {
      setActiveLessonId(courseLessons[0]?.id);
    }
  }, [courseLessons, activeLessonId]);

  // Effect: Fetch specific lesson details (video links, etc)
  useEffect(() => {
    if (activeLessonId) {
      getLessonDetails(activeLessonId).then(data => setLessonData(data.data || data));
    }
  }, [activeLessonId]);

  // Progress Calculations
  const completedInThisCourse = courseLessons.filter(lesson =>
    globalCompletedLessons.includes(Number(lesson.id)) || globalCompletedLessons.includes(String(lesson.id))
  );

  const progressPercentage = courseLessons.length > 0
    ? Math.round((completedInThisCourse.length / courseLessons.length) * 100)
    : 0;

  const allLessonsDone = courseLessons.length > 0 && completedInThisCourse.length === courseLessons.length;

  // Active Lesson Mapping
  const activeLesson = lessonData || courseLessons.find(l => Number(l.id) === Number(activeLessonId)) || courseLessons[0];
  const activeIndex = courseLessons.findIndex(l => Number(l.id) === Number(activeLessonId));
  const isCompleted = completedCourses.includes(numericCourseId) || completedCourses.includes(courseId);

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11)
      ? `https://www.youtube-nocookie.com/embed/${match[2]}?rel=0&modestbranding=1`
      : null;
  };

  const handleLessonComplete = async () => {
    try {
      const success = await completeLesson(activeLessonId, addCompletedLesson);
      if (success && activeIndex < courseLessons.length - 1) {
        const nextLessonId = courseLessons[activeIndex + 1].id;
        setTimeout(() => setActiveLessonId(nextLessonId), 600);
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

  const embedUrl = getYouTubeEmbedUrl(activeLesson?.video_link);

  return (
    <div className="min-h-screen bg-white dark:bg-brand-dark flex flex-col">
      {/* Header */}
      <div className="border-b border-slate-100 dark:border-slate-800/50 p-6 flex justify-between items-center bg-white/40 dark:bg-brand-dark/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/dashboard')} className="group flex items-center gap-2 text-slate-400 hover:text-brand-blue transition-all font-bold text-[10px] uppercase tracking-widest">
            <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center group-hover:border-brand-blue transition-colors">
              <ChevronLeft size={16} />
            </div>
            Back to Hub
          </button>
          <div className="hidden md:block h-8 w-[1px] bg-slate-200 dark:bg-slate-800" />
          <div className="hidden md:block">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-brand-blue" />
              <h1 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white line-clamp-1">{course?.title}</h1>
            </div>
            <p className="text-[9px] text-slate-400 mt-0.5 font-mono uppercase tracking-tighter">Module: {activeIndex + 1} of {courseLessons.length}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <AnimatePresence mode="wait">
            {isCompleted ? (
              <motion.button key="exam-btn" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} onClick={() => navigate(`/exam/${courseId}`)} className="flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95 transition-all">
                <Award size={14} /> {course?.exam ? 'Initiate Assessment' : 'Exam Pending'}
              </motion.button>
            ) : allLessonsDone ? (
              <motion.button key="complete-btn" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onClick={() => completeCourse(courseId)} className="bg-brand-blue text-white px-6 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-xl shadow-brand-blue/30 active:scale-95 transition-all flex items-center gap-2">
                Complete Curriculum <ArrowRight size={14} />
              </motion.button>
            ) : (
              <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-slate-100 dark:bg-slate-800/50 rounded-xl">
                <div className="flex -space-x-1">
                  {courseLessons.map((l, i) => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full ${globalCompletedLessons.includes(l.id) ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`} />
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
        {/* Player Section */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <div className="bg-black aspect-video flex items-center justify-center relative group overflow-hidden">
            {embedUrl ? (
              <iframe className="w-full h-full z-10" src={embedUrl} title={activeLesson?.title} frameBorder="0" allowFullScreen></iframe>
            ) : (
              <div className="text-center">
                <p className="text-white/20 font-mono text-[10px] uppercase tracking-[0.5em] animate-pulse mb-4">Encryption: AES-256 Active</p>
                <h2 className="text-xl font-bold text-white">No Video Link Found for this Lesson</h2>
              </div>
            )}
          </div>

          <div className="p-6 md:p-12 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-brand-blue/10 text-brand-blue rounded-2xl">
                  <Info size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Lesson Intelligence</h3>
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{activeLesson?.title}</p>
                </div>
              </div>

              <button
                onClick={handleLessonComplete}
                disabled={globalCompletedLessons.includes(activeLessonId)}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all ${globalCompletedLessons.includes(activeLessonId)
                    ? 'bg-emerald-50 text-emerald-500 border border-emerald-100'
                    : 'bg-slate-900 text-white hover:bg-brand-blue'
                  }`}
              >
                {globalCompletedLessons.includes(activeLessonId) ? <><CheckCircle size={14} /> Content Secured</> : <><Play size={14} /> Mark as Complete & Next</>}
              </button>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/40 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800/50">
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-lg">
                {activeLesson?.content || "No content available for this lesson."}
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-[400px] border-l border-slate-100 dark:border-slate-800/50 p-8 bg-slate-50/20 dark:bg-brand-dark/20 overflow-y-auto h-auto lg:h-full">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-xs uppercase tracking-[0.2em] dark:text-white">Curriculum Map</h3>
            <span className="text-[10px] font-mono text-brand-blue font-bold">{progressPercentage}%</span>
          </div>

          <div className="space-y-3">
            {courseLessons.map((lesson, idx) => {
              const isActive = Number(activeLessonId) === Number(lesson.id);
              const isDone = globalCompletedLessons.includes(lesson.id) || globalCompletedLessons.includes(Number(lesson.id));

              return (
                <div
                  key={lesson.id}
                  onClick={() => setActiveLessonId(lesson.id)}
                  className={`p-5 rounded-[24px] border cursor-pointer transition-all duration-300 ${isActive ? 'border-brand-blue bg-white dark:bg-slate-900 shadow-xl scale-[1.02]' : 'border-transparent hover:bg-slate-100/50'
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${isActive ? 'bg-brand-blue text-white' : isDone ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-100 text-slate-400'
                      }`}>
                      {isDone ? <CheckCircle size={14} /> : idx + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className={`text-sm font-bold leading-tight ${isActive ? 'text-brand-blue' : 'text-slate-700 dark:text-slate-300'}`}>{lesson.title}</h4>
                      <span className="text-[10px] font-mono text-slate-400">{lesson.duration || 'Video'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;