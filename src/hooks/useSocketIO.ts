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
    const websocketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL;

    if (!websocketUrl) {
      console.error('❌ NEXT_PUBLIC_WEBSOCKET_URL 환경 변수가 설정되지 않았습니다');
      return;
    }

    console.log('🔗 WebSocket 연결 시도:', { url: websocketUrl, channelRoomId });

    const socket = io(websocketUrl, {
      transports: ['websocket'],
      withCredentials: true,
      path: '/socket.io',
      forceNew: true,
      upgrade: false,
    });

    socketRef.current = socket;

    const handleConnect = () => {
      console.log('✅ Socket.IO 연결 성공', { channelRoomId });
    };
    const handleDisconnect = () => {
      console.log('🔌 Socket.IO 연결 해제', { channelRoomId });
    };
    const handleConnectError = (err: Error) => {
      console.error('❌ Socket.IO 연결 실패:', err, {
        channelRoomId,
        url: process.env.NEXT_PUBLIC_WEBSOCKET_URL,
      });
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
    if (!socketRef.current) {
      console.warn('❌ 소켓 인스턴스가 없습니다!', { channelRoomId });
      return;
    }

    if (!socketRef.current.connected) {
      console.warn('❌ 소켓이 연결되지 않았습니다!', {
        channelRoomId,
        socketId: socketRef.current.id,
        connected: socketRef.current.connected,
      });
      return;
    }

    // console.log('📤 메시지 전송:', { channelRoomId, payload });
    socketRef.current.emit('send_message', payload);
  };

  const sendMarkAsRead = (payload: MarkAsRead) => {
    if (!socketRef.current?.connected) {
      console.warn('❌ 읽음 처리 실패 - 소켓 연결 없음', { channelRoomId });
      return;
    }
    socketRef.current.emit('mark_as_read', payload);
  };

  return {
    socketRef,
    sendSocketMessage,
    sendMarkAsRead,
  };
};
