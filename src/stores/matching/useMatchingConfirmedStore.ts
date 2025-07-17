import { create } from 'zustand';

interface MatchingConfirmedState {
  confirmedChannelRoomIds: number[];
  markConfirmed: (channelRoomId: number) => void;
  isConfirmed: (channelRoomId: number) => boolean;
}

export const useMatchingConfirmedStore = create<MatchingConfirmedState>((set, get) => ({
  confirmedChannelRoomIds: [],
  markConfirmed: (channelRoomId) =>
    set((state) => ({
      confirmedChannelRoomIds: [...state.confirmedChannelRoomIds, channelRoomId],
    })),
  isConfirmed: (channelRoomId) => get().confirmedChannelRoomIds.includes(channelRoomId),
}));
