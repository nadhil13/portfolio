import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LazyImage = ({
  src,
  alt,
  className = '',
  placeholder = null,
  blurDataURL = null,
  quality = 75,
  priority = false,
  onLoad = () => {},
  onError = () => {},
  fallback = null,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [loadProgress, setLoadProgress] = useState(0);
  const imgRef = useRef(null);
  const intersectionRef = useRef(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return; // Skip lazy loading for priority images

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before the image enters viewport
        threshold: 0.1
      }
    );

    if (intersectionRef.current) {
      observer.observe(intersectionRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  // Handle image loading
  useEffect(() => {
    if (!isInView || !src) return;

    const img = new Image();
    let progressTimer;

    // Simulate loading progress for better UX
    const simulateProgress = () => {
      progressTimer = setInterval(() => {
        setLoadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressTimer);
            return prev;
          }
          return prev + Math.random() * 10;
        });
      }, 100);
    };

    img.onload = () => {
      clearInterval(progressTimer);
      setLoadProgress(100);
      setTimeout(() => {
        setIsLoaded(true);
        onLoad();
      }, 200); // Small delay for smoother transition
    };

    img.onerror = () => {
      clearInterval(progressTimer);
      setIsError(true);
      onError();
    };

    img.src = src;
    simulateProgress();

    return () => {
      clearInterval(progressTimer);
    };
  }, [isInView, src, onLoad, onError]);

  // Generate optimized image URL
  const getOptimizedSrc = (originalSrc, width, quality = 75) => {
    // For production, you might want to use a CDN service like Cloudinary, Vercel, or similar
    // For now, we'll return the original src with quality params if supported
    if (originalSrc.includes('unsplash.com') || originalSrc.includes('cloudinary.com')) {
      const separator = originalSrc.includes('?') ? '&' : '?';
      return `${originalSrc}${separator}w=${width}&q=${quality}&fm=webp&auto=format`;
    }
    return originalSrc;
  };

  // Blur data URL for placeholder
  const getBlurDataURL = () => {
    if (blurDataURL) return blurDataURL;
    // Generate a simple blur placeholder
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#1e293b;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#0f172a;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill="url(#grad)" />
      </svg>
    `)}`;
  };

  if (isError && fallback) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={className}
        {...props}
      >
        {fallback}
      </motion.div>
    );
  }

  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`flex items-center justify-center bg-gradient-to-br from-dark-900/40 to-dark-800/60 rounded-card-lg border border-dark-700/50 ${className}`}
        {...props}
      >
        <div className="text-center p-6">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="w-12 h-12 mx-auto mb-3 rounded-card-md bg-gradient-to-br from-accent-500/20 to-accent-600/20 border border-accent-400/30 flex items-center justify-center"
          >
            <span className="text-accent-400 text-xl">📷</span>
          </motion.div>
          <p className="text-caption-md text-dark-400 font-medium">Image unavailable</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div ref={intersectionRef} className={`relative overflow-hidden ${className}`} {...props}>
      <AnimatePresence mode="wait">
        {!isLoaded && isInView && (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-10"
          >
            {/* Custom placeholder or blur image */}
            {placeholder || (
              <div
                className="w-full h-full bg-cover bg-center filter blur-sm scale-110"
                style={{
                  backgroundImage: `url(${getBlurDataURL()})`
                }}
              />
            )}
            
            {/* Loading overlay */}
            <div className="absolute inset-0 bg-dark-900/30 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center">
                {/* Loading spinner */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-2 border-primary-400/30 border-t-primary-400 rounded-full mx-auto mb-3"
                />
                
                {/* Progress bar */}
                <div className="w-24 h-1 bg-dark-700 rounded-full overflow-hidden mx-auto">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${loadProgress}%` }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="h-full bg-gradient-primary"
                  />
                </div>
                
                <p className="text-caption-sm text-dark-400 mt-2 font-medium">
                  Loading... {Math.round(loadProgress)}%
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {isLoaded && (
          <motion.img
            key="image"
            ref={imgRef}
            src={getOptimizedSrc(src)}
            alt={alt}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full h-full object-cover"
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            onLoad={() => {
              setIsLoaded(true);
              onLoad();
            }}
            onError={() => {
              setIsError(true);
              onError();
            }}
          />
        )}
      </AnimatePresence>

      {/* Loading shimmer effect */}
      {!isLoaded && isInView && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
      )}
    </div>
  );
};

export default LazyImage;