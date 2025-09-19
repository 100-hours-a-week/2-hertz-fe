// 테스트 유틸리티 함수들
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// next/themes 모킹은 jest.setup.js에서 처리

// 테스트용 QueryClient 생성
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient;
}

const customRender = (
  ui: ReactElement,
  { queryClient = createTestQueryClient(), ...renderOptions }: CustomRenderOptions = {},
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// 테스트용 모킹 헬퍼
export const mockLocalStorage = () => {
  const store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach((key) => delete store[key]);
    }),
  };
};

// API 모킹 헬퍼
export const mockApiResponse = <T,>(data: T, status = 200) => ({
  data,
  status,
  statusText: 'OK',
  headers: {},
  config: {},
});

// 에러 응답 모킹 헬퍼
export const mockApiError = (message: string, status = 500) => {
  const error = new Error(message);
  // @ts-expect-error
  error.response = {
    data: { message },
    status,
    statusText: 'Internal Server Error',
    headers: {},
    config: {},
  };
  return error;
};

// 비동기 함수 테스트 헬퍼
export const waitForAsync = () => new Promise((resolve) => setTimeout(resolve, 0));

export const defaultTestProps = {
  'data-testid': 'test-component',
};

// re-export everything
export * from '@testing-library/react';
export { customRender as render };

describe('test-utils', () => {
  it('should export custom render function', () => {
    expect(typeof customRender).toBe('function');
  });
});
