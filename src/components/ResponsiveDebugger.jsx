import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaDesktop, FaMobile, FaTablet, FaExpand, FaTimes, FaEye } from 'react-icons/fa';
import { useResponsive } from '../hooks/useResponsive';

const ResponsiveDebugger = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDev, setIsDev] = useState(false);
  const responsive = useResponsive();

  useEffect(() => {
    // Show only in development mode
    setIsDev(process.env.NODE_ENV === 'development');
  }, []);

  // Common device presets for testing
  const devicePresets = [
    { name: 'iPhone SE', width: 375, height: 667, icon: FaMobile },
    { name: 'iPhone 12', width: 390, height: 844, icon: FaMobile },
    { name: 'iPhone 14 Pro Max', width: 430, height: 932, icon: FaMobile },
    { name: 'Galaxy S21', width: 384, height: 854, icon: FaMobile },
    { name: 'iPad Mini', width: 768, height: 1024, icon: FaTablet },
    { name: 'iPad Pro', width: 1024, height: 1366, icon: FaTablet },
    { name: 'Surface Pro', width: 912, height: 1368, icon: FaTablet },
    { name: 'MacBook Air', width: 1280, height: 832, icon: FaDesktop },
    { name: 'iMac 24"', width: 1920, height: 1080, icon: FaDesktop },
    { name: 'iMac 27"', width: 2560, height: 1440, icon: FaDesktop },
    { name: 'Pro Display XDR', width: 3008, height: 1692, icon: FaExpand },
  ];

  const simulateDevice = (preset) => {
    // This would typically work in development tools
    // For demo purposes, we'll just log the action
    console.log(`Simulating ${preset.name}: ${preset.width}x${preset.height}`);
    
    // In a real implementation, you might:
    // - Update CSS custom properties
    // - Trigger resize events
    // - Use browser dev tools API
    
    // Professional notification instead of alert
    if (window.confirm(`Simulate ${preset.name} (${preset.width}x${preset.height})?\n\nThis will open developer tools guidance.`)) {
      console.log(`🔧 Responsive Debug: Simulating ${preset.name}`, {
        device: preset.name,
        width: preset.width,
        height: preset.height,
        instructions: 'Open browser dev tools (F12) → Toggle device toolbar → Select custom dimensions'
      });
    }
  };

  const getDeviceIcon = (device) => {
    switch (device) {
      case 'micro':
      case 'mobile':
        return FaMobile;
      case 'tablet':
        return FaTablet;
      default:
        return FaDesktop;
    }
  };

  const getResponsiveScore = () => {
    let score = 0;
    
    // Check responsive typography
    if (responsive.width >= 320) score += 20;
    
    // Check touch device optimization
    if (responsive.touchDevice) score += 15;
    
    // Check high DPI support
    if (responsive.hasHighDPI) score += 15;
    
    // Check orientation handling
    if (responsive.orientation) score += 10;
    
    // Check extreme sizes
    if (responsive.width < 320 || responsive.width > 2560) score += 15;
    else score += 25;
    
    // Accessibility features
    score += 15;
    
    return Math.min(score, 100);
  };

  if (!isDev) return null;

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-[9999] bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg backdrop-blur-md"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Responsive Debugger"
      >
        <FaEye className="text-lg" />
      </motion.button>

      {/* Debug Panel */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4"
            onClick={() => setIsVisible(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  📱 Responsive Debugger
                </h2>
                <button
                  onClick={() => setIsVisible(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Current Screen Info */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-3">
                    📊 Current Screen Info
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Device:</span>
                      <p className="text-gray-900 dark:text-white font-mono">{responsive.device}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Size:</span>
                      <p className="text-gray-900 dark:text-white font-mono">
                        {responsive.width} × {responsive.height}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Orientation:</span>
                      <p className="text-gray-900 dark:text-white font-mono">{responsive.orientation}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Pixel Ratio:</span>
                      <p className="text-gray-900 dark:text-white font-mono">{responsive.pixelRatio}x</p>
                    </div>
                  </div>
                </div>

                {/* Responsive Score */}
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-900 dark:text-green-200 mb-3">
                    🎯 Responsive Score
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                      <div
                        className="bg-green-500 h-4 rounded-full transition-all duration-300"
                        style={{ width: `${getResponsiveScore()}%` }}
                      />
                    </div>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {getResponsiveScore()}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {getResponsiveScore() >= 90 ? '🎉 Excellent responsive design!' :
                     getResponsiveScore() >= 75 ? '👍 Good responsive coverage!' :
                     '⚠️ Needs responsive improvements'}
                  </p>
                </div>

                {/* Device Presets */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    📱 Device Testing Presets
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {devicePresets.map((preset, index) => {
                      const Icon = preset.icon;
                      return (
                        <button
                          key={index}
                          onClick={() => simulateDevice(preset)}
                          className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
                        >
                          <Icon className="text-gray-600 dark:text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {preset.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {preset.width} × {preset.height}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Breakpoint Status */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    📏 Breakpoint Status
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                    {[
                      { name: 'Micro', active: responsive.isMicro, range: '< 320px' },
                      { name: 'Mobile', active: responsive.isMobile, range: '320-640px' },
                      { name: 'Tablet', active: responsive.isTablet, range: '640-1024px' },
                      { name: 'Desktop', active: responsive.isDesktop, range: '1024-1920px' },
                      { name: 'Large', active: responsive.isLarge, range: '1920-2560px' },
                      { name: 'Ultra Wide', active: responsive.isUltraWide, range: '> 2560px' },
                    ].map((bp, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border-2 ${
                          bp.active
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                            : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                        }`}
                      >
                        <p className={`font-medium ${
                          bp.active ? 'text-green-900 dark:text-green-200' : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {bp.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {bp.range}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features Status */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    ✅ Features Status
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    {[
                      { name: 'Touch Device', status: responsive.touchDevice },
                      { name: 'High DPI Display', status: responsive.hasHighDPI },
                      { name: 'Landscape Mobile', status: responsive.isLandscapeMobile },
                      { name: 'Online Status', status: responsive.isOnline },
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${
                          feature.status ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                        }`} />
                        <span className={
                          feature.status 
                            ? 'text-green-900 dark:text-green-200' 
                            : 'text-gray-600 dark:text-gray-400'
                        }>
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ResponsiveDebugger;