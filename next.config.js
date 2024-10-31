/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'https://amirez.info:3000/api/:path*'
        }
      ]
    }
  }
  
  module.exports = nextConfig