import { create } from 'zustand';

interface MatchingResponseStore {
  hasResponded: boolean;
  setHasResponded: (value: boolean) => void;
}

export const useMatchingResponseStore = create<MatchingResponseStore>((set) => ({
  hasResponded: false,
  setHasResponded: (value) => set({ hasResponded: value }),
}));
