import type { MetadataRoute } from 'next'

const BASE_URL = 'https://shahojai.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const primary = ['', '/pricing', '/about', '/contact', '/faq'].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.8,
  }))

  const legal = ['/legal/terms', '/legal/privacy', '/legal/cookies', '/legal/dpa', '/legal/refund'].map(
    (path) => ({
      url: `${BASE_URL}${path}`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    })
  )

  return [...primary, ...legal]
}
