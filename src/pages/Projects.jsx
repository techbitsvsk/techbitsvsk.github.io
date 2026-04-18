import { Link } from 'react-router-dom'

const projects = [
  {
    slug: 'catalog-sync',
    url: 'https://github.com/techbitsvsk/catalog_sync',
    cat: 'Iceberg · Governance',
    title: 'Iceberg Catalog Sync',
    problem:
      'Iceberg metadata embeds absolute storage URIs at every level. Copying Parquet files across clouds without rewriting those URIs leaves every table pointing back at the source — queries fail silently.',
    summary:
      'Enterprise-grade, platform-agnostic Apache Iceberg catalog replication with full metadata-chain URI rewrite, OAuth 2.0 authentication, and fine-grained data-contract policy enforcement.',
    capabilities: [
      'Manifest-based diff → parallel Parquet/Avro transfer → full URI rewrite → idempotent Nessie commit',
      'Cold-storage archival and partition-level restore with dry-run safety gate',
      'OAuth 2.0 RS256 JWT issuer + OPA policy engine: allow/deny, row-level security, column exclusion & masking',
      '7-service Docker stack (Nessie, MinIO, OPA, Postgres, Airflow) — zero-touch `docker compose up`',
    ],
    stack: ['Python', 'Apache Iceberg', 'Nessie', 'OPA', 'OAuth 2.0', 'FastAPI', 'Docker', 'Airflow'],
  },
  {
    slug: 'data-product-platform',
    url: 'https://github.com/techbitsvsk/data-product-platform',
    cat: 'Data Platform · Java',
    title: 'Data Product Platform',
    problem:
      'Every new data product type requires handwritten POJOs, duplicated validation logic, and bespoke API wiring — making the platform brittle and expensive to extend.',
    summary:
      'Schema-driven marketplace where JSON Schema files are the single source of truth: POJOs are auto-generated at build time and every request passes a three-layer validation pipeline before reaching business logic.',
    capabilities: [
      'jsonschema2pojo Maven plugin generates fully-annotated Java classes and enums at build time',
      'Three sequential runtime gates: header validation → JSON Schema pre-filter → Bean Validation annotations',
      'Zero-code extensibility — add a `.json` schema file, rebuild, and the new product type is live',
      'Interactive Swagger UI + dry-run `POST /validate` endpoint for safe schema testing',
    ],
    stack: ['Java 17', 'Spring Boot 3.2', 'JSON Schema', 'Bean Validation', 'Swagger UI', 'Maven'],
  },
  {
    slug: 'fabric-automation',
    url: 'https://github.com/techbitsvsk/fabric_automation',
    cat: 'Platform Engineering · Python',
    title: 'Fabric Control Plane',
    problem:
      'Provisioning Microsoft Fabric workspaces manually is error-prone, non-repeatable, and leaves role assignments drifting from their declared state over time.',
    summary:
      'Idempotent, API-driven provisioning and governance for Microsoft Fabric workspaces — accepts a workspace spec via REST or YAML and drives the full lifecycle, deployable as FastAPI or Azure Functions with zero rewrites.',
    capabilities: [
      'Full lifecycle: create workspace → assign capacity & domain → reconcile Azure AD group roles',
      'Dual deployment target: standalone FastAPI service or Azure Functions v4 via ASGI adapter — same codebase, no rewrites',
      'Entra ID JWT validation via JWKS; Managed Identity in production — no stored secrets',
      'Structured JSON logs with per-request correlation IDs; full Bicep IaC for zero-touch infra',
    ],
    stack: ['Python', 'FastAPI', 'Azure Functions', 'Microsoft Fabric', 'Entra ID', 'Bicep', 'structlog'],
  },
  {
    slug: 'stratum-tpch',
    url: 'https://github.com/techbitsvsk/stratum_tpch',
    cat: 'Data Lineage · Knowledge Graph',
    title: 'Stratum — Lineage-First Data Platform',
    problem:
      'A regulatory audit on a single revenue figure took three weeks, four teams, and a 47-page spreadsheet — because lineage was produced after the fact, manually, under pressure, not built into the platform.',
    summary:
      'End-to-end column lineage infrastructure on TPC-H: OpenLineage events fan-out to a Neo4j knowledge graph and Marquez simultaneously, enabling 5-hop provenance traversal in milliseconds and natural-language queries via a Text2Cypher NLP API.',
    capabilities: [
      'Explicit ColumnLineageDatasetFacet declared in every Airflow job — accurate, version-controlled, never inferred',
      'Composite OpenLineage transport fans events to Neo4j (deep graph) and Marquez (visual UI) in a single pipeline run',
      'Cypher MATCH path traversal answers "where does this column come from?" and "what breaks if I change this?" in one hop',
      'NLP API (Groq LLM → validated Cypher → plain English) lets business users query lineage without learning Cypher',
      'Streamlit graph explorer + namespace-scoped data product registration card for governance teams',
    ],
    stack: ['Python', 'Neo4j', 'OpenLineage', 'Apache Airflow', 'Marquez', 'Groq', 'Streamlit', 'Apache Iceberg', 'Docker'],
  },
  {
    slug: 'multicloud-pipeline',
    url: 'https://github.com/techbitsvsk/multicloud_repo',
    cat: 'Multi-Cloud · PySpark',
    title: 'Multi-Cloud Data Pipeline',
    problem:
      'Data pipelines become cloud-locked because platform-specific session setup and storage paths are tangled through business logic — migrating means a near-complete rewrite.',
    summary:
      'Production-ready medallion architecture (Bronze → Silver → Gold) on Apache Iceberg that runs identically on AWS Glue, Microsoft Fabric, and local Spark without any code changes — platform isolation via a factory pattern.',
    capabilities: [
      'Factory pattern builds platform-specific SparkSession; only the `ICEBERG_WAREHOUSE` env var changes across clouds',
      'Bronze (raw ingest) → Silver (type-cast, null-filter, partition) → Gold (joins & business metrics) on TPC-H data',
      '13 smoke tests validate end-to-end portability across all three runtimes',
      'Terraform (AWS Glue + S3) and Bicep (Azure) IaC templates included',
    ],
    stack: ['PySpark', 'Apache Iceberg', 'AWS Glue', 'Microsoft Fabric', 'Azure', 'Terraform', 'Bicep', 'MinIO'],
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
