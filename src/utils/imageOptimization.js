// Image optimization utilities
export const getOptimizedImageUrl = (originalUrl, options = {}) => {
  const {
    width = 'auto',
    height = 'auto',
    quality = 75,
    format = 'webp',
    blur = false
  } = options;

  // For external CDN services (Cloudinary, Vercel, etc.)
  if (originalUrl.includes('cloudinary.com')) {
    const baseUrl = originalUrl.split('/upload/')[0] + '/upload/';
    const imagePath = originalUrl.split('/upload/')[1];
    
    let transformations = [];
    
    if (width !== 'auto') transformations.push(`w_${width}`);
    if (height !== 'auto') transformations.push(`h_${height}`);
    if (quality !== 75) transformations.push(`q_${quality}`);
    if (format !== 'jpg') transformations.push(`f_${format}`);
    if (blur) transformations.push('e_blur:300');
    
    return transformations.length > 0 
      ? `${baseUrl}${transformations.join(',')}/${imagePath}`
      : originalUrl;
  }

  // For Vercel Image Optimization
  if (process.env.NODE_ENV === 'production' && originalUrl.startsWith('/')) {
    const params = new URLSearchParams();
    if (width !== 'auto') params.set('w', width);
    if (height !== 'auto') params.set('h', height);
    if (quality !== 75) params.set('q', quality);
    
    return `/_next/image?url=${encodeURIComponent(originalUrl)}&${params.toString()}`;
  }

  // For development or unsupported URLs, return original
  return originalUrl;
};

export const preloadImage = (src, options = {}) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    // Apply optimization
    const optimizedSrc = getOptimizedImageUrl(src, options);
    
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = optimizedSrc;
    
    // Add to document head for browser preloading
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = optimizedSrc;
    document.head.appendChild(link);
  });
};

export const preloadCriticalImages = async (imageUrls) => {
  const preloadPromises = imageUrls.map(url => 
    preloadImage(url, { width: 800, quality: 80 })
  );
  
  try {
    await Promise.all(preloadPromises);
    console.log('Critical images preloaded successfully');
  } catch (error) {
    console.warn('Some images failed to preload:', error);
  }
};

export const generateBlurDataURL = (width = 10, height = 10) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  
  // Create gradient
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#1e293b');
  gradient.addColorStop(1, '#0f172a');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  return canvas.toDataURL();
};

export const isImageCached = (src) => {
  const img = new Image();
  img.src = src;
  return img.complete && img.naturalHeight !== 0;
};

export const observeImagePerformance = (imageElement, callback) => {
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name.includes(imageElement.src)) {
          callback({
            loadTime: entry.responseEnd - entry.fetchStart,
            size: entry.transferSize,
            cached: entry.transferSize === 0
          });
        }
      }
    });
    
    try {
      observer.observe({ entryTypes: ['resource'] });
    } catch (e) {
      console.warn('Performance Observer not supported for images');
    }
    
    return () => observer.disconnect();
  }
  
  return () => {};
};