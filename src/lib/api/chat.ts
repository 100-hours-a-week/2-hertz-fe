import axiosInstance from '@/lib/axios';

export interface ChannelRoom {
  channelRoomId: number;
  partnerProfileImage: string;
  partnerNickname: string;
  lastMessage: string;
  lastMessageTime: string;
  isRead: boolean;
  relationType: 'SIGNAL' | 'MATCHING' | 'UNMATCHED';
}

export interface GetChannelRoomListResponse {
  code: string;
  message: string;
  data: {
    list: ChannelRoom[];
    pageNumber: number;
    pageSize: number;
    isLast: boolean;
  } | null;
}

export const getChannelRooms = async (page = 0, size = 10): Promise<GetChannelRoomListResponse> => {
  const response = await axiosInstance.get(`/v1/channel?page=${page}&size=${size}`);
  return response.data;
};

export interface List {
  messageId: number;
  messageSenderId: number;
  messageContents: string;
  messageSendAt: string;
}

export interface Messages {
  list: List[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    isLast: boolean;
  };
}

export interface ChannelRoomDetailResponse {
  code: string;
  message: string;
  data: {
    channelRoomId: number;
    partnerId: number;
    partnerProfileImage: string;
    partnerNickname: string;
    relationType: 'SIGNAL' | 'MATCHING' | 'UNMATCHED';
    messages: Messages;
    pageable: {
      pageNumber: number;
      pageSize: number;
      isLast: boolean;
    };
  };
}

export const getChannelRoomDetail = async (
  channelRoomId: number,
  page = 0,
  size = 10,
): Promise<ChannelRoomDetailResponse> => {
  const response = await axiosInstance.get(
    `/v1/channel-rooms/${channelRoomId}?page=${page}&size=${size}`,
  );
  return response.data;
};

export interface PostChannelMessageRequest {
  message: string;
}

export interface PostChannelMessageResponse {
  code: string;
  message: string;
  data: null;
}

export const postChannelMessage = async (
  channelRoomId: number,
  payload: PostChannelMessageRequest,
): Promise<PostChannelMessageResponse> => {
  const response = await axiosInstance.post(`/v1/channel-rooms/${channelRoomId}/messages`, payload);
  return response.data;
};

export interface DeleteChannelResponse {
  code: string;
  message: string;
  data: null;
}

export const deleteChannelRoom = async (channelRoomId: number): Promise<DeleteChannelResponse> => {
  const response = await axiosInstance.delete(`/v2/channel-rooms/${channelRoomId}`);
  return response.data;
};
