// lib/utils.ts 유틸리티 함수 테스트
import { cn } from '@/lib/utils';

describe('cn (className utility)', () => {
  // 기본 기능 테스트
  describe('기본 기능', () => {
    it('단일 클래스명을 반환해야 한다', () => {
      const result = cn('text-red-500');
      expect(result).toBe('text-red-500');
    });

    it('여러 클래스명을 공백으로 구분하여 반환해야 한다', () => {
      const result = cn('text-red-500', 'font-bold', 'p-4');
      expect(result).toBe('text-red-500 font-bold p-4');
    });

    it('빈 문자열을 처리해야 한다', () => {
      const result = cn('');
      expect(result).toBe('');
    });

    it('인수가 없을 때 빈 문자열을 반환해야 한다', () => {
      const result = cn();
      expect(result).toBe('');
    });
  });

  // 조건부 클래스 테스트
  describe('조건부 클래스', () => {
    it('조건이 true일 때 클래스를 포함해야 한다', () => {
      const isActive = true;
      const result = cn('base-class', isActive && 'active-class');
      expect(result).toBe('base-class active-class');
    });

    it('조건이 false일 때 클래스를 제외해야 한다', () => {
      const isActive = false;
      const result = cn('base-class', isActive && 'active-class');
      expect(result).toBe('base-class');
    });

    it('여러 조건부 클래스를 처리해야 한다', () => {
      const isActive = true;
      const isDisabled = false;
      const result = cn('base-class', isActive && 'active-class', isDisabled && 'disabled-class');
      expect(result).toBe('base-class active-class');
    });
  });

  // 객체 형태 클래스 테스트
  describe('객체 형태 클래스', () => {
    it('객체의 true 값만 클래스로 포함해야 한다', () => {
      const result = cn({
        'text-red-500': true,
        'font-bold': false,
        'p-4': true,
        hidden: false,
      });
      expect(result).toBe('text-red-500 p-4');
    });

    it('모든 값이 false인 객체를 처리해야 한다', () => {
      const result = cn({
        'text-red-500': false,
        'font-bold': false,
      });
      expect(result).toBe('');
    });

    it('모든 값이 true인 객체를 처리해야 한다', () => {
      const result = cn({
        'text-red-500': true,
        'font-bold': true,
      });
      expect(result).toBe('text-red-500 font-bold');
    });
  });

  // 배열 형태 클래스 테스트
  describe('배열 형태 클래스', () => {
    it('배열의 유효한 클래스들을 처리해야 한다', () => {
      const result = cn(['text-red-500', 'font-bold', null, undefined, 'p-4']);
      expect(result).toBe('text-red-500 font-bold p-4');
    });

    it('빈 배열을 처리해야 한다', () => {
      const result = cn([]);
      expect(result).toBe('');
    });

    it('중첩 배열을 처리해야 한다', () => {
      const result = cn(['base-class', ['nested-class', 'another-class']]);
      expect(result).toBe('base-class nested-class another-class');
    });
  });

  // 복합 타입 테스트
  describe('복합 타입', () => {
    it('문자열, 객체, 배열을 혼합하여 처리해야 한다', () => {
      const result = cn('base-class', { 'conditional-class': true, 'hidden-class': false }, [
        'array-class-1',
        'array-class-2',
      ]);
      expect(result).toBe('base-class conditional-class array-class-1 array-class-2');
    });

    it('복잡한 조건부 로직을 처리해야 한다', () => {
      const isActive = true;
      const isDisabled = false;
      const theme = 'dark';

      const result = cn(
        'base-class',
        isActive && 'active-class',
        isDisabled && 'disabled-class',
        {
          'dark-theme': theme === 'dark',
          'light-theme': (theme as string) === 'light',
        },
        ['utility-class-1', 'utility-class-2'],
      );
      expect(result).toBe('base-class active-class dark-theme utility-class-1 utility-class-2');
    });

    it('라이트 테마 조건부 로직을 처리해야 한다', () => {
      const isActive = true;
      const isDisabled = false;
      const theme = 'light';

      const result = cn(
        'base-class',
        isActive && 'active-class',
        isDisabled && 'disabled-class',
        {
          'dark-theme': (theme as string) === 'dark',
          'light-theme': theme === 'light',
        },
        ['utility-class-1', 'utility-class-2'],
      );
      expect(result).toBe('base-class active-class light-theme utility-class-1 utility-class-2');
    });
  });

  // Tailwind CSS 충돌 해결 테스트
  describe('Tailwind CSS 충돌 해결', () => {
    it('중복되는 Tailwind 클래스를 올바르게 해결해야 한다', () => {
      const result = cn('p-4 p-2', 'text-red-500 text-blue-500');
      expect(result).toContain('p-2');
      expect(result).toContain('text-blue-500');
      expect(result).not.toContain('p-4');
      expect(result).not.toContain('text-red-500');
    });

    it('동일한 속성의 다른 값들을 처리해야 한다', () => {
      const result = cn('text-sm text-lg', 'font-normal font-bold');
      expect(result).toContain('text-lg');
      expect(result).toContain('font-bold');
    });
  });

  // null/undefined 처리 테스트
  describe('null/undefined 처리', () => {
    it('null 값을 무시해야 한다', () => {
      const result = cn('base-class', null, 'other-class');
      expect(result).toBe('base-class other-class');
    });

    it('undefined 값을 무시해야 한다', () => {
      const result = cn('base-class', undefined, 'other-class');
      expect(result).toBe('base-class other-class');
    });

    it('null과 undefined가 혼합된 경우를 처리해야 한다', () => {
      const result = cn(null, 'base-class', undefined, 'other-class', null);
      expect(result).toBe('base-class other-class');
    });
  });

  // 성능 테스트
  describe('성능', () => {
    it('많은 수의 클래스를 효율적으로 처리해야 한다', () => {
      const manyClasses = Array.from({ length: 100 }, (_, i) => `class-${i}`);
      const result = cn(...manyClasses);

      expect(result).toContain('class-0');
      expect(result).toContain('class-99');
      expect(result.split(' ')).toHaveLength(100);
    });
  });
});
