import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const SEOOptimizer = ({ 
  title = "Nadhil - Full Stack Developer & Cybersecurity",
  description = "Experienced Full Stack Developer specializing in React, Node.js, and modern web technologies. Creating stunning digital experiences with clean code and beautiful design.",
  keywords = "full stack developer, react developer, nodejs, web development, ui ux design, portfolio, javascript, typescript, frontend, backend",
  image = "/assets/ZAINFIX.png",
  url = "https://nadhilportfolio.site",
  type = "website"
}) => {
  
  useEffect(() => {
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
        "React.js",
        "Node.js",
        "JavaScript",
        "TypeScript",
        "Cybersecurity",
        "Web Development",
        "Frontend Development",
        "Backend Development"
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

    // Add structured data to head
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // Performance monitoring
    if ('performance' in window) {
      // Monitor Core Web Vitals
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(console.log);
        getFID(console.log);
        getFCP(console.log);
        getLCP(console.log);
        getTTFB(console.log);
      });
    }

    // Cleanup
    return () => {
      document.head.removeChild(script);
    };
  }, [description, image, url]);

  // Generate rich social media meta tags
  const getMetaTags = () => {
    const canonical = `${url}${window.location.pathname}`;
    
    return [
      // Basic Meta Tags
      { name: "description", content: description },
      { name: "keywords", content: keywords },
      { name: "author", content: "Nadhil" },
      { name: "robots", content: "index, follow" },
      { name: "googlebot", content: "index, follow" },
      
      // Open Graph Meta Tags
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:image", content: image },
      { property: "og:url", content: canonical },
      { property: "og:type", content: type },
      { property: "og:site_name", content: "Nadhil Portfolio" },
      { property: "og:locale", content: "en_US" },
      
      // Twitter Card Meta Tags
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
      { name: "twitter:creator", content: "@your_twitter" },
      
      // Additional SEO Meta Tags
      { name: "theme-color", content: "#00FFDC" },
      { name: "msapplication-TileColor", content: "#00FFDC" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      
      // Geo Tags
      { name: "geo.region", content: "ID" },
      { name: "geo.placename", content: "Indonesia" },
      
      // Performance & Caching
      { httpEquiv: "Cache-Control", content: "public, max-age=31536000" },
    ];
  };

  return (
    <Helmet>
      {/* Title */}
      <title>{title}</title>
      
      {/* Canonical URL */}
      <link rel="canonical" href={`${url}${window.location.pathname}`} />
      
      {/* Meta Tags */}
      {getMetaTags().map((tag, index) => (
        tag.property ? (
          <meta key={index} property={tag.property} content={tag.content} />
        ) : tag.httpEquiv ? (
          <meta key={index} httpEquiv={tag.httpEquiv} content={tag.content} />
        ) : (
          <meta key={index} name={tag.name} content={tag.content} />
        )
      ))}
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://images.unsplash.com" />
      
      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      
      {/* Favicon */}
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Critical CSS (inline for better performance) */}
      <style>{`
        * {
          box-sizing: border-box;
        }
        
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          background-color: #060010;
          color: #ffffff;
        }
        
        /* Loading state */
        .loading-skeleton {
          background: linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        /* Performance optimizations */
        img {
          max-width: 100%;
          height: auto;
        }
        
        [loading="lazy"] {
          opacity: 0;
          transition: opacity 0.3s;
        }
        
        [loading="lazy"].loaded {
          opacity: 1;
        }
      `}</style>
    </Helmet>
  );
};

export default SEOOptimizer;