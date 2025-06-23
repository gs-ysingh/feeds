import React, { useEffect, useState, useCallback } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

export interface OptimizedLazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  webpSrc?: string;
  placeholder?: string;
  blurDataUrl?: string;
}

const loadedImages = new Set<string>();
const imageCache = new Map<string, HTMLImageElement>();

/**
 * Optimized LazyImage with WebP support, blur placeholder, and aggressive caching
 * Supports progressive image loading for better perceived performance
 */
export const OptimizedLazyImage: React.FC<OptimizedLazyImageProps> = ({ 
  src, 
  webpSrc,
  alt, 
  placeholder,
  blurDataUrl,
  ...props 
}) => {
  const isCached = loadedImages.has(src);
  const [isVisible, setIsVisible] = useState(isCached);
  const [isLoaded, setIsLoaded] = useState(isCached);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(
    isCached ? src : (blurDataUrl || placeholder)
  );

  // Intersection observer with increased root margin for better prefetching
  const handleIntersect = useCallback((entry: IntersectionObserverEntry) => {
    if (entry.isIntersecting) {
      setIsVisible(true);
    }
  }, []);

  const imgRef = useIntersectionObserver<HTMLImageElement>(
    isCached ? () => {} : handleIntersect,
    { 
      threshold: 0.1,
      rootMargin: '50px' // Preload images 50px before they become visible
    }
  );

  // WebP support detection
  const supportsWebP = useCallback(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('webp') > -1;
  }, []);

  const preloadImage = useCallback((imageSrc: string) => {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      // Check cache first
      if (imageCache.has(imageSrc)) {
        resolve(imageCache.get(imageSrc)!);
        return;
      }

      const img = new Image();
      img.onload = () => {
        imageCache.set(imageSrc, img);
        loadedImages.add(imageSrc);
        resolve(img);
      };
      img.onerror = reject;
      img.src = imageSrc;
    });
  }, []);

  useEffect(() => {
    if (!isVisible || isLoaded) return;

    const loadImage = async () => {
      try {
        // Choose optimal format
        const optimalSrc = (webpSrc && supportsWebP()) ? webpSrc : src;
        
        // Preload the image
        await preloadImage(optimalSrc);
        
        setCurrentSrc(optimalSrc);
        setIsLoaded(true);
        setHasError(false);
      } catch (error) {
        console.warn('Failed to load image:', error);
        setHasError(true);
        // Fallback to original src if WebP fails
        if (webpSrc && supportsWebP()) {
          try {
            await preloadImage(src);
            setCurrentSrc(src);
            setIsLoaded(true);
          } catch (fallbackError) {
            console.error('Fallback image also failed:', fallbackError);
          }
        }
      }
    };

    loadImage();
  }, [isVisible, isLoaded, src, webpSrc, preloadImage, supportsWebP]);

  // Error fallback
  if (hasError) {
    return (
      <div
        style={{
          minHeight: 100,
          background: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#999',
          ...props.style,
        }}
      >
        Failed to load image
      </div>
    );
  }

  return (
    <img
      ref={imgRef}
      src={currentSrc}
      alt={alt}
      {...props}
      style={{
        minHeight: 100,
        background: '#eee',
        transition: 'opacity 0.3s ease-in-out, filter 0.3s ease-in-out',
        opacity: isLoaded ? 1 : 0.7,
        filter: isLoaded ? 'none' : 'blur(5px)',
        ...props.style,
      }}
      loading="lazy"
      decoding="async"
    />
  );
};
