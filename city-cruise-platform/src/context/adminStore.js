import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getStudents, getPendingExams, gradeTheory, approveSubmission } from '../api/adminService';

export const useAdminStore = create(
  persist(
    (set, get) => ({
      students: [],
      pendingSubmissions: [],
      gradedNotifications: [], 
      revenue: 0,
      isLoading: false,
      error: null,

      fetchStudents: async () => {
        set({ isLoading: true, error: null });
        try {
          const data = await getStudents();
          set({ students: data.data || data, isLoading: false });
        } catch (err) {
          set({ error: err.message, isLoading: false });
        }
      },

      fetchPendingSubmissions: async () => {
        set({ isLoading: true, error: null });
        try {
          const data = await getPendingExams();
          set({ pendingSubmissions: data.data || data, isLoading: false });
        } catch (err) {
          set({ error: err.message, isLoading: false });
        }
      },

      toggleUserStatus: (id) => set((state) => ({
        students: state.students.map(u => 
          u.id === id ? { ...u, status: u.status === 'Banned' ? 'Active' : 'Banned' } : u
        )
      })),

      addSubmission: (submission) => set((state) => ({
        pendingSubmissions: [submission, ...state.pendingSubmissions]
      })),

      finalizeGrading: async (subId, theoryScore, authStoreAction) => {
        set({ isLoading: true, error: null });
        try {
          await gradeTheory(subId, theoryScore);
          const approvalData = await approveSubmission(subId);
          const { finalScore, passed } = approvalData.data || approvalData;

          const state = get();
          const submission = state.pendingSubmissions.find(s => s.id === subId);
          
          if (submission && authStoreAction) {
            authStoreAction(submission.courseId, submission.course, passed, finalScore);
          }

          const newNotification = submission ? {
            id: Date.now(),
            studentId: submission.studentId,
            courseName: submission.course,
            courseId: submission.courseId,
            score: finalScore,
            passed: passed,
            viewed: false
          } : null;

          set({
            pendingSubmissions: state.pendingSubmissions.filter(s => s.id !== subId),
            gradedNotifications: newNotification 
              ? [newNotification, ...state.gradedNotifications]
              : state.gradedNotifications,
            isLoading: false
          });
          
          return { finalScore, passed };
        } catch (err) {
          set({ error: err.message, isLoading: false });
          return null;
        }
      },

      clearNotification: (notifId) => set((state) => ({
        gradedNotifications: state.gradedNotifications.filter(n => n.id !== notifId)
      })),

      updateRevenue: (amount) => set((state) => ({ revenue: state.revenue + amount }))
    }),
    { name: 'citycruise-admin-storage' }
  )
);