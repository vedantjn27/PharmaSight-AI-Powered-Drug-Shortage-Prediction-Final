import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  rewrites: async () => {
    return {
      beforeFiles: [
        {
          source: '/api/v1/:path*',
          destination: 'http://localhost:8000/api/v1/:path*',
        },
        {
          source: '/health',
          destination: 'http://localhost:8000/health',
        },
      ],
    }
  },
}

export default nextConfig
