import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PendingFeedback {
  id: string;
  event_id: string | null;
  rating: number;
  thoughts: string;
  timestamp: number;
}

interface FeedbackState {
  pendingFeedbacks: PendingFeedback[];
  addPendingFeedback: (feedback: Omit<PendingFeedback, 'id' | 'timestamp'>) => void;
  removePendingFeedback: (id: string) => void;
  clearPendingFeedbacks: () => void;
}

export const useFeedbackStore = create<FeedbackState>()(
  persist(
    (set) => ({
      pendingFeedbacks: [],
      addPendingFeedback: (feedback) => set((state) => ({
        pendingFeedbacks: [
          ...state.pendingFeedbacks,
          {
            ...feedback,
            id: `feedback-pending-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now()
          }
        ]
      })),
      removePendingFeedback: (id) => set((state) => ({
        pendingFeedbacks: state.pendingFeedbacks.filter((f) => f.id !== id)
      })),
      clearPendingFeedbacks: () => set({ pendingFeedbacks: [] }),
    }),
    {
      name: 'mm_pending_feedback_store',
    }
  )
);
