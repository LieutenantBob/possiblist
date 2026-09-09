import { readdir } from 'fs/promises'
import { writeFile } from 'fs/promises'
import { join } from 'path'

const BASE_URL = 'https://possiblist.net'
const CONTENT_DIR = join(__dirname, '..', 'content', 'fact-cards')
const OUTPUT = join(__dirname, '..', 'web', 'public', 'sitemap.xml')

async function generateSitemap() {
  const files = await readdir(CONTENT_DIR)
  const slugs = files
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''))

  const today = new Date().toISOString().split('T')[0]

  const urls = [
    { loc: '/', priority: '1.0', changefreq: 'weekly' },
    { loc: '/quiz', priority: '0.9', changefreq: 'weekly' },
    { loc: '/explore', priority: '0.8', changefreq: 'weekly' },
    { loc: '/manifesto', priority: '0.7', changefreq: 'monthly' },
    { loc: '/about', priority: '0.5', changefreq: 'monthly' },
    { loc: '/research', priority: '0.7', changefreq: 'monthly' },
    { loc: '/subscribe', priority: '0.6', changefreq: 'monthly' },
    ...slugs.map(slug => ({
      loc: `/article/${slug}`,
      priority: '0.8',
      changefreq: 'monthly' as const,
    })),
    ...slugs.map(slug => ({
      loc: `/q/${slug}`,
      priority: '0.9',
      changefreq: 'monthly' as const,
    })),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${BASE_URL}${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  await writeFile(OUTPUT, xml, 'utf-8')
  console.log(`Sitemap generated: ${OUTPUT} (${urls.length} URLs)`)
}

generateSitemap().catch(console.error)
