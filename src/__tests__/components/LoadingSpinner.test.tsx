// LoadingSpinner 컴포넌트 테스트
import { render, screen } from '@/__tests__/test-utils';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// react-spinners 모킹
jest.mock('react-spinners', () => ({
  SyncLoader: ({ color, size }: { color: string; size: number }) => (
    <div data-testid="sync-loader" data-color={color} data-size={size}>
      Loading...
    </div>
  ),
}));

describe('LoadingSpinner', () => {
  // 기본 렌더링 테스트
  describe('기본 렌더링', () => {
    it('로딩 스피너가 렌더링되어야 한다', () => {
      render(<LoadingSpinner />);

      const spinner = screen.getByTestId('sync-loader');
      expect(spinner).toBeInTheDocument();
    });

    it('로딩 메시지가 표시되어야 한다', () => {
      render(<LoadingSpinner />);

      const loadingText = screen.getByText('데이터를 불러오는 중이에요');
      expect(loadingText).toBeInTheDocument();
    });

    it('올바른 CSS 클래스가 적용되어야 한다', () => {
      render(<LoadingSpinner />);

      const container = screen.getByTestId('sync-loader').parentElement;
      expect(container).toHaveClass(
        'flex',
        'h-full',
        'w-full',
        'flex-col',
        'items-center',
        'justify-center',
        'gap-8',
        'py-10',
      );
    });
  });

  // SyncLoader 속성 테스트
  describe('SyncLoader 속성', () => {
    it('올바른 색상이 설정되어야 한다', () => {
      render(<LoadingSpinner />);

      const spinner = screen.getByTestId('sync-loader');
      expect(spinner).toHaveAttribute('data-color', 'var(--blue)');
    });

    it('올바른 크기가 설정되어야 한다', () => {
      render(<LoadingSpinner />);

      const spinner = screen.getByTestId('sync-loader');
      expect(spinner).toHaveAttribute('data-size', '8');
    });
  });

  // 접근성 테스트
  describe('접근성', () => {
    it('로딩 상태를 나타내는 텍스트가 있어야 한다', () => {
      render(<LoadingSpinner />);

      const loadingText = screen.getByText('데이터를 불러오는 중이에요');
      expect(loadingText).toBeInTheDocument();
    });

    it('로딩 텍스트가 적절한 스타일을 가져야 한다', () => {
      render(<LoadingSpinner />);

      const loadingText = screen.getByText('데이터를 불러오는 중이에요');
      expect(loadingText).toHaveClass('text-sm');
    });
  });

  // 레이아웃 테스트
  describe('레이아웃', () => {
    it('세로 중앙 정렬되어야 한다', () => {
      render(<LoadingSpinner />);

      const container = screen.getByTestId('sync-loader').parentElement;
      expect(container).toHaveClass('flex-col', 'items-center', 'justify-center');
    });

    it('전체 높이와 너비를 차지해야 한다', () => {
      render(<LoadingSpinner />);

      const container = screen.getByTestId('sync-loader').parentElement;
      expect(container).toHaveClass('h-full', 'w-full');
    });

    it('적절한 패딩이 있어야 한다', () => {
      render(<LoadingSpinner />);

      const container = screen.getByTestId('sync-loader').parentElement;
      expect(container).toHaveClass('py-10');
    });

    it('요소 간 적절한 간격이 있어야 한다', () => {
      render(<LoadingSpinner />);

      const container = screen.getByTestId('sync-loader').parentElement;
      expect(container).toHaveClass('gap-8');
    });
  });

  // 스냅샷 테스트
  describe('스냅샷', () => {
    it('컴포넌트 스냅샷이 일치해야 한다', () => {
      const { container } = render(<LoadingSpinner />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});

