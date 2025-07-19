import { create } from 'zustand';

interface MatchingResponseState {
  hasRespondedMap: Record<number, boolean>;
  setHasResponded: (channelRoomId: number, value: boolean) => void;
  getHasResponded: (channelRoomId: number) => boolean;
  reset: (channelRoomId?: number) => void;
}

const STORAGE_KEY = 'matching_has_responded_map';

const getInitialState = (): Record<number, boolean> => {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

export const useMatchingResponseStore = create<MatchingResponseState>((set, get) => ({
  hasRespondedMap: getInitialState(),

  setHasResponded: (channelRoomId, value) => {
    const updated = { ...get().hasRespondedMap, [channelRoomId]: value };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ hasRespondedMap: updated });
  },

  getHasResponded: (channelRoomId) => get().hasRespondedMap[channelRoomId] ?? false,

  reset: (channelRoomId?: number) => {
    const current = get().hasRespondedMap;

    if (channelRoomId === undefined) {
      localStorage.removeItem(STORAGE_KEY);
      set({ hasRespondedMap: {} });
      return;
    }

    const { [channelRoomId]: _, ...rest } = current;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
    set({ hasRespondedMap: rest });
  },
}));
