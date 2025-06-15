import { create } from 'zustand';

interface useNavNewMessageStoreState {
  hasNewMessage: boolean;
  setHasNewMessage: (value: boolean) => void;
}

export const useNavNewMessageStore = create<useNavNewMessageStoreState>((set) => ({
  hasNewMessage: false,
  setHasNewMessage: (value) => set({ hasNewMessage: value }),
}));
