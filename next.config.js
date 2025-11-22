/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['futureform-files.s3.amazonaws.com'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  },
}

module.exports = nextConfig