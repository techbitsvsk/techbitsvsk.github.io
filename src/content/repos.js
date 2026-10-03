/* ============================================================
   Open source — one entry per real repository.
   Verified against github.com/techbitsvsk.

   Single source for: the Projects page, the Home featured
   strip, the About page evidence cards, and the ⌘K palette.

   `status: 'private'` marks work described in the bio that has
   no public repository. Those render as a muted marker with no
   link — never as a dead link.
   ============================================================ */

const OWNER = 'https://github.com/techbitsvsk'

export const repos = [
  {
    slug: 'catalog-sync',
    repo: 'catalog_sync',
    url: `${OWNER}/catalog_sync`,
    title: 'Iceberg Catalog Sync',
    cat: 'Iceberg · Governance',
    lang: 'Python',
    kind: 'project',
    featured: true,
    tagline: 'Cross-cloud Iceberg table portability with policy enforcement.',
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
    repo: 'data-product-platform',
    url: `${OWNER}/data-product-platform`,
    title: 'Data Product Platform',
    cat: 'Data Platform · Java',
    lang: 'Java',
    kind: 'project',
    featured: true,
    tagline: 'Specifications as the single source of truth — schema in, platform out.',
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
    repo: 'fabric_automation',
    url: `${OWNER}/fabric_automation`,
    title: 'Fabric Control Plane',
    cat: 'Platform Engineering · Python',
    lang: 'Python',
    kind: 'project',
    featured: true,
    tagline: 'Governed Fabric workspaces provisioned by code, not tickets.',
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
    repo: 'stratum_tpch',
    url: `${OWNER}/stratum_tpch`,
    title: 'Stratum — Lineage-First Data Platform',
    cat: 'Data Lineage · Knowledge Graph',
    lang: 'Python',
    kind: 'project',
    featured: true,
    tagline: 'A lineage knowledge graph you can query in plain English.',
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
    repo: 'multicloud_repo',
    url: `${OWNER}/multicloud_repo`,
    title: 'Multi-Cloud Data Pipeline',
    cat: 'Multi-Cloud · PySpark',
    lang: 'Python',
    kind: 'project',
    featured: true,
    tagline: 'The same ETL logic, unchanged, on three runtimes.',
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

  /* ── Notes, not a project ─────────────────────────────────── */
  {
    slug: 'iceberg-notes',
    repo: 'iceberg',
    url: `${OWNER}/iceberg`,
    title: 'Iceberg insights',
    cat: 'Notes',
    lang: null,
    kind: 'notes',
    featured: false,
    tagline: 'Working notes on Apache Iceberg internals.',
  },

  /* ── Built, but not published ──────────────────────────────
     These exist as working local projects and back specific
     claims in the bio. They render as an unlinked "not public"
     marker: named honestly, never a dead link. Publishing any
     of them is a one-line change — add `url` and drop `status`. */
  {
    slug: 'fabric-mcp-dev',
    repo: 'fabric-mcp-dev',
    url: null,
    title: 'Fabric MCP server',
    cat: 'Agentic Engineering',
    lang: 'Python',
    kind: 'project',
    status: 'local',
    featured: false,
    tagline:
      'A local MCP server giving an AI coding assistant live Fabric workspace context and golden-path notebook scaffolds, so generated code uses real table schemas from the first draft.',
  },
  {
    slug: 'gdpr-crypto-shredding',
    repo: 'gdpr-crypto-shredding',
    url: null,
    title: 'Crypto-Shredding on Iceberg',
    cat: 'Governance · Erasure',
    lang: 'Python',
    kind: 'project',
    status: 'local',
    featured: false,
    tagline:
      'Format-preserving encryption (FF3-1) for right-to-erasure across Iceberg tables, without physically rewriting files.',
  },
  {
    slug: 'apigw-llm-cache',
    repo: 'apigw_LLM_Cache',
    url: null,
    title: 'Data Lake API Platform',
    cat: 'API Gateway · Serverless',
    lang: 'Python',
    kind: 'project',
    status: 'local',
    featured: false,
    tagline:
      'Serverless API Gateway provisioning secure, queryable endpoints over Athena/Iceberg — column and row-level security, caching, circuit breakers, and FinOps cost allocation.',
  },
  {
    slug: 'conversational-data-dictionary',
    repo: null,
    url: null,
    title: 'Conversational data dictionary',
    cat: 'RAG · Retrieval',
    lang: null,
    kind: 'project',
    status: 'private',
    featured: false,
    tagline:
      'A RAG-based conversational interface over enterprise data dictionary and glossary metadata.',
  },
]

/** Lookup by slug — used by the About page evidence cards. */
export const repoBySlug = Object.fromEntries(repos.map(r => [r.slug, r]))

/** Public, code-bearing projects, in display order. */
export const publicProjects = repos.filter(r => r.kind === 'project' && !r.status)

/** Home page featured strip. */
export const featuredProjects = repos.filter(r => r.featured)
