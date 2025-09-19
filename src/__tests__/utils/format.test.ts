// format.ts 유틸리티 함수 테스트
import { formatKoreanDate } from '@/utils/format';

describe('formatKoreanDate', () => {
  // 유효한 날짜 문자열 테스트
  describe('유효한 날짜 문자열 처리', () => {
    it('ISO 8601 형식의 날짜 문자열을 한국어 형식으로 변환해야 한다', () => {
      const isoDate = '2024-01-15T10:30:00.000Z';
      const result = formatKoreanDate(isoDate);

      expect(result).toMatch(/2024년 1월 15일/);
      expect(result).toMatch(/월요일|화요일|수요일|목요일|금요일|토요일|일요일/);
    });

    it('밀리초가 포함된 날짜 문자열을 올바르게 처리해야 한다', () => {
      const dateWithMs = '2024-01-15T10:30:00.123Z';
      const result = formatKoreanDate(dateWithMs);

      expect(result).toMatch(/2024년 1월 15일/);
      expect(result).not.toBe('Invalid Date');
    });

    it('밀리초가 3자리를 초과하는 경우 올바르게 처리해야 한다', () => {
      const dateWithLongMs = '2024-01-15T10:30:00.123456Z';
      const result = formatKoreanDate(dateWithLongMs);

      expect(result).toMatch(/2024년 1월 15일/);
      expect(result).not.toBe('Invalid Date');
    });
  });

  // 유효한 Date 객체 테스트
  describe('유효한 Date 객체 처리', () => {
    it('Date 객체를 한국어 형식으로 변환해야 한다', () => {
      const date = new Date('2024-01-15T10:30:00.000Z');
      const result = formatKoreanDate(date);

      expect(result).toMatch(/2024년 1월 15일/);
      expect(result).toMatch(/월요일|화요일|수요일|목요일|금요일|토요일|일요일/);
    });

    it('현재 날짜를 한국어 형식으로 변환해야 한다', () => {
      const now = new Date();
      const result = formatKoreanDate(now);

      expect(result).toMatch(/\d{4}년 \d{1,2}월 \d{1,2}일/);
      expect(result).toMatch(/월요일|화요일|수요일|목요일|금요일|토요일|일요일/);
    });
  });

  // 잘못된 입력 처리 테스트
  describe('잘못된 입력 처리', () => {
    it('빈 문자열을 처리해야 한다', () => {
      const result = formatKoreanDate('');
      expect(result).toBe('Invalid Date');
    });

    it('null을 처리해야 한다', () => {
      const result = formatKoreanDate(null as unknown as string);
      expect(result).toBe('Invalid Date');
    });

    it('undefined를 처리해야 한다', () => {
      const result = formatKoreanDate(undefined as unknown as string);
      expect(result).toBe('Invalid Date');
    });

    it('잘못된 날짜 문자열을 처리해야 한다', () => {
      const invalidDate = 'invalid-date-string';
      const result = formatKoreanDate(invalidDate);
      expect(result).toBe('Invalid Date');
    });

    it('잘못된 형식의 날짜 문자열을 처리해야 한다', () => {
      const invalidFormat = '15/01/2024';
      const result = formatKoreanDate(invalidFormat);
      expect(result).toBe('Invalid Date');
    });

    it('숫자를 처리해야 한다', () => {
      const result = formatKoreanDate(123 as unknown as string);
      expect(result).toBe('Invalid Date');
    });

    it('객체를 처리해야 한다', () => {
      const result = formatKoreanDate({} as unknown as string);
      expect(result).toBe('Invalid Date');
    });
  });

  // 경계값 테스트
  describe('경계값 테스트', () => {
    it('1900년 이전 날짜를 처리해야 한다', () => {
      const oldDate = '1899-12-31T00:00:00.000Z';
      const result = formatKoreanDate(oldDate);

      expect(result).toMatch(/1899년 12월 31일/);
      expect(result).not.toBe('Invalid Date');
    });

    it('2100년 이후 날짜를 처리해야 한다', () => {
      const futureDate = '2100-01-01T00:00:00.000Z';
      const result = formatKoreanDate(futureDate);

      expect(result).toMatch(/2100년 1월 1일/);
      expect(result).not.toBe('Invalid Date');
    });

    it('윤년 2월 29일을 처리해야 한다', () => {
      const leapYear = '2024-02-29T00:00:00.000Z';
      const result = formatKoreanDate(leapYear);

      expect(result).toMatch(/2024년 2월 29일/);
      expect(result).not.toBe('Invalid Date');
    });
  });

  // 출력 형식 테스트
  describe('출력 형식 검증', () => {
    it('한국어 형식으로 출력되어야 한다', () => {
      const date = new Date('2024-01-15T10:30:00.000Z');
      const result = formatKoreanDate(date);

      // 년도, 월, 일이 한국어로 표시되는지 확인
      expect(result).toMatch(/\d{4}년/);
      expect(result).toMatch(/\d{1,2}월/);
      expect(result).toMatch(/\d{1,2}일/);
    });

    it('요일이 한국어로 표시되어야 한다', () => {
      const date = new Date('2024-01-15T10:30:00.000Z');
      const result = formatKoreanDate(date);

      const koreanWeekdays = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];
      const hasKoreanWeekday = koreanWeekdays.some((weekday) => result.includes(weekday));
      expect(hasKoreanWeekday).toBe(true);
    });
  });
});
