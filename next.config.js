/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    runtime: 'nodejs'
  },
  // Force all pages to be dynamic during build
  async generateStaticParams() {
    return []
  }
}

module.exports = nextConfig
