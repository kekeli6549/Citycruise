import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAdminStore = create(
  persist(
    (set, get) => ({
      students: [
        { id: 1, name: "Kwame Mensah", email: "kwame@example.com", status: "Active", joined: "Oct 12, 2025", courses: 4, spent: 1200 },
        { id: 2, name: "Amara Oke", email: "amara.o@domain.com", status: "Active", joined: "Nov 05, 2025", courses: 2, spent: 598 },
        { id: 3, name: "Zaidu Yusuf", email: "z.yusuf@web.com", status: "Banned", joined: "Jan 20, 2026", courses: 1, spent: 399 },
      ],
      pendingSubmissions: [
        { 
          id: 'sub_1', 
          studentId: 1,
          student: 'Kwame Mensah', 
          courseId: 'course_1',
          course: 'Global Strategy', 
          date: 'Feb 28, 2026', 
          theoryAnswers: [{ qId: 2, text: 'The diaspora provides critical seed capital...' }], 
          objScore: 70 
        },
      ],
      gradedNotifications: [], 
      revenue: 42500,

      toggleUserStatus: (id) => set((state) => ({
        students: state.students.map(u => 
          u.id === id ? { ...u, status: u.status === 'Banned' ? 'Active' : 'Banned' } : u
        )
      })),

      addSubmission: (submission) => set((state) => ({
        pendingSubmissions: [submission, ...state.pendingSubmissions]
      })),

      // ACTION: Used by Admin to finalize a grade
      finalizeGrading: (subId, additionalPoints, authStoreAction) => {
        const state = get();
        const submission = state.pendingSubmissions.find(s => s.id === subId);
        if (!submission) return;

        const finalScore = submission.objScore + additionalPoints;
        const passed = finalScore >= 85;

        if (authStoreAction) {
          authStoreAction(submission.courseId, submission.course, passed, finalScore);
        }

        const newNotification = {
          id: Date.now(),
          studentId: submission.studentId,
          courseName: submission.course,
          courseId: submission.courseId,
          score: finalScore,
          passed: passed,
          viewed: false
        };

        set({
          pendingSubmissions: state.pendingSubmissions.filter(s => s.id !== subId),
          gradedNotifications: [newNotification, ...state.gradedNotifications]
        });
        
        return { finalScore, passed };
      },

      // ACTION: Specifically for the Student Dashboard to clear the pop-up
      clearNotification: (notifId) => set((state) => ({
        gradedNotifications: state.gradedNotifications.filter(n => n.id !== notifId)
      })),

      updateRevenue: (amount) => set((state) => ({ revenue: state.revenue + amount }))
    }),
    { name: 'rootle-admin-storage' }
  )
);