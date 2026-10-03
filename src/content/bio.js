/* ============================================================
   The career narrative — eight chapters.

   Sravan's own words, structured so each chapter can carry its
   evidence: the repositories and essays that demonstrate the
   work rather than assert it.

   Shape:
     id          anchor + scrollspy target
     era         when
     org         where (null when it spans employers)
     role        what the role was
     title       chapter heading
     narrative   paragraphs, in order
     pullQuote   the line worth setting large (optional)
     tracks      named sub-threads (optional)
     metrics     numbers this chapter earns (optional)
     tech        technologies, for the pill row
     media       key into content/motion.js (optional)
     evidence    [{ type: 'repo' | 'essay', slug }]
   ============================================================ */

import { intro } from './profile'

export const chapters = [
  {
    id: 'widening-lens',
    n: '01',
    era: '2007 — 2016',
    org: null,
    role: 'Java developer → senior engineer',
    title: 'The widening lens',
    /* The second sentence stops short of the reason, so the pull
       quote below delivers it once rather than echoing it. */
    narrative: [intro[0], "What hasn't changed is that I still write code."],
    pullQuote:
      'The best architecture decisions are made by people who understand how they will be built.',
    tech: ['Java', 'Oracle', 'Distributed Systems'],
    media: null,
    evidence: [],
  },

  {
    id: 'credit-risk',
    n: '02',
    era: '2016 — 2023',
    org: 'JPMorgan Chase',
    role: 'Leading engineering, credit risk technology',
    title: 'Data modernisation from the inside',
    narrative: [
      'At JPMorgan Chase I led engineering for credit risk technology, and it is where I learned data modernisation from the inside. The core of that work was moving a traditional Oracle-based warehousing estate onto a distributed data platform built on Hadoop, re-architecting a monolithic WebLogic risk application into a shared Spring Boot framework with the business logic packaged as a bundle of JARs, each running with that framework as its own standalone process. I used a strangler-fig approach to replace legacy components safely and CQRS to separate risk computation from reporting, and report generation fell from 12 hours to under two.',
      'Designing the pipelines taught me how orchestration and choreography work together. A BPMN orchestrator decided the order and dispatched each activity as a standalone job, which is what gave us control and traceability where regulatory reporting needed strict ordering and auditable runs — and it is what owned reruns, the holiday calendar, and what-if scenarios fanned out as multiple batches. Event-driven choreography sat on top of it, deciding when a feed was ready to ingest based on upstream events, cross-check validation, and dependencies between feeds, falling back to the previous feed when the holiday calendar said a source was not publishing. They were never competing models. Combining them is what made the platform both auditable and responsive, and the balance between them followed what each workload needed.',
      'On the consumption side, the same risk data had to serve very different needs: APIs for downstream systems, scheduled batch feeds, ad hoc analytics for risk analysts and purpose-built data marts for business reporting. Designing one platform to serve all four, without duplicating logic or losing consistency, shaped how I still think about data platforms today.',
      'When the firm faced a critical regulatory finding, I owned the end-to-end design for the remediation programme, defining clear boundaries across six business units and a reusable framework that let teams across the US, UK and India build the same way. We shipped in eight months against a three-year baseline.',
    ],
    pullQuote:
      'The hardest part of delivery is rarely the technology. It is getting many teams to make the same decisions for the same reasons.',
    metrics: [
      { value: '12h → 2h', label: 'Risk report generation' },
      { value: '8 months', label: 'Delivered against a 3-year baseline' },
      { value: '6', label: 'Business units aligned on one framework' },
      { value: 'US · UK · India', label: 'Teams building the same way' },
    ],
    tech: [
      'Java',
      'Spring Boot',
      'Apache Hadoop',
      'Oracle',
      'WebLogic',
      'CQRS',
      'Strangler Fig',
      'BPMN',
      'ETL Orchestration',
      'Event Choreography',
    ],
    media: ['strangler-fig', 'orchestration-choreography'],
    /* No public artefact: this work predates the open-source repos
       and the essays cover different ground. */
    evidence: [],
  },

  {
    id: 'hybrid-pattern',
    n: '03',
    era: 'First year',
    org: 'Barclays',
    role: 'Proving the pattern',
    title: 'Hybrid, and the case for open formats',
    narrative: [
      'I spent my first year at Barclays building a hybrid prototype: a platform where around 5% of workloads remained on-premises and 95% ran in the cloud, built on open-source technology and open table formats. The aim was to let data and compute move between environments without being tied to any single vendor.',
      'It proved something that has guided my work ever since, which is that open formats are what make portability real rather than theoretical.',
    ],
    pullQuote: 'Open formats are what make portability real rather than theoretical.',
    metrics: [
      { value: '95% / 5%', label: 'Cloud / on-premises split, by regulatory obligation' },
    ],
    tech: [
      'Apache Iceberg',
      'Apache Spark',
      'Apache Airflow',
      'Containers',
      'Open Table Formats',
      'Hybrid Cloud',
      'Open Source',
    ],
    media: 'hybrid-split',
    evidence: [
      { type: 'repo', slug: 'multicloud-pipeline' },
      { type: 'essay', slug: 'voronoi-ii' },
      { type: 'essay', slug: 'voronoi-iii' },
    ],
  },

  {
    id: 'aws-lakehouse',
    n: '04',
    era: 'Barclays',
    org: 'Barclays',
    role: 'AWS data platform architecture',
    title: 'The AWS lakehouse',
    narrative: [
      "With the pattern proven, I moved on to the bank's AWS data platform architecture. I designed a lakehouse on Apache Iceberg, using Glue, EMR and Athena for processing and query, Lake Formation for fine-grained access control and Confluent Kafka as the ingestion backbone.",
      'Alongside it, I designed patterns for metadata lineage and catalogue integration, and a right-to-erasure approach for the Iceberg lakehouse using crypto-shredding, so that customer data could be removed on request without breaking the history that regulatory reporting depends on.',
    ],
    pullQuote: null,
    tech: [
      'Apache Iceberg',
      'AWS Glue',
      'Amazon EMR',
      'Amazon Athena',
      'Lake Formation',
      'Confluent Kafka',
      'Crypto-Shredding',
    ],
    media: 'iceberg-lakehouse',
    evidence: [
      { type: 'repo', slug: 'catalog-sync' },
      { type: 'essay', slug: 'voronoi-ii' },
      { type: 'repo', slug: 'gdpr-crypto-shredding' },
    ],
  },

  {
    id: 'azure-genai',
    n: '05',
    era: 'Barclays',
    org: 'Barclays',
    role: 'Azure data lake · firm-wide GenAI gateway',
    title: 'Azure, and the generative AI gateway',
    narrative: [
      "I then went on to lead the bank's Azure data lake and its firm-wide generative AI gateway, the controlled entry point through which the organisation accesses large language models.",
      'Working across both clouds gave me a practical view of where each one is strong, and of what has to stay consistent regardless of which cloud the data sits on.',
    ],
    pullQuote: null,
    tech: ['Microsoft Azure', 'ADLS Gen2', 'Azure OpenAI', 'LLM Gateway', 'Entra ID'],
    media: null,
    evidence: [{ type: 'repo', slug: 'apigw-llm-cache' }],
  },

  {
    id: 'fabric',
    n: '06',
    era: 'Today',
    org: 'Barclays',
    role: 'Delivering the Microsoft Fabric platform',
    title: 'Security first, not security last',
    narrative: [
      "I'm now delivering the bank's Microsoft Fabric platform, and the work starts with security rather than ending with it. I led a full threat model assessment of the platform and mapped every identified threat to a specific control. Those controls include a zero-trust security model, bank-controlled encryption keys, Purview protection policies, row and column-level security and automated, service-principal-only provisioning with no standing human access.",
      'The controls are delivered through automation at platform level, so every data application team inherits them by default rather than rebuilding them. A CI/CD template provisions governed workspaces through code rather than tickets, a clear ownership model separates what infrastructure, platform and application teams are each accountable for, and sixteen Architecture Decision Records capture why each choice was made.',
      "This foundation is also what makes AI safe to adopt. I'm designing how Fabric data agents integrate with Microsoft 365 Copilot and reach users through the Fabric portal, MCP and Azure AI Foundry, with AI guardrails built in at every layer: the user's own identity carried through to the data, row and column-level security enforced on every answer, data loss prevention applied to prompts and responses, and clear precedence rules that decide how an agent should behave when instructions conflict.",
      'The agent is not a black box. A colleague asks a question in plain English, the orchestrator identifies the intent and selects the governed source, and the tool is determined by that source rather than chosen freely — DAX for a Power BI semantic model, SQL for a Lakehouse, KQL for an Eventhouse. There is no translation layer for us to maintain, and the agent inherits the relationships, measures and business terminology the source already carries. Security follows the user: the permissions, row and column-level security and dynamic masking already defined across the Lakehouse and catalogue are the boundary, and every answer is traceable back to what was analysed and where it came from.',
      'Before any agent is published it moves through one Agent Development Lifecycle — certified and contracted data, security and privacy, business ownership, testing and evidence, then deploy and publish. That is the full cycle, not a separate approval stage bolted on at the end. Once published, the agent stops being a destination a colleague visits and becomes a governed capability other systems call over the Model Context Protocol, whether that caller is Microsoft 365 Copilot, Copilot Studio or a domain orchestrator. The caller changes; the data product, the agent and the entitlements do not.',
    ],
    pullQuote: 'The work starts with security rather than ending with it.',
    metrics: [
      { value: '16', label: 'Architecture Decision Records' },
      { value: 'Zero', label: 'Standing human access to production' },
      { value: 'Every threat', label: 'Mapped to a specific control' },
    ],
    tech: [
      'Microsoft Fabric',
      'Zero Trust',
      'Microsoft Purview',
      'Customer-Managed Keys',
      'Row & Column-Level Security',
      'Service Principals',
      'M365 Copilot',
      'MCP',
      'Azure AI Foundry',
      'Fabric Data Agents',
      'ADLC',
      'CI/CD',
    ],
    media: ['zero-trust-provisioning', 'governed-agent'],
    evidence: [
      { type: 'repo', slug: 'fabric-automation' },
      { type: 'essay', slug: 'fabric' },
    ],
  },

  {
    id: 'enterprise-platform',
    n: '07',
    era: 'Today',
    org: 'Barclays',
    role: null,
    title: 'Shaping the enterprise platform',
    narrative: [
      "Alongside Fabric, my role spans the enterprise. I lead architects across multiple business verticals, sit as a quorum member on the Architecture Review Board, where significant platform decisions are challenged and agreed collectively, and serve as Chief Architect for the Enterprise Data Platform's multi-cloud resiliency design.",
      "That design spans AWS and Microsoft Azure on a shared Apache Iceberg and Confluent Kafka foundation, with one governance and identity model applied consistently across both clouds. I've also defined a shared logging and security monitoring reference architecture used by four platform teams, and built benchmarking frameworks that ground cross-cloud platform decisions in evidence rather than opinion.",
      'The part people get wrong is assuming resilience means replication. It does not. Data residency decides first, and then the question is which of three moves applies: replicate it, relocate it, or federate to it. Copying everything everywhere is the expensive default, not the architecture.',
      'Three principles sit underneath that choice. Data stays near the compute that uses it. We align strongly to native integrations rather than maintaining connectors of our own. And where data should not move at all, we virtualise it through federation and send the query to the data instead.',
    ],
    pullQuote:
      'Replicate, relocate, or federate. Residency decides which — copying everything everywhere is the expensive default, not the architecture.',
    metrics: [
      { value: '4', label: 'Platform teams on one logging reference architecture' },
      { value: '2 clouds', label: 'One governance and identity model' },
    ],
    tech: [
      'AWS',
      'Microsoft Azure',
      'Apache Iceberg',
      'Confluent Kafka',
      'Architecture Review Board',
      'Reference Architecture',
      'Benchmarking',
      'Data Federation',
      'Data Residency',
    ],
    media: ['replicate-relocate-federate', 'cross-cloud-failover', 'active-active'],
    evidence: [
      { type: 'essay', slug: 'voronoi-iii' },
      { type: 'repo', slug: 'stratum-tpch' },
    ],
  },

  {
    id: 'whats-next',
    n: '08',
    era: 'Next',
    org: null,
    role: 'Spec-driven delivery · agentic engineering',
    title: "Where I'm heading next",
    narrative: [
      "The next shift in platform engineering is from writing code to writing specifications that people and AI agents can both act on. I'm working on this in two areas.",
    ],
    tracks: [
      {
        name: 'Spec-driven delivery',
        body: 'I structure platforms so that tables, data contracts, access policies and infrastructure are declared as versioned specifications in Git, and I design AI-assisted engineering workflows that generate, test and review against those specifications.',
      },
      {
        name: 'Agentic engineering',
        body: "I've built a custom MCP server that helps engineers generate standards-aligned Fabric code, and I design how AI coding agents work safely across multi-repository estates.",
      },
      {
        name: 'Operational agents',
        body: 'Conversational analytics answers the question; operational agents close the loop. The next generation is started by an event rather than by a person — a threshold breached, a case ageing past its service level, a data quality rule failing on a critical data element. The agent investigates across governed sources, assembles the evidence and drafts the recommended action. A human is brought in at the point of decision, with the working shown, and once approved the action executes in the system of record and the audit trail is written automatically.',
      },
    ],
    coda: 'Alongside this, I build open-source tooling, including Iceberg Catalog Sync for cross-cloud table portability, a RAG-based conversational data dictionary and a lineage knowledge graph that can be queried in natural language. I share my thinking on platform design through the Voronoi Platform Architecture framework, published here as a blog series.',
    pullQuote:
      'From writing code to writing specifications that people and AI agents can both act on.',
    tech: [
      'Spec-Driven Delivery',
      'Data Contracts',
      'MCP',
      'AI Coding Agents',
      'RAG',
      'Neo4j',
      'OpenLineage',
    ],
    media: 'lineage-graph',
    evidence: [
      { type: 'repo', slug: 'data-product-platform' },
      { type: 'repo', slug: 'stratum-tpch' },
      { type: 'repo', slug: 'fabric-mcp-dev' },
      { type: 'repo', slug: 'conversational-data-dictionary' },
    ],
  },
]

/* ============================================================
   The architecture that came out of it.

   Eight layers, each forced by a constraint the previous layer
   alone could not solve. Moved here from the Home page, where
   it sat as ~90 lines of inline-styled JSX — and where the
   heading said "Seven" while listing eight.
   ============================================================ */

export const architectureLayers = [
  {
    n: '01',
    title: 'The constraint',
    body: '5% of data must remain on-premises by regulatory obligation. That boundary became the forcing function: hybrid architecture, data sovereignty, and the DORA concentration risk framework now governing UK and EU financial entities.',
    evidence: [{ type: 'essay', slug: 'voronoi-iii' }],
  },
  {
    n: '02',
    title: 'Build Once, Run Anywhere',
    body: 'The same ETL logic executing without modification on AWS Glue, Microsoft Fabric, and local Spark. Platform isolation via a factory pattern, no rewrites across clouds. Apache Iceberg as the portability primitive across all three.',
    evidence: [
      { type: 'essay', slug: 'voronoi-ii' },
      { type: 'repo', slug: 'multicloud-pipeline' },
    ],
  },
  {
    n: '03',
    title: 'Open table formats and catalog',
    body: 'Apache Iceberg gives ACID semantics, schema evolution, and time-travel across any engine. Apache Polaris provides the vendor-neutral REST Catalog: one endpoint, all engines. Iceberg Catalog Sync implements OPA-governed metadata replication with column-level security and JWT auth.',
    evidence: [
      { type: 'essay', slug: 'voronoi-ii' },
      { type: 'repo', slug: 'catalog-sync' },
    ],
  },
  {
    n: '04',
    title: 'Platform trade-offs',
    body: 'Microsoft Fabric unifies compute and storage into one capacity model. Databricks keeps the lakehouse open and engine-agnostic. Neither is universally correct. The choice depends on what the organisation needs to prove to regulators, auditors, and vendors.',
    evidence: [
      { type: 'essay', slug: 'architects' },
      { type: 'essay', slug: 'fabric' },
    ],
  },
  {
    n: '05',
    title: 'Marketplace',
    body: 'Portability without discoverability is incomplete. Data mesh gave the federated ownership model; the marketplace gave it a contractual interface. Data products are schema-defined, SLA-governed, and independently consumable. The Data Product Platform implements this as a JSON Schema marketplace with three-layer validation.',
    evidence: [
      { type: 'essay', slug: 'voronoi' },
      { type: 'repo', slug: 'data-product-platform' },
    ],
  },
  {
    n: '06',
    title: 'Lineage and provenance',
    body: 'A marketplace without provenance is a catalogue of unverified assertions. Every pipeline emits column-level provenance via OpenLineage to a Neo4j knowledge graph. A five-hop Cypher traversal answers what breaks if a column changes, in milliseconds. Text2Cypher means a CFO can ask that in plain English.',
    evidence: [
      { type: 'essay', slug: 'lineage' },
      { type: 'repo', slug: 'stratum-tpch' },
    ],
  },
  {
    n: '07',
    title: 'Governance as equilibrium',
    body: 'The Voronoi stability model: six forces balancing each other across clouds and jurisdictions. When any one expands without the others, the platform deforms. OPA as the neutral policy engine: one set of Rego rules, one audit log, regardless of which cloud enforced it.',
    evidence: [
      { type: 'essay', slug: 'voronoi' },
      { type: 'repo', slug: 'catalog-sync' },
    ],
  },
  {
    n: '08',
    title: 'Multi-cloud resiliency and concentration risk',
    body: 'Enterprise organisations face a regulatory imperative — DORA, PRA SS2/21, BCBS 239 — to demonstrate that critical workloads are not fatally dependent on a single cloud provider. The architecture that answers this is not three clouds with data in each. It is a Resilience Category framework (RTO/RPO per workload), a governed replication tier, a neutral private network spine, and a failover state machine that produces a supervisory audit artefact every time it runs.',
    evidence: [{ type: 'essay', slug: 'voronoi-iii' }],
  },
]
