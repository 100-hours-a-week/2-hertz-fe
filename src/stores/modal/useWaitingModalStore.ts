import { create } from 'zustand';

interface WaitingModalState {
  isOpen: boolean;
  partnerNickname: string;
  openModal: (nickname: string) => void;
  closeModal: () => void;
}

export const useWaitingModalStore = create<WaitingModalState>((set) => ({
  isOpen: false,
  partnerNickname: '',
  openModal: (nickname) => set({ isOpen: true, partnerNickname: nickname }),
  closeModal: () => set({ isOpen: false, partnerNickname: '' }),
}));
