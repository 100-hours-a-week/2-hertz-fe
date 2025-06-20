import { create } from 'zustand';

interface useNewAlarmStoreState {
  hasNewAlarm: boolean;
  setHasNewAlarm: (value: boolean) => void;
}

export const useNewAlarmStore = create<useNewAlarmStoreState>((set) => ({
  hasNewAlarm: false,
  setHasNewAlarm: (value) => set({ hasNewAlarm: value }),
}));
