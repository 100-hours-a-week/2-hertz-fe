import axiosInstance from '@lib/axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface ReportReactions {
  CELEBRATE: number;
  THUMBS_UP: number;
  LAUGH: number;
  EYES: number;
  HEART: number;
}

export interface MyReportReactions {
  CELEBRATE: boolean;
  THUMBS_UP: boolean;
  LAUGH: boolean;
  EYES: boolean;
  HEART: boolean;
}

export interface TuningReport {
  createdDate: string;
  reportId: number;
  title: string;
  content: string;
  reactions: ReportReactions;
  myReactions: MyReportReactions;
}

export interface GetTuningReportsResponse {
  code: 'REPORT_LIST_FETCH_SUCCESS' | 'NO_REPORTS';
  message: string;
  data: {
    list: TuningReport[];
    pageNumber: number;
    pageSize: number;
    isLast: boolean;
  } | null;
}

export const getTuningReports = async (
  page = 0,
  size = 10,
  sort: 'LATEST' | 'POPULAR' = 'LATEST',
): Promise<GetTuningReportsResponse> => {
  const response = await axiosInstance.get<GetTuningReportsResponse>(
    `${BASE_URL}/v2/reports?page=${page}&size=${size}&sort=${sort}`,
  );
  return response.data;
};

export interface ToggleReactionResponse {
  code: 'REACTION_ADDED' | 'REACTION_REMOVED' | 'DELETED_REPORT';
  message: string;
  data: {
    reportId: number;
    reactionType: keyof MyReportReactions;
    isReacted: boolean;
    reactionCount: number;
  } | null;
}

export type ReactionType = keyof ReportReactions;

export const toggleTuningReportReaction = async (
  reportId: number,
  reactionType: ReactionType,
): Promise<ToggleReactionResponse> => {
  const response = await axiosInstance.put<ToggleReactionResponse>(
    `${BASE_URL}/v2/reports/${reportId}/reactions`,
    { reactionType },
  );
  return response.data;
};
