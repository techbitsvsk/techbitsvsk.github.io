/* Resolves an { type, slug } evidence reference to the real repo
   or essay and renders it as a link.

   Work with no public repository renders as a muted, unlinked
   marker. It is never a dead link and never an invented name. */

import { Link } from 'react-router-dom'
/* lucide v1 dropped brand icons, so repositories use GitBranch. */
import { ArrowUpRight, ArrowRight, Lock, FileText, GitBranch } from 'lucide-react'
import { repoBySlug } from '@/content/repos'
import { essayBySlug } from '@/content/essays'

function Shell({ children, accent }) {
  return (
    <div
      className={`flex items-start gap-2.5 rounded-card border px-3 py-2.5 transition-colors ${accent}`}
    >
      {children}
    </div>
  )
}

export default function EvidenceCard({ type, slug }) {
  if (type === 'essay') {
    const essay = essayBySlug[slug]
    if (!essay) return null
    return (
      <Link
        to={essay.path}
        className="group block no-underline"
        aria-label={`Read the essay: ${essay.title}`}
      >
        <Shell accent="border-rule bg-surface hover:border-copper/60">
          <FileText
            size={13}
            strokeWidth={1.5}
            className="mt-0.5 shrink-0 text-copper"
            aria-hidden="true"
          />
          <span className="min-w-0">
            <span className="block font-mono text-[0.6rem] tracking-[0.14em] text-parchment-dim uppercase">
              Essay
            </span>
            <span className="mt-0.5 block font-prose text-[0.82rem] leading-snug text-parchment">
              {essay.title}
            </span>
            <span className="mt-1 inline-flex items-center gap-1 font-mono text-[0.62rem] text-copper">
              Read
              <ArrowRight
                size={10}
                className="transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </span>
          </span>
        </Shell>
      </Link>
    )
  }

  const repo = repoBySlug[slug]
  if (!repo) return null

  /* Built but not published, or described without an artefact. */
  if (repo.status || !repo.url) {
    return (
      <Shell accent="border-rule-soft bg-ink">
        <Lock
          size={13}
          strokeWidth={1.5}
          className="mt-0.5 shrink-0 text-parchment-dim"
          aria-hidden="true"
        />
        <span className="min-w-0">
          <span className="block font-mono text-[0.6rem] tracking-[0.14em] text-parchment-dim uppercase">
            Not public
          </span>
          <span className="mt-0.5 block font-prose text-[0.82rem] leading-snug text-parchment-muted">
            {repo.title}
          </span>
          {repo.tagline && (
            <span className="mt-1 block font-prose text-[0.7rem] leading-snug text-parchment-dim">
              {repo.tagline}
            </span>
          )}
        </span>
      </Shell>
    )
  }

  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block no-underline"
      aria-label={`${repo.title} on GitHub (opens in a new tab)`}
    >
      <Shell accent="border-rule bg-surface hover:border-sage/60">
        <GitBranch
          size={13}
          strokeWidth={1.5}
          className="mt-0.5 shrink-0 text-sage"
          aria-hidden="true"
        />
        <span className="min-w-0">
          <span className="block font-mono text-[0.6rem] tracking-[0.14em] text-parchment-dim uppercase">
            {repo.kind === 'notes' ? 'Notes' : 'Repository'}
          </span>
          <span className="mt-0.5 block font-prose text-[0.82rem] leading-snug text-parchment">
            {repo.title}
          </span>
          <span className="mt-1 inline-flex items-center gap-1 font-mono text-[0.62rem] text-sage">
            {repo.repo}
            <ArrowUpRight
              size={10}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </span>
        </span>
      </Shell>
    </a>
  )
}
