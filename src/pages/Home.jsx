import { Link } from 'react-router-dom'

const essays = [
  {
    path: '/writing/voronoi',
    cat: 'Platform Architecture',
    title: 'The Voronoi Platform Architecture',
    excerpt:
      'Six forces govern enterprise data platform stability: sovereignty, intelligence, marketplace, observability, governance, and security. When they balance, the architecture holds.',
  },
  {
    path: '/writing/architects',
    cat: 'Comparative Architecture',
    title: 'The Architects of Insight',
    excerpt:
      `A narrative comparison of Microsoft Fabric’s unified approach and Databricks’ open lakehouse flexibility — and why the choice depends on your kingdom’s character.`,
  },
  {
    path: '/writing/fabric',
    cat: 'Platform Engineering',
    title: 'Building a Full Microsoft Fabric Platform',
    excerpt:
      'Governance, workspace provisioning, data marketplace design, and enterprise observability — turning Fabric from a UI layer into a governed enterprise platform.',
  },
]

export default function Home() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="home-hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-left fade-up">
              <p className="hero-eyebrow">
                Lead Platform Architect · VP · Barclays · Glasgow
              </p>
              <h1 className="hero-name">Sravan Vadaga</h1>
              <p className="hero-title">
                Enterprise Data Architecture &nbsp;·&nbsp; Cloud Transformation
                &nbsp;·&nbsp; AI/GenAI Platform Engineering
              </p>
              <p className="hero-desc">
                18+ years building data platforms, leading engineering teams, and
                turning architectural complexity into traceable, governed, and
                intelligent systems at Barclays and JPMorgan Chase.
              </p>
              <div className="hero-contact">
                <a href="mailto:sravankvadaga@gmail.com">sravankvadaga@gmail.com</a>
                <span className="sep">·</span>
                <a
                  href="https://linkedin.com/in/sravankumarvadaga"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn ↗
                </a>
                <span className="sep">·</span>
                <span>Glasgow, Scotland</span>
              </div>
              <div className="hero-actions fade-up-2">
                <Link to="/writing" className="btn btn-primary">
                  Read the writing
                </Link>
                <a
                  href="https://github.com/techbitsvsk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                >
                  GitHub ↗
                </a>
              </div>
            </div>
            <div className="hero-right fade-up-3">
              <div className="hero-avatar" title="Sravan Vadaga">
                {/* Replace with: <img src="/assets/profile.jpg" alt="Sravan Vadaga" />
                    once you've saved your LinkedIn photo to public/assets/profile.jpg */}
                SV
              </div>
              <div className="hero-cert">
                <span className="pill pill-sage">AWS SA – Professional</span>
              </div>
            </div>
          </div>

          {/* ── Impact metrics ───────────────────────────── */}
          <div className="hero-metrics">
            <div className="hero-metric">
              <span className="metric-num">18+</span>
              <span className="metric-label">Years of Engineering<br />Leadership</span>
            </div>
            <div className="hero-metric">
              <span className="metric-num">8<small>mo</small></span>
              <span className="metric-label">MRIA Delivery<br />vs 3-year baseline</span>
            </div>
            <div className="hero-metric">
              <span className="metric-num">70%</span>
              <span className="metric-label">Delivery Velocity<br />Improvement</span>
            </div>
            <div className="hero-metric">
              <span className="metric-num">40%</span>
              <span className="metric-label">Batch Processing<br />Reduction</span>
            </div>
            <div className="hero-metric">
              <span className="metric-num">30</span>
              <span className="metric-label">Cross-Regional<br />Team US · UK · India</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Philosophy ───────────────────────────────────── */}
      <div className="philosophy">
        <p className="philosophy-quote">
          "Analytics with intent and technology with purpose — transforming data
          into decisions, insights into innovation, strategy into enduring business value."
        </p>
        <p className="philosophy-attr">— Sravan Vadaga</p>
      </div>

      {/* ── Writing ──────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <p className="section-label">Thought Leadership</p>
          <h2 className="section-title">Architecture writing</h2>
          <div className="blog-grid">
            {essays.map(e => (
              <Link
                key={e.path}
                to={e.path}
                className="blog-card"
                style={{ textDecoration: 'none' }}
              >
                <p className="blog-card-cat">{e.cat}</p>
                <h3>{e.title}</h3>
                <p>{e.excerpt}</p>
                <span className="blog-card-link">Read Essay</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── About strip ──────────────────────────────────── */}
      <section className="section section-alt">
        <div className="container">
          <div className="about-strip">
            <div className="about-text">
              <p className="section-label">Background</p>
              <h2 className="section-title">Where the thinking comes from</h2>
              <p>
                My career spans financial services infrastructure at scale — credit risk platforms
                at JPMorgan Chase, regulatory transformation programmes, and the Enterprise Data
                Platform at Barclays where GenAI, governance, and cloud architecture converge.
              </p>
              <p style={{ marginTop: '16px' }}>
                The writing here is a product of that work: real problems, real trade-offs, and
                hard-won architectural patterns. Not vendor marketing. Not theory.
              </p>
            </div>
            <div className="about-meta">
              <div className="meta-block">
                <p className="meta-label">Current</p>
                <p className="meta-value">Lead Platform Architect, VP</p>
                <p className="meta-sub">Barclays · Glasgow · May 2023–present</p>
              </div>
              <div className="meta-block">
                <p className="meta-label">Previous</p>
                <p className="meta-value">VP Engineering Lead</p>
                <p className="meta-sub">JPMorgan Chase · Feb 2016–May 2023</p>
              </div>
              <div className="meta-block">
                <p className="meta-label">Domains</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                  <span className="pill pill-blue">Azure Fabric</span>
                  <span className="pill pill-blue">Apache Iceberg</span>
                  <span className="pill pill-sage">DataHub</span>
                  <span className="pill pill-sage">Kafka</span>
                  <span className="pill pill-grey">GenAI Gateway</span>
                  <span className="pill pill-grey">Terraform</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
