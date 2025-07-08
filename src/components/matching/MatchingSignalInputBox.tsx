'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTuningStore } from '@/stores/matching/useTuningStore';
import { postTuningSignal } from '@/lib/api/matching';
import axios from 'axios';

interface MatchingSignalInputBoxProps {
  onSend?: (message: string) => void;
  placeholder?: string;
  reset?: boolean;
  onResetDone?: () => void;
}

export default function MatchingSignalInputBox({
  onSend,
  placeholder = '상대방에게 첫 시그널 보내기',
  reset,
  onResetDone,
}: MatchingSignalInputBoxProps) {
  const [value, setValue] = useState('');
  const receiverUserId = useTuningStore((state) => state.receiverUserId);
  const router = useRouter();
  const [isSending, setIsSending] = useState(false);
  const searchParams = useSearchParams();
  const rawCategory = searchParams.get('category');
  const category = rawCategory?.toUpperCase() as 'FRIEND' | 'COUPLE';

  useEffect(() => {
    if (reset) {
      setValue('');
      onResetDone?.();
    }
  }, [reset, onResetDone]);

  const handleSend = async () => {
    if (isSending) return;

    const message = value.trim();
    if (!message || !receiverUserId) return;

    try {
      setIsSending(true);
      const res = await postTuningSignal({ receiverUserId, message, category });
      toast.success('시그널을 성공적으로 보냈습니다!');
      setValue('');

      if (res?.data?.channelRoomId) {
        router.push(`/chat/individual/${res.data.channelRoomId}?page=0&size=20`);
      }

      onSend?.(message);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const code = error.response?.data?.code;
        if (code === 'USER_DEACTIVATED') {
          toast.error('상대방이 탈퇴한 사용자입니다.');
        } else if (code === 'ALREADY_IN_CONVERSATION') {
          toast('상대방이 먼저 채팅을 시작했습니다. 채팅방을 확인해주세요!', { icon: '👋🏻' });
        } else {
          toast.error('시그널 전송에 실패했습니다.');
        }
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex w-full items-center justify-between rounded-full bg-[#f2f6fa] px-2 py-1.5">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="ml-2 flex-1 bg-transparent text-xs text-gray-500 outline-none placeholder:text-gray-400"
      />
      <button
        type="button"
        onClick={handleSend}
        className="ml-2 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow"
      >
        <ArrowUp className="h-3.5 w-3.5 text-gray-700" />
      </button>
    </div>
  );
}
