import { ChannelRoom } from './chat';
import axiosInstance from '@lib/axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface TuningKeywords {
  mbti: string;
  religion: string;
  smoking: string;
  drinking: string;
}

export interface TuningSameInterests {
  personality: string[];
  preferredPeople: string[];
  currentInterests: string[];
  favoriteFoods: string[];
  likedSports: string[];
  pets: string[];
  selfDevelopment: string[];
  hobbies: string[];
}

export interface TuningNormalInterests {
  personality: string[];
  preferredPeople: string[];
  currentInterests: string[];
  favoriteFoods: string[];
  likedSports: string[];
  pets: string[];
  selfDevelopment: string[];
  hobbies: string[];
}

export interface TuningUser {
  userId: number;
  profileImage: string;
  nickname: string;
  gender: string;
  oneLineIntroduction: string;
  keywords: TuningKeywords;
  sameInterests: TuningSameInterests;
}

export interface GetTuningUserResponse {
  code: 'TUNING_SUCCESS';
  message: string;
  data: TuningUser;
}

export const getTuningUser = async (
  category: 'friend' | 'couple',
): Promise<GetTuningUserResponse> => {
  const response = await axiosInstance.get<GetTuningUserResponse>(
    `${BASE_URL}/v3/tuning?category=${category}`,
  );
  return response.data;
};

export interface TuningSignalRequest {
  receiverUserId: number;
  message: string;
}

export interface TuningSignalResponse {
  code: string;
  message: string;
  data: { channelRoomId: number };
}

export const postTuningSignal = async (
  payload: TuningSignalRequest,
): Promise<TuningSignalResponse> => {
  const response = await axiosInstance.post(`${BASE_URL}/v1/tuning/signal`, payload);
  return response.data;
};

export interface MatchingRequest {
  channelRoomId: number;
}

export interface MatchingResponse {
  code: string;
  message: string;
  data: null;
}

// 수락 API
export const postMatchingAccept = async (payload: MatchingRequest): Promise<MatchingResponse> => {
  const response = await axiosInstance.post(`${BASE_URL}/v2/matching/acceptances`, payload);
  return response.data;
};

// 거절 API
export const postMatchingReject = async (payload: MatchingRequest): Promise<MatchingResponse> => {
  const response = await axiosInstance.post(`${BASE_URL}/v2/matching/rejections`, payload);
  return response.data;
};
