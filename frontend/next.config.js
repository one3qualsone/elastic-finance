/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Set output to 'export' for static site generation
  output: 'export',
  
  // Configure image handling
  images: {
    unoptimized: true,
  },
  
  // Make sure PostCSS plugins are correctly applied
  webpack: (config) => {
    return config;
  },
}

module.exports = nextConfig