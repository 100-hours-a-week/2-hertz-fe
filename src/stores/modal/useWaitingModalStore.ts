import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WaitingModalState {
  isOpen: boolean;
  shouldShowModal: boolean;
  partnerNickname: string;
  channelRoomId: number | null;
  openModal: (nickname: string, channelRoomId: number) => void;
  closeModal: () => void;
  reset: () => void;
}

export const useWaitingModalStore = create<WaitingModalState>()(
  persist(
    (set) => ({
      isOpen: false,
      shouldShowModal: false,
      partnerNickname: '',
      channelRoomId: null,

      openModal: (nickname, channelRoomId) =>
        set({
          isOpen: true,
          shouldShowModal: true,
          partnerNickname: nickname,
          channelRoomId,
        }),

      closeModal: () =>
        set((state) => ({
          ...state,
          isOpen: false,
        })),

      reset: () =>
        set({
          isOpen: false,
          shouldShowModal: false,
          partnerNickname: '',
          channelRoomId: null,
        }),
    }),
    {
      name: 'waiting-modal-storage',
    },
  ),
);
