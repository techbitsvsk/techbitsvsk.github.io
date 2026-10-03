import { Link } from 'react-router-dom'
import { profile, summary, metrics, philosophy, intro } from '@/content/profile'
import { featuredEssays } from '@/content/essays'
import { featuredProjects } from '@/content/repos'
import { chapters } from '@/content/bio'
import Reveal from '@/components/Reveal'

export default function Home() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="home-hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-left fade-up">
              <p className="hero-eyebrow">{profile.eyebrow}</p>
              <h1 className="hero-name">{profile.name}</h1>
              <p className="hero-title">
                {profile.disciplines.join('  ·  ')}
              </p>
              <p className="hero-desc">{summary}</p>
              <div className="hero-contact">
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
                <span className="sep">·</span>
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn ↗
                </a>
                <span className="sep">·</span>
                <span>{profile.location}</span>
              </div>
              <div className="hero-actions fade-up-2">
                <Link to="/about" className="btn btn-primary">
                  Read the full story
                </Link>
                <Link to="/writing" className="btn btn-outline">
                  The writing
                </Link>
              </div>
            </div>
            <div className="hero-right fade-up-3">
              <div className="hero-avatar" title={profile.name}>
                {/* 3.2 MB PNG → 23 kB at the size it actually renders.
                    Masters live in assets-src; run `npm run images`. */}
                <picture>
                  <source
                    type="image/webp"
                    srcSet="/assets/profile-400.webp 400w, /assets/profile-800.webp 800w"
                    sizes="(max-width: 900px) 160px, 400px"
                  />
                  <img
                    src="/assets/profile-800.jpg"
                    alt={profile.name}
                    width="400"
                    height="400"
                    fetchPriority="high"
                  />
                </picture>
              </div>
            </div>
          </div>

          {/* ── Impact metrics ───────────────────────────── */}
          <div className="hero-metrics">
            {metrics.map(m => (
              <Link
                key={m.label}
                to={`/about#${m.chapter}`}
                className="hero-metric"
                style={{ textDecoration: 'none' }}
              >
                <span className="metric-num">
                  {m.value}
                  {m.suffix && <small>{m.suffix}</small>}
                </span>
                <span className="metric-label" style={{ whiteSpace: 'pre-line' }}>
                  {m.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Philosophy ───────────────────────────────────── */}
      <div className="philosophy">
        <p className="philosophy-quote">“{philosophy.quote}”</p>
        <p className="philosophy-attr">— {philosophy.attribution}</p>
      </div>

      {/* ── Writing ──────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <p className="section-label">Thought Leadership</p>
          <h2 className="section-title">Architecture writing</h2>
          <div className="blog-grid">
            {featuredEssays.map(e => (
              <Link
                key={e.slug}
                to={e.path}
                className="blog-card"
                style={{ textDecoration: 'none' }}
              >
                <p className="blog-card-cat">{e.cat}</p>
                <h3>{e.title}</h3>
                <p>{e.short}</p>
                <span className="blog-card-link">Read Essay</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Open Source ──────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <p className="section-label">Open Source</p>
          <h2 className="section-title">GitHub projects</h2>
          <div className="blog-grid">
            {featuredProjects.map(p => (
              <a
                key={p.slug}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="blog-card"
                style={{ textDecoration: 'none' }}
              >
                <p className="blog-card-cat">{p.cat}</p>
                <h3>{p.title}</h3>
                <p>{p.tagline}</p>
                <span className="blog-card-link">View on GitHub</span>
              </a>
            ))}
          </div>
          <div style={{ marginTop: 32, textAlign: 'center' }}>
            <Link to="/projects" className="btn btn-outline">
              All projects →
            </Link>
          </div>
        </div>
      </section>

      {/* ── The story, in brief ──────────────────────────── */}
      <section className="section section-alt">
        <div className="container">
          <p className="section-label">Background</p>
          <h2 className="section-title">Where the thinking comes from</h2>
          <p className="mb-10 max-w-[64ch] font-prose text-[0.95rem] leading-[1.8] text-parchment-muted">
            {intro[1]}
          </p>

          {/* The chapters, as a contents page. The full narrative,
              its figures, and the architecture layers live on /about. */}
          <ol className="m-0 mb-10 grid list-none gap-x-8 gap-y-0 p-0 sm:grid-cols-2">
            {chapters.map((c, i) => (
              <li key={c.id}>
                <Reveal delay={Math.min(i, 4) * 0.04}>
                  <Link
                    to={`/about#${c.id}`}
                    className="group flex items-baseline gap-4 border-b border-rule-soft py-4 no-underline"
                  >
                    <span className="font-mono text-[0.62rem] font-bold tracking-[0.1em] text-copper">
                      {c.n}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-[0.98rem] text-parchment transition-colors group-hover:text-copper">
                        {c.title}
                      </span>
                      <span className="mt-1 block font-mono text-[0.62rem] tracking-[0.12em] text-parchment-dim uppercase">
                        {c.era}
                        {/* Chapters 04 and 05 carry the employer as
                            their era, so avoid "Barclays · Barclays". */}
                        {c.org && c.org !== c.era && ` · ${c.org}`}
                      </span>
                    </span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ol>

          <div className="flex flex-wrap items-center gap-4">
            <Link to="/about" className="btn btn-primary">
              Read the full story →
            </Link>
            <span className="font-mono text-[0.68rem] text-parchment-dim">
              {profile.certification}
            </span>
          </div>

        </div>
      </section>
    </>
  )
}
