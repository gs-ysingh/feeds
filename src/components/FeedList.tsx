import { useEffect, useRef } from 'react';
import { useFeed } from '../hooks/useFeed';
import { FeedItem } from './FeedItem';
import { VirtualizedList } from './VirtualizedList';
import { ErrorBoundary } from './ErrorBoundary';

export default function FeedList() {
  const { items, loading, error, hasNextPage, loadMore } = useFeed();
  const loader = useRef<HTMLDivElement | null>(null);

  // Infinite scroll: load more when loader div is visible using IntersectionObserver
  useEffect(() => {
    if (!loader.current) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(loader.current);
    return () => observer.disconnect();
  }, [loadMore, loading, hasNextPage]);

  return (
    <ErrorBoundary>
      <main aria-label="Feed list" role="feed">
        {error && (
          <div role="alert" style={{ color: 'red', margin: '1rem' }}>
            Error loading feed: {error.message}
          </div>
        )}
        <VirtualizedList
          items={items}
          itemHeight={480}
          buffer={5}
          renderItem={(feed) => (
            <ErrorBoundary>
              <FeedItem key={feed.id} feed={feed} />
            </ErrorBoundary>
          )}
        />
        <div ref={loader} aria-live="polite" style={{ minHeight: 40 }}>
          {loading && !error ? 'Loading…' : !hasNextPage && !error && 'No more posts'}
        </div>
      </main>
    </ErrorBoundary>
  );
}
