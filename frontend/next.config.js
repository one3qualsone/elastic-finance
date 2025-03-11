/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Configure image domains if needed
  images: {
    domains: [],
    unoptimized: true, // This allows local images to load without optimization
  },
  
  // Make sure PostCSS plugins are correctly applied
  webpack: (config) => {
    return config;
  },
}

module.exports = nextConfig