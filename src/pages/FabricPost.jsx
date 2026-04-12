import { useEffect } from "react";

const post = {
  title: "Building a Full Microsoft Fabric Platform",
  subtitle: "Zero human admin, CSO-governed provisioning, Purview protection policies, and data contract APIs — turning Fabric from a UI layer into an enterprise-grade governed platform.",
  author: "Sravan Vadaga",
  readTime: "12 min read",
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

function SubSection({ title, children }) {
  return (
    <div style={{ marginBottom: "2rem" }}>
      <h3 style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "0.75rem",
        fontWeight: 500,
        color: "#c87941",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        marginBottom: "1rem",
        marginTop: 0,
      }}>
        {title}
      </h3>
      {children}
    </div>
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

function PhaseBlock({ phases }) {
  return (
    <div style={{ margin: "2rem 0" }}>
      {phases.map(({ phase, label, mandatory, text }, i) => (
        <div key={i} style={{
          display: "grid",
          gridTemplateColumns: "120px 1fr",
          gap: "1rem",
          borderBottom: "1px solid #1a1a1a",
          padding: "1.25rem 0",
          alignItems: "start",
        }}>
          <div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.65rem",
              color: "#c87941",
              letterSpacing: "0.08em",
              marginBottom: 4,
            }}>
              {phase}
            </div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.6rem",
              color: mandatory ? "#8aab7a" : "#4a4035",
              letterSpacing: "0.05em",
            }}>
              {mandatory ? "MANDATORY" : "OPTIONAL"}
            </div>
          </div>
          <div>
            <div style={{
              fontFamily: "'Lora', Georgia, serif",
              fontSize: "0.92rem",
              color: "#c8bfb0",
              fontWeight: 600,
              marginBottom: 6,
            }}>
              {label}
            </div>
            <div style={{
              fontFamily: "'Lora', Georgia, serif",
              fontSize: "0.88rem",
              color: "#8a7a65",
              lineHeight: 1.7,
            }}>
              {text}
            </div>
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
              Platform Engineering · Architecture Assessment
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

        <Section id="problem" title="The Problem with Fabric Deployments">
          <P>
            Most organisations treat Microsoft Fabric as a UI layer. A team gets access, creates a workspace,
            and starts loading data. Within weeks there are dozens of workspaces with inconsistent naming,
            no lineage, no quality contracts, and audit trails that satisfy no one. The platform team inherits
            the debt and is asked to retrofit governance onto a system designed without it.
          </P>
          <P>
            The deeper problem is structural. In Fabric, workspace Admin, Member, and Contributor roles
            bypass all OneLake security enforcement. These roles receive automatic Write permissions to
            OneLake, overriding any data access roles. Any human holding these roles has full, unrestricted
            read and write access to all data in the workspace — including data accessed via ADLS shortcuts.
            The traditional approach of assigning a Platform Admin as Workspace Admin creates an irreconcilable
            conflict between infrastructure provisioning responsibility and data access governance.
          </P>

          <PullQuote>
            Governance retrofitted is governance resisted. The only governance that works at enterprise scale
            is governance enforced before the first workspace is created.
          </PullQuote>

          <P>
            This article documents the architecture patterns for a production-grade Fabric platform built on
            four critical principles: zero human platform admin, Purview protection policies as a first-class
            enforcement layer, CSO-governed provisioning, and data contract policies for versioned access control.
          </P>
        </Section>

        <Section id="operating-model" title="Three-Team Operating Model">
          <P>
            A mature Fabric platform is not a single team's responsibility — it is a governed operating model
            across three distinct planes, each with clear ownership boundaries.
          </P>

          <BulletList items={[
            {
              label: "Data Platform Engineering (Control Plane Owner):",
              text: "Designs the data architecture, defines guardrails, governance standards, and security baselines. Owns the provisioning service principal (SPN-EDP-Provisioner) that executes workspace creation and security baseline configuration via Fabric REST API. Critically — does not hold Admin, Member, or Contributor roles on data product workspaces and does not own ADLS storage accounts or Azure network resources.",
            },
            {
              label: "GTIS — Global Technology Infrastructure Services (Infrastructure Enabler):",
              text: "Owns and operates the central Hub Firewall through which all connectivity between Fabric and Azure services routes. Manages the Hub Firewall allow list governing which connections are permitted between Fabric workspaces and ADLS storage accounts. Provisions hub-spoke landing zones, VNet peering, private endpoints, and private DNS zones.",
            },
            {
              label: "Data Application Teams (Data Plane — Business Implementation):",
              text: "Own their ADLS Gen2 storage accounts in their own Azure subscriptions, their Azure Key Vaults, and their CMK encryption keys. Implement data products within Fabric workspaces provisioned by Data Platform Engineering. Define data access requirements through versioned data contract policies submitted to the Self-Service API.",
            },
          ]} />

          <P>
            The boundary is absolute: Data Platform Engineering provisions and governs, but never touches
            data. Data Application Teams own and operate their data products, but within guardrails they
            cannot modify. GTIS controls the network layer independently of both.
          </P>
        </Section>

        <Section id="security" title="Six-Layer Security Architecture">
          <P>
            Security in this architecture is not a perimeter — it is a stack of independent enforcement
            layers, each with its own audit surface and failure mode. The design follows a ceiling, floor,
            override, and kill switch model.
          </P>

          <LayerBlock layers={[
            {
              label: "Layer 1 — Storage Ceiling (ADLS RBAC)",
              text: "Defines maximum data exposure through shortcut credentials. Service principals only — no human access to raw storage. The ADLS RBAC grant to the workspace identity SPN is the absolute ceiling: no Fabric role can grant access to data beyond what the SPN's ADLS RBAC permits.",
            },
            {
              label: "Layer 2 — Network (Hub Firewall Allow List)",
              text: "All traffic between Fabric workspaces and ADLS storage accounts routes through the GTIS-managed central Hub Firewall. Connections to ADLS accounts not on the allow list are dropped at the network layer before reaching storage. No separate ADLS-level firewall is required in this architecture.",
            },
            {
              label: "Layer 3 — Platform Floor (OneLake Security)",
              text: "Defines minimum data visible to Viewer-role consumers. OneLake security enforces row-level and column-level access for Viewer-role users only. Workspace Admins, Members, and Contributors bypass this layer entirely — which is why Layers 4 and 5 exist.",
            },
            {
              label: "Layer 4 — Override (Purview Protection Policies)",
              text: "The only Fabric-native mechanism that overrides workspace Admin, Member, and Contributor data access. Protection policies enforce access control based on sensitivity labels regardless of workspace role. A Workspace Admin not in the protection policy's allowed group receives No Access on the labelled item.",
            },
            {
              label: "Layer 5 — Provisioning Gate (CSO-Governed Pipeline)",
              text: "All workspace provisioning, ADLS connection creation, and OneLake role assignment passes through a mandatory CSO approval workflow. No human can create connections to unapproved ADLS endpoints. The provisioning SPN executes all infrastructure operations with no interactive login capability.",
            },
            {
              label: "Layer 6 — Kill Switch (CMK Revocation)",
              text: "Customer-managed key revocation by the Data Application Team makes the workspace's data cryptographically inaccessible regardless of any other access grant. This is the nuclear option — controlled entirely by the data owner, not the platform team.",
            },
          ]} />
        </Section>

        <Section id="zero-human-admin" title="Zero Human Platform Admin">
          <P>
            The zero human platform admin pattern resolves the fundamental conflict in Fabric's access model.
            No human from Data Platform Engineering holds Admin, Member, or Contributor roles on data product
            workspaces. All provisioning operations — workspace creation, shortcut creation, OneLake security
            role provisioning, and sensitivity label application — are executed by <Keyword>SPN-EDP-Provisioner</Keyword> via
            the Fabric REST API.
          </P>
          <P>
            This SPN has no interactive login capability. Its ADLS RBAC is scoped to Storage Blob Data Reader
            on specific containers in the Data Application Team's storage accounts — the minimum necessary to
            create shortcuts. Post-handover, outbound access protection is enabled with all connections blocked
            by default. Only ADLS endpoints pre-approved through the CSO workflow are added as exceptions.
          </P>

          <PullQuote>
            The Data Application Team Lead holds Admin and can see all data in their workspace. This is
            intentional — data mesh domain ownership requires the domain team to have full authority over
            their own data products.
          </PullQuote>

          <P>
            The provisioning SPN optionally retains Admin for ongoing infrastructure operations, but
            this is a service principal — not a human. Tenant settings restrict connection creation to
            approved security groups, preventing ad-hoc connections outside the governed workflow.
          </P>
        </Section>

        <Section id="provisioning" title="CSO-Governed Provisioning Pipeline">
          <P>
            Every workspace passes through a mandatory multi-phase pipeline before any human receives access.
            ADLS connectivity and data contract policies are decoupled as optional phases triggered by separate
            approval workflows — a workspace can be live and governed before it connects to any storage.
          </P>

          <PhaseBlock phases={[
            {
              phase: "Phase 1",
              label: "Request and CSO Approval",
              mandatory: true,
              text: "The Data Application Team submits an onboarding request: domain name, data classification tier, Entra security groups, and the sensitivity label to apply. The team creates and owns their Azure Key Vault and KEK, providing the Key Vault resource ID and Key URI. ADLS targets are not required at this stage. The CSO reviews and approves, triggering the automated pipeline.",
            },
            {
              phase: "Phase 2",
              label: "Workspace Provisioning",
              mandatory: true,
              text: "SPN-EDP-Provisioner creates the workspace via REST API, assigns it to the approved Fabric capacity, enables outbound access protection with all connections blocked by default, enables workspace IP firewall rules restricted to approved CIDRs, enables OneLake diagnostics with WORM immutability, and creates the lakehouse. No external data connections exist at this point.",
            },
            {
              phase: "Phase 3",
              label: "Security Baseline",
              mandatory: true,
              text: "SPN-EDP-Provisioner enables OneLake security on the lakehouse, deletes the DefaultReader role to enforce deny-by-default, creates a baseline OneLake security role with the consumer AD group as members but no table grants, and applies the sensitivity label. The corresponding Purview protection policy activates automatically.",
            },
            {
              phase: "Phase 4",
              label: "CMK Enablement",
              mandatory: true,
              text: "The pipeline grants the Fabric Platform CMK app the Key Vault Crypto Service Encryption User role on the Data Application Team's Key Vault, scoped to the specific KEK. The Data Application Team Lead enables CMK in Workspace Settings using their Key URI. The pipeline monitors encryption status and blocks handover until CMK is confirmed active.",
            },
            {
              phase: "Phase 5",
              label: "Role Assignment and Handover",
              mandatory: true,
              text: "The SPN assigns Team Lead as Admin, Engineers as Member, and Consumers as Viewer using CSO-approved AD groups. After handover, the workspace is live within governed guardrails: no unapproved ADLS connections can be created and Purview protection policies restrict access to approved groups.",
            },
            {
              phase: "Phase 5A",
              label: "ADLS Connection Onboarding",
              mandatory: false,
              text: "Triggered when the Data Application Team needs to connect their ADLS Gen2 storage account. Two-stage approval: the Data Owner approves (confirming data appropriateness) and the CSO approves (confirming governance alignment). Both approvals trigger GTIS Hub Firewall updates, cross-subscription RBAC assignment, and shortcut creation by SPN-EDP-Provisioner.",
            },
            {
              phase: "Phase 6",
              label: "Data Contract Policies",
              mandatory: false,
              text: "The Data Application Team defines consumer access through versioned data contract policies specifying table grants, RLS predicates, and CLS column exclusions per consumer AD group. Contracts are submitted to the Self-Service API, validated against CSO-approved patterns, and applied by SPN-EDP-Provisioner via the Fabric OneLake Data Access Security API. Contracts are immutable once applied — updates create a new version.",
            },
          ]} />
        </Section>

        <Section id="purview" title="Purview Protection Policies">
          <P>
            Purview protection policies are the architecture's most critical control — and the least
            understood. They are the only Fabric-native mechanism that overrides workspace Admin, Member,
            and Contributor data access. While OneLake security only applies to Viewer-role users, protection
            policies enforce access control based on sensitivity labels regardless of workspace role.
          </P>

          <SubSection title="Default-Deny Model">
            <P>
              Each protection policy operates on a default-deny model. The policy specifies which users and
              groups retain access. Everyone not specified is blocked. Two access tiers exist: read access
              retained for read-only consumers, and full control retained for data product owners. Users not
              in either tier have all permissions revoked — including permissions derived from their workspace role.
            </P>
          </SubSection>

          <SubSection title="Critical Implementation Detail">
            <P>
              The workspace identity SPN must be included in the protection policy's allowed group via an
              Entra security group. If omitted, ADLS shortcuts cease to function on the labelled item.
              Service principals cannot be added directly to the policy — only via group membership.
              Missing this step silently breaks data access for all workspace users.
            </P>
          </SubSection>
        </Section>

        <Section id="data-contracts" title="Data Contract Policies">
          <P>
            Data contract policies bring versioned, governed access control to OneLake security roles.
            Rather than ad-hoc role assignments, consumer access is defined in a structured contract
            submitted through a Self-Service API — validated, CSO-approved, and immutably recorded.
          </P>

          <BulletList items={[
            {
              label: "Contract structure:",
              text: "Each contract includes a version number, the target lakehouse identifier, an effective date, and one or more role definitions. Each role specifies permission type, member AD groups, table paths, RLS filter predicates, CLS column exclusions, and folder grants.",
            },
            {
              label: "Validation rules:",
              text: "The caller must be in the product owners group. RLS predicates must match CSO-approved patterns. CLS column exclusions must be within allowed scope. No role definition can grant access broader than the ADLS RBAC ceiling. Violations are rejected and the CSO is alerted.",
            },
            {
              label: "Immutable audit trail:",
              text: "Contracts are immutable once applied. Updates create a new version tagged as active in the registry. All changes are logged in WORM-immutable OneLake diagnostics — providing a complete, tamper-proof access history for regulators and auditors.",
            },
          ]} />
        </Section>

        <Section id="adls-auth" title="ADLS Shortcut Authentication — A Common Misconception">
          <P>
            ADLS shortcuts use a delegated authorisation model regardless of authentication kind.
            The credential specified at shortcut creation is used for all subsequent access by all users.
            Selecting <Keyword>Organisational Account</Keyword> does not provide per-user identity passthrough
            to ADLS — a point widely misunderstood in Fabric implementations.
          </P>
          <P>
            This architecture mandates <Keyword>Workspace Identity</Keyword> for all production ADLS shortcuts.
            Connections are created by SPN-EDP-Provisioner during Phase 5A. The Data Application Team grants
            the workspace identity SPN Storage Blob Data Reader (or Contributor for ingestion workspaces) RBAC
            on their own storage account — a cross-subscription assignment that keeps data ownership
            with the business domain.
          </P>
          <P>
            User Identity Mode is a separate concept applying to the SQL Analytics Endpoint for OneLake
            security evaluation — it does not affect ADLS authentication. These two concerns must not be conflated.
          </P>
        </Section>

        <Section id="why" title="Why the Architecture Holds">
          <P>
            Each layer of this architecture produces independent audit logs. ADLS storage logs capture SPN
            read operations. OneLake diagnostics capture shortcut traversal events in WORM storage. Purview
            captures sensitivity label enforcement. The CSO approval workflow captures every provisioning
            decision with a named approver and timestamp.
          </P>
          <P>
            The separation of duties is total: Data Platform Engineering provisions but cannot read data.
            Data Application Teams own their data but cannot modify governance guardrails. GTIS controls
            network connectivity independently of both. No single team can unilaterally bypass the model.
          </P>
          <P>
            When provisioning is fully automated and governance is structurally enforced, the platform team
            stops being a bottleneck and becomes infrastructure. Auditors get tamper-proof trails. Risk teams
            get cryptographic kill switches. Domain teams get self-service provisioning within guardrails they
            cannot circumvent. That is what turns a technology stack into a trusted enterprise platform.
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
          {["Microsoft Fabric", "ADLS Gen2", "OneLake", "Purview", "Zero Trust", "Data Mesh", "CMK", "Governance", "Platform Engineering"].map(tag => (
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
