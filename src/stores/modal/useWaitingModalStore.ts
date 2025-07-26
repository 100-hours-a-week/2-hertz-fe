import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WaitingModalState {
  isOpen: boolean;
  shouldShowModal: boolean;
  isTemporarilyHidden: boolean;
  hiddenChannelRoomId: number | null;
  hiddenModalData: { partnerNickname: string; channelRoomId: number } | null;
  partnerNickname: string;
  channelRoomId: number | null;
  openModal: (nickname: string, channelRoomId: number) => void;
  closeModal: () => void;
  temporarilyHideModal: (channelRoomId: number) => void;
  restoreModal: (channelRoomId: number) => void;
  reset: () => void;
}

export const useWaitingModalStore = create<WaitingModalState>()(
  persist(
    (set, get) => ({
      isOpen: false,
      shouldShowModal: false,
      isTemporarilyHidden: false,
      hiddenChannelRoomId: null,
      hiddenModalData: null,
      partnerNickname: '',
      channelRoomId: null,

      openModal: (nickname, channelRoomId) =>
        set({
          isOpen: true,
          shouldShowModal: true,
          isTemporarilyHidden: false,
          partnerNickname: nickname,
          channelRoomId,
        }),

      closeModal: () =>
        set((state) => ({
          ...state,
          isOpen: false,
        })),

      temporarilyHideModal: (channelRoomId) => {
        const state = get();
        if (state.isOpen) {
          set({
            isOpen: false,
            isTemporarilyHidden: true,
            hiddenChannelRoomId: channelRoomId,
            hiddenModalData: {
              partnerNickname: state.partnerNickname,
              channelRoomId: state.channelRoomId!,
            },
          });
        }
      },

      restoreModal: (channelRoomId) => {
        const state = get();
        if (
          state.isTemporarilyHidden &&
          state.hiddenChannelRoomId === channelRoomId &&
          state.hiddenModalData
        ) {
          set({
            isOpen: true,
            isTemporarilyHidden: false,
            hiddenChannelRoomId: null,
            partnerNickname: state.hiddenModalData.partnerNickname,
            channelRoomId: state.hiddenModalData.channelRoomId,
            hiddenModalData: null,
          });
        }
      },

      reset: () =>
        set({
          isOpen: false,
          shouldShowModal: false,
          isTemporarilyHidden: false,
          hiddenChannelRoomId: null,
          hiddenModalData: null,
          partnerNickname: '',
          channelRoomId: null,
        }),
    }),
    {
      name: 'waiting-modal-storage',
    },
  ),
);
