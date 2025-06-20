import { useQuery } from '@apollo/client';
import { useCallback, useRef, useEffect, useState } from 'react';
import { FEEDS_QUERY } from '../graphql/feedsQuery';
import type { FeedItemProps } from '../components/FeedItem';

export interface UseFeedResult {
  items: FeedItemProps['feed'][];
  loading: boolean;
  error: Error | undefined;
  hasNextPage: boolean;
  loadMore: () => void;
}

const PAGE_SIZE = 10;

export function useFeed() {
  const { data, loading, error, fetchMore } = useQuery(FEEDS_QUERY, {
    variables: { after: null, limit: PAGE_SIZE },
    notifyOnNetworkStatusChange: true,
  });
  const [items, setItems] = useState<FeedItemProps['feed'][]>([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const endCursor = data?.feeds?.pageInfo?.endCursor;

  useEffect(() => {
    if (data?.feeds?.edges) {
      setItems(data.feeds.edges);
      setHasNextPage(data.feeds.pageInfo.hasNextPage);
    }
  }, [data]);

  const isFetching = useRef(false);
  const loadMore = useCallback(() => {
    if (!hasNextPage || isFetching.current) return;
    isFetching.current = true;
    fetchMore({
      variables: { after: endCursor, limit: PAGE_SIZE },
    }).finally(() => {
      isFetching.current = false;
    });
  }, [fetchMore, endCursor, hasNextPage]);

  return { items, loading, error, hasNextPage, loadMore };
}
