import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SavedSpotData {
  id: string;
  name: string;
  photo: string | null;
  latitude: number;
  longitude: number;
  timestamp: number;
}

interface SavedSpotState {
  savedSpots: SavedSpotData[];
  addSpot: (spot: SavedSpotData) => void;
  deleteSpot: (id: string) => void;
}

export const useSavedSpotStore = create<SavedSpotState>()(
  persist(
    (set) => ({
      savedSpots: [],
      addSpot: (spot) => set((state) => ({ savedSpots: [spot, ...state.savedSpots] })),
      deleteSpot: (id) => set((state) => ({ savedSpots: state.savedSpots.filter((s) => s.id !== id) })),
    }),
    {
      name: 'mm_saved_spots_store', // Updated LocalStorage key to prevent type conflict
    }
  )
);
