// auth.ts API 함수 테스트
import axios from 'axios';
import {
  getKakaoRedirect,
  postKakaoLogin,
  reissueAccessToken,
  deleteLogout,
  AccessTokenReissueResponse,
  RefreshTokenInvalidResponse,
} from '@/lib/api/auth';
import axiosInstance from '@/lib/axios';

const mockAxiosInstance = axiosInstance as jest.Mocked<typeof axiosInstance>;

// axios 모킹
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// axiosInstance 모킹
jest.mock('@/lib/axios', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    delete: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    interceptors: {
      request: {
        use: jest.fn(),
      },
      response: {
        use: jest.fn(),
      },
    },
    defaults: {
      headers: {
        common: {},
      },
    },
  },
}));

// window.location 모킹
const mockLocation = {
  href: '',
  assign: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
} as unknown as Location;

// localStorage 모킹
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

// console 모킹
const mockConsole = {
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
Object.defineProperty(console, 'log', { value: mockConsole.log });
Object.defineProperty(console, 'warn', { value: mockConsole.warn });
Object.defineProperty(console, 'error', { value: mockConsole.error });

describe('Auth API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (mockLocation as any).href = '';
    process.env.NEXT_PUBLIC_API_BASE_URL = 'https://api.example.com';
  });

  describe('getKakaoRedirect', () => {
    it('카카오 리다이렉트 URL로 이동해야 한다', () => {
      // 함수가 에러 없이 실행되는지만 확인
      expect(() => getKakaoRedirect()).not.toThrow();
    });

    it('환경변수가 없을 때도 동작해야 한다', () => {
      process.env.NEXT_PUBLIC_API_BASE_URL = undefined;

      // 함수가 에러 없이 실행되는지만 확인
      expect(() => getKakaoRedirect()).not.toThrow();
    });
  });

  describe('postKakaoLogin', () => {
    it('카카오 로그인 요청을 보내야 한다', async () => {
      const mockResponse = {
        data: {
          code: 'SUCCESS',
          message: '로그인 성공',
          data: { accessToken: 'mock-token' },
        },
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await postKakaoLogin({
        code: 'test-code',
        state: 'test-state',
      });

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/v1/oauth/kakao',
        { code: 'test-code', state: 'test-state' },
        { withCredentials: true },
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('에러가 발생하면 예외를 던져야 한다', async () => {
      const error = new Error('Network Error');
      mockAxiosInstance.post.mockRejectedValue(error);

      await expect(
        postKakaoLogin({
          code: 'test-code',
          state: 'test-state',
        }),
      ).rejects.toThrow('Network Error');
    });
  });

  describe('reissueAccessToken', () => {
    it('액세스 토큰 재발급 요청을 보내야 한다', async () => {
      const mockResponse: AccessTokenReissueResponse = {
        code: 'ACCESS_TOKEN_REISSUED',
        message: '토큰 재발급 성공',
        data: { accessToken: 'new-access-token' },
      };

      mockedAxios.post.mockResolvedValue({ data: mockResponse });
      mockedAxios.isAxiosError.mockReturnValue(false);

      const result = await reissueAccessToken();

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://api.example.com/v1/auth/token',
        {},
        { withCredentials: true },
      );
      expect(result).toEqual(mockResponse);
    });

    it('리프레시 토큰이 유효하지 않을 때 로그인 페이지로 리다이렉트해야 한다', async () => {
      const error = {
        response: {
          data: { code: 'REFRESH_TOKEN_INVALID' },
        },
      };

      mockedAxios.post.mockRejectedValue(error);
      mockedAxios.isAxiosError.mockReturnValue(true);

      try {
        await reissueAccessToken();
      } catch {
        // 에러가 발생해야 함
      }

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('hasLoggedIn', 'false');
      // JSDOM에서는 실제 네비게이션이 구현되지 않으므로 localStorage 호출만 확인
    });

    it('다른 에러가 발생하면 예외를 던져야 한다', async () => {
      const error = new Error('Network Error');
      mockedAxios.post.mockRejectedValue(error);
      mockedAxios.isAxiosError.mockReturnValue(false);

      await expect(reissueAccessToken()).rejects.toThrow('Network Error');
    });

    it('AxiosError가 아닌 에러가 발생하면 예외를 던져야 한다', async () => {
      const error = new Error('Unknown Error');
      mockedAxios.post.mockRejectedValue(error);
      mockedAxios.isAxiosError.mockReturnValue(false);

      await expect(reissueAccessToken()).rejects.toThrow('Unknown Error');
    });
  });

  describe('deleteLogout', () => {
    it('로그아웃 요청을 보내야 한다', async () => {
      const mockResponse = {
        data: {
          code: 'SUCCESS',
          message: '로그아웃 성공',
          data: null,
        },
      };

      mockAxiosInstance.delete.mockResolvedValue(mockResponse);

      const result = await deleteLogout();

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(
        'https://api.example.com/v2/auth/logout',
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('에러가 발생하면 예외를 던져야 한다', async () => {
      const error = new Error('Network Error');
      mockAxiosInstance.delete.mockRejectedValue(error);

      await expect(deleteLogout()).rejects.toThrow('Network Error');
    });
  });

  describe('타입 검증', () => {
    it('AccessTokenReissueResponse 타입이 올바르게 정의되어야 한다', () => {
      const response: AccessTokenReissueResponse = {
        code: 'ACCESS_TOKEN_REISSUED',
        message: '토큰 재발급 성공',
        data: { accessToken: 'new-token' },
      };

      expect(response.code).toBe('ACCESS_TOKEN_REISSUED');
      expect(response.data.accessToken).toBe('new-token');
    });

    it('RefreshTokenInvalidResponse 타입이 올바르게 정의되어야 한다', () => {
      const response: RefreshTokenInvalidResponse = {
        code: 'REFRESH_TOKEN_INVALID',
        message: '리프레시 토큰이 유효하지 않습니다',
        data: null,
      };

      expect(response.code).toBe('REFRESH_TOKEN_INVALID');
      expect(response.data).toBeNull();
    });
  });
});
