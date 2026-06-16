import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useResponsive } from '../hooks/useResponsive';

const ResponsiveImage = ({
  src,
  alt,
  className = '',
  priority = false,
  sizes = '100vw',
  quality = 85,
  placeholder = 'blur',
  loading = 'lazy',
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const { width, height, pixelRatio, device } = useResponsive();

  // Generate responsive image URLs
  const generateSrcSet = (originalSrc) => {
    const breakpoints = [320, 640, 768, 1024, 1280, 1536, 1920, 2560];
    const quality = device === 'micro' ? 70 : device === 'mobile' ? 80 : 90;
    
    return breakpoints
      .map(bp => {
        const scaledWidth = Math.min(bp * pixelRatio, 3840);
        // In real implementation, you would use your image optimization service
        // For demo, using unsplash with specific dimensions
        if (originalSrc.includes('unsplash.com')) {
          return `${originalSrc}&w=${scaledWidth}&q=${quality} ${bp}w`;
        }
        return `${originalSrc} ${bp}w`;
      })
      .join(', ');
  };

  // Get optimal image size for current device
  const getOptimalSrc = () => {
    const optimalWidth = Math.min(width * pixelRatio, 3840);
    const deviceQuality = device === 'micro' ? 70 : device === 'mobile' ? 80 : quality;
    
    if (src.includes('unsplash.com')) {
      return `${src}&w=${optimalWidth}&q=${deviceQuality}`;
    }
    return src;
  };

  useEffect(() => {
    setImageSrc(getOptimalSrc());
  }, [src, width, pixelRatio, device]);

  const handleLoad = () => {
    setIsLoaded(true);
    setError(false);
  };

  const handleError = () => {
    setError(true);
    setIsLoaded(false);
  };

  // Placeholder while loading
  const renderPlaceholder = () => (
    <div className={`bg-gray-200 animate-pulse flex items-center justify-center ${className}`}>
      <svg
        className="w-8 h-8 text-gray-400"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
      </svg>
    </div>
  );

  // Error fallback
  const renderError = () => (
    <div className={`bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center ${className}`}>
      <div className="text-center text-gray-500">
        <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <p className="text-xs">Failed to load</p>
      </div>
    </div>
  );

  if (error) {
    return renderError();
  }

  return (
    <motion.div
      className="relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {!isLoaded && placeholder === 'blur' && renderPlaceholder()}
      
      <motion.img
        src={imageSrc}
        srcSet={generateSrcSet(src)}
        sizes={sizes}
        alt={alt}
        className={`${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 crisp-edges`}
        loading={priority ? 'eager' : loading}
        onLoad={handleLoad}
        onError={handleError}
        initial={!isLoaded ? { opacity: 0, scale: 1.1 } : false}
        animate={isLoaded ? { opacity: 1, scale: 1 } : false}
        transition={{ duration: 0.5, ease: "easeOut" }}
        {...props}
      />
      
      {/* Loading overlay */}
      {!isLoaded && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
};

export default ResponsiveImage;