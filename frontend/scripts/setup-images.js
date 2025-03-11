// frontend/scripts/setup-images.js
const fs = require('fs');
const path = require('path');

// Create the directories if they don't exist
const publicDir = path.join(process.cwd(), 'public');
const imagesDir = path.join(publicDir, 'images');
const imageDir = path.join(imagesDir, 'learn');

console.log('Setting up image directories...');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
  console.log(`Created directory: ${publicDir}`);
}

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
  console.log(`Created directory: ${imagesDir}`);
}

if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
  console.log(`Created directory: ${imageDir}`);
}

// Create a basic SVG placeholder for each image
function createPlaceholderImage(filename, title) {
  const filepath = path.join(imageDir, filename);
  
  // Create a simple SVG with the title text
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
    <rect width="800" height="500" fill="#f0f4f8" />
    <rect x="10" y="10" width="780" height="480" fill="#e1effe" stroke="#3b82f6" stroke-width="2" />
    <text x="400" y="200" font-family="Arial" font-size="32" text-anchor="middle" fill="#3b82f6" font-weight="bold">${title}</text>
    <text x="400" y="250" font-family="Arial" font-size="24" text-anchor="middle" fill="#4b5563">Value Investing Learning Resource</text>
    <text x="400" y="300" font-family="Arial" font-size="18" text-anchor="middle" fill="#6b7280">Placeholder Image</text>
  </svg>`;
  
  fs.writeFileSync(filepath, svgContent);
  console.log(`Created placeholder image: ${filepath}`);
}

// List of image info: filename and title
const images = [
  { name: 'value-investing.jpg', title: 'Value Investing Basics' },
  { name: 'small-business.jpg', title: 'Valuing a Small Business' },
  { name: 'balance-sheet.jpg', title: 'Balance Sheet & Margin of Safety' },
  { name: 'stock-share.jpg', title: 'What is a Share?' },
  { name: 'buffett.jpg', title: 'Warren Buffett Stock Basics' },
  { name: 'bonds.jpg', title: 'What is a Bond?' },
  { name: 'bond-components.jpg', title: 'Components of a Bond' },
  { name: 'bond-yield.jpg', title: 'Bond Valuation & Yield' },
  { name: 'stock-market.jpg', title: 'Stock Market Basics' },
  { name: 'market-crash.jpg', title: 'Market Crashes & Bubbles' },
  { name: 'federal-reserve.jpg', title: 'What is the Fed?' },
  { name: 'financial-statements.jpg', title: 'Reading Financial Statements' },
  { name: 'intrinsic-value.jpg', title: 'Calculating Intrinsic Value' },
  { name: 'dcf.jpg', title: 'Discounted Cash Flow Analysis' },
  { name: 'special-situations.jpg', title: 'Special Situations Investing' },
  { name: 'default.jpg', title: 'Value Investing' }
];

// Create placeholder images
console.log('Creating placeholder images...');
images.forEach(image => {
  createPlaceholderImage(image.name, image.title);
});

console.log('Image setup complete!');