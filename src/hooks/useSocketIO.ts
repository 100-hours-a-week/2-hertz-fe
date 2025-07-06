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
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    const socket = io('https://dev.hertz-tuning.com', {
      transports: ['websocket'],
      withCredentials: true,
      path: '/socket.io',
      forceNew: true,
      upgrade: false,
    });

    socketRef.current = socket;

    const handleConnect = () => {
      console.log('✅ Socket.IO 연결');
    };
    const handleDisconnect = () => {
      console.log('🔌 Socket.IO 종료');
    };
    const handleConnectError = (err: Error) => {
      console.error('❌ 연결 실패:', err);
    };
    const handleInitUser = (data: number) => {
      onMessageRef.current({ event: 'init_user', data });
    };
    const handleReceiveMessage = (data: ReceiveMessage) => {
      onMessageRef.current({ event: 'receive_message', data });
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);
    socket.on('init_user', handleInitUser);
    socket.on('receive_message', handleReceiveMessage);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      socket.off('init_user', handleInitUser);
      socket.off('receive_message', handleReceiveMessage);
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, [channelRoomId]);

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
