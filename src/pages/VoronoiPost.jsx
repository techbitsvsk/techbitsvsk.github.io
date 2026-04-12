import { Link } from 'react-router-dom'
import BlogSidebar from '../components/BlogSidebar'
import { useTocHighlight } from '../hooks/useTocHighlight'

const toc = [
  { id: 'six-forces',      title: 'The six forces',          level: 2 },
  { id: 'sovereignty',     title: 'Physical Sovereignty',     level: 3 },
  { id: 'intelligence',    title: 'Intelligence',             level: 3 },
  { id: 'marketplace',     title: 'Data Marketplace',         level: 3 },
  { id: 'observability',   title: 'Observability',            level: 3 },
  { id: 'governance',      title: 'Governance',               level: 3 },
  { id: 'security',        title: 'Security',                 level: 3 },
  { id: 'principle-120',   title: 'The 120° principle',       level: 2 },
  { id: 'platform-builders', title: 'What it means for builders', level: 2 },
]

export default function VoronoiPost() {
  useTocHighlight()

  return (
    <div className="blog-layout">
      <BlogSidebar toc={toc} />

      <article className="blog-content">
        <div className="blog-meta">
          <span className="blog-cat">Platform Architecture</span>
          <span style={{ color: 'var(--border)', fontSize: '0.8rem' }}>·</span>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-light)' }}>Conceptual</span>
        </div>

        <h1>The Voronoi Platform Architecture</h1>
        <p className="blog-subtitle">Equilibrium for Enterprise Data</p>

        <p>
          The geometry of enterprise data platforms is not accidental. It is governed by competing forces.
          When those forces balance, the architecture is stable. When one force dominates, the platform deforms.
        </p>

        <h2 id="six-forces">The six forces</h2>

        <h3 id="sovereignty">Physical Sovereignty</h3>
        <p>
          Domain-owned storage and compute together is the foundation of product ownership, not just a data lake.
          Sovereignty means each domain team owns its compute boundary — not just a folder in a shared lake,
          but a genuine capacity and storage allocation that cannot be arbitrarily consumed by others.
        </p>

        <h3 id="intelligence">Intelligence</h3>
        <p>
          ML and AI are essential forces, but they must consume through governed data products rather than
          rewrite the platform. When intelligence bypasses the marketplace and reads raw storage directly,
          it becomes an ungoverned force — unpredictable, untraceable, and impossible to audit.
        </p>

        <h3 id="marketplace">Data Marketplace</h3>
        <p>
          A governed exchange layer that makes domain data products discoverable, contracted, and consumable.
          The marketplace is not a catalogue — it is the mechanism through which data earns trust.
          Every product published carries a quality score, a contract, and a lineage chain.
        </p>

        <h3 id="observability">Observability</h3>
        <p>
          Without self-awareness for pipelines, queries, and model inference, trust collapses and failures
          become invisible. Observability is not metrics on a dashboard — it is the platform's ability to
          explain its own behaviour to both engineers and auditors.
        </p>

        <h3 id="governance">Governance</h3>
        <p>
          Provenance, classification, lineage, and accountability are the force that makes data trustworthy.
          Governance is not a process layer bolted onto the side — it is embedded into the act of publishing
          a data product. Every schema change, every access grant, every retention policy is a governance event.
        </p>

        <h3 id="security">Security</h3>
        <p>
          Zero trust is not a layer; it is the physics the architecture operates within. Every service call,
          every data access, every pipeline execution is authenticated, authorised, and logged — regardless
          of whether it originates inside or outside the perimeter.
        </p>

        <h2 id="principle-120">The 120° principle</h2>
        <blockquote>
          <p>
            In nature, adjacent fractures and cells meet at 120° because that is how competing forces
            achieve equilibrium. In enterprise data platforms, the boundaries between governance, security,
            data products, and intelligence must also meet in balance. Any deformation is a signal that
            a force is asserting dominance.
          </p>
        </blockquote>
        <p>
          This is not a metaphoric exercise. It is a practical model for diagnosing why data platforms fail,
          and for designing architectures that are resilient, governable, and ready for AI at scale.
          When an organisation over-invests in intelligence without a marketplace, consumers bypass governance.
          When governance is prioritised without observability, failures are invisible until they become audits.
          When security is applied as a perimeter rather than physics, every integration becomes an exception request.
        </p>

        <h2 id="platform-builders">What it means for platform builders</h2>
        <ul>
          <li>Design systems around domain-owned compute and data products, not just shared lakes.</li>
          <li>Publish data with contracts, quality scores, and discoverability in a marketplace.</li>
          <li>Embed observability into every pipeline and every model output.</li>
          <li>Treat governance and security as coequal forces, not afterthoughts.</li>
          <li>Diagnose deformation before adding new capability — imbalance compounds.</li>
        </ul>

        <div className="blog-related">
          <h4>Continue Reading</h4>
          <div className="blog-related-links">
            <Link to="/writing/architects">The Architects of Insight: A Tale of Data Kingdoms</Link>
            <Link to="/writing/fabric">Building a Full Microsoft Fabric Platform</Link>
          </div>
        </div>
      </article>
    </div>
  )
}
