import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const GlassmorphicCard = ({ 
  children, 
  className = '', 
  variant = 'default',
  intensity = 'medium',
  hover = true,
  ...props 
}) => {
  const { theme } = useTheme();

  const variants = {
    default: {
      light: {
        background: 'rgba(255, 255, 255, 0.25)',
        borderColor: 'rgba(255, 255, 255, 0.3)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(20px)'
      },
      dark: {
        background: 'rgba(15, 23, 42, 0.8)',
        borderColor: 'rgba(0, 255, 220, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 255, 220, 0.1)',
        backdropFilter: 'blur(20px)'
      }
    },
    accent: {
      light: {
        background: 'rgba(103, 126, 234, 0.15)',
        borderColor: 'rgba(103, 126, 234, 0.3)',
        boxShadow: '0 8px 32px rgba(103, 126, 234, 0.2)',
        backdropFilter: 'blur(20px)'
      },
      dark: {
        background: 'rgba(0, 255, 220, 0.1)',
        borderColor: 'rgba(0, 255, 220, 0.3)',
        boxShadow: '0 8px 32px rgba(0, 255, 220, 0.15)',
        backdropFilter: 'blur(20px)'
      }
    },
    subtle: {
      light: {
        background: 'rgba(255, 255, 255, 0.1)',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
        backdropFilter: 'blur(10px)'
      },
      dark: {
        background: 'rgba(15, 23, 42, 0.6)',
        borderColor: 'rgba(51, 65, 85, 0.3)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(10px)'
      }
    },
    strong: {
      light: {
        background: 'rgba(255, 255, 255, 0.4)',
        borderColor: 'rgba(255, 255, 255, 0.5)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
        backdropFilter: 'blur(30px)'
      },
      dark: {
        background: 'rgba(15, 23, 42, 0.9)',
        borderColor: 'rgba(0, 255, 220, 0.4)',
        boxShadow: '0 12px 40px rgba(0, 255, 220, 0.2)',
        backdropFilter: 'blur(30px)'
      }
    }
  };

  const intensityMap = {
    light: 'blur(10px)',
    medium: 'blur(20px)',
    strong: 'blur(30px)',
    ultra: 'blur(40px)'
  };

  const currentVariant = variants[variant][theme];
  const backdropBlur = intensityMap[intensity];

  const hoverVariants = {
    initial: { 
      scale: 1,
      rotateX: 0,
      rotateY: 0,
    },
    hover: { 
      scale: 1.02,
      rotateX: 5,
      rotateY: 5,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  return (
    <motion.div
      className={`relative border rounded-card-xl overflow-hidden ${className}`}
      variants={hover ? hoverVariants : {}}
      initial="initial"
      whileHover={hover ? "hover" : {}}
      style={{
        background: currentVariant.background,
        borderColor: currentVariant.borderColor,
        boxShadow: currentVariant.boxShadow,
        backdropFilter: backdropBlur,
        WebkitBackdropFilter: backdropBlur,
        perspective: '1000px',
        transformStyle: 'preserve-3d'
      }}
      {...props}
    >
      {/* Inner glow */}
      <div 
        className="absolute inset-0 rounded-card-xl pointer-events-none"
        style={{
          background: theme === 'light'
            ? 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)'
            : 'linear-gradient(135deg, rgba(0,255,220,0.1) 0%, transparent 50%, rgba(0,255,220,0.05) 100%)'
        }}
      />
      
      {/* Subtle border gradient */}
      <div 
        className="absolute inset-0 rounded-card-xl pointer-events-none"
        style={{
          background: theme === 'light'
            ? 'linear-gradient(45deg, transparent, rgba(255,255,255,0.4), transparent)'
            : 'linear-gradient(45deg, transparent, rgba(0,255,220,0.2), transparent)',
          padding: '1px',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'subtract',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'subtract'
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Animated shine effect on hover */}
      {hover && (
        <motion.div
          className="absolute inset-0 opacity-0"
          whileHover={{
            opacity: [0, 0.3, 0],
            background: [
              'linear-gradient(45deg, transparent, transparent, transparent)',
              `linear-gradient(45deg, transparent, ${theme === 'light' ? 'rgba(255,255,255,0.4)' : 'rgba(0,255,220,0.2)'}, transparent)`,
              'linear-gradient(45deg, transparent, transparent, transparent)'
            ]
          }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      )}
    </motion.div>
  );
};

export default GlassmorphicCard;