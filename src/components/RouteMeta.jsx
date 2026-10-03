/* Per-route document metadata.

   One component instead of edits to every page: it reads the
   content modules and keys off the current path.

   Caveat worth knowing: this runs in the browser. Google executes
   JavaScript and will index these, but LinkedIn, Slack and X do
   not — their crawlers read the raw HTML. Making link previews
   work for those needs the routes prerendered to static HTML at
   build time. Until then, a shared link shows the defaults baked
   into index.html. */

import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { essays } from '@/content/essays'
import { profile, metaDescription } from '@/content/profile'
import { chapters } from '@/content/bio'

export const SITE_ORIGIN = 'https://techbitsvsk.github.io'
const DEFAULT_IMAGE = `${SITE_ORIGIN}/assets/profile-800.jpg`

const staticPages = {
  '/': {
    title: `${profile.name} — ${profile.disciplines[0]}`,
    description: metaDescription,
  },
  '/about': {
    title: `The widening lens — ${profile.name}`,
    description: `${chapters.length} chapters, from Java developer in 2007 to enterprise platform architecture and governed AI adoption: the work, and the repositories and essays that evidence it.`,
  },
  '/writing': {
    title: `Architecture writing — ${profile.name}`,
    description:
      'Long-form thinking on enterprise data platforms, cloud architecture, governance, and the engineering decisions that matter at scale.',
  },
  '/projects': {
    title: `Open source projects — ${profile.name}`,
    description:
      'Production-grade reference implementations: Iceberg governance, multi-cloud pipelines, data product marketplaces, and lineage knowledge graphs.',
  },
}

/** Create or update a <meta> tag, keyed by name or property. */
function setMeta(keyAttr, keyValue, content) {
  if (!content) return
  let tag = document.head.querySelector(`meta[${keyAttr}="${keyValue}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(keyAttr, keyValue)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function setCanonical(href) {
  let link = document.head.querySelector('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', href)
}

export function metaForPath(pathname) {
  const essay = essays.find(e => e.path === pathname)
  if (essay) {
    /* A series part names itself; everything else is attributed. */
    const suffix = essay.series
      ? `${essay.series.name} Part ${essay.series.part}`
      : profile.name
    return {
      title: `${essay.title} — ${suffix}`,
      description: essay.short ?? essay.excerpt,
      image: essay.ogImage ? `${SITE_ORIGIN}${essay.ogImage}` : DEFAULT_IMAGE,
      type: 'article',
    }
  }
  const page = staticPages[pathname]
  if (page) return { ...page, image: DEFAULT_IMAGE, type: 'website' }
  return {
    title: `${profile.name} — ${profile.role}`,
    description: metaDescription,
    image: DEFAULT_IMAGE,
    type: 'website',
  }
}

export default function RouteMeta() {
  const { pathname } = useLocation()

  useEffect(() => {
    const { title, description, image, type } = metaForPath(pathname)
    const url = `${SITE_ORIGIN}${pathname}`

    document.title = title
    setMeta('name', 'description', description)
    setCanonical(url)

    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:image', image)
    setMeta('property', 'og:type', type)
    setMeta('property', 'og:site_name', 'TechBitsVSK')

    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', image)
  }, [pathname])

  return null
}
