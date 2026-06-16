const fs = require('fs');
const path = require('path');

// Fungsi untuk mengecek ukuran file
function getFileSizeInMB(filePath) {
  const stats = fs.statSync(filePath);
  return (stats.size / (1024 * 1024)).toFixed(2);
}

// Scan dan laporkan file gambar besar
function scanLargeImages() {
  const directories = ['src/assets', 'public', 'dist/assets'];
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const largeImages = [];

  directories.forEach(dir => {
    if (!fs.existsSync(dir)) return;
    
    function scanDirectory(currentDir) {
      const items = fs.readdirSync(currentDir);
      
      items.forEach(item => {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          scanDirectory(fullPath);
        } else if (stat.isFile()) {
          const ext = path.extname(item).toLowerCase();
          if (imageExtensions.includes(ext)) {
            const sizeMB = parseFloat(getFileSizeInMB(fullPath));
            if (sizeMB > 0.5) { // File lebih dari 500KB
              largeImages.push({
                path: fullPath,
                size: sizeMB,
                name: item
              });
            }
          }
        }
      });
    }
    
    scanDirectory(dir);
  });

  return largeImages.sort((a, b) => b.size - a.size);
}

// Main function
function main() {
  console.log('🔍 Scanning for large images...\n');
  
  const largeImages = scanLargeImages();
  
  if (largeImages.length === 0) {
    console.log('✅ No large images found!');
    return;
  }

  console.log('🚨 Large images detected:\n');
  console.log('┌─────────────────────────────────────────────────────────────┬──────────┐');
  console.log('│ File Path                                                   │ Size (MB)│');
  console.log('├─────────────────────────────────────────────────────────────┼──────────┤');
  
  largeImages.forEach(img => {
    const pathStr = img.path.length > 55 ? '...' + img.path.slice(-52) : img.path;
    const sizeStr = img.size.toString();
    console.log(`│ ${pathStr.padEnd(55)} │ ${sizeStr.padStart(8)} │`);
  });
  
  console.log('└─────────────────────────────────────────────────────────────┴──────────┘\n');

  console.log('💡 Recommendations:');
  console.log('1. Compress ZAINFIX-BFmPuhbK.png (3.5MB) - use online tools like TinyPNG');
  console.log('2. Convert lanyard-B5pcXAat.png (523KB) to WebP format');
  console.log('3. Optimize all images > 100KB for web usage');
  console.log('4. Consider using responsive images with different sizes');
  
  console.log('\n🔧 Quick fixes:');
  console.log('- Use https://tinypng.com/ for PNG compression');
  console.log('- Use https://squoosh.app/ for advanced optimization');
  console.log('- Convert to WebP/AVIF for modern browsers');
}

if (require.main === module) {
  main();
}

module.exports = { scanLargeImages, getFileSizeInMB };
