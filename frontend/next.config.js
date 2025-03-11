// frontend/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export', 
  
  // Configure image handling
  images: {
    domains: [],
    remotePatterns: [],
    unoptimized: true,
  },
  
  // Make sure PostCSS plugins are correctly applied
  webpack: (config) => {
    return config;
  },
}

module.exports = nextConfig