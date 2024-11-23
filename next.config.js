/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  transpilePackages: ['swagger-ui-react'],
  output: 'standalone',
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  }
  };

module.exports = nextConfig;
