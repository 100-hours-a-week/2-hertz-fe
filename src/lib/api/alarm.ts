import { ChannelRoom } from './chat';
import axiosInstance from '../axios';

export interface AlarmList {
  type: 'NOTICE' | 'REPORT' | 'MATCHING' | 'ALERT';
  title: string;
  content?: string;
  channelRoomId?: number;
  createdDate: string;
  lastPageNumber?: number;
}

export interface getAlarmListResponse {
  code: string;
  message: string;
  data: {
    list: AlarmList[];
    pageNumber: number;
    pageSize: number;
    isLast: boolean;
  };
}

export const getAlarmList = async (page = 0, size = 10): Promise<getAlarmListResponse> => {
  const response = await axiosInstance.get(`/v2/alarms?page=${page}&size=${size}`);
  return response.data;
};
