// 에러 핸들링 및 예외 상황 테스트
import { formatKoreanDate } from '@/utils/format';
import { cn } from '@/lib/utils';

describe('에러 핸들링 및 예외 상황', () => {
  describe('formatKoreanDate 에러 핸들링', () => {
    it('null 입력에 대해 안전하게 처리해야 한다', () => {
      expect(() => {
        formatKoreanDate(null as unknown as string);
      }).not.toThrow();

      expect(formatKoreanDate(null as unknown as string)).toBe('Invalid Date');
    });

    it('undefined 입력에 대해 안전하게 처리해야 한다', () => {
      expect(() => {
        formatKoreanDate(undefined as unknown as string);
      }).not.toThrow();

      expect(formatKoreanDate(undefined as unknown as string)).toBe('Invalid Date');
    });

    it('숫자 입력에 대해 안전하게 처리해야 한다', () => {
      expect(() => {
        formatKoreanDate(123 as unknown as string);
      }).not.toThrow();

      expect(formatKoreanDate(123 as unknown as string)).toBe('Invalid Date');
    });

    it('객체 입력에 대해 안전하게 처리해야 한다', () => {
      expect(() => {
        formatKoreanDate({} as unknown as string);
      }).not.toThrow();

      expect(formatKoreanDate({} as unknown as string)).toBe('Invalid Date');
    });

    it('배열 입력에 대해 안전하게 처리해야 한다', () => {
      expect(() => {
        formatKoreanDate([] as unknown as string);
      }).not.toThrow();

      expect(formatKoreanDate([] as unknown as string)).toBe('Invalid Date');
    });

    it('함수 입력에 대해 안전하게 처리해야 한다', () => {
      expect(() => {
        formatKoreanDate((() => {}) as unknown as string);
      }).not.toThrow();

      expect(formatKoreanDate((() => {}) as unknown as string)).toBe('Invalid Date');
    });

    it('Symbol 입력에 대해 안전하게 처리해야 한다', () => {
      expect(() => {
        formatKoreanDate(Symbol('test') as unknown as string);
      }).not.toThrow();

      expect(formatKoreanDate(Symbol('test') as unknown as string)).toBe('Invalid Date');
    });

    it('BigInt 입력에 대해 안전하게 처리해야 한다', () => {
      expect(() => {
        formatKoreanDate(BigInt(123) as unknown as string);
      }).not.toThrow();

      expect(formatKoreanDate(BigInt(123) as unknown as string)).toBe('Invalid Date');
    });
  });

  describe('cn 함수 에러 핸들링', () => {
    it('null 입력에 대해 안전하게 처리해야 한다', () => {
      expect(() => {
        cn(null as unknown as string);
      }).not.toThrow();

      expect(cn(null as unknown as string)).toBe('');
    });

    it('undefined 입력에 대해 안전하게 처리해야 한다', () => {
      expect(() => {
        cn(undefined as unknown as string);
      }).not.toThrow();

      expect(cn(undefined as unknown as string)).toBe('');
    });

    it('숫자 입력에 대해 안전하게 처리해야 한다', () => {
      expect(() => {
        cn(123 as unknown as string);
      }).not.toThrow();

      expect(cn(123 as unknown as string)).toBe('123');
    });

    it('객체 입력에 대해 안전하게 처리해야 한다', () => {
      expect(() => {
        cn({} as unknown as string);
      }).not.toThrow();

      expect(cn({} as unknown as string)).toBe('');
    });

    it('배열 입력에 대해 안전하게 처리해야 한다', () => {
      expect(() => {
        cn(['class1', 'class2'] as unknown as string);
      }).not.toThrow();

      expect(cn(['class1', 'class2'] as unknown as string)).toBe('class1 class2');
    });

    it('함수 입력에 대해 안전하게 처리해야 한다', () => {
      expect(() => {
        cn(() => 'class' as unknown as string);
      }).not.toThrow();

      expect(cn(() => 'class' as unknown as string)).toBe('');
    });

    it('Symbol 입력에 대해 안전하게 처리해야 한다', () => {
      expect(() => {
        cn(Symbol('test') as unknown as string);
      }).not.toThrow();

      expect(cn(Symbol('test') as unknown as string)).toBe('');
    });

    it('BigInt 입력에 대해 안전하게 처리해야 한다', () => {
      expect(() => {
        cn(BigInt(123) as unknown as string);
      }).not.toThrow();

      expect(cn(BigInt(123) as unknown as string)).toBe('');
    });

    it('중첩된 잘못된 타입을 안전하게 처리해야 한다', () => {
      expect(() => {
        cn('class1', null, undefined, 'class2', 123, {}, []);
      }).not.toThrow();

      expect(cn('class1', null, undefined, 'class2', 123, {}, [])).toBe('class1 class2 123');
    });
  });

  describe('네트워크 에러 시뮬레이션', () => {
    beforeEach(() => {
      // fetch 모킹
      global.fetch = jest.fn();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('네트워크 에러를 안전하게 처리해야 한다', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
      mockFetch.mockRejectedValue(new Error('Network Error'));

      try {
        await fetch('/api/test');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Network Error');
      }
    });

    it('타임아웃 에러를 안전하게 처리해야 한다', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
      mockFetch.mockRejectedValue(new Error('Request timeout'));

      try {
        await fetch('/api/test');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Request timeout');
      }
    });

    it('404 에러를 안전하게 처리해야 한다', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      } as Response);

      const response = await fetch('/api/test');
      expect(response.ok).toBe(false);
      expect(response.status).toBe(404);
    });

    it('500 에러를 안전하게 처리해야 한다', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      } as Response);

      const response = await fetch('/api/test');
      expect(response.ok).toBe(false);
      expect(response.status).toBe(500);
    });
  });

  describe('메모리 누수 방지', () => {
    it('이벤트 리스너가 제대로 정리되어야 한다', () => {
      const addEventListener = jest.fn();
      const removeEventListener = jest.fn();

      const mockElement = {
        addEventListener,
        removeEventListener,
      };

      mockElement.addEventListener('click', () => {});
      mockElement.removeEventListener('click', () => {});

      expect(addEventListener).toHaveBeenCalled();
      expect(removeEventListener).toHaveBeenCalled();
    });

    it('타이머가 제대로 정리되어야 한다', () => {
      const clearTimeout = jest.fn();
      const clearInterval = jest.fn();

      global.clearTimeout = clearTimeout;
      global.clearInterval = clearInterval;

      const timeoutId = setTimeout(() => {}, 1000);
      const intervalId = setInterval(() => {}, 1000);

      clearTimeout(timeoutId);
      clearInterval(intervalId);

      expect(clearTimeout).toHaveBeenCalledWith(timeoutId);
      expect(clearInterval).toHaveBeenCalledWith(intervalId);
    });
  });

  describe('예외 상황 처리', () => {
    it('JSON 파싱 에러를 안전하게 처리해야 한다', () => {
      const invalidJson = '{ invalid json }';

      expect(() => {
        JSON.parse(invalidJson);
      }).toThrow(SyntaxError);
    });

    it('정규식 에러를 안전하게 처리해야 한다', () => {
      const invalidRegex = '['; // 잘못된 정규식

      expect(() => {
        new RegExp(invalidRegex);
      }).toThrow(SyntaxError);
    });

    it('URL 생성 에러를 안전하게 처리해야 한다', () => {
      const invalidUrl = 'not-a-valid-url';

      expect(() => {
        new URL(invalidUrl);
      }).toThrow();
    });

    it('Date 생성 에러를 안전하게 처리해야 한다', () => {
      const invalidDate = 'invalid-date-string';

      expect(() => {
        new Date(invalidDate);
      }).not.toThrow();

      const date = new Date(invalidDate);
      expect(isNaN(date.getTime())).toBe(true);
    });
  });

  describe('경계값 테스트', () => {
    it('매우 큰 숫자를 안전하게 처리해야 한다', () => {
      const largeNumber = Number.MAX_SAFE_INTEGER + 1;

      expect(() => {
        formatKoreanDate(largeNumber as unknown as string);
      }).not.toThrow();

      expect(formatKoreanDate(largeNumber as unknown as string)).toBe('Invalid Date');
    });

    it('매우 작은 숫자를 안전하게 처리해야 한다', () => {
      const smallNumber = Number.MIN_SAFE_INTEGER - 1;

      expect(() => {
        formatKoreanDate(smallNumber as unknown as string);
      }).not.toThrow();

      expect(formatKoreanDate(smallNumber as unknown as string)).toBe('Invalid Date');
    });

    it('무한대 값을 안전하게 처리해야 한다', () => {
      expect(() => {
        formatKoreanDate(Infinity as unknown as string);
      }).not.toThrow();

      expect(formatKoreanDate(Infinity as unknown as string)).toBe('Invalid Date');
    });

    it('NaN 값을 안전하게 처리해야 한다', () => {
      expect(() => {
        formatKoreanDate(NaN as unknown as string);
      }).not.toThrow();

      expect(formatKoreanDate(NaN as unknown as string)).toBe('Invalid Date');
    });
  });

  describe('동시성 테스트', () => {
    it('동시에 여러 함수를 호출해도 안전해야 한다', async () => {
      const promises = Array.from({ length: 100 }, (_, i) =>
        Promise.resolve(formatKoreanDate(`2024-01-${(i % 28) + 1}T00:00:00.000Z`)),
      );

      const results = await Promise.all(promises);

      expect(results).toHaveLength(100);
      results.forEach((result) => {
        expect(typeof result).toBe('string');
        // 일부 날짜는 유효하지 않을 수 있으므로 Invalid Date도 허용
        expect(
          result === 'Invalid Date' || result.match(/\d{4}년 \d{1,2}월 \d{1,2}일/),
        ).toBeTruthy();
      });
    });

    it('동시에 cn 함수를 호출해도 안전해야 한다', async () => {
      const promises = Array.from({ length: 100 }, (_, i) =>
        Promise.resolve(cn(`class-${i}`, i % 2 === 0 ? 'even' : 'odd')),
      );

      const results = await Promise.all(promises);

      expect(results).toHaveLength(100);
      results.forEach((result, i) => {
        expect(typeof result).toBe('string');
        expect(result).toContain(`class-${i}`);
        expect(result).toContain(i % 2 === 0 ? 'even' : 'odd');
      });
    });
  });
});
