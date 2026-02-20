/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for Cloudflare Pages static export
  output: 'export',
  
  // Disable image optimization (not supported in static export)
  images: {
    unoptimized: true,
  },
  
  // Trailing slash for better Cloudflare Pages compatibility
  trailingSlash: true,
};

module.exports = nextConfig;
