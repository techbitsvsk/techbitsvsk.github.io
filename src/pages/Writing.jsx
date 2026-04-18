import { Link } from 'react-router-dom'

const essays = [
  {
    path: '/writing/voronoi',
    cat: 'Platform Architecture · Conceptual',
    title: 'The Voronoi Platform Architecture',
    subtitle: 'Equilibrium for Enterprise Data',
    excerpt:
      'The geometry of enterprise data platforms is not accidental — it is governed by competing forces. Six forces: sovereignty, intelligence, marketplace, observability, governance, and security. When balanced, the platform is stable. When one dominates, it deforms.',
  },
  {
    path: '/writing/architects',
    cat: 'Comparative Architecture · Narrative',
    title: 'The Architects of Insight',
    subtitle: 'A Tale of Data Kingdoms',
    excerpt:
      "A metaphorical exploration comparing Microsoft Fabric\u2019s unified approach with Databricks\u2019 open lakehouse. Two master architects, two philosophies, and kingdoms that must choose which vision fits their character.",
  },
  {
    path: '/writing/fabric',
    cat: 'Platform Engineering · Practical',
    title: 'Building a Full Microsoft Fabric Platform',
    subtitle: 'Governance, provisioning, and observability at enterprise scale',
    excerpt:
      'Many organisations treat Fabric as a UI layer. The result is workspaces without policy, data products that are hard to discover, and compliance that satisfies no one. Here is how to do it right — before the first workspace is created.',
  },
  {
    path: '/writing/lineage',
    cat: 'Data Platform · Knowledge Graph',
    title: 'The Lineage-First Data Platform',
    subtitle: 'Column provenance, semantic search, and graph traversal at enterprise scale',
    excerpt:
      'Hundreds of data products. Dozens of Lines of Business. One audit question that takes three weeks to answer. Here is the architecture — OpenLineage, Neo4j, and Text2Cypher — that makes it take three seconds, and why treating lineage as a graph problem changes everything for business users, auditors, and platform engineers.',
  },
]

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
