// app/robots.ts
// Generates robots.txt to guide search engine crawlers

import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/auth/',
        '/dashboard/',
        '/profile/',
        '/messages/',
        '/_next/',
      ],
    },
    sitemap: 'https://www.jobagentph.com/sitemap.xml',
  }
}
