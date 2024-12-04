/** @type {import('next').NextConfig} */
const nextConfig = {
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
  experimental: {
    serverActions: true,
  },
  // Adding middleware configuration
  async middleware() {
    return [
      {
        source: '/api/:path*', // Apply to all API routes
        function: 'middleware', // Link the middleware function
      },
    ];
  },
};

module.exports = nextConfig;
