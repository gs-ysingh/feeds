import React, { useEffect, useRef, useState } from 'react';

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
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    // If image is cached, no need for intersection observer
    if (loadedImages.has(src)) {
      setIsVisible(true);
      setIsLoaded(true);
      return;
    }
    
    // Only use intersection observer for non-cached images
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    return () => observer.disconnect();
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
