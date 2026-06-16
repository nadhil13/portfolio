import { useState, useEffect } from 'react';

export const useResponsive = () => {
  const [screenInfo, setScreenInfo] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
    device: 'desktop',
    orientation: 'portrait',
    aspectRatio: 1,
    pixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
    touchDevice: false,
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true
  });

  const [breakpoints, setBreakpoints] = useState({
    isMicro: false,     // < 320px
    isMobile: false,    // 320px - 640px
    isTablet: false,    // 640px - 1024px
    isDesktop: false,   // 1024px - 1920px
    isLarge: false,     // > 1920px
    isUltraWide: false  // > 2560px
  });

  useEffect(() => {
    const updateScreenInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const aspectRatio = width / height;
      const orientation = width > height ? 'landscape' : 'portrait';
      const pixelRatio = window.devicePixelRatio || 1;
      const touchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      // Determine device type
      let device = 'desktop';
      if (width < 320) device = 'micro';
      else if (width < 640) device = 'mobile';
      else if (width < 1024) device = 'tablet';
      else if (width < 1920) device = 'desktop';
      else device = 'large';

      // Update breakpoints
      const newBreakpoints = {
        isMicro: width < 320,
        isMobile: width >= 320 && width < 640,
        isTablet: width >= 640 && width < 1024,
        isDesktop: width >= 1024 && width < 1920,
        isLarge: width >= 1920 && width < 2560,
        isUltraWide: width >= 2560
      };

      setScreenInfo({
        width,
        height,
        device,
        orientation,
        aspectRatio,
        pixelRatio,
        touchDevice,
        isOnline: navigator.onLine
      });

      setBreakpoints(newBreakpoints);
    };

    // Initial check
    updateScreenInfo();

    // Event listeners
    window.addEventListener('resize', updateScreenInfo);
    window.addEventListener('orientationchange', updateScreenInfo);
    window.addEventListener('online', updateScreenInfo);
    window.addEventListener('offline', updateScreenInfo);

    return () => {
      window.removeEventListener('resize', updateScreenInfo);
      window.removeEventListener('orientationchange', updateScreenInfo);
      window.removeEventListener('online', updateScreenInfo);
      window.removeEventListener('offline', updateScreenInfo);
    };
  }, []);

  // Utility functions
  const getResponsiveValue = (values) => {
    if (breakpoints.isMicro) return values.micro || values.mobile || values.default;
    if (breakpoints.isMobile) return values.mobile || values.default;
    if (breakpoints.isTablet) return values.tablet || values.default;
    if (breakpoints.isDesktop) return values.desktop || values.default;
    if (breakpoints.isLarge) return values.large || values.desktop || values.default;
    if (breakpoints.isUltraWide) return values.ultraWide || values.large || values.desktop || values.default;
    return values.default;
  };

  const getOptimalImageSize = () => {
    const baseWidth = screenInfo.width * screenInfo.pixelRatio;
    
    if (baseWidth < 640) return { width: 640, quality: 80 };
    if (baseWidth < 1024) return { width: 1024, quality: 85 };
    if (baseWidth < 1920) return { width: 1920, quality: 90 };
    if (baseWidth < 2560) return { width: 2560, quality: 95 };
    return { width: 3840, quality: 100 };
  };

  const shouldUseReducedMotion = () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };

  const getOptimalFontSize = (baseFontSize) => {
    const scaleFactor = getResponsiveValue({
      micro: 0.8,
      mobile: 0.9,
      tablet: 1.0,
      desktop: 1.1,
      large: 1.2,
      ultraWide: 1.3,
      default: 1.0
    });

    return `${baseFontSize * scaleFactor}rem`;
  };

  return {
    ...screenInfo,
    ...breakpoints,
    getResponsiveValue,
    getOptimalImageSize,
    shouldUseReducedMotion,
    getOptimalFontSize,
    
    // Convenience booleans
    isSmallScreen: breakpoints.isMicro || breakpoints.isMobile,
    isMediumScreen: breakpoints.isTablet,
    isLargeScreen: breakpoints.isDesktop || breakpoints.isLarge || breakpoints.isUltraWide,
    isMobileDevice: screenInfo.device === 'micro' || screenInfo.device === 'mobile',
    isLandscapeMobile: screenInfo.device === 'mobile' && screenInfo.orientation === 'landscape',
    hasHighDPI: screenInfo.pixelRatio > 1.5
  };
};

export default useResponsive;