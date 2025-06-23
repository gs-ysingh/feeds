import { useCallback } from 'react';
import { useIntersectionObserver } from './useIntersectionObserver';

interface UseInfiniteScrollOptions {
  onLoadMore: () => void;
  hasNextPage: boolean;
  loading: boolean;
  threshold?: number;
}

/**
 * useInfiniteScroll - Refactored to use useIntersectionObserver
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
  const handleIntersect = useCallback(
    (entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting && hasNextPage && !loading) {
        onLoadMore();
      }
    },
    [onLoadMore, hasNextPage, loading]
  );

  const ref = useIntersectionObserver<HTMLDivElement>(handleIntersect, { threshold });

  return { ref };
}
