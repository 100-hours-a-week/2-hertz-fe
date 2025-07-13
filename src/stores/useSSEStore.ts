import { create } from 'zustand';

type SSEStore = {
  reconnect: () => void;
  setReconnect: (fn: () => void) => void;
};

export const useSSEStore = create<SSEStore>((set) => ({
  reconnect: () => {},
  setReconnect: (fn) => set({ reconnect: fn }),
}));
