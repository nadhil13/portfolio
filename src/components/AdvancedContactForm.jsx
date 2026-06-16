import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight, FaArrowLeft, FaCheck, FaEnvelope, FaWhatsapp, FaUser, FaEnvelopeOpen, FaPhone, FaCalendarAlt, FaClock, FaRocket, FaExclamationTriangle, FaPaperPlane, FaCommentDots } from 'react-icons/fa';
import FormField from './FormField';

const AdvancedContactForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', company: '', website: '',
    projectType: '', budget: '', timeline: '', description: '',
    preferredDate: '', preferredTime: '', timezone: '', meetingType: 'video',
    hearAboutUs: '', additionalNotes: ''
  });

  // 🔥 VALIDATION STATES
  const [validationErrors, setValidationErrors] = useState({});
  const [isValidating, setIsValidating] = useState(false);

  // 🔥 VALIDATION FUNCTIONS
  const validateName = (name) => {
    if (!name.trim()) return 'Nama wajib diisi';
    if (name.trim().length < 2) return 'Nama minimal 2 karakter';
    if (!/^[a-zA-Z\s.-]+$/u.test(name)) return 'Nama hanya boleh berisi huruf, spasi, titik, dan strip';
    if (name.trim().length > 50) return 'Nama maksimal 50 karakter';
    return null;
  };

  const validateEmail = (email) => {
    if (!email.trim()) return 'Email wajib diisi';
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) return 'Format email tidak valid (contoh: nama@email.com)';
    if (email.length > 100) return 'Email terlalu panjang';
    return null;
  };

  const validatePhone = (phone) => {
    if (!phone.trim()) return 'Nomor HP wajib diisi';
    
    // Remove all non-digits
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Check if starts with country code or 0
    if (!cleanPhone.startsWith('62') && !cleanPhone.startsWith('0')) {
      return 'Nomor HP harus dimulai dengan +62 atau 0';
    }
    
    // Convert 0 to 62 for validation
    const normalizedPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
    
    // Check length (Indonesian mobile: 62 + 8-12 digits)
    if (normalizedPhone.length < 10 || normalizedPhone.length > 15) {
      return 'Nomor HP tidak valid (8-12 digit setelah kode negara)';
    }
    
    // Check valid Indonesian mobile prefixes
    const validPrefixes = ['628', '629']; // 08xx, 09xx
    const hasValidPrefix = validPrefixes.some(prefix => normalizedPhone.startsWith(prefix));
    if (!hasValidPrefix) {
      return 'Nomor HP Indonesia harus dimulai dengan 08xx atau 09xx';
    }
    
    return null;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Real-time validation for step 1 fields
    if (field === 'name' || field === 'email' || field === 'phone') {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        
        if (field === 'name') {
          const nameError = validateName(value);
          if (nameError) newErrors.name = nameError;
          else delete newErrors.name;
        }
        
        if (field === 'email') {
          const emailError = validateEmail(value);
          if (emailError) newErrors.email = emailError;
          else delete newErrors.email;
        }
        
        if (field === 'phone') {
          const phoneError = validatePhone(value);
          if (phoneError) newErrors.phone = phoneError;
          else delete newErrors.phone;
        }
        
        return newErrors;
      });
    }
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        // Check if all required fields are filled AND no validation errors
        const hasRequiredFields = formData.name && formData.email && formData.phone;
        const hasNoErrors = !validationErrors.name && !validationErrors.email && !validationErrors.phone;
        return hasRequiredFields && hasNoErrors;
      case 2:
        return formData.projectType && formData.budget;
      case 3:
        return formData.preferredDate && formData.preferredTime;
      case 4:
        return formData.description;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (canProceedToNextStep() && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Final validation
    const finalErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      phone: validatePhone(formData.phone)
    };
    
    // Remove null errors
    Object.keys(finalErrors).forEach(key => {
      if (!finalErrors[key]) delete finalErrors[key];
    });
    
    if (Object.keys(finalErrors).length > 0) {
      setValidationErrors(finalErrors);
      setCurrentStep(1); // Go back to first step for corrections
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('loading');
    
    try {
      // Import the form submission utility
      const { submitContactForm } = await import('../utils/formSubmission');
      
      // Submit form with DUAL method (Email + WhatsApp + LocalStorage backup)
      const submissionMethod = 'dual'; // Email + WhatsApp sekaligus!
      const result = await submitContactForm(formData, { method: submissionMethod });
      
      if (result.success) {
        console.log('✅ Form submitted successfully:', result);
        setSubmitStatus('success');
        
        // If WhatsApp method, execute the action
        if (result.action) {
          result.action();
        }
        
        // Reset form after successful submission
        setTimeout(() => {
          setCurrentStep(1);
          setFormData({
            name: '', email: '', phone: '', company: '', website: '',
            projectType: '', budget: '', timeline: '', description: '',
            preferredDate: '', preferredTime: '', timezone: '', meetingType: 'video',
            hearAboutUs: '', additionalNotes: ''
          });
          setValidationErrors({});
          setSubmitStatus(null);
        }, 5000);
        
      } else {
        throw new Error(result.message || 'Submission failed');
      }
      
    } catch (error) {
      console.error('❌ Submission error:', error);
      setSubmitStatus('error');
      
      // Reset submit status after showing error
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🎯 FORM STEPS CONFIGURATION
  const steps = [
    {
      title: 'Informasi Dasar',
      description: 'Nama, email & nomor HP'
    },
    {
      title: 'Project Details',
      description: 'Jenis project dan budget'
    },
    {
      title: 'Jadwal Meeting',
      description: 'Waktu dan tanggal yang cocok'
    },
    {
      title: 'Detail Tambahan',
      description: 'Deskripsi lengkap project'
    }
  ];

  // 🎨 STEP ICONS
  const stepIcons = {
    1: FaUser,
    2: FaRocket,
    3: FaCalendarAlt,
    4: FaCommentDots
  };

  return (
    <section 
      id="contact" 
      className="py-12 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900/20"
    >
      <div className="max-w-5xl mx-auto w-full">
        {/* Enhanced Header Section */}
        <motion.div
          className="relative text-center mb-12 md:mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          {/* Background Decorative Elements */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary-500/10 via-accent-500/10 to-secondary-500/10 rounded-full blur-3xl opacity-60"></div>
            <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-secondary-500/10 to-primary-500/10 rounded-full blur-2xl opacity-40"></div>
            <div className="absolute top-1/2 right-1/4 transform translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-r from-accent-500/10 to-secondary-500/10 rounded-full blur-xl opacity-30"></div>
          </div>

          {/* Animated Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 mb-4 md:mb-6 bg-gradient-to-r from-primary-500/20 via-accent-500/20 to-secondary-500/20 backdrop-blur-sm border border-primary-400/30 rounded-full text-xs md:text-sm font-medium text-white"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Available for new projects
          </motion.div>

          {/* Main Title */}
          <motion.h2 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-4 md:mb-6 leading-tight text-white"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Let's Build Something Amazing
          </motion.h2>

          {/* Enhanced Description */}
          <motion.div
            className="max-w-3xl mx-auto space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white leading-relaxed px-2 sm:px-4">
              Mari diskusikan project impian Anda! Isi form 4 langkah mudah ini untuk memulai kolaborasi yang luar biasa.
            </p>
          </motion.div>

          {/* Call to Action Indicators */}
          <motion.div
            className="flex flex-wrap justify-center gap-2 md:gap-3 mt-6 md:mt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 px-2 py-1 md:px-3 md:py-1 bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-full text-xs text-white">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
              Quick Response
            </div>
            <div className="flex items-center gap-2 px-2 py-1 md:px-3 md:py-1 bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-full text-xs text-white">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
              Free Consultation
            </div>
            <div className="flex items-center gap-2 px-2 py-1 md:px-3 md:py-1 bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-full text-xs text-white">
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
              Custom Solutions
            </div>
          </motion.div>
        </motion.div>

        {/* Enhanced Progress Steps */}
        <motion.div 
          className="flex justify-center mb-8 md:mb-12 lg:mb-16 px-2 sm:px-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="relative max-w-4xl w-full">
            {/* Background Progress Line */}
            <div className="absolute top-6 left-6 right-6 h-0.5 bg-dark-600 hidden sm:block"></div>
            <div className={`absolute top-6 left-6 h-0.5 bg-gradient-to-r from-primary-500 to-success-500 transition-all duration-700 hidden sm:block`} 
                 style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}>
            </div>

            {/* Steps Container */}
            <div className="flex items-start justify-between space-x-1 sm:space-x-2 md:space-x-4 lg:space-x-8">
              {steps.map((step, index) => {
                const stepNumber = index + 1;
                const isCompleted = stepNumber < currentStep;
                const isCurrent = stepNumber === currentStep;
                const StepIcon = stepIcons[stepNumber];

                return (
                  <motion.div
                    key={stepNumber}
                    className="flex flex-col items-center relative z-10 flex-1 max-w-[120px] md:max-w-none"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                      opacity: isCompleted || isCurrent ? 1 : 0.7,
                      scale: isCurrent ? 1.05 : 1
                    }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {/* Step Indicator Circle */}
                    <div
                      className={`relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                        isCompleted
                          ? 'bg-gradient-to-br from-green-400 to-green-600 border-green-400 text-white shadow-xl shadow-green-500/40'
                          : isCurrent
                          ? 'bg-gradient-to-br from-blue-400 to-purple-600 border-blue-400 text-white shadow-xl shadow-blue-500/40'
                          : 'bg-dark-800/80 backdrop-blur-sm border-dark-600 text-gray-400 hover:border-dark-500'
                      }`}
                    >
                      {/* Pulse animation for current step */}
                      {isCurrent && (
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 opacity-30 animate-ping"></div>
                      )}
                      
                      {isCompleted ? (
                        <FaCheck className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 relative z-10" />
                      ) : (
                        <StepIcon className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 relative z-10" />
                      )}
                    </div>

                    {/* Step Title & Description */}
                    <div className="mt-2 md:mt-3 text-center">
                      <div className={`text-xs sm:text-sm md:text-base font-semibold transition-colors duration-300 ${
                        isCurrent ? 'text-blue-400' : isCompleted ? 'text-green-400' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 leading-tight hidden md:block">
                        {step.description}
                      </div>
                      
                      {/* Mobile step number */}
                      <div className="md:hidden text-xs text-gray-400 mt-1">
                        {stepNumber}/4
                      </div>
                    </div>

                    {/* Step Number Badge (Desktop) */}
                    <div className={`absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 rounded-full text-xs font-bold flex items-center justify-center transition-all duration-300 hidden lg:flex ${
                      isCompleted || isCurrent ? 'bg-white text-dark-900' : 'bg-dark-700 text-gray-400'
                    }`}>
                      {stepNumber}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Form Container */}
        <motion.div
          className="relative bg-gradient-to-br from-dark-800/60 via-dark-700/40 to-dark-900/60 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 shadow-2xl max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          {/* Form Steps */}
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 md:space-y-6"
                >
                  <div className="text-center mb-6 md:mb-8">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Informasi Dasar</h3>
                    <p className="text-sm md:text-base text-gray-300">Masukkan data kontak Anda dengan benar untuk memulai kolaborasi</p>
                  </div>

                  {/* Nama Lengkap */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white flex items-center gap-2">
                      <FaUser className="w-4 h-4 text-cyan-400" />
                      Nama Lengkap <span className="text-cyan-400">*</span>
                    </label>
                    <div className="relative">
                      <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Masukkan nama lengkap Anda"
                        required
                        className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                      />
                    </div>
                    {validationErrors.name && (
                      <p className="text-red-400 text-sm flex items-center gap-2">
                        <span>⚠️</span> {validationErrors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white flex items-center gap-2">
                      <FaEnvelope className="w-4 h-4 text-cyan-400" />
                      Email <span className="text-cyan-400">*</span>
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="nama@email.com"
                        required
                        className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                      />
                    </div>
                    {validationErrors.email && (
                      <p className="text-red-400 text-sm flex items-center gap-2">
                        <span>⚠️</span> {validationErrors.email}
                      </p>
                    )}
                  </div>

                  {/* Nomor HP */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white flex items-center gap-2">
                      <FaPhone className="w-4 h-4 text-cyan-400" />
                      Nomor HP (WhatsApp) <span className="text-cyan-400">*</span>
                    </label>
                    <div className="relative">
                      <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+62 812-3456-7890 atau 08xxx"
                        required
                        className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                      />
                    </div>
                    <p className="text-slate-400 text-xs flex items-center gap-1">
                      <span>ℹ️</span> Format: +62xxx atau 08xxx (nomor WhatsApp aktif)
                    </p>
                    {validationErrors.phone && (
                      <p className="text-red-400 text-sm flex items-center gap-2">
                        <span>⚠️</span> {validationErrors.phone}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 md:space-y-6"
                >
                  <div className="text-center mb-6 md:mb-8">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Project Details</h3>
                    <p className="text-sm md:text-base text-gray-300">Ceritakan tentang project yang ingin Anda buat</p>
                  </div>

                  {/* Jenis Project */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white flex items-center gap-2">
                      <FaRocket className="w-4 h-4 text-cyan-400" />
                      Jenis Project <span className="text-cyan-400">*</span>
                    </label>
                    <div className="relative">
                      <FaRocket className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 z-10" />
                      <select
                        name="projectType"
                        value={formData.projectType}
                        onChange={(e) => handleInputChange('projectType', e.target.value)}
                        required
                        className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-slate-800 text-slate-400">Pilih jenis project</option>
                        <option value="website-company" className="bg-slate-800 text-white">🏢 Website Company Profile</option>
                        <option value="website-ecommerce" className="bg-slate-800 text-white">🛒 Website E-commerce</option>
                        <option value="website-portfolio" className="bg-slate-800 text-white">🎨 Website Portfolio</option>
                        <option value="web-app" className="bg-slate-800 text-white">⚡ Web Application</option>
                        <option value="mobile-app" className="bg-slate-800 text-white">📱 Mobile Application</option>
                        <option value="ui-ux-design" className="bg-slate-800 text-white">🎯 UI/UX Design</option>
                        <option value="landing-page" className="bg-slate-800 text-white">🚀 Landing Page</option>
                        <option value="custom-project" className="bg-slate-800 text-white">🔧 Custom Project</option>
                      </select>
                      {/* Custom dropdown arrow */}
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Budget Project */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white flex items-center gap-2">
                      <FaRocket className="w-4 h-4 text-cyan-400" />
                      Budget Project <span className="text-cyan-400">*</span>
                    </label>
                    <div className="relative">
                      <FaRocket className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 z-10" />
                      <select
                        name="budget"
                        value={formData.budget}
                        onChange={(e) => handleInputChange('budget', e.target.value)}
                        required
                        className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-slate-800 text-slate-400">Pilih range budget</option>
                        <option value="5-15jt" className="bg-slate-800 text-white">💰 Rp 5 juta - Rp 15 juta</option>
                        <option value="15-30jt" className="bg-slate-800 text-white">💎 Rp 15 juta - Rp 30 juta</option>
                        <option value="30-50jt" className="bg-slate-800 text-white">👑 Rp 30 juta - Rp 50 juta</option>
                        <option value="50-100jt" className="bg-slate-800 text-white">🚀 Rp 50 juta - Rp 100 juta</option>
                        <option value="100jt+" className="bg-slate-800 text-white">🌟 Rp 100 juta+</option>
                        <option value="diskusi" className="bg-slate-800 text-white">💬 Mari diskusikan bersama</option>
                      </select>
                      {/* Custom dropdown arrow */}
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 md:space-y-6"
                >
                  <div className="text-center mb-6 md:mb-8">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Jadwal Meeting</h3>
                    <p className="text-sm md:text-base text-gray-300">Kapan waktu yang tepat untuk kita diskusi?</p>
                  </div>

                  {/* Tanggal yang Tersedia */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white flex items-center gap-2">
                      <FaCalendarAlt className="w-4 h-4 text-cyan-400" />
                      Tanggal yang Tersedia <span className="text-cyan-400">*</span>
                    </label>
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        type="text"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                        placeholder="Contoh: Senin-Jumat, 15-20 Januari 2024"
                        required
                        className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                      />
                    </div>
                    <p className="text-slate-400 text-xs flex items-center gap-1">
                      <span>ℹ️</span> Tuliskan hari/tanggal yang cocok untuk Anda
                    </p>
                  </div>

                  {/* Waktu yang Tersedia */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white flex items-center gap-2">
                      <FaClock className="w-4 h-4 text-cyan-400" />
                      Waktu yang Tersedia <span className="text-cyan-400">*</span>
                    </label>
                    <div className="relative">
                      <FaClock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        type="text"
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={(e) => handleInputChange('preferredTime', e.target.value)}
                        placeholder="Contoh: 09:00-17:00 WIB, pagi hari"
                        required
                        className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                      />
                    </div>
                    <p className="text-slate-400 text-xs flex items-center gap-1">
                      <span>ℹ️</span> Tuliskan jam berapa yang paling cocok
                    </p>
                  </div>
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 md:space-y-6"
                >
                  <div className="text-center mb-6 md:mb-8">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Detail Project</h3>
                    <p className="text-sm md:text-base text-gray-300">Ceritakan lebih detail tentang project impian Anda</p>
                  </div>

                  {/* Deskripsi Project */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white flex items-center gap-2">
                      <FaCommentDots className="w-4 h-4 text-cyan-400" />
                      Deskripsi Project <span className="text-cyan-400">*</span>
                    </label>
                    <div className="relative">
                      <FaCommentDots className="absolute left-4 top-4 text-slate-400 w-4 h-4" />
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Ceritakan detail project Anda: fitur yang diinginkan, target audience, referensi website/app yang disukai, dll."
                        required
                        rows="6"
                        className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 resize-none"
                      />
                    </div>
                    <p className="text-slate-400 text-xs flex items-center gap-1">
                      <span>ℹ️</span> Semakin detail semakin baik untuk hasil yang optimal
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 md:mt-10 pt-6 border-t border-white/10">
              <motion.button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-medium transition-all duration-300 ${
                  currentStep === 1
                    ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                    : 'bg-dark-700 text-white hover:bg-dark-600 transform hover:scale-105'
                }`}
                whileHover={{ scale: currentStep === 1 ? 1 : 1.05 }}
                whileTap={{ scale: currentStep === 1 ? 1 : 0.95 }}
              >
                <FaArrowLeft className="w-3 h-3 md:w-4 md:h-4" />
                <span className="text-sm md:text-base">Kembali</span>
              </motion.button>

              {currentStep < 4 ? (
                <motion.button
                  type="button"
                  onClick={nextStep}
                  disabled={!canProceedToNextStep()}
                  className={`flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-medium transition-all duration-300 ${
                    canProceedToNextStep()
                      ? 'bg-gradient-to-r from-primary-500 to-blue-600 text-white hover:from-primary-600 hover:to-blue-700 transform hover:scale-105 shadow-lg'
                      : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                  }`}
                  whileHover={{ scale: canProceedToNextStep() ? 1.05 : 1 }}
                  whileTap={{ scale: canProceedToNextStep() ? 0.95 : 1 }}
                >
                  <span className="text-sm md:text-base">Lanjutkan</span>
                  <FaArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                </motion.button>
              ) : (
                <motion.button
                  type="submit"
                  disabled={isSubmitting || !canProceedToNextStep()}
                  className={`flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-medium transition-all duration-300 ${
                    canProceedToNextStep() && !isSubmitting
                      ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white hover:from-green-600 hover:to-teal-700 transform hover:scale-105 shadow-lg'
                      : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                  }`}
                  whileHover={{ scale: (canProceedToNextStep() && !isSubmitting) ? 1.05 : 1 }}
                  whileTap={{ scale: (canProceedToNextStep() && !isSubmitting) ? 0.95 : 1 }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span className="text-sm md:text-base">Mengirim...</span>
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="w-3 h-3 md:w-4 md:h-4" />
                      <span className="text-sm md:text-base">Kirim Project</span>
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </form>

          {/* Enhanced Success/Error Status */}
          <AnimatePresence>
            {submitStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                className="mt-6 p-6 bg-gradient-to-br from-green-500/20 via-emerald-500/20 to-teal-500/20 border border-green-500/50 rounded-2xl text-center"
              >
                {/* Success Icon Animation */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="flex items-center justify-center gap-3 mb-4"
                >
                  <div className="relative">
                    <FaCheck className="w-8 h-8 text-green-400" />
                    <div className="absolute inset-0 w-8 h-8 bg-green-400/30 rounded-full animate-ping"></div>
                  </div>
                  <span className="font-bold text-xl text-green-400">Dual Confirmation Activated!</span>
                </motion.div>

                {/* Dual Confirmation Status */}
                <div className="space-y-3 mb-4">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center justify-center gap-2 text-sm"
                  >
                    <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                      <FaEnvelope className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-300">Owner Email: ✅ Notification Sent</span>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center justify-center gap-2 text-sm"
                  >
                    <div className="flex items-center gap-2 px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
                      <FaEnvelopeOpen className="w-4 h-4 text-green-400" />
                      <span className="text-green-300">User Email: ✅ Confirmation Sent to {formData.email}</span>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex items-center justify-center gap-2 text-sm"
                  >
                    <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
                      <FaWhatsapp className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300">WhatsApp: ✅ Auto-sent to owner & user instantly!</span>
                    </div>
                  </motion.div>
                </div>

                {/* Main Success Message */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="bg-white/5 rounded-xl p-4 border border-white/10"
                >
                  <h4 className="font-semibold text-white mb-2">🎉 What happens next?</h4>
                  <div className="text-sm text-gray-300 space-y-1">
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      <span>Check your email for detailed confirmation</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                      <span>WhatsApp notifications auto-sent to both parties</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                      <span>I'll respond within 24 hours with project timeline</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                      <span>No manual action needed - everything is automated!</span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
            {submitStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-center"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <FaExclamationTriangle className="w-5 h-5" />
                  <span className="font-semibold">Terjadi Kesalahan!</span>
                </div>
                <p className="text-sm">Silakan coba lagi atau hubungi langsung via WhatsApp.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default AdvancedContactForm;