/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only include valid Next.js 15.3.3 options
  serverExternalPackages: ['@supabase/supabase-js']
}

module.exports = nextConfig
