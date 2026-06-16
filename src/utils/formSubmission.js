// 🚀 PORTFOLIO CONTACT FORM SUBMISSION UTILITY
// Multiple submission methods dengan dual integration support

/**
 * EmailJS Integration (Setup: emailjs.com)
 */
export const submitViaEmailJS = async (formData) => {
  try {
    // Check if EmailJS is available
    if (!window.emailjs) {
      throw new Error('EmailJS not loaded. Please check CDN script.');
    }
    
    // Check if it's simple form (3 fields) or complex form (many fields)
    const isSimpleForm = !formData.projectType && !formData.phone && formData.message;
    
    // 🚀 DUAL EMAIL SERVICES CONFIGURATION
    let EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_CONFIRMATION_TEMPLATE_ID, EMAILJS_PUBLIC_KEY;
    
    if (isSimpleForm) {
      // 📧 KONFIGURASI UNTUK "HUBUNGI SAYA" (Simple Contact Form)
      EMAILJS_SERVICE_ID = 'service_z68b034';
      EMAILJS_TEMPLATE_ID = 'template_10sge1e';   // Owner template 
      EMAILJS_CONFIRMATION_TEMPLATE_ID = 'template_e5xlvll';  // User template
      EMAILJS_PUBLIC_KEY = 'bdWvhLtKqcUdjBP90';
      console.log('📧 Using SIMPLE FORM email service (Hubungi Saya)');
    } else {
      // 🚀 KONFIGURASI UNTUK "LET'S BUILD SOMETHING AMAZING" (Advanced Contact Form)
      EMAILJS_SERVICE_ID = 'service_w1dg09d';
      EMAILJS_TEMPLATE_ID = 'template_zruts7g';   // Owner template
      EMAILJS_CONFIRMATION_TEMPLATE_ID = 'template_5rc78rs';  // User template  
      EMAILJS_PUBLIC_KEY = 'EIZVSLZ6tZSc6Ntq5';
      console.log('🚀 Using ADVANCED FORM email service (Let\'s Build Something Amazing)');
    }
    
    let ownerTemplateParams, userTemplateParams;
    
    if (isSimpleForm) {
      // Generate email reply untuk owner
      const emailReplyTemplate = generateEmailReplyTemplate(formData);
      const emailReplyLink = generateEmailReplyLink(formData.email, emailReplyTemplate);
      
      // Simple form template parameters for OWNER
      ownerTemplateParams = {
        to_name: 'Dil', // Your name
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
        form_type: 'Simple Contact Form',
        submission_date: new Date().toLocaleString('id-ID'),
        email_reply_link: emailReplyLink, // ✨ NEW: Email reply link dengan template
        reply_template: emailReplyTemplate // ✨ NEW: Template preview
      };

      // Confirmation template for USER
      userTemplateParams = {
        to_name: formData.name, // User's name
        to_email: formData.email, // User's email
        from_name: 'Dil', // Your name
        message_preview: formData.message.substring(0, 100) + (formData.message.length > 100 ? '...' : ''),
        form_type: 'Pesan Kontak',
        submission_date: new Date().toLocaleString('id-ID'),
        owner_email: 'nadhilarsy@gmail.com', // Ganti dengan email Anda
        owner_whatsapp: '+6281270632690' // Nomor WhatsApp Anda
      };
    } else {
      // Generate WhatsApp response untuk owner
      const whatsappTemplate = generateOwnerResponseTemplate(formData);
      const whatsappLink = generateWhatsAppLink(formData.phone, whatsappTemplate);
      
      // Complex form template parameters for OWNER  
      ownerTemplateParams = {
        to_name: 'Dil', // Your name
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone || '-',
        company: formData.company || '-',
        website: formData.website || '-',
        project_type: formData.projectType || '-',
        budget: formData.budget || '-',
        timeline: formData.timeline || '-',
        description: formData.description || '-',
        preferred_date: formData.preferredDate || '-',
        preferred_time: formData.preferredTime || '-',
        meeting_type: formData.meetingType || '-',
        timezone: formData.timezone || '-',
        hear_about_us: formData.hearAboutUs || '-',
        additional_notes: formData.additionalNotes || '-',
        form_type: 'Project Inquiry Form',
        submission_date: new Date().toLocaleString('id-ID'),
        whatsapp_link: whatsappLink, // ✨ NEW: Click to send WhatsApp response
        whatsapp_template: whatsappTemplate // ✨ NEW: Template preview
      };

      // Confirmation template for USER
      userTemplateParams = {
        to_name: formData.name, // User's name
        to_email: formData.email, // User's email
        from_name: 'Dil', // Your name
        project_type: formData.projectType,
        budget: formData.budget,
        description_preview: formData.description.substring(0, 150) + (formData.description.length > 150 ? '...' : ''),
        form_type: 'Project Inquiry',
        submission_date: new Date().toLocaleString('id-ID'),
        owner_email: 'nadhilarsy@gmail.com', // ✅ Your email (konsisten)
        owner_whatsapp: '+6281270632690', // Nomor WhatsApp Anda
        estimated_response: '24 jam'
      };
    }

    // 🚀 STEP-BY-STEP DEBUG VERSION
    console.log('🔍 DEBUG: Template IDs being used:', {
      ownerTemplate: EMAILJS_TEMPLATE_ID,
      userTemplate: EMAILJS_CONFIRMATION_TEMPLATE_ID
    });
    
    console.log('🔍 DEBUG: Owner params:', ownerTemplateParams);
    console.log('🔍 DEBUG: User params:', userTemplateParams);
    
    console.log('📧 Sending email to OWNER...');
    const ownerResponse = await window.emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      ownerTemplateParams,
      EMAILJS_PUBLIC_KEY
    );
    console.log('✅ Owner email response:', ownerResponse);
    
    console.log('📧 Sending confirmation to USER...');
    const userResponse = await window.emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_CONFIRMATION_TEMPLATE_ID,
      userTemplateParams,
      EMAILJS_PUBLIC_KEY
    );
    console.log('✅ User email response:', userResponse);
    
    console.log('✅ EmailJS Success - Both emails sent:', { ownerResponse, userResponse });
    return { 
      success: true, 
      message: 'Email notification dikirim ke owner & konfirmasi dikirim ke client!',
      responses: { owner: ownerResponse, user: userResponse }
    };
    
  } catch (error) {
    console.error('❌ EmailJS Error:', error);
    throw new Error(`EmailJS gagal: ${error.message}`);
  }
};

/**
 * 🛡️ SECURE WhatsApp Integration - Manual dengan Enhanced UX
 * Lebih aman dari API pihak ketiga - tanpa risiko account banned
 */
export const sendViaWhatsAppSecure = (formData) => {
  const OWNER_PHONE = '6281270632690'; // Nomor WhatsApp owner
  
  // 🛡️ SECURE: Manual WhatsApp dengan Smart Auto-Open (NO API)
  const ownerMessage = generateOwnerMessage(formData);
  const ownerWhatsappUrl = `https://wa.me/${OWNER_PHONE}?text=${encodeURIComponent(ownerMessage)}`;
  
  // User confirmation (jika ada nomor)
  let userWhatsappUrl = null;
  let userConfirmationMessage = null;
  
  if (formData.phone) {
    const cleanPhone = formData.phone.replace(/\D/g, '');
    const formattedPhone = cleanPhone.startsWith('62') ? cleanPhone : `62${cleanPhone.replace(/^0/, '')}`;
    userConfirmationMessage = generateUserMessage(formData);
    userWhatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(userConfirmationMessage)}`;
  }
  
  console.log('🛡️ Secure WhatsApp URLs generated - ready for smart auto-open');
  
  return {
    success: true,
    message: '🛡️ Secure WhatsApp ready - Auto-opening dengan smart delay',
    method: 'SECURE_MANUAL',
    action: () => {
      // 1. Open owner WhatsApp immediately (SELESAI!)
      console.log('📱 Opening owner WhatsApp...');
      window.open(ownerWhatsappUrl, '_blank');
      
      // 2. DONE! Owner tidak perlu repot lagi
      console.log('✅ Owner workflow complete - no additional action needed!');
      
      // Note: User akan dapat email confirmation sudah cukup
      // Kalau owner mau chat user manual, bisa lihat nomor di email
    },
    urls: {
      owner: ownerWhatsappUrl,
      user: userWhatsappUrl
    },
    security: {
      level: 'HIGH',
      method: 'Manual WhatsApp (no API)',
      risks: 'Minimal - no third-party API dependency',
      benefits: ['No API token needed', 'No account ban risk', 'Full WhatsApp compliance', 'No monthly limits']
    }
  };
};

/**
 * Helper: Generate Owner WhatsApp Message
 */
const generateOwnerMessage = (formData) => {
  const isSimpleForm = !formData.projectType && !formData.phone && formData.message;
  
  if (isSimpleForm) {
    return `📩 *Pesan Baru dari Website Portfolio*

👤 *Pengirim:*
• Nama: ${formData.name}
• Email: ${formData.email}

💬 *Pesan:*
${formData.message}

---
_Auto-sent: ${new Date().toLocaleString('id-ID')}_`;
  } else {
    return `🚀 *New Project Inquiry - AUTO NOTIFICATION*

👤 *Client Details:*
• Name: ${formData.name}
• Email: ${formData.email}
• Phone: ${formData.phone}
• Company: ${formData.company || '-'}

💼 *Project Information:*
• Type: ${formData.projectType}
• Budget: ${formData.budget}
• Timeline: ${formData.timeline || '-'}

📋 *Description:*
${formData.description}

📅 *Meeting Request:*
• Date: ${formData.preferredDate || '-'}
• Time: ${formData.preferredTime || '-'}

---
_Auto-sent: ${new Date().toLocaleString('id-ID')}_
_Reply untuk diskusi project!_ 💬`;
  }
};

/**
 * Helper: Generate User WhatsApp Message
 */
const generateUserMessage = (formData) => {
  const isSimpleForm = !formData.projectType && !formData.phone && formData.message;
  
  if (isSimpleForm) {
    return `✅ *Pesan Anda Sudah Diterima!*

Halo ${formData.name}! 👋

Terima kasih sudah menghubungi saya. Pesan Anda sudah saya terima dan akan saya balas dalam 24 jam.

💬 *Pesan Anda:*
"${formData.message.substring(0, 100)}${formData.message.length > 100 ? '...' : ''}"

---
*Muhammad Nadhil Arsy Al-Wafi*
_Full Stack Developer_`;
  } else {
    return `✅ *Project Inquiry Diterima!*

Halo ${formData.name}! 👋

Terima kasih sudah submit project inquiry. Detail sudah saya terima:

💼 *Project: ${formData.projectType}*
💰 *Budget: ${formData.budget}*

📞 *Next Steps:*
• Saya akan review dalam 24 jam
• Meeting sesuai jadwal yang Anda pilih
• Email konfirmasi sudah dikirim

Looking forward to working with you! 🚀

---
*Muhammad Nadhil Arsy Al-Wafi*
_Full Stack Developer & Cybersecurity_`;
  }
};

/**
 * Helper: Clean Phone Number
 */
const cleanPhoneNumber = (phone) => {
  let cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '62' + cleanPhone.slice(1);
  }
  if (!cleanPhone.startsWith('62')) {
    cleanPhone = '62' + cleanPhone;
  }
  return cleanPhone;
};

/**
 * Fallback: Manual WhatsApp (original method)
 */
export const sendViaWhatsAppManual = (formData) => {
  const ownerPhoneNumber = '6281270632690'; // Nomor WhatsApp Anda
  
  // Check if it's simple form (3 fields) or complex form (many fields)
  const isSimpleForm = !formData.projectType && !formData.phone && formData.message;
  
  let ownerMessage, userConfirmationMessage;
  
  if (isSimpleForm) {
    // Owner notification message
    ownerMessage = `📩 *Pesan Baru dari Website Portfolio*

👤 *Pengirim:*
• Nama: ${formData.name}
• Email: ${formData.email}

💬 *Pesan:*
${formData.message}

---
_Dikirim: ${new Date().toLocaleString('id-ID')}_

Hai! Saya tertarik untuk berdiskusi lebih lanjut dengan Anda. Terima kasih! 😊`;

    // User confirmation message (untuk di copy atau sebagai template)
    userConfirmationMessage = `✅ *Pesan Anda Sudah Diterima!*

Halo ${formData.name}! 👋

Terima kasih sudah menghubungi saya melalui website portfolio. Pesan Anda sudah saya terima:

💬 *Pesan Anda:*
"${formData.message.substring(0, 100)}${formData.message.length > 100 ? '...' : ''}"

📞 *Next Steps:*
• Saya akan membalas dalam 24 jam
• Atau chat langsung di WhatsApp ini
• Email konfirmasi sudah dikirim ke ${formData.email}

Terima kasih! 😊

---
_Muhammad Nadhil Arsy Al-Wafi_
_Full Stack Developer_`;

  } else {
    // Owner notification message
    ownerMessage = `🚀 *New Project Inquiry*

👤 *Client Details:*
• Name: ${formData.name}
• Email: ${formData.email}
• Phone: ${formData.phone}
• Company: ${formData.company || '-'}
• Website: ${formData.website || '-'}

💼 *Project Information:*
• Type: ${formData.projectType}
• Budget: ${formData.budget}
• Timeline: ${formData.timeline || '-'}

📋 *Description:*
${formData.description}

📅 *Meeting Request:*
• Date: ${formData.preferredDate || '-'}
• Time: ${formData.preferredTime || '-'}
• Type: ${formData.meetingType || 'video'}
• Timezone: ${formData.timezone || 'WIB'}

📝 *Additional Info:*
• How they found us: ${formData.hearAboutUs || '-'}
• Notes: ${formData.additionalNotes || '-'}

---
_Submitted: ${new Date().toLocaleString('id-ID')}_`;

    // User confirmation message
    userConfirmationMessage = `✅ *Project Inquiry Diterima!*

Halo ${formData.name}! 👋

Terima kasih sudah submit project inquiry. Detail sudah saya terima:

💼 *Project: ${formData.projectType}*
💰 *Budget: ${formData.budget}*
📋 *Deskripsi: ${formData.description.substring(0, 100)}${formData.description.length > 100 ? '...' : ''}*

📞 *Next Steps:*
• Saya akan review dalam 24 jam
• Meeting sesuai jadwal yang Anda pilih
• Email konfirmasi sudah dikirim ke ${formData.email}
• Atau chat langsung di WhatsApp ini untuk diskusi cepat

Looking forward to working with you! 🚀

---
_Muhammad Nadhil Arsy Al-Wafi_
_Full Stack Developer & Cybersecurity_`;
  }
  
  const ownerWhatsappUrl = `https://wa.me/${ownerPhoneNumber}?text=${encodeURIComponent(ownerMessage)}`;
  
  // If user provided phone, create WhatsApp confirmation link for them
  let userWhatsappUrl = null;
  if (formData.phone) {
    // Clean phone number
    let userPhone = formData.phone.replace(/\D/g, '');
    if (userPhone.startsWith('0')) {
      userPhone = '62' + userPhone.slice(1);
    }
    if (!userPhone.startsWith('62')) {
      userPhone = '62' + userPhone;
    }
    
    userWhatsappUrl = `https://wa.me/${userPhone}?text=${encodeURIComponent(userConfirmationMessage)}`;
  }
  
  return { 
    success: true, 
    message: 'WhatsApp notification ready!', 
    action: () => {
      // 🚀 IMPROVED FLOW: Owner WhatsApp opens immediately
      console.log('📱 Opening WhatsApp for owner...');
      window.open(ownerWhatsappUrl, '_blank');
      
      // If user has phone, provide easy way to contact them
      if (userWhatsappUrl) {
        console.log('📱 User WhatsApp URL ready:', userWhatsappUrl);
        
        // Show notification to owner with quick access
        setTimeout(() => {
          const userContactNotification = document.createElement('div');
          userContactNotification.innerHTML = `
            <div style="
              position: fixed; 
              top: 20px; 
              right: 20px; 
              background: linear-gradient(135deg, #25D366, #128C7E); 
              color: white; 
              padding: 15px 20px; 
              border-radius: 12px; 
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
              z-index: 10000;
              font-family: Arial, sans-serif;
              max-width: 350px;
              cursor: pointer;
            ">
              <div style="font-weight: bold; margin-bottom: 8px;">💬 Contact Client Directly</div>
              <div style="font-size: 14px; margin-bottom: 10px;">
                Send WhatsApp confirmation to ${formData.name}
              </div>
              <div style="font-size: 12px; opacity: 0.9;">
                📱 ${formData.phone} • Click to open WhatsApp
              </div>
            </div>
          `;
          
          // Add click handler to open user WhatsApp
          userContactNotification.onclick = () => {
            window.open(userWhatsappUrl, '_blank');
            document.body.removeChild(userContactNotification);
          };
          
          // Auto remove after 10 seconds
          setTimeout(() => {
            if (document.body.contains(userContactNotification)) {
              document.body.removeChild(userContactNotification);
            }
          }, 10000);
          
          document.body.appendChild(userContactNotification);
        }, 1000);
      }
    },
    urls: {
      owner: ownerWhatsappUrl,
      user: userWhatsappUrl
    },
    confirmationMessage: userConfirmationMessage
  };
};

/**
 * LocalStorage Backup (Always works)
 */
export const saveToLocalStorage = (formData) => {
  try {
    const submissions = JSON.parse(localStorage.getItem('portfolio_submissions') || '[]');
    const newSubmission = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      status: 'submitted',
      ...formData
    };
    
    submissions.push(newSubmission);
    localStorage.setItem('portfolio_submissions', JSON.stringify(submissions));
    
    console.log('✅ LocalStorage saved:', newSubmission.id);
    return { 
      success: true, 
      message: 'Backup tersimpan di LocalStorage',
      submissionId: newSubmission.id
    };
  } catch (error) {
    console.error('❌ LocalStorage Error:', error);
    return { 
      success: false, 
      message: `LocalStorage gagal: ${error.message}` 
    };
  }
};

/**
 * 🎯 DUAL SUBMISSION WITH DUAL CONFIRMATION - Email + WhatsApp + LocalStorage
 */
export const submitViaDual = async (formData) => {
  console.log('🚀 DUAL SUBMISSION WITH DUAL CONFIRMATION START');
  console.log('📧 Owner gets: Email notification + WhatsApp');
  console.log('✅ User gets: Email confirmation + WhatsApp confirmation (if phone provided)');
  
  // 1. Save to LocalStorage first (backup)
  const localResult = saveToLocalStorage(formData);
  
  // 2. Try EmailJS (sends 2 emails: 1 to owner, 1 to user)
  let emailResult = { success: false, message: 'Not attempted' };
  try {
    emailResult = await submitViaEmailJS(formData);
    console.log('✅ Email: SUCCESS - Both owner & user emails sent');
  } catch (emailError) {
    console.warn('⚠️ Email: FAILED -', emailError.message);
    emailResult = { success: false, message: emailError.message };
  }
  
  // 3. WhatsApp link sudah include di email - no auto-open needed
  console.log('✅ WhatsApp: Link tersedia di email notification');
  
  // 4. Return comprehensive result
  const hasUserPhone = formData.phone && formData.phone.trim();
  
  return {
    success: true,
    message: `🎉 DUAL CONFIRMATION WITH EMAIL WHATSAPP LINK!

👤 **UNTUK ANDA (Owner):**
📧 Email: ${emailResult.success ? '✅ Notifikasi dikirim ke inbox dengan WhatsApp link!' : '❌ Gagal - ' + emailResult.message}
📱 WhatsApp: ${hasUserPhone ? '✅ Link siap di email - klik untuk response' : '⚠️ User tidak berikan nomor HP'}

👥 **UNTUK CLIENT:**
📧 Email: ${emailResult.success ? '✅ Konfirmasi dikirim ke ' + formData.email : '❌ Konfirmasi email gagal'}
💾 Backup: ✅ Tersimpan di Admin Panel

${emailResult.success ? '🚀 Cek email Anda dan klik WhatsApp link untuk response instant!' : 'Client belum dapat email, tapi backup tersimpan.'}`,
    
    results: {
      email: emailResult,
      whatsappLinkGenerated: hasUserPhone,
      localStorage: localResult
    },
    
    // Additional info for UI
    userConfirmation: {
      emailSent: emailResult.success,
      whatsappLinkReady: hasUserPhone,
      backupSaved: localResult.success,
      workflow: 'email_with_whatsapp_link'
    }
  };
};

/**
 * 🎯 MAIN SUBMISSION FUNCTION
 */
export const submitContactForm = async (formData, options = {}) => {
  const { method = 'localStorage' } = options;
  
  console.log(`🚀 Form submission with method: ${method}`);
  
  switch (method) {
    case 'dual':
    case 'both':
      return await submitViaDual(formData);
      
    case 'emailjs':
      const localBackup = saveToLocalStorage(formData);
      try {
        const emailResult = await submitViaEmailJS(formData);
        return emailResult;
      } catch (error) {
        return { 
          success: false, 
          message: `Email gagal: ${error.message}. Backup tersimpan di LocalStorage.`,
          backup: localBackup
        };
      }
      
    case 'whatsapp':
      const localBackup2 = saveToLocalStorage(formData);
      try {
        const whatsappResult = await sendViaWhatsAppAutoSend(formData);
        return {
          success: true,
          message: 'WhatsApp auto-sent! Backup tersimpan.',
          whatsapp: whatsappResult,
          backup: localBackup2
        };
      } catch (error) {
        const whatsappResult = sendViaWhatsAppManual(formData);
        return {
          success: true,
          message: 'WhatsApp manual mode. Backup tersimpan.',
          whatsapp: whatsappResult,
          backup: localBackup2,
          action: whatsappResult.action
        };
      }
      
    case 'localStorage':
    default:
      return saveToLocalStorage(formData);
  }
};

/**
 * 📊 ADMIN FUNCTIONS
 */
export const getStoredSubmissions = () => {
  try {
    return JSON.parse(localStorage.getItem('portfolio_submissions') || '[]');
  } catch (error) {
    console.error('Error reading submissions:', error);
    return [];
  }
};

export const clearStoredSubmissions = () => {
  localStorage.removeItem('portfolio_submissions');
  return { success: true, message: 'All submissions cleared' };
};

export const exportSubmissionsToCSV = () => {
  const submissions = getStoredSubmissions();
  if (submissions.length === 0) {
    return { success: false, message: 'No submissions to export' };
  }
  
  const headers = ['ID', 'Date', 'Name', 'Email', 'Phone', 'Company', 'Project Type', 'Budget', 'Description'];
  const csvContent = [
    headers.join(','),
    ...submissions.map(sub => [
      sub.id,
      new Date(sub.timestamp).toLocaleString('id-ID'),
      `"${sub.name}"`,
      sub.email,
      sub.phone,
      `"${sub.company || ''}"`,
      `"${sub.projectType}"`,
      `"${sub.budget}"`,
      `"${(sub.description || '').replace(/"/g, '""')}"`
    ].join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `portfolio-submissions-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  
  return { success: true, message: 'CSV exported successfully' };
};

/**
 * ✨ NEW: Generate Owner Response Template untuk WhatsApp
 */
const generateOwnerResponseTemplate = (formData) => {
  const isSimpleForm = !formData.projectType && !formData.phone && formData.message;
  
  if (isSimpleForm) {
    return `Halo ${formData.name}! 👋

Terima kasih sudah menghubungi saya melalui website portfolio.

Saya sudah terima pesan Anda dan tertarik untuk diskusi lebih lanjut.

Kapan waktu yang tepat untuk kita diskusi project ini?

Best regards,
Dil 🚀`;
  } else {
    return `Halo ${formData.name}! 👋

Terima kasih sudah submit project inquiry di website portfolio saya.

📋 *Detail yang saya terima:*
• Project Type: ${formData.projectType}
• Budget: ${formData.budget}
• Timeline: ${formData.timeline}

Saya tertarik dengan project ini dan ingin diskusi lebih detail tentang requirement dan scope-nya.

Kapan kita bisa schedule meeting untuk bahas lebih lanjut? 

Best regards,
Dil 🚀
_Full Stack Developer_`;
  }
};

/**
 * ✨ NEW: Generate WhatsApp Link dengan Template 
 */
const generateWhatsAppLink = (userPhone, template) => {
  if (!userPhone) return null;
  
  const cleanPhone = userPhone.replace(/\D/g, '');
  const formattedPhone = cleanPhone.startsWith('62') ? cleanPhone : `62${cleanPhone.replace(/^0/, '')}`;
  
  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(template)}`;
};

/**
 * ✨ NEW: Generate Email Reply Template untuk Simple Contact Form
 */
const generateEmailReplyTemplate = (formData) => {
  return `Subject: Re: Pesan dari Website Portfolio

Halo ${formData.name},

Terima kasih telah menghubungi saya melalui website portfolio. Saya sudah membaca pesan Anda dan senang bisa berdiskusi lebih lanjut.

Pesan Anda:
"${formData.message}"

Saya tertarik untuk mengetahui lebih detail tentang apa yang bisa saya bantu. Kapan waktu yang tepat untuk kita diskusi lebih lanjut? Saya bisa dihubungi via email ini atau WhatsApp di +62 812-7063-2690.

Terima kasih atas kepercayaan Anda!

Best regards,
Muhammad Nadhil
Full Stack Developer
Website: [Your Website URL]
Email: nadhilarsy@gmail.com
WhatsApp: +62 812-7063-2690`;
};

/**
 * ✨ NEW: Generate Email Reply Link (mailto)
 */
const generateEmailReplyLink = (userEmail, template) => {
  if (!userEmail) return null;
  
  const subject = encodeURIComponent('Re: Pesan dari Website Portfolio');
  const body = encodeURIComponent(template);
  
  return `mailto:${userEmail}?subject=${subject}&body=${body}`;
};