// scripts/setup-images.js
const fs = require('fs');
const path = require('path');

// Create necessary directory structure
const createDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
};

// Create placeholder image with text
const createPlaceholderImage = (imagePath, text) => {
  // This is a minimal SVG placeholder - for a real implementation,
  // you'd want to use a proper image library
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
    <rect width="800" height="500" fill="#f0f4f8"/>
    <text x="400" y="250" font-family="Arial" font-size="24" text-anchor="middle" fill="#4b5563">${text}</text>
  </svg>`;
  
  fs.writeFileSync(imagePath, svgContent);
  console.log(`Created placeholder image: ${imagePath}`);
};

// Main function
const setupImages = () => {
  // Create the image directories
  const publicDir = path.join(process.cwd(), 'public');
  const imagesDir = path.join(publicDir, 'images');
  const learnImagesDir = path.join(imagesDir, 'learn');
  
  createDir(publicDir);
  createDir(imagesDir);
  createDir(learnImagesDir);
  
  // Create placeholder images for each lesson
  const lessonImages = [
    { name: 'value-investing.jpg', text: 'Value Investing' },
    { name: 'small-business.jpg', text: 'Valuing a Small Business' },
    { name: 'balance-sheet.jpg', text: 'Balance Sheet & Margin of Safety' },
    { name: 'stock-share.jpg', text: 'What is a Share?' },
    { name: 'buffett.jpg', text: 'Warren Buffett Stock Basics' },
    { name: 'bonds.jpg', text: 'What is a Bond?' },
    { name: 'bond-components.jpg', text: 'Components of a Bond' },
    { name: 'bond-yield.jpg', text: 'Bond Valuation & Yield to Maturity' },
    { name: 'stock-market.jpg', text: 'Stock Market Basics' },
    { name: 'market-crash.jpg', text: 'Market Crashes & Bubbles' },
    { name: 'federal-reserve.jpg', text: 'What is the Fed?' },
    { name: 'financial-statements.jpg', text: 'Reading Financial Statements' },
    { name: 'intrinsic-value.jpg', text: 'Calculating Intrinsic Value' },
    { name: 'dcf.jpg', text: 'Discounted Cash Flow Analysis' },
    { name: 'special-situations.jpg', text: 'Special Situations Investing' },
    { name: 'default.jpg', text: 'Value Investing Learning Resource' }
  ];
  
  // Create or verify each image
  lessonImages.forEach(({ name, text }) => {
    const imagePath = path.join(learnImagesDir, name);
    if (!fs.existsSync(imagePath)) {
      createPlaceholderImage(imagePath, text);
    }
  });
  
  console.log('Image setup complete!');
};

// Execute the function
setupImages();