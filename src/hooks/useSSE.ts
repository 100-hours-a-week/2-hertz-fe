'use client';

import { useEffect, useRef } from 'react';

type SSEEventHandlers = {
  [eventName: string]: (data: unknown) => void;
};

export const useSSE = ({ url, handlers }: { url: string; handlers: SSEEventHandlers }) => {
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isConnectingRef = useRef(false);

  useEffect(() => {
    let eventSource: EventSource | null = null;

    const connect = () => {
      if (isConnectingRef.current) return;
      isConnectingRef.current = true;

      eventSource = new EventSource(url, {
        withCredentials: true,
      });

      eventSource.onopen = () => {
        isConnectingRef.current = false;
      };

      Object.entries(handlers).forEach(([event, callback]) => {
        eventSource!.addEventListener(event, (e: MessageEvent) => {
          try {
            const parsed = JSON.parse(e.data);
            callback(parsed);
          } catch (err) {
            console.error(`Error parsing SSE event '${event}':`, err);
          }
        });
      });

      eventSource.onerror = (err: Event) => {
        console.error('SSE connection error:', err);

        eventSource?.close();

        retryTimeoutRef.current = setTimeout(() => {
          console.info('🔄 SSE 재연결 시도...');
          connect();
        }, 3000);
      };
    };

    connect();

    return () => {
      eventSource?.close();
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
    };
  }, [url, handlers]);
};
