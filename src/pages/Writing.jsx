import { Link } from 'react-router-dom'
import { essays } from '@/content/essays'


export default function Writing() {
  return (
    <>
      {/* ── Page hero ────────────────────────────────────── */}
      <div className="page-hero">
        <div className="container">
          <p className="section-label">Essays</p>
          <h1>Architecture writing</h1>
          <p>
            Long-form thinking on enterprise data platforms, cloud architecture,
            governance, and the engineering decisions that matter at scale.
          </p>
        </div>
      </div>

      {/* ── Essay list ───────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="essay-list">
            {essays.map((e, i) => (
              <Link key={e.path} to={e.path} className="essay-row">
                <span className="essay-num">0{i + 1}</span>
                <div className="essay-body">
                  <p className="essay-cat">{e.cat}</p>
                  <h2 className="essay-title">{e.title}</h2>
                  <p className="essay-subtitle">{e.subtitle}</p>
                  <p className="essay-excerpt">{e.excerpt}</p>
                </div>
                <span className="essay-arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
