import React, { useState } from 'react';
import { motion } from 'framer-motion';

const InteractiveButton = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false,
  className = '',
  icon = null,
  ...props 
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const variants = {
    primary: {
      base: 'bg-gradient-primary hover:bg-gradient-ocean text-white border-primary-400/30',
      glow: 'hover:shadow-glow-primary-lg',
      focus: 'focus:ring-4 focus:ring-primary-400/20'
    },
    secondary: {
      base: 'bg-gradient-secondary hover:bg-gradient-cosmic text-white border-secondary-400/30',
      glow: 'hover:shadow-glow-secondary-lg', 
      focus: 'focus:ring-4 focus:ring-secondary-400/20'
    },
    accent: {
      base: 'bg-gradient-accent hover:bg-gradient-sunset text-white border-accent-400/30',
      glow: 'hover:shadow-glow-accent-lg',
      focus: 'focus:ring-4 focus:ring-accent-400/20'
    },
    success: {
      base: 'bg-gradient-success hover:bg-gradient-forest text-white border-success-400/30',
      glow: 'hover:shadow-glow-success-lg',
      focus: 'focus:ring-4 focus:ring-success-400/20'
    },
    outline: {
      base: 'bg-transparent hover:bg-primary-400/10 text-primary-300 hover:text-white border-primary-400/50 hover:border-primary-400',
      glow: 'hover:shadow-glow-primary-md',
      focus: 'focus:ring-4 focus:ring-primary-400/20'
    },
    ghost: {
      base: 'bg-transparent hover:bg-dark-800/50 text-dark-300 hover:text-white border-transparent hover:border-dark-600',
      glow: 'hover:shadow-card-md',
      focus: 'focus:ring-4 focus:ring-dark-600/20'
    }
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-card-md',
    md: 'px-6 py-3 text-base rounded-card-lg', 
    lg: 'px-8 py-4 text-lg rounded-card-xl',
    xl: 'px-10 py-5 text-xl rounded-card-2xl'
  };

  const currentVariant = variants[variant];
  const currentSize = sizes[size];

  const buttonVariants = {
    idle: { 
      scale: 1, 
      y: 0,
      rotateX: 0,
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
    },
    hover: { 
      scale: 1.02, 
      y: -2,
      rotateX: 5,
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17
      }
    },
    tap: { 
      scale: 0.98, 
      y: 0,
      rotateX: -2,
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
      transition: {
        type: "spring",
        stiffness: 600,
        damping: 20
      }
    },
    disabled: {
      scale: 1,
      opacity: 0.6,
      cursor: 'not-allowed'
    }
  };

  const rippleVariants = {
    initial: { scale: 0, opacity: 0.6 },
    animate: { 
      scale: 4, 
      opacity: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const handleClick = (e) => {
    if (disabled || loading) return;
    
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);
    
    if (onClick) onClick(e);
  };

  return (
    <motion.button
      className={`
        relative overflow-hidden font-semibold border backdrop-blur-sm
        transition-all duration-300 ease-out
        disabled:cursor-not-allowed disabled:opacity-60
        focus:outline-none
        ${currentVariant.base}
        ${currentVariant.glow}
        ${currentVariant.focus}
        ${currentSize}
        ${className}
      `}
      variants={buttonVariants}
      initial="idle"
      whileHover={!disabled && !loading ? "hover" : "idle"}
      whileTap={!disabled && !loading ? "tap" : "idle"}
      animate={disabled ? "disabled" : "idle"}
      onClick={handleClick}
      disabled={disabled || loading}
      style={{ 
        perspective: '1000px',
        transformStyle: 'preserve-3d'
      }}
      {...props}
    >
      {/* Ripple Effect */}
      {isPressed && (
        <motion.span
          className="absolute inset-0 bg-white/20 rounded-full"
          variants={rippleVariants}
          initial="initial"
          animate="animate"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        />
      )}

      {/* Loading Spinner */}
      {loading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-inherit rounded-inherit"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </motion.div>
      )}

      {/* Content */}
      <motion.div
        className={`flex items-center justify-center gap-2 relative z-10 ${loading ? 'opacity-0' : 'opacity-100'}`}
        transition={{ duration: 0.2 }}
      >
        {icon && (
          <motion.span
            className="text-current"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            {icon}
          </motion.span>
        )}
        {children}
      </motion.div>

      {/* Shine Effect */}
      <motion.div
        className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0"
        whileHover={{
          opacity: [0, 1, 0],
          x: ['-100%', '100%'],
          transition: {
            duration: 0.8,
            ease: "easeOut"
          }
        }}
      />

      {/* Gradient Border Animation */}
      <motion.div
        className="absolute inset-0 rounded-inherit bg-gradient-to-r from-transparent via-current to-transparent opacity-0"
        style={{
          padding: '1px',
          background: 'linear-gradient(45deg, transparent, currentColor, transparent)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'subtract'
        }}
        whileHover={{
          opacity: [0, 0.3, 0],
          transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      />
    </motion.button>
  );
};

export default InteractiveButton;