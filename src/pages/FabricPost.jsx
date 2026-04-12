import { useEffect } from "react";

const post = {
  title: "Building a Full Microsoft Fabric Platform",
  subtitle: "Governance, provisioning, data marketplace thinking, and enterprise observability — turning Fabric from a UI layer into a trusted platform.",
  author: "Sravan Vadaga",
  readTime: "8 min read",
  date: "April 2026",
};

function PullQuote({ children }) {
  return (
    <div style={{
      borderLeft: "3px solid #8aab7a",
      margin: "2.5rem 0",
      padding: "1rem 1.5rem",
      background: "linear-gradient(90deg, #8aab7a08 0%, transparent 100%)",
    }}>
      <p style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: "1.2rem",
        fontStyle: "italic",
        color: "#e8d5b0",
        lineHeight: 1.6,
        margin: 0,
      }}>
        {children}
      </p>
    </div>
  );
}

function Section({ id, title, children }) {
  return (
    <section id={id} style={{ marginBottom: "3rem" }}>
      {title && (
        <h2 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "1.6rem",
          fontWeight: 700,
          color: "#e8d5b0",
          marginBottom: "1.25rem",
          marginTop: 0,
          letterSpacing: "-0.02em",
        }}>
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

function P({ children, style = {} }) {
  return (
    <p style={{
      fontFamily: "'Lora', Georgia, serif",
      fontSize: "1.05rem",
      lineHeight: 1.85,
      color: "#c8bfb0",
      marginTop: 0,
      marginBottom: "1.25rem",
      ...style,
    }}>
      {children}
    </p>
  );
}

function Keyword({ children }) {
  return <strong style={{ color: "#e8d5b0" }}>{children}</strong>;
}

function BulletList({ items }) {
  return (
    <ul style={{ paddingLeft: 0, listStyle: "none", margin: "1rem 0 1.5rem" }}>
      {items.map(({ label, text }, i) => (
        <li key={i} style={{
          borderLeft: "2px solid #8aab7a44",
          paddingLeft: "1.25rem",
          marginBottom: "1rem",
          fontFamily: "'Lora', Georgia, serif",
          fontSize: "0.98rem",
          lineHeight: 1.75,
          color: "#8a7a65",
        }}>
          {label && <strong style={{ color: "#c8bfb0" }}>{label} </strong>}
          {text}
        </li>
      ))}
    </ul>
  );
}

function LayerBlock({ layers }) {
  return (
    <div style={{
      background: "#0d0d0d",
      border: "1px solid #1e1e1e",
      padding: "1.5rem",
      margin: "2rem 0",
    }}>
      {layers.map(({ label, text }, i) => (
        <div key={i} style={{
          borderBottom: i < layers.length - 1 ? "1px solid #1a1a1a" : "none",
          padding: "1rem 0",
        }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.7rem",
            color: "#8aab7a",
            marginBottom: 6,
            letterSpacing: "0.05em",
          }}>
            {label}
          </div>
          <div style={{
            fontFamily: "'Lora', Georgia, serif",
            fontSize: "0.9rem",
            color: "#8a7a65",
            lineHeight: 1.7,
          }}>
            {text}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function FabricPost() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{
      background: "#0a0a0a",
      minHeight: "100vh",
      fontFamily: "'Lora', Georgia, serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Lora:ital,wght@0,400;0,500;1,400&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #8aab7a; }
      `}</style>

      {/* Hero */}
      <div style={{
        position: "relative",
        padding: "5rem 2rem 4rem",
        borderBottom: "1px solid #1e1e1e",
        overflow: "hidden",
      }}>
        {/* Background grid pattern */}
        <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0.03, pointerEvents: "none" }}
          viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
          {Array.from({ length: 8 }, (_, col) =>
            Array.from({ length: 4 }, (_, row) => (
              <rect
                key={`${col}-${row}`}
                x={col * 100 + 10} y={row * 100 + 10}
                width={80} height={80}
                fill="none"
                stroke="#8aab7a"
                strokeWidth="1"
              />
            ))
          )}
        </svg>

        <div style={{ maxWidth: 720, margin: "0 auto", position: "relative" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            marginBottom: "1.5rem",
          }}>
            <div style={{ width: 28, height: 1, background: "#8aab7a" }} />
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.7rem",
              color: "#8aab7a",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}>
              Platform Engineering · Practical
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(2rem, 5vw, 3.2rem)",
            fontWeight: 900,
            color: "#f0e6d0",
            lineHeight: 1.15,
            marginBottom: "1rem",
            marginTop: 0,
            letterSpacing: "-0.03em",
          }}>
            {post.title}
          </h1>

          <p style={{
            fontFamily: "'Lora', Georgia, serif",
            fontSize: "1.1rem",
            fontStyle: "italic",
            color: "#8a7a65",
            marginBottom: "2rem",
            lineHeight: 1.6,
          }}>
            {post.subtitle}
          </p>

          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            paddingTop: "1.5rem",
            borderTop: "1px solid #1e1e1e",
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "linear-gradient(135deg, #8aab7a, #4d6b3a)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#0a0a0a", fontWeight: 700, fontSize: 14,
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              SV
            </div>
            <div>
              <div style={{ color: "#c8bfb0", fontSize: "0.85rem", fontFamily: "'JetBrains Mono', monospace" }}>
                {post.author}
              </div>
              <div style={{ color: "#4a4035", fontSize: "0.75rem", fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>
                {post.date} · {post.readTime}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "3rem 2rem 6rem" }}>

        <Section id="problem" title="The Problem">
          <P>
            Many organisations treat Fabric as a UI layer rather than the foundation of a governed platform.
            The result is workspaces that spin up without policy, data products that are hard to discover,
            and compliance that is incomplete across the lakehouse estate.
          </P>
          <P>
            The pattern is predictable: a team gets access to Fabric, creates a workspace, and starts loading
            data. Within weeks there are thirty workspaces with inconsistent naming, no lineage, no quality
            contracts, and audit trails that satisfy no one. The platform team inherits the debt and is asked
            to retrofit governance onto a system designed without it.
          </P>

          <PullQuote>
            Governance retrofitted is governance resisted. The only governance that works at enterprise scale
            is governance that is enforced before the first workspace is created.
          </PullQuote>
        </Section>

        <Section id="governance" title="Platform Governance">
          <P>
            A robust Fabric platform enforces policies before a workspace exists. Identity, storage, and
            classification must be wired together so every workspace is provisioned with the same guardrails.
          </P>

          <BulletList items={[
            {
              label: "ADLS Gen2 RBAC and OneLake protection policies",
              text: "are the first line of control — not the last. Storage permissions define what the platform can do; OneLake policies define what users within the platform can do.",
            },
            {
              label: "Purview classification and data lineage",
              text: "must be attached to every published data product. A data product without lineage is not a product — it is an undocumented asset.",
            },
            {
              label: "Zero-human-admin provisioning",
              text: "ensures teams can move fast without drifting outside policy. Service principal automation removes the human as a single point of failure and as a governance bypass.",
            },
            {
              label: "CMK revocation",
              text: "as a kill-switch — not an afterthought. When a workspace needs to be decommissioned, revocation of the customer-managed key is the authoritative mechanism.",
            },
          ]} />
        </Section>

        <Section id="automation" title="Automation and Observability">
          <P>
            Automation is the platform's operating system. A self-service Fabric platform needs workspace
            provisioners, catalog sync jobs, and continuous observability across clusters, pipelines, and
            AI workloads.
          </P>

          <BulletList items={[
            {
              label: "Workspace provisioning pipelines",
              text: "enforce naming, capacity assignment, networking constraints, and security rules in a single idempotent operation. The provisioner is the contract between the platform team and the domain teams.",
            },
            {
              label: "DataHub or Purview-based metadata automation",
              text: "ensures catalog consistency and lineage. Every pipeline run is an event. Every event is a lineage node. Every node is queryable.",
            },
            {
              label: "Observability dashboards",
              text: "capture pipeline health, query performance, and model telemetry. OneLake as the central Delta store for telemetry, with Microsoft Sentinel as CSO SIEM, provides a unified audit surface for both engineering and compliance.",
            },
          ]} />
        </Section>

        <Section id="security" title="Security Model">
          <P>
            The security architecture for a mature Fabric platform is a multi-layer model, not a perimeter:
          </P>

          <LayerBlock layers={[
            {
              label: "Layer 1 — Storage (ADLS RBAC)",
              text: "Who can read or write the physical storage. Service principals only. No human access to raw storage.",
            },
            {
              label: "Layer 2 — Platform (OneLake security)",
              text: "Which workspace can access which lakehouse. Enforced through Fabric's own access model.",
            },
            {
              label: "Layer 3 — Data (Purview protection policies)",
              text: "Which data products are accessible to which consumers. Row-level and column-level security applied at the product layer.",
            },
            {
              label: "Layer 4 — Keys (CMK revocation)",
              text: "The nuclear option. Revocation of the customer-managed key makes the workspace's data cryptographically inaccessible, regardless of any other access grant.",
            },
          ]} />
        </Section>

        <Section id="why" title="Why It Matters">
          <P>
            Packed with governance and automation, a Fabric platform can support both analytic speed and
            enterprise control. That balance is what turns a technology stack into a trusted platform for
            business users, auditors, and risk teams.
          </P>
          <P>
            The platform team's job is not to own the data — it is to make the guardrails invisible to
            teams moving fast, and impenetrable to everyone else. When provisioning is self-service and
            governance is automatic, the platform team stops being a bottleneck and starts being
            infrastructure.
          </P>
        </Section>

        {/* Tags */}
        <div style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          marginTop: "3rem",
          paddingTop: "2rem",
          borderTop: "1px solid #1a1a1a",
        }}>
          {["Microsoft Fabric", "Platform Engineering", "OneLake", "Purview", "Governance", "Enterprise Architecture"].map(tag => (
            <span key={tag} style={{
              background: "#111",
              border: "1px solid #222",
              color: "#4a4035",
              padding: "4px 10px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.65rem",
              letterSpacing: "0.06em",
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
