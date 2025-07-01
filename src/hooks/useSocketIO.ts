'use client';

import { useEffect, useRef } from 'react';
import type {
  MarkAsRead,
  ReceiveMessage,
  SendMessage,
  WebSocketIncomingMessage,
} from '@/types/WebSocketType';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const io = require('socket.io-client');
interface UseSocketIOProps {
  channelRoomId: number;
  onMessage: (data: WebSocketIncomingMessage) => void;
}

export const useSocketIO = ({ channelRoomId, onMessage }: UseSocketIOProps) => {
  const socketRef = useRef<ReturnType<typeof io> | null>(null);

  useEffect(() => {
    const socket = io('https://dev.hertz-tuning.com', {
      transports: ['websocket'],
      withCredentials: true,
      path: '/ws',
      forceNew: true,
      upgrade: false,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ Socket.IO 연결');
    });

    socket.on('disconnect', () => {
      console.log('🔌 Socket.IO 종료');
    });

    socket.on('connect_error', (err: Error) => {
      console.error('❌ 연결 실패:', err);
    });

    socket.on('init_user', (data: number) => {
      onMessage({ event: 'init_user', data });
    });

    socket.on('receive_message', (data: ReceiveMessage) => {
      onMessage({ event: 'receive_message', data });
    });

    return () => {
      socket.disconnect();
      socket.off();
    };
  }, [channelRoomId, onMessage]);

  const sendSocketMessage = (payload: SendMessage) => {
    socketRef.current?.emit('send_message', payload);

    if (!socketRef.current?.connected) {
      console.warn('❌ 소켓이 연결되지 않았습니다!');
      return;
    }
  };

  const sendMarkAsRead = (payload: MarkAsRead) => {
    socketRef.current?.emit('mark_as_read', payload);
  };

  return {
    socketRef,
    sendSocketMessage,
    sendMarkAsRead,
  };
};
