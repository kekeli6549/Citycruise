import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, DollarSign, Image as ImageIcon, X, ChevronRight, Save, Power, Users, Video, PlusCircle, Trash } from 'lucide-react';
import { useCourseStore } from '../context/courseStore';
import { 
  adminCreateCourse, 
  adminCreateLesson, 
  adminUpdateCourse, 
  adminUpdateLesson 
} from '../api/adminService';
import ConfirmationModal from '../components/ConfirmationModal';

const AdminCourseManager = () => {
  const { courses, categories, toggleStatus, fetchCourses, fetchCategories, addCategory, deleteCourse, isLoading } = useCourseStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  // Custom Delete Modal State
  const [deleteConfig, setDeleteConfig] = useState({ isOpen: false, courseId: null, courseTitle: '' });

  // Discipline Management
  const [newDisciplineName, setNewDisciplineName] = useState("");
  const [isAddingDiscipline, setIsAddingDiscipline] = useState(false);

  // Edit Mode States
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, [fetchCourses, fetchCategories]);

  const [newCourseData, setNewCourseData] = useState({
    title: '',
    description: '',
    intro: '',
    price: '',
    category: '',
    lessons: []
  });

  const [currentLesson, setCurrentLesson] = useState({
    title: '',
    summary: '',
    videoUrl: '',
    resources: []
  });

  const handleCreateDiscipline = async () => {
    if (!newDisciplineName.trim()) return;
    try {
      const tag = newDisciplineName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      await addCategory(newDisciplineName, tag);
      setNewCourseData({ ...newCourseData, category: tag });
      setNewDisciplineName("");
      setIsAddingDiscipline(false);
    } catch (err) {
      alert("Failed to create discipline");
    }
  };

  const openDeleteModal = (id, title) => {
    setDeleteConfig({ isOpen: true, courseId: id, courseTitle: title });
  };

  const confirmDelete = async () => {
    try {
      await deleteCourse(deleteConfig.courseId);
      setDeleteConfig({ isOpen: false, courseId: null, courseTitle: '' });
    } catch (err) {
      alert("Failed to delete course.");
    }
  };

  const handleEditClick = (course) => {
    setIsEditMode(true);
    setEditingCourseId(course.id);
    setNewCourseData({
      title: course.title || '',
      description: course.description || '',
      intro: course.intro || '',
      price: course.price || '',
      category: course.category || (categories[0]?.category_tag || ''),
      lessons: course.lessons || []
    });
    setPreviewUrl(course.image || null);
    setImageFile(null); // Reset file selection for new uploads
    setModalStep(1);
    setIsModalOpen(true);
  };

  const handleNewCourseClick = () => {
    setIsEditMode(false);
    setEditingCourseId(null);
    setNewCourseData({ 
        title: '', 
        description: '', 
        intro: '', 
        price: '', 
        category: categories[0]?.category_tag || '', 
        lessons: [] 
    });
    setPreviewUrl(null);
    setImageFile(null);
    setModalStep(1);
    setIsModalOpen(true);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const triggerUpload = () => fileInputRef.current.click();

  const removeImage = (e) => {
    e.stopPropagation();
    setImageFile(null);
    setPreviewUrl(null);
  };

  const addLessonToCourse = () => {
    if (!currentLesson.title) return;
    setNewCourseData({
      ...newCourseData,
      lessons: [...newCourseData.lessons, { ...currentLesson, videoUrl: currentLesson.videoUrl.trim(), id: Date.now() }]
    });
    setCurrentLesson({ title: '', summary: '', videoUrl: '', resources: [] });
  };

  const removeLesson = async (id) => {
    setNewCourseData({
      ...newCourseData,
      lessons: newCourseData.lessons.filter(l => l.id !== id)
    });

    if (typeof id !== 'number') {
      try {
        const { deleteLesson } = useCourseStore.getState();
        await deleteLesson(id);
      } catch (err) {
        console.error("Failed to delete lesson from database", err);
      }
    }
  };

  const handleSaveCourse = async () => {
    setIsSubmitting(true);
    try {
      const courseForm = new FormData();
      courseForm.append('title', newCourseData.title);
      courseForm.append('description', newCourseData.description);
      courseForm.append('price', newCourseData.price);
      courseForm.append('category', newCourseData.category);
      if (imageFile) courseForm.append('coverImage', imageFile);

      let currentCourseId = editingCourseId;
      
      if (isEditMode) {
        await adminUpdateCourse(editingCourseId, courseForm);
      } else {
        const courseResponse = await adminCreateCourse(courseForm);
        currentCourseId = courseResponse.data?.id || courseResponse.id;
      }

      // Sync Lessons
      for (let i = 0; i < newCourseData.lessons.length; i++) {
        const lesson = newCourseData.lessons[i];
        const lessonForm = new FormData();
        lessonForm.append('title', lesson.title);
        lessonForm.append('content', lesson.summary);
        lessonForm.append('orderIndex', i);
        lessonForm.append('video_link', lesson.videoUrl);

        if (isEditMode && lesson.id && typeof lesson.id !== 'number') {
            await adminUpdateLesson(lesson.id, lessonForm);
        } else {
            await adminCreateLesson(currentCourseId, lessonForm);
        }
      }

      fetchCourses();
      setIsModalOpen(false);
      setModalStep(1);
      setIsEditMode(false);
    } catch (err) {
      console.error("Course Sync Error:", err);
      alert("Action failed. Please verify API connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 px-4 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Course Inventory</h2>
          <p className="text-sm text-slate-500">Deploy, edit, and curate your educational content.</p>
        </div>
        <button
          onClick={handleNewCourseClick}
          className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-brand-blue text-white rounded-2xl font-bold text-xs uppercase tracking-[0.2em] shadow-xl shadow-brand-blue/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus size={18} /> New Course
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
            <div className="h-48 bg-slate-100 relative overflow-hidden">
              {course.image ? (
                <img src={course.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
              ) : (
                <div className={`w-full h-full bg-slate-200 flex items-center justify-center`}>
                  <ImageIcon className="text-slate-400" size={40} />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-4 left-4 flex flex-wrap gap-2 pr-4">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md shadow-lg ${course.status === 'active' || course.status === 'Published' ? 'bg-emerald-500 text-white' : 'bg-slate-900/80 text-white'}`}>
                  {course.status === 'active' || course.status === 'Published' ? 'Active' : 'Inactive'}
                </span>
              </div>

              {(course.status === 'Inactive' || course.status === 'inactive' || course.status === 'Draft') && (
                <button 
                  onClick={() => openDeleteModal(course.id, course.title)}
                  className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-md text-red-500 rounded-xl shadow-lg hover:bg-red-500 hover:text-white transition-all z-10"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
            <div className="p-6 md:p-7">
              <h3 className="font-bold text-slate-900 text-lg mb-2 truncate group-hover:text-brand-blue transition-colors">{course.title}</h3>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-slate-400" />
                  <p className="text-xs font-bold text-slate-500">{course.students || 0} Learners</p>
                </div>
                <p className="text-lg font-black text-slate-900">${course.price}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => handleEditClick(course)} className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all">
                  <Edit2 size={14} /> Edit
                </button>
                <button 
                  onClick={() => {
                    const newStatus = (course.status === 'Published' || course.status === 'active') ? 'inactive' : 'active';
                    toggleStatus(course.id, newStatus);
                  }} 
                  className={`p-3.5 rounded-xl transition-all ${course.status === 'Published' || course.status === 'active' ? 'text-red-500 bg-red-50 hover:bg-red-100' : 'text-emerald-500 bg-emerald-50 hover:bg-emerald-100'}`}
                >
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
              className="fixed inset-x-4 inset-y-8 md:inset-0 m-auto w-full max-w-4xl h-fit max-h-[90vh] bg-white z-[201] rounded-[32px] md:rounded-[40px] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-6 md:p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="pr-8">
                  <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{isEditMode ? 'Modify Course' : 'Architect New Content'}</h3>
                  <div className="flex gap-2 md:gap-3 mt-3 overflow-x-auto pb-1">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className={`h-1.5 min-w-[30px] md:w-12 rounded-full transition-all duration-500 ${modalStep >= i ? 'bg-brand-blue md:w-20' : 'bg-slate-200'}`} />
                    ))}
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-3 md:p-4 hover:bg-white hover:shadow-md rounded-2xl transition-all shrink-0"><X size={20} /></button>
              </div>

              <div className="p-6 md:p-10 overflow-y-auto flex-1">
                {modalStep === 1 && (
                  <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6 md:space-y-8">
                    <div className="grid gap-6">
                      <div className="space-y-3">
                        <span className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.2em]">Course Identity</span>
                        <input type="text" value={newCourseData.title} onChange={(e) => setNewCourseData({ ...newCourseData, title: e.target.value })} placeholder="e.g. Masterclass in Diaspora Wealth" className="w-full p-4 md:p-5 bg-slate-50 border-2 border-transparent rounded-[20px] md:rounded-[24px] text-base focus:border-brand-blue/20 focus:bg-white outline-none transition-all" />
                      </div>
                      <div className="space-y-3">
                        <span className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.2em]">Full Description</span>
                        <textarea rows="4" value={newCourseData.description} onChange={(e) => setNewCourseData({ ...newCourseData, description: e.target.value })} placeholder="Detailed curriculum..." className="w-full p-4 md:p-5 bg-slate-50 border-2 border-transparent rounded-[20px] md:rounded-[24px] text-base focus:border-brand-blue/20 focus:bg-white outline-none transition-all" />
                      </div>
                    </div>
                  </motion.div>
                )}

                {modalStep === 2 && (
                  <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6 md:space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <span className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.2em]">Investment (USD)</span>
                        <div className="relative">
                          <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                          <input 
                            type="number" 
                            value={newCourseData.price} 
                            onChange={(e) => setNewCourseData({ ...newCourseData, price: e.target.value })} 
                            placeholder="299" 
                            className="w-full pl-12 p-4 md:p-5 bg-slate-50 border-transparent border-2 rounded-[20px] md:rounded-[24px] focus:border-brand-blue/20 focus:bg-white outline-none font-bold" 
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.2em]">Discipline</span>
                            <button onClick={() => setIsAddingDiscipline(!isAddingDiscipline)} className="text-[9px] font-black text-brand-blue uppercase tracking-widest hover:underline">
                                {isAddingDiscipline ? "Cancel" : "+ Create New"}
                            </button>
                        </div>
                        
                        {isAddingDiscipline ? (
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={newDisciplineName} 
                                    onChange={(e) => setNewDisciplineName(e.target.value)} 
                                    placeholder="New Discipline Name..." 
                                    className="flex-1 p-4 bg-slate-50 border-2 border-brand-blue/20 rounded-[20px] outline-none font-bold text-sm"
                                />
                                <button onClick={handleCreateDiscipline} className="px-6 bg-brand-blue text-white rounded-[20px] font-bold text-[10px] uppercase">Add</button>
                            </div>
                        ) : (
                            <select 
                                value={newCourseData.category} 
                                onChange={(e) => setNewCourseData({ ...newCourseData, category: e.target.value })} 
                                className="w-full p-4 md:p-5 bg-slate-50 border-transparent border-2 rounded-[20px] md:rounded-[24px] focus:border-brand-blue/20 outline-none appearance-none font-bold"
                            >
                                <option value="" disabled>Select Discipline</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.category_tag}>{cat.NAME}</option>
                                ))}
                            </select>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {modalStep === 3 && (
                  <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6 md:space-y-8">
                    <div className="bg-slate-50 p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-slate-100 space-y-6">
                      <h4 className="font-bold text-slate-900 flex items-center gap-2"><PlusCircle size={20} className="text-brand-blue" /> Add Lesson</h4>
                      <div className="grid gap-4">
                        <input type="text" placeholder="Lesson Title" value={currentLesson.title} onChange={(e) => setCurrentLesson({ ...currentLesson, title: e.target.value })} className="w-full p-4 bg-white rounded-2xl border-none outline-none shadow-sm" />
                        <textarea placeholder="Lesson Summary" value={currentLesson.summary} onChange={(e) => setCurrentLesson({ ...currentLesson, summary: e.target.value })} className="w-full p-4 bg-white rounded-2xl border-none outline-none shadow-sm" rows="2" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input type="text" placeholder="YouTube URL" value={currentLesson.videoUrl} onChange={(e) => setCurrentLesson({ ...currentLesson, videoUrl: e.target.value })} className="p-4 bg-white rounded-2xl border-none outline-none shadow-sm" />
                          <button onClick={addLessonToCourse} className="p-4 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-brand-blue transition-colors">Register Lesson</button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.2em]">Curriculum Stack ({newCourseData.lessons.length})</span>
                      <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2">
                        {newCourseData.lessons.map((lesson, idx) => (
                          <div key={lesson.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                            <div className="flex items-center gap-4 min-w-0">
                              <div className="w-8 h-8 shrink-0 bg-slate-50 rounded-lg flex items-center justify-center font-bold text-slate-400 text-xs">{idx + 1}</div>
                              <div className="min-w-0">
                                <p className="font-bold text-slate-900 text-sm truncate">{lesson.title}</p>
                              </div>
                            </div>
                            <button onClick={() => removeLesson(lesson.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-all shrink-0"><Trash size={16} /></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {modalStep === 4 && (
                  <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-8">
                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
                    <div
                      onClick={triggerUpload}
                      className="relative overflow-hidden border-4 border-dashed border-slate-100 rounded-[32px] md:rounded-[40px] min-h-[250px] md:min-h-[300px] flex flex-col items-center justify-center hover:border-brand-blue/20 hover:bg-blue-50/30 transition-all cursor-pointer group"
                    >
                      <AnimatePresence mode="wait">
                        {!previewUrl ? (
                          <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center p-6 text-center">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-white shadow-xl rounded-3xl flex items-center justify-center mb-6">
                              <ImageIcon className="text-brand-blue" size={32} />
                            </div>
                            <p className="text-lg font-black text-slate-900">Upload Cover</p>
                          </motion.div>
                        ) : (
                          <motion.div key="preview" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="absolute inset-0 w-full h-full">
                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <p className="text-white font-bold bg-white/20 backdrop-blur-md px-6 py-2 rounded-full border border-white/30 text-sm">Change Image</p>
                            </div>
                            <button onClick={removeImage} className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full z-10"><X size={18} /></button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="p-6 md:p-10 bg-slate-50 flex flex-col sm:flex-row justify-between gap-4">
                <button
                  disabled={modalStep === 1}
                  onClick={() => setModalStep(s => s - 1)}
                  className={`order-2 sm:order-1 px-10 py-4 md:py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${modalStep === 1 ? 'hidden' : 'bg-white text-slate-600 border border-slate-200 hover:shadow-md'}`}
                >
                  Back
                </button>
                <div className="order-1 sm:order-2 flex-1 flex justify-end">
                  {modalStep < 4 ? (
                    <button onClick={() => setModalStep(s => s + 1)} className="w-full sm:w-auto px-10 py-4 md:py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-800 shadow-xl shadow-slate-200">
                      Next Phase <ChevronRight size={18} />
                    </button>
                  ) : (
                    <button onClick={handleSaveCourse} disabled={isSubmitting} className="w-full sm:w-auto px-10 py-4 md:py-5 bg-brand-blue text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-brand-blue/40 hover:scale-105 active:scale-95 transition-all">
                      {isSubmitting ? 'Syncing...' : (isEditMode ? 'Update Changes' : 'Deploy to Live')} <Save size={18} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <ConfirmationModal 
        isOpen={deleteConfig.isOpen}
        onClose={() => setDeleteConfig({ ...deleteConfig, isOpen: false })}
        onConfirm={confirmDelete}
        title="Delete Course?"
        message={`Are you sure you want to remove "${deleteConfig.courseTitle}"? This is a permanent destruction of this curriculum.`}
        confirmText="Confirm Delete"
      />
    </motion.div>
  );
};

export default AdminCourseManager;