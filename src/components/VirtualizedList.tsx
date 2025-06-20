import React from 'react';

export interface VirtualizedListProps<T> {
  items: T[];
  itemHeight: number;
  buffer?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
}

export const VirtualizedList = <T,>({ items, itemHeight, buffer = 5, renderItem }: VirtualizedListProps<T>) => {
  // Calculate visible range
  const [range, setRange] = React.useState<[number, number]>([0, 0]);

  React.useEffect(() => {
    function onScroll() {
      const scrollY = window.scrollY || window.pageYOffset;
      const viewportHeight = window.innerHeight;
      const first = Math.max(0, Math.floor(scrollY / itemHeight) - buffer);
      const last = Math.min(items.length, Math.ceil((scrollY + viewportHeight) / itemHeight) + buffer);
      setRange([first, last]);
    }
    onScroll();
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [items.length, itemHeight, buffer]);

  const [start, end] = range;

  return <>{items.slice(start, end).map(renderItem)}</>;
};
