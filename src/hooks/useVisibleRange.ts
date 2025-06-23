import { useState, useEffect, useCallback } from 'react';

export interface UseVisibleRangeOptions {
  itemCount: number;
  itemHeight: number;
  buffer?: number;
}

/**
 * Hook to calculate visible range for virtualized lists
 * Returns the start and end indices of items that should be rendered
 */
export function useVisibleRange({
  itemCount,
  itemHeight,
  buffer = 5
}: UseVisibleRangeOptions): [number, number] {
  const [range, setRange] = useState<[number, number]>([0, Math.min(itemCount, buffer * 2)]);

  const updateRange = useCallback(() => {
    const scrollY = window.scrollY || window.pageYOffset;
    const viewportHeight = window.innerHeight;
    
    const startIndex = Math.max(0, Math.floor(scrollY / itemHeight) - buffer);
    const endIndex = Math.min(
      itemCount,
      Math.ceil((scrollY + viewportHeight) / itemHeight) + buffer
    );
    
    setRange([startIndex, endIndex]);
  }, [itemCount, itemHeight, buffer]);

  useEffect(() => {
    // Initial calculation
    updateRange();
    
    // Add scroll and resize listeners with passive option for better performance
    const options = { passive: true };
    window.addEventListener('scroll', updateRange, options);
    window.addEventListener('resize', updateRange, options);
    
    return () => {
      window.removeEventListener('scroll', updateRange);
      window.removeEventListener('resize', updateRange);
    };
  }, [updateRange]);

  return range;
}
