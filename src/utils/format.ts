export const formatKoreanDate = (input: string | Date): string => {
  if (!input) return 'Invalid Date';

  let date: Date;

  if (typeof input === 'string') {
    const cleaned = input.replace(/^(.+\.\d{3})\d*$/, '$1');
    date = new Date(cleaned);
  } else if (input instanceof Date) {
    date = input;
  } else {
    console.warn('formatKoreanDate(): Invalid input type →', input);
    return 'Invalid Date';
  }

  if (typeof date.getTime !== 'function' || isNaN(date.getTime())) {
    console.warn('formatKoreanDate(): Failed to parse →', input);
    return 'Invalid Date';
  }

  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
};
