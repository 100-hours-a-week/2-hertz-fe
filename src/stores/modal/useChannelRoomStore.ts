import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

type ChannelRoomState = {
  relationTypeMap: Record<number, string>;
  setRelationType: (channelRoomId: number, relationType: string) => void;
  getRelationType: (channelRoomId: number) => string | undefined;
};

export const useChannelRoomStore = create<ChannelRoomState>()(
  immer((set, get) => ({
    relationTypeMap: {},
    setRelationType: (channelRoomId, relationType) =>
      set((state) => {
        state.relationTypeMap[channelRoomId] = relationType;
      }),
    getRelationType: (channelRoomId) => get().relationTypeMap[channelRoomId],
  })),
);
