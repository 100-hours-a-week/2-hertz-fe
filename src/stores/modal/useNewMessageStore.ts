import { create } from 'zustand';

interface NewMessage {
  channelRoomId: number;
  partnerId: number;
  partnerNickname: string;
  message: string;
  messageSendAt: string;
  partnerProfileImage: string;
  relationType: string;
  lastPageNumber: number;
}

interface NewMessageStore {
  toast: NewMessage | null;
  showToast: (message: NewMessage) => void;
  hideToast: () => void;
}

export const useNewMessageStore = create<NewMessageStore>((set) => ({
  toast: null,
  showToast: (message) => {
    set({ toast: message });
  },
  hideToast: () => set({ toast: null }),
}));
