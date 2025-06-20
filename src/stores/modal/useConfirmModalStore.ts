import { create } from 'zustand';
export const noop = () => {};

interface ConfirmModalState {
  isOpen: boolean;
  title: React.ReactNode;
  description?: React.ReactNode;
  imageSrc?: string;
  confirmText: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  variant?: 'quit' | 'confirm'; // quit: 로그아웃, 탈퇴 / confirm: 채널 나가기, 매칭 동의
  openModal: (props: Omit<ConfirmModalState, 'isOpen' | 'openModal' | 'closeModal'>) => void;
  closeModal: () => void;
}

export const useConfirmModalStore = create<ConfirmModalState>((set) => ({
  isOpen: false,
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
      ...props,
    }),
  closeModal: () =>
    set({
      isOpen: false,
      title: null,
      description: undefined,
      imageSrc: undefined,
      confirmText: '네',
      cancelText: '아니요',
      variant: 'confirm',
      onConfirm: noop,
      onCancel: noop,
    }),
}));
