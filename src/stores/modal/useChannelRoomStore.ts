import { create } from 'zustand';

type ChannelRoomState = {
  relationTypeMap: Record<number, string>;
  setRelationType: (channelRoomId: number, relationType: string) => void;
  getRelationType: (channelRoomId: number) => string | undefined;
};

export const useChannelRoomStore = create<ChannelRoomState>((set, get) => ({
  relationTypeMap: {},
  setRelationType: (channelRoomId, relationType) =>
    set((state) => ({
      relationTypeMap: {
        ...state.relationTypeMap,
        [channelRoomId]: relationType,
      },
    })),
  getRelationType: (channelRoomId) => get().relationTypeMap[channelRoomId],
}));
