'use client';

import { useCallback } from 'react';
import { useSSEStore } from '@/stores/useSSEStore';

export const useSSEReconnector = () => {
  const reconnect = useSSEStore((state) => state.reconnect);

  return useCallback(() => {
    reconnect();
  }, [reconnect]);
};
