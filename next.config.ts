import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:8080';

    return [
      {
        source: '/api/:path*',
        destination: `${apiBaseUrl}/api/:path*`,
      },
      {
        source: '/health',
        destination: `${apiBaseUrl}/health`,
      },
    ];
  },
};

export default nextConfig;
