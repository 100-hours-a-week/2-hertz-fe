'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useNewMessageStore } from '@/stores/modal/useNewMessageStore';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function NewMessageToast() {
  const { hideToast } = useNewMessageStore();
  const toast = useNewMessageStore((state) => state.toast);
  const router = useRouter();
  const pathname = usePathname();
  const currentRoomId = pathname?.startsWith('/chat/individual/')
    ? Number(pathname.split('/')[3]?.split('?')[0])
    : null;

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        hideToast();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (!toast || currentRoomId === toast.channelRoomId) return null;

  const handleClick = () => {
    router.push(`/chat/individual/${toast.channelRoomId}?page=0&size=0`);
    hideToast();
  };

  return (
    <div className="flex w-full">
      <AnimatePresence>
        <motion.div
          key="new-message-toast"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          drag="y"
          dragConstraints={{ top: -80, bottom: 0 }}
          dragElastic={0.2}
          onDragEnd={(event, info) => {
            if (info.offset.y < -50) {
              hideToast();
            }
          }}
          className="fixed top-5 left-1/2 z-[9999] flex w-[100%] max-w-sm -translate-x-1/2 cursor-pointer items-center gap-3 rounded-2xl bg-white p-4 shadow-lg"
          onClick={handleClick}
        >
          <Image
            src={toast.partnerProfileImage}
            alt={toast.partnerNickname}
            width={40}
            height={40}
            className="rounded-full"
          />
          <div className="flex w-full flex-col">
            <div className="flex items-center justify-between px-2">
              <span className="font-semibold">{toast.partnerNickname}</span>
              <span className="text-xs text-gray-400">
                {new Date(toast.messageSendAt).toLocaleTimeString('ko-KR', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })}
              </span>
            </div>
            <span className="line-clamp-2 px-2 text-sm text-gray-600">{toast.message}</span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
