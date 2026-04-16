import { useState, useEffect } from "react";

// ── shared style constants ────────────────────────────────────────────────────

const prose = {
  fontFamily: "'Lora', Georgia, serif",
  fontSize: "1rem",
  lineHeight: 1.85,
  color: "#c8bfb0",
  marginTop: 0,
  marginBottom: "1.1rem",
};

// ── data ─────────────────────────────────────────────────────────────────────

const forces = [
  { id: 1, angle: 90,   label: "Physical Sovereignty", short: "Storage & Compute", color: "#c87941",
    description: "Each domain owns its storage and compute end-to-end — not just the data, but the engine that processes it. Without this, teams are tenants in someone else's infrastructure, waiting in queues they don't control. This is what DAMA BOK's Data Architecture and Data Storage disciplines protect." },
  { id: 2, angle: 30,   label: "Intelligence",          short: "AI & ML",           color: "#7b9eb8",
    description: "The force that turns data into decisions — predictions, recommendations, generative answers. In data modernisation this is where AI sits. Powerful when governed. Dangerous when models train on unclassified data or produce outputs nobody can audit." },
  { id: 3, angle: -30,  label: "Data Marketplace",      short: "Marketplace",       color: "#8aab7a",
    description: "The exchange layer where data products are published, discovered, and consumed. Data Mesh calls this 'data as a product' — the principle that domain outputs are first-class, governed, contractual assets. Without this force, every data share is a bilateral agreement negotiated by hand." },
  { id: 4, angle: -90,  label: "Observability",         short: "Health",            color: "#b8847b",
    description: "The platform's ability to see itself — pipeline health, query latency, cost signals, AI model drift. DAMA BOK's Data Quality and Metadata Management disciplines live here. Problems that aren't visible aren't fixed until they're catastrophic." },
  { id: 5, angle: -150, label: "Governance",            short: "Policy",            color: "#9b8ab8",
    description: "Every dataset knows its owner, its classification, and its regulatory obligations — enforced as policy, not as a catalogue entry nobody reads. DAMA BOK's Data Governance framework and Data Mesh's federated computational governance both point here." },
  { id: 6, angle: 150,  label: "Security",              short: "Zero Trust",        color: "#b8a87a",
    description: "Identity, access, encryption, audit trail — the conditions under which all other forces operate. When this force dominates, nothing ships. When it's absent, everything is at risk. DAMA BOK's Data Security discipline is the foundation; zero-trust is the modern implementation." },
];

const frameworkAlignment = [
  {
    name: "DAMA BOK",
    sub: "11 data management disciplines",
    color: "#c87941",
    rows: [
      "Data Architecture + Storage → Physical Sovereignty",
      "Data Governance → Governance force",
      "Data Security → Security force",
      "Data Quality + Metadata → Observability",
      "Integration + Interoperability → Marketplace",
      "Data Warehousing + BI → Intelligence",
    ],
  },
  {
    name: "Data Mesh",
    sub: "4 operating principles",
    color: "#7b9eb8",
    rows: [
      "Domain ownership → Physical Sovereignty",
      "Data as a product → Marketplace",
      "Self-serve platform → Automation / Platform Eng",
      "Federated governance → Governance ↔ Security",
    ],
  },
  {
    name: "AI Modernisation",
    sub: "The accelerant that makes balance urgent",
    color: "#8aab7a",
    rows: [
      "Training data quality → stresses Governance",
      "Model lineage → stresses Observability",
      "Inference access control → stresses Security",
      "Model outputs as products → stresses Marketplace",
      "Cross-domain training → stresses Physical Sovereignty",
    ],
  },
];

const deformations = [
  { name: "The Security Fortress", symptom: "Secure and unused",
    shape: [0.5, 0.4, 0.4, 0.5, 0.5, 1.0],
    description: "Provisioning takes months. Every connection needs six approval layers. Teams route around the platform — shadow IT, local extracts, email attachments. Technically secure. Nobody uses it.",
    industry: "Banking · Insurance · Defence", color: "#b8847b" },
  { name: "The Data Swamp", symptom: "Petabytes, no answers",
    shape: [1.0, 0.3, 0.3, 0.2, 0.3, 0.4],
    description: "Central team owns everything, so no domain is accountable. Data products don't exist. Consumers queue for raw tables nobody trusts. Vast storage. No answers.",
    industry: "Enterprise · Data Lake Era 2015–2020", color: "#c87941" },
  { name: "The AI Gold Rush", symptom: "Exciting until the regulator arrives",
    shape: [0.5, 1.0, 0.6, 0.4, 0.2, 0.3],
    description: "GenAI use cases shipped faster than governance responded. Models trained on unclassified data. When the auditor asked who approved the training set, nobody could answer.",
    industry: "Tech · Financial Services · Healthcare", color: "#7b9eb8" },
  { name: "The Vendor Republic", symptom: "Locally rational, globally chaotic",
    shape: [0.6, 0.5, 0.7, 0.4, 0.3, 0.5],
    description: "Finance chose Snowflake. Marketing chose Databricks. Correct in principle — but no shared catalog, no data product contracts, no marketplace. Domain autonomy without platform coherence.",
    industry: "Large Enterprise · Post-Merger", color: "#8aab7a" },
  { name: "The Compliance Theatre", symptom: "Looks governed, isn't",
    shape: [0.5, 0.4, 0.4, 0.4, 0.9, 0.5],
    description: "A catalogue from three years ago. Classification tags that exist in Purview but don't drive access decisions. Governance as decoration, not enforcement.",
    industry: "Regulated Industries · Post-Audit", color: "#9b8ab8" },
];

const orgStructures = [
  {
    name: "Regulated Institution",
    tagline: "Secure. Slow. Shadow IT everywhere.",
    industry: "Banking · Insurance · Defence · Government",
    dominant: "Security dominant",
    shape: [0.5, 0.3, 0.35, 0.65, 0.85, 1.0],
    color: "#b8847b",
    governance: "Formal approval chains, risk-rated change control, BCBS 239 and DORA compliance mandates. Every data movement requires written sign-off before it executes.",
    gap: "Automate policy enforcement at the pipeline layer. Shift approvals from human sign-offs to machine policy checks. The control posture doesn't change — the delivery mechanism does.",
    traits: [
      "Provisioning takes months. Each approval layer is individually fast; in sequence they are lethal.",
      "Shadow IT is rampant — teams build local extracts because the platform is too slow to serve them.",
      "Security is structurally sound. The problem is that nothing can move through it at speed.",
    ],
  },
  {
    name: "Domain-Led Platform",
    tagline: "Autonomy without a shared policy spine.",
    industry: "Tech · Mature Scale-Ups · Post-Data Mesh Adoption",
    dominant: "Physical Sovereignty dominant",
    shape: [0.9, 0.65, 0.85, 0.65, 0.55, 0.5],
    color: "#8aab7a",
    governance: "Federated computational governance — each domain enforces its own policy. Data contracts defined per product. Central catalogue exists but enforcement quality varies by domain maturity.",
    gap: "Federated governance needs a shared policy spine. Individual domain contracts must resolve against a common classification hierarchy or cross-domain audit queries become impossible.",
    traits: [
      "Domains ship fast. Autonomy is real. Policy enforcement quality varies by team maturity.",
      "The marketplace works — but discovering cross-domain lineage requires knowing which domain to ask.",
      "AI use cases emerging without a clear answer to: whose training data classification governs the model?",
    ],
  },
  {
    name: "Centralised Data Team",
    tagline: "Accurate catalogue. Single queue.",
    industry: "Enterprise · Pre-Mesh Era 2015–2022 · Regulated Scale",
    dominant: "Governance dominant",
    shape: [0.3, 0.45, 0.3, 0.85, 0.9, 0.65],
    color: "#9b8ab8",
    governance: "Central stewardship team owns the catalogue, classification, and all domain access decisions. Manual lineage captured after the fact. SLAs defined centrally, enforced manually.",
    gap: "Automate what stewards are doing by hand. Move catalogue registration into the provisioning pipeline. Let stewards set policy — not execute it for every request.",
    traits: [
      "The catalogue is accurate. Every dataset has an owner. Nothing moves without central sign-off.",
      "Time to first data product: 3–6 weeks. Not because anyone is slow — the central team is a single queue.",
      "Productivity scales with headcount in the central team, not with the number of domains.",
    ],
  },
  {
    name: "AI Innovation Lab",
    tagline: "Impressive models. Training data is a spreadsheet.",
    industry: "Tech Startups · AI Product Companies · Internal Innovation Units",
    dominant: "Intelligence dominant",
    shape: [0.7, 1.0, 0.65, 0.45, 0.2, 0.25],
    color: "#7b9eb8",
    governance: "Informal. Model cards may exist; ethics guidelines referenced but not enforced at the pipeline level. Training data provenance not tracked. Classification applied manually post-deployment, if at all.",
    gap: "Introduce governance as a platform primitive before the regulator forces it. Model lineage, training data classification, and inference access control need to be wired into CI/CD — not added retrospectively.",
    traits: [
      "Ships weekly. Models are genuinely impressive. Training data provenance is a Slack thread from 14 months ago.",
      "When the auditor asks who approved the training dataset, nobody can give a structured answer.",
      "The platform can't yet answer: what version of what data was this model trained on, and who classified it?",
    ],
  },
  {
    name: "Post-Merger Conglomerate",
    tagline: "Five catalogues. No shared marketplace.",
    industry: "Large Enterprise · Private Equity Portfolio · Post-M&A Integration",
    dominant: "No dominant force — all fragmented",
    shape: [0.35, 0.35, 0.3, 0.35, 0.4, 0.45],
    color: "#c87941",
    governance: "Competing frameworks coexist — each acquired entity retained its own toolchain. No shared catalogue. Policy interpretation varies by business unit. Audit evidence requires aggregation across five platforms.",
    gap: "Don't start with tools — start with a shared classification hierarchy and a common policy layer. Platform consolidation follows governance alignment, not the other way round.",
    traits: [
      "Five data catalogues. Six security toolchains. Each acquisition was rational. The sum is not.",
      "Cross-entity data products require bilateral agreements — no common contract registry exists.",
      "Intelligence force is nearly zero: not for lack of data, but because the data isn't findable or trustable across entities.",
    ],
  },
  {
    name: "Platform Engineering Maturity",
    tagline: "Hours, not weeks. Governance is the pipeline.",
    industry: "Target State · Platform-Led Enterprise · Tech-Forward Regulated Firms",
    dominant: "Near-balanced — all forces 0.82–0.92",
    shape: [0.88, 0.82, 0.85, 0.88, 0.9, 0.87],
    color: "#6aab8a",
    governance: "Policy-as-code (OPA). Classification defined once, applied automatically at asset registration. Federated enforcement at domain level, centrally auditable. ARB handles novel patterns only.",
    gap: "Sustain balance under load. As AI use cases scale, the Intelligence force stresses Governance and Security asymmetrically — monitor for deformation before it compounds.",
    traits: [
      "Change request to working workspace: hours. Governance, observability, and security are baked into the provisioning pipeline.",
      "Audit evidence generated at provisioning time — not reconstructed under deadline pressure.",
      "ARB reviews novel patterns. Standard patterns never reach a human reviewer. The bottleneck was eliminated structurally.",
    ],
  },
];

const patterns = [
  {
    number: "01", color: "#8aab7a",
    title: "Embed governance into the pipeline, not after it",
    tagline: "Stop asking teams to request a governed workspace. Make it the only kind that gets provisioned.",
    scenario: "Cloud Ops provisions a workspace and raises a ticket to Data Platform. Data Platform configures baselines and raises a ticket to the product team. No individual team is slow — the seam between them kills velocity.",
    steps: [
      { label: "Before", text: "Cloud Ops → ticket → Data Platform → ticket → product team. Three queues. Time to first data product: 3–6 weeks." },
      { label: "After",  text: "Cloud Ops Terraform completes and automatically triggers the Data Platform module: governance classification applied, observability agents deployed, policy baseline validated. Workspace handed over fully configured — no ticket, no queue." },
      { label: "The rule", text: "A workspace that has not passed all six force minimums cannot be handed over. Governance is baked into the pipeline that creates the environment, not added at the end." },
    ],
  },
  {
    number: "02", color: "#c87941",
    title: "When security and engineering conflict, timebox the resolution",
    tagline: "Unresolved conflicts don't age well. Name them, own them, resolve them in two weeks.",
    scenario: "Security mandates all PII is tokenized in cloud storage. Engineering has three billion records that need detokenizing on every ETL run. At that volume the process is unviable. Neither team is wrong. Neither can resolve it unilaterally.",
    steps: [
      { label: "The pattern",     text: "A standing architecture forum with a fixed two-week window. Not to pick a winner — to find the minimum security posture that satisfies the threat model at ETL scale." },
      { label: "The resolution",  text: "A ring-fenced environment: dedicated bucket, no public access, IAM scoped exclusively to the ETL pipeline, full audit logging, re-tokenization gate before data leaves the enclave. Equivalent control at a different layer." },
      { label: "The discipline",  text: "If unresolved in two weeks, the conservative default applies — documented, with a review date. Conflicts that drift without ownership are the most common cause of permanent deformation." },
    ],
  },
  {
    number: "03", color: "#7b9eb8",
    title: "Scope the compromise explicitly — don't let it go unnamed",
    tagline: "Hidden imbalances calcify. Named ones can be resolved.",
    scenario: "Centralising all logs into one SIEM is architecturally correct. In multi-cloud at enterprise scale it also means paying egress on every pipeline run and debug trace. The majority of that data is noise the security team will never query.",
    steps: [
      { label: "The SLA",     text: "Security and Platform Engineering agree in writing: security-critical logs (auth events, privilege escalation, policy violations) flow centrally. Operational logs stay at cloud level, governed by OPA policies that mirror the central ruleset." },
      { label: "The outcome", text: "Security gets enforcement capability where it matters. Engineering avoids egress cost for logs that serve no security purpose. Reviewed quarterly — updated explicitly, not silently expanded." },
      { label: "Why it works", text: "The tension stays visible, named, and contractually bounded. Neither force has quietly absorbed the other. That's what prevents a temporary constraint from hardening into permanent architecture." },
    ],
  },
];

const realizationSteps = [
  { id: 1, label: "Change Request", actor: "Domain Team",
    forces: ["Governance", "Security"],
    what: "Domain team submits a data product intent: name, classification tier, domain owner, intended consumers, regulatory scope. This is the last human step before automation takes over.",
    note: "The intent spec is structured — not a free-text ticket. Classification tier determines which automated checks run downstream.",
    artifact: "Structured intent spec + change record" },
  { id: 2, label: "Policy Check", actor: "Pipeline (automated)",
    forces: ["Governance", "Security"],
    what: "Network boundary validation, IAM scope assessment, regulatory flag check, classification verified against the data contract registry. Fails fast with a structured error, not a rejection email.",
    note: "No ticket raised to a security team. No waiting. Standard requests clear in under 2 minutes. Novel patterns flag for ARB.",
    artifact: "Policy check report — pass / fail + remediation steps" },
  { id: 3, label: "Architecture Gate", actor: "Data ARB (novel patterns only)",
    forces: ["Physical Sovereignty", "Marketplace"],
    what: "Standard patterns skip this step entirely — the pipeline approves them. Novel patterns (new catalog integrations, cross-domain flows, new AI use cases) go to the ARB. The ARB reviews the intent spec, not a slide deck.",
    note: "ARB approval is linked to a Terraform module version and Git SHA — not a Word document. Evidence is structural, not conversational.",
    artifact: "ARB decision record — approve / conditional / reject" },
  { id: 4, label: "Asset Registration", actor: "Data Platform pipeline (automated)",
    forces: ["All six forces"],
    what: "Iceberg namespace created. Catalog entry registered. Classification tag applied. Lineage graph initialised. Observability agent deployed. Quality SLA baseline set. This is where governance becomes structural.",
    note: "Not a catalogue entry made by a human after the fact — an immutable record created by the pipeline at provisioning time. Retroactive data mapping is eliminated.",
    artifact: "Catalog entry + lineage graph root + observability baseline" },
  { id: 5, label: "Workspace Provisioned", actor: "Cloud Ops → Data Platform (automated chain)",
    forces: ["Physical Sovereignty", "Security"],
    what: "Storage provisioned, compute configured, IAM roles applied, network boundary validated. All six force minimums confirmed. The workspace cannot be handed over until validation passes — this is structural, not procedural.",
    note: "Time from change request to working workspace: hours, not weeks. The bottleneck was always the handoff queue. The queue is gone.",
    artifact: "Workspace + force validation report + domain onboarding pack" },
  { id: 6, label: "Published to Marketplace", actor: "Domain Team",
    forces: ["Marketplace", "Observability"],
    what: "Data product published with SLA, quality score, classification, lineage, and consumer subscription model. Discoverable immediately by other domains and by external consumers (Salesforce, SAP, ServiceNow).",
    note: "From this point, observability monitors SLA compliance and surfaces drift. The domain team owns the product. The platform owns the visibility.",
    artifact: "Marketplace listing + SLA contract + consumer subscription API" },
];

const personas = [
  { role: "Domain Team", group: "consumer",
    headline: "A governed workspace in hours, not weeks",
    steps: [
      "Submit a domain intent — workspace name, classification tier, domain owner, intended consumers",
      "Automated pipeline provisions storage, compute, and IAM in one pass",
      "Governance classification applied, observability agents deployed, policy baseline validated — automatically",
      "Workspace handed over, fully configured. Other domains can discover and subscribe to your data products immediately.",
    ],
    note: "No ticket to Data Platform. No approval queue. Security and governance were enforced by the pipeline, not a human reviewer sitting on a backlog." },
  { role: "Data Scientist", group: "consumer",
    headline: "Access by identity, not by ticket",
    steps: [
      "Query Gold-tier Iceberg tables through the unified catalog",
      "Access determined by your identity and the table's classification — enforced automatically, no gatekeeper",
      "Register your model — lineage traces back to the exact snapshot and data product version used for training",
      "Model output published as a new data product with its own SLA. Observability detects drift and alerts you.",
    ],
    note: "No central data team to ask. No manual lineage. Intelligence and governance in balance — each constraining the other proportionally to the sensitivity of the data." },
  { role: "Business Analyst", group: "consumer",
    headline: "An auditable answer, not a caveat",
    steps: [
      "Ask a natural language question via the GenAI interface",
      "Response cites its source — which domain, which classification tier, which snapshot",
      "If you lack clearance for Confidential data, it isn't surfaced — classification flows automatically from governance to the AI serving layer",
    ],
    note: "Intelligence and security in equilibrium. Fast to use. Safe by design. No 'please check with the data team before using this output.'" },
  { role: "Auditor", group: "consumer",
    headline: "A complete answer on the first ask",
    steps: [
      "Who approved this Snowflake instance? ARB submission reference, Terraform module version, Git SHA.",
      "Which pipeline applied it? Which SPN executed it? When?",
      "What does the current table state trace back to? Infrastructure lineage and data lineage are the same graph.",
    ],
    note: "The audit trail exists because it was built into the provisioning process — not reconstructed at midnight before a regulatory deadline." },
  { role: "Data ARB", group: "builder",
    headline: "Decisions that leave evidence",
    steps: [
      "Standard patterns never reach you — the pipeline approves them automatically against established templates",
      "Novel patterns arrive as a structured intent spec linked to a Terraform module — not a slide deck",
      "You review architectural impact: catalog integration, cross-domain contract implications, force boundary compliance",
      "Your decision is recorded against a Git SHA and module version. Tech debt surfaces as a platform metric, not in post-incident reviews.",
    ],
    note: "The ARB operates on data, not intuition. Pattern libraries reduce toil. Novel decisions strengthen the library for the next team." },
  { role: "Governance", group: "builder",
    headline: "Classification that actually enforces",
    steps: [
      "Data classification policies defined once, applied automatically at asset registration — not by a steward on a ticket",
      "Lineage captured by the pipeline; you curate it, not build it by hand",
      "Quality SLAs monitored continuously; breaches trigger automated governance reviews, not manual checks",
      "GDPR, BCBS 239, and internal data contracts enforced at the query layer — not checked after the fact",
    ],
    note: "Governance is a force, not a function. Your team sets the policy. The platform enforces it everywhere, automatically. Your job becomes policy design, not policy policing." },
  { role: "Cyber Security", group: "builder",
    headline: "Audit evidence that exists before you ask for it",
    steps: [
      "Every provisioning event generates a policy check report — pass / fail with remediation steps, stored immutably",
      "IAM roles scoped by the pipeline to the minimum required — no manual review of overly broad permissions",
      "Authentication events, privilege escalation, and policy violations flow centrally; operational noise stays local under OPA",
      "Threat model changes update the bilateral SLA explicitly — Platform Engineering is notified, not surprised",
    ],
    note: "Security is a sovereign force, not an approval queue. You set the conditions. The pipeline enforces them. You audit the evidence — which already exists." },
  { role: "Enterprise Architect", group: "builder",
    headline: "A target operating model that's measurable",
    steps: [
      "Business capabilities map to domain ownership boundaries, not to vendor contracts",
      "The six-force hexagon is your diagnostic: which force is dominant in your current state? That is the bottleneck.",
      "DAMA BOK provides the management disciplines; Data Mesh provides the operating model; the forces show where they're in tension",
      "AI modernisation is tracked as Intelligence force maturity — not as a separate AI strategy document disconnected from the platform",
    ],
    note: "The Voronoi architecture is your target operating model for data. Deformations are your current-state gaps. The realization patterns are your roadmap." },
  { role: "Platform Engineering", group: "builder",
    headline: "Build the pipeline once. It governs every workspace after.",
    steps: [
      "Cloud Ops Terraform triggers the Data Platform module on workspace completion — no ticket, no handoff queue",
      "Governance classification, observability agents, and policy baseline applied in one automated chain",
      "A workspace that fails any of the six force minimums cannot be handed over — the gate is structural, not process",
      "OPA policies deployed locally where centralisation creates cost or latency without proportionate security benefit",
    ],
    note: "You build the system that embeds governance. Once running, teams ship fast not because the rules relaxed — because the rules are baked into the only path available." },
];

// ── interactive components ────────────────────────────────────────────────────

function HexagonDiagram({ forces, size = 200 }) {
  const [hovered, setHovered] = useState(null);
  const cx = size / 2, cy = size / 2;
  const r = size * 0.36;

  const pts = forces.map(f => {
    const a = (Math.PI / 180) * (f.angle - 90);
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  });

  const outerPath = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + " Z";

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <radialGradient id="hexGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#c87941" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#c87941" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path d={outerPath} fill="url(#hexGlow)" stroke="#c87941" strokeWidth="1" strokeOpacity="0.4" />
        {pts.map((p, i) => (
          <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y}
            stroke={forces[i].color} strokeWidth={hovered === i ? 1.5 : 0.5}
            strokeOpacity={hovered === i ? 0.8 : 0.25} style={{ transition: "all 0.3s" }} />
        ))}
        {pts.map((p, i) => {
          const n = pts[(i + 1) % 6];
          return <line key={i} x1={p.x} y1={p.y} x2={n.x} y2={n.y} stroke="#555" strokeWidth="0.5" strokeOpacity="0.4" strokeDasharray="3,3" />;
        })}
        {pts.map((p, i) => (
          <g key={i} style={{ cursor: "pointer" }} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
            <circle cx={p.x} cy={p.y} r={hovered === i ? 14 : 10}
              fill="#0d0d0d" stroke={forces[i].color} strokeWidth={hovered === i ? 2 : 1} style={{ transition: "all 0.3s" }} />
            <text x={p.x} y={p.y} fill={forces[i].color} fontSize="5.5" textAnchor="middle" dominantBaseline="middle" fontWeight="600">
              {forces[i].short}
            </text>
          </g>
        ))}
        <circle cx={cx} cy={cy} r="3" fill="#c87941" opacity="0.6" />
      </svg>
    </div>
  );
}

function DeformationChart({ shape, color, size = 120 }) {
  const cx = size / 2, cy = size / 2, maxR = size * 0.38;
  const angles = [90, 30, -30, -90, -150, 150].map(a => (Math.PI / 180) * (a - 90));
  const ideal = angles.map(a => ({ x: cx + maxR * Math.cos(a), y: cy + maxR * Math.sin(a) }));
  const def   = angles.map((a, i) => ({ x: cx + maxR * shape[i] * Math.cos(a), y: cy + maxR * shape[i] * Math.sin(a) }));
  const ip = ideal.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + " Z";
  const dp = def.map((p, i)   => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + " Z";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <path d={ip} fill="none" stroke="#333" strokeWidth="1" strokeDasharray="2,2" />
      <path d={dp} fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.5" />
      {def.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="2.5" fill={color} opacity="0.7" />)}
      <circle cx={cx} cy={cy} r="2" fill={color} opacity="0.5" />
    </svg>
  );
}

function ForceCards({ forces }) {
  const [active, setActive] = useState(null);
  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 12 }}>
        {forces.map((f, i) => (
          <button key={f.id} onClick={() => setActive(active === i ? null : i)} style={{
            background: active === i ? f.color + "18" : "transparent",
            border: `1px solid ${active === i ? f.color : "#2a2a2a"}`,
            color: active === i ? f.color : "#4a4035",
            padding: "5px 14px", cursor: "pointer",
            fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem",
            letterSpacing: "0.06em", transition: "all 0.2s", borderRadius: 2,
          }}>
            {f.label}
          </button>
        ))}
      </div>
      {active !== null && (
        <div style={{ background: "#0d0d0d", border: `1px solid ${forces[active].color}33`, borderLeft: `2px solid ${forces[active].color}`, padding: "12px 16px" }}>
          <div style={{ color: forces[active].color, fontSize: "0.72rem", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, marginBottom: 6 }}>
            {forces[active].label}
          </div>
          <div style={{ color: "#8a7a65", fontSize: "0.9rem", lineHeight: 1.72 }}>{forces[active].description}</div>
        </div>
      )}
    </div>
  );
}

function Accordion({ items }) {
  const [open, setOpen] = useState(null);
  return (
    <div style={{ border: "1px solid #1e1e1e" }}>
      {items.map((item, i) => (
        <div key={i} style={{ borderBottom: i < items.length - 1 ? "1px solid #1a1a1a" : "none", borderLeft: `3px solid ${item.color}` }}>
          <button onClick={() => setOpen(open === i ? null : i)} style={{
            width: "100%", background: "transparent", border: "none",
            padding: "1.25rem 1.5rem", cursor: "pointer", textAlign: "left",
            display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12,
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: item.color, opacity: 0.8, marginBottom: 5 }}>{item.number}</div>
              <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1rem", fontWeight: 700, color: "#e8d5b0", marginBottom: 5 }}>{item.title}</div>
              <div style={{ fontFamily: "'Lora', Georgia, serif", fontSize: "0.84rem", fontStyle: "italic", color: "#4a4035" }}>{item.tagline}</div>
            </div>
            <span style={{ color: item.color, fontSize: 20, lineHeight: 1, flexShrink: 0, marginTop: 2 }}>{open === i ? "−" : "+"}</span>
          </button>
          {open === i && (
            <div style={{ padding: "0 1.5rem 1.5rem" }}>
              <div style={{ background: "#111", borderLeft: `2px solid ${item.color}55`, padding: "10px 14px", marginBottom: "1.25rem" }}>
                <p style={{ margin: 0, color: "#8a7a65", fontSize: "0.88rem", fontStyle: "italic", lineHeight: 1.7 }}>{item.scenario}</p>
              </div>
              {item.steps.map((step, j) => (
                <div key={j} style={{ display: "flex", gap: 14, marginBottom: j < item.steps.length - 1 ? "0.9rem" : 0 }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: item.color, whiteSpace: "nowrap", paddingTop: 4, minWidth: 72 }}>{step.label}</div>
                  <p style={{ margin: 0, color: "#8a7a65", fontSize: "0.9rem", lineHeight: 1.75 }}>{step.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function RealizationFlow({ steps }) {
  const [active, setActive] = useState(0);
  const s = steps[active];
  return (
    <div>
      <div style={{ display: "flex", overflowX: "auto", borderBottom: "1px solid #1e1e1e" }}>
        {steps.map((step, i) => (
          <button key={i} onClick={() => setActive(i)} style={{
            background: "transparent", border: "none",
            borderBottom: active === i ? "2px solid #c87941" : "2px solid transparent",
            color: active === i ? "#c87941" : "#4a4035",
            padding: "9px 14px", cursor: "pointer",
            fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem",
            letterSpacing: "0.05em", whiteSpace: "nowrap", transition: "all 0.2s",
          }}>
            {step.id}. {step.label}
          </button>
        ))}
      </div>
      <div style={{ background: "#0d0d0d", border: "1px solid #1e1e1e", borderTop: "none", padding: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, marginBottom: "1rem" }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "#4a4035", marginBottom: 4 }}>Actor</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.82rem", color: "#e8d5b0" }}>{s.actor}</div>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {s.forces.map((f, i) => (
              <span key={i} style={{ background: "#111", border: "1px solid #2a2a2a", color: "#8a7a65", padding: "3px 9px", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem" }}>{f}</span>
            ))}
          </div>
        </div>
        <p style={{ color: "#8a7a65", fontSize: "0.92rem", lineHeight: 1.78, marginBottom: "1rem" }}>{s.what}</p>
        <div style={{ background: "#111", borderLeft: "2px solid #c87941", padding: "8px 14px", marginBottom: "1rem" }}>
          <p style={{ margin: 0, color: "#6a5a4a", fontSize: "0.82rem", fontStyle: "italic", lineHeight: 1.65 }}>{s.note}</p>
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "#3a3028" }}>
          artifact — <span style={{ color: "#5a4a3a" }}>{s.artifact}</span>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
        <button onClick={() => setActive(Math.max(0, active - 1))} disabled={active === 0} style={{ background: "transparent", border: "1px solid #2a2a2a", color: active === 0 ? "#2a2a2a" : "#4a4035", padding: "6px 14px", cursor: active === 0 ? "default" : "pointer", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem" }}>
          ← prev
        </button>
        <span style={{ color: "#2a2a2a", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", alignSelf: "center" }}>{active + 1} / {steps.length}</span>
        <button onClick={() => setActive(Math.min(steps.length - 1, active + 1))} disabled={active === steps.length - 1} style={{ background: "transparent", border: "1px solid #2a2a2a", color: active === steps.length - 1 ? "#2a2a2a" : "#4a4035", padding: "6px 14px", cursor: active === steps.length - 1 ? "default" : "pointer", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem" }}>
          next →
        </button>
      </div>
    </div>
  );
}

function PersonaSwitcher({ personas }) {
  const [group, setGroup] = useState("consumer");
  const [active, setActive] = useState(0);
  const filtered = personas.filter(p => p.group === group);
  const p = filtered[Math.min(active, filtered.length - 1)];
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {[["consumer", "Using the platform"], ["builder", "Building & governing"]].map(([g, label]) => (
          <button key={g} onClick={() => { setGroup(g); setActive(0); }} style={{
            background: group === g ? "#c8794120" : "transparent",
            border: `1px solid ${group === g ? "#c87941" : "#2a2a2a"}`,
            color: group === g ? "#c87941" : "#4a4035",
            padding: "5px 14px", cursor: "pointer",
            fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.06em",
          }}>
            {label}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", overflowX: "auto", borderBottom: "1px solid #1e1e1e" }}>
        {filtered.map((persona, i) => (
          <button key={i} onClick={() => setActive(i)} style={{
            background: "transparent", border: "none",
            borderBottom: active === i ? "2px solid #c87941" : "2px solid transparent",
            color: active === i ? "#c87941" : "#4a4035",
            padding: "9px 16px", cursor: "pointer",
            fontFamily: "'JetBrains Mono', monospace", fontSize: "0.66rem",
            letterSpacing: "0.07em", whiteSpace: "nowrap", transition: "all 0.2s",
          }}>
            {persona.role}
          </button>
        ))}
      </div>
      <div style={{ background: "#0d0d0d", border: "1px solid #1e1e1e", borderTop: "none", padding: "1.5rem" }}>
        <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.05rem", fontWeight: 700, color: "#e8d5b0", marginBottom: "1rem" }}>{p.headline}</div>
        <ol style={{ margin: "0 0 1.25rem", paddingLeft: 22, display: "flex", flexDirection: "column", gap: 10 }}>
          {p.steps.map((step, i) => <li key={i} style={{ color: "#8a7a65", fontSize: "0.9rem", lineHeight: 1.75 }}>{step}</li>)}
        </ol>
        <div style={{ background: "#111", borderLeft: "2px solid #c87941", padding: "8px 14px" }}>
          <p style={{ margin: 0, color: "#6a5a4a", fontSize: "0.82rem", fontStyle: "italic", lineHeight: 1.65 }}>{p.note}</p>
        </div>
      </div>
    </div>
  );
}

function OrgStructureMap({ structures }) {
  const [active, setActive] = useState(null);
  const s = active !== null ? structures[active] : null;
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "#1a1a1a", border: "1px solid #1e1e1e", marginBottom: 1 }}>
        {structures.map((org, i) => (
          <button key={i} onClick={() => setActive(active === i ? null : i)} style={{
            background: active === i ? org.color + "18" : "#0d0d0d",
            border: "none",
            borderBottom: active === i ? `2px solid ${org.color}` : "2px solid transparent",
            padding: "1rem 0.75rem",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            transition: "background 0.2s, border-color 0.2s",
          }}>
            <DeformationChart shape={org.shape} color={active === i ? org.color : "#4a4035"} size={88} />
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: active === i ? org.color : "#3a3028", textAlign: "center", lineHeight: 1.5, transition: "color 0.2s" }}>
              {org.name}
            </div>
          </button>
        ))}
      </div>
      {s ? (
        <div style={{ background: "#0d0d0d", border: `1px solid ${s.color}33`, borderLeft: `3px solid ${s.color}`, padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8, marginBottom: "1rem" }}>
            <div>
              <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.1rem", fontWeight: 700, color: s.color, marginBottom: 4 }}>{s.name}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "#4a4035" }}>{s.industry}</div>
            </div>
            <span style={{ background: s.color + "15", border: `1px solid ${s.color}33`, color: s.color, padding: "3px 10px", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", whiteSpace: "nowrap" }}>
              {s.dominant}
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.56rem", color: "#4a4035", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Governance model</div>
              <p style={{ margin: 0, color: "#8a7a65", fontSize: "0.84rem", lineHeight: 1.72 }}>{s.governance}</p>
            </div>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.56rem", color: "#4a4035", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>To move toward balance</div>
              <p style={{ margin: 0, color: "#8a7a65", fontSize: "0.84rem", lineHeight: 1.72 }}>{s.gap}</p>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {s.traits.map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 10 }}>
                <span style={{ color: s.color, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", paddingTop: 3, flexShrink: 0 }}>—</span>
                <span style={{ color: "#6a5a4a", fontSize: "0.87rem", lineHeight: 1.72 }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", padding: "0.9rem", textAlign: "center" }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "#2e2620" }}>click an archetype to see its governance model</span>
        </div>
      )}
    </div>
  );
}

// ── page ──────────────────────────────────────────────────────────────────────

export default function VoronoiBlogPost() {
  const [activeDeformation, setActiveDeformation] = useState(0);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", fontFamily: "'Lora', Georgia, serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Lora:ital,wght@0,400;0,500;1,400&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #c87941; }
        a { color: #c87941; }
        button:focus { outline: 1px solid #c8794155; }
      `}</style>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div style={{ position: "relative", padding: "5rem 2rem 4rem", borderBottom: "1px solid #1e1e1e", overflow: "hidden" }}>
        <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0.04, pointerEvents: "none" }}
          viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
          {["M120,80 L280,60 L320,180 L200,220 Z","M280,60 L460,40 L480,160 L320,180 Z","M460,40 L620,80 L600,200 L480,160 Z",
            "M620,80 L760,120 L720,240 L600,200 Z","M200,220 L320,180 L360,320 L240,360 Z","M320,180 L480,160 L500,300 L360,320 Z",
            "M480,160 L600,200 L620,320 L500,300 Z","M600,200 L720,240 L700,360 L620,320 Z"]
            .map((d, i) => <path key={i} d={d} fill="none" stroke="#c87941" strokeWidth="1" />)}
        </svg>
        <div style={{ maxWidth: 720, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: "1.5rem" }}>
            <div style={{ width: 28, height: 1, background: "#c87941" }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: "#c87941", letterSpacing: "0.15em", textTransform: "uppercase" }}>
              The Voronoi Platform Architecture · Part I
            </span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 900, color: "#f0e6d0", lineHeight: 1.15, marginBottom: "1rem", marginTop: 0, letterSpacing: "-0.03em" }}>
            Ship Fast. Stay Governed.
          </h1>
          <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: "1.1rem", fontStyle: "italic", color: "#8a7a65", marginBottom: "2rem", lineHeight: 1.5 }}>
            Why data application teams wait weeks to ship — and how to fix it without trading away security or governance
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 16, paddingTop: "1.5rem", borderTop: "1px solid #1e1e1e" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #c87941, #7b5a2a)", display: "flex", alignItems: "center", justifyContent: "center", color: "#0a0a0a", fontWeight: 700, fontSize: 14, fontFamily: "'JetBrains Mono', monospace" }}>SV</div>
            <div>
              <div style={{ color: "#c8bfb0", fontSize: "0.85rem", fontFamily: "'JetBrains Mono', monospace" }}>Sravan Vadaga</div>
              <div style={{ color: "#4a4035", fontSize: "0.75rem", fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>April 2026 · 6 min read</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "3rem 2rem 6rem" }}>

        {/* 1. The Problem */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: "#e8d5b0", marginBottom: "1rem", marginTop: 0, letterSpacing: "-0.02em" }}>
            The real reason data teams are slow
          </h2>
          <p style={prose}>
            Your data engineering team finished building the product last Tuesday. It ships next month.
            Not because the code isn't ready — because it's sitting in a queue waiting for an infosec
            sign-off, a governance catalogue entry, and a Cloud Ops ticket to provision the right network
            boundary. Three separate teams. Three separate processes. None of them slow individually.
            Lethal in sequence.
          </p>
          <p style={prose}>
            The instinct is to ask for a lighter process. Fewer gates, faster approvals. That's the wrong
            question. DAMA BOK identifies eleven data management disciplines — governance, security,
            architecture, quality, lineage, and more — that every platform must satisfy. Data Mesh gives
            you the operating model: domain ownership, data as a product, federated governance. Neither
            framework says to skip the rules. Both say to <em>embed them earlier</em>. When governance
            and security are checkpoints placed after the work is done, they slow everything down. When
            they're baked into the pipeline that creates the environment, they're invisible to the team
            shipping the product.
          </p>

          {/* Pull quote */}
          <div style={{ borderLeft: "3px solid #c87941", margin: "2.5rem 0", padding: "1rem 1.5rem", background: "linear-gradient(90deg, #c8794108 0%, transparent 100%)" }}>
            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.2rem", fontStyle: "italic", color: "#e8d5b0", lineHeight: 1.6, margin: 0 }}>
              Governance shouldn't be a gate at the end. It should be baked into the pipeline that creates the environment.
            </p>
          </div>

          <p style={prose}>
            The way to think about this is as a balance problem. Every enterprise data platform is pulled
            by six forces simultaneously. When any one dominates — security locks everything down, or AI
            ships without governance, or physical storage grows with no domain ownership — the whole
            platform suffers. The geometry of a healthy platform is a hexagon. We call this the{" "}
            <em>Voronoi Platform Architecture</em>.
          </p>
        </section>

        {/* 2. The Six Forces */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: "#e8d5b0", marginBottom: "1rem", marginTop: 0, letterSpacing: "-0.02em" }}>
            The six forces — and where the frameworks fit
          </h2>
          <p style={prose}>
            DAMA BOK, Data Mesh, and AI modernisation each illuminate part of the same problem. The six
            forces are the equilibrium model that holds them together. Click any force below to see how it maps.
          </p>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, margin: "2rem 0", padding: "2rem", background: "#0d0d0d", border: "1px solid #1e1e1e" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "#4a4035", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Hover nodes · Click labels below
            </div>
            <HexagonDiagram forces={forces} size={240} />
            <div style={{ fontFamily: "'Lora', Georgia, serif", fontSize: "0.78rem", fontStyle: "italic", color: "#4a4035", textAlign: "center" }}>
              The Voronoi Platform Architecture — six forces in approximate equilibrium
            </div>
            <div style={{ width: "100%", maxWidth: 500 }}>
              <ForceCards forces={forces} />
            </div>
          </div>

          {/* Framework alignment panel */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 1, background: "#1a1a1a", border: "1px solid #1e1e1e", margin: "0 0 1.5rem" }}>
            {frameworkAlignment.map((col, i) => (
              <div key={i} style={{ background: "#0d0d0d", padding: "1.25rem" }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", fontWeight: 700, color: col.color, marginBottom: 4 }}>{col.name}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: "#4a4035", marginBottom: 12 }}>{col.sub}</div>
                {col.rows.map((row, j) => (
                  <div key={j} style={{ color: "#6a5a4a", fontSize: "0.8rem", lineHeight: 1.65, marginBottom: 6, paddingLeft: 10, borderLeft: "1px solid #2a2a2a" }}>
                    {row}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <p style={prose}>
            At every boundary where two forces meet, neither should dominate. Security and Physical
            Sovereignty share a boundary — the domain's storage is absolutely protected, but even the
            highest-privilege security principal can't alter an immutable data product without the domain's
            contract. Governance and Intelligence share a boundary — model lineage traces back to the exact
            training snapshot automatically, and classification flows to the AI serving layer without a
            human check. When the balance holds, teams ship fast and the platform is trustworthy at the same time.
          </p>
        </section>

        {/* 3. Recognise your platform */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: "#e8d5b0", marginBottom: "1rem", marginTop: 0, letterSpacing: "-0.02em" }}>
            Does your platform look like one of these?
          </h2>
          <p style={prose}>
            Most platforms aren't hexagonal — they're deformed by whichever force had the most budget,
            the worst recent incident, or the strongest organisational voice. The deformation tells you
            where the time-to-market bottleneck actually lives.
          </p>

          <div style={{ margin: "1.5rem 0" }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "1.25rem" }}>
              {deformations.map((d, i) => (
                <button key={i} onClick={() => setActiveDeformation(i)} style={{
                  background: activeDeformation === i ? d.color + "22" : "transparent",
                  border: `1px solid ${activeDeformation === i ? d.color : "#2a2a2a"}`,
                  color: activeDeformation === i ? d.color : "#4a4035",
                  padding: "6px 12px", cursor: "pointer",
                  fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem",
                  letterSpacing: "0.08em", transition: "all 0.2s",
                }}>
                  {d.name.replace("The ", "")}
                </button>
              ))}
            </div>
            {(() => {
              const d = deformations[activeDeformation];
              return (
                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1.5rem", background: "#0d0d0d", border: `1px solid ${d.color}33`, borderLeft: `3px solid ${d.color}`, padding: "1.5rem", alignItems: "start" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <DeformationChart shape={d.shape} color={d.color} size={120} />
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: "#4a4035", textAlign: "center", maxWidth: 100 }}>dashed = ideal</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.15rem", fontWeight: 700, color: d.color, marginBottom: 4 }}>{d.name}</div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: "#4a4035", marginBottom: "0.75rem", letterSpacing: "0.08em" }}>{d.industry}</div>
                    <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: "0.92rem", color: "#8a7a65", lineHeight: 1.75, marginBottom: "0.75rem" }}>{d.description}</p>
                    <div style={{ display: "inline-block", background: d.color + "15", border: `1px solid ${d.color}33`, padding: "4px 10px", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: d.color }}>
                      Symptom: {d.symptom}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          <p style={{ ...prose, color: "#6a5a4a" }}>
            None of these emerged from incompetence. Each is the result of a rational local decision — the
            security team doing their job, the AI team responding to board pressure, the storage team
            scaling to meet demand. What varies is which force the organisation's history allowed to dominate,
            and whether the imbalance was recognised before it calcified.
          </p>
        </section>

        {/* 4. Org structure archetypes */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: "#e8d5b0", marginBottom: "1rem", marginTop: 0, letterSpacing: "-0.02em" }}>
            Six org archetypes — which is yours?
          </h2>
          <p style={prose}>
            The deformation your platform shows is usually a direct reflection of how your organisation is
            structured and what governance standard it inherited. Each archetype below has a characteristic
            force signature. The dashed outline is the ideal hexagon; the filled shape is what the archetype
            typically looks like in practice.
          </p>
          <OrgStructureMap structures={orgStructures} />
          <p style={{ ...prose, marginTop: "1.5rem", color: "#6a5a4a" }}>
            Most real organisations sit between two archetypes — the force distribution shifts as programmes
            mature, as acquisitions land, and as regulatory pressure changes. The hexagon is a diagnostic,
            not a verdict.
          </p>
        </section>

        {/* 5. Three patterns */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: "#e8d5b0", marginBottom: "1rem", marginTop: 0, letterSpacing: "-0.02em" }}>
            Three patterns that restore the balance
          </h2>
          <p style={prose}>
            These patterns are drawn from real enterprise programmes. The first — embedding governance into
            the provisioning pipeline — is the most direct fix for time-to-market. The other two handle
            the conflicts that arise when organisational physics won't allow an immediate fix.
          </p>
          <Accordion items={patterns} />
        </section>

        {/* 5. Realization Patterns */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: "#e8d5b0", marginBottom: "1rem", marginTop: 0, letterSpacing: "-0.02em" }}>
            How it works in practice — the realization pattern
          </h2>
          <p style={prose}>
            Abstract principles need a concrete path. This is how a change request becomes a governed,
            published data product — showing which forces activate at each step, who is involved, and what
            artifact is produced. Step through it to see where the bottlenecks used to live and where the
            automation now takes over.
          </p>
          <RealizationFlow steps={realizationSteps} />
          <p style={{ ...prose, marginTop: "1.5rem" }}>
            The key shift: data asset registration at step 4 is no longer a manual catalogue entry made
            weeks after the product ships. It is an immutable record created by the pipeline at provisioning
            time — lineage graph root, classification tag, observability baseline, and all. Retroactive
            data mapping is eliminated because the mapping <em>is</em> the provisioning.
          </p>
        </section>

        {/* 6. What it looks like */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: "#e8d5b0", marginBottom: "1rem", marginTop: 0, letterSpacing: "-0.02em" }}>
            What balance feels like — pick your role
          </h2>
          <p style={prose}>
            A platform in genuine equilibrium looks different depending on where you sit. Select your role
            to see what day-to-day working looks like when the six forces are balanced.
          </p>
          <PersonaSwitcher personas={personas} />
        </section>

        {/* TL;DR */}
        <div style={{ background: "#0d0d0d", border: "1px solid #1e1e1e", borderLeft: "3px solid #c87941", padding: "1.75rem", margin: "3rem 0 2rem" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "#4a4035", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1rem" }}>
            The point — in one paragraph
          </div>
          <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.05rem", fontStyle: "italic", color: "#c8bfb0", lineHeight: 1.8, margin: 0 }}>
            Data application teams are slow not because governance and security are too strict, but because
            they arrive too late. DAMA BOK defines the disciplines; Data Mesh provides the operating model;
            the six-force equilibrium shows where they're in tension. The fix is to embed all six forces
            into the pipeline that creates the environment — so that governance classification, security
            validation, observability wiring, and catalog registration happen at provisioning time, not as
            a separate process weeks later. When the pipeline enforces the rules, there's nothing left to approve.
          </p>
        </div>

        {/* Coming next */}
        <div style={{ borderTop: "1px solid #1e1e1e", paddingTop: "2rem", marginTop: "3rem" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: "#4a4035", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            Coming Next · Part II
          </div>
          <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.25rem", color: "#c87941", marginBottom: "0.75rem" }}>
            The Physical and Catalog Planes: The Gravitational Mass
          </div>
          <p style={{ ...prose, color: "#4a4035", marginBottom: 0 }}>
            Before you can build intelligence, governance, or observability on a polyglot multi-cloud
            platform, you have to answer one deceptively simple question: where is the truth, and can
            every engine in your architecture find it? The answer involves Apache Iceberg, federated
            catalogs, and the plane nobody draws — the one most likely to fail silently.
          </p>
        </div>

        {/* Tags */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid #1a1a1a" }}>
          {["Data Architecture", "DAMA BOK", "Data Mesh", "Platform Engineering", "Time to Market", "Data Governance", "AI Modernisation"].map(tag => (
            <span key={tag} style={{ background: "#111", border: "1px solid #222", color: "#4a4035", padding: "4px 10px", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.06em" }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
