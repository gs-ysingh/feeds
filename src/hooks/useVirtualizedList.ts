import { useEffect, useState } from 'react';

export function useVirtualizedList(
  itemCount: number,
  itemHeight: number,
  buffer: number = 5
) {
  const [range, setRange] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    function onScroll() {
      const scrollY = window.scrollY || window.pageYOffset;
      const viewportHeight = window.innerHeight;
      const first = Math.max(0, Math.floor(scrollY / itemHeight) - buffer);
      const last = Math.min(itemCount, Math.ceil((scrollY + viewportHeight) / itemHeight) + buffer);
      setRange([first, last]);
    }
    onScroll();
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [itemCount, itemHeight, buffer]);

  return range;
}
