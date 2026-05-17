import { Link } from 'react-router-dom'

const linkStyle = {
  color: 'var(--primary)',
  textDecoration: 'underline',
  textUnderlineOffset: '3px',
  textDecorationThickness: '1px',
}

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
    path: '/writing/voronoi-iii',
    cat: 'Platform Architecture - Multi-Cloud',
    title: 'When One Cloud Is Not Enough',
    excerpt:
      'Five cases where multi-region is not enough: control plane failures, DORA concentration risk, platform mismatch, inherited estate, and jurisdictional sovereignty. How to cross cloud boundaries privately, governed, and with complete provenance.',
  },
  {
    path: '/writing/voronoi-ii',
    cat: 'Platform Architecture - Multi-Cloud',
    title: 'The Physical and Catalog Planes',
    excerpt:
      'Apache Iceberg as the open table format, Polaris as the vendor-neutral catalog, workload placement across AWS, Azure, and GCP — and why open formats are genuine negotiating leverage in cloud renewals.',
  },
  {
    path: '/writing/lineage',
    cat: 'Data Platform - Knowledge Graph',
    title: 'The Lineage-First Data Platform',
    excerpt: 'One audit question that takes three weeks to answer. Here is the architecture — OpenLineage, Neo4j, and Text2Cypher — that makes it take three seconds.',
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
              <p style={{ color: 'var(--text-secondary, #888)', fontSize: '0.9rem', fontStyle: 'italic', marginBottom: '2rem', lineHeight: 1.7 }}>
                Seven architectural layers, each forced by a constraint the previous layer alone could not solve.
              </p>

              {[
                {
                  n: "01",
                  title: "The constraint",
                  body: "5% of data must remain on-premises by regulatory obligation. That boundary became the forcing function: hybrid architecture, data sovereignty, and the DORA concentration risk framework now governing UK and EU financial entities.",
                  links: [
                    { type: "writing", to: "/writing/voronoi-iii", text: "When One Cloud Is Not Enough" },
                  ],
                },
                {
                  n: "02",
                  title: "Build Once, Run Anywhere",
                  body: "The same ETL logic executing without modification on AWS Glue, Microsoft Fabric, and local Spark. Platform isolation via a factory pattern, no rewrites across clouds. Apache Iceberg as the portability primitive across all three.",
                  links: [
                    { type: "writing", to: "/writing/voronoi-ii", text: "The Physical and Catalog Planes" },
                    { type: "repo", href: "https://github.com/techbitsvsk/multicloud_repo", text: "multicloud_repo" },
                  ],
                },
                {
                  n: "03",
                  title: "Open table formats and catalog",
                  body: "Apache Iceberg gives ACID semantics, schema evolution, and time-travel across any engine. Apache Polaris provides the vendor-neutral REST Catalog: one endpoint, all engines. The catalog_sync project implements OPA-governed metadata replication with column-level security and JWT auth.",
                  links: [
                    { type: "writing", to: "/writing/voronoi-ii", text: "The Physical and Catalog Planes" },
                    { type: "repo", href: "https://github.com/techbitsvsk/catalog_sync", text: "catalog_sync" },
                  ],
                },
                {
                  n: "04",
                  title: "Platform trade-offs",
                  body: "Microsoft Fabric unifies compute and storage into one capacity model. Databricks keeps the lakehouse open and engine-agnostic. Neither is universally correct. The choice depends on what the organisation needs to prove to regulators, auditors, and vendors.",
                  links: [
                    { type: "writing", to: "/writing/architects", text: "The Architects of Insight" },
                    { type: "writing", to: "/writing/fabric", text: "Building a Full Microsoft Fabric Platform" },
                  ],
                },
                {
                  n: "05",
                  title: "Marketplace",
                  body: "Portability without discoverability is incomplete. Data mesh gave the federated ownership model; the marketplace gave it a contractual interface. Data products are schema-defined, SLA-governed, and independently consumable. The data-product-platform implements this as a JSON Schema marketplace with three-layer validation.",
                  links: [
                    { type: "writing", to: "/writing/voronoi", text: "The Voronoi Platform Architecture" },
                    { type: "repo", href: "https://github.com/techbitsvsk/data-product-platform", text: "data-product-platform" },
                  ],
                },
                {
                  n: "06",
                  title: "Lineage and provenance",
                  body: "A marketplace without provenance is a catalogue of unverified assertions. Every pipeline emits column-level provenance via OpenLineage to a Neo4j knowledge graph. A five-hop Cypher traversal answers what breaks if a column changes, in milliseconds. Text2Cypher means a CFO can ask that in plain English.",
                  links: [
                    { type: "writing", to: "/writing/lineage", text: "The Lineage-First Data Platform" },
                  ],
                },
                {
                  n: "07",
                  title: "Governance as equilibrium",
                  body: "The Voronoi stability model: six forces balancing each other across clouds and jurisdictions. When any one expands without the others, the platform deforms. OPA as the neutral policy engine: one set of Rego rules, one audit log, regardless of which cloud enforced it.",
                  links: [
                    { type: "writing", to: "/writing/voronoi", text: "The Voronoi Platform Architecture" },
                    { type: "repo", href: "https://github.com/techbitsvsk/catalog_sync", text: "catalog_sync" },
                  ],
                },
              ].map(({ n, title, body, links }) => (
                <div key={n} style={{ display: "flex", gap: "1.1rem", marginBottom: "1.4rem", paddingBottom: "1.4rem", borderBottom: "1px solid var(--border, #e5e5e5)", alignItems: "flex-start" }}>
                  <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.62rem", color: "var(--primary)", fontWeight: 700, letterSpacing: "0.1em", minWidth: 26, paddingTop: 3, flexShrink: 0 }}>{n}</span>
                  <div style={{ flex: 1 }}>
                    <strong style={{ display: "block", fontSize: "0.92rem", marginBottom: "0.3rem" }}>{title}</strong>
                    <p style={{ margin: "0 0 0.5rem", fontSize: "0.875rem", lineHeight: 1.75, color: "var(--text-secondary, #555)" }}>{body}</p>
                    {links.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                        {links.map((l, li) =>
                          l.type === "writing" ? (
                            <Link key={li} to={l.to} style={{ ...linkStyle, fontSize: "0.78rem" }}>{l.text} &rarr;</Link>
                          ) : (
                            <a key={li} href={l.href} target="_blank" rel="noopener noreferrer" style={{ ...linkStyle, fontSize: "0.78rem", opacity: 0.75 }}>{l.text} &#x2197;</a>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
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
