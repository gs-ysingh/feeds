import { useRef, useCallback } from 'react';

export function useImageCache() {
  const cache = useRef<Set<string>>(new Set());

  const isCached = useCallback((src: string) => cache.current.has(src), []);
  const addToCache = useCallback((src: string) => {
    cache.current.add(src);
  }, []);

  return { isCached, addToCache };
}
