/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    
    // Configure image domains if needed
    images: {
      domains: [],
    },
    
    // Make sure PostCSS plugins are correctly applied
    webpack: (config) => {
      return config;
    },
  }
  
  module.exports = nextConfig