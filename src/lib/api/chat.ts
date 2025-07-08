import axiosInstance from '@/lib/axios';
import axios from 'axios';

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
  messageId?: number;
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
  try {
    const response = await axiosInstance.get(
      `/v1/channel-rooms/${channelRoomId}?page=${page}&size=${size}`,
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const code = error.response?.data?.code;

      if (code === 'ALREADY_EXITED_CHANNEL_ROOM') {
        throw new Error('ALREADY_EXITED_CHANNEL_ROOM');
      }
      if (code === 'USER_DEACTIVATED') {
        throw new Error('USER_DEACTIVATED');
      }
    }
    throw new Error('UNKNOWN_CHANNEL_ROOM_ERROR');
  }
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

export interface PostReportMessagesRequest {
  messageId: number;
  messageContent: string;
  reportedUserId: number;
}

export interface PostReportMessagesResponse {
  code: string;
  message: string;
  data: null;
}

export const postReportMessage = async (
  payload: PostReportMessagesRequest,
): Promise<PostReportMessagesResponse> => {
  const response = await axiosInstance.post(`/v3/reports`, payload);
  return response.data;
};
