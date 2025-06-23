import React from 'react';

export interface LoadingIndicatorProps {
  loading: boolean;
  text?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Reusable loading indicator component
 * Eliminates similar loading UI patterns across components
 */
export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  loading, 
  text = 'Loading...', 
  className,
  style = { margin: '0.5rem 0', color: '#666' }
}) => {
  if (!loading) return null;
  
  return (
    <div 
      className={className}
      style={style}
      aria-live="polite"
    >
      {text}
    </div>
  );
};
