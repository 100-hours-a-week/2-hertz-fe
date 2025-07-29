export type NewMessageType = {
  channelRoomId: number;
  partnerId: number;
  partnerNickname: string;
  message: string;
  messageSendAt: string;
  partnerProfileImage: string;
  relationType: string;
  lastPageNumber: number;
};
