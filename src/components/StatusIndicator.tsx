import React from 'react';

export interface StatusIndicatorProps {
  loading: boolean;
  hasNextPage: boolean;
  error: Error | null | undefined;
  itemCount: number;
  loadingText?: string;
  endText?: string;
  style?: React.CSSProperties;
}

/**
 * Reusable status indicator for infinite scroll scenarios
 * Combines loading, end-of-data, and error states
 */
export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  loading,
  hasNextPage,
  error,
  itemCount,
  loadingText = 'Loading…',
  endText = 'No more posts',
  style = { minHeight: 40, height: 40, textAlign: 'center', color: '#666' }
}) => {
  let content = '';
  
  if (loading && hasNextPage && !error) {
    content = loadingText;
  } else if (!loading && !hasNextPage && itemCount > 0 && !error) {
    content = endText;
  }

  return (
    <div aria-live="polite" style={style}>
      {content}
    </div>
  );
};
