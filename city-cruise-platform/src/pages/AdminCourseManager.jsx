import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, DollarSign, Image as ImageIcon, X, ChevronRight, Save, Power, Users, ClipboardCheck, Video, FileText, PlusCircle, Trash } from 'lucide-react';
import { useCourseStore } from '../context/courseStore';

const AdminCourseManager = () => {
  const { courses, toggleStatus, addCourse } = useCourseStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  
  const [newCourseData, setNewCourseData] = useState({ 
    title: '', 
    description: '', 
    intro: '',
    price: '', 
    category: 'Finance & Wealth',
    lessons: []
  });

  const [currentLesson, setCurrentLesson] = useState({
    title: '',
    summary: '',
    videoUrl: '',
    resources: [] 
  });

  // Helper to ensure URLs are trimmed
  const addLessonToCourse = () => {
    if(!currentLesson.title) return;
    setNewCourseData({
      ...newCourseData,
      lessons: [...newCourseData.lessons, { ...currentLesson, videoUrl: currentLesson.videoUrl.trim(), id: Date.now() }]
    });
    setCurrentLesson({ title: '', summary: '', videoUrl: '', resources: [] });
  };

  const removeLesson = (id) => {
    setNewCourseData({
      ...newCourseData,
      lessons: newCourseData.lessons.filter(l => l.id !== id)
    });
  };

  const handleCreateCourse = () => {
    addCourse(newCourseData);
    setIsModalOpen(false);
    setModalStep(1);
    setNewCourseData({ title: '', description: '', intro: '', price: '', category: 'Finance & Wealth', lessons: [] });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Course Inventory</h2>
          <p className="text-sm text-slate-500">Deploy, edit, and curate your educational content.</p>
        </div>
        <button 
          onClick={() => { setModalStep(1); setIsModalOpen(true); }}
          className="flex items-center gap-3 px-8 py-4 bg-brand-blue text-white rounded-2xl font-bold text-xs uppercase tracking-[0.2em] shadow-xl shadow-brand-blue/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus size={18} /> New Course
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
            <div className="h-48 bg-slate-100 relative overflow-hidden">
              {course.image ? (
                <img src={course.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
              ) : (
                <div className={`w-full h-full ${course.img || 'bg-slate-200'} flex items-center justify-center`}>
                   <ImageIcon className="text-slate-400" size={40} />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md shadow-lg ${
                  course.status === 'Published' ? 'bg-emerald-500 text-white' : 'bg-slate-900/80 text-white'
                }`}>
                  {course.status || 'Draft'}
                </span>
                {course.lessons?.length > 0 && (
                   <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-brand-blue text-white shadow-lg flex items-center gap-1">
                     <Video size={10} /> {course.lessons.length} Lessons
                   </span>
                )}
              </div>
            </div>
            <div className="p-7">
              <h3 className="font-bold text-slate-900 text-lg mb-2 truncate group-hover:text-brand-blue transition-colors">{course.title}</h3>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-slate-400" />
                  <p className="text-xs font-bold text-slate-500">{course.students || 0} Learners</p>
                </div>
                <p className="text-lg font-black text-slate-900">${course.price}</p>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all">
                  <Edit2 size={14} /> Edit
                </button>
                <button onClick={() => toggleStatus(course.id)} className={`p-3.5 rounded-xl transition-all ${course.status === 'Published' ? 'text-red-500 bg-red-50 hover:bg-red-100' : 'text-emerald-500 bg-emerald-50 hover:bg-emerald-100'}`}>
                  <Power size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[200]" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="fixed inset-0 m-auto w-full max-w-4xl h-[90vh] bg-white z-[201] rounded-[40px] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Architect New Content</h3>
                  <div className="flex gap-3 mt-3">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className={`h-1.5 w-12 rounded-full transition-all duration-500 ${modalStep >= i ? 'bg-brand-blue w-20' : 'bg-slate-200'}`} />
                    ))}
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-4 hover:bg-white hover:shadow-md rounded-2xl transition-all"><X size={24} /></button>
              </div>

              <div className="p-10 overflow-y-auto flex-1">
                {modalStep === 1 && (
                  <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-8">
                    <div className="grid gap-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.2em]">Course Identity</label>
                            <input type="text" value={newCourseData.title} onChange={(e) => setNewCourseData({...newCourseData, title: e.target.value})} placeholder="e.g. Masterclass in Diaspora Wealth" className="w-full p-5 bg-slate-50 border-2 border-transparent rounded-[24px] text-base font-medium focus:border-brand-blue/20 focus:bg-white outline-none transition-all" />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.2em]">Introduction Summary</label>
                            <textarea rows="2" value={newCourseData.intro} onChange={(e) => setNewCourseData({...newCourseData, intro: e.target.value})} placeholder="Short catchphrase for the course..." className="w-full p-5 bg-slate-50 border-2 border-transparent rounded-[24px] text-base font-medium focus:border-brand-blue/20 focus:bg-white outline-none transition-all" />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.2em]">Full Description</label>
                            <textarea rows="4" value={newCourseData.description} onChange={(e) => setNewCourseData({...newCourseData, description: e.target.value})} placeholder="Detailed curriculum vision..." className="w-full p-5 bg-slate-50 border-2 border-transparent rounded-[24px] text-base font-medium focus:border-brand-blue/20 focus:bg-white outline-none transition-all" />
                        </div>
                    </div>
                  </motion.div>
                )}

                {modalStep === 2 && (
                  <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.2em]">Investment (USD)</label>
                        <div className="relative">
                          <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                          <input type="number" value={newCourseData.price} onChange={(e) => setNewCourseData({...newCourseData, price: e.target.value})} placeholder="299" className="w-full pl-12 p-5 bg-slate-50 border-transparent border-2 rounded-[24px] focus:border-brand-blue/20 focus:bg-white outline-none" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.2em]">Discipline</label>
                        <select value={newCourseData.category} onChange={(e) => setNewCourseData({...newCourseData, category: e.target.value})} className="w-full p-5 bg-slate-50 border-transparent border-2 rounded-[24px] focus:border-brand-blue/20 outline-none appearance-none font-bold">
                          <option>Finance & Wealth</option>
                          <option>Tech Leadership</option>
                          <option>Creative Arts</option>
                          <option>Creative Arts</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {modalStep === 3 && (
                  <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-8">
                    <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 space-y-6">
                      <h4 className="font-bold text-slate-900 flex items-center gap-2"><PlusCircle size={20} className="text-brand-blue"/> Add New Lesson</h4>
                      <div className="grid gap-4">
                        <input type="text" placeholder="Lesson Title" value={currentLesson.title} onChange={(e) => setCurrentLesson({...currentLesson, title: e.target.value})} className="w-full p-4 bg-white rounded-2xl border-none outline-none shadow-sm" />
                        <textarea placeholder="Lesson Summary & Key Takeaways" value={currentLesson.summary} onChange={(e) => setCurrentLesson({...currentLesson, summary: e.target.value})} className="w-full p-4 bg-white rounded-2xl border-none outline-none shadow-sm" rows="3" />
                        <div className="grid grid-cols-2 gap-4">
                          <input type="text" placeholder="YouTube Video URL" value={currentLesson.videoUrl} onChange={(e) => setCurrentLesson({...currentLesson, videoUrl: e.target.value})} className="p-4 bg-white rounded-2xl border-none outline-none shadow-sm" />
                          <button onClick={addLessonToCourse} className="bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-brand-blue transition-colors">Register Lesson</button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.2em]">Curriculum Stack ({newCourseData.lessons.length})</label>
                      {newCourseData.lessons.map((lesson, idx) => (
                        <div key={lesson.id} className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center font-bold text-slate-400">{idx + 1}</div>
                            <div>
                              <p className="font-bold text-slate-900 text-sm">{lesson.title}</p>
                              <p className="text-[10px] text-slate-400 truncate max-w-[300px]">{lesson.summary}</p>
                            </div>
                          </div>
                          <button onClick={() => removeLesson(lesson.id)} className="p-3 text-red-400 hover:bg-red-50 rounded-xl transition-all"><Trash size={16}/></button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {modalStep === 4 && (
                  <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-8">
                    <div className="border-4 border-dashed border-slate-100 rounded-[40px] p-20 flex flex-col items-center justify-center hover:border-brand-blue/20 hover:bg-blue-50/30 transition-all cursor-pointer group">
                      <div className="w-20 h-20 bg-white shadow-xl rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <ImageIcon className="text-brand-blue" size={32} />
                      </div>
                      <p className="text-lg font-black text-slate-900">Upload Cinematic Cover</p>
                      <p className="text-sm text-slate-400 mt-2 font-medium">16:9 Aspect Ratio recommended (Max 5MB)</p>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="p-10 bg-slate-50 flex justify-between gap-6">
                <button 
                  disabled={modalStep === 1}
                  onClick={() => setModalStep(s => s - 1)}
                  className={`px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${modalStep === 1 ? 'opacity-0' : 'bg-white text-slate-600 border border-slate-200 hover:shadow-md'}`}
                >
                  Back
                </button>
                {modalStep < 4 ? (
                  <button onClick={() => setModalStep(s => s + 1)} className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-slate-800 shadow-xl shadow-slate-200">
                    Next Phase <ChevronRight size={18} />
                  </button>
                ) : (
                  <button onClick={handleCreateCourse} className="px-10 py-5 bg-brand-blue text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-brand-blue/40 hover:scale-105 active:scale-95 transition-all">
                    Deploy to Live <Save size={18} />
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminCourseManager;