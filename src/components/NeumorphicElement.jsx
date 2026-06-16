import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const NeumorphicElement = ({ 
  children, 
  className = '', 
  variant = 'raised',
  size = 'medium',
  interactive = false,
  ...props 
}) => {
  const { theme } = useTheme();

  const variants = {
    raised: {
      light: {
        background: 'linear-gradient(145deg, #f0f0f3, #cacace)',
        boxShadow: '9px 9px 16px #c8c8cc, -9px -9px 16px #f8f8fc',
        border: '1px solid rgba(255,255,255,0.3)'
      },
      dark: {
        background: 'linear-gradient(145deg, #1a202c, #2d3748)',
        boxShadow: '9px 9px 16px #161b26, -9px -9px 16px #1e2732',
        border: '1px solid rgba(0,255,220,0.1)'
      }
    },
    inset: {
      light: {
        background: 'linear-gradient(145deg, #cacace, #f0f0f3)',
        boxShadow: 'inset 9px 9px 16px #c8c8cc, inset -9px -9px 16px #f8f8fc',
        border: '1px solid rgba(0,0,0,0.1)'
      },
      dark: {
        background: 'linear-gradient(145deg, #2d3748, #1a202c)',
        boxShadow: 'inset 9px 9px 16px #161b26, inset -9px -9px 16px #1e2732',
        border: '1px solid rgba(0,255,220,0.05)'
      }
    },
    flat: {
      light: {
        background: '#e0e0e3',
        boxShadow: '5px 5px 10px #d1d1d5, -5px -5px 10px #eeeef1',
        border: '1px solid rgba(255,255,255,0.5)'
      },
      dark: {
        background: '#1a202c',
        boxShadow: '5px 5px 10px #151a24, -5px -5px 10px #1f2634',
        border: '1px solid rgba(0,255,220,0.1)'
      }
    },
    pressed: {
      light: {
        background: 'linear-gradient(145deg, #cacace, #f0f0f3)',
        boxShadow: 'inset 5px 5px 10px #d1d1d5, inset -5px -5px 10px #eeeef1',
        border: '1px solid rgba(0,0,0,0.2)'
      },
      dark: {
        background: 'linear-gradient(145deg, #2d3748, #1a202c)',
        boxShadow: 'inset 5px 5px 10px #151a24, inset -5px -5px 10px #1f2634',
        border: '1px solid rgba(0,255,220,0.2)'
      }
    }
  };

  const sizes = {
    small: 'p-3 rounded-card-md',
    medium: 'p-4 rounded-card-lg',
    large: 'p-6 rounded-card-xl',
    xlarge: 'p-8 rounded-card-2xl'
  };

  const currentVariant = variants[variant][theme];
  const currentSize = sizes[size];

  const interactiveVariants = {
    initial: { 
      scale: 1,
      ...currentVariant
    },
    hover: { 
      scale: 1.02,
      boxShadow: theme === 'light'
        ? '12px 12px 20px #c8c8cc, -12px -12px 20px #f8f8fc'
        : '12px 12px 20px #161b26, -12px -12px 20px #1e2732',
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    },
    tap: { 
      scale: 0.98,
      ...variants.pressed[theme],
      transition: {
        type: "spring",
        stiffness: 600,
        damping: 30
      }
    }
  };

  const Component = interactive ? motion.button : motion.div;

  return (
    <Component
      className={`relative transition-all duration-300 ${currentSize} ${className}`}
      style={currentVariant}
      variants={interactive ? interactiveVariants : {}}
      initial="initial"
      whileHover={interactive ? "hover" : {}}
      whileTap={interactive ? "tap" : {}}
      {...props}
    >
      {/* Subtle inner highlight */}
      <div 
        className="absolute top-1 left-1 right-1 h-px rounded-full opacity-50"
        style={{
          background: theme === 'light'
            ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(0,255,220,0.3), transparent)'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </Component>
  );
};

export default NeumorphicElement;