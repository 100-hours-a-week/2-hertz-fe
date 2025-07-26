import { create } from 'zustand';

interface MatchingResponseState {
  hasRespondedMap: Record<number, boolean>;
  isModalOpen: boolean;
  isModalTemporarilyHidden: boolean;
  hiddenChannelRoomId: number | null;
  openModal: () => void;
  closeModal: () => void;
  temporarilyHideModal: (channelRoomId: number) => void;
  restoreModal: (channelRoomId: number) => void;
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
  isModalOpen: false,
  isModalTemporarilyHidden: false,
  hiddenChannelRoomId: null,

  openModal: () => set({ isModalOpen: true, isModalTemporarilyHidden: false }),
  closeModal: () =>
    set({ isModalOpen: false, isModalTemporarilyHidden: false, hiddenChannelRoomId: null }),

  temporarilyHideModal: (channelRoomId) => {
    const { isModalOpen } = get();
    if (isModalOpen) {
      set({
        isModalOpen: false,
        isModalTemporarilyHidden: true,
        hiddenChannelRoomId: channelRoomId,
      });
    }
  },

  restoreModal: (channelRoomId) => {
    const { isModalTemporarilyHidden, hiddenChannelRoomId } = get();
    if (isModalTemporarilyHidden && hiddenChannelRoomId === channelRoomId) {
      set({
        isModalOpen: true,
        isModalTemporarilyHidden: false,
        hiddenChannelRoomId: null,
      });
    }
  },

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
      set({
        hasRespondedMap: {},
        isModalOpen: false,
        isModalTemporarilyHidden: false,
        hiddenChannelRoomId: null,
      });
      return;
    }

    const { [channelRoomId]: _, ...rest } = current;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
    set({ hasRespondedMap: rest });
  },
}));
