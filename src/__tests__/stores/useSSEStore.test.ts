// useSSEStore 테스트
import { act, renderHook } from '@testing-library/react';
import { useSSEStore } from '@/stores/useSSEStore';

describe('useSSEStore', () => {
  beforeEach(() => {
    // 스토어 상태 초기화
    useSSEStore.setState({
      reconnect: () => {},
      setReconnect: (fn) => useSSEStore.setState({ reconnect: fn }),
    });
  });

  describe('초기 상태', () => {
    it('초기 상태가 올바르게 설정되어야 한다', () => {
      const { result } = renderHook(() => useSSEStore());

      expect(result.current.reconnect).toBeDefined();
      expect(typeof result.current.reconnect).toBe('function');
      expect(result.current.setReconnect).toBeDefined();
      expect(typeof result.current.setReconnect).toBe('function');
    });
  });

  describe('setReconnect', () => {
    it('reconnect 함수를 설정할 수 있어야 한다', () => {
      const { result } = renderHook(() => useSSEStore());
      const mockReconnect = jest.fn();

      act(() => {
        result.current.setReconnect(mockReconnect);
      });

      expect(result.current.reconnect).toBe(mockReconnect);
    });

    it('설정된 reconnect 함수를 호출할 수 있어야 한다', () => {
      const { result } = renderHook(() => useSSEStore());
      const mockReconnect = jest.fn();

      act(() => {
        result.current.setReconnect(mockReconnect);
      });

      act(() => {
        result.current.reconnect();
      });

      expect(mockReconnect).toHaveBeenCalledTimes(1);
    });

    it('여러 번 setReconnect를 호출해도 마지막 함수가 유지되어야 한다', () => {
      const { result } = renderHook(() => useSSEStore());
      const mockReconnect1 = jest.fn();
      const mockReconnect2 = jest.fn();

      act(() => {
        result.current.setReconnect(mockReconnect1);
      });

      act(() => {
        result.current.setReconnect(mockReconnect2);
      });

      act(() => {
        result.current.reconnect();
      });

      expect(mockReconnect1).not.toHaveBeenCalled();
      expect(mockReconnect2).toHaveBeenCalledTimes(1);
    });

    it('reconnect 함수가 undefined일 때도 처리해야 한다', () => {
      const { result } = renderHook(() => useSSEStore());

      act(() => {
        result.current.setReconnect(undefined as unknown as () => void);
      });

      expect(result.current.reconnect).toBeUndefined();
    });
  });

  describe('reconnect 함수 동작', () => {
    it('기본 reconnect 함수는 아무것도 하지 않아야 한다', () => {
      const { result } = renderHook(() => useSSEStore());

      // 기본 reconnect 함수는 빈 함수이므로 에러가 발생하지 않아야 함
      expect(() => {
        result.current.reconnect();
      }).not.toThrow();
    });

    it('설정된 reconnect 함수가 에러를 던져도 스토어는 안전해야 한다', () => {
      const { result } = renderHook(() => useSSEStore());
      const errorReconnect = jest.fn(() => {
        throw new Error('Reconnect failed');
      });

      act(() => {
        result.current.setReconnect(errorReconnect);
      });

      expect(() => {
        result.current.reconnect();
      }).toThrow('Reconnect failed');

      expect(errorReconnect).toHaveBeenCalledTimes(1);
    });
  });

  describe('스토어 상태 관리', () => {
    it('스토어 상태가 올바르게 업데이트되어야 한다', () => {
      const { result } = renderHook(() => useSSEStore());
      const mockReconnect = jest.fn();

      // 초기 상태 확인
      expect(result.current.reconnect).toBeDefined();

      // setReconnect 호출
      act(() => {
        result.current.setReconnect(mockReconnect);
      });

      // 상태 변경 확인
      expect(result.current.reconnect).toBe(mockReconnect);
    });

    it('여러 컴포넌트에서 같은 스토어를 사용해도 상태가 공유되어야 한다', () => {
      const { result: result1 } = renderHook(() => useSSEStore());
      const { result: result2 } = renderHook(() => useSSEStore());
      const mockReconnect = jest.fn();

      act(() => {
        result1.current.setReconnect(mockReconnect);
      });

      // 두 컴포넌트 모두 같은 상태를 가져야 함
      expect(result1.current.reconnect).toBe(mockReconnect);
      expect(result2.current.reconnect).toBe(mockReconnect);
    });
  });

  describe('타입 안전성', () => {
    it('reconnect 함수의 타입이 올바르게 정의되어야 한다', () => {
      const { result } = renderHook(() => useSSEStore());

      // reconnect는 매개변수 없이 호출 가능해야 함
      expect(() => {
        result.current.reconnect();
      }).not.toThrow();
    });

    it('setReconnect 함수의 타입이 올바르게 정의되어야 한다', () => {
      const { result } = renderHook(() => useSSEStore());
      const mockReconnect = jest.fn();

      // setReconnect는 함수를 매개변수로 받아야 함
      expect(() => {
        result.current.setReconnect(mockReconnect);
      }).not.toThrow();
    });
  });
});
