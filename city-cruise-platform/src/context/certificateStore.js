import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getExamHistory } from '../api/examService';

export const useCertificateStore = create(
  persist(
    (set, get) => ({
      examHistory: [],
      notifications: [], 
      isLoading: false,

      refreshResults: async () => {
        set({ isLoading: true });
        try {
          const response = await getExamHistory();
          const history = response.data?.data || (Array.isArray(response.data) ? response.data : []);
          
          const previousHistory = get().examHistory;

          const newResults = history.filter(h => 
            !previousHistory.some(prev => prev.id === h.id)
          );

          if (newResults.length > 0) {
            const newNotifs = newResults.map(res => ({
              id: res.id,
              courseId: res.course_id,
              courseName: res.course_title,
              score: res.total_score,
              passed: res.passed || res.STATUS === 'approved',
              viewed: false
            }));

            set((state) => ({
              notifications: [...newNotifs, ...state.notifications]
            }));
          }

          set({ examHistory: history, isLoading: false });
        } catch (err) {
          console.error("Result sync error:", err);
          set({ isLoading: false });
        }
      },

      clearNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      })),
      
      markAllAsViewed: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, viewed: true }))
      }))
    }),
    { name: 'citycruise-certificate-storage' }
  )
);