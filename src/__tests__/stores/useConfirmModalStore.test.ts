// useConfirmModalStore 테스트
import { act, renderHook } from '@testing-library/react';
import { useConfirmModalStore } from '@/stores/modal/useConfirmModalStore';

describe('useConfirmModalStore', () => {
  beforeEach(() => {
    // 스토어 상태 초기화
    useConfirmModalStore.setState({
      isOpen: false,
      isTemporarilyHidden: false,
      hiddenChannelRoomId: null,
      hiddenModalData: null,
      title: null,
      description: undefined,
      imageSrc: undefined,
      confirmText: '네',
      cancelText: '아니요',
      onConfirm: () => {},
      onCancel: () => {},
      variant: 'confirm',
    });
  });

  describe('초기 상태', () => {
    it('초기 상태가 올바르게 설정되어야 한다', () => {
      const { result } = renderHook(() => useConfirmModalStore());

      expect(result.current.isOpen).toBe(false);
      expect(result.current.isTemporarilyHidden).toBe(false);
      expect(result.current.hiddenChannelRoomId).toBeNull();
      expect(result.current.hiddenModalData).toBeNull();
      expect(result.current.title).toBeNull();
      expect(result.current.description).toBeUndefined();
      expect(result.current.imageSrc).toBeUndefined();
      expect(result.current.confirmText).toBe('네');
      expect(result.current.cancelText).toBe('아니요');
      expect(typeof result.current.onConfirm).toBe('function');
      expect(typeof result.current.onCancel).toBe('function');
      expect(result.current.variant).toBe('confirm');
    });
  });

  describe('openModal', () => {
    it('모달을 열 수 있어야 한다', () => {
      const { result } = renderHook(() => useConfirmModalStore());
      const mockOnConfirm = jest.fn();
      const mockOnCancel = jest.fn();

      act(() => {
        result.current.openModal({
          title: '테스트 제목',
          description: '테스트 설명',
          imageSrc: 'test.jpg',
          confirmText: '확인',
          cancelText: '취소',
          onConfirm: mockOnConfirm,
          onCancel: mockOnCancel,
          variant: 'quit',
        });
      });

      expect(result.current.isOpen).toBe(true);
      expect(result.current.isTemporarilyHidden).toBe(false);
      expect(result.current.title).toBe('테스트 제목');
      expect(result.current.description).toBe('테스트 설명');
      expect(result.current.imageSrc).toBe('test.jpg');
      expect(result.current.confirmText).toBe('확인');
      expect(result.current.cancelText).toBe('취소');
      expect(result.current.onConfirm).toBe(mockOnConfirm);
      expect(result.current.onCancel).toBe(mockOnCancel);
      expect(result.current.variant).toBe('quit');
    });

    it('최소한의 props로 모달을 열 수 있어야 한다', () => {
      const { result } = renderHook(() => useConfirmModalStore());
      const mockOnConfirm = jest.fn();

      act(() => {
        result.current.openModal({
          title: '테스트 제목',
          confirmText: '확인',
          onConfirm: mockOnConfirm,
        });
      });

      expect(result.current.isOpen).toBe(true);
      expect(result.current.title).toBe('테스트 제목');
      expect(result.current.confirmText).toBe('확인');
      expect(result.current.onConfirm).toBe(mockOnConfirm);
      expect(result.current.description).toBeUndefined();
      expect(result.current.imageSrc).toBeUndefined();
      expect(result.current.cancelText).toBe('아니요');
      expect(result.current.variant).toBe('confirm');
    });
  });

  describe('closeModal', () => {
    it('모달을 닫을 수 있어야 한다', () => {
      const { result } = renderHook(() => useConfirmModalStore());
      const mockOnConfirm = jest.fn();

      // 모달 열기
      act(() => {
        result.current.openModal({
          title: '테스트 제목',
          confirmText: '확인',
          onConfirm: mockOnConfirm,
        });
      });

      expect(result.current.isOpen).toBe(true);

      // 모달 닫기
      act(() => {
        result.current.closeModal();
      });

      expect(result.current.isOpen).toBe(false);
      expect(result.current.isTemporarilyHidden).toBe(false);
      expect(result.current.hiddenChannelRoomId).toBeNull();
      expect(result.current.hiddenModalData).toBeNull();
      expect(result.current.title).toBeNull();
      expect(result.current.description).toBeUndefined();
      expect(result.current.imageSrc).toBeUndefined();
      expect(result.current.confirmText).toBe('네');
      expect(result.current.cancelText).toBe('아니요');
      expect(result.current.variant).toBe('confirm');
    });

    it('이미 닫힌 모달을 닫아도 에러가 발생하지 않아야 한다', () => {
      const { result } = renderHook(() => useConfirmModalStore());

      expect(() => {
        act(() => {
          result.current.closeModal();
        });
      }).not.toThrow();

      expect(result.current.isOpen).toBe(false);
    });
  });

  describe('temporarilyHideModal', () => {
    it('열린 모달을 임시로 숨길 수 있어야 한다', () => {
      const { result } = renderHook(() => useConfirmModalStore());
      const mockOnConfirm = jest.fn();
      const mockOnCancel = jest.fn();

      // 모달 열기
      act(() => {
        result.current.openModal({
          title: '테스트 제목',
          description: '테스트 설명',
          confirmText: '확인',
          cancelText: '취소',
          onConfirm: mockOnConfirm,
          onCancel: mockOnCancel,
          variant: 'quit',
        });
      });

      // 모달 임시 숨기기
      act(() => {
        result.current.temporarilyHideModal(123);
      });

      expect(result.current.isOpen).toBe(false);
      expect(result.current.isTemporarilyHidden).toBe(true);
      expect(result.current.hiddenChannelRoomId).toBe(123);
      expect(result.current.hiddenModalData).toEqual({
        title: '테스트 제목',
        description: '테스트 설명',
        confirmText: '확인',
        cancelText: '취소',
        onConfirm: mockOnConfirm,
        onCancel: mockOnCancel,
        variant: 'quit',
      });
    });

    it('닫힌 모달을 임시로 숨기려고 하면 아무것도 하지 않아야 한다', () => {
      const { result } = renderHook(() => useConfirmModalStore());

      act(() => {
        result.current.temporarilyHideModal(123);
      });

      expect(result.current.isOpen).toBe(false);
      expect(result.current.isTemporarilyHidden).toBe(false);
      expect(result.current.hiddenChannelRoomId).toBeNull();
      expect(result.current.hiddenModalData).toBeNull();
    });
  });

  describe('restoreModal', () => {
    it('임시로 숨겨진 모달을 복원할 수 있어야 한다', () => {
      const { result } = renderHook(() => useConfirmModalStore());
      const mockOnConfirm = jest.fn();
      const mockOnCancel = jest.fn();

      // 모달 열기
      act(() => {
        result.current.openModal({
          title: '테스트 제목',
          description: '테스트 설명',
          confirmText: '확인',
          cancelText: '취소',
          onConfirm: mockOnConfirm,
          onCancel: mockOnCancel,
          variant: 'quit',
        });
      });

      // 모달 임시 숨기기
      act(() => {
        result.current.temporarilyHideModal(123);
      });

      // 모달 복원
      act(() => {
        result.current.restoreModal(123);
      });

      expect(result.current.isOpen).toBe(true);
      expect(result.current.isTemporarilyHidden).toBe(false);
      expect(result.current.hiddenChannelRoomId).toBeNull();
      expect(result.current.hiddenModalData).toBeNull();
      expect(result.current.title).toBe('테스트 제목');
      expect(result.current.description).toBe('테스트 설명');
      expect(result.current.confirmText).toBe('확인');
      expect(result.current.cancelText).toBe('취소');
      expect(result.current.onConfirm).toBe(mockOnConfirm);
      expect(result.current.onCancel).toBe(mockOnCancel);
      expect(result.current.variant).toBe('quit');
    });

    it('잘못된 채널 ID로 복원하려고 하면 아무것도 하지 않아야 한다', () => {
      const { result } = renderHook(() => useConfirmModalStore());
      const mockOnConfirm = jest.fn();

      // 모달 열기
      act(() => {
        result.current.openModal({
          title: '테스트 제목',
          confirmText: '확인',
          onConfirm: mockOnConfirm,
        });
      });

      // 모달 임시 숨기기
      act(() => {
        result.current.temporarilyHideModal(123);
      });

      // 잘못된 채널 ID로 복원 시도
      act(() => {
        result.current.restoreModal(456);
      });

      expect(result.current.isOpen).toBe(false);
      expect(result.current.isTemporarilyHidden).toBe(true);
      expect(result.current.hiddenChannelRoomId).toBe(123);
    });

    it('임시로 숨겨지지 않은 모달을 복원하려고 하면 아무것도 하지 않아야 한다', () => {
      const { result } = renderHook(() => useConfirmModalStore());

      act(() => {
        result.current.restoreModal(123);
      });

      expect(result.current.isOpen).toBe(false);
      expect(result.current.isTemporarilyHidden).toBe(false);
    });
  });

  describe('콜백 함수 동작', () => {
    it('onConfirm 콜백이 호출되어야 한다', () => {
      const { result } = renderHook(() => useConfirmModalStore());
      const mockOnConfirm = jest.fn();

      act(() => {
        result.current.openModal({
          title: '테스트 제목',
          confirmText: '확인',
          onConfirm: mockOnConfirm,
        });
      });

      act(() => {
        result.current.onConfirm();
      });

      expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });

    it('onCancel 콜백이 호출되어야 한다', () => {
      const { result } = renderHook(() => useConfirmModalStore());
      const mockOnCancel = jest.fn();

      act(() => {
        result.current.openModal({
          title: '테스트 제목',
          confirmText: '확인',
          onConfirm: jest.fn(),
          onCancel: mockOnCancel,
        });
      });

      act(() => {
        result.current.onCancel?.();
      });

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    describe('variant 타입', () => {
      it('quit variant를 설정할 수 있어야 한다', () => {
        const { result } = renderHook(() => useConfirmModalStore());

        act(() => {
          result.current.openModal({
            title: '테스트 제목',
            confirmText: '확인',
            onConfirm: jest.fn(),
            variant: 'quit',
          });
        });

        expect(result.current.variant).toBe('quit');
      });

      it('confirm variant를 설정할 수 있어야 한다', () => {
        const { result } = renderHook(() => useConfirmModalStore());

        act(() => {
          result.current.openModal({
            title: '테스트 제목',
            confirmText: '확인',
            onConfirm: jest.fn(),
            variant: 'confirm',
          });
        });

        expect(result.current.variant).toBe('confirm');
      });
    });
  });
});
