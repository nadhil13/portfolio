import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ResponsiveWrapper = ({ children, className = '' }) => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
    device: 'desktop'
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      let device = 'desktop';
      if (width < 280) device = 'micro';
      else if (width < 480) device = 'mobile';
      else if (width < 768) device = 'mobile-lg';
      else if (width < 1024) device = 'tablet';
      else if (width < 1440) device = 'desktop';
      else if (width < 1920) device = 'desktop-lg';
      else device = 'desktop-xl';

      setScreenSize({ width, height, device });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Dynamic container classes based on screen size
  const getContainerClasses = () => {
    const base = className;
    
    switch (screenSize.device) {
      case 'micro':
        return `${base} px-4 max-w-full mx-auto`;
      case 'mobile':
        return `${base} px-4 max-w-full mx-auto`;
      case 'mobile-lg':
        return `${base} px-6 max-w-full mx-auto`;
      case 'tablet':
        return `${base} px-6 max-w-4xl mx-auto`;
      case 'desktop':
        return `${base} px-8 max-w-6xl mx-auto`;
      case 'desktop-lg':
        return `${base} px-12 max-w-7xl mx-auto`;
      case 'desktop-xl':
        return `${base} px-16 max-w-8xl mx-auto`;
      default:
        return `${base} px-4 max-w-6xl mx-auto`;
    }
  };

  return (
    <motion.div
      className={getContainerClasses()}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      data-device={screenSize.device}
      data-width={screenSize.width}
      data-height={screenSize.height}
    >
      {children}
    </motion.div>
  );
};

export default ResponsiveWrapper;