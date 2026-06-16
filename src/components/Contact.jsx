import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaGithub, 
  FaInstagram, 
  FaTiktok, 
  FaPaperPlane, 
  FaUser, 
  FaEnvelope, 
  FaComment, 
  FaCamera,
  FaHeart,
  FaReply,
  FaTrash
} from 'react-icons/fa';
import { SiTiktok } from 'react-icons/si';
import AdminMessages from './AdminMessages';
import AdminLogin from './AdminLogin';
import { useAdmin } from '../contexts/AdminContext';
import FormField from './FormField';
import InteractiveButton from './InteractiveButton';
import { getComments, addComment, updateCommentLikes } from '../services/commentsService';

// JSON file untuk menyimpan comments
const COMMENTS_FILE = '/comments.json';

const Contact = () => {
  // States untuk contact form
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [contactErrors, setContactErrors] = useState({});
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);

  // States untuk comments
  const [commentForm, setCommentForm] = useState({
    name: '',
    message: '',
    photo: null,
    photoPreview: null
  });
  const [comments, setComments] = useState([]);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Safe context access with fallback
  let isAuthenticated = false;
  try {
    const adminContext = useAdmin();
    isAuthenticated = adminContext?.isAuthenticated || false;
  } catch (err) {
    console.warn('Admin context not available:', err.message);
  }

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return { isValid: false, message: 'Email is required' };
    if (!emailRegex.test(email)) return { isValid: false, message: 'Please enter a valid email address' };
    return { isValid: true, message: 'Email looks good!' };
  };

  const validateName = (name) => {
    if (!name) return { isValid: false, message: 'Name is required' };
    if (name.length < 2) return { isValid: false, message: 'Name must be at least 2 characters' };
    if (name.length > 50) return { isValid: false, message: 'Name must be less than 50 characters' };
    return { isValid: true, message: 'Perfect!' };
  };

  const validateMessage = (message) => {
    if (!message) return { isValid: false, message: 'Message is required' };
    if (message.length < 10) return { isValid: false, message: 'Message must be at least 10 characters' };
    if (message.length > 500) return { isValid: false, message: 'Message must be less than 500 characters' };
    return { isValid: true, message: `Great message! (${message.length}/500)` };
  };

  // Load comments dari Firebase (dengan fallback localStorage) - SAFE VERSION
  useEffect(() => {
    const loadComments = async () => {
      try {
        const loadedComments = await getComments();
        if (Array.isArray(loadedComments)) {
          setComments(loadedComments);
        } else {
          setComments([]);
        }
      } catch (error) {
        console.error('Error loading comments:', error);
        // Fallback to empty array
        setComments([]);
      }
    };
    
    loadComments();
  }, []);

  // Handle contact form dengan EMAIL SYSTEM
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const nameValidation = validateName(contactForm.name);
    const emailValidation = validateEmail(contactForm.email);
    const messageValidation = validateMessage(contactForm.message);
    
    const newErrors = {};
    
    if (!nameValidation.isValid) newErrors.name = nameValidation.message;
    if (!emailValidation.isValid) newErrors.email = emailValidation.message;
    if (!messageValidation.isValid) newErrors.message = messageValidation.message;
    
    setContactErrors(newErrors);
    
    // If there are errors, don't submit
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    
    setIsSubmittingContact(true);
    
    try {
      // Import the form submission utility
      const { submitContactForm } = await import('../utils/formSubmission');
      
      // Submit form dengan DUAL method (Email + LocalStorage backup) untuk simple form
      const submissionMethod = 'dual'; // Email untuk owner & user sekaligus!
      const result = await submitContactForm(contactForm, { method: submissionMethod });
      
      if (result.success) {
        console.log('✅ Simple contact form submitted successfully:', result);
        
        // Show success message
        alert(`🎉 Pesan berhasil dikirim!

📧 Email notification sudah dikirim ke saya
📧 Email konfirmasi sudah dikirim ke Anda
📱 Saya akan membalas via email dalam 24 jam

Terima kasih telah menghubungi saya!`);
        
        // Reset form after successful submission
        setContactForm({ name: '', email: '', message: '' });
        setContactErrors({});
        
      } else {
        throw new Error(result.message || 'Submission failed');
      }
      
    } catch (error) {
      console.error('❌ Contact form submission failed:', error);
      
      // Fallback: Save to localStorage only
      const newMessage = {
        id: Date.now(),
        name: contactForm.name,
        email: contactForm.email,
        message: contactForm.message,
        timestamp: new Date().toISOString(),
        status: 'unread'
      };

      const savedMessages = localStorage.getItem('portfolioContactMessages');
      const messages = savedMessages ? JSON.parse(savedMessages) : [];
      const updatedMessages = [newMessage, ...messages];
      localStorage.setItem('portfolioContactMessages', JSON.stringify(updatedMessages));
      
      alert(`⚠️ Email gagal terkirim, tapi pesan sudah tersimpan!

Pesan Anda sudah tersimpan dan akan saya baca.
Silakan hubungi saya langsung via:
📧 nadhilarsy@gmail.com
📱 WhatsApp: +62 812-7063-2690

Error: ${error.message}`);
      
      // Reset form
      setContactForm({ name: '', email: '', message: '' });
      setContactErrors({});
    }
    
    setIsSubmittingContact(false);
  };

  // Handle photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCommentForm(prev => ({
          ...prev,
          photo: file,
          photoPreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle comment submit - Firebase Version
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentForm.name.trim() || !commentForm.message.trim()) return;

    setIsSubmittingComment(true);

    try {
      const newCommentData = {
        name: commentForm.name.trim(),
        message: commentForm.message.trim(),
        photo: commentForm.photoPreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(commentForm.name)}&background=00ffdc&color=000754&size=100`
      };

      const savedComment = await addComment(newCommentData);
      
      // Update state dengan komentar baru
      setComments(prevComments => [savedComment, ...prevComments]);
      
      // Reset form
      setCommentForm({ name: '', message: '', photo: null, photoPreview: null });
      
      console.log('✅ Comment saved to Firebase successfully!');
    } catch (error) {
      console.error('❌ Error saving comment:', error);
      // Error handling sudah ada di service (fallback localStorage)
    }
    
    setIsSubmittingComment(false);
  };

  // Handle like comment - Firebase Version
  const handleLikeComment = async (commentId) => {
    try {
      // Find current comment
      const currentComment = comments.find(comment => comment.id === commentId);
      if (!currentComment) return;
      
      const newLikes = currentComment.likes + 1;
      
      // Update Firebase
      await updateCommentLikes(commentId, newLikes);
      
      // Update local state
      const updatedComments = comments.map(comment => 
        comment.id === commentId 
          ? { ...comment, likes: newLikes }
          : comment
      );
      setComments(updatedComments);
      
      console.log('✅ Comment likes updated in Firebase!');
    } catch (error) {
      console.error('❌ Error updating likes:', error);
      // Error handling sudah ada di service (fallback localStorage)
    }
  };


  const socialLinks = [
    {
      name: 'GitHub',
      icon: <FaGithub />,
      url: 'https://github.com/nadhil13',
      color: 'from-gray-600 to-gray-800',
      hoverColor: 'hover:shadow-gray-500/25'
    },
    {
      name: 'Instagram',
      icon: <FaInstagram />,
      url: 'https://instagram.com/_ndlasy',
      color: 'from-pink-500 to-purple-600',
      hoverColor: 'hover:shadow-pink-500/25'
    },
    {
      name: 'TikTok',
      icon: <SiTiktok />,
      url: 'https://tiktok.com/@y.phe',
      color: 'from-black to-red-600',
      hoverColor: 'hover:shadow-red-500/25'
    }
  ];

  return (
    <section id="contact" className="py-20 px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 via-transparent to-cyan-900/10"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-cyan-500/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-500"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20 relative"
        >
          <h2 className="text-display-md font-moderniz font-black mb-6 leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-600 bg-clip-text text-transparent">
              GET IN
            </span>
            {' '}
            <span className="text-white">TOUCH</span>
          </h2>
          <p className="text-body-xl text-slate-300 font-cascadia font-medium leading-relaxed tracking-wide max-w-2xl mx-auto">
            Mari berkolaborasi dan ciptakan sesuatu yang{' '}
            <span className="font-semibold text-primary-300">amazing</span>!
          </p>

        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Side - Contact Form & Social */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Contact Form Panel */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-emerald-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-r from-cyan-600 to-emerald-600 rounded-full">
                    <FaPaperPlane className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-heading-lg font-bold text-white leading-snug tracking-tight">Hubungi Saya</h3>
                    <p className="text-body-md text-slate-400 font-medium leading-relaxed">Ada yang ingin didiskusikan? Kirim pesan ke saya!</p>
                  </div>
                </div>

                <form onSubmit={handleContactSubmit} className="space-y-6">
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
                        value={contactForm.name}
                        onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Masukkan nama lengkap Anda"
                        required
                        className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                      />
                    </div>
                    {contactErrors.name && (
                      <p className="text-red-400 text-sm flex items-center gap-2">
                        <span>⚠️</span> {contactErrors.name}
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
                        value={contactForm.email}
                        onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="email@example.com"
                        required
                        className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                      />
                    </div>
                    {contactErrors.email && (
                      <p className="text-red-400 text-sm flex items-center gap-2">
                        <span>⚠️</span> {contactErrors.email}
                      </p>
                    )}
                  </div>

                  {/* Pesan */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white flex items-center gap-2">
                      <FaComment className="w-4 h-4 text-cyan-400" />
                      Pesan <span className="text-cyan-400">*</span>
                    </label>
                    <div className="relative">
                      <FaComment className="absolute left-4 top-4 text-slate-400 w-4 h-4" />
                      <textarea
                        name="message"
                        value={contactForm.message}
                        onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                        placeholder="Ceritakan tentang proyek atau ide yang ingin Anda diskusikan..."
                        required
                        rows="5"
                        maxLength={500}
                        className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 resize-none"
                      />
                    </div>
                    {contactErrors.message && (
                      <p className="text-red-400 text-sm flex items-center gap-2">
                        <span>⚠️</span> {contactErrors.message}
                      </p>
                    )}
                  </div>
                  <InteractiveButton
                    type="submit"
                    disabled={isSubmittingContact}
                    loading={isSubmittingContact}
                    variant="primary"
                    size="lg"
                    className="w-full"
                    icon={<FaPaperPlane />}
                  >
                    Kirim Pesan
                  </InteractiveButton>
                </form>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
              <span className="text-slate-400 font-semibold">atau</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
            </div>

            {/* Social Media Panel */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50">
                <h3 className="text-heading-lg font-bold text-white mb-6 text-center leading-snug tracking-tight">Connect With Me</h3>
                <div className="grid gap-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 10 }}
                      className={`group flex items-center gap-4 p-4 bg-gradient-to-r ${social.color} rounded-xl text-white transition-all duration-300 ${social.hoverColor} hover:shadow-xl`}
                    >
                      <div className="text-2xl group-hover:scale-110 transition-transform duration-300">
                        {social.icon}
                      </div>
                      <div className="flex-1">
                        <span className="font-bold text-body-md tracking-tight">{social.name}</span>
                        <p className="text-caption-lg opacity-90 font-medium">Follow me on {social.name}</p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <FaReply className="rotate-180" />
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Comments System */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Comment Form Panel */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-full">
                    <FaComment className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Leave a Comment</h3>
                    <p className="text-slate-400">Share your thoughts!</p>
                  </div>
                </div>

                <form onSubmit={handleCommentSubmit} className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full bg-slate-700 border-2 border-slate-600 overflow-hidden">
                          {commentForm.photoPreview ? (
                            <img src={commentForm.photoPreview} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <FaCamera />
                            </div>
                          )}
                        </div>
                        <label className="absolute -bottom-2 -right-2 bg-cyan-600 text-white p-2 rounded-full cursor-pointer hover:bg-cyan-500 transition-colors duration-300">
                          <FaCamera className="text-sm" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                    <div className="flex-1 space-y-4">
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={commentForm.name}
                        onChange={(e) => setCommentForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-300"
                        required
                      />
                      <textarea
                        placeholder="Write your comment..."
                        rows="3"
                        value={commentForm.message}
                        onChange={(e) => setCommentForm(prev => ({ ...prev, message: e.target.value }))}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-300 resize-none"
                        required
                      ></textarea>
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmittingComment}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50"
                  >
                    {isSubmittingComment ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <FaComment />
                        <span>Post Comment</span>
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </div>

            {/* Comments Display */}
            <div className="space-y-4">
              <h4 className="text-xl font-bold text-white flex items-center gap-2">
                <FaComment className="text-cyan-400" />
                Comments ({comments.length})
              </h4>
              
              <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                <AnimatePresence>
                  {comments.map((comment, index) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 50, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9, x: -100 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="group relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/30 hover:border-cyan-400/30 transition-all duration-300"
                    >
                      <div className="flex gap-4">
                        <img 
                          src={comment.photo} 
                          alt={comment.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-slate-600"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h5 className="font-semibold text-white">{comment.name}</h5>
                              <p className="text-xs text-slate-400">
                                {new Date(comment.timestamp).toLocaleDateString('id-ID', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                          <p className="text-slate-300 mt-2 leading-relaxed">{comment.message}</p>
                          <div className="flex items-center gap-4 mt-4">
                            <button
                              onClick={() => handleLikeComment(comment.id)}
                              className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors duration-300 group/like"
                            >
                              <FaHeart className="group-hover/like:scale-110 transition-transform duration-300" />
                              <span className="text-sm">{comment.likes}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {comments.length === 0 && (
                  <div className="text-center py-12 text-slate-400">
                    <FaComment className="text-4xl mx-auto mb-4 opacity-50" />
                    <p>Belum ada komentar. Jadilah yang pertama!</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Admin Messages Modal */}
      <AnimatePresence>
        {isAdminOpen && (
          <AdminMessages 
            isOpen={isAdminOpen}
            onClose={() => setIsAdminOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(51, 65, 85, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #06b6d4, #10b981);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #0891b2, #059669);
        }
      `}</style>
    </section>
  );
};

export default Contact;