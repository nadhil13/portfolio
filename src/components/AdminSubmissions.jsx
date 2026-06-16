import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaEnvelope, 
  FaEnvelopeOpen, 
  FaUser, 
  FaTrash, 
  FaDownload, 
  FaWhatsapp, 
  FaEye,
  FaEyeSlash,
  FaTimes,
  FaCheck,
  FaSignOutAlt,
  FaClock,
  FaShieldAlt,
  FaCalendarAlt,
  FaPhone,
  FaBuilding,
  FaGlobe,
  FaDollarSign,
  FaProjectDiagram
} from 'react-icons/fa';
import { useAdmin } from '../contexts/AdminContext';
import { getStoredSubmissions, clearStoredSubmissions } from '../utils/formSubmission';

const AdminSubmissions = ({ isOpen, onClose }) => {
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [sessionTime, setSessionTime] = useState('');
  
  const { logout, getSessionTimeRemaining, extendSession } = useAdmin();

  // Load submissions from storage
  useEffect(() => {
    if (isOpen) {
      loadSubmissions();
    }
  }, [isOpen]);

  // Auto-refresh submissions
  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(loadSubmissions, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  // Session timer
  useEffect(() => {
    const updateSessionTime = () => {
      const remaining = getSessionTimeRemaining();
      const minutes = Math.floor(remaining / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
      setSessionTime(`${minutes}:${String(seconds).padStart(2, '0')}`);
      
      if (remaining <= 0) {
        handleLogout();
      }
    };

    if (isOpen) {
      updateSessionTime();
      const timer = setInterval(updateSessionTime, 1000);
      return () => clearInterval(timer);
    }
  }, [isOpen]);

  const loadSubmissions = () => {
    const stored = getStoredSubmissions();
    setSubmissions(stored.sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at)));
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  const handleClearAll = () => {
    if (window.confirm('Hapus semua submission? Tindakan ini tidak dapat dibatalkan.')) {
      clearStoredSubmissions();
      setSubmissions([]);
      setSelectedSubmission(null);
    }
  };

  const exportToCSV = () => {
    if (submissions.length === 0) return;
    
    const headers = [
      'Date', 'Name', 'Email', 'Phone', 'Company', 'Website',
      'Project Type', 'Budget', 'Timeline', 'Description',
      'Preferred Date', 'Preferred Time', 'Meeting Type', 'Timezone',
      'Hear About Us', 'Additional Notes'
    ];
    
    const csvContent = [
      headers.join(','),
      ...submissions.map(sub => [
        new Date(sub.submitted_at).toLocaleString('id-ID'),
        sub.name, sub.email, sub.phone, sub.company || '', sub.website || '',
        sub.projectType, sub.budget, sub.timeline, `"${sub.description}"`,
        sub.preferredDate, sub.preferredTime, sub.meetingType, sub.timezone,
        sub.hearAboutUs || '', `"${sub.additionalNotes || ''}"`
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `submissions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const replyViaWhatsApp = (submission) => {
    const message = `Hi ${submission.name}! 👋

Terima kasih sudah mengisi form contact di portfolio saya. Saya sudah menerima request project Anda:

📋 *Project Details:*
• Type: ${submission.projectType}
• Budget: ${submission.budget}  
• Timeline: ${submission.timeline}

📅 *Meeting Schedule:*
• Date: ${submission.preferredDate}
• Time: ${submission.preferredTime}
• Type: ${submission.meetingType}

Saya akan review project requirements Anda dan akan menghubungi kembali dalam 24 jam untuk konfirmasi meeting.

Ada pertanyaan tambahan yang ingin didiskusikan sebelum meeting?

Best regards,
Nadhil 🚀`;

    const whatsappUrl = `https://wa.me/${submission.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const deleteSubmission = (submissionId) => {
    if (window.confirm('Hapus submission ini?')) {
      const updatedSubmissions = submissions.filter(sub => sub.id !== submissionId);
      setSubmissions(updatedSubmissions);
      localStorage.setItem('portfolioSubmissions', JSON.stringify(updatedSubmissions));
      
      if (selectedSubmission?.id === submissionId) {
        setSelectedSubmission(null);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9999] flex items-center justify-center p-2 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-dark-900/95 backdrop-blur-xl rounded-xl shadow-2xl w-full max-w-7xl max-h-[85vh] mb-20 overflow-hidden flex flex-col border border-primary-400/20"
        >
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-dark-600 bg-gradient-to-r from-dark-800 to-dark-900">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center">
                  <FaEnvelope className="text-white text-lg" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    Form Submissions
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Total: {submissions.length} submissions
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Session Info */}
                <div className="hidden sm:flex items-center gap-2 bg-dark-800/50 px-3 py-2 rounded-lg border border-dark-600">
                  <FaClock className="text-green-400 text-sm" />
                  <span className="text-white text-sm font-mono">{sessionTime}</span>
                </div>
                
                {/* Actions */}
                <button
                  onClick={exportToCSV}
                  disabled={submissions.length === 0}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm disabled:opacity-50 flex items-center gap-2"
                >
                  <FaDownload className="text-xs" />
                  <span className="hidden sm:inline">Export</span>
                </button>
                
                <button
                  onClick={handleClearAll}
                  disabled={submissions.length === 0}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm disabled:opacity-50 flex items-center gap-2"
                >
                  <FaTrash className="text-xs" />
                  <span className="hidden sm:inline">Clear All</span>
                </button>
                
                <button
                  onClick={handleLogout}
                  className="bg-dark-700 hover:bg-dark-600 text-white px-3 py-2 rounded-lg text-sm border border-dark-600 flex items-center gap-2"
                >
                  <FaSignOutAlt className="text-xs" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
                
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white text-xl p-2"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Submissions List */}
            <div className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-dark-600 flex flex-col max-h-64 lg:max-h-none">
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {submissions.length === 0 ? (
                  <div className="text-center text-gray-400 mt-8">
                    <FaEnvelopeOpen className="text-4xl mx-auto mb-4 opacity-50" />
                    <p>Belum ada submission</p>
                  </div>
                ) : (
                  submissions.map((submission) => (
                    <motion.div
                      key={submission.id}
                      onClick={() => setSelectedSubmission(submission)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                        selectedSubmission?.id === submission.id
                          ? 'bg-blue-600/20 border-blue-400'
                          : 'bg-dark-800/50 border-dark-600 hover:bg-dark-700/50 hover:border-dark-500'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-white text-sm truncate">
                            {submission.name}
                          </div>
                          <div className="text-xs text-gray-400 truncate">
                            {submission.email}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(submission.submitted_at).toLocaleDateString('id-ID')}
                          </div>
                          <div className="text-xs bg-green-600/20 text-green-300 px-2 py-1 rounded mt-1 inline-block">
                            {submission.projectType}
                          </div>
                        </div>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSubmission(submission.id);
                          }}
                          className="text-red-400 hover:text-red-300 ml-2 p-1"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Submission Detail */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {selectedSubmission ? (
                <>
                  {/* Detail Header */}
                  <div className="p-4 sm:p-6 border-b border-dark-600 bg-dark-800/30">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
                          <FaUser className="text-white text-sm" />
                        </div>
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-white">
                            {selectedSubmission.name}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {selectedSubmission.email} • {selectedSubmission.phone}
                          </p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => replyViaWhatsApp(selectedSubmission)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                      >
                        <FaWhatsapp />
                        <span className="hidden sm:inline">Reply via WhatsApp</span>
                        <span className="sm:hidden">Reply</span>
                      </button>
                    </div>
                  </div>

                  {/* Detail Content */}
                  <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                    {/* Basic Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <FaBuilding className="text-blue-400 text-sm" />
                          <label className="text-sm font-semibold text-gray-300">Company</label>
                        </div>
                        <p className="text-white bg-dark-800/50 p-2 rounded">
                          {selectedSubmission.company || 'N/A'}
                        </p>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <FaGlobe className="text-green-400 text-sm" />
                          <label className="text-sm font-semibold text-gray-300">Website</label>
                        </div>
                        <p className="text-white bg-dark-800/50 p-2 rounded">
                          {selectedSubmission.website || 'N/A'}
                        </p>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <FaProjectDiagram className="text-purple-400 text-sm" />
                          <label className="text-sm font-semibold text-gray-300">Project Type</label>
                        </div>
                        <p className="text-white bg-dark-800/50 p-2 rounded">
                          {selectedSubmission.projectType}
                        </p>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <FaDollarSign className="text-yellow-400 text-sm" />
                          <label className="text-sm font-semibold text-gray-300">Budget</label>
                        </div>
                        <p className="text-white bg-dark-800/50 p-2 rounded">
                          {selectedSubmission.budget}
                        </p>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <FaClock className="text-orange-400 text-sm" />
                          <label className="text-sm font-semibold text-gray-300">Timeline</label>
                        </div>
                        <p className="text-white bg-dark-800/50 p-2 rounded">
                          {selectedSubmission.timeline}
                        </p>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="text-red-400 text-sm" />
                          <label className="text-sm font-semibold text-gray-300">Meeting Type</label>
                        </div>
                        <p className="text-white bg-dark-800/50 p-2 rounded">
                          {selectedSubmission.meetingType}
                        </p>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="text-pink-400 text-sm" />
                          <label className="text-sm font-semibold text-gray-300">Preferred Date</label>
                        </div>
                        <p className="text-white bg-dark-800/50 p-2 rounded">
                          {selectedSubmission.preferredDate}
                        </p>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <FaClock className="text-cyan-400 text-sm" />
                          <label className="text-sm font-semibold text-gray-300">Preferred Time</label>
                        </div>
                        <p className="text-white bg-dark-800/50 p-2 rounded">
                          {selectedSubmission.preferredTime}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-300">Project Description</label>
                      <p className="text-white bg-dark-800/50 p-3 rounded-lg leading-relaxed">
                        {selectedSubmission.description}
                      </p>
                    </div>

                    {/* Additional Notes */}
                    {selectedSubmission.additionalNotes && (
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-300">Additional Notes</label>
                        <p className="text-white bg-dark-800/50 p-3 rounded-lg leading-relaxed">
                          {selectedSubmission.additionalNotes}
                        </p>
                      </div>
                    )}

                    {/* Submission Meta */}
                    <div className="bg-gradient-to-r from-dark-800/50 to-dark-700/50 p-4 rounded-lg border border-dark-600">
                      <label className="text-sm font-semibold text-gray-300 block mb-2">Submission Info</label>
                      <div className="text-sm text-gray-400 space-y-1">
                        <p>📅 Submitted: {new Date(selectedSubmission.submitted_at).toLocaleString('id-ID')}</p>
                        <p>🌏 Timezone: {selectedSubmission.timezone}</p>
                        <p>🔍 How they found us: {selectedSubmission.hearAboutUs || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <FaEye className="text-4xl mx-auto mb-4 opacity-50" />
                    <p>Pilih submission untuk melihat detail</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AdminSubmissions;