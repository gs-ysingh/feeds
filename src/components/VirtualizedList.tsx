import React from 'react';
import { useVisibleRange } from '../hooks/useVisibleRange';

export interface VirtualizedListProps<T> {
  items: T[];
  itemHeight: number;
  buffer?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
}

/**
 * VirtualizedList component using custom hooks for better separation of concerns
 * Now uses useVisibleRange hook to handle scroll calculations
 */
export const VirtualizedList = <T,>({ 
  items, 
  itemHeight, 
  buffer = 5, 
  renderItem 
}: VirtualizedListProps<T>) => {
  // Use custom hook to calculate visible range
  const [start, end] = useVisibleRange({
    itemCount: items.length,
    itemHeight,
    buffer,
  });

  // Only render items within the visible range
  return <>{items.slice(start, end).map(renderItem)}</>;
};
