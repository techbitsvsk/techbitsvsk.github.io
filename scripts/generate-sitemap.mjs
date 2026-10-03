/* Writes dist/sitemap.xml from the content modules, so adding an
   essay never means remembering to update a sitemap by hand.
   Runs after `vite build`. */

import { writeFile, readFile } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const ORIGIN = 'https://techbitsvsk.github.io'

/* The content modules are plain ESM, so they import directly.
   The path has to become a file:// URL — Windows drive letters
   otherwise look like a URL scheme to the ESM loader. */
const { essays } = await import(pathToFileURL(resolve(root, 'src/content/essays.js')).href)

const staticRoutes = [
  { path: '/', priority: '1.0' },
  { path: '/about', priority: '0.9' },
  { path: '/writing', priority: '0.8' },
  { path: '/projects', priority: '0.8' },
]

const today = new Date().toISOString().slice(0, 10)

const urls = [
  ...staticRoutes.map(r => ({ loc: ORIGIN + r.path, priority: r.priority })),
  ...essays.map(e => ({ loc: ORIGIN + e.path, priority: '0.7' })),
]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    u =>
      `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${u.priority}</priority>\n  </url>`
  )
  .join('\n')}
</urlset>
`

await writeFile(resolve(root, 'dist/sitemap.xml'), xml, 'utf8')

/* A deployed SPA needs 404.html present; fail loudly if the copy
   from public/ ever stops happening, because the symptom is every
   deep link 404ing in production and nowhere else. */
await readFile(resolve(root, 'dist/404.html'), 'utf8')

console.log(`sitemap.xml written with ${urls.length} URLs`)
