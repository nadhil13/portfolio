const fs = require('fs');
const path = require('path');

console.log('🎯 PANDUAN OPTIMASI GAMBAR MANUAL\n');
console.log('═══════════════════════════════════════════════════════\n');

console.log('📋 PRIORITAS TINGGI - Kompres file ini dulu:');
console.log('┌─────────────────────────────────────────────────────────┐');
console.log('│ 1. ZAINFIX.png (3.38 MB → target: ~300 KB)             │');
console.log('│ 2. BGZENBGIJObulat.png (1.99 MB → target: ~200 KB)     │');
console.log('│ 3. card lanyard.png (1.17 MB → target: ~150 KB)        │');
console.log('└─────────────────────────────────────────────────────────┘\n');

console.log('🔧 LANGKAH-LANGKAH:');
console.log('');
console.log('1️⃣ BUKA BROWSER DAN KUNJUNGI:');
console.log('   • https://tinypng.com/ (untuk PNG)');
console.log('   • https://squoosh.app/ (untuk advanced optimization)');
console.log('');

console.log('2️⃣ UPLOAD FILE SATU PER SATU:');
console.log('   📁 src/assets/images/ZAINFIX.png');
console.log('   📁 src/assets/images/BGZENBGIJObulat.png');
console.log('   📁 src/assets/Lanyard/card lanyard.png');
console.log('');

console.log('3️⃣ DOWNLOAD HASIL KOMPRESI DAN REPLACE:');
console.log('   ✅ Ganti file asli dengan yang sudah dikompres');
console.log('   ✅ Pastikan nama file sama persis');
console.log('');

console.log('4️⃣ BUILD ULANG SETELAH KOMPRESI:');
console.log('   > npm run build');
console.log('');

console.log('📊 PREDIKSI PENINGKATAN SKOR:');
console.log('┌─────────────────┬─────────────────┬─────────────────┐');
console.log('│ Sebelum         │ Setelah Kompresi│ Peningkatan     │');
console.log('├─────────────────┼─────────────────┼─────────────────┤');
console.log('│ 25-37          │ 55-70          │ +30-35 poin    │');
console.log('└─────────────────┴─────────────────┴─────────────────┘');
console.log('');

console.log('🎯 TARGET UKURAN FILE:');
console.log('• ZAINFIX.png: 3.38 MB → 300 KB (90% reduction)');
console.log('• BGZENBGIJObulat.png: 1.99 MB → 200 KB (90% reduction)');
console.log('• card lanyard.png: 1.17 MB → 150 KB (87% reduction)');
console.log('');

console.log('⚡ TIPS KOMPRESI:');
console.log('• Di TinyPNG: Upload langsung, download hasil otomatis');
console.log('• Di Squoosh: Pilih format WebP untuk hasil terbaik');
console.log('• Jaga kualitas visual tetap bagus (80-90% quality)');
console.log('');

// Buat backup folder jika belum ada
const backupDir = 'image-backups';
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
  console.log('📁 Folder backup dibuat: ' + backupDir);
}

console.log('💾 BACKUP OTOMATIS:');
console.log('File asli akan dibackup ke folder: ' + backupDir);
console.log('');

// Copy file ke backup
const filesToBackup = [
  'src/assets/images/ZAINFIX.png',
  'src/assets/images/BGZENBGIJObulat.png',
  'src/assets/Lanyard/card lanyard.png'
];

filesToBackup.forEach(file => {
  if (fs.existsSync(file)) {
    const fileName = path.basename(file);
    const backupPath = path.join(backupDir, fileName);
    try {
      fs.copyFileSync(file, backupPath);
      console.log('✅ Backup: ' + fileName);
    } catch (err) {
      console.log('❌ Gagal backup: ' + fileName);
    }
  }
});

console.log('');
console.log('🚀 SIAP UNTUK OPTIMASI!');
console.log('Buka https://tinypng.com/ dan mulai kompres gambar!');
console.log('═══════════════════════════════════════════════════════');

