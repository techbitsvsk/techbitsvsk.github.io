import { Link } from 'react-router-dom'

const projects = [
  {
    url: 'https://github.com/techbitsvsk/data-product-platform',
    cat: 'Java · Spring Boot',
    title: 'Data Product Platform',
    excerpt: 'Schema-driven marketplace for enterprise data products. JSON Schema as the single source of truth, auto-generating POJOs with three-layer validation and zero-code extensibility.',
  },
  {
    url: 'https://github.com/techbitsvsk/catalog_sync',
    cat: 'Apache Iceberg · OPA',
    title: 'Catalog Sync',
    excerpt: 'Platform-agnostic Iceberg catalog metadata replication with JWT auth, OPA policy enforcement, and row/column-level security across seven containerised services.',
  },
  {
    url: 'https://github.com/techbitsvsk/multicloud_repo',
    cat: 'PySpark · Multi-Cloud',
    title: 'Multi-Cloud Data Pipeline',
    excerpt: 'Medallion architecture (Bronze → Silver → Gold) running identically on AWS Glue, Microsoft Fabric, and local Spark. Azure validation in progress — same Iceberg portability proof, no rewrites.',
  },
]

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
                Data Strategist · Finacial Services · Glasgow, Scotland
              </p>
              <h1 className="hero-name">Sravan Vadaga</h1>
              <p className="hero-title">
                Enterprise Data Architecture &nbsp;·&nbsp; Cloud Transformation
                &nbsp;·&nbsp; Platform Engineering
              </p>
              <p className="hero-desc">
                Techno-Functional Leader at the crossroads of Data Engineering, Cloud Transformation,
                and Intelligent Automation — backed by 18+ years of global experience architecting
                how enterprises redefine decision intelligence and achieve large-scale, sustainable growth.
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
                <img src="/assets/profile.png" alt="Sravan Vadaga" />
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
              <span className="metric-label">Regulatory Delivery<br />vs 3-year baseline</span>
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

      {/* ── Open Source ──────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <p className="section-label">Open Source</p>
          <h2 className="section-title">GitHub projects</h2>
          <div className="blog-grid">
            {projects.map(p => (
              <a
                key={p.url}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="blog-card"
                style={{ textDecoration: 'none' }}
              >
                <p className="blog-card-cat">{p.cat}</p>
                <h3>{p.title}</h3>
                <p>{p.excerpt}</p>
                <span className="blog-card-link">View on GitHub</span>
              </a>
            ))}
          </div>
          <div style={{ marginTop: 32, textAlign: 'center' }}>
            <Link to="/projects" className="btn btn-outline">All projects →</Link>
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
                The thinking here starts with a real constraint: regulatory requirements forcing a
                hybrid architecture where 5% of data must remain on-premises while 95% runs in
                the cloud. That boundary — not a preference, a compliance obligation — became the
                forcing function for everything that followed.
              </p>
              <p style={{ marginTop: '16px' }}>
                The first architectural response was a <em>Build Once, Run Anywhere</em> framework.
                The same ETL logic, executing without modification on AWS Glue, Microsoft Fabric,
                and local Spark. That portability demand led to a deep analysis of open table
                formats, and Apache Iceberg emerged as the answer — ACID semantics, schema
                evolution, time-travel, and a REST catalog interface (Nessie) that lets data
                travel across platform boundaries or be accessed from a single point without
                duplication. Vendor-agnostic is not a procurement position; it is a provable
                architectural guarantee.
              </p>
              <p style={{ marginTop: '16px' }}>
                Portability alone is not enough. Data must also be discoverable, its lineage
                traceable, and its quality observable. That is where a central platform layer
                becomes load-bearing — not as a bottleneck, but as the entity that tracks
                what exists, where it came from, and who can consume it. Data mesh fundamentals
                gave the federated ownership model; the marketplace gave it a contractual interface.
                Data products are discoverable, schema-defined, and independently consumable —
                not buried in pipelines or undocumented schemas.
              </p>
              <p style={{ marginTop: '16px' }}>
                From the marketplace, a range of consumption patterns emerge: OLAP workloads
                running analytical queries across the lakehouse, OLTP patterns requiring
                low-latency access, and data product teams building interoperable applications
                across cloud boundaries. Iceberg's ACID guarantees hold the consistency model
                across all of them — the same table serving the same truth regardless of which
                compute engine reads it.
              </p>
              <p style={{ marginTop: '16px' }}>
                Holding the entire stack together is platform governance — not a department, but
                an architectural layer. Zero-trust security, cybersecurity controls, provisioning
                gates, policy enforcement, marketplace contracts, and observability do not operate
                in isolation. In the Voronoi stability model, these six forces balance each other:
                when any one expands without the others, the structure deforms. The platform
                engineering challenge is keeping them in equilibrium — at enterprise scale,
                across jurisdictions, without manual intervention.
              </p>
            </div>
            <div className="about-meta">
              <div className="meta-block">
                <p className="meta-label">Engineering Philosophy</p>
                <p className="meta-value">Architect. Not Operator.</p>
                <p className="meta-sub">Eliminate failure classes architecturally · Governance as structure, not process · Platform over product</p>
              </div>
              <div className="meta-block">
                <p className="meta-label">Signature Patterns</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                  <span className="pill pill-blue">Project to Product Approach</span>
                  <span className="pill pill-blue">Zero-Trust Provisioning</span>
                  <span className="pill pill-sage">Build Once Run Any where</span>
                  <span className="pill pill-sage">Multi-Cloud Portability</span>
                  <span className="pill pill-grey">Federated Governance</span>
                  <span className="pill pill-grey">ADR Standardisation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
