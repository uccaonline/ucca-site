/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep trailingSlash if you like the URLs with / (optional)
  trailingSlash: true,

  // Leave unoptimized for now (safe). We can revisit images later.
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;

// Enables Cloudflare bindings/dev behavior in local dev when using OpenNext.
const { initOpenNextCloudflareForDev } = require("@opennextjs/cloudflare");
initOpenNextCloudflareForDev();