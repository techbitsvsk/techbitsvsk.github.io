import { Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { publicProjects as projects } from '@/content/repos'



export default function Projects() {
  const { hash } = useLocation()

  useEffect(() => {
    if (!hash) return
    const el = document.getElementById(hash.slice(1))
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [hash])

  return (
    <>
      {/* ── Page hero ──────────────────────────────────────── */}
      <div className="page-hero">
        <div className="container">
          <p className="section-label">Open Source</p>
          <h1>GitHub projects</h1>
          <p>
            Production-grade reference implementations covering data platform automation,
            multi-cloud pipelines, Iceberg governance, and schema-driven marketplaces.
          </p>
        </div>
      </div>

      {/* ── Main projects ──────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            {projects.map(p => (
              <div
                key={p.slug}
                id={p.slug}
                className="achievement-card"
                style={{ display: 'flex', flexDirection: 'column', gap: 0 }}
              >
                {/* ─ Header row ─ */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                  <div>
                    <p className="blog-card-cat" style={{ marginBottom: 8 }}>{p.cat}</p>
                    <h3 style={{ margin: 0 }}>
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'inherit', textDecoration: 'none' }}
                      >
                        {p.title} ↗
                      </a>
                    </h3>
                  </div>
                </div>

                {/* ─ Divider ─ */}
                <div style={{ height: 1, background: 'var(--border)', marginBottom: 20 }} />

                {/* ─ Problem ─ */}
                <div style={{ marginBottom: 16 }}>
                  <p style={{
                    fontSize: '0.7rem',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--copper)',
                    marginBottom: 6,
                  }}>
                    The Problem
                  </p>
                  <p style={{ fontSize: '0.9rem', lineHeight: 1.7, fontStyle: 'italic', color: 'var(--text-muted)', margin: 0 }}>
                    {p.problem}
                  </p>
                </div>

                {/* ─ Summary ─ */}
                <div style={{ marginBottom: 20 }}>
                  <p style={{
                    fontSize: '0.7rem',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--primary)',
                    marginBottom: 6,
                  }}>
                    What It Does
                  </p>
                  <p style={{ fontSize: '0.9rem', lineHeight: 1.75, margin: 0 }}>
                    {p.summary}
                  </p>
                </div>

                {/* ─ Key capabilities ─ */}
                <div style={{ marginBottom: 24 }}>
                  <p style={{
                    fontSize: '0.7rem',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--primary)',
                    marginBottom: 10,
                  }}>
                    Key Capabilities
                  </p>
                  <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {p.capabilities.map((c, i) => (
                      <li key={i} style={{ fontSize: '0.875rem', lineHeight: 1.7 }}>{c}</li>
                    ))}
                  </ul>
                </div>

                {/* ─ Stack tags ─ */}
                <div className="achievement-stat" style={{ flexWrap: 'wrap' }}>
                  {p.stack.map(t => (
                    <span key={t} style={{
                      background: 'var(--primary-soft)',
                      color: 'var(--primary)',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.7rem',
                      fontWeight: 500,
                      padding: '3px 9px',
                      borderRadius: 999,
                    }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <p className="section-label">Writing</p>
          <h2 className="section-title" style={{ marginBottom: 16 }}>
            See the thinking behind the code
          </h2>
          <p style={{ maxWidth: 540, margin: '0 auto 32px', fontSize: '0.95rem' }}>
            The architecture writing explores the patterns these projects implement —
            Voronoi stability models, platform governance, and multi-cloud lakehouse design.
          </p>
          <Link to="/writing" className="btn btn-primary">Read the essays</Link>
        </div>
      </section>
    </>
  )
}
