import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Award, Mail, MapPin } from 'lucide-react'
import { chapters, architectureLayers } from '@/content/bio'
import { profile, metrics, yearsOfExperience } from '@/content/profile'
import ChapterCard from '@/components/about/ChapterCard'
import ChapterRail from '@/components/about/ChapterRail'
import EvidenceCard from '@/components/about/EvidenceCard'
import Reveal from '@/components/Reveal'

export default function About() {
  const { hash } = useLocation()

  /* Deep links to a chapter. Same pattern as the Projects page. */
  useEffect(() => {
    if (!hash) return
    const el = document.getElementById(hash.slice(1))
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [hash])

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────── */}
      <div className="page-hero">
        <div className="container">
          <p className="section-label">Career · {`2007 — today`}</p>
          <h1>The widening lens</h1>
          <p className="max-w-[62ch]">
            {yearsOfExperience} years in {chapters.length} chapters, each with the
            repositories and essays that evidence it.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[0.7rem] text-parchment-dim">
            <span className="text-copper">
              {profile.role} · {profile.org}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={11} strokeWidth={1.5} aria-hidden="true" />
              {profile.location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Award size={11} strokeWidth={1.5} aria-hidden="true" />
              {profile.certification}
            </span>
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-1.5 text-copper underline decoration-1 underline-offset-[3px]"
            >
              <Mail size={11} strokeWidth={1.5} aria-hidden="true" />
              {profile.email}
            </a>
          </div>
        </div>
      </div>

      {/* ── Numbers the narrative earns ────────────────────── */}
      <section className="border-b border-rule-soft bg-void py-12">
        <div className="container">
          <dl className="m-0 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
            {metrics.map((m, i) => (
              <Reveal key={m.label} delay={i * 0.05}>
                <Link to={`/about#${m.chapter}`} className="group block no-underline">
                  <dt className="font-display text-[clamp(1.9rem,4vw,2.5rem)] leading-none text-parchment transition-colors group-hover:text-copper">
                    {m.value}
                    {m.suffix && (
                      <span className="text-[0.5em] text-copper">{m.suffix}</span>
                    )}
                  </dt>
                  <dd className="mt-2.5 m-0 font-mono text-[0.6rem] leading-[1.6] whitespace-pre-line text-parchment-dim">
                    {m.label}
                  </dd>
                </Link>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* ── The narrative ──────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-[190px_minmax(0,1fr)] lg:gap-14">
            <ChapterRail chapters={chapters} />
            <div className="flex min-w-0 flex-col gap-14">
              {chapters.map(c => (
                <ChapterCard key={c.id} chapter={c} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── The architecture that came out of it ────────────── */}
      <section className="section section-alt" id="architecture">
        <div className="container">
          <p className="section-label">The pattern underneath</p>
          <h2 className="section-title">The architecture that came out of it</h2>
          <p className="mb-10 max-w-[70ch] font-prose text-[0.9rem] leading-[1.75] text-parchment-dim italic">
            Eight architectural layers, each forced by a constraint the previous
            layer alone could not solve.
          </p>

          <div className="flex flex-col">
            {architectureLayers.map((layer, i) => (
              <Reveal key={layer.n} delay={Math.min(i, 4) * 0.04}>
                <div className="flex items-start gap-5 border-b border-rule-soft py-6">
                  <span className="shrink-0 pt-1 font-mono text-[0.62rem] font-bold tracking-[0.1em] text-copper">
                    {layer.n}
                  </span>
                  <div className="min-w-0 flex-1">
                    <strong className="mb-1.5 block font-display text-[1rem] text-parchment">
                      {layer.title}
                    </strong>
                    <p className="mt-0 mb-4 font-prose text-[0.875rem] leading-[1.8] text-parchment-muted">
                      {layer.body}
                    </p>
                    <div className="grid gap-2.5 sm:grid-cols-2 lg:max-w-2xl">
                      {layer.evidence.map(e => (
                        <EvidenceCard key={`${e.type}-${e.slug}`} {...e} />
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Onward ─────────────────────────────────────────── */}
      <section className="section">
        <div className="container text-center">
          <p className="section-label">Next</p>
          <h2 className="section-title mb-4">The thinking, in long form</h2>
          <p className="mx-auto mb-8 max-w-[52ch] font-prose text-[0.95rem] text-parchment-muted">
            The essays work through the architecture in detail; the repositories
            are the reference implementations.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/writing" className="btn btn-primary">
              Read the essays
            </Link>
            <Link to="/projects" className="btn btn-outline">
              See the projects
            </Link>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              GitHub ↗
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
