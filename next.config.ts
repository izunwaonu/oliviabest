import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
};
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public', // Make sure the service worker is served from /public
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // Disable PWA in dev
});

module.exports = withPWA({
  reactStrictMode: true,
  // Add other Next.js configurations here
});
