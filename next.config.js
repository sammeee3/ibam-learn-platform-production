/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['@supabase/supabase-js']
  },
  // Disable all static generation
  output: undefined,
  // Force all pages to be dynamic
  async generateStaticParams() {
    return []
  },
  // Disable static optimization completely
  async exportPathMap() {
    return {}
  },
  // Ensure runtime rendering
  async rewrites() {
    return []
  }
}

module.exports = nextConfig
