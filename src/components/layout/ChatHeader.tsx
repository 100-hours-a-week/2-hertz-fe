'use client';

import { useRouter } from 'next/navigation';
import { FaAngleLeft, FaAngleDown } from 'react-icons/fa6';
import { LuLogOut } from 'react-icons/lu';

interface ChatHeaderProps {
  title: string;
  partnerId: number;
  onLeave: () => void;
  onToggleDetail?: () => void;
}

export default function ChatHeader({ title, partnerId, onLeave, onToggleDetail }: ChatHeaderProps) {
  const router = useRouter();

  const handleNicknameClick = () => {
    router.push(`/profile/${partnerId}`);
  };

  return (
    <header className="fixed top-0 left-1/2 z-50 flex h-14 w-full max-w-[430px] -translate-x-1/2 items-center justify-between bg-white px-4">
      <button onClick={() => router.back()} className="flex w-6 items-center justify-center p-1">
        <FaAngleLeft className="text-[clamp(1rem,2vw,1.2rem)]" />
      </button>

      <div
        onClick={onToggleDetail}
        className="flex max-w-[220px] flex-1 cursor-pointer items-center justify-center gap-2 overflow-hidden text-lg font-bold whitespace-nowrap text-black"
      >
        <span onClick={handleNicknameClick} className="overflow-hidden text-ellipsis">
          {title}
        </span>
        {/* <FaAngleDown className="ml-1 flex-shrink-0 text-[clamp(1rem,2vw,0.8rem)]" /> */}
      </div>

      <button onClick={onLeave} className="flex w-8 items-center justify-center p-1">
        <LuLogOut className="text-[clamp(1rem,2vw,1.2rem)]" />
      </button>
    </header>
  );
}
