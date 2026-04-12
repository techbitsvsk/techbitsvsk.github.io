import { Link } from 'react-router-dom'

const projects = [
  {
    slug: 'data-product-platform',
    url: 'https://github.com/techbitsvsk/data-product-platform',
    cat: 'Data Platform · Java',
    title: 'Data Product Platform',
    description:
      'Schema-driven marketplace for enterprise data products. JSON Schema is the single source of truth — auto-generating Java POJOs with three-layer validation (headers, schema, bean validation). Zero-code extensibility for new product types, interactive API browsing via Swagger UI.',
    stack: ['Java', 'Spring Boot 3.2', 'JSON Schema', 'Swagger UI'],
  },
  {
    slug: 'twa-provisioner',
    url: 'https://github.com/techbitsvsk/twa-provisioner',
    cat: 'Platform Automation · Python',
    title: 'TWA Provisioner',
    description:
      'Automated provisioning system for Microsoft Fabric Trusted Workspace Access. Orchestrates workspace identity creation and Azure RBAC configuration through ServiceNow change management, enforcing governance gates with full audit trails via Git and ServiceNow workflows.',
    stack: ['Python', 'Terraform', 'Microsoft Fabric', 'ServiceNow', 'Azure RBAC'],
  },
  {
    slug: 'catalog_sync',
    url: 'https://github.com/techbitsvsk/catalog_sync',
    cat: 'Iceberg · Governance',
    title: 'Catalog Sync',
    description:
      'Platform-agnostic tool for replicating Apache Iceberg catalog metadata across storage systems while rewriting absolute URIs. Includes archive/restore for cold storage, JWT authentication, OPA policy enforcement, row/column-level security, and seven containerised services with zero-touch setup.',
    stack: ['Python', 'Apache Iceberg', 'OPA', 'JWT', 'Docker'],
  },
  {
    slug: 'multicloud_repo',
    url: 'https://github.com/techbitsvsk/multicloud_repo',
    cat: 'Multi-Cloud · PySpark',
    title: 'Multi-Cloud Data Pipeline',
    description:
      'Production-ready medallion architecture (Bronze → Silver → Gold) running identically on AWS Glue, Microsoft Fabric, and local Spark without code changes. Includes TPC-H dataset processing, 13 smoke tests, and comprehensive IaC templates (Terraform/Bicep) with 5-minute local Docker validation.',
    stack: ['PySpark', 'Apache Iceberg', 'AWS Glue', 'Microsoft Fabric', 'Terraform', 'Bicep'],
  },
]

const others = [
  {
    url: 'https://github.com/techbitsvsk/iceberg',
    title: 'Iceberg Insights',
    description: 'Notes and explorations on Apache Iceberg table format internals.',
    lang: 'Notes',
  },
  {
    url: 'https://github.com/techbitsvsk/data-architecture-notes',
    title: 'Data Architecture Notes',
    description: 'Running notes on enterprise data architecture patterns and trade-offs.',
    lang: 'Notes',
  },
  {
    url: 'https://github.com/techbitsvsk/testdata-generator',
    title: 'Test Data Generator',
    description: 'Lightweight C utility for generating synthetic test datasets.',
    lang: 'C',
  },
]

export default function Projects() {
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {projects.map(p => (
              <a
                key={p.slug}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="achievement-card"
                style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none' }}
              >
                <p className="blog-card-cat" style={{ marginBottom: 14 }}>{p.cat}</p>
                <h3 style={{ marginBottom: 12 }}>{p.title}</h3>
                <p style={{ fontSize: '0.875rem', lineHeight: 1.78, flex: 1 }}>{p.description}</p>
                <div className="achievement-stat">
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
                <div style={{
                  marginTop: 20,
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}>
                  View on GitHub ↗
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Other repos ────────────────────────────────────── */}
      <section className="section section-alt">
        <div className="container">
          <p className="section-label">Also on GitHub</p>
          <h2 className="section-title">Notes & utilities</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {others.map(r => (
              <a
                key={r.url}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card"
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.65rem',
                  color: 'var(--copper)',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  marginBottom: 10,
                }}>
                  {r.lang}
                </div>
                <h4 style={{ marginBottom: 8 }}>{r.title}</h4>
                <p style={{ fontSize: '0.84rem' }}>{r.description}</p>
              </a>
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
