import { useEffect } from 'react';

export function useScrollToTopOnRouteChange() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
}
