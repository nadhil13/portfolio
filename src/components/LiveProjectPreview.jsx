import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaExternalLinkAlt, 
  FaGithub, 
  FaEye, 
  FaTimes, 
  FaCode, 
  FaDesktop, 
  FaMobile,
  FaTablet,
  FaExpand,
  FaCompress,
  FaRedo,
  FaInfoCircle
} from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';
import GlassmorphicCard from './GlassmorphicCard';
import NeumorphicElement from './NeumorphicElement';

const LiveProjectPreview = ({ project, isOpen, onClose }) => {
  const [currentDevice, setCurrentDevice] = useState('desktop');
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const { theme } = useTheme();

  // Device configurations
  const devices = {
    desktop: {
      name: 'Desktop',
      icon: FaDesktop,
      width: '100%',
      height: '600px',
      class: 'w-full h-[600px]'
    },
    tablet: {
      name: 'Tablet',
      icon: FaTablet,
      width: '768px',
      height: '600px',
      class: 'w-[768px] h-[600px] mx-auto'
    },
    mobile: {
      name: 'Mobile',
      icon: FaMobile,
      width: '375px',
      height: '600px',
      class: 'w-[375px] h-[600px] mx-auto'
    }
  };

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      // Simulate loading time
      const timer = setTimeout(() => setIsLoading(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, project?.id]);

  const refreshPreview = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  if (!isOpen || !project) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-md z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`relative bg-dark-900/95 backdrop-blur-xl rounded-card-xl border border-white/10 shadow-2xl overflow-hidden ${
          isFullscreen ? 'w-full h-full' : 'w-full max-w-7xl h-[90vh]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-dark-800/50">
          <div className="flex items-center gap-4">
            <motion.div
              className="w-12 h-12 rounded-card-md bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <FaEye className="text-white text-xl" />
            </motion.div>
            <div>
              <h3 className="text-heading-md font-bold text-white">
                {project.title}
              </h3>
              <p className="text-caption-lg text-dark-400">
                Live Preview
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Device Toggle */}
            <div className="flex gap-1 bg-dark-700/50 rounded-card-md p-1">
              {Object.entries(devices).map(([key, device]) => (
                <NeumorphicElement
                  key={key}
                  size="small"
                  interactive
                  variant={currentDevice === key ? "pressed" : "flat"}
                >
                  <button
                    onClick={() => setCurrentDevice(key)}
                    className={`p-2 transition-colors ${
                      currentDevice === key 
                        ? 'text-primary-400' 
                        : 'text-dark-400 hover:text-white'
                    }`}
                    title={device.name}
                  >
                    <device.icon className="text-sm" />
                  </button>
                </NeumorphicElement>
              ))}
            </div>

            {/* Action Buttons */}
            <NeumorphicElement size="small" interactive>
              <button
                onClick={refreshPreview}
                className="p-2 text-dark-400 hover:text-white transition-colors"
                title="Refresh Preview"
              >
                <FaRedo className="text-sm" />
              </button>
            </NeumorphicElement>

            <NeumorphicElement size="small" interactive>
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="p-2 text-dark-400 hover:text-white transition-colors"
                title="Project Info"
              >
                <FaInfoCircle className="text-sm" />
              </button>
            </NeumorphicElement>

            <NeumorphicElement size="small" interactive>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 text-dark-400 hover:text-white transition-colors"
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? <FaCompress className="text-sm" /> : <FaExpand className="text-sm" />}
              </button>
            </NeumorphicElement>

            <NeumorphicElement size="small" interactive>
              <button
                onClick={onClose}
                className="p-2 text-red-400 hover:text-red-300 transition-colors"
                title="Close"
              >
                <FaTimes className="text-sm" />
              </button>
            </NeumorphicElement>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 relative overflow-hidden">
          <div className="flex h-full">
            {/* Main Preview Area */}
            <div className={`flex-1 p-6 flex items-center justify-center ${
              currentDevice !== 'desktop' ? 'bg-gray-100' : ''
            }`}>
              <div className={devices[currentDevice].class}>
                {isLoading ? (
                  <div className="w-full h-full bg-dark-800 rounded-card-lg border border-dark-600 flex flex-col items-center justify-center">
                    <motion.div
                      className="w-16 h-16 border-4 border-primary-400 border-t-transparent rounded-full mb-4"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <p className="text-white text-body-md">Loading preview...</p>
                    <div className="mt-4 w-48 h-2 bg-dark-600 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary-400 to-accent-400"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                      />
                    </div>
                  </div>
                ) : (
                  <motion.div
                    className="w-full h-full bg-white rounded-card-lg border border-dark-600 overflow-hidden shadow-2xl"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {project.liveUrl ? (
                      <iframe
                        src={project.liveUrl}
                        className="w-full h-full"
                        title={`${project.title} Preview`}
                        loading="lazy"
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex flex-col items-center justify-center p-8">
                        <motion.div
                          className="text-8xl mb-6"
                          animate={{ 
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{ 
                            duration: 3, 
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          🚀
                        </motion.div>
                        <h4 className="text-heading-lg font-bold text-dark-800 mb-4 text-center">
                          {project.title}
                        </h4>
                        <p className="text-body-md text-dark-600 text-center max-w-md mb-6">
                          {project.description}
                        </p>
                        <div className="flex gap-4">
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 bg-dark-800 text-white rounded-card-md hover:bg-dark-700 transition-colors"
                            >
                              <FaGithub />
                              <span>View Code</span>
                            </a>
                          )}
                          {project.demoUrl && (
                            <a
                              href={project.demoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-card-md hover:bg-primary-400 transition-colors"
                            >
                              <FaExternalLinkAlt />
                              <span>Live Demo</span>
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Project Info Sidebar */}
            <AnimatePresence>
              {showInfo && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: '350px', opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-l border-white/10 bg-dark-800/50 overflow-hidden"
                >
                  <div className="p-6 h-full overflow-y-auto">
                    <h4 className="text-heading-md font-bold text-white mb-4">
                      Project Details
                    </h4>
                    
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-caption-lg font-semibold text-primary-300 mb-2">
                          Description
                        </h5>
                        <p className="text-caption-md text-dark-400 leading-relaxed">
                          {project.description}
                        </p>
                      </div>

                      {project.technologies && (
                        <div>
                          <h5 className="text-caption-lg font-semibold text-primary-300 mb-2">
                            Technologies
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-accent-500/20 border border-accent-400/30 rounded-full text-caption-sm text-accent-300"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {project.features && (
                        <div>
                          <h5 className="text-caption-lg font-semibold text-primary-300 mb-2">
                            Key Features
                          </h5>
                          <ul className="space-y-2">
                            {project.features.map((feature, index) => (
                              <li
                                key={index}
                                className="text-caption-md text-dark-400 flex items-start gap-2"
                              >
                                <span className="text-accent-400 mt-1">•</span>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="pt-4 border-t border-white/10">
                        <div className="flex gap-3">
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-3 py-2 bg-dark-700 text-white rounded-card-md hover:bg-dark-600 transition-colors text-caption-md"
                            >
                              <FaGithub />
                              <span>Code</span>
                            </a>
                          )}
                          {project.demoUrl && (
                            <a
                              href={project.demoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-3 py-2 bg-primary-500 text-white rounded-card-md hover:bg-primary-400 transition-colors text-caption-md"
                            >
                              <FaExternalLinkAlt />
                              <span>Demo</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-dark-800/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-caption-sm text-dark-400">
                Device: {devices[currentDevice].name}
              </span>
              <span className="text-caption-sm text-dark-400">
                {devices[currentDevice].width} × {devices[currentDevice].height}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400' : 'bg-green-400'}`} />
              <span className="text-caption-sm text-dark-400">
                {isLoading ? 'Loading...' : 'Ready'}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LiveProjectPreview;