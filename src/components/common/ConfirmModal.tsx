import { useConfirmModalStore } from '@/stores/modal/useConfirmModalStore';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

export function ConfirmModal() {
  const {
    isOpen,
    title,
    description,
    imageSrc,
    confirmText = '네',
    cancelText = '아니요',
    onConfirm,
    onCancel,
    variant = 'confirm',
    closeModal,
  } = useConfirmModalStore();

  const pathname = usePathname();
  const prevPathnameRef = useRef(pathname);

  useEffect(() => {
    if (isOpen && pathname !== prevPathnameRef.current) {
      closeModal();
    }
    prevPathnameRef.current = pathname;
  }, [pathname, isOpen, closeModal]);

  const isChatIndividualPage = /^\/chat\/individual\/\d+/.test(pathname);

  if (!isOpen || !isChatIndividualPage) return null;

  const isSingleButton = !cancelText;

  const handleCancel = () => {
    onCancel?.();
    closeModal();
  };

  const handleConfirm = () => {
    onConfirm?.();
    closeModal();
  };

  return isOpen ? (
    <div className="pointer-events-none fixed inset-0 z-51 flex items-center justify-center bg-black/40">
      <div className="pointer-events-auto relative w-full max-w-xs space-y-4 rounded-2xl bg-white p-6 text-center">
        {imageSrc && (
          <div className="flex w-full justify-center">
            <Image src={imageSrc} alt="friends Image" width={40} height={40} />
          </div>
        )}
        <h2 className="text-md px-4 font-bold">{title}</h2>
        {description && (
          <p className="text-sm whitespace-pre-line text-[var(--gray-400)]">{description}</p>
        )}

        <div className={`mt-5 flex justify-center gap-6 px-4 pt-2`}>
          <button
            onClick={handleConfirm}
            className={`flex-1 rounded-[10] px-4 py-[2.3] text-sm font-semibold text-white ${
              variant === 'quit' ? 'bg-[var(--pink)]' : 'bg-[#7BA1FF]'
            } ${!isSingleButton ? 'w-full' : ''}`}
          >
            {confirmText}
          </button>

          {!isSingleButton && (
            <button
              onClick={handleCancel}
              className="flex-1 rounded-[10] bg-gray-500 px-4 py-2 text-sm font-semibold text-gray-100"
            >
              {cancelText}
            </button>
          )}
        </div>
      </div>
    </div>
  ) : null;
}
