import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  getStudents, 
  getPendingExams, 
  gradeTheory, 
  approveSubmission, 
  adminGetStats, 
  adminGetActivityLogs, 
  adminToggleUserStatus 
} from '../api/adminService';

export const useAdminStore = create(
  persist(
    (set, get) => ({
      students: [],
      pendingSubmissions: [],
      gradedNotifications: [], 
      error: null,
      stats: {
        totalStudents: 0,
        revenue: 0,
        pendingExams: 0,
        trends: {}
      },
      activityLogs: [],

      fetchStudents: async (query = '') => {
        set({ isLoading: true, error: null });
        try {
          const data = await getStudents(query);
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

      toggleUserStatus: async (id, isActive) => {
        set({ isLoading: true, error: null });
        try {
          await adminToggleUserStatus(id, isActive);
          set((state) => ({
            students: state.students.map(u => 
              u.id === id ? { ...u, isActive: isActive } : u
            ),
            isLoading: false
          }));
        } catch (err) {
          set({ error: err.message, isLoading: false });
        }
      },

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

      updateRevenue: (amount) => set((state) => ({ revenue: (get().stats.revenue || 0) + amount })),

      fetchStats: async () => {
        set({ isLoading: true, error: null });
        try {
          const data = await adminGetStats();
          set({ stats: data.data || data, isLoading: false });
        } catch (err) {
          set({ error: err.message, isLoading: false });
        }
      },

      fetchActivityLogs: async (limit = 50, offset = 0) => {
        set({ isLoading: true, error: null });
        try {
          const data = await adminGetActivityLogs(limit, offset);
          set({ activityLogs: data.data || data, isLoading: false });
        } catch (err) {
          set({ error: err.message, isLoading: false });
        }
      }
    }),
    { name: 'citycruise-admin-storage' }
  )
);