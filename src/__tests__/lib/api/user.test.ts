// user.ts API 함수 테스트
import {
  getUserInfo,
  patchUserIntroduction,
  postWebpushSubscribe,
  GetUserInfoResponse,
  PatchUserIntroductionRequest,
  PatchUserIntroductionResponse,
} from '@/lib/api/user';
import axiosInstance from '@/lib/axios';

const mockAxiosInstance = axiosInstance as jest.Mocked<typeof axiosInstance>;

// axiosInstance 모킹
jest.mock('@/lib/axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    patch: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
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

describe('User API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // 환경변수 모킹
    process.env.NEXT_PUBLIC_API_BASE_URL = 'https://api.example.com';
    // axios 인스턴스의 baseURL도 모킹
    mockAxiosInstance.defaults = {
      baseURL: 'https://api.example.com',
      headers: {
        common: {},
        delete: {},
        get: {},
        head: {},
        post: {},
        put: {},
        patch: {},
      },
    } as any;
  });

  describe('getUserInfo', () => {
    it('사용자 정보를 가져와야 한다', async () => {
      const mockResponse: GetUserInfoResponse = {
        code: 'SUCCESS',
        message: '사용자 정보 조회 성공',
        data: {
          profileImage: 'https://example.com/profile.jpg',
          nickname: '테스트유저',
          gender: '남성',
          oneLineIntroduction: '안녕하세요!',
          relationType: 'ME',
          keywords: {
            mbti: 'ENFP',
            religion: '무교',
            smoking: '비흡연',
            drinking: '가끔 음주',
          },
          sameInterests: {
            personality: ['CUTE', 'RELIABLE'],
            preferredPeople: ['CUTE', 'RELIABLE'],
            currentInterests: ['MOVIES', 'MUSIC'],
            favoriteFoods: ['KOREAN', 'JAPANESE'],
            likedSports: ['RUNNING', 'GYM'],
            pets: ['DOG', 'CAT'],
            selfDevelopment: ['READING', 'STUDYING'],
            hobbies: ['GAMING', 'MUSIC'],
          },
          interests: {
            personality: ['CUTE', 'RELIABLE'],
            preferredPeople: ['CUTE', 'RELIABLE'],
            currentInterests: ['MOVIES', 'MUSIC'],
            favoriteFoods: ['KOREAN', 'JAPANESE'],
            likedSports: ['RUNNING', 'GYM'],
            pets: ['DOG', 'CAT'],
            selfDevelopment: ['READING', 'STUDYING'],
            hobbies: ['GAMING', 'MUSIC'],
          },
          friendAllowed: true,
          coupleAllowed: true,
        },
      };

      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      const result = await getUserInfo('user123');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        'https://api.example.com/v3/users/user123',
      );
      expect(result).toEqual(mockResponse);
    });

    it('에러가 발생하면 예외를 던져야 한다', async () => {
      const error = new Error('Network Error');
      mockAxiosInstance.get.mockRejectedValue(error);

      await expect(getUserInfo('user123')).rejects.toThrow('Network Error');
    });

    it('빈 userId로 요청하면 에러가 발생해야 한다', async () => {
      await expect(getUserInfo('')).rejects.toThrow();
    });
  });

  describe('patchUserIntroduction', () => {
    it('사용자 한줄소개를 수정해야 한다', async () => {
      const mockResponse: PatchUserIntroductionResponse = {
        code: 'SUCCESS',
        message: '한줄소개 수정 성공',
        data: null,
      };

      mockAxiosInstance.patch.mockResolvedValue({ data: mockResponse });

      const result = await patchUserIntroduction('user123', '새로운 한줄소개입니다');

      expect(mockAxiosInstance.patch).toHaveBeenCalledWith(
        'https://api.example.com/v3/users/user123',
        { oneLineIntroduction: '새로운 한줄소개입니다' },
      );
      expect(result).toEqual(mockResponse);
    });

    it('빈 내용으로 수정할 수 있어야 한다', async () => {
      const mockResponse: PatchUserIntroductionResponse = {
        code: 'SUCCESS',
        message: '한줄소개 수정 성공',
        data: null,
      };

      mockAxiosInstance.patch.mockResolvedValue({ data: mockResponse });

      const result = await patchUserIntroduction('user123', '');

      expect(mockAxiosInstance.patch).toHaveBeenCalledWith(
        'https://api.example.com/v3/users/user123',
        { oneLineIntroduction: '' },
      );
      expect(result).toEqual(mockResponse);
    });

    it('에러가 발생하면 예외를 던져야 한다', async () => {
      const error = new Error('Network Error');
      mockAxiosInstance.patch.mockRejectedValue(error);

      await expect(patchUserIntroduction('user123', '새로운 소개')).rejects.toThrow(
        'Network Error',
      );
    });

    it('빈 userId로 요청하면 에러가 발생해야 한다', async () => {
      await expect(patchUserIntroduction('', '새로운 소개')).rejects.toThrow();
    });
  });

  describe('postWebpushSubscribe', () => {
    it('웹푸시 구독 요청을 보내야 한다', async () => {
      const mockResponse = {
        code: 'SUCCESS',
        message: '웹푸시 구독 성공',
        data: null,
      };

      mockAxiosInstance.post.mockResolvedValue({ data: mockResponse });

      const result = await postWebpushSubscribe('fcm-token-123');

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('https://api.example.com/push/token', {
        token: 'fcm-token-123',
      });
      expect(result).toEqual(mockResponse);
    });

    it('빈 토큰으로 요청할 수 있어야 한다', async () => {
      const mockResponse = {
        code: 'SUCCESS',
        message: '웹푸시 구독 성공',
        data: null,
      };

      mockAxiosInstance.post.mockResolvedValue({ data: mockResponse });

      const result = await postWebpushSubscribe('');

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('https://api.example.com/push/token', {
        token: '',
      });
      expect(result).toEqual(mockResponse);
    });

    it('에러가 발생하면 예외를 던져야 한다', async () => {
      const error = new Error('Network Error');
      mockAxiosInstance.post.mockRejectedValue(error);

      await expect(postWebpushSubscribe('fcm-token-123')).rejects.toThrow('Network Error');
    });
  });

  describe('타입 검증', () => {
    it('GetUserInfoResponse 타입이 올바르게 정의되어야 한다', () => {
      const response: GetUserInfoResponse = {
        code: 'SUCCESS',
        message: '성공',
        data: {
          profileImage: 'image.jpg',
          nickname: '닉네임',
          gender: '남성',
          oneLineIntroduction: '소개',
          relationType: 'ME',
          keywords: {
            mbti: 'ENFP',
            religion: '무교',
            smoking: '비흡연',
            drinking: '가끔 음주',
          },
          sameInterests: {
            personality: [],
            preferredPeople: [],
            currentInterests: [],
            favoriteFoods: [],
            likedSports: [],
            pets: [],
            selfDevelopment: [],
            hobbies: [],
          },
          interests: {
            personality: [],
            preferredPeople: [],
            currentInterests: [],
            favoriteFoods: [],
            likedSports: [],
            pets: [],
            selfDevelopment: [],
            hobbies: [],
          },
          friendAllowed: true,
          coupleAllowed: true,
        },
      };

      expect(response.data.gender).toMatch(/남성|여성/);
      expect(response.data.relationType).toMatch(/ME|SIGNAL|MATCHING/);
      expect(typeof response.data.friendAllowed).toBe('boolean');
      expect(typeof response.data.coupleAllowed).toBe('boolean');
    });

    it('PatchUserIntroductionRequest 타입이 올바르게 정의되어야 한다', () => {
      const request: PatchUserIntroductionRequest = {
        oneLineIntroduction: '새로운 소개',
      };

      expect(typeof request.oneLineIntroduction).toBe('string');
    });

    it('PatchUserIntroductionResponse 타입이 올바르게 정의되어야 한다', () => {
      const response: PatchUserIntroductionResponse = {
        code: 'SUCCESS',
        message: '성공',
        data: null,
      };

      expect(typeof response.code).toBe('string');
      expect(typeof response.message).toBe('string');
      expect(response.data).toBeNull();
    });
  });

  describe('경계값 테스트', () => {
    it('매우 긴 한줄소개를 처리해야 한다', async () => {
      const longIntroduction = 'a'.repeat(1000);
      const mockResponse: PatchUserIntroductionResponse = {
        code: 'SUCCESS',
        message: '한줄소개 수정 성공',
        data: null,
      };

      mockAxiosInstance.patch.mockResolvedValue({ data: mockResponse });

      const result = await patchUserIntroduction('user123', longIntroduction);

      expect(mockAxiosInstance.patch).toHaveBeenCalledWith(
        'https://api.example.com/v3/users/user123',
        { oneLineIntroduction: longIntroduction },
      );
      expect(result).toEqual(mockResponse);
    });

    it('특수 문자가 포함된 한줄소개를 처리해야 한다', async () => {
      const specialIntroduction = '안녕하세요! @#$%^&*()_+{}|:"<>?[]\\;\',./';
      const mockResponse: PatchUserIntroductionResponse = {
        code: 'SUCCESS',
        message: '한줄소개 수정 성공',
        data: null,
      };

      mockAxiosInstance.patch.mockResolvedValue({ data: mockResponse });

      const result = await patchUserIntroduction('user123', specialIntroduction);

      expect(mockAxiosInstance.patch).toHaveBeenCalledWith(
        'https://api.example.com/v3/users/user123',
        { oneLineIntroduction: specialIntroduction },
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
