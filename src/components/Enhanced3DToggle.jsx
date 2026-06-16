import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Enhanced3DToggle = ({ is3dEnabled, setIs3dEnabled, className = '' }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  
  const handleToggle = async () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Add transition delay for smooth experience
    setTimeout(() => {
      setIs3dEnabled(!is3dEnabled);
    }, 200);
    
    // Reset transition state
    setTimeout(() => {
      setIsTransitioning(false);
    }, 800);
  };

  const variants = {
    enabled: {
      backgroundColor: 'rgba(0, 255, 220, 0.2)',
      borderColor: 'rgba(0, 255, 220, 0.5)',
      scale: 1,
      rotateY: 0
    },
    disabled: {
      backgroundColor: 'rgba(100, 116, 139, 0.2)',
      borderColor: 'rgba(100, 116, 139, 0.3)',
      scale: 1,
      rotateY: 0
    },
    transitioning: {
      scale: [1, 0.95, 1],
      rotateY: [0, 180, 360],
      transition: {
        duration: 0.8,
        ease: "easeInOut"
      }
    }
  };

  const iconVariants = {
    enabled: {
      rotateY: 0,
      scale: 1,
      opacity: 1
    },
    disabled: {
      rotateY: 0,
      scale: 1,
      opacity: 0.7
    },
    transitioning: {
      rotateY: 180,
      scale: [1, 1.2, 1],
      transition: {
        duration: 0.8,
        ease: "easeInOut"
      }
    }
  };

  const getStatusText = () => {
    if (isTransitioning) {
      return is3dEnabled ? 'Disabling 3D...' : 'Enabling 3D...';
    }
    return is3dEnabled ? '3D Mode: ON' : '3D Mode: OFF';
  };

  const getStatusIcon = () => {
    if (isTransitioning) {
      return '⚡';
    }
    return is3dEnabled ? '🎮' : '🖼️';
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main Toggle Button */}
      <motion.button
        onClick={handleToggle}
        disabled={isTransitioning}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        variants={variants}
        animate={
          isTransitioning 
            ? 'transitioning' 
            : is3dEnabled 
              ? 'enabled' 
              : 'disabled'
        }
        whileHover={!isTransitioning ? { scale: 1.05 } : {}}
        whileTap={!isTransitioning ? { scale: 0.95 } : {}}
        className="relative group flex items-center gap-3 px-6 py-3 rounded-card-lg border-2 backdrop-blur-sm font-semibold transition-all duration-300 disabled:cursor-not-allowed"
        style={{
          perspective: '1000px',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Background Glow */}
        <motion.div
          className="absolute inset-0 rounded-card-lg blur-md"
          animate={{
            backgroundColor: is3dEnabled 
              ? 'rgba(0, 255, 220, 0.1)' 
              : 'rgba(100, 116, 139, 0.1)',
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Icon with 3D Animation */}
        <motion.span
          variants={iconVariants}
          animate={
            isTransitioning 
              ? 'transitioning' 
              : is3dEnabled 
                ? 'enabled' 
                : 'disabled'
          }
          className="text-2xl relative z-10"
          style={{
            transformStyle: 'preserve-3d'
          }}
        >
          {getStatusIcon()}
        </motion.span>

        {/* Text with Smooth Transition */}
        <div className="relative z-10 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.span
              key={getStatusText()}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`block text-sm font-medium ${
                is3dEnabled 
                  ? 'text-primary-300' 
                  : 'text-slate-400'
              }`}
            >
              {getStatusText()}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Loading Indicator */}
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            />
          </motion.div>
        )}

        {/* Ripple Effect */}
        <motion.div
          className="absolute inset-0 rounded-card-lg"
          initial={{ scale: 1, opacity: 0 }}
          whileTap={{ scale: 1.5, opacity: [0, 0.3, 0] }}
          transition={{ duration: 0.6 }}
          style={{
            background: is3dEnabled 
              ? 'rgba(0, 255, 220, 0.2)' 
              : 'rgba(100, 116, 139, 0.2)'
          }}
        />
      </motion.button>

      {/* Enhanced Tooltip */}
      <AnimatePresence>
        {showTooltip && !isTransitioning && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 z-20"
          >
            <div className="bg-dark-900/95 backdrop-blur-md text-white text-caption-md px-4 py-2 rounded-card-md border border-dark-700/50 shadow-card-lg">
              <p className="font-medium whitespace-nowrap">
                {is3dEnabled ? 'Click to disable 3D effects' : 'Click to enable 3D effects'}
              </p>
              <p className="text-caption-sm text-dark-400 mt-1">
                {is3dEnabled ? 'Better performance' : 'Enhanced visuals'}
              </p>
              
              {/* Tooltip Arrow */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                <div className="border-4 border-transparent border-t-dark-900/95"></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Indicator */}
      <motion.div
        className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-dark-900"
        animate={{
          backgroundColor: is3dEnabled ? '#00ffdc' : '#64748b',
          scale: isTransitioning ? [1, 1.3, 1] : 1,
        }}
        transition={{
          backgroundColor: { duration: 0.3 },
          scale: { duration: 0.8, repeat: isTransitioning ? Infinity : 0 }
        }}
      />

      {/* Performance Hint */}
      <AnimatePresence>
        {is3dEnabled && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="absolute top-full left-0 mt-2 text-caption-sm text-primary-400 font-medium"
          >
            <div className="flex items-center gap-1">
              <span>⚡</span>
              <span>3D Enhanced</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Enhanced3DToggle;