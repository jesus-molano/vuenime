import { createLogger } from '../utils/logger'

interface SitemapUrl {
  loc: string
  lastmod?: string
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
}

const logger = createLogger('Sitemap')

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl

  // Static pages with their i18n variants
  const staticPages = ['/', '/search', '/favorites']
  const locales = ['', '/es', '/ja'] // '' = default (en), '/es', '/ja'

  const urls: SitemapUrl[] = []

  // Add static pages for each locale
  for (const locale of locales) {
    for (const page of staticPages) {
      urls.push({
        loc: `${siteUrl}${locale}${page === '/' && locale ? '' : page}`,
        changefreq: page === '/' ? 'daily' : 'weekly',
        priority: page === '/' ? 1.0 : 0.8,
      })
    }
  }

  // Fetch top anime for dynamic URLs
  try {
    const jikanApiUrl = config.jikanApiUrl || 'https://api.jikan.moe/v4'
    const response = await $fetch<{ data: Array<{ mal_id: number }> }>(`${jikanApiUrl}/top/anime`, {
      query: { limit: 25 },
    })

    if (response?.data) {
      for (const anime of response.data) {
        for (const locale of locales) {
          urls.push({
            loc: `${siteUrl}${locale}/anime/${anime.mal_id}`,
            changefreq: 'weekly',
            priority: 0.7,
          })
        }
      }
    }
  } catch (error) {
    logger.warn('Failed to fetch anime for sitemap', { error })
  }

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls
  .map(
    (url) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority !== undefined ? `<priority>${url.priority}</priority>` : ''}
  </url>`
  )
  .join('\n')}
</urlset>`

  setHeader(event, 'Content-Type', 'application/xml')
  setHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=3600')

  return xml
})

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
