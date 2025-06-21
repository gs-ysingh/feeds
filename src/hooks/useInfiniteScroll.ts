import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  onLoadMore: () => void;
  hasNextPage: boolean;
  loading: boolean;
  threshold?: number;
}

/**
 * useInfiniteScroll
 *
 * Usage:
 *   const { ref } = useInfiniteScroll({ onLoadMore, hasNextPage, loading });
 *   <div ref={ref} />
 */
export function useInfiniteScroll({
  onLoadMore,
  hasNextPage,
  loading,
  threshold = 0.1,
}: UseInfiniteScrollOptions) {
  const ref = useRef<HTMLDivElement | null>(null);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasNextPage && !loading) {
        onLoadMore();
      }
    },
    [onLoadMore, hasNextPage, loading]
  );

  useEffect(() => {
    if (!ref.current) return;
    const observer = new window.IntersectionObserver(handleIntersect, { threshold });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [handleIntersect, threshold]);

  return { ref };
}
