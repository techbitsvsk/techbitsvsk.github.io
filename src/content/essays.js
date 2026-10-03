/* ============================================================
   Essays — single source for the Writing index, the Home
   feature strip, the About page cross-references, the ⌘K
   palette, and the generated sitemap.

   Previously duplicated across Home.jsx and Writing.jsx, with
   the two copies already disagreeing on category separators.
   ============================================================ */

export const essays = [
  {
    slug: 'voronoi-iii',
    path: '/writing/voronoi-iii',
    cat: 'Platform Architecture · Multi-Cloud',
    series: { name: 'Voronoi', part: 'III' },
    title: 'When One Cloud Is Not Enough',
    subtitle: 'Honest architecture for moving data between AWS, GCP, and Microsoft Fabric',
    excerpt:
      'Multi-region answers most resilience questions. Five cases demand more: control plane failures, DORA concentration risk, platform strength mismatch, inherited estate, and jurisdictional sovereignty. Part III covers when multi-cloud earns its place — and how to do it privately, governed, and with complete provenance.',
    short:
      'Five cases where multi-region is not enough: control plane failures, DORA concentration risk, platform mismatch, inherited estate, and jurisdictional sovereignty.',
    ogImage: '/assets/voronoi_part3_linkedin.png',
    featured: true,
  },
  {
    slug: 'voronoi-ii',
    path: '/writing/voronoi-ii',
    cat: 'Platform Architecture · Multi-Cloud',
    series: { name: 'Voronoi', part: 'II' },
    title: 'The Physical and Catalog Planes',
    subtitle: 'Apache Iceberg, federated catalogs, and enterprise cloud economics',
    excerpt:
      'Where is the truth, and can every engine find it? Part II of the Voronoi series covers Apache Iceberg as the open table format, the Polaris REST Catalog as the vendor-neutral discovery layer, workload placement across AWS, Azure, and GCP, and how open formats become genuine negotiating leverage in cloud renewals.',
    short:
      'Apache Iceberg as the open table format, Polaris as the vendor-neutral catalog, and why open formats are genuine negotiating leverage in cloud renewals.',
    featured: true,
  },
  {
    slug: 'voronoi',
    path: '/writing/voronoi',
    cat: 'Platform Architecture · Conceptual',
    series: { name: 'Voronoi', part: 'I' },
    title: 'The Voronoi Platform Architecture',
    subtitle: 'Equilibrium for Enterprise Data',
    excerpt:
      'The geometry of enterprise data platforms is not accidental — it is governed by competing forces. Six forces: sovereignty, intelligence, marketplace, observability, governance, and security. When balanced, the platform is stable. When one dominates, it deforms.',
    short:
      'Six competing forces — sovereignty, intelligence, marketplace, observability, governance, security. Balanced, the platform is stable. Unbalanced, it deforms.',
    featured: false,
  },
  {
    slug: 'lineage',
    path: '/writing/lineage',
    cat: 'Data Platform · Knowledge Graph',
    series: null,
    title: 'The Lineage-First Data Platform',
    subtitle: 'Column provenance, semantic search, and graph traversal at enterprise scale',
    excerpt:
      'Hundreds of data products. Dozens of Lines of Business. One audit question that takes three weeks to answer. Here is the architecture — OpenLineage, Neo4j, and Text2Cypher — that makes it take three seconds, and why treating lineage as a graph problem changes everything for business users, auditors, and platform engineers.',
    short:
      'One audit question that takes three weeks to answer. Here is the architecture — OpenLineage, Neo4j, and Text2Cypher — that makes it take three seconds.',
    featured: true,
  },
  {
    slug: 'fabric',
    path: '/writing/fabric',
    cat: 'Platform Engineering · Practical',
    series: null,
    title: 'Building a Full Microsoft Fabric Platform',
    subtitle: 'Governance, provisioning, and observability at enterprise scale',
    excerpt:
      'Many organisations treat Fabric as a UI layer. The result is workspaces without policy, data products that are hard to discover, and compliance that satisfies no one. Here is how to do it right — before the first workspace is created.',
    short:
      'Many organisations treat Fabric as a UI layer. Here is how to do it right — before the first workspace is created.',
    featured: false,
  },
  {
    slug: 'architects',
    path: '/writing/architects',
    cat: 'Comparative Architecture · Narrative',
    series: null,
    title: 'The Architects of Insight',
    subtitle: 'A Tale of Data Kingdoms',
    excerpt:
      'A metaphorical exploration comparing Microsoft Fabric’s unified approach with Databricks’ open lakehouse. Two master architects, two philosophies, and kingdoms that must choose which vision fits their character.',
    short:
      'Microsoft Fabric’s unified approach against Databricks’ open lakehouse, told as a tale of two kingdoms.',
    featured: false,
  },
]

/** Lookup by slug — used by About page cross-references. */
export const essayBySlug = Object.fromEntries(essays.map(e => [e.slug, e]))

/** Home page feature strip. */
export const featuredEssays = essays.filter(e => e.featured)
