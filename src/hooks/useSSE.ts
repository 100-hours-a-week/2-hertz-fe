'use client';

import { useEffect, useRef } from 'react';

type SSEEventHandlers = {
  [eventName: string]: (data: unknown) => void;
};

export const useSSE = ({
  url,
  handlers,
  enabled = true,
  channelRoomId,
}: {
  url: string;
  handlers: SSEEventHandlers;
  enabled?: boolean;
  channelRoomId?: number;
}) => {
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isConnectingRef = useRef(false);
  const handlersRef = useRef(handlers);
  const listenerMapRef = useRef<Record<string, (e: MessageEvent) => void>>({});
  const lastHeartbeatRef = useRef<number>(Date.now());
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  useEffect(() => {
    if (!enabled) return;

    const connect = () => {
      if (isConnectingRef.current) return;
      isConnectingRef.current = true;

      if (eventSourceRef.current) {
        console.log(`[기존 SSE 연결 해제]`);
        Object.entries(listenerMapRef.current).forEach(([event, listener]) => {
          eventSourceRef.current!.removeEventListener(event, listener);
        });
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }

      const eventSource = new EventSource(url, { withCredentials: true });
      eventSourceRef.current = eventSource;
      listenerMapRef.current = {};

      eventSource.onopen = () => {
        console.log(`[SSE 연결 완료]`);
        isConnectingRef.current = false;
        lastHeartbeatRef.current = Date.now();
      };

      eventSource.addEventListener('heartbeat', () => {
        lastHeartbeatRef.current = Date.now();
      });

      const handlersMap = handlersRef.current;

      Object.entries(handlersMap).forEach(([event, callback]) => {
        const listener = (e: MessageEvent) => {
          try {
            const parsed = e.data ? JSON.parse(e.data) : null;
            callback(parsed);
          } catch (err) {
            console.error(`Error parsing event [${event}]`, err);
          }
        };

        eventSource.addEventListener(event, listener);
        listenerMapRef.current[event] = listener;
      });

      eventSource.onerror = (err) => {
        console.error('SSE error:', err);
        eventSource.close();
        isConnectingRef.current = false;

        retryTimeoutRef.current = setTimeout(() => {
          console.info(`[🔄 SSE 재연결 시도]`);
          connect();
        }, 3000);
      };
    };

    connect();

    const heartbeatInterval = setInterval(() => {
      const elapsed = Date.now() - lastHeartbeatRef.current;
      if (elapsed > 30000 && !isConnectingRef.current) {
        console.warn(`[💔 heartbeat 누락 - SSE 재연결 시도]`);
        eventSourceRef.current?.close();
        eventSourceRef.current = null;
        isConnectingRef.current = false;
        connect();
      }
    }, 16000);

    return () => {
      if (eventSourceRef.current) {
        console.log(`[SSE 연결 해제]`);
        Object.entries(listenerMapRef.current).forEach(([event, listener]) => {
          eventSourceRef.current!.removeEventListener(event, listener);
        });
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }

      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }

      clearInterval(heartbeatInterval);
    };
  }, [url, enabled, channelRoomId]);
};
