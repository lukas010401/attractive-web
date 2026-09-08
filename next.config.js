const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5024';
const apiHostname = new URL(apiBaseUrl).hostname;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: Array.from(new Set(['localhost', '127.0.0.1', apiHostname])),
    formats: ['image/avif', 'image/webp']
  }
};

module.exports = nextConfig;
