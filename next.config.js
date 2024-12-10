/** @type {import('next').NextConfig} */
const nextConfig = {
  env: { 
    DATABASE_URL: process.env.DATABASE_URL, 
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL, 
  },
  reactStrictMode: true,
  output: 'standalone',
  transpilePackages: ['swagger-ui-react'],
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
 };

module.exports = nextConfig;