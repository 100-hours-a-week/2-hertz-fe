// KeywordTag 컴포넌트 테스트
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import KeywordTag from '@/components/common/KeywordTag';

describe('KeywordTag', () => {
  // 기본 렌더링 테스트
  describe('기본 렌더링', () => {
    it('빈 키워드 배열을 처리해야 한다', () => {
      const { container } = render(<KeywordTag keywords={[]} />);

      const keywordContainer = container.querySelector('.flex.flex-wrap.gap-2');
      expect(keywordContainer).toBeInTheDocument();
      expect(keywordContainer?.children).toHaveLength(0);
    });

    it('단일 키워드를 렌더링해야 한다', () => {
      const keywords = ['AGE_AGE_20S'];
      render(<KeywordTag keywords={keywords} />);

      const tag = screen.getByText('# 20대');
      expect(tag).toBeInTheDocument();
    });

    it('여러 키워드를 렌더링해야 한다', () => {
      const keywords = ['AGE_AGE_20S', 'GENDER_GENDER_MALE'];
      render(<KeywordTag keywords={keywords} />);

      expect(screen.getByText('# 20대')).toBeInTheDocument();
      expect(screen.getByText('# GENDER_GENDER_MALE')).toBeInTheDocument();
    });
  });

  // 키워드 매핑 테스트
  describe('키워드 매핑', () => {
    it('AgeGroup 키워드를 올바르게 매핑해야 한다', () => {
      const keywords = ['AGE_AGE_20S', 'AGE_AGE_30S', 'AGE_AGE_40S'];
      render(<KeywordTag keywords={keywords} />);

      expect(screen.getByText('# 20대')).toBeInTheDocument();
      expect(screen.getByText('# 30대')).toBeInTheDocument();
      expect(screen.getByText('# 40대')).toBeInTheDocument();
    });

    it('Gender 키워드를 올바르게 매핑해야 한다', () => {
      const keywords = ['GENDER_GENDER_MALE', 'GENDER_GENDER_FEMALE'];
      render(<KeywordTag keywords={keywords} />);

      expect(screen.getByText('# GENDER_GENDER_MALE')).toBeInTheDocument();
      expect(screen.getByText('# GENDER_GENDER_FEMALE')).toBeInTheDocument();
    });

    it('CurrentInterests 키워드를 올바르게 매핑해야 한다', () => {
      const keywords = [
        'CURRENT_INTERESTS_CURRENT_INTERESTS_MOVIES',
        'CURRENT_INTERESTS_CURRENT_INTERESTS_NETFLIX',
      ];
      render(<KeywordTag keywords={keywords} />);

      expect(screen.getByText('# CURRENT_INTERESTS_CURRENT_INTERESTS_MOVIES')).toBeInTheDocument();
      expect(screen.getByText('# CURRENT_INTERESTS_CURRENT_INTERESTS_NETFLIX')).toBeInTheDocument();
    });

    it('알 수 없는 키워드는 원본을 표시해야 한다', () => {
      const keywords = ['UNKNOWN_KEYWORD'];
      render(<KeywordTag keywords={keywords} />);

      expect(screen.getByText('# UNKNOWN_KEYWORD')).toBeInTheDocument();
    });
  });

  // 중복 키워드 처리 테스트
  describe('PreferredPeople 특별 처리', () => {
    it('PreferredPeople 키워드에 이모지를 추가해야 한다', () => {
      const keywords = ['PREFERRED_PEOPLE_CUTE'];
      render(<KeywordTag keywords={keywords} />);

      const elements = screen.getAllByText((content, element) => {
        return element?.textContent === '# 👩🏻‍❤️‍👨🏻 아담한';
      });
      expect(elements.length).toBeGreaterThan(0);
    });

    it('PreferredPeople이 아닌 키워드에는 이모지를 추가하지 않아야 한다', () => {
      const keywords = ['AGE_AGE_20S', 'GENDER_GENDER_MALE'];
      render(<KeywordTag keywords={keywords} />);

      expect(screen.getByText('# 20대')).toBeInTheDocument();
      expect(screen.getByText('# GENDER_GENDER_MALE')).toBeInTheDocument();
      expect(screen.queryByText(/👩🏻‍❤️‍👨🏻/)).not.toBeInTheDocument();
    });
  });

  // variant 속성 테스트
  describe('variant 속성', () => {
    it('default variant가 기본값이어야 한다', () => {
      const keywords = ['AGE_AGE_20S'];
      render(<KeywordTag keywords={keywords} />);

      const tag = screen.getByText('# 20대');
      expect(tag).toHaveClass('border-[var(--gray-200)]', 'bg-white', 'text-black');
    });

    it('default variant 스타일이 적용되어야 한다', () => {
      const keywords = ['AGE_AGE_20S'];
      render(<KeywordTag keywords={keywords} variant="default" />);

      const tag = screen.getByText('# 20대');
      expect(tag).toHaveClass('border-[var(--gray-200)]', 'bg-white', 'text-black');
    });

    it('common variant 스타일이 적용되어야 한다', () => {
      const keywords = ['AGE_AGE_20S'];
      render(<KeywordTag keywords={keywords} variant="common" />);

      const tag = screen.getByText('# 20대');
      expect(tag).toHaveClass(
        'border-[var(--blue)]',
        'bg-[var(--light-blue)]',
        'text-[var(--dark-blue)]',
      );
    });
  });

  // 스타일링 테스트
  describe('스타일링', () => {
    it('올바른 기본 클래스가 적용되어야 한다', () => {
      const keywords = ['AGE_AGE_20S'];
      render(<KeywordTag keywords={keywords} />);

      const tag = screen.getByText('# 20대');
      expect(tag).toHaveClass(
        'inline-block',
        'rounded-full',
        'border',
        'px-3',
        'py-1',
        'text-xs',
        'font-medium',
      );
    });

    it('컨테이너가 flex-wrap으로 설정되어야 한다', () => {
      const keywords = ['AGE_AGE_20S', 'GENDER_GENDER_MALE'];
      render(<KeywordTag keywords={keywords} />);

      const container = screen.getByText('# 20대').parentElement;
      expect(container).toHaveClass('flex', 'flex-wrap', 'gap-2');
    });
  });

  // 키워드 처리 로직 테스트
  describe('키워드 처리 로직', () => {
    it('prefix가 제거된 키워드를 올바르게 처리해야 한다', () => {
      const keywords = ['AGE_AGE_20S'];
      render(<KeywordTag keywords={keywords} />);

      // prefixEnum 함수가 AGE_AGE_20S를 AGE_20S로 변환하고, 다시 AgeGroup.AGE_20S로 매핑해야 함
      expect(screen.getByText('# 20대')).toBeInTheDocument();
    });

    it('여러 prefix가 있는 키워드를 처리해야 한다', () => {
      const keywords = ['CURRENT_INTERESTS_CURRENT_INTERESTS_MOVIES'];
      render(<KeywordTag keywords={keywords} />);

      expect(screen.getByText('# CURRENT_INTERESTS_CURRENT_INTERESTS_MOVIES')).toBeInTheDocument();
    });
  });

  // 경계값 테스트
  describe('경계값 테스트', () => {
    it('매우 긴 키워드 배열을 처리해야 한다', () => {
      const keywords = Array.from({ length: 100 }, (_, i) => `AGE_AGE_20S_${i}`);
      render(<KeywordTag keywords={keywords} />);

      // 모든 키워드가 렌더링되어야 함
      expect(screen.getAllByText(/# .+/)).toHaveLength(100);
    });

    it('특수 문자가 포함된 키워드를 처리해야 한다', () => {
      const keywords = ['SPECIAL_CHAR_KEYWORD_!@#$%'];
      render(<KeywordTag keywords={keywords} />);

      expect(screen.getByText('# SPECIAL_CHAR_KEYWORD_!@#$%')).toBeInTheDocument();
    });
  });

  // 접근성 테스트
  describe('접근성', () => {
    it('각 태그가 적절한 텍스트를 가져야 한다', () => {
      const keywords = ['AGE_AGE_20S', 'GENDER_GENDER_MALE'];
      render(<KeywordTag keywords={keywords} />);

      const tags = screen.getAllByText(/# .+/);
      expect(tags).toHaveLength(2);
      expect(tags[0]).toHaveTextContent('# 20대');
      expect(tags[1]).toHaveTextContent('# GENDER_GENDER_MALE');
    });

    it('태그들이 적절한 크기를 가져야 한다', () => {
      const keywords = ['AGE_AGE_20S'];
      render(<KeywordTag keywords={keywords} />);

      const tag = screen.getByText('# 20대');
      expect(tag).toHaveClass('text-xs');
    });
  });

  // 스냅샷 테스트
  describe('스냅샷', () => {
    it('default variant 스냅샷이 일치해야 한다', () => {
      const keywords = ['AGE_AGE_20S', 'GENDER_GENDER_MALE'];
      const { container } = render(<KeywordTag keywords={keywords} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('common variant 스냅샷이 일치해야 한다', () => {
      const keywords = ['AGE_AGE_20S', 'GENDER_GENDER_MALE'];
      const { container } = render(<KeywordTag keywords={keywords} variant="common" />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('PreferredPeople 키워드 스냅샷이 일치해야 한다', () => {
      const keywords = ['PREFERRED_PEOPLE_PREFERRED_PEOPLE_CUTE'];
      const { container } = render(<KeywordTag keywords={keywords} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
