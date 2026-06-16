import { useEffect, useState } from 'react';

const PerformanceOptimizer = () => {
  const [optimizations, setOptimizations] = useState([]);
  
  useEffect(() => {
    // Image Lazy Loading Optimization
    const optimizeImages = () => {
      const images = document.querySelectorAll('img[loading="lazy"]');
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.classList.add('loaded');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach((img) => imageObserver.observe(img));
      
      return () => imageObserver.disconnect();
    };

    // Preload Critical Resources
    const preloadCriticalResources = () => {
      const criticalResources = [
        '/assets/ZAINFIX.png',
        '/assets/BGZENBGIJObulat.png',
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap'
      ];

      criticalResources.forEach((resource) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        
        if (resource.includes('.png') || resource.includes('.jpg')) {
          link.as = 'image';
        } else if (resource.includes('fonts.googleapis.com')) {
          link.as = 'style';
          link.crossOrigin = 'anonymous';
        }
        
        link.href = resource;
        document.head.appendChild(link);
      });
    };

    // Code Splitting Hints
    const addModulePreloadHints = () => {
      const chunks = [
        '/src/components/Spline.jsx',
        '/src/components/ProjectSection.jsx',
        '/src/components/Contact.jsx'
      ];

      chunks.forEach((chunk) => {
        const link = document.createElement('link');
        link.rel = 'modulepreload';
        link.href = chunk;
        document.head.appendChild(link);
      });
    };

    // Service Worker Registration
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator && 'production' === 'production') {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('SW registered:', registration);
        } catch (error) {
          console.log('SW registration failed:', error);
        }
      }
    };

    // Resource Hints
    const addResourceHints = () => {
      const domains = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
        'https://images.unsplash.com',
        'https://prod.spline.design'
      ];

      domains.forEach((domain) => {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = domain;
        document.head.appendChild(link);
      });
    };

    // Critical CSS Injection
    const injectCriticalCSS = () => {
      const criticalCSS = `
        /* Critical above-the-fold styles */
        body { 
          font-display: swap; 
          -webkit-font-smoothing: antialiased;
        }
        
        /* Loading skeletons */
        .skeleton {
          background: linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        /* Reduce layout shift */
        img, iframe, video {
          max-width: 100%;
          height: auto;
        }
      `;

      const style = document.createElement('style');
      style.textContent = criticalCSS;
      document.head.insertBefore(style, document.head.firstChild);
    };

    // Execute optimizations
    const cleanup1 = optimizeImages();
    preloadCriticalResources();
    addModulePreloadHints();
    registerServiceWorker();
    addResourceHints();
    injectCriticalCSS();

    // Performance monitoring
    if ('performance' in window) {
      const perfObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'measure') {
            console.log(`Performance: ${entry.name} - ${entry.duration}ms`);
          }
        });
      });

      try {
        perfObserver.observe({ entryTypes: ['measure', 'navigation'] });
      } catch (e) {
        console.log('Performance Observer not supported');
      }
    }

    // Cleanup
    return () => {
      if (cleanup1) cleanup1();
    };
  }, []);

  return null; // This component doesn't render anything
};

export default PerformanceOptimizer;