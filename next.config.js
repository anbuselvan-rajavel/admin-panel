/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  transpilePackages: ['swagger-ui-react'],
  output: 'standalone',
  };

module.exports = nextConfig;
