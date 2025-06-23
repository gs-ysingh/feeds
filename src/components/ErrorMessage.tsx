import React from 'react';

export interface ErrorMessageProps {
  error: Error | null | undefined;
  prefix?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Reusable error message component to eliminate duplication
 * across FeedList, FeedItem, and other components
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  error, 
  prefix = 'Error', 
  className,
  style = { color: 'red', margin: '0.5rem 0' }
}) => {
  if (!error) return null;
  
  return (
    <div 
      role="alert" 
      className={className}
      style={style}
    >
      {prefix}: {error.message}
    </div>
  );
};
