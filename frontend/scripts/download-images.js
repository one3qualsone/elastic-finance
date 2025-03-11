// Save this as scripts/download-images.js
const fs = require('fs');
const path = require('path');
const https = require('https');

// Create the directories if they don't exist
const imageDir = path.join(__dirname, '../public/images/learn');
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
}

// List of image info: filename, Unsplash URL, and alt text
const images = [
  {
    name: 'value-investing.jpg',
    url: 'https://source.unsplash.com/LJ9KY8pIH3E/800x500',
    alt: 'Value investing concept'
  },
  {
    name: 'small-business.jpg',
    url: 'https://source.unsplash.com/wD1LRb9OeEo/800x500',
    alt: 'Small business valuation'
  },
  {
    name: 'balance-sheet.jpg',
    url: 'https://source.unsplash.com/EMPZ7yRZoGw/800x500',
    alt: 'Balance sheet and financial documents'
  },
  {
    name: 'stock-share.jpg',
    url: 'https://source.unsplash.com/fiXLQXAhCfk/800x500',
    alt: 'Stock market chart'
  },
  {
    name: 'buffett.jpg',
    url: 'https://source.unsplash.com/N9Pf2J656aQ/800x500',
    alt: 'Warren Buffett investing philosophy'
  },
  {
    name: 'bonds.jpg',
    url: 'https://source.unsplash.com/NeTPASr-bmQ/800x500',
    alt: 'Bond investments'
  },
  {
    name: 'bond-components.jpg',
    url: 'https://source.unsplash.com/yD5rv8_WzxA/800x500',
    alt: 'Components of bonds'
  },
  {
    name: 'bond-yield.jpg',
    url: 'https://source.unsplash.com/9wSnKXhGQdE/800x500',
    alt: 'Bond yield and valuation'
  },
  {
    name: 'stock-market.jpg',
    url: 'https://source.unsplash.com/ja8nQ-WsFgM/800x500',
    alt: 'Stock market basics'
  },
  {
    name: 'market-crash.jpg',
    url: 'https://source.unsplash.com/OHOU-5UVIYQ/800x500',
    alt: 'Market crashes and bubbles'
  },
  {
    name: 'federal-reserve.jpg',
    url: 'https://source.unsplash.com/uzhFra2FJ-g/800x500',
    alt: 'Federal Reserve building'
  },
  {
    name: 'financial-statements.jpg',
    url: 'https://source.unsplash.com/8lnbXtxFGZw/800x500',
    alt: 'Reading financial statements'
  },
  {
    name: 'intrinsic-value.jpg',
    url: 'https://source.unsplash.com/dBI_My696Rk/800x500',
    alt: 'Calculating intrinsic value'
  }
];

// Function to download an image
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filepath = path.join(imageDir, filename);
    
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`✓ Downloaded: ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}); // Delete the file if an error occurs
      console.error(`✗ Error downloading ${filename}:`, err.message);
      reject(err);
    });
  });
}

// Download all images
async function downloadAllImages() {
  console.log('Starting image download...');
  
  for (const image of images) {
    try {
      await downloadImage(image.url, image.name);
    } catch (error) {
      console.error(`Failed to download ${image.name}`);
    }
  }
  
  console.log('All downloads completed!');
}

downloadAllImages();