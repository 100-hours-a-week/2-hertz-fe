'use client';

import { useEffect } from 'react';

type SSEEventHandlers = {
  [eventName: string]: (data: unknown) => void;
};

export const useSSE = ({ url, handlers }: { url: string; handlers: SSEEventHandlers }) => {
  useEffect(() => {
    const eventSource = new EventSource(url, {
      withCredentials: true,
    });

    Object.entries(handlers).forEach(([event, callback]) => {
      eventSource.addEventListener(event, (e: MessageEvent) => {
        try {
          const parsed = JSON.parse(e.data);
          callback(parsed);
        } catch (err: unknown) {
          console.error(`Error parsing SSE event '${event}':`, err);
        }
      });
    });

    eventSource.onerror = (err: Event) => {
      console.error('SSE connection error:', err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [url, handlers]);
};
