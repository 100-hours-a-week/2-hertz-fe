'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type {
  MarkAsRead,
  ReceiveMessage,
  SendMessage,
  WebSocketIncomingMessage,
  RelationTypeChanged,
} from '@/types/WebSocketType';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const io = require('socket.io-client');

interface UseSocketIOProps {
  channelRoomId: number;
  onMessage: (data: WebSocketIncomingMessage) => void;
}

interface UseSocketIOReturn {
  socketRef: React.MutableRefObject<ReturnType<typeof io> | null>;
  sendSocketMessage: (payload: SendMessage) => void;
  sendMarkAsRead: (payload: MarkAsRead) => void;
  isConnected: boolean;
  reconnect: () => void;
}

export const useSocketIO = ({ channelRoomId, onMessage }: UseSocketIOProps): UseSocketIOReturn => {
  const socketRef = useRef<ReturnType<typeof io> | null>(null);
  const onMessageRef = useRef(onMessage);
  const reconnectAttemptRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isConnectingRef = useRef(false);

  const [isConnected, setIsConnected] = useState(false);

  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_DELAY = 2000;

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  const connectSocket = useCallback(() => {
    const websocketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL;

    if (!websocketUrl) {
      console.error('❌ NEXT_PUBLIC_WEBSOCKET_URL 환경 변수가 설정되지 않았습니다');
      return;
    }

    if (isConnectingRef.current) {
      return;
    }

    isConnectingRef.current = true;

    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
    }

    const socket = io(websocketUrl, {
      transports: ['websocket'],
      withCredentials: true,
      path: '/socket.io',
      timeout: 10000,
      reconnection: true,
      reconnectionDelay: RECONNECT_DELAY,
      reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
      upgrade: false,
    });

    socketRef.current = socket;

    const handleConnect = () => {
      console.log('✅ Socket.IO 연결 성공', { channelRoomId });
      setIsConnected(true);
      isConnectingRef.current = false;
      reconnectAttemptRef.current = 0;

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };

    const handleDisconnect = (reason: string) => {
      console.log('🔌 Socket.IO 연결 해제', { channelRoomId, reason });
      setIsConnected(false);
      isConnectingRef.current = false;

      if (reason !== 'io client disconnect') {
        attemptReconnect();
      }
    };

    const handleConnectError = (err: Error) => {
      console.error('❌ Socket.IO 연결 실패:', err, {
        channelRoomId,
        url: websocketUrl,
        attempt: reconnectAttemptRef.current + 1,
      });
      setIsConnected(false);
      isConnectingRef.current = false;
      attemptReconnect();
    };

    const attemptReconnect = () => {
      if (reconnectAttemptRef.current >= MAX_RECONNECT_ATTEMPTS) {
        console.error('❌ 최대 재연결 시도 횟수 초과', { channelRoomId });
        return;
      }

      reconnectAttemptRef.current += 1;
      const delay = RECONNECT_DELAY * reconnectAttemptRef.current;

      reconnectTimeoutRef.current = setTimeout(() => {
        connectSocket();
      }, delay);
    };

    const handleInitUser = (data: number) => {
      onMessageRef.current({ event: 'init_user', data });
    };

    const handleReceiveMessage = (data: ReceiveMessage) => {
      onMessageRef.current({ event: 'receive_message', data });
    };

    const handleRelationTypeChanged = (data: RelationTypeChanged) => {
      onMessageRef.current({ event: 'relation_type_changed', data });
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);
    socket.on('init_user', handleInitUser);
    socket.on('receive_message', handleReceiveMessage);
    socket.on('relation_type_changed', handleRelationTypeChanged);
  }, [channelRoomId]);

  const reconnect = useCallback(() => {
    reconnectAttemptRef.current = 0;

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    connectSocket();
  }, [connectSocket]);

  useEffect(() => {
    connectSocket();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
        socketRef.current = null;
      }

      setIsConnected(false);
      isConnectingRef.current = false;
      reconnectAttemptRef.current = 0;
    };
  }, [connectSocket]);

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
    isConnected,
    reconnect,
  };
};
