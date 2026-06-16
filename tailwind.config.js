/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Path ini memberitahu Tailwind file mana yang harus dipindai
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    screens: {
      'xs': '320px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
      '4xl': '2560px',
      // Height-based breakpoints
      'h-sm': { 'raw': '(max-height: 600px)' },
      'h-md': { 'raw': '(min-height: 601px) and (max-height: 800px)' },
      'h-lg': { 'raw': '(min-height: 801px)' },
      // Orientation breakpoints
      'landscape': { 'raw': '(orientation: landscape)' },
      'portrait': { 'raw': '(orientation: portrait)' },
    },
    extend: {
      fontFamily: {
        'moderniz': ['Moderniz', 'sans-serif'],
        'bauhaus': ['Bauhaus93', 'sans-serif'],
      },
      fontSize: {
        // Responsive typography with clamp()
        'responsive-xs': 'clamp(0.75rem, 1.5vw, 0.875rem)',    // 12px -> 14px
        'responsive-sm': 'clamp(0.875rem, 2vw, 1rem)',        // 14px -> 16px
        'responsive-base': 'clamp(1rem, 2.5vw, 1.125rem)',    // 16px -> 18px
        'responsive-lg': 'clamp(1.125rem, 3vw, 1.25rem)',     // 18px -> 20px
        'responsive-xl': 'clamp(1.25rem, 3.5vw, 1.5rem)',     // 20px -> 24px
        'responsive-2xl': 'clamp(1.5rem, 4vw, 2rem)',         // 24px -> 32px
        'responsive-3xl': 'clamp(2rem, 5vw, 2.5rem)',         // 32px -> 40px
        'responsive-4xl': 'clamp(2.25rem, 6vw, 3rem)',        // 36px -> 48px
        'responsive-5xl': 'clamp(2.5rem, 7vw, 3.5rem)',       // 40px -> 56px
        'responsive-6xl': 'clamp(3rem, 8vw, 4rem)',           // 48px -> 64px
        
        // Typography hierarchy system
        'display-lg': 'clamp(3.5rem, 10vw, 5rem)',            // 56px -> 80px - Hero displays
        'display-md': 'clamp(3rem, 8vw, 4rem)',               // 48px -> 64px - Section headers
        'display-sm': 'clamp(2.5rem, 6vw, 3rem)',             // 40px -> 48px - Sub headers
        
        'heading-xl': 'clamp(2rem, 5vw, 2.5rem)',             // 32px -> 40px - Main headings
        'heading-lg': 'clamp(1.75rem, 4vw, 2rem)',            // 28px -> 32px - Section headings
        'heading-md': 'clamp(1.5rem, 3.5vw, 1.75rem)',        // 24px -> 28px - Sub headings
        'heading-sm': 'clamp(1.25rem, 3vw, 1.5rem)',          // 20px -> 24px - Minor headings
        
        'body-xl': 'clamp(1.125rem, 2.8vw, 1.25rem)',         // 18px -> 20px - Large body
        'body-lg': 'clamp(1rem, 2.5vw, 1.125rem)',            // 16px -> 18px - Body text
        'body-md': 'clamp(0.875rem, 2.2vw, 1rem)',            // 14px -> 16px - Secondary text
        'body-sm': 'clamp(0.75rem, 2vw, 0.875rem)',           // 12px -> 14px - Small text
        
        'caption-lg': 'clamp(0.875rem, 2vw, 1rem)',           // 14px -> 16px - Large captions
        'caption-md': 'clamp(0.75rem, 1.8vw, 0.875rem)',      // 12px -> 14px - Captions
        'caption-sm': 'clamp(0.6875rem, 1.5vw, 0.75rem)',     // 11px -> 12px - Fine print
      },
      fontWeight: {
        'light': '300',
        'normal': '400', 
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
        'black': '900',
      },
      lineHeight: {
        'tight': '1.1',
        'snug': '1.2', 
        'normal': '1.4',
        'relaxed': '1.5',
        'loose': '1.6',
        'very-loose': '1.8',
      },
      letterSpacing: {
        'tighter': '-0.02em',
        'tight': '-0.01em',
        'normal': '0em',
        'wide': '0.01em',
        'wider': '0.02em',
        'widest': '0.05em',
        'mega-wide': '0.1em',
      },
      spacing: {
        // Enhanced responsive spacing with extreme device support
        'responsive-xs': 'clamp(0.125rem, 0.5vw, 0.5rem)',    // 2px -> 8px (micro to mobile)
        'responsive-sm': 'clamp(0.25rem, 1.5vw, 1rem)',       // 4px -> 16px (micro to desktop)
        'responsive-md': 'clamp(0.5rem, 2.5vw, 1.5rem)',      // 8px -> 24px
        'responsive-lg': 'clamp(0.75rem, 3.5vw, 2rem)',       // 12px -> 32px
        'responsive-xl': 'clamp(1rem, 4.5vw, 3rem)',          // 16px -> 48px
        'responsive-2xl': 'clamp(1.5rem, 6vw, 4rem)',         // 24px -> 64px
        'responsive-3xl': 'clamp(2rem, 8vw, 6rem)',           // 32px -> 96px (for large screens)
        // Micro device specific spacing
        'micro-xs': '0.125rem',   // 2px
        'micro-sm': '0.25rem',    // 4px
        'micro-md': '0.375rem',   // 6px
        'micro-lg': '0.5rem',     // 8px
      },
      borderRadius: {
        // Consistent border radius system
        'card-sm': '0.75rem',      // 12px
        'card-md': '1rem',         // 16px  
        'card-lg': '1.25rem',      // 20px
        'card-xl': '1.5rem',       // 24px
        'card-2xl': '2rem',        // 32px
      },
      colors: {
        // Enhanced Color Palette
        'primary': {
          50: '#f0fdff',
          100: '#ccfbff', 
          200: '#99f7ff',
          300: '#5deeff',
          400: '#00ffdc',  // Main cyan
          500: '#00d4aa',
          600: '#00a885',
          700: '#007a63',
          800: '#005447',
          900: '#003832',
        },
        'secondary': {
          50: '#f8f4ff',
          100: '#ebe3ff',
          200: '#d4c7ff',
          300: '#b8a0ff',
          400: '#9575ff',  // Purple accent
          500: '#7c3aed',
          600: '#6366f1',
          700: '#4f46e5',
          800: '#4338ca',
          900: '#3730a3',
        },
        'accent': {
          50: '#fff4ed',
          100: '#ffe4cc',
          200: '#ffc999',
          300: '#ffa366',
          400: '#ff8533',  // Orange accent
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        'success': {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',  // Enhanced emerald
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        'dark': {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#060010',  // Main dark background
        }
      },
      boxShadow: {
        // Enhanced shadow system with new colors
        'card-sm': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'card-md': '0 4px 16px rgba(0, 0, 0, 0.1)',
        'card-lg': '0 8px 32px rgba(0, 0, 0, 0.15)',
        'card-xl': '0 16px 48px rgba(0, 0, 0, 0.2)',
        'glow-primary-sm': '0 0 16px rgba(0, 255, 220, 0.3)',
        'glow-primary-md': '0 0 24px rgba(0, 255, 220, 0.4)',
        'glow-primary-lg': '0 0 32px rgba(0, 255, 220, 0.5)',
        'glow-secondary-sm': '0 0 16px rgba(149, 117, 255, 0.3)',
        'glow-secondary-md': '0 0 24px rgba(149, 117, 255, 0.4)',
        'glow-accent-sm': '0 0 16px rgba(255, 133, 51, 0.3)',
        'glow-accent-md': '0 0 24px rgba(255, 133, 51, 0.4)',
        'glow-success-sm': '0 0 16px rgba(74, 222, 128, 0.3)',
        'glow-success-md': '0 0 24px rgba(74, 222, 128, 0.4)',
      },
      backgroundImage: {
        // Enhanced gradient collection
        'gradient-primary': 'linear-gradient(135deg, #00ffdc 0%, #4079ff 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #9575ff 0%, #6366f1 100%)',
        'gradient-accent': 'linear-gradient(135deg, #ff8533 0%, #f97316 100%)',
        'gradient-success': 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
        'gradient-cosmic': 'linear-gradient(135deg, #00ffdc 0%, #9575ff 50%, #ff8533 100%)',
        'gradient-ocean': 'linear-gradient(135deg, #00ffdc 0%, #4079ff 70%, #6366f1 100%)',
        'gradient-sunset': 'linear-gradient(135deg, #ff8533 0%, #9575ff 70%, #00ffdc 100%)',
        'gradient-forest': 'linear-gradient(135deg, #4ade80 0%, #00ffdc 70%, #4079ff 100%)',
        'gradient-aurora': 'linear-gradient(45deg, #00ffdc 0%, #9575ff 25%, #ff8533 50%, #4ade80 75%, #00ffdc 100%)',
        'gradient-nebula': 'linear-gradient(120deg, #060010 0%, #1e293b 40%, #4079ff 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      },
      animation: {
        shadowFade: 'shadowFade 5s infinite ease-in-out',
        gradient: 'gradient 8s linear infinite',
        'gradient-shift': 'gradient-shift 3s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        shadowFade: {
          '0%, 100%': { filter: 'drop-shadow(-1px 6px 3px rgba(0, 255, 255, 0.5))' },
          '50%': { filter: 'drop-shadow(-1px 6px 3px rgba(0, 255, 255, 0.3))' },
        },
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 255, 220, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(0, 255, 220, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}
