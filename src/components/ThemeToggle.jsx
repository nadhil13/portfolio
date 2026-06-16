import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme, isTransitioning } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const toggleVariants = {
    light: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderColor: 'rgba(255, 255, 255, 0.3)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
    },
    dark: {
      backgroundColor: 'rgba(15, 23, 42, 0.8)',
      borderColor: 'rgba(0, 255, 220, 0.3)',
      boxShadow: '0 8px 32px rgba(0, 255, 220, 0.1), inset 0 1px 0 rgba(0, 255, 220, 0.1)'
    }
  };

  const iconVariants = {
    initial: { scale: 0.8, rotate: -90, opacity: 0 },
    animate: { 
      scale: 1, 
      rotate: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    },
    exit: { 
      scale: 0.8, 
      rotate: 90, 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const backgroundVariants = {
    light: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      scale: 1
    },
    dark: {
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      scale: 1
    }
  };

  return (
    <motion.button
      onClick={toggleTheme}
      disabled={isTransitioning}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative group p-3 rounded-full border backdrop-blur-md transition-all duration-500 disabled:cursor-not-allowed overflow-hidden ${className}`}
      variants={toggleVariants}
      animate={theme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        background: theme === 'light' 
          ? 'rgba(255, 255, 255, 0.25)' 
          : 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)'
      }}
    >
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 rounded-full"
        variants={backgroundVariants}
        animate={theme}
        transition={{ duration: 0.5 }}
      />

      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent opacity-50" />
      
      {/* Loading spinner when transitioning */}
      {isTransitioning && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      )}

      {/* Icons */}
      <div className="relative z-10 w-6 h-6 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {theme === 'dark' ? (
            <motion.div
              key="sun"
              variants={iconVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="text-amber-400"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM2 13h2a1 1 0 0 0 0-2H2a1 1 0 0 0 0 2zm18 0h2a1 1 0 0 0 0-2h-2a1 1 0 0 0 0 2zM11 2v2a1 1 0 0 0 2 0V2a1 1 0 0 0-2 0zm0 18v2a1 1 0 0 0 2 0v-2a1 1 0 0 0-2 0zM5.99 4.58a1 1 0 0 0-1.41 1.41l1.06 1.06a1 1 0 0 0 1.41-1.41L5.99 4.58zm12.37 12.37a1 1 0 0 0-1.41 1.41l1.06 1.06a1 1 0 0 0 1.41-1.41l-1.06-1.06zm1.06-10.96a1 1 0 0 0-1.41-1.41l-1.06 1.06a1 1 0 0 0 1.41 1.41l1.06-1.06zM7.05 18.36a1 1 0 0 0-1.41-1.41l-1.06 1.06a1 1 0 0 0 1.41 1.41l1.06-1.06z"/>
              </svg>
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              variants={iconVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="text-slate-700"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21.64 13a1 1 0 0 0-1.05-.14 8.05 8.05 0 0 1-3.37.73 8.15 8.15 0 0 1-8.14-8.1 8.59 8.59 0 0 1 .25-2A1 1 0 0 0 8 2.36a10.14 10.14 0 1 0 14 11.69 1 1 0 0 0-.36-1.05zm-9.5 6.69A8.14 8.14 0 0 1 7.08 5.22v.27a10.15 10.15 0 0 0 10.14 10.14 9.79 9.79 0 0 0 2.1-.22 8.11 8.11 0 0 1-7.18 4.32z"/>
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hover effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
        initial={{ x: '-100%', opacity: 0 }}
        animate={{ 
          x: isHovered ? '100%' : '-100%',
          opacity: isHovered ? 1 : 0
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />

      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && !isTransitioning && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-20"
          >
            <div className="bg-black/80 backdrop-blur-md text-white text-caption-sm px-3 py-1 rounded-card-md border border-white/20 whitespace-nowrap">
              {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                <div className="border-4 border-transparent border-t-black/80"></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Neumorphic shadow effect */}
      <div 
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          boxShadow: theme === 'light'
            ? 'inset 2px 2px 5px rgba(0,0,0,0.1), inset -2px -2px 5px rgba(255,255,255,0.7)'
            : 'inset 2px 2px 5px rgba(0,0,0,0.5), inset -2px -2px 5px rgba(255,255,255,0.05)'
        }}
      />
    </motion.button>
  );
};

export default ThemeToggle;