'use client';

import { useEffect, useRef } from 'react';

type SSEEventHandlers = {
  [eventName: string]: (data: unknown) => void;
};

export const useSSE = ({
  url,
  handlers,
  enabled = true,
}: {
  url: string;
  handlers: SSEEventHandlers;
  enabled?: boolean;
}) => {
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isConnectingRef = useRef(false);
  const handlersRef = useRef(handlers);
  const listenerMapRef = useRef<Record<string, (e: MessageEvent) => void>>({});
  const lastHeartbeatRef = useRef<number>(Date.now());

  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  useEffect(() => {
    if (!enabled) return;
    let eventSource: EventSource | null = null;

    const connect = () => {
      listenerMapRef.current = {};

      if (isConnectingRef.current) return;
      isConnectingRef.current = true;

      eventSource = new EventSource(url, {
        withCredentials: true,
      });

      eventSource.onopen = () => {
        isConnectingRef.current = false;
        lastHeartbeatRef.current = Date.now();
      };

      eventSource.addEventListener('heartbeat', () => {
        lastHeartbeatRef.current = Date.now();
      });

      Object.entries(handlersRef.current).forEach(([event, callback]) => {
        const listener = (e: MessageEvent) => {
          try {
            if (
              event === 'nav-new-message' ||
              event === 'nav-no-any-new-message' ||
              event === 'new-alarm' ||
              event === 'no-any-new-alarm'
            ) {
              callback(null);
              return;
            }

            if (!e.data) return;
            const parsed = JSON.parse(e.data);
            callback(parsed);
          } catch (err) {
            console.error(`Error parsing SSE event '${event}':`, err);
          }
        };
        listenerMapRef.current[event] = listener;
        eventSource!.addEventListener(event, listener);
      });

      eventSource.onerror = (err: Event) => {
        console.error('SSE connection error:', err);

        eventSource?.close();
        isConnectingRef.current = false;
        retryTimeoutRef.current = setTimeout(() => {
          console.info('🔄 SSE 재연결 시도...');
          connect();
        }, 3000);
      };
    };

    const heartbeatInterval = setInterval(() => {
      const elapsed = Date.now() - lastHeartbeatRef.current;
      if (elapsed > 30000 && !isConnectingRef.current) {
        console.warn('💔 heartbeat 누락 - SSE 재연결 시도');
        eventSource?.close();
        isConnectingRef.current = false;
        connect();
      }
    }, 16000);

    connect();

    return () => {
      if (eventSource) {
        Object.entries(listenerMapRef.current).forEach(([event, listener]) => {
          eventSource!.removeEventListener(event, listener);
        });
        eventSource?.close();
      }
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
      clearInterval(heartbeatInterval);
    };
  }, [url, enabled]);
};
