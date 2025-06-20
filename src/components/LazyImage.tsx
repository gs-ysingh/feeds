import React, { useEffect, useRef, useState } from 'react';

export interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

const loadedImages = new Set<string>();

export const LazyImage: React.FC<LazyImageProps> = ({ src, alt, ...props }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(loadedImages.has(src));
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (isLoaded) return;
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
  }, [isLoaded]);

  const handleLoad = () => {
    loadedImages.add(src);
    setIsLoaded(true);
  };

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
        opacity: isVisible || isLoaded ? 1 : 0.5,
        ...props.style,
      }}
    />
  );
};
