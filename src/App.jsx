// src/App.jsx
import React, { useState, useEffect, useCallback } from 'react'; // Impor useState
import Header from './components/Header';
import Squares from './components/Squares';
import TextGenerateEffect from "./components/text-generate-effect";
import GradientText from './components/GradientText';
import { AnimatedGradientTextDemo } from './components/AnimatedGradientTextDemo';
import Skills from './components/Skills';
import { ButtonMovingBorder } from './components/MovingBorderButton';
import { motion } from "framer-motion";
// Tambahkan FaCube untuk ikon tombol
import { FaGithub, FaInstagram, FaLinkedin, FaDownload, FaBriefcase, FaCode, FaCertificate, FaGlobe, FaArrowRight, FaCube } from 'react-icons/fa';
import ProfileCard from './components/ProfileCard/ProfileCard';
import ZAINFIX from './assets/images/ZAINFIX.png';
import { IconCloud } from './components/IconCloud';
import { VelocityScroll } from './components/VelocityScroll';
import ProjectSection from './components/ProjectSection';
import Contact from './components/Contact';
import { NavbarProvider } from './contexts/NavbarContext';
import { AdminProvider } from './contexts/AdminContext';
import { ThemeProvider } from './contexts/ThemeContext';

import InteractiveButton from './components/InteractiveButton';
import LazyImage from './components/LazyImage';
import Enhanced3DToggle from './components/Enhanced3DToggle';

import ThemeToggle from './components/ThemeToggle';
import GlassmorphicCard from './components/GlassmorphicCard';
import NeumorphicElement from './components/NeumorphicElement';
import { useScrollAnimations } from './hooks/useScrollAnimations';

import LiveProjectPreview from './components/LiveProjectPreview';
import AdvancedContactForm from './components/AdvancedContactForm';
import SEOHead from './components/SEOHead';
import PerformanceOptimizer from './components/PerformanceOptimizer';
import ResponsiveWrapper from './components/ResponsiveWrapper';
import ResponsiveDebugger from './components/ResponsiveDebugger';

import { useResponsive } from './hooks/useResponsive';

import Lanyard from './components/Lanyard/Lanyard';

// Enhanced Safe Spline Component dengan advanced error handling dan retry mechanism
const SafeSpline = ({ scene, className, onLoadStateChange, ...props }) => {
  const [Spline, setSpline] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [loadProgress, setLoadProgress] = useState(0);
  const [connectionSpeed, setConnectionSpeed] = useState('unknown');
  const maxRetries = 2; // Reduced from 3 to 2

  // Detect connection speed with safety checks
  useEffect(() => {
    try {
      if (typeof navigator !== 'undefined' && 'connection' in navigator) {
        const connection = navigator?.connection || navigator?.mozConnection || navigator?.webkitConnection;
        if (connection?.effectiveType) {
          setConnectionSpeed(connection.effectiveType);
        }
      }
    } catch (err) {
      console.warn('Connection speed detection failed:', err);
      setConnectionSpeed('unknown');
    }
  }, []);

  const loadSpline = useCallback(async (attempt = 1) => {
    try {
      // Skip on slow connections or errors
      if (connectionSpeed === 'slow-2g') {
        throw new Error('Connection too slow for Spline');
      }

      setLoading(true);
      setError(false);
      setLoadProgress(0);
      
      // Simulate loading progress
      const progressInterval = setInterval(() => {
        setLoadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      // Load Spline with timeout
      const timeoutPromise = new Promise((_, reject) => {
        const timeout = connectionSpeed === '2g' ? 8000 : 5000;
        setTimeout(() => reject(new Error('Spline loading timeout')), timeout);
      });

      const loadPromise = (async () => {
        try {
          const module = await import('@splinetool/react-spline');
          clearInterval(progressInterval);
          setLoadProgress(100);
          return module.default;
        } catch (importErr) {
          clearInterval(progressInterval);
          throw new Error(`Failed to import Spline: ${importErr.message}`);
        }
      })();

      const SplineComponent = await Promise.race([loadPromise, timeoutPromise]);
      
      setSpline(() => SplineComponent);
      setError(false);
      setLoading(false);
      onLoadStateChange?.({ loading: false, error: false, loaded: true });
      
    } catch (err) {
      console.warn(`Spline loading attempt ${attempt} failed:`, err.message);
      setLoadProgress(0);
      
      if (attempt < maxRetries) {
        setRetryCount(attempt);
        // Retry dengan delay
        setTimeout(() => {
          loadSpline(attempt + 1);
        }, 1000 * attempt);
      } else {
        // Max retries reached, show fallback
        setLoading(false);
        setError(true);
        onLoadStateChange?.({ loading: false, error: true, loaded: false });
      }
    }
  }, [connectionSpeed, onLoadStateChange]);

  useEffect(() => {
    loadSpline();
  }, [loadSpline]);

  if (loading) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent animate-pulse"></div>
        <div className="z-10 text-center">
          <div className="w-12 h-12 border-3 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-cyan-400 text-sm">Loading 3D Model...</p>
          {loadProgress > 0 && <p className="text-gray-400 text-xs mt-1">{Math.floor(loadProgress)}%</p>}
        </div>
      </div>
    );
  }

  if (error || !Spline) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl flex items-center justify-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent group-hover:from-cyan-500/10 transition-all"></div>
        <div className="z-10 text-center">
          <div className="text-4xl mb-3">🎨</div>
          <p className="text-gray-400 text-sm">3D Model Not Available</p>
          <p className="text-gray-500 text-xs mt-1">Check your connection and refresh</p>
        </div>
      </div>
    );
  }

  return (
    <Spline 
      scene={scene} 
      className={className}
      {...props}
    />
  );
};
        // Exponential backoff for retries
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        setTimeout(() => {
          setRetryCount(attempt);
          loadSpline(attempt + 1);
        }, delay);
      } else {
        setError(true);
        onLoadStateChange?.({ loading: false, error: true, loaded: false });
      }
    } finally {
      if (retryCount === 0) {
        setLoading(false);
      }
    }
  }, [connectionSpeed, maxRetries, onLoadStateChange, retryCount]);

  useEffect(() => {
    loadSpline();
  }, [loadSpline]);

  const handleRetry = () => {
    setRetryCount(0);
    loadSpline(1);
  };

  if (loading) {
    return (
      <div className={`${className} flex items-center justify-center bg-gradient-to-br from-dark-900/40 to-dark-800/60 rounded-card-xl border border-primary-400/20 backdrop-blur-sm`}>
        <div className="text-center text-primary-300 p-8">
          {/* 3D Loading Animation */}
          <motion.div
            className="relative mb-6"
            animate={{
              rotateY: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{
              rotateY: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <motion.div
              className="w-16 h-16 mx-auto rounded-card-lg bg-gradient-cosmic border border-primary-400/30 flex items-center justify-center shadow-glow-primary-md"
              style={{ 
                perspective: '1000px',
                transformStyle: 'preserve-3d'
              }}
            >
              <motion.span 
                className="text-3xl filter drop-shadow-lg"
                animate={{
                  rotateX: [0, 180, 360],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                🤖
              </motion.span>
            </motion.div>
          </motion.div>

          {/* Dynamic Loading Text */}
          <motion.div 
            className="text-body-md font-semibold mb-2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            {retryCount > 0 ? `Retrying... (${retryCount}/${maxRetries})` : 'Loading 3D Robot'}
          </motion.div>
          
          {/* Enhanced Progress Bar */}
          <div className="w-40 h-2 bg-dark-700 rounded-full overflow-hidden mx-auto mb-4">
            <motion.div
              className="h-full bg-gradient-primary rounded-full"
              animate={{ width: `${loadProgress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>

          {/* Connection Status */}
          <motion.p 
            className="text-caption-md text-dark-400 mb-2"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          >
            {connectionSpeed !== 'unknown' && `Connection: ${connectionSpeed.toUpperCase()}`}
          </motion.p>
          
          <p className="text-caption-sm text-dark-500">
            Initializing 3D environment... {Math.round(loadProgress)}%
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className={`${className} flex items-center justify-center bg-gradient-to-br from-dark-900/40 to-dark-800/60 rounded-card-xl border border-accent-400/20 backdrop-blur-sm`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center text-accent-300 p-8 space-y-4">
          <motion.div
            className="w-16 h-16 mx-auto rounded-card-lg bg-gradient-dark border border-accent-400/30 flex items-center justify-center shadow-glow-accent-md"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-3xl">⚠️</span>
          </motion.div>
          
          <div>
            <h3 className="text-heading-sm font-bold mb-2">3D Content Unavailable</h3>
            <p className="text-body-sm text-dark-400 mb-4 max-w-xs mx-auto">
              {retryCount >= maxRetries 
                ? 'Unable to load 3D model after multiple attempts'
                : 'Failed to load 3D content'
              }
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <InteractiveButton
              onClick={handleRetry}
              variant="accent"
              size="sm"
              disabled={loading}
              icon={<span>🔄</span>}
            >
              Try Again
            </InteractiveButton>
            
            <motion.button
              className="text-caption-md text-dark-500 hover:text-dark-300 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                // Fallback to 2D mode
                setError(false);
                onLoadStateChange?.({ loading: false, error: false, loaded: false, fallback: true });
              }}
            >
              Switch to 2D Preview
            </motion.button>
          </div>

          {/* Technical Details (for development) */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4 text-left">
              <summary className="text-caption-sm text-dark-500 cursor-pointer hover:text-dark-300">
                Technical Details
              </summary>
              <div className="mt-2 p-3 bg-dark-900/50 rounded-card-sm text-caption-sm text-dark-400">
                <p>Attempts: {retryCount}/{maxRetries}</p>
                <p>Connection: {connectionSpeed}</p>
                <p>Timestamp: {new Date().toLocaleTimeString()}</p>
              </div>
            </details>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={className}
    >
    <Spline 
      scene={scene} 
      {...props}
        onLoad={() => {
          onLoadStateChange?.({ loading: false, error: false, loaded: true });
        }}
        onError={(err) => {
          console.warn('Spline render error:', err);
        setError(true);
      }}
    />
    </motion.div>
  );
};


function App() {
  // 1. State untuk mengontrol visibilitas aset 3D (default: aktif)
  const [is3dEnabled, setIs3dEnabled] = useState(true); // Changed to true to enable 3D
  const [splineLoadState, setSplineLoadState] = useState({ loading: true, error: false, loaded: false });
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectPreview, setShowProjectPreview] = useState(false);
  
  // Responsive hook
  const { 
    device, 
    isMobileDevice, 
    isLandscapeMobile, 
    touchDevice, 
    shouldUseReducedMotion,
    getResponsiveValue 
  } = useResponsive();

  const [isLoading, setIsLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollDirection, setScrollDirection] = useState('down');
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLanyardVisible, setIsLanyardVisible] = useState(false);
  const [isProfileCardVisible, setIsProfileCardVisible] = useState(false);
  const [isIconCloudVisible, setIsIconCloudVisible] = useState(false);
  const [isVelocityScrollVisible, setIsVelocityScrollVisible] = useState(false);
  const [isContactVisible, setIsContactVisible] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  // Fungsi untuk toggle state
  const toggle3dAssets = () => {
    setIs3dEnabled(prev => !prev);
  };

  // Data untuk card statistik dengan color theming
  const stats = [
    { 
      icon: <FaCode />, 
      value: "8", 
      title: "TOTAL PROJECTS", 
      description: "Innovative web solutions crafted",
      color: "primary", // Cyan theme
      gradient: "gradient-primary"
    },
    { 
      icon: <FaCertificate />, 
      value: "17", 
      title: "CERTIFICATES", 
      description: "Professional skills validated",
      color: "success", // Emerald theme  
      gradient: "gradient-success"
    },
    { 
      icon: <FaGlobe />, 
      value: "3", 
      title: "YEARS OF EXPERIENCE", 
      description: "Continuous learning journey",
      color: "secondary", // Purple theme
      gradient: "gradient-secondary"
    },
  ];

    const openProjectPreview = (project) => {
    setSelectedProject(project);
    setShowProjectPreview(true);
  };

  const closeProjectPreview = () => {
    setShowProjectPreview(false);
    setSelectedProject(null);
  };

  return (
    <ThemeProvider>
      <AdminProvider>
        <NavbarProvider>
          <SEOHead />
          <PerformanceOptimizer />
        <div className="relative min-h-screen bg-[#060010] overflow-hidden">
          {/* LAPISAN 1: BACKGROUND ANIMASI */}
          <div className="absolute inset-0 z-0">
            <Squares speed={0.3} squareSize={35} direction="diagonal" borderColor="rgba(255, 255, 255, 0.03)" hoverFillColor="rgba(31, 137, 187, 0.53)" />
          </div>
          
          {/* 2. Tombol untuk mengaktifkan/menonaktifkan aset 3D */}
          <button
            onClick={toggle3dAssets}
            title={`Toggle 3D Assets (${is3dEnabled ? 'On' : 'Off'})`}
            className={`fixed top-24 right-4 z-50 p-3 rounded-full border backdrop-blur-sm transition-all duration-300 ease-in-out hover:scale-110
              ${is3dEnabled
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_2px_#00ffdc80]'
                : 'bg-slate-800/50 border-slate-700 text-slate-400'
              }`}
          >
            <FaCube className="h-5 w-5" />
          </button>

          {/* HEADER FIXED DI ATAS MAIN */}
          <Header />

          {/* MAIN CONTENT */}
          <main className="relative z-10">
            <ResponsiveWrapper className="max-content-width">
            {/* BAGIAN HERO */}
            <section 
              id="home" 
              className={`hero-section flex flex-col lg:flex-row items-center gap-6 md:gap-8 lg:gap-16 pt-20 sm:pt-24 md:pt-32 lg:pt-0 pb-6 md:pb-12 lg:pb-32 min-h-auto lg:min-h-0 ${
                isLandscapeMobile ? 'landscape:py-4' : ''
              }`}
            >
              {/* Blok Teks - Full width di mobile, shared di desktop */}
              <div className="w-full lg:flex-1 text-white space-y-2 md:space-y-3 lg:space-y-4 pt-2 md:pt-4 lg:pt-40 order-last lg:order-none px-3 sm:px-4 lg:px-0 text-center lg:text-left">
                {/* ... konten teks hero ... */}
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}>
                    <AnimatedGradientTextDemo />
                </motion.div>
                <motion.h1 
                  initial={{ opacity: 0, x: -60 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }} 
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-moderniz font-black leading-tight tracking-tight select-none text-primary-400" 
                  style={{ textShadow: `2px 2px 0 #060010, 4px 4px 0 #9575ff, 0 4px 12px rgba(0,255,220,0.6), 0 1px 0 #00ffdc` }}
                >
                    <span className="block">WELCOME TO MY</span>
                    <span className="block mt-1 md:mt-2 text-primary-400">
                      PORTFOLIO
                    </span>
                </motion.h1>
                <motion.div initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}>
                    <GradientText colors={["#40f2ffff", "#4079ff", "#40fffcff", "#4079ff", "#40f9ffff"]} animationSpeed={3} className="custom-class font-cascadia font-bold" />
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 40 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.7, delay: 0.55, ease: "easeOut" }}
                  className="space-y-2 sm:space-y-3"
                >
                    <p className="text-xs sm:text-sm md:text-base lg:text-lg font-cascadia leading-relaxed text-white max-w-full lg:max-w-2xl mx-auto lg:mx-0">
                      I craft responsive and visually engaging websites using React, Tailwind CSS, and modern web technologies.
                    </p>
                    <div className="flex flex-wrap gap-1 sm:gap-2 mt-2 sm:mt-3 justify-center lg:justify-start">
                      {['Frontend', 'Backend', 'Full-Stack', 'Cybersecurity'].map((skill, i) => (
                        <motion.span
                          key={skill}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.8 + i * 0.1 }}
                          className="px-2 py-1 sm:px-3 sm:py-1 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border border-primary-400/30 rounded-card-sm text-xs sm:text-sm md:text-base font-medium text-primary-200 backdrop-blur-sm"
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.7, ease: "easeOut" }}>
                    <Skills />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.0, ease: "easeOut" }} className="flex flex-row gap-2 sm:gap-3 mt-2 sm:mt-3 justify-center lg:justify-start">
                    <a href="https://github.com/nadhil13" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile" className="group relative flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-card-md border border-dark-700 bg-dark-900/80 text-white transition-all duration-300 hover:border-primary-400 hover:bg-dark-800 hover:shadow-glow-primary-md backdrop-blur-sm">
                        <FaGithub className="h-3 w-3 sm:h-4 sm:w-4 text-dark-400 transition-all duration-300 group-hover:text-primary-300" />
                    </a>
                    <a href="https://instagram.com/_ndlasy" target="_blank" rel="noopener noreferrer" aria-label="Instagram Profile" className="group relative flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-card-md border border-dark-700 bg-dark-900/80 text-white transition-all duration-300 hover:border-accent-400 hover:bg-dark-800 hover:shadow-glow-accent-md backdrop-blur-sm">
                        <FaInstagram className="h-3 w-3 sm:h-4 sm:w-4 text-dark-400 transition-all duration-300 group-hover:text-accent-300" />
                    </a>
                    <a href="https://linkedin.com/in/muhammad-nadhil-arsy-al-wafi" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile" className="group relative flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-card-md border border-dark-700 bg-dark-900/80 text-white transition-all duration-300 hover:border-secondary-400 hover:bg-dark-800 hover:shadow-glow-secondary-md backdrop-blur-sm">
                        <FaLinkedin className="h-3 w-3 sm:h-4 sm:w-4 text-dark-400 transition-all duration-300 group-hover:text-secondary-300" />
                    </a>
                </motion.div>
              </div>

              {/* 3. Render Lanyard hanya di desktop - tidak ada space kosong di mobile */}
              {is3dEnabled && (
                <div className="hidden lg:flex lg:flex-1 justify-center h-screen w-full order-first lg:order-none relative">
                  <Lanyard position={[0, 0, 15]} gravity={[0, -40, 0]} fov={18} transparent={true} />
                </div>
              )}
            </section>

            {/* BAGIAN ABOUT ME BARU */}
            <section
              id="about"
              className="py-8 md:py-12 lg:py-20 gap-0 w-full mx-0 pt-8 md:pt-12 lg:pt-16"
              style={{ width: "100vw", position: "relative", left: "50%", right: "50%", marginLeft: "-50vw", marginRight: "-50vw" }}
            >
              {/* ... Judul "ABOUT ME" ... */}
              <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8, ease: "easeOut" }} className="text-center">
                    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden mb-8 md:mb-12 lg:mb-16">
                        <VelocityScroll defaultVelocity={3} numRows={1} className="max-w-full">
                            <span className="font-moderniz font-black text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-tight tracking-wide" style={{ color: "#00ffdc", textShadow: "2px 2px 0 #000754, 4px 4px 0 #4079ff, 0 4px 12px #40ffaa, 0 1px 0 #00ffdc", background: "none", WebkitBackgroundClip: "unset", WebkitTextFillColor: "unset", animation: "none"}}>
                                ABOUT <span style={{ color: "#fff" }}>ME</span>
                            </span>
                        </VelocityScroll>
                        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#060010]"></div>
                        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[#060010]"></div>
                        <VelocityScroll defaultVelocity={-3} numRows={1} className="max-w-full">
                            <span className="font-moderniz font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl leading-tight" style={{ color: "#00ffdc", textShadow: "2px 2px 0 #000754, 4px 4px 0 #4079ff, 0 4px 12px #40ffaa, 0 1px 0 #00ffdc", background: "none", WebkitBackgroundClip: "unset", WebkitTextFillColor: "unset", animation: "none" }}>
                                ABOUT <span style={{ color: "#fff" }}>ME</span>
                            </span>
                        </VelocityScroll>
                    </div>
                    <p className="text-xs sm:text-sm md:text-base lg:text-lg text-primary-200/80 mt-4 font-cascadia px-4 sm:px-1 mb-6 md:mb-8 lg:mb-12 font-medium tracking-wide">
                        ✧ Passionate about coding and creative technology ✧
                    </p>
                </motion.div>

              <div className="flex flex-col md:flex-row items-center justify-center">
                {/* 3. Render Spline secara kondisional */}
                {is3dEnabled && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
                    className="md:w-1/3 flex justify-center"
                  >
                    <div className="w-full h-[420px] md:h-[530px] flex items-center justify-center">
                      <SafeSpline 
                        scene="https://prod.spline.design/FcZ66SFMX1YbF-0I/scene.splinecode" 
                        className="w-full h-full"
                      />
                    </div>
                  </motion.div>
                )}

                {/* KANAN: Teks & Tombol */}
                {/* 4. Sesuaikan lebar kolom teks secara dinamis */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  // Lebar berubah jika 3D dinonaktifkan
                  className={`text-white text-center md:text-left px-4 md:px-8 transition-all duration-700 ${is3dEnabled ? 'md:w-1/2' : 'md:w-2/3'}`}
                >
                  <div className="space-y-6">
                    <p className="text-body-md text-white font-moderniz font-medium tracking-wide" style={{ textShadow: "2px 2px 0 #060010, 2px 2px 8px rgba(149,117,255,0.4)" }}>
                      Hello, I'm
                    </p>
                    
                    <h3 className="text-heading-lg font-moderniz font-black leading-snug tracking-tight text-white" style={{ textShadow: "2px 2px 0 #060010, 4px 4px 0 #9575ff, 0 4px 12px rgba(0,255,220,0.5)" }}>
                      <span className="block">Muhammad Nadhil</span>
                      <span className="block text-white">Arsy Al-Wafi</span>
                    </h3>
                    
                    <div className="space-y-4">
                      <p className="text-body-md leading-relaxed font-cascadia text-white">
                        <span className="font-semibold text-white">Mahasiswa Teknik Informatika</span> di{' '}
                        <span className="font-medium text-white">Institut Teknologi Perusahaan Listrik Negara Jakarta</span>{' '}
                        dengan minat besar dalam pengembangan{' '}
                        <span className="font-semibold text-white">Fullstack Web Developer</span>.
                      </p>
                      
                      <p className="text-body-sm leading-relaxed font-cascadia text-white">
                        Saya selalu <span className="font-medium text-white">bersemangat untuk terus belajar</span> dan 
                        mengembangkan kemampuan dalam menciptakan{' '}
                        <span className="font-medium text-white">solusi digital yang inovatif</span> untuk 
                        menghadapi tantangan dunia teknologi modern.
                      </p>
                      
                      <div className="flex flex-wrap gap-2 pt-2">
                        {['Problem Solver', 'Creative Thinker', 'Team Player', 'Detail Oriented'].map((trait, i) => (
                          <span
                            key={trait}
                            className="px-2 py-1 bg-gradient-to-r from-dark-800/60 to-dark-700/40 border border-primary-400/20 rounded-card-sm text-body-sm font-medium text-white backdrop-blur-sm"
                          >
                            {trait}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <motion.blockquote 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="my-8 relative"
                  >
                    <div className="bg-gradient-to-r from-dark-900/80 to-dark-800/60 border-l-4 border-primary-400 p-6 rounded-r-card-lg backdrop-blur-sm shadow-glow-primary-sm">
                      <div className="flex items-start gap-4">
                        <div className="text-white text-xl font-bold leading-none">"</div>
                        <div>
                          <p className="text-body-sm font-cascadia italic text-white leading-relaxed">
                            Success follows those who put in the effort.
                          </p>
                          <footer className="mt-2 text-body-sm text-white font-medium">
                            — Nadhil Arsy
                          </footer>
                        </div>
                      </div>
                    </div>
                  </motion.blockquote>
                  <div className="flex flex-row sm:flex-row gap-responsive-sm mt-responsive-md justify-center md:justify-start items-center">
                    <motion.a
                      href="/certificates/cv.pdf"
                      download="Nadhil-CV.pdf"
                      className="relative overflow-hidden font-semibold border backdrop-blur-sm
                        transition-all duration-300 ease-out
                        focus:outline-none
                        bg-transparent hover:bg-dark-800/50 text-dark-300 hover:text-white border-transparent hover:border-dark-600
                        hover:shadow-card-md
                        focus:ring-4 focus:ring-dark-600/20
                        px-6 py-3 text-base rounded-card-lg
                        flex items-center justify-center gap-2"
                      whileHover={{ 
                        scale: 1.02, 
                        y: -2,
                        transition: {
                          type: "spring",
                          stiffness: 400,
                          damping: 17
                        }
                      }}
                      whileTap={{ 
                        scale: 0.98, 
                        y: 0,
                        transition: {
                          type: "spring",
                          stiffness: 600,
                          damping: 20
                        }
                      }}
                    >
                      <motion.span
                        className="text-current"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FaDownload />
                      </motion.span>
                      Download CV
                    </motion.a>
                    <InteractiveButton
                      as="a"
                      href="#projects"
                      variant="ghost"
                      size="md"
                      icon={<FaBriefcase />}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('projects')?.scrollIntoView({ 
                          behavior: 'smooth',
                          block: 'start'
                        });
                      }}
                    >
                      View Projects
                    </InteractiveButton>
                  </div>
                </motion.div>
              </div>
              
              {/* ... Statistik ... */}
              <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }} className="grid grid-cols-1 md:grid-cols-3 gap-responsive-md max-w-5xl mx-auto mt-responsive-lg px-responsive-sm md:px-0">
                {stats.map((stat, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: index * 0.15,
                      ease: "easeOut" 
                    }}
                    whileHover={{ 
                      y: -8,
                      transition: { duration: 0.3, ease: "easeOut" }
                    }}
                    className={`group relative p-6 rounded-card-xl bg-gradient-to-br from-dark-900/90 to-dark-950/80 border border-dark-800/60 shadow-card-lg backdrop-blur-sm transition-all duration-500 hover:border-${stat.color}-400/50 hover:shadow-glow-${stat.color}-md cursor-pointer overflow-hidden`}
                  >
                    {/* Dynamic background glow effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br from-${stat.color}-500/5 to-${stat.color}-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    
                    {/* Animated border */}
                    <div className="absolute inset-0 rounded-card-xl border-2 border-transparent bg-gradient-to-r from-cyan-400/50 via-blue-500/50 to-cyan-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" 
                         style={{
                           background: 'linear-gradient(45deg, transparent, transparent, rgba(0,255,220,0.3), transparent, transparent)',
                           backgroundSize: '300% 300%',
                           animation: 'group-hover:gradient-shift 2s ease-in-out infinite'
                         }} />
                    
                    <div className="relative z-10 flex justify-between items-start h-full">
                      <div className="flex flex-col flex-1">
                        {/* Icon with pulse animation and dynamic theming */}
                        <motion.div 
                          className={`p-4 mb-4 rounded-card-md bg-dark-800/80 border border-dark-700/60 w-max group-hover:bg-${stat.color}-900/30 group-hover:border-${stat.color}-600/50 transition-all duration-500`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.3 }}
                        >
                          <motion.div 
                            className={`text-2xl text-dark-400 group-hover:text-${stat.color}-300 transition-colors duration-500`}
                            animate={{ 
                              scale: [1, 1.05, 1],
                            }}
                            transition={{ 
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          >
                            {stat.icon}
                          </motion.div>
                        </motion.div>
                        
                        <h3 className="text-caption-lg font-extrabold uppercase tracking-widest text-dark-300 group-hover:text-white transition-colors duration-500 mb-3 leading-tight">
                          {stat.title}
                        </h3>
                        <p className="text-caption-md text-dark-400 group-hover:text-dark-200 transition-colors duration-500 leading-relaxed font-medium">
                          {stat.description}
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-end justify-between h-full ml-4">
                        {/* Animated counter with dynamic theming */}
                        <motion.p 
                          className={`text-display-sm font-black text-white group-hover:text-${stat.color}-300 transition-colors duration-500 font-moderniz tracking-tight leading-none`}
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                          style={{
                            textShadow: `0 0 20px ${stat.color === 'primary' ? 'rgba(0,255,220,0.3)' : 
                                                   stat.color === 'success' ? 'rgba(74,222,128,0.3)' : 
                                                   'rgba(149,117,255,0.3)'}`
                          }}
                        >
                          <span className="tabular-nums">{stat.value}</span>
                          <span className="text-heading-sm font-bold text-dark-300 group-hover:text-white/80 ml-1">+</span>
                        </motion.p>
                        
                        {/* Animated arrow */}
                        <motion.div
                          className="mt-auto"
                          whileHover={{ x: 4, y: -4 }}
                          transition={{ duration: 0.3 }}
                        >
                          <FaArrowRight className={`text-dark-600 group-hover:text-${stat.color}-400 transition-all duration-500 text-lg`} />
                        </motion.div>
                      </div>
                    </div>

                    {/* Floating particles effect */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-card-xl">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className={`absolute w-1 h-1 bg-${stat.color}-400/30 rounded-full`}
                          style={{
                            left: `${20 + i * 30}%`,
                            top: `${80 - i * 10}%`,
                          }}
                          animate={{
                            y: [-20, -60, -20],
                            opacity: [0, 1, 0],
                            scale: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 3 + i,
                            repeat: Infinity,
                            delay: i * 0.5,
                            ease: "easeInOut"
                          }}
                        />
                      ))}
                  </div>
                  </motion.div>
                ))}
              </motion.div>
            </section>

            {/* BAGIAN PROJECTS */}
            <section id="projects" className="py-responsive-lg md:py-18">
              <ProjectSection onProjectPreview={openProjectPreview} />
            

            </section>

            {/* BAGIAN CONTACT */}
            {/* SECTION 6: ADVANCED CONTACT FORM */}
            <section className="py-responsive-xl px-responsive-sm">
              <div className="max-w-6xl mx-auto">

                
                <AdvancedContactForm />
              </div>
            </section>

            {/* SECTION 7: SIMPLE CONTACT (LEGACY) */}
            <Contact />

            {/* FOOTER */}
            <footer className="py-responsive-lg text-center text-dark-400 space-y-3">
              <div className="text-body-md font-medium tracking-wide">
                © {new Date().getFullYear()}{' '}
                <span className="font-semibold text-primary-300">Muhammad Nadhil Arsy Al-Wafi</span>. 
                All rights reserved.
              </div>
              <div className="text-caption-lg font-medium">
                Built with <span className="text-red-400 font-semibold">♥</span> using{' '}
                <span className="font-semibold text-secondary-300">React</span>,{' '}
                <span className="font-semibold text-accent-300">Tailwind CSS</span>, and{' '}
                <span className="font-semibold text-success-300">Framer Motion</span>.
              </div>
            </footer>
            </ResponsiveWrapper>
          </main>

          {/* Live Project Preview Modal */}
          <LiveProjectPreview
            project={selectedProject}
            isOpen={showProjectPreview}
            onClose={closeProjectPreview}
          />
          
          {/* Responsive Debugger (Development Only) */}
          <ResponsiveDebugger />
          

        </div>
      </NavbarProvider>
    </AdminProvider>
    </ThemeProvider>
  );
}

export default App;