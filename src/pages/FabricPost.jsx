import { Link } from 'react-router-dom'
import BlogSidebar from '../components/BlogSidebar'
import { useTocHighlight } from '../hooks/useTocHighlight'

const toc = [
  { id: 'problem',    title: 'The problem',                level: 2 },
  { id: 'governance', title: 'Platform governance',        level: 2 },
  { id: 'automation', title: 'Automation & observability', level: 2 },
  { id: 'security',   title: 'Security model',             level: 2 },
  { id: 'why',        title: 'Why it matters',             level: 2 },
]

export default function FabricPost() {
  useTocHighlight()

  return (
    <div className="blog-layout">
      <BlogSidebar toc={toc} />

      <article className="blog-content">
        <div className="blog-meta">
          <span className="blog-cat">Platform Engineering</span>
          <span style={{ color: 'var(--border)', fontSize: '0.8rem' }}>·</span>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-light)' }}>Practical</span>
        </div>

        <h1>Building a Full Microsoft Fabric Platform</h1>
        <p className="blog-subtitle">
          Governance, provisioning, data marketplace thinking, and enterprise observability — turning Fabric
          from a UI layer into a trusted platform.
        </p>

        <h2 id="problem">The problem</h2>

        <p>
          Many organisations treat Fabric as a UI layer rather than the foundation of a governed platform.
          The result is workspaces that spin up without policy, data products that are hard to discover,
          and compliance that is incomplete across the lakehouse estate.
        </p>

        <p>
          The pattern is predictable: a team gets access to Fabric, creates a workspace, and starts loading
          data. Within weeks there are thirty workspaces with inconsistent naming, no lineage, no quality
          contracts, and audit trails that satisfy no one. The platform team inherits the debt and is asked
          to retrofit governance onto a system designed without it.
        </p>

        <blockquote>
          <p>
            Governance retrofitted is governance resisted. The only governance that works at enterprise scale
            is governance that is enforced before the first workspace is created.
          </p>
        </blockquote>

        <h2 id="governance">Platform governance</h2>

        <p>
          A robust Fabric platform enforces policies before a workspace exists. Identity, storage, and
          classification must be wired together so every workspace is provisioned with the same guardrails.
        </p>

        <ul>
          <li>
            <strong>ADLS Gen2 RBAC and OneLake protection policies</strong> are the first line of control — not the last.
            Storage permissions define what the platform can do; OneLake policies define what users within the platform can do.
          </li>
          <li>
            <strong>Purview classification and data lineage</strong> must be attached to every published data product.
            A data product without lineage is not a product — it is an undocumented asset.
          </li>
          <li>
            <strong>Zero-human-admin provisioning</strong> ensures teams can move fast without drifting outside policy.
            Service principal automation removes the human as a single point of failure and as a governance bypass.
          </li>
          <li>
            <strong>CMK revocation</strong> as a kill-switch — not an afterthought. When a workspace needs to be
            decommissioned, revocation of the customer-managed key is the authoritative mechanism.
          </li>
        </ul>

        <h2 id="automation">Automation and observability</h2>

        <p>
          Automation is the platform's operating system. A self-service Fabric platform needs workspace
          provisioners, catalog sync jobs, and continuous observability across clusters, pipelines, and AI workloads.
        </p>

        <ul>
          <li>
            <strong>Workspace provisioning pipelines</strong> enforce naming, capacity assignment, networking constraints,
            and security rules in a single idempotent operation. The provisioner is the contract between the platform
            team and the domain teams.
          </li>
          <li>
            <strong>DataHub or Purview-based metadata automation</strong> ensures catalog consistency and lineage.
            Every pipeline run is an event. Every event is a lineage node. Every node is queryable.
          </li>
          <li>
            <strong>Observability dashboards</strong> capture pipeline health, query performance, and model telemetry.
            OneLake as the central Delta store for telemetry, with Microsoft Sentinel as CSO SIEM, provides
            a unified audit surface for both engineering and compliance.
          </li>
        </ul>

        <h2 id="security">Security model</h2>

        <p>
          The security architecture for a mature Fabric platform is a multi-layer model, not a perimeter:
        </p>

        <ul>
          <li>
            <strong>Layer 1 — Storage (ADLS RBAC):</strong> Who can read or write the physical storage.
            Service principals only. No human access to raw storage.
          </li>
          <li>
            <strong>Layer 2 — Platform (OneLake security):</strong> Which workspace can access which lakehouse.
            Enforced through Fabric's own access model.
          </li>
          <li>
            <strong>Layer 3 — Data (Purview protection policies):</strong> Which data products are accessible
            to which consumers. Row-level and column-level security applied at the product layer.
          </li>
          <li>
            <strong>Layer 4 — Keys (CMK revocation):</strong> The nuclear option. Revocation of the customer-managed
            key makes the workspace's data cryptographically inaccessible, regardless of any other access grant.
          </li>
        </ul>

        <h2 id="why">Why it matters</h2>

        <p>
          Packed with governance and automation, a Fabric platform can support both analytic speed and
          enterprise control. That balance is what turns a technology stack into a trusted platform for
          business users, auditors, and risk teams.
        </p>

        <p>
          The platform team's job is not to own the data — it is to make the guardrails invisible to
          teams moving fast, and impenetrable to everyone else. When provisioning is self-service and
          governance is automatic, the platform team stops being a bottleneck and starts being infrastructure.
        </p>

        <div className="blog-related">
          <h4>Continue Reading</h4>
          <div className="blog-related-links">
            <Link to="/writing/voronoi">The Voronoi Platform Architecture: Equilibrium for Enterprise Data</Link>
            <Link to="/writing/architects">The Architects of Insight: A Tale of Data Kingdoms</Link>
          </div>
        </div>
      </article>
    </div>
  )
}
