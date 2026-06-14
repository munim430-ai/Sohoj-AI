import type { MetadataRoute } from 'next'

const BASE_URL = 'https://shahojai.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/widget', '/dashboard', '/settings', '/billing', '/onboard'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
