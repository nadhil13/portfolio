import { useEffect, useState, useCallback } from 'react';
import { useScroll, useTransform, useSpring } from 'framer-motion';

export const useScrollAnimations = () => {
  const [scrollDirection, setScrollDirection] = useState('down');
  const [scrollSpeed, setScrollSpeed] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  const { scrollY, scrollYProgress } = useScroll();
  
  // Smooth scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Parallax transforms
  const parallaxSlow = useTransform(scrollY, [0, 1000], [0, -100]);
  const parallaxMedium = useTransform(scrollY, [0, 1000], [0, -200]);
  const parallaxFast = useTransform(scrollY, [0, 1000], [0, -400]);
  
  // Rotation based on scroll
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 45]);
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, 45]);
  
  // Scale transforms
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 0.8]);
  const scaleX = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const scaleY = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  
  // Opacity fades
  const fadeIn = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const fadeOut = useTransform(scrollYProgress, [0.8, 1], [1, 0]);
  const fadeInOut = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // Monitor scroll behavior
  useEffect(() => {
    let scrollTimeout;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const speed = Math.abs(currentScrollY - lastScrollY);
      
      setScrollSpeed(speed);
      setScrollDirection(currentScrollY > lastScrollY ? 'down' : 'up');
      setLastScrollY(currentScrollY);
      setIsScrolling(true);
      
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
        setScrollSpeed(0);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [lastScrollY]);

  // Section-based animations
  const useSectionAnimation = useCallback((threshold = 0.1) => {
    const [isInView, setIsInView] = useState(false);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            if (!hasAnimated) {
              setHasAnimated(true);
            }
          } else {
            setIsInView(false);
          }
        },
        { threshold }
      );

      const element = document.querySelector('[data-scroll-section]');
      if (element) observer.observe(element);

      return () => observer.disconnect();
    }, [threshold, hasAnimated]);

    return { isInView, hasAnimated };
  }, []);

  // Stagger animations
  const getStaggerVariants = useCallback((delay = 0.1) => ({
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: delay
      }
    }
  }), []);

  // Complex entrance animations
  const getEntranceVariants = useCallback((direction = 'up') => {
    const directions = {
      up: { y: 100 },
      down: { y: -100 },
      left: { x: -100 },
      right: { x: 100 },
      scale: { scale: 0 },
      rotate: { rotate: 180, scale: 0 }
    };

    return {
      hidden: {
        opacity: 0,
        ...directions[direction]
      },
      visible: {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        rotate: 0,
        transition: {
          type: "spring",
          stiffness: 100,
          damping: 15,
          mass: 1
        }
      }
    };
  }, []);

  // Morphing animations
  const getMorphVariants = useCallback(() => ({
    initial: {
      borderRadius: "20px",
      scale: 1
    },
    hover: {
      borderRadius: "50px",
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    tap: {
      borderRadius: "10px",
      scale: 0.95,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  }), []);

  // Floating animation
  const getFloatingVariants = useCallback((intensity = 1) => ({
    initial: { y: 0 },
    animate: {
      y: [-10 * intensity, 10 * intensity, -10 * intensity],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }), []);

  // Pulse glow animation
  const getPulseGlowVariants = useCallback((color = "rgba(0,255,220,0.5)") => ({
    initial: {
      boxShadow: `0 0 0 ${color}`
    },
    animate: {
      boxShadow: [
        `0 0 0 ${color}`,
        `0 0 20px ${color}`,
        `0 0 40px ${color}`,
        `0 0 20px ${color}`,
        `0 0 0 ${color}`
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }), []);

  return {
    // Scroll state
    scrollY,
    scrollYProgress,
    smoothProgress,
    scrollDirection,
    scrollSpeed,
    isScrolling,

    // Parallax transforms
    parallaxSlow,
    parallaxMedium,
    parallaxFast,

    // Transform animations
    rotate,
    rotateX,
    rotateY,
    scale,
    scaleX,
    scaleY,

    // Opacity animations
    fadeIn,
    fadeOut,
    fadeInOut,

    // Utility functions
    useSectionAnimation,
    getStaggerVariants,
    getEntranceVariants,
    getMorphVariants,
    getFloatingVariants,
    getPulseGlowVariants
  };
};