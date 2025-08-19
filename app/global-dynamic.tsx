'use client'

// Global dynamic export to prevent any static generation
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export default function GlobalDynamic() {
  return null
}
