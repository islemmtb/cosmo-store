/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // Next.js 15: opt out of caching for dynamic data routes
  experimental: {
    dynamicIO: false,
  },
};

module.exports = nextConfig;
