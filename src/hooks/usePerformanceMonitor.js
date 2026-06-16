import { useState, useEffect, useCallback } from 'react';

export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    fps: 0,
    memory: null,
    loadTime: 0,
    renderTime: 0,
    connectionType: 'unknown',
    isSlowConnection: false,
    recommendations: []
  });

  const [isMonitoring, setIsMonitoring] = useState(false);

  // FPS Monitoring
  const monitorFPS = useCallback(() => {
    let frames = 0;
    let lastTime = performance.now();
    
    const countFrame = () => {
      frames++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frames * 1000) / (currentTime - lastTime));
        setMetrics(prev => ({ ...prev, fps }));
        frames = 0;
        lastTime = currentTime;
      }
      
      if (isMonitoring) {
        requestAnimationFrame(countFrame);
      }
    };
    
    requestAnimationFrame(countFrame);
  }, [isMonitoring]);

  // Memory Usage Monitoring
  const monitorMemory = useCallback(() => {
    if ('memory' in performance) {
      const memory = {
        used: Math.round(performance.memory.usedJSHeapSize / 1048576), // MB
        total: Math.round(performance.memory.totalJSHeapSize / 1048576), // MB
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576) // MB
      };
      setMetrics(prev => ({ ...prev, memory }));
    }
  }, []);

  // Connection Quality Detection
  const detectConnection = useCallback(() => {
    if ('connection' in navigator) {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      const connectionType = connection?.effectiveType || 'unknown';
      const isSlowConnection = ['slow-2g', '2g'].includes(connectionType);
      
      setMetrics(prev => ({ 
        ...prev, 
        connectionType,
        isSlowConnection
      }));
    }
  }, []);

  // Performance Recommendations
  const generateRecommendations = useCallback((currentMetrics) => {
    const recommendations = [];

    if (currentMetrics.fps < 30) {
      recommendations.push({
        type: 'performance',
        message: 'Low FPS detected. Consider disabling 3D elements.',
        action: 'disable3D'
      });
    }

    if (currentMetrics.memory && currentMetrics.memory.used > 100) {
      recommendations.push({
        type: 'memory',
        message: 'High memory usage. Enable image compression.',
        action: 'optimizeImages'
      });
    }

    if (currentMetrics.loadTime > 3000) {
      recommendations.push({
        type: 'loading',
        message: 'Slow loading time. Enable lazy loading.',
        action: 'lazyLoad'
      });
    }

    if (currentMetrics.isSlowConnection) {
      recommendations.push({
        type: 'connection',
        message: 'Slow connection detected. Enable data saver mode.',
        action: 'dataSaver'
      });
    }

    return recommendations;
  }, []);

  // Performance Observer for Core Web Vitals
  useEffect(() => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            setMetrics(prev => ({
              ...prev,
              loadTime: Math.round(entry.loadEventEnd - entry.loadEventStart)
            }));
          }
          
          if (entry.entryType === 'measure' && entry.name.includes('render')) {
            setMetrics(prev => ({
              ...prev,
              renderTime: Math.round(entry.duration)
            }));
          }
        }
      });

      try {
        observer.observe({ entryTypes: ['navigation', 'measure'] });
      } catch (e) {
        console.warn('Performance Observer not fully supported:', e);
      }

      return () => observer.disconnect();
    }
  }, []);

  // Start monitoring
  const startMonitoring = useCallback(() => {
    setIsMonitoring(true);
    detectConnection();
    monitorMemory();
    
    // Update metrics every 2 seconds
    const interval = setInterval(() => {
      monitorMemory();
      setMetrics(prev => {
        const recommendations = generateRecommendations(prev);
        return { ...prev, recommendations };
      });
    }, 2000);

    return () => {
      clearInterval(interval);
      setIsMonitoring(false);
    };
  }, [detectConnection, monitorMemory, generateRecommendations]);

  // Stop monitoring
  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
  }, []);

  // Get performance score (0-100)
  const getPerformanceScore = useCallback(() => {
    const { fps, memory, loadTime, connectionType } = metrics;
    let score = 100;
    
    // FPS scoring (30% weight)
    if (fps < 30) score -= 30;
    else if (fps < 60) score -= 15;
    
    // Memory scoring (25% weight)
    if (memory && memory.used > 100) score -= 25;
    else if (memory && memory.used > 50) score -= 12;
    
    // Load time scoring (30% weight)
    if (loadTime > 3000) score -= 30;
    else if (loadTime > 1500) score -= 15;
    
    // Connection scoring (15% weight)
    if (['slow-2g', '2g'].includes(connectionType)) score -= 15;
    
    return Math.max(0, score);
  }, [metrics]);

  // Auto-start monitoring on mount
  useEffect(() => {
    const cleanup = startMonitoring();
    monitorFPS();
    
    return cleanup;
  }, [startMonitoring, monitorFPS]);

  // Get optimized settings based on current performance
  const getOptimizedSettings = useCallback(() => {
    const { fps, memory, connectionType, isSlowConnection } = metrics;
    
    return {
      enable3D: fps >= 30 && (!memory || memory.used < 100) && !isSlowConnection,
      enableAnimations: fps >= 45 && (!memory || memory.used < 80),
      imageQuality: isSlowConnection ? 'low' : memory && memory.used > 100 ? 'medium' : 'high',
      enablePreload: !isSlowConnection && (!memory || memory.used < 60),
      enableLazyLoading: memory && memory.used > 80,
      enableServiceWorker: !isSlowConnection,
      enableCompression: memory && memory.used > 100 || isSlowConnection,
      reducedMotion: fps < 30 || (memory && memory.used > 120)
    };
  }, [metrics]);

  return {
    metrics,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    getPerformanceScore,
    getOptimizedSettings,
    recommendations: metrics.recommendations || []
  };
};