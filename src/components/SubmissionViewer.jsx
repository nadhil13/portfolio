import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEye, FaTrash, FaDownload, FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import { getStoredSubmissions, clearStoredSubmissions } from '../utils/formSubmission';

const SubmissionViewer = () => {
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showViewer, setShowViewer] = useState(false);

  useEffect(() => {
    loadSubmissions();
    
    // Reload submissions every 5 seconds
    const interval = setInterval(loadSubmissions, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadSubmissions = () => {
    const stored = getStoredSubmissions();
    setSubmissions(stored.sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at)));
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

  // Only show in development or for admin users
  if (process.env.NODE_ENV === 'production' && !window.location.search.includes('admin=true')) {
    return null;
  }

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setShowViewer(true)}
        className="fixed bottom-20 right-4 z-[9998] bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg backdrop-blur-md"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title={`View Submissions (${submissions.length})`}
      >
        <FaEnvelope className="text-lg" />
        {submissions.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
            {submissions.length > 99 ? '99+' : submissions.length}
          </span>
        )}
      </motion.button>

      {/* Submission Viewer Modal */}
      <AnimatePresence>
        {showViewer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4"
            onClick={() => setShowViewer(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex"
            >
              {/* Submissions List */}
              <div className="w-1/3 border-r dark:border-gray-700 flex flex-col">
                <div className="p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      📬 Form Submissions ({submissions.length})
                    </h2>
                    <button
                      onClick={() => setShowViewer(false)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={exportToCSV}
                      disabled={submissions.length === 0}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm disabled:opacity-50"
                    >
                      <FaDownload className="inline mr-1" /> Export
                    </button>
                    <button
                      onClick={handleClearAll}
                      disabled={submissions.length === 0}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm disabled:opacity-50"
                    >
                      <FaTrash className="inline mr-1" /> Clear
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {submissions.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
                      <FaEnvelope className="text-4xl mx-auto mb-4 opacity-50" />
                      <p>Belum ada submission</p>
                    </div>
                  ) : (
                    submissions.map((submission) => (
                      <motion.div
                        key={submission.id}
                        onClick={() => setSelectedSubmission(submission)}
                        className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                          selectedSubmission?.id === submission.id
                            ? 'bg-blue-50 border-blue-300 dark:bg-blue-900/20 dark:border-blue-600'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-750'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="font-semibold text-gray-900 dark:text-white text-sm">
                          {submission.name}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {submission.email}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {new Date(submission.submitted_at).toLocaleString('id-ID')}
                        </div>
                        <div className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded mt-1 inline-block">
                          {submission.projectType}
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>

              {/* Submission Detail */}
              <div className="flex-1 flex flex-col">
                {selectedSubmission ? (
                  <>
                    <div className="p-6 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {selectedSubmission.name}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            {selectedSubmission.email} • {selectedSubmission.phone}
                          </p>
                        </div>
                        <button
                          onClick={() => replyViaWhatsApp(selectedSubmission)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                        >
                          <FaWhatsapp /> Reply via WhatsApp
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Company</label>
                          <p className="text-gray-900 dark:text-white">{selectedSubmission.company || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Website</label>
                          <p className="text-gray-900 dark:text-white">{selectedSubmission.website || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Project Type</label>
                          <p className="text-gray-900 dark:text-white">{selectedSubmission.projectType}</p>
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Budget</label>
                          <p className="text-gray-900 dark:text-white">{selectedSubmission.budget}</p>
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Timeline</label>
                          <p className="text-gray-900 dark:text-white">{selectedSubmission.timeline}</p>
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Meeting Type</label>
                          <p className="text-gray-900 dark:text-white">{selectedSubmission.meetingType}</p>
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Preferred Date</label>
                          <p className="text-gray-900 dark:text-white">{selectedSubmission.preferredDate}</p>
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Preferred Time</label>
                          <p className="text-gray-900 dark:text-white">{selectedSubmission.preferredTime}</p>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Project Description</label>
                        <p className="text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 p-3 rounded-lg mt-1">
                          {selectedSubmission.description}
                        </p>
                      </div>

                      {selectedSubmission.additionalNotes && (
                        <div>
                          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Additional Notes</label>
                          <p className="text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 p-3 rounded-lg mt-1">
                            {selectedSubmission.additionalNotes}
                          </p>
                        </div>
                      )}

                      <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Submission Info</label>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Submitted: {new Date(selectedSubmission.submitted_at).toLocaleString('id-ID')}<br/>
                          Timezone: {selectedSubmission.timezone}<br/>
                          How they found us: {selectedSubmission.hearAboutUs || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
                    <div className="text-center">
                      <FaEye className="text-4xl mx-auto mb-4 opacity-50" />
                      <p>Pilih submission untuk melihat detail</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SubmissionViewer;