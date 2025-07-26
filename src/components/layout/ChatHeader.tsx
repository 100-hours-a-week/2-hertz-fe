'use client';

import { useRouter } from 'next/navigation';
import { FaAngleLeft, FaAngleDown } from 'react-icons/fa';
import { LuLogOut } from 'react-icons/lu';
import { useWaitingModalStore } from '@/stores/modal/useWaitingModalStore';
import { useMatchingResponseStore } from '@/stores/modal/useMatchingResponseStore';

interface ChatHeaderProps {
  title: string;
  partnerId: number;
  onLeave: () => void;
}

export default function ChatHeader({ title, partnerId, onLeave }: ChatHeaderProps) {
  const router = useRouter();
  const closeModal = useWaitingModalStore((state) => state.closeModal);
  const { temporarilyHideModal } = useMatchingResponseStore();

  const handleNicknameClick = () => {
    router.push(`/profile/${partnerId}`);
  };

  const handleBack = () => {
    closeModal();
    // 현재 채팅방 ID를 URL에서 추출하여 모달 임시 숨김
    const currentPath = window.location.pathname;
    const match = currentPath.match(/\/chat\/individual\/(\d+)/);
    if (match) {
      const channelRoomId = Number(match[1]);
      temporarilyHideModal(channelRoomId);
    }
    router.back();
  };
  return (
    <header className="fixed top-0 left-1/2 z-50 flex h-14 w-full max-w-[430px] -translate-x-1/2 items-center justify-between bg-white px-4">
      <button onClick={handleBack} className="flex w-6 items-center justify-center p-1">
        <FaAngleLeft className="z-[100] text-[clamp(1rem,2vw,1.2rem)]" />
      </button>

      <div
        onClick={handleNicknameClick}
        className="flex max-w-[220px] flex-1 cursor-pointer items-center justify-center gap-2 overflow-hidden text-lg font-bold whitespace-nowrap text-black"
      >
        <span className="overflow-hidden text-ellipsis">{title}</span>
        <FaAngleDown className="ml-1 flex-shrink-0 text-[clamp(1rem,2vw,0.8rem)]" />
      </div>

      <button onClick={onLeave} className="flex w-8 items-center justify-center p-1">
        <LuLogOut className="text-[clamp(1rem,2vw,1.2rem)]" />
      </button>
    </header>
  );
}
