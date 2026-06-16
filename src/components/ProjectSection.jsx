// src/components/ProjectSection.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaExternalLinkAlt, FaReact, FaNodeJs, FaHtml5, FaCss3Alt, 
  FaJsSquare, FaTools, FaFigma, FaGithub, FaTimes, FaDownload
} from 'react-icons/fa';
import InteractiveButton from './InteractiveButton';
import LazyImage from './LazyImage';
import { 
  SiTailwindcss, SiNextdotjs, SiVercel, SiMongodb, 
  SiExpress, SiPostgresql 
} from 'react-icons/si';
import { PiCodeBold } from "react-icons/pi";
import { LuBadge } from "react-icons/lu";
import { LiaLayerGroupSolid } from "react-icons/lia";
import { useNavbar } from '../contexts/NavbarContext';

// ===================================
// DATA PROYEK (CONTOH)
// ===================================
// Import gambar secara langsung untuk Vite
import portoImg from '../assets/images/porto.jpg';
import perdanaImg from '../assets/images/perdana.jpg';
import analogImg from '../assets/images/analog.jpg';
import metnumImg from '../assets/images/metnum.jpg';
import opensaqImg from '../assets/images/opensaq.jpg';
import pendidikanImg from '../assets/images/pendidikan.jpg';

const dummyProjects = [
    {
    title: "Portfolio v1",
    description: "Website portofolio pribadi yang dibangun dengan React, Next.js, dan Tailwind CSS, di-deploy di Vercel.",
    tech: ["Next.js", "React", "TailwindCSS", "Framer Motion"],
    link: "https://github.com/nadhil13/portodils",
    image: portoImg,
    category: "Web/Apps",
  },
  {
    title: "First Website",
    description: "Website perkenalan diri perdana yang dibangun dengan HTML, CSS, di-deploy di GitHub Pages.",
    tech: ["HTML5", "CSS3"],
    link: "https://github.com/nadhil13/website-perdana",
    image: perdanaImg,
    category: "Web/Apps",
  },
  {
    title: "Analog Project",
    description: "Membuat tugas akhir mata kuliah Analisis Algoritma (Projek) berbasis web menggunakan React dan CSS",
    tech: ["React", "CSS3"],
    link: "https://github.com/nadhil13/algovision",
    image: analogImg,
    category: "Web/Apps",
  },
  {
    title: "Numerik Project",
    description: "Membuat tugas akhir mata kuliah Metode Numerik (Projek) berbasis web menggunakan React dan CSS",
    tech: ["React", "CSS3"],
    link: "https://github.com/nadhil13/metnum",
    image: metnumImg,
    category: "Web/Apps",
  },
  {
    title: "Open Requirement SAQ",
    description: "Membuat formulir pendaftaran calon asisten laboratorium SAQ berbasis web menggunakan React dan CSS",
    tech: ["React", "CSS3"],
    link: "https://opensaq.site/",
    image: opensaqImg,
    category: "Web/Apps",
  },
  {
    title: "Web Project",
    description: "Membuat informasi lengkap mengenai pendidikan berbasis web menggunakan HTML, CSS, dan JavaScript",
    tech: ["HTML5", "CSS3", "JavaScript"],
    link: "https://pioneereduc.com/",
    image: pendidikanImg,
    category: "Web/Apps",
  },
  {
    title: "3D Product Visualization",
    description: "Desain 3D interaktif untuk showcase produk menggunakan Spline dan Blender.",
    tech: ["Spline", "Blender"],
    link: "#",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop",
    category: "3D Design",
  },
  {
    title: "Animated 3D Landing",
    description: "Landing page dengan elemen 3D animasi untuk branding modern.",
    tech: ["Spline", "Three.js"],
    link: "#",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?q=80&w=2070&auto=format&fit=crop",
    category: "3D Design",
  },
];

// ===================================
// DATA SERTIFIKAT MUHAMMAD NADHIL ARSY AL-WAFI
// ===================================
const userCertificates = [
    {
        title: "Belajar Dasar Python",
        issuer: "DQ Lab",
        date: "Okt 2024",
        link: "/certificates/Belajar Dasar Python.pdf",
        image: "/certificate-images/Belajar Dasar Python.jpg",
    },
    {
        title: "Web Development Fundamentals: Crafting Exceptional Portfolios with Tailwind CSS & Golang",
        issuer: "Laboratorium Software Engineering - Institut Teknologi PLN",
        date: "Des 2024",
        link: "/certificates/Golang.pdf",
        image: "/certificate-images/Golang.jpg",
    },
    {
        title: "Web Design Essentials: Building Beautiful and Responsive User Interfaces",
        issuer: "Laboratorium Multimedia - Institut Teknologi PLN",
        date: "Okt 2023",
        link: "/certificates/01.pdf",
        image: "/certificate-images/Multi.jpg",
    },
    {
        title: "Digital Talent Scholarship and Digital Society Index Public Lecture",
        issuer: "Kominfo - Institut Teknologi PLN",
        date: "Okt 2023",
        link: "/certificates/02.pdf",
        image: "/certificate-images/kominfo.jpg",
    },
    {
        title: "International Expert Talks #2: Introduction to Renewable Energy & Solar Rooftop Design Limitations",
        issuer: "Institut Teknologi PLN",
        date: "Des 2023",
        link: "/certificates/03.pdf",
        image: "/certificate-images/talk.jpg",
    },
    {
        title: "Global Study Fair of Keystone Participant Certificate",
        issuer: "Asean Youth Organization",
        date: "Okt 2023",
        link: "/certificates/04.pdf",
        image: "/certificate-images/study.jpg",
    },
    {
        title: "International Webinar on Scholarship Success: Hidden Tips for Winning",
        issuer: "SmartPath",
        date: "Des 2023",
        link: "/certificates/06.png",
        image: "/certificate-images/06.png",
    },
    {
        title: "Belajar Dasar R",
        issuer: "DQ Lab",
        date: "Okt 2024",
        link: "/certificates/Belajar Dasar R.pdf",
        image: "/certificate-images/Belajar Dasar R.jpg",
    },
    {
        title: "Workshop on Building Responsive Websites with Bootstrap: Tips, Tricks, and Personal Portfolio",
        issuer: "Laboratorium Software Engineering - Institut Teknologi PLN",
        date: "Okt 2024",
        link: "/certificates/05.pdf",
        image: "/certificate-images/05.png",
    },
    {
        title: "Online Workshop on Progressive Web Apps for Your Portfolio Website",
        issuer: "Laboratorium Multimedia - Institut Teknologi PLN",
        date: "May 2024",
        link: "/certificates/07.png",
        image: "/certificate-images/07.png",
    },
    {
        title: "Funtastic Event Logistics Staff: Certificate of Appreciation",
        issuer: "Himpunan Teknik Informatika - Institut Teknologi PLN",
        date: "Sep 2024",
        link: "/certificates/08.pdf",
        image: "/certificate-images/08.png",
    },
    {
        title: "Winner of National Science Competition (KCSI) 2024: Gold Medalist in Chemistry",
        issuer: "CV. Divya Cahaya Prestasi",
        date: "Sep 2024",
        link: "/certificates/KOMPETISI CERDAS SAINS INDONESIA - KIMIA.pdf",
        image: "/certificate-images/09.png",
    },
    {
        title: "National Mathematics Olympiad: 2nd Place Achievement at Festival Olimpiade 2024",
        issuer: "University ID Educational Platform",
        date: "Sep 2024",
        link: "/certificates/KOMPETISI FESTIVAL OLIMPIADE - Olimpiade Matematika Tingkat Nasional.pdf",
        image: "/certificate-images/10.png",
    },
    {
        title: "Silver Medalist in Chemistry - Kompetisi Sains Indonesia (KSI) 2025",
        issuer: "Pusat Olimpiade Sains Indonesia (POSI)",
        date: "Mar 2025",
        link: "/certificates/NADHIL-KIMIA.pdf",
        image: "/certificate-images/11.png",
    },
    {
        title: "KCSI 2024: Gold Medal Achievement in Mathematics",
        issuer: "CV. Divya Cahaya Prestasi",
        date: "Sep 2024",
        link: "/certificates/KOMPETISI CERDAS SAINS INDONESIA - MATEMATIKA.pdf",
        image: "/certificate-images/12.png",
    },
    {
        title: "National Olympiad 2024: 1st Place in Engineering Category",
        issuer: "University ID Educational Platform",
        date: "Sep 2024",
        link: "/certificates/KOMPETISI FESTIVAL OLIMPIADE - Olimpiade Teknik Tingkat Nasional.pdf",
        image: "/certificate-images/13.png",
    },
    {
        title: "Pekan Prestasi Pancasila 2024: Gold Medal in Mathematics",
        issuer: "Brilian Olimpiade Indonesia (BOI)",
        date: "Okt 2024",
        link: "/certificates/PEKAN PRESTASI PANCASILA - MATEMATIKA.pdf",
        image: "/certificate-images/14.png",
    },
];

const techStack = {
    frontend: [
    { name: "React", icon: <FaReact className="text-[#61DAFB]" /> },
    { name: "Next.js", icon: <SiNextdotjs className="text-white" /> },
    { name: "JavaScript", icon: <FaJsSquare className="text-[#F7DF1E]" /> },
    { name: "Tailwind CSS", icon: <SiTailwindcss className="text-[#38B2AC]" /> },
    { name: "HTML5", icon: <FaHtml5 className="text-[#E34F26]" /> },
    { name: "CSS3", icon: <FaCss3Alt className="text-[#1572B6]" /> },
  ],
  backend: [
    { name: "Node.js", icon: <FaNodeJs className="text-[#339933]" /> },
    { name: "Express", icon: <SiExpress className="text-white" /> },
  ],
  database: [
    { name: "MongoDB", icon: <SiMongodb className="text-[#47A248]" /> },
    { name: "PostgreSQL", icon: <SiPostgresql className="text-[#336791]" /> },
  ],
  tools: [
    { name: "Git & GitHub", icon: <FaGithub className="text-white" /> },
    { name: "Vercel", icon: <SiVercel className="text-white" /> },
    { name: "Figma", icon: <FaFigma className="text-[#F24E1E]" /> },
    { name: "Tools Lain", icon: <FaTools className="text-gray-400" /> },
  ],
};

// ===================================
// HELPER & ANIMATION COMPONENTS
// ===================================
const LineShadowText = ({ children, className, shadowColor = "#4079ff", ...props }) => {
    return (
        <motion.span
            style={{ "--shadow-color": shadowColor }}
            className={`relative z-0 line-shadow-effect ${className}`}
            data-text={children}
            {...props}
        >
            {children}
        </motion.span>
    );
};

// ===================================
// KOMPONEN KARTU SERTIFIKAT
// ===================================
const CertificateCard = ({ cert, onClick }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="group relative cursor-pointer"
            whileHover={{ y: -8 }}
            onClick={() => onClick(cert)}
        >
            <div className="relative h-64 sm:h-72 rounded-card-xl overflow-hidden shadow-card-md bg-white/5 backdrop-blur-sm border border-white/10 hover:border-cyan-400/30 hover:shadow-glow-cyan-sm transition-all duration-500">
                <div className="absolute inset-0">
                    <LazyImage
                      src={cert.image}
                      alt={cert.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      priority={false} // Certificates tidak priority
                      fallback={
                        <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                          <span className="text-4xl">🏆</span>
                        </div>
                      }
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/60 to-slate-900/30 group-hover:from-slate-900/95 transition-all duration-500"></div>
                </div>
                <div className="absolute inset-0 p-5 flex flex-col justify-between">
                    <div className="flex-1 flex items-start justify-between">
                        <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-card-sm border border-white/20">
                            <span className="text-caption-md font-semibold text-cyan-300 uppercase tracking-widest">{cert.issuer}</span>
                        </div>
                        <div className="bg-emerald-500/20 backdrop-blur-md px-3 py-1.5 rounded-card-sm border border-emerald-400/30">
                            <span className="text-caption-md font-bold text-emerald-300 tracking-wide">{cert.date}</span>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <h3 className="text-heading-sm font-bold text-white line-clamp-3 leading-snug tracking-tight">{cert.title}</h3>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-slate-300">
                                <FaDownload className="text-sm" />
                                <span className="text-sm font-medium">View Certificate</span>
                            </div>
                            <motion.div 
                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="bg-cyan-500/20 backdrop-blur-md p-2 rounded-card-sm border border-cyan-400/30">
                                    <FaExternalLinkAlt className="text-cyan-300 text-sm" />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/0 via-transparent to-emerald-500/0 group-hover:from-cyan-500/10 group-hover:to-emerald-500/10 transition-all duration-500"></div>
            </div>
        </motion.div>
    );
};

// ===================================
// KOMPONEN PREVIEW MODAL SERTIFIKAT
// ===================================
const CertificatePreviewModal = ({ certificate, onClose }) => {
    if (!certificate) return null;
    
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative max-w-4xl w-full bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="absolute top-4 right-4 z-10">
                    <button onClick={onClose} className="bg-red-500/20 hover:bg-red-500/30 backdrop-blur-md p-3 rounded-full border border-red-400/30 transition-all duration-300 group">
                        <FaTimes className="text-red-300 group-hover:text-red-200" />
                    </button>
                </div>
                <div className="p-6 sm:p-8">
                    <div className="mb-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{certificate.title}</h2>
                                <div className="flex flex-wrap items-center gap-4">
                                    <span className="bg-cyan-500/20 px-4 py-2 rounded-full text-cyan-300 font-semibold border border-cyan-400/30">{certificate.issuer}</span>
                                    <span className="bg-emerald-500/20 px-4 py-2 rounded-full text-emerald-300 font-semibold border border-emerald-400/30">{certificate.date}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="relative rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                        <LazyImage
                          src={certificate.image}
                          alt={certificate.title}
                          className="w-full h-auto max-h-[60vh] object-contain"
                          priority={true} // Modal image priority
                          fallback={
                            <div className="w-full h-60 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                              <div className="text-center">
                                <span className="text-6xl mb-4 block">🏆</span>
                                <p className="text-slate-400">Certificate Preview</p>
                              </div>
                            </div>
                          }
                        />
                    </div>
                    <div className="mt-6 flex justify-center">
                        <motion.a
                          href={certificate.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="relative overflow-hidden font-semibold border backdrop-blur-sm
                            transition-all duration-300 ease-out
                            focus:outline-none
                            bg-gradient-success hover:bg-gradient-forest text-white border-success-400/30
                            hover:shadow-glow-success-lg
                            focus:ring-4 focus:ring-success-400/20
                            px-6 py-3 text-base rounded-card-lg
                            flex items-center justify-center gap-2"
                          whileHover={{ 
                            scale: 1.02, 
                            y: -2,
                            transition: {
                              type: "spring",
                              stiffness: 400,
                              damping: 17
                            }
                          }}
                          whileTap={{ 
                            scale: 0.98, 
                            y: 0,
                            transition: {
                              type: "spring",
                              stiffness: 600,
                              damping: 20
                            }
                          }}
                        >
                          <motion.span
                            className="text-current"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ duration: 0.2 }}
                          >
                            <FaDownload />
                          </motion.span>
                          Download Certificate
                        </motion.a>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// ===================================
// KOMPONEN KARTU PROYEK
// ===================================
const ProjectCard = ({ project }) => {
    const techIcons = {
        "Next.js": <SiNextdotjs />, "React": <FaReact />, "TailwindCSS": <SiTailwindcss />,
        "Framer Motion": " गति ", "Node.js": <FaNodeJs />, "Express": <SiExpress />, 
        "MongoDB": <SiMongodb />, "JWT": "🔑", "Figma": <FaFigma />, "Storybook": "📚",
        "HTML5": <FaHtml5 />, "CSS3": <FaCss3Alt />, "JavaScript": <FaJsSquare />,
        "Spline": "🌀", "Blender": "🎨", "Three.js": "⚡"
    };

    return (
        <motion.a 
            href={project.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative h-80 rounded-card-xl overflow-hidden shadow-card-md hover:shadow-glow-cyan-sm transition-all duration-500 cursor-pointer block"
            whileHover={{ 
                y: -8,
                transition: { duration: 0.3, ease: "easeOut" }
            }}
            whileTap={{ scale: 0.98 }}
        >
            {/* Background Image with improved aspect ratio */}
            <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${project.image}')` }}
            />
            
            {/* Overlay gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 group-hover:from-black/90 group-hover:via-black/50 transition-all duration-500" />
            
            {/* Content Container */}
            <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6 text-white">
                {/* Top Section - Category Badge */}
                <div className="flex justify-end">
                    <span className="px-3 py-1 rounded-card-sm bg-cyan-500/20 backdrop-blur-sm border border-cyan-400/30 text-cyan-300 text-xs font-semibold">
                        {project.category}
                    </span>
                </div>
                
                {/* Bottom Section - Main Content */}
                <div className="space-y-4">
                    <div className="space-y-3">
                        <h3 className="text-sm sm:text-base md:text-lg font-extrabold text-white mb-2 group-hover:text-cyan-300 transition-colors duration-300 leading-snug tracking-tight">
                            {project.title}
                        </h3>
                        <p className="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed line-clamp-3 font-medium">
                            {project.description}
                        </p>
                    </div>
                    
                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2">
                        {project.tech.slice(0, 4).map((tech, i) => (
                            <motion.span 
                                key={i} 
                                className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-card-sm bg-slate-900/70 text-slate-300 border border-slate-700/50 backdrop-blur-sm"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                            >
                                <span className="text-cyan-400">{techIcons?.[tech] || "⚡"}</span>
                                <span>{tech}</span>
                            </motion.span>
                        ))}
                        {project.tech.length > 4 && (
                            <span className="text-xs px-2 py-1 rounded-card-sm bg-slate-700/50 text-slate-400">
                                +{project.tech.length - 4}
                            </span>
                        )}
                    </div>
                    
                    {/* Link Arrow */}
                    <div className="flex justify-between items-center">
                        <span className="text-caption-lg text-cyan-400 font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 tracking-wide">
                            View Project
                        </span>
                        <motion.div
                            className="p-2 rounded-card-sm bg-cyan-500/20 border border-cyan-400/30"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ duration: 0.2 }}
                        >
                            <FaExternalLinkAlt className="text-cyan-300 text-sm" />
                        </motion.div>
                    </div>
                </div>
            </div>
            
            {/* Animated border */}
            <div className="absolute inset-0 rounded-card-xl border-2 border-transparent bg-gradient-to-br from-cyan-400/30 via-blue-500/20 to-cyan-400/30 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none" 
                 style={{
                     backgroundSize: '300% 300%',
                     animation: 'group-hover:gradient 3s ease infinite'
                 }} 
            />
            
            {/* Shimmer effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </div>
        </motion.a>
    );
};

// ===================================
// KOMPONEN UTAMA SECTION PROJECT
// ===================================
function ProjectSection() {
  const [activeTab, setActiveTab] = useState('Projects');
  const [projectCategory, setProjectCategory] = useState('Web/Apps');
  const [previewCertificate, setPreviewCertificate] = useState(null);
  const { hideNavbar, showNavbar } = useNavbar();

  // === CHANGE START: State dan konstanta untuk Show More/Less ===
  const INITIAL_CERTIFICATES_TO_SHOW = 6;
  const [visibleCertificatesCount, setVisibleCertificatesCount] = useState(INITIAL_CERTIFICATES_TO_SHOW);
  // === CHANGE END ===

  useEffect(() => {
    if (previewCertificate) {
      hideNavbar();
    } else {
      showNavbar();
    }
  }, [previewCertificate, hideNavbar, showNavbar]);

  useEffect(() => {
    return () => {
      showNavbar();
    };
  }, [showNavbar]);

  const tabs = [
    { id: 'Projects', label: 'Projects', icon: <PiCodeBold className="text-[1.7em] mb-1" /> },
    { id: 'Certificate', label: 'Certificates', icon: <LuBadge className="text-[1.5em] mb-1" /> },
    { id: 'Tech Stack', label: 'Tech Stack', icon: <LiaLayerGroupSolid className="text-[1.5em] mb-1" /> },
  ];

  const filteredProjects = dummyProjects.filter(
    (p) => p.category === projectCategory
  );

  // === CHANGE START: Handler untuk tombol Show More/Less ===
  const handleShowMore = () => {
    setVisibleCertificatesCount(userCertificates.length);
  };

  const handleShowLess = () => {
    setVisibleCertificatesCount(INITIAL_CERTIFICATES_TO_SHOW);
  };
  // === CHANGE END ===

  return (
    <section id="project" className="py-20">
      
      <style>{`
        @keyframes line-shadow-anim { 0% { background-position: 0 0; } 100% { background-position: 100% 100%; } }
        .line-shadow-effect::after { content: attr(data-text); position: absolute; z-index: -1; left: 0.04em; top: 0.04em; background-image: linear-gradient(45deg, transparent 45%, var(--shadow-color) 45%, var(--shadow-color) 55%, transparent 0); background-size: 0.06em 0.06em; -webkit-background-clip: text; background-clip: text; color: transparent; animation: line-shadow-anim 30s linear infinite; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-20"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-moderniz">
            <span style={{color: "#00ffdc"}}><LineShadowText shadowColor="#00b3a4">PORTFOLIO</LineShadowText></span>
            {' '}
            <span style={{ color: "#fff" }}><LineShadowText shadowColor="#bbbbbb">SHOWCASE</LineShadowText></span>
        </h2>
      </motion.div>

      <div className="w-full">
        <div className="flex justify-center mb-12">
          <motion.div
            layout
            className="inline-flex w-full max-w-4xl rounded-3xl p-2 shadow-lg border border-slate-800 bg-gradient-to-r from-[#101624] via-[#0a1627] to-[#0a223a] backdrop-blur-md"
            style={{ background: "linear-gradient(90deg, #101624 0%, #0a1627 50%, #0a223a 100%)", boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
          >
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex flex-1 flex-col items-center justify-center px-2 py-7 rounded-2xl font-semibold text-base transition-colors duration-300 outline-none ${activeTab === tab.id ? "text-white" : "text-slate-400 hover:text-cyan-300"}`}
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                style={{ zIndex: 1, minWidth: 0 }}
              >
                {activeTab === tab.id && (
                  <motion.span
                    layoutId="tab-underline"
                    className="absolute inset-0 bg-gradient-to-br from-[#0a223a] to-[#101624] rounded-2xl"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                    style={{ zIndex: -1, opacity: 0.96 }}
                  />
                )}
                <span className="relative z-10 flex flex-col items-center gap-2">
                  {tab.icon}
                  <span className="font-bold">{tab.label}</span>
                </span>
              </motion.button>
            ))}
          </motion.div>
        </div>

        <div
          className="rounded-3xl p-0 md:p-6 shadow-xl border border-slate-800/60 mx-auto max-w-7xl bg-clip-padding"
          style={{ background: "rgba(17, 24, 39, 0.55)", boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="p-6 md:p-10"
            >
              {activeTab === 'Projects' && (
                <>
                  <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-8">
                    <InteractiveButton
                      onClick={() => setProjectCategory('Web/Apps')}
                      variant={projectCategory === 'Web/Apps' ? 'primary' : 'outline'}
                      size="md"
                      className={`w-full sm:w-auto ${projectCategory !== 'Web/Apps' ? 'text-primary-200 hover:text-white' : ''}`}
                    >
                      Web/Apps
                    </InteractiveButton>
                    <InteractiveButton
                      onClick={() => setProjectCategory('3D Design')}
                      variant={projectCategory === '3D Design' ? 'accent' : 'outline'}
                      size="md"
                      className={`w-full sm:w-auto ${projectCategory !== '3D Design' ? 'text-accent-200 hover:text-white' : ''}`}
                    >
                      3D Design
                    </InteractiveButton>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 auto-rows-fr">
                    {filteredProjects.length > 0 ? (
                      filteredProjects.map((p, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 30, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ 
                            duration: 0.5, 
                            delay: i * 0.1,
                            ease: "easeOut" 
                          }}
                          className="h-full"
                        >
                          <ProjectCard project={p} />
                        </motion.div>
                      ))
                    ) : (
                      <div className="col-span-full text-center text-slate-400 py-12">No projects in this category yet.</div>
                    )}
                  </div>
                </>
              )}
              {activeTab === 'Certificate' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto auto-rows-fr">
                    {/* === CHANGE: Menggunakan slice untuk menampilkan sertifikat yang terlihat === */}
                    <AnimatePresence>
                      {userCertificates.slice(0, visibleCertificatesCount).map((cert, i) => (
                        <CertificateCard key={i} cert={cert} onClick={setPreviewCertificate} />
                      ))}
                    </AnimatePresence>
                  </div>
                  {/* === CHANGE START: Menambahkan tombol Show More/Less secara kondisional === */}
                  {userCertificates.length > INITIAL_CERTIFICATES_TO_SHOW && (
                    <div className="flex justify-center mt-12">
                      {visibleCertificatesCount < userCertificates.length ? (
                        <InteractiveButton
                          onClick={handleShowMore}
                          variant="success"
                          size="md"
                        >
                          Show More
                        </InteractiveButton>
                      ) : (
                        <InteractiveButton
                          onClick={handleShowLess}
                          variant="ghost"
                          size="md"
                        >
                          Show Less
                        </InteractiveButton>
                      )}
                    </div>
                  )}
                  {/* === CHANGE END === */}
                </div>
              )}
              {activeTab === 'Tech Stack' && (
                <div className="max-w-4xl mx-auto space-y-8">
                  {Object.entries(techStack).map(([category, techs]) => (
                    <div key={category}>
                      <h3 className="text-xl font-bold text-cyan-300 capitalize mb-4 border-b-2 border-slate-800 pb-2">{category}</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {techs.map((tech, i) => (
                          <div key={i} className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl bg-slate-900/70 border border-slate-800 transition-all duration-300 hover:bg-slate-800/50 hover:border-cyan-500/30">
                            <div className="text-4xl">{tech.icon}</div>
                            <p className="text-sm text-slate-300">{tech.name}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      <AnimatePresence>
        {previewCertificate && (
          <CertificatePreviewModal 
            certificate={previewCertificate}
            onClose={() => setPreviewCertificate(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

export default ProjectSection;