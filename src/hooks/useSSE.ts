'use client';

import { useEffect, useRef } from 'react';

type SSEEventHandlers = {
  [eventName: string]: (data: unknown) => void;
};

export const useSSE = ({ url, handlers }: { url: string; handlers: SSEEventHandlers }) => {
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isConnectingRef = useRef(false);
  const handlersRef = useRef(handlers);
  const listenerMapRef = useRef<Record<string, (e: MessageEvent) => void>>({});

  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  useEffect(() => {
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
      };

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

    connect();

    return () => {
      if (eventSource) {
        Object.entries(listenerMapRef.current).forEach(([event, listener]) => {
          eventSource!.removeEventListener(event, listener);
        });
        eventSource?.close();
      }
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
    };
  }, [url]);
};
