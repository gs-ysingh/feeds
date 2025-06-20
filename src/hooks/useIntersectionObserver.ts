import { useEffect, useRef } from 'react';

export function useIntersectionObserver<T extends Element>(
  callback: (entry: IntersectionObserverEntry) => void,
  options?: IntersectionObserverInit
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new window.IntersectionObserver((entries) => {
      entries.forEach(callback);
    }, options);
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [callback, options]);

  return ref;
}
