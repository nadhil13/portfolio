import { useEffect } from 'react';

const SEOHead = ({ 
  title = "Nadhil - Full Stack Developer & Cybersecurity",
  description = "Experienced Full Stack Developer specializing in React, Node.js, and modern web technologies. Creating stunning digital experiences with clean code and beautiful design.",
  keywords = "full stack developer, react developer, nodejs, web development, ui ux design, portfolio, javascript, typescript, frontend, backend",
  image = "/assets/ZAINFIX.png",
  url = "https://nadhilportfolio.site",
  type = "website"
}) => {
  
  useEffect(() => {
    // Update document title
    document.title = title;
    
    // Update meta tags
    const updateMetaTag = (name, content, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector);
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // Basic Meta Tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', 'Nadhil');
    updateMetaTag('robots', 'index, follow');
    
    // Open Graph Meta Tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:url', `${url}${window.location.pathname}`, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:site_name', 'Nadhil Portfolio', true);
    
    // Twitter Card Meta Tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);
    
    // Structured Data for SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Nadhil",
      "alternateName": "Full Stack Developer",
      "description": description,
      "url": url,
      "image": image,
      "sameAs": [
        "https://github.com/nadhil13",
        "https://linkedin.com/in/nadhil13",
        "https://instagram.com/_ndlasy"
      ],
      "jobTitle": "Full Stack Developer",
      "worksFor": {
        "@type": "Organization",
        "name": "Freelance"
      },
      "knowsAbout": [
        "React.js", "Node.js", "JavaScript", "TypeScript",
        "Cybersecurity", "Web Development", "Frontend Development", "Backend Development"
      ],
      "hasOccupation": {
        "@type": "Occupation",
        "name": "Full Stack Developer",
        "occupationLocation": {
          "@type": "Country",
          "name": "Indonesia"
        },
        "description": "Specializes in creating modern web applications using React, Node.js, and cutting-edge technologies"
      }
    };

    // Add or update structured data
    let script = document.querySelector('script[type="application/ld+json"]');
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.innerHTML = JSON.stringify(structuredData);

    // Add canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `${url}${window.location.pathname}`;

    // Performance monitoring
    if ('performance' in window && 'PerformanceObserver' in window) {
      // Monitor Core Web Vitals
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log(`${entry.name}: ${entry.value}ms`);
        }
      });
      
      try {
        observer.observe({ entryTypes: ['measure', 'navigation'] });
      } catch (e) {
        // Fallback for older browsers
        console.log('Performance Observer not fully supported');
      }
    }

  }, [title, description, keywords, image, url, type]);

  return null; // This component doesn't render anything
};

export default SEOHead;