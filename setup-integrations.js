#!/usr/bin/env node

/**
 * 🚀 QUICK SETUP SCRIPT UNTUK EMAIL & WHATSAPP INTEGRATION
 * 
 * Usage: node setup-integrations.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(`
🚀 PORTFOLIO INTEGRATION SETUP
===============================

Mari setup Email & WhatsApp integration untuk portfolio Anda!

Anda akan diminta memasukkan:
1. EmailJS Service ID
2. EmailJS Template ID  
3. EmailJS Public Key
4. WhatsApp Number (sudah ada: 6281270632690)

`);

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function setupIntegrations() {
  try {
    console.log('📧 EMAIL INTEGRATION SETUP:');
    console.log('   (Kosongkan jika belum setup EmailJS)\n');
    
    const serviceId = await askQuestion('1. EmailJS Service ID (contoh: service_xyz123): ');
    const templateId = await askQuestion('2. EmailJS Template ID (contoh: template_abc456): ');
    const publicKey = await askQuestion('3. EmailJS Public Key (contoh: user_xyz789abc): ');
    
    console.log('\n📱 WHATSAPP INTEGRATION:');
    const currentPhone = '6281270632690';
    console.log(`   Current WhatsApp: ${currentPhone}`);
    const newPhone = await askQuestion('4. Ganti nomor WhatsApp? (Enter = pakai yang sekarang): ');
    
    console.log('\n🔧 SUBMISSION METHOD:');
    console.log('   1. emailjs (kirim ke email)');
    console.log('   2. whatsapp (buka WhatsApp)'); 
    console.log('   3. localStorage (simpan di browser)');
    const method = await askQuestion('5. Pilih method default (1/2/3): ');
    
    // Update formSubmission.js
    const formSubmissionPath = path.join(__dirname, 'src/utils/formSubmission.js');
    let formSubmissionContent = fs.readFileSync(formSubmissionPath, 'utf8');
    
    if (serviceId) {
      formSubmissionContent = formSubmissionContent.replace(
        /const EMAILJS_SERVICE_ID = '[^']*'/,
        `const EMAILJS_SERVICE_ID = '${serviceId}'`
      );
    }
    
    if (templateId) {
      formSubmissionContent = formSubmissionContent.replace(
        /const EMAILJS_TEMPLATE_ID = '[^']*'/,
        `const EMAILJS_TEMPLATE_ID = '${templateId}'`
      );
    }
    
    if (publicKey) {
      formSubmissionContent = formSubmissionContent.replace(
        /const EMAILJS_PUBLIC_KEY = '[^']*'/,
        `const EMAILJS_PUBLIC_KEY = '${publicKey}'`
      );
    }
    
    if (newPhone && newPhone.trim()) {
      formSubmissionContent = formSubmissionContent.replace(
        /const phoneNumber = '[^']*'/,
        `const phoneNumber = '${newPhone.trim()}'`
      );
    }
    
    fs.writeFileSync(formSubmissionPath, formSubmissionContent);
    
    // Update AdvancedContactForm.jsx
    const contactFormPath = path.join(__dirname, 'src/components/AdvancedContactForm.jsx');
    let contactFormContent = fs.readFileSync(contactFormPath, 'utf8');
    
    let selectedMethod = 'localStorage';
    if (method === '1') selectedMethod = 'emailjs';
    else if (method === '2') selectedMethod = 'whatsapp';
    
    contactFormContent = contactFormContent.replace(
      /const submissionMethod = '[^']*'/,
      `const submissionMethod = '${selectedMethod}'`
    );
    
    fs.writeFileSync(contactFormPath, contactFormContent);
    
    // Update index.html if publicKey provided
    if (publicKey) {
      const indexPath = path.join(__dirname, 'index.html');
      let indexContent = fs.readFileSync(indexPath, 'utf8');
      
      indexContent = indexContent.replace(
        /emailjs\.init\('[^']*'\)/,
        `emailjs.init('${publicKey}')`
      );
      
      fs.writeFileSync(indexPath, indexContent);
    }
    
    console.log('\n✅ SETUP COMPLETED!');
    console.log('===================');
    
    if (serviceId && templateId && publicKey) {
      console.log('📧 Email Integration: ACTIVE');
    } else {
      console.log('📧 Email Integration: Setup EmailJS dulu');
    }
    
    console.log(`📱 WhatsApp Number: ${newPhone || currentPhone}`);
    console.log(`🔄 Default Method: ${selectedMethod}`);
    
    console.log('\n🚀 NEXT STEPS:');
    console.log('1. npm run dev');
    console.log('2. Test form submission');
    console.log('3. Cek email/WhatsApp');
    console.log('4. Buka admin panel (ikon amplop)');
    
    if (!serviceId) {
      console.log('\n📧 SETUP EMAILJS:');
      console.log('1. Buka: https://www.emailjs.com');
      console.log('2. Buat account gratis');
      console.log('3. Setup service & template');
      console.log('4. Jalankan script ini lagi');
    }
    
    console.log('\n📚 Baca SETUP_INTEGRATION.md untuk panduan lengkap!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    rl.close();
  }
}

setupIntegrations();