/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Conditionally set output based on environment
  ...(process.env.NEXT_EXPORT === 'true' ? { output: 'export' } : {}),
  
  // Configure image handling
  images: {
    domains: [],
    remotePatterns: [],
    // Use unoptimized for development or when exporting
    unoptimized: process.env.NODE_ENV === 'development' || process.env.NEXT_EXPORT === 'true',
  },
  
  // Make sure PostCSS plugins are correctly applied
  webpack: (config) => {
    return config;
  },
}

module.exports = nextConfig