import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Play, CheckCircle, Award, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../context/authStore';
import { useCourseStore } from '../context/courseStore';

const CoursePlayer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { courses } = useCourseStore();
  const { completeCourse, completedCourses } = useAuthStore();
  const [activeLesson, setActiveLesson] = useState(1);

  const course = courses.find(c => c.id === courseId);
  const lessons = [
    { id: 1, title: "Industry Overview & Fundamentals", duration: "15:20" },
    { id: 2, title: "Strategic Resource Allocation", duration: "22:45" },
    { id: 3, title: "High-Performance Team Dynamics", duration: "18:10" }
  ];

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
      <div className="border-b border-slate-100 dark:border-slate-800 p-6 flex justify-between items-center">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-400 hover:text-brand-blue transition-colors">
          <ChevronLeft size={18}/> Hub
        </button>
        <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Lesson {activeLesson} of {lessons.length}</span>
        
        {isCompleted ? (
          <button 
            onClick={startExam} 
            className="flex items-center gap-2 bg-emerald-500 text-white px-6 py-2.5 rounded-full font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
          >
            <Award size={14} /> {course?.exam ? 'Take Exam' : 'Exam Unavailable'}
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
        <div className="flex-1 bg-black aspect-video lg:aspect-auto flex items-center justify-center relative">
          <p className="text-white/20 font-mono text-[10px] uppercase tracking-[0.5em]">Secure Stream Active</p>
          <div className="absolute bottom-10 left-10 text-white">
            <h2 className="text-2xl font-heading font-bold">{lessons.find(l => l.id === activeLesson)?.title}</h2>
          </div>
        </div>

        <div className="w-full lg:w-96 border-l border-slate-100 dark:border-slate-800 p-8 overflow-y-auto">
          <h3 className="font-heading font-bold text-xl mb-8 dark:text-white">Curriculum</h3>
          <div className="space-y-4">
            {lessons.map((lesson) => (
              <div 
                key={lesson.id} 
                onClick={() => setActiveLesson(lesson.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${activeLesson === lesson.id ? 'border-brand-blue bg-brand-blue/5' : 'border-slate-100 dark:border-slate-800 hover:border-brand-blue/30'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeLesson === lesson.id ? 'bg-brand-blue text-white' : 'bg-slate-50 dark:bg-slate-900 text-slate-400'}`}>
                    <Play size={12} fill={activeLesson === lesson.id ? "currentColor" : "none"} />
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold ${activeLesson === lesson.id ? 'text-brand-blue' : 'dark:text-white'}`}>{lesson.title}</h4>
                    <span className="text-[10px] font-mono text-slate-400">{lesson.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {isCompleted && (
            <div className="mt-8 p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl">
              <div className="flex items-center gap-3 mb-2 text-emerald-500">
                <CheckCircle size={18} />
                <p className="text-xs font-bold uppercase tracking-widest">Progress Verified</p>
              </div>
              <p className="text-slate-500 text-[10px] leading-relaxed font-body">
                {course?.exam ? "You have completed all materials. Final assessment is now unlocked." : "Curriculum finished. Awaiting final assessment publication."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  ); 
};

export default CoursePlayer;