import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

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

export const useMatchingResponseStore = create<MatchingResponseState>()(
  immer((set, get) => ({
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
      set((state) => {
        state.hasRespondedMap[channelRoomId] = value;
      });
      // TBT 최적화: localStorage 쓰기를 비동기로 처리하여 메인 스레드 블로킹 방지
      const updated = { ...get().hasRespondedMap, [channelRoomId]: value };
      requestIdleCallback(
        () => {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        },
        { timeout: 100 },
      );
    },

    getHasResponded: (channelRoomId) => get().hasRespondedMap[channelRoomId] ?? false,

    reset: (channelRoomId?: number) => {
      if (channelRoomId === undefined) {
        localStorage.removeItem(STORAGE_KEY);
        set((state) => {
          state.hasRespondedMap = {};
          state.isModalOpen = false;
          state.isModalTemporarilyHidden = false;
          state.hiddenChannelRoomId = null;
        });
        return;
      }

      set((state) => {
        delete state.hasRespondedMap[channelRoomId];
      });
      const updatedMap = get().hasRespondedMap;
      requestIdleCallback(
        () => {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMap));
        },
        { timeout: 100 },
      );
    },
  })),
);
