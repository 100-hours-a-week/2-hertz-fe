import { create } from 'zustand';
export const noop = () => {};

interface ConfirmModalState {
  isOpen: boolean;
  isTemporarilyHidden: boolean;
  hiddenChannelRoomId: number | null;
  hiddenModalData: Omit<
    ConfirmModalState,
    | 'isOpen'
    | 'isTemporarilyHidden'
    | 'hiddenChannelRoomId'
    | 'hiddenModalData'
    | 'openModal'
    | 'closeModal'
    | 'temporarilyHideModal'
    | 'restoreModal'
  > | null;
  title: React.ReactNode;
  description?: React.ReactNode;
  imageSrc?: string;
  confirmText: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  variant?: 'quit' | 'confirm'; // quit: 로그아웃, 탈퇴 / confirm: 채널 나가기, 매칭 동의
  openModal: (
    props: Omit<
      ConfirmModalState,
      | 'isOpen'
      | 'isTemporarilyHidden'
      | 'hiddenChannelRoomId'
      | 'hiddenModalData'
      | 'openModal'
      | 'closeModal'
      | 'temporarilyHideModal'
      | 'restoreModal'
    >,
  ) => void;
  closeModal: () => void;
  temporarilyHideModal: (channelRoomId: number) => void;
  restoreModal: (channelRoomId: number) => void;
}

export const useConfirmModalStore = create<ConfirmModalState>((set, get) => ({
  isOpen: false,
  isTemporarilyHidden: false,
  hiddenChannelRoomId: null,
  hiddenModalData: null,
  title: null,
  description: undefined,
  imageSrc: undefined,
  confirmText: '네',
  cancelText: '아니요',
  onConfirm: noop,
  onCancel: noop,
  variant: 'confirm',
  openModal: (props) =>
    set({
      isOpen: true,
      isTemporarilyHidden: false,
      ...props,
    }),
  closeModal: () =>
    set({
      isOpen: false,
      isTemporarilyHidden: false,
      hiddenChannelRoomId: null,
      hiddenModalData: null,
      title: null,
      description: undefined,
      imageSrc: undefined,
      confirmText: '네',
      cancelText: '아니요',
      variant: 'confirm',
      onConfirm: noop,
      onCancel: noop,
    }),
  temporarilyHideModal: (channelRoomId) => {
    const state = get();
    if (state.isOpen) {
      set({
        isOpen: false,
        isTemporarilyHidden: true,
        hiddenChannelRoomId: channelRoomId,
        hiddenModalData: {
          title: state.title,
          description: state.description,
          imageSrc: state.imageSrc,
          confirmText: state.confirmText,
          cancelText: state.cancelText,
          onConfirm: state.onConfirm,
          onCancel: state.onCancel,
          variant: state.variant,
        },
      });
    }
  },
  restoreModal: (channelRoomId) => {
    const state = get();
    if (
      state.isTemporarilyHidden &&
      state.hiddenChannelRoomId === channelRoomId &&
      state.hiddenModalData
    ) {
      set({
        isOpen: true,
        isTemporarilyHidden: false,
        hiddenChannelRoomId: null,
        ...state.hiddenModalData,
        hiddenModalData: null,
      });
    }
  },
}));
