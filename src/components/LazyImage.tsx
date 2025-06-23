import React, { useEffect, useState, useCallback } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

export interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

const loadedImages = new Set<string>();

export const LazyImage: React.FC<LazyImageProps> = ({ src, alt, ...props }) => {
  // Always check cache on mount - if cached, show immediately
  const isCached = loadedImages.has(src);
  const [isVisible, setIsVisible] = useState(isCached);
  const [isLoaded, setIsLoaded] = useState(isCached);

  // Intersection observer callback
  const handleIntersect = useCallback((entry: IntersectionObserverEntry) => {
    if (entry.isIntersecting) {
      setIsVisible(true);
    }
  }, []);

  // Use generic intersection observer hook (only for non-cached images)
  const imgRef = useIntersectionObserver<HTMLImageElement>(
    isCached ? () => {} : handleIntersect,
    { threshold: 0.1 }
  );

  useEffect(() => {
    // If image is cached, no need for intersection observer
    if (loadedImages.has(src)) {
      setIsVisible(true);
      setIsLoaded(true);
      return;
    }
  }, [src]); // Re-run when src changes

  const handleLoad = () => {
    loadedImages.add(src);
    setIsLoaded(true);
  };

  // True lazy loading: only set src when visible or cached
  // This prevents unnecessary network requests for bottom images
  return (
    <img
      ref={imgRef}
      src={isVisible || isLoaded ? src : undefined}
      alt={alt}
      onLoad={handleLoad}
      {...props}
      style={{
        minHeight: 100,
        background: '#eee',
        transition: 'opacity 0.3s',
        opacity: isLoaded ? 1 : (isVisible ? 0.8 : 0.1),
        ...props.style,
      }}
    />
  );
};
