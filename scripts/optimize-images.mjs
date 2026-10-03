/* Generates the web-ready images that ship in public/assets from
   the masters in assets-src.
 *
 * Run with: npm run images
 *
 * The masters stay out of public/ deliberately — the original
 * profile photo is a 3.2 MB PNG, and anything inside public/ is
 * copied into the build verbatim whether or not a page uses it.
 */

import sharp from 'sharp'
import { mkdir, stat } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const src = file => resolve(root, 'assets-src', file)
const out = file => resolve(root, 'public/assets', file)

/** Square portrait crop, anchored at the top — the avatar is a circle. */
const AVATAR_SIZES = [400, 800]

const jobs = [
  ...AVATAR_SIZES.map(size => ({
    from: 'profile.png',
    to: `profile-${size}.webp`,
    apply: img =>
      img.resize(size, size, { fit: 'cover', position: 'top' }).webp({ quality: 82 }),
  })),
  {
    /* Fallback for anything that cannot take WebP. */
    from: 'profile.png',
    to: 'profile-800.jpg',
    apply: img =>
      img.resize(800, 800, { fit: 'cover', position: 'top' }).jpeg({ quality: 82, mozjpeg: true }),
  },
  {
    from: 'voronoi_part3_linkedin.png',
    to: 'voronoi_part3_linkedin.webp',
    apply: img => img.resize(944).webp({ quality: 84 }),
  },
  {
    from: 'voronoi_part3_linkedin.png',
    to: 'voronoi_part3_linkedin.jpg',
    apply: img => img.resize(944).jpeg({ quality: 84, mozjpeg: true }),
  },
]

const kb = bytes => `${(bytes / 1024).toFixed(0)} kB`

await mkdir(resolve(root, 'public/assets'), { recursive: true })

for (const job of jobs) {
  const before = (await stat(src(job.from))).size
  await job.apply(sharp(src(job.from))).toFile(out(job.to))
  const after = (await stat(out(job.to))).size
  console.log(
    `${job.from} → ${job.to}  ${kb(before)} → ${kb(after)}  (${Math.round(
      (1 - after / before) * 100
    )}% smaller)`
  )
}
