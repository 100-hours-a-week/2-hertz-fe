import axios, { AxiosInstance } from 'axios';
import { cookies } from 'next/headers';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// SSR을 위한 서버사이드 axios 인스턴스
export const createServerAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
  });

  // 쿠키를 포함하기 위한 요청 인터셉터 추가
  instance.interceptors.request.use(
    async (config) => {
      try {
        const cookieStore = await cookies();
        const cookieString = cookieStore.toString();

        if (cookieString) {
          config.headers.Cookie = cookieString;
        }
      } catch {
        // 쿠키 가져오기 실패 - 쿠키 없이 계속 진행
      }

      return config;
    },
    (error) => Promise.reject(error),
  );

  return instance;
};

export default createServerAxiosInstance;
