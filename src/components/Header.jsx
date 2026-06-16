import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { FaShieldAlt } from 'react-icons/fa';
import bangzenLogo from '../assets/images/BGZENBGIJObulat.png';
import { useNavbar } from '../contexts/NavbarContext';
import { useAdmin } from '../contexts/AdminContext';
import AdminLogin from './AdminLogin';
import AdminMessages from './AdminMessages';
import AdminComments from './AdminComments';
import AdminSubmissions from './AdminSubmissions';

const CLIP_PATH =
  'polygon(0 0, 100% 0, 100% 80%, 68% 80%, 64% 100%, 36% 100%, 32% 80%, 0 80%)';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [adminView, setAdminView] = useState('messages'); // 'messages', 'comments', or 'submissions'
  
  const { isNavbarVisible, hideNavbar, showNavbar } = useNavbar();
  const { isAuthenticated, logout } = useAdmin();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAdminAccess = () => {
    if (isAuthenticated) {
      setShowAdminDashboard(true);
      hideNavbar();
    } else {
      setShowAdminLogin(true);
      hideNavbar();
    }
  };

  const handleLoginSuccess = () => {
    setShowAdminLogin(false);
    setShowAdminDashboard(true);
    hideNavbar();
  };

  const handleAdminLogout = () => {
    logout();
    setShowAdminDashboard(false);
    showNavbar();
  };

  const handleCloseAdminDashboard = () => {
    setShowAdminDashboard(false);
    showNavbar();
  };

  const handleCloseAdminLogin = () => {
    setShowAdminLogin(false);
    showNavbar();
  };

  const NavLink = ({ href, children }) => (
    <li>
      <a
        href={href}
        className="relative block text-white font-[Rubik] font-bold text-base tracking-wider py-2 transition-transform duration-300 hover:scale-110 group"
      >
        {children}
        <span className="absolute bottom-1 left-0 block h-[2px] w-0 bg-[#00ffdc] transition-all duration-500 group-hover:w-full"></span>
      </a>
    </li>
  );

  return (
    <>
      <AnimatePresence>
        {isNavbarVisible && (
          <motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed top-0 left-0 w-full z-50 pointer-events-none"
          >
            {/* Drop Shadow Gradient Animated */}
            {!isScrolled && (
              <div
                className="pointer-events-none absolute left-0 right-0 z-10"
                style={{
                  top: '0',
                  height: '90px',
                  WebkitClipPath: CLIP_PATH,
                  clipPath: CLIP_PATH,
                  background: 'linear-gradient(90deg, #00fff0, #00ffdc, #4079ff, #40ffaa, #00fff0)',
                  backgroundSize: '300% 100%',
                  animation: 'gradientShadowMove 6s linear infinite',
                  opacity: 1,
                  filter: 'drop-shadow(0 16px 24px rgba(64,255,170,0.35))',
                }}
              ></div>
            )}

            {/* Navbar */}
            <header
              className={`pt-3 pb-3 relative z-20 pointer-events-auto transition-all duration-300
                ${isScrolled
                  ? "glassmorphism-header"
                  : "bg-[#11142F]"
                }`}
              style={{
                WebkitClipPath: CLIP_PATH,
                clipPath: CLIP_PATH,
                ...(isScrolled
                  ? {
                      backgroundColor: "rgba(17, 20, 47, 0.71)",
                      backdropFilter: "blur(7px) saturate(180%)",
                      WebkitBackdropFilter: "blur(7px) saturate(180%)",
                      border: "1px solid rgba(255,255,255,0.125)"
                    }
                  : {}
                )
              }}
            >
              {/* =========== REFACTORED NAVIGATION =========== */}
              <nav className="container mx-auto flex items-center justify-between flex-wrap pb-4 px-4">
                
                {/* --- MOBILE HEADER --- */}
                <div className="w-full flex items-center justify-between md:hidden px-2 py-2">
                  {/* Mobile: Brand Logo & Text (Left) */}
                  <a href="#home" className="flex items-center gap-2 flex-1 min-w-0 max-w-[60%]">
                    <img src={bangzenLogo} alt="Bangzen Logo" className="h-8 w-8 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <h1 className="font-moderniz text-xs sm:text-sm text-[#00ffdc] truncate leading-tight">
                        Nadhil
                      </h1>
                      <p className="font-moderniz text-[10px] sm:text-xs text-[#000754] truncate leading-tight" 
                         style={{ textShadow: '0.5px 0.5px 0 #00ffdc, -0.5px -0.5px 0 #00ffdc, 0.5px -0.5px 0 #00ffdc, -0.5px 0.5px 0 #00ffdc' }}>
                        Developer
                      </p>
                    </div>
                  </a>
                  
                  {/* Mobile: Right Controls */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Mobile Admin Button */}
                    <button
                      onClick={handleAdminAccess}
                      className="flex items-center justify-center w-8 h-8 text-dark-400 hover:text-primary-400 transition-all duration-300 pointer-events-auto hover:bg-primary-400/10 rounded-lg"
                      title={isAuthenticated ? "Admin Dashboard" : "Admin Login"}
                    >
                      <FaShieldAlt className={`text-sm ${isAuthenticated ? 'text-success-400' : 'text-dark-400'}`} />
                    </button>
                    
                    {/* Mobile: Hamburger Button */}
                    <button 
                      onClick={() => setIsMenuOpen(!isMenuOpen)} 
                      className="flex-shrink-0 p-2 rounded-lg bg-[#00ffdc]/10 border border-[#00ffdc]/20 text-[#00ffdc] hover:bg-[#00ffdc]/20 transition-all duration-300 pointer-events-auto"
                      aria-label="Toggle navigation menu"
                    >
                      <svg 
                        className="w-5 h-5" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        {isMenuOpen ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                      </svg>
                    </button>
                  </div>
                </div>

                {/* --- DESKTOP HEADER --- */}
                <div className="hidden w-full md:flex items-center justify-around">
                  {/* Desktop: Left Navigation */}
                  <ul className="flex items-center list-none gap-x-20">
                    <NavLink href="#home">Home</NavLink>
                    <NavLink href="#about">About</NavLink>
                  </ul>
                  
                  {/* Desktop: Center Logo & Text */}
                  <a href="#home" className="flex items-center gap-3">
                    <img src={bangzenLogo} alt="Bangzen Logo" className="h-12 w-12" />
                    <div className="block">
                      <h1 className="font-moderniz text-base text-[#00ffdc]">Muhammad Nadhil Arsy Al-Wafi</h1>
                      <p className="font-moderniz text-[10px] text-[#000754]" style={{ textShadow: '0.5px 0.5px 0 #00ffdc, -0.5px -0.5px 0 #00ffdc, 0.5px -0.5px 0 #00ffdc, -0.5px 0.5px 0 #00ffdc' }}>
                        Let's see the awesome Experience
                      </p>
                    </div>
                  </a>

                  {/* Desktop: Right Navigation & Admin Button */}
                  <div className="flex items-center gap-4">
                    <ul className="flex items-center list-none gap-16">
                      <NavLink href="#projects">Project</NavLink>
                      <NavLink href="#contact">Contact</NavLink>
                    </ul>
                    <button
                      onClick={handleAdminAccess}
                      className="flex items-center gap-2 text-dark-400 hover:text-primary-400 transition-all duration-300 pointer-events-auto hover:bg-primary-400/10 p-2 rounded-card-md hover:shadow-glow-primary-sm"
                      title={isAuthenticated ? "Admin Dashboard" : "Admin Login"}
                    >
                      <FaShieldAlt className={`text-lg ${isAuthenticated ? 'text-success-400' : 'text-dark-400'}`} />
                    </button>
                  </div>
                </div>

                {/* --- MOBILE DROPDOWN MENU --- */}
                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, y: -10 }}
                      animate={{ height: 'auto', opacity: 1, y: 0 }}
                      exit={{ height: 0, opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="w-full basis-full md:hidden overflow-hidden"
                    >
                      <div className="bg-slate-900/95 backdrop-blur-sm border-t border-[#00ffdc]/20 mx-2 mt-3 rounded-lg">
                        <ul className="flex flex-col gap-1 p-4 list-none">
                          <li>
                            <a
                              href="#home"
                              onClick={() => setIsMenuOpen(false)}
                              className="block text-white font-[Rubik] font-semibold text-sm sm:text-base py-3 px-4 rounded-card-md transition-all duration-300 hover:bg-primary-400/10 hover:text-primary-300 border-l-4 border-transparent hover:border-primary-400 hover:shadow-glow-primary-sm"
                            >
                              Home
                            </a>
                          </li>
                          <li>
                            <a
                              href="#about"
                              onClick={() => setIsMenuOpen(false)}
                              className="block text-white font-[Rubik] font-semibold text-sm sm:text-base py-3 px-4 rounded-card-md transition-all duration-300 hover:bg-secondary-400/10 hover:text-secondary-300 border-l-4 border-transparent hover:border-secondary-400 hover:shadow-glow-secondary-sm"
                            >
                              About
                            </a>
                          </li>
                          <li>
                            <a
                              href="#projects"
                              onClick={() => setIsMenuOpen(false)}
                              className="block text-white font-[Rubik] font-semibold text-sm sm:text-base py-3 px-4 rounded-card-md transition-all duration-300 hover:bg-accent-400/10 hover:text-accent-300 border-l-4 border-transparent hover:border-accent-400 hover:shadow-glow-accent-sm"
                            >
                              Projects
                            </a>
                          </li>
                          <li>
                            <a
                              href="#contact"
                              onClick={() => setIsMenuOpen(false)}
                              className="block text-white font-[Rubik] font-semibold text-sm sm:text-base py-3 px-4 rounded-card-md transition-all duration-300 hover:bg-success-400/10 hover:text-success-300 border-l-4 border-transparent hover:border-success-400 hover:shadow-glow-success-sm"
                            >
                              Contact
                            </a>
                          </li>
                          <li className="border-t border-slate-700/50 mt-2 pt-2">
                          <button
                              onClick={() => {
                                handleAdminAccess();
                                setIsMenuOpen(false);
                              }}
                              className="flex items-center gap-3 w-full text-dark-400 hover:text-primary-400 font-semibold text-sm sm:text-base py-3 px-4 rounded-card-md transition-all duration-300 hover:bg-primary-400/10 hover:shadow-glow-primary-sm"
                          >
                            <FaShieldAlt className={`text-sm sm:text-lg ${isAuthenticated ? 'text-success-400' : 'text-dark-400'}`} />
                              <span>Admin Panel</span>
                          </button>
                        </li>
                      </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </nav>
            </header>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Login Modal */}
      <AdminLogin
        isOpen={showAdminLogin}
        onClose={handleCloseAdminLogin}
        onSuccess={handleLoginSuccess}
      />

      {/* Admin Dashboard - Toggle between Messages and Comments */}
      {adminView === 'messages' && (
        <AdminMessages
          isOpen={showAdminDashboard}
          onClose={handleCloseAdminDashboard}
        />
      )}
      
      {adminView === 'comments' && (
        <AdminComments
          isOpen={showAdminDashboard}
          onClose={handleCloseAdminDashboard}
        />
      )}
      
      {adminView === 'submissions' && (
        <AdminSubmissions
          isOpen={showAdminDashboard}
          onClose={handleCloseAdminDashboard}
        />
      )}

      {/* Dashboard Switcher - Enhanced Tab System */}
      {showAdminDashboard && (
        <div className="fixed bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-[10000]">
          <div className="bg-dark-900/98 backdrop-blur-xl border-2 border-primary-400/40 rounded-2xl p-2 flex gap-1 shadow-2xl shadow-primary-400/20">
            {[
              { key: 'messages', icon: '📧', label: 'Messages' },
              { key: 'comments', icon: '💬', label: 'Comments' },
              { key: 'submissions', icon: '📋', label: 'Forms' }
            ].map((view) => (
              <button
                key={view.key}
                onClick={() => setAdminView(view.key)}
                className={`px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-all duration-300 flex items-center gap-2 font-semibold text-sm sm:text-base ${
                  adminView === view.key
                    ? 'bg-gradient-cosmic text-white shadow-glow-primary-md'
                    : 'text-gray-400 hover:text-white hover:bg-dark-700/50'
                }`}
              >
                <span className="text-base sm:text-lg">{view.icon}</span>
                <span className="hidden sm:inline">{view.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Animasi gradient keyframes */}
      <style>
        {`
          @keyframes gradientShadowMove {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
          }

          html {
            scroll-behavior: smooth;
          }
        `}
      </style>
    </>
  );
};

export default Header;