/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    CONGRESS_API_KEY: process.env.CONGRESS_API_KEY
  }
}

module.exports = nextConfig;