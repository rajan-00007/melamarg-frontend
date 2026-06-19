import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SavedSpotData {
  name: string;
  photo: string | null;
  latitude: number;
  longitude: number;
  timestamp: number;
}

interface SavedSpotState {
  savedSpot: SavedSpotData | null;
  saveSpot: (spot: SavedSpotData) => void;
  deleteSpot: () => void;
}

export const useSavedSpotStore = create<SavedSpotState>()(
  persist(
    (set) => ({
      savedSpot: null,
      saveSpot: (spot) => set({ savedSpot: spot }),
      deleteSpot: () => set({ savedSpot: null }),
    }),
    {
      name: 'mm_saved_spot_store', // LocalStorage key
    }
  )
);
