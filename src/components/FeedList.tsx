import { useFeed } from '../hooks/useFeed';
import { FeedItem } from './FeedItem';
import { VirtualizedList } from './VirtualizedList';
import { ErrorBoundary } from './ErrorBoundary';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

export default function FeedList() {
  const { items, loading, error, hasNextPage, loadMore } = useFeed();
  const { ref: loaderRef } = useInfiniteScroll({ onLoadMore: loadMore, hasNextPage, loading });

  return (
    <ErrorBoundary>
      <main aria-label="Feed list" role="feed">
        {error && (
          <div role="alert" style={{ color: 'red', margin: '1rem' }}>
            Error loading feed: {error.message}
          </div>
        )}
        {items.length === 0 && !loading && !error && (
          <div style={{ margin: '2rem', color: '#888' }}>No posts found.</div>
        )}
        <VirtualizedList
          items={items}
          itemHeight={480}
          buffer={12} // Increased buffer for smoother fast scrolling
          renderItem={(feed) => (
            <ErrorBoundary>
              <FeedItem key={feed.id} feed={feed} />
            </ErrorBoundary>
          )}
        />
        <div ref={loaderRef} aria-live="polite" style={{ minHeight: 40, height: 40 }}>
          {loading && hasNextPage && !error && 'Loading…'}
          {!loading && !hasNextPage && items.length > 0 && !error && 'No more posts'}
        </div>
      </main>
    </ErrorBoundary>
  );
}
