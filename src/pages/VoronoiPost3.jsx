import { useState, useEffect, Fragment } from "react";

// ── palette ───────────────────────────────────────────────────────────────────
const ACCENT  = "#6b8294";   // steel-blue: infrastructure, network, neutrality
const AMBER   = "#c87941";   // Part I cross-ref
const TEAL    = "#5a9eb5";   // Part II cross-ref
const DANGER  = "#b8847b";   // lock-in, risk
const GREEN   = "#8aab7a";   // portable, open
const GOLD    = "#c8a050";   // regulatory weight

// ── shared style constants ────────────────────────────────────────────────────
const prose = {
  fontFamily: "'Lora', Georgia, serif",
  fontSize: "1rem",
  lineHeight: 1.85,
  color: "#c8bfb0",
  marginTop: 0,
  marginBottom: "1.1rem",
};

// ── data: the five cases ──────────────────────────────────────────────────────
const cases = [
  {
    n: 1, title: "Cloud-wide control plane failures", color: DANGER,
    summary: "Regional events are bounded by region. Control plane events are not.",
    body: "The AWS us-east-1 IAM degradation in December 2021 affected services globally because identity is not regional. Microsoft's Entra ID outages have produced global authentication failures. GCP networking events have had cross-region impact. These events are rare. They are also unbounded. If your IAM control plane is unavailable, cross-region failover does not help — because failover itself requires authentication.",
    verdict: "Cross-region protects against geography. Multi-cloud protects against the cloud itself.",
  },
  {
    n: 2, title: "Regulatory concentration risk", color: GOLD,
    summary: "DORA, the CTPP list, and PRA SS2/21 have removed the choice.",
    body: "Under the UK PRA's Supervisory Statement SS2/21, in force since March 2022, regulated firms must manage concentration risk under Section 5.24. In the EU, DORA — Regulation 2022/2554, directly applicable since January 2025 — goes further. Article 29 requires financial entities, before entering an ICT contract supporting a critical or important function, to assess whether the contract creates dependency on a provider that is not easily substitutable or multiple critical contracts with one provider. On 18 November 2025, the European Supervisory Authorities published the first list of 19 designated Critical ICT Third-Party Providers — AWS, Microsoft, and Google Cloud alongside infrastructure operators like Equinix and Bloomberg, IT services firms like Accenture, IBM, and Kyndryl, and financial data providers like FIS and LSEG. Non-compliance can result in periodic penalty payments of up to 1% of average daily worldwide turnover, for up to six months.",
    engineering: "For engineering teams, this is no longer an architecture option. Banking applications across every vertical — retail core banking, mobile apps, real-time credit card fraud detection, SWIFT corporate treasury networks, high-speed investment trading engines — are now governed by a regulatory expectation that systemic concentration risk is managed and evidenced. Over 65% of EU financial entities already use at least two of the three major cloud providers for critical functions. DORA Article 28(8) requires documented exit strategies for material ICT providers; for designated CTPPs, those exit strategies must be tested at least annually. The architecture must prove each critical application can fail over or migrate cleanly if a Lead Overseer's recommendations to a CTPP go unaddressed and the suspension power is triggered. The nuclear option exists. It is not theoretical.",
    verdict: "Multi-cloud is no longer an architectural preference. It is a regulatory position the architecture must evidence — and exit-test annually.",
  },
  {
    n: 3, title: "Platform strength mismatch", color: TEAL,
    summary: "The right tool for the workload lives on a different cloud than the data.",
    body: "A team that needs Vertex AI or BigQuery cannot get them on AWS. A team committed to Power BI and Fabric capacity cannot replicate that on GCP. A team that needs Lake Formation column-level enforcement with cross-engine query support cannot get it on Azure. These are not features waiting for the next release. They are platform commitments that took years to build. When the right tool sits on a different cloud than the producer's data, the answer is not to abandon the tool. It is to design the cross-cloud path correctly.",
    verdict: "Choose the cell that fits the workload. Govern the boundary between cells.",
  },
  {
    n: 4, title: "Inherited estate and acquisition", color: AMBER,
    summary: "Greenfield is a luxury most organisations do not have.",
    body: "A bank that acquires a fintech inherits whichever cloud the acquired entity chose. Integration must happen. For organisations whose history includes M&A — which is most organisations of meaningful size — multi-cloud is not a strategy. It is a reality the architecture must accommodate.",
    verdict: "The architecture inherits, it does not always choose.",
  },
  {
    n: 5, title: "Jurisdictional sovereignty", color: GREEN,
    summary: "Cloud concentration is about which cloud. Jurisdictional sovereignty is about which legal regime.",
    body: "Mainland China is the sharpest example. AWS in China is operated by NWCD and Sinnet — a separate AWS partition that cannot privately connect to AWS Global. Azure in China is operated by 21Vianet under similar separation. GCP has no commercial presence in mainland China. Beyond the network reality, Chinese law — the Cybersecurity Law (2017), the Data Security Law (2021), and the Personal Information Protection Law (2021) — requires data about Chinese citizens generated in China to remain in China unless cross-border transfer is approved by the Cyberspace Administration of China. Similar principles apply in India, Saudi Arabia, the UAE, Russia, and post-Schrems-II EU-US transfers. Most multinational firms do not solve this with multi-cloud. They solve it with hybrid: sensitive jurisdictional data stays on-premises in the originating jurisdiction; cloud platforms host derived, aggregated, or tokenised data only. For many tier-1 banks the hybrid posture is permanent, not transitional. Where data must cross a jurisdictional boundary, the architecture has three mechanisms: aggregation, anonymisation, or tokenisation — the choice is regulatory, the implementation is architectural.",
    verdict: "Jurisdiction is the outermost boundary. Multi-cloud architecture lives inside it.",
  },
];

// ── data: resilience diagnostic ───────────────────────────────────────────────
const diagnosticQuestions = [
  { q: "Your worst-case RTO for the highest-impact data product is under one hour.", yes: 1 },
  { q: "You are a regulated financial entity in the UK or EU.", yes: 1 },
  { q: "A workload needs a managed service materially better on a specific cloud (Vertex AI, Fabric, Lake Formation).", yes: 1 },
  { q: "Concentration risk on a single provider is named in your regulatory or audit obligations.", yes: 1 },
  { q: "You already operationalise cross-region resilience for this workload.", yes: 1 },
];

const diagnosticVerdicts = [
  { range: [0, 1], color: GREEN,  verdict: "Multi-region is your answer. Stop here.", note: "Cross-region S3 replication, regional standby compute, Aurora Global. ~10% premium. Well-trodden territory." },
  { range: [2, 3], color: TEAL,   verdict: "Multi-region as default. Multi-cloud for specific workloads only.", note: "Identify the one or two products where the case is overwhelming. Govern that boundary. Everything else stays single-cloud." },
  { range: [4, 5], color: GOLD,   verdict: "Multi-cloud earns its place — for the workloads that meet these criteria.", note: "Not for everything. The architecture must be evidence-producing. Read on." },
];

// ── data: cost line calculator ────────────────────────────────────────────────
const tiers = [
  { id: "T1", label: "Tier 1 · Licensed, PII, financial positions",      pattern: "compute-federation", reason: "Licensed data cannot be copied. Compute moves to the data. Model artefacts are what crosses the boundary." },
  { id: "T2", label: "Tier 2 · Sensitive internal, derivable PII",       pattern: "native-interconnect", reason: "For AWS↔GCP, the native hyperscaler interconnect (AWS Interconnect – multicloud / GCP Partner Cross-Cloud Interconnect for AWS) is the simplest private path. Megaport VXC remains the right answer for other pairings or where an existing fabric contract applies." },
  { id: "T3", label: "Tier 3 · Aggregated, anonymised, reporting",       pattern: "vxc-or-replicate",   reason: "VXC for low-frequency federation; replicate to second cloud for daily ML consumption. Choose by access pattern." },
  { id: "T4", label: "Tier 4 · Public reference data",                   pattern: "any",                reason: "Public internet with TLS is acceptable. No regulatory or commercial constraint requires private transit." },
];

const patterns = {
  "compute-federation":   { name: "Compute follows data",         cost: "Model artefacts (MB) cross. Compute runs in producer cloud. No bulk egress.",                                color: GREEN,    monthly: "~$200–500 / month (compute only)" },
  "native-interconnect":  { name: "Native hyperscaler interconnect", cost: "AWS Interconnect – multicloud + GCP Partner Cross-Cloud Interconnect. MACsec-encrypted. No third party. 1–100 Gbps.", color: ACCENT, monthly: "~$1,000–3,000 / month at 10TB scale + bandwidth tier" },
  "vxc":                  { name: "Virtual cross-connect",        cost: "Megaport-style private MPLS. Fixed port fees ~$1,500/mo. Usage ~$0.02/GB.",                                  color: TEAL,     monthly: "~$1,500–3,500 / month at 10TB scale" },
  "vxc-or-replicate":     { name: "VXC or selective replicate",   cost: "Choose by frequency. Daily access → replicate. Weekly or less → federate.",                                  color: ACCENT,   monthly: "$200–400 / month (replicate) · $1,500+ (federate)" },
  "any":                  { name: "Public internet acceptable",   cost: "TLS over public internet. No private transit required.",                                                    color: "#6a5a4a", monthly: "Egress only" },
};

// ── data: six invisible layers ────────────────────────────────────────────────
const invisibleLayers = [
  {
    id: "identity",  name: "Identity federation",      color: TEAL,
    oneLine: "OIDC trust between cloud IAM systems — no stored credentials.",
    pattern: "Workload Identity Federation. GCP service account presents OIDC token → AWS STS exchanges for short-lived IAM session → Lake Formation column controls apply because the IAM role is a known principal.",
    failure: "Stored access keys. Long-lived credentials. A GCP service account that AWS does not know about — and therefore cannot govern.",
  },
  {
    id: "iac",       name: "Infrastructure as Code",   color: GREEN,
    oneLine: "One Terraform module that knows how to land safely on any cloud.",
    pattern: "Module abstraction by concept, not by cloud. Inputs: cloud, region, classification, marketplace_id. Module selects S3 / GCS / ADLS, applies right network isolation, applies tag taxonomy, registers in marketplace on creation.",
    failure: "Three separate manual processes per cloud. Tags drift. Network policies diverge. Marketplace registration is retroactive — meaning never.",
  },
  {
    id: "entitlement", name: "Entitlement as a service", color: ACCENT,
    oneLine: "OPA as the neutral policy engine. Cloud is an input, not a separate policy system.",
    pattern: "Single OPA service in neutral plane. Each cloud's native control (Lake Formation, Dataplex, Purview) becomes an enforcement point. Policy is written once in Rego. Audit log of every decision, regardless of which cloud asked.",
    failure: "One entitlement system per cloud. Same policy written three times. Three audit logs that never reconcile. The regulator asks one question and gets three half-answers.",
  },
  {
    id: "lineage",   name: "Lineage across boundaries", color: GOLD,
    oneLine: "OpenLineage events with cloud-neutral namespaces, collected centrally.",
    pattern: "Spark, dbt, Airflow emit OpenLineage events. Namespaces are cloud-neutral (aws://, gcp://, azure://). Collector in neutral plane assembles cross-cloud graph. AWS product owner sees GCP consumers.",
    failure: "Lineage stops at the cloud boundary. The AWS product owner believes they have five consumers. There are twelve — seven of them in GCP.",
  },
  {
    id: "provenance", name: "Provenance across boundaries", color: DANGER,
    oneLine: "Iceberg table properties carry origin, license, transformation history.",
    pattern: "Provenance travels with the data. Origin attestation, license reference, transformation log carried as Iceberg table properties. When the table is synced from AWS to GCP, the provenance chain survives the boundary.",
    failure: "Lineage tells you where data went. Provenance proves it arrived correctly, under authority, within license. Without provenance, the regulator's audit request takes weeks and produces a document, not evidence.",
  },
  {
    id: "finops",    name: "FinOps at application level", color: AMBER,
    oneLine: "Tag taxonomy is a data contract. Egress attribution is a chargeback decision.",
    pattern: "Required tags on every resource: data_tier, data_domain, license_source, cost_centre, marketplace_id. Egress attribution: consumer pays for cross-cloud pull. Capacity-billing gap (Fabric F SKU) acknowledged honestly — workspace-per-domain or accept reduced granularity.",
    failure: "Tags applied retroactively. Aggregate bills nobody can decompose. Zombie dependencies hidden in capacity costs. Cross-cloud workloads run because nobody sees what they cost.",
  },
];

// ── data: lock-in spectrum ────────────────────────────────────────────────────
const lockInPanels = [
  {
    id: "visible", name: "Visible Lock-In", color: DANGER,
    subtitle: "The kind you can name on a contract",
    examples: ["Databricks Unity Catalog workspaces", "Snowflake virtual warehouses", "Microsoft Fabric capacities"],
    body: "Databricks and Snowflake run on all three clouds. Both claim to be your multi-cloud strategy. Both reduce operational complexity — one product surface, one skill set, one governance model across three different clouds. This is a real benefit. The article does not dismiss it. The trap is when multi-cloud becomes one SaaS vendor running on three clouds. The regulator's question — if your critical platform vendor has an outage, what is the impact? — answers itself. You have substituted cloud concentration with vendor concentration. The data may be in three clouds. The control plane is in one company's hands.",
    evidence: "Neither Databricks nor Snowflake appeared on the first DORA CTPP designation list of November 2025. Both are plausible future designations given their financial services penetration. The list is updated annually.",
    verdict: "Use them where they solve genuine operational problems. Do not present them to the regulator as the answer to concentration risk. They are not.",
  },
  {
    id: "background", name: "Background Lock-In", color: GOLD,
    subtitle: "The kind labelled 'open'",
    examples: ["Microsoft Fabric XTable virtualization (V2 only)", "Microsoft's unupstreamed XTable extensions", "Databricks UniForm (Delta-first under Iceberg label)", "AWS Glue / S3 Tables conventions"],
    body: "Apache Iceberg is the open standard. Each major vendor has built its own translation layer underneath. Microsoft Fabric uses Apache XTable — itself an Apache Incubation project — for table format virtualization. The Fabric implementation supports Iceberg V2 only; V3 is not yet supported. The virtualization converts only the latest metadata version, which means time-travel on the table's history is not preserved across the boundary. Microsoft has extended XTable with deletion-vector-to-positional-delete conversions; the extensions are not yet upstream. GCP BigLake uses XTable too — same incubation status, different extensions. AWS Glue and S3 Tables implement Iceberg with AWS-specific catalog conventions and Lake Formation integration patterns. Databricks UniForm generates Iceberg metadata from Delta tables — the readers see Iceberg, the optimisation paths are Delta. The format claims to be open. The behaviour is not uniformly so.",
    evidence: "Microsoft's own documentation: 'The table format virtualization feature currently supports Apache Iceberg V2 today. We're working on support for reading Iceberg V3.'",
    verdict: "Real portability requires vanilla open source. The tool that runs identically on-premises, AWS, GCP, and Azure earns its place. Cloud-managed Iceberg is not the same as Iceberg.",
  },
];
// ── data: resilience categories ───────────────────────────────────────────────
const resilienceCats = [
  { id: "RC2", label: "ResCat 2", color: GREEN,
    meaning: "Platform default for standard products",
    rto: "≤ 12 hr", rpo: "≤ 30 min", tested: "Crossover, annually",
    note: "Single-region within the primary cloud. In-region multi-AZ / multi-zone redundancy is the precondition beneath all categories — not a category itself.",
  },
  { id: "RC1", label: "ResCat 1", color: GOLD,
    meaning: "Material business impact on failure",
    rto: "≤ 4 hr", rpo: "≤ 15 min", tested: "Crossover, twice yearly",
    note: "Active-passive across regions or clouds. The 15-minute RPO ceiling is the workhorse for high-availability workloads. Operator-invoked failover.",
  },
  { id: "RC0", label: "ResCat 0", color: DANGER,
    meaning: "Zero-tolerance regulatory exposure; high blast radius",
    rto: "≤ 1 hr", rpo: "≤ 5 min", tested: "Crossover, twice yearly",
    note: "Strategy is rapid alternative provisioning, not failure prevention. Secondary compute is described in IaC and provisionable in under 15 minutes. The failover exercise is a stress test of the provisioning automation — and produces the supervisory audit artefact.",
  },
];

// ── data: per-service matrix ──────────────────────────────────────────────────
const serviceMatrix = [
  { service: "Object storage + Iceberg",   rc2: "Single-region + periodic snapshot",                              rc1: "S3 CRR / ADLS GRS to 2nd region @15-min",                    rc0: "CRR+RTC / GZRS sub-min + sub-minute catalog-sync + warmed cross-cloud" },
  { service: "Catalog",                    rc2: "Metadata snapshot in region",                                   rc1: "catalog-sync 15-min to standby catalog",                       rc0: "Dual-write or sub-minute catalog-sync" },
  { service: "Batch — Glue / Fabric Spark",rc2: "In-region re-run (2 subnets / AZs)",                            rc1: "IaC redeploy 2nd region / GZRS + secondary workspace",        rc0: "Warmed 2nd region or cloud, provisionable < 15 min" },
  { service: "Interactive — Athena / SQL Endpoint", rc2: "Re-point in region",                                   rc1: "Secondary-region endpoint",                                   rc0: "Warmed secondary endpoint" },
  { service: "Warehouse — Redshift / Fabric",rc2: "Automated snapshots; restore in region",                     rc1: "Cross-region snapshot copy / geo-redundant + secondary workspace", rc0: "Warmed standby + cross-region snapshots / warmed secondary workspace" },
  { service: "Run status — DynamoDB / Cosmos DB", rc2: "PITR",                                                   rc1: "Cross-region backup",                                         rc0: "Global Tables / Cosmos multi-region write" },
  { service: "Eventing — SNS / Event Grid", rc2: "Regional",                                                     rc1: "Cross-region fan-out / re-subscribe",                          rc0: "Active in both regions" },
  { service: "Streaming — Confluent Kafka", rc2: "Single cluster (multi-AZ)",                                    rc1: "MRC or Cluster Linking @15-min",                              rc0: "MRC near-zero RPO / dual-write; Cluster Linking cross-cloud" },
  { service: "Orchestration — Astronomer",  rc2: "Single deployment",                                            rc1: "Standby deployment 2nd region",                               rc0: "Warmed standby on 2nd region / cloud K8s" },
  { service: "Federated — Snowflake / Databricks", rc2: "Attach to authoritative catalog",                      rc1: "Secondary-region attach",                                     rc0: "Warmed secondary; Azure Databricks as cross-cloud peer" },
  { service: "Policy — Immuta",            rc2: "HA instance",                                                   rc1: "HA + rehearsed emergency procedure",                           rc0: "HA + replicated policy artefacts + dual push" },
  { service: "Identity — Entra ID",        rc2: "Provider-managed multi-region",                                 rc1: "(same)",                                                      rc0: "(same) + break-glass vault" },
  { service: "Observability — central",    rc2: "Logs via Confluent to central platform",                        rc1: "Resilient Confluent path (MRC)",                               rc0: "Dual log path" },
];

// ── data: replication tiers ───────────────────────────────────────────────────
const replicationTiers = [
  { name: "Gold", color: GOLD,
    rpo: "Seconds – single-digit minutes", rto: "Minutes", resCat: "ResCat 0 / tight ResCat 1",
    mechanism: "CRR + Replication Time Control + sub-minute catalog-sync. Dual-write mode for metadata: every commit issued to both catalogs synchronously.",
    cost: "Highest — directional egress fires on every change plus the always-on tight-sync infrastructure. Cost concentrates in the data replication, not the metadata rewrite.",
  },
  { name: "Silver", color: ACCENT,
    rpo: "15 min – 1 hour", rto: "~1 hour", resCat: "ResCat 2 (platform default)",
    mechanism: "Scheduled CRR + catalog-sync every 15–60 min. Async-with-designated-primary mode: commit to the authoritative catalog, replicate with reconciliation.",
    cost: "Moderate — infrequent egress, volume-billed not frequency-billed. This is the default for most enterprise data products.",
  },
  { name: "Bronze", color: "#6a5a4a",
    rpo: "Hours – one day", rto: "Day-plus", resCat: "Cold tables and audit",
    mechanism: "On-demand or daily batch sync. No continuous sync infrastructure. The right answer for cold reference data, audit archives, and non-critical historical products.",
    cost: "Minimal — the cost is the storage copy, not the transfer cadence. No replication-time infrastructure to maintain.",
  },
];

// ── data: failover steps ──────────────────────────────────────────────────────
const failoverSteps = [
  { id: "steady",  label: "Steady state",       actor: "Automated",        color: GREEN,
    desc: "Primary cloud serves writes. The secondary holds a warm replica — Iceberg synced per its tier RPO, Immuta policies pre-pushed, personas pre-configured on both sides, run-state store already multi-region. Nothing extraordinary is happening.",
  },
  { id: "detect",  label: "Detect",             actor: "Automated",        color: TEAL,
    desc: "Alerting fires against RPO breach: catalog-sync lag exceeds the tier threshold, storage-replication lag spikes, identity-federation token exchanges fail, or cross-cloud egress deviates abnormally. Each metric is tuned to the workload's ResCat — a Gold-tier table has a tighter threshold than a Silver one.",
  },
  { id: "declare", label: "Declare DR",         actor: "Senior management", color: ACCENT,
    desc: "A human decision with senior-management approval, evidenced and timestamped for regulatory audit. The declaration is not automatic. It is a deliberate act with a named owner — not a runbook that fires itself. Under DORA, the declaration and its rationale are part of the supervisory artefact.",
  },
  { id: "halt",    label: "Halt source writes", actor: "Platform operator", color: AMBER,
    desc: "Writes to the primary catalog are halted. No new Iceberg commits land in the primary. This is the point of no ambiguity: the gap between primary and secondary is now fixed, and the clock for final sync starts here.",
  },
  { id: "sync",    label: "Final catalog-sync", actor: "Automated",        color: AMBER,
    desc: "One last iceberg-catalog-sync run closes the gap. The metadata pointer advances only after confirming all in-flight data has landed in the staging bucket and passed schema validation, PII classification, and the circuit-breaker. This gating signal is what keeps the failover clean.",
  },
  { id: "cutover", label: "Cut over",           actor: "Platform operator", color: GOLD,
    desc: "Traffic is re-pointed to the secondary. Orchestration, interactive queries, warehouse reads, and federated engines are each redirected per their own runbook. A top-level coordinator sequences the runbooks; each has a single owner. The declaration itself gates this step.",
  },
  { id: "validate",label: "Validate & reconcile",actor: "Platform operator",color: GOLD,
    desc: "Canary queries confirm reads are live on the secondary. Immuta policy parity is verified — a denied subject must still be denied. Run-state is reconciled. Egress and identity-federation metrics confirm the boundary is functioning under the new routing.",
  },
  { id: "active",  label: "Secondary is primary",actor: "Automated + ops", color: GREEN,
    desc: "The secondary is now the authoritative write surface. Failback is not a rollback — it reverses the same procedure as a second declared change, with a second senior-management sign-off and a second supervisory artefact. The full exercise is a stress test of the provisioning automation, and completing it annually (ResCat 2) or twice yearly (ResCat 0/1) is the regulatory evidence.",
  },
];

// ── helper components ─────────────────────────────────────────────────────────

function CaseAccordion({ items }) {
  const [open, setOpen] = useState(null);
  return (
    <div style={{ border: "1px solid #1e1e1e" }}>
      {items.map((it, i) => (
        <div key={i} style={{ borderBottom: i < items.length - 1 ? "1px solid #1a1a1a" : "none", borderLeft: `3px solid ${it.color}` }}>
          <button onClick={() => setOpen(open === i ? null : i)} style={{
            width: "100%", background: "transparent", border: "none",
            padding: "1.1rem 1.5rem", cursor: "pointer", textAlign: "left",
            display: "flex", alignItems: "center", gap: 14,
          }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: it.color, letterSpacing: "0.1em", minWidth: 30 }}>Case {it.n}</div>
            <div style={{ flex: 1, fontFamily: "'Playfair Display', Georgia, serif", fontSize: "0.98rem", fontWeight: 700, color: open === i ? it.color : "#e8d5b0" }}>{it.title}</div>
            <span style={{ color: it.color, fontSize: 20, lineHeight: 1, flexShrink: 0 }}>{open === i ? "−" : "+"}</span>
          </button>
          {open === i && (
            <div style={{ padding: "0 1.5rem 1.5rem" }}>
              <p style={{ margin: "0 0 1rem", fontFamily: "'Lora', Georgia, serif", fontSize: "0.92rem", fontStyle: "italic", color: "#a8997a", lineHeight: 1.7 }}>{it.summary}</p>
              <p style={{ margin: "0 0 1rem", fontFamily: "'Lora', Georgia, serif", fontSize: "0.9rem", color: "#8a7a65", lineHeight: 1.8 }}>{it.body}</p>
              {it.engineering && (
                <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: `1px dashed ${it.color}33` }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.56rem", color: it.color, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>What it means for engineers</div>
                  <p style={{ margin: 0, fontFamily: "'Lora', Georgia, serif", fontSize: "0.9rem", color: "#8a7a65", lineHeight: 1.8 }}>{it.engineering}</p>
                </div>
              )}
              <div style={{ background: "#111", borderLeft: `2px solid ${it.color}`, padding: "10px 14px", marginTop: "1rem" }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.56rem", color: it.color, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>The verdict</div>
                <p style={{ margin: 0, fontFamily: "'Lora', Georgia, serif", fontSize: "0.86rem", fontStyle: "italic", color: "#c8bfb0", lineHeight: 1.65 }}>{it.verdict}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ResilienceDiagnostic({ questions, verdicts }) {
  const [answers, setAnswers] = useState(questions.map(() => null));
  const score = answers.reduce((s, a, i) => s + (a === true ? questions[i].yes : 0), 0);
  const answered = answers.every(a => a !== null);
  const verdict = answered ? verdicts.find(v => score >= v.range[0] && score <= v.range[1]) : null;

  return (
    <div style={{ background: "#0d0d0d", border: "1px solid #1e1e1e", padding: "1.75rem" }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: ACCENT, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
        The resilience diagnostic · click yes or no
      </div>
      {questions.map((qq, i) => (
        <div key={i} style={{ marginBottom: "1rem", paddingBottom: "1rem", borderBottom: i < questions.length - 1 ? "1px solid #1a1a1a" : "none" }}>
          <p style={{ margin: "0 0 0.6rem", fontFamily: "'Lora', Georgia, serif", fontSize: "0.92rem", color: "#c8bfb0", lineHeight: 1.6 }}>{qq.q}</p>
          <div style={{ display: "flex", gap: 8 }}>
            {[["Yes", true], ["No", false]].map(([lbl, val]) => (
              <button key={lbl} onClick={() => { const a = [...answers]; a[i] = val; setAnswers(a); }} style={{
                background: answers[i] === val ? `${ACCENT}33` : "transparent",
                border: `1px solid ${answers[i] === val ? ACCENT : "#2a2a2a"}`,
                color: answers[i] === val ? ACCENT : "#6a5a4a",
                padding: "5px 16px", cursor: "pointer",
                fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.08em",
                transition: "all 0.2s",
              }}>{lbl}</button>
            ))}
          </div>
        </div>
      ))}
      {verdict && (
        <div style={{ marginTop: "1.25rem", borderTop: `1px solid ${verdict.color}33`, paddingTop: "1.25rem" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: verdict.color, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
            Signals: {score} of {questions.length}
          </div>
          <p style={{ margin: "0 0 0.5rem", fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.05rem", fontWeight: 700, color: verdict.color, lineHeight: 1.5 }}>{verdict.verdict}</p>
          <p style={{ margin: 0, fontFamily: "'Lora', Georgia, serif", fontSize: "0.85rem", fontStyle: "italic", color: "#8a7a65", lineHeight: 1.7 }}>{verdict.note}</p>
        </div>
      )}
    </div>
  );
}

function CostLineCalculator({ tiers, patterns }) {
  const [tierId, setTierId] = useState(tiers[0].id);
  const tier = tiers.find(t => t.id === tierId);
  const pattern = patterns[tier.pattern];

  return (
    <div style={{ background: "#0d0d0d", border: "1px solid #1e1e1e", padding: "1.5rem" }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: ACCENT, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1rem" }}>
        Cost line · choose data tier
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: "1.25rem" }}>
        {tiers.map(t => (
          <button key={t.id} onClick={() => setTierId(t.id)} style={{
            background: tierId === t.id ? `${ACCENT}22` : "transparent",
            border: `1px solid ${tierId === t.id ? ACCENT : "#2a2a2a"}`,
            color: tierId === t.id ? "#e8d5b0" : "#6a5a4a",
            padding: "9px 13px", cursor: "pointer", textAlign: "left",
            fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.04em",
            transition: "all 0.2s",
          }}>{t.label}</button>
        ))}
      </div>
      <div style={{ background: "#111", borderLeft: `3px solid ${pattern.color}`, padding: "1.1rem 1.3rem" }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: pattern.color, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
          Recommended pattern
        </div>
        <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.1rem", fontWeight: 700, color: pattern.color, marginBottom: "0.6rem" }}>
          {pattern.name}
        </div>
        <p style={{ margin: "0 0 0.75rem", fontFamily: "'Lora', Georgia, serif", fontSize: "0.88rem", color: "#a8997a", lineHeight: 1.7 }}>{tier.reason}</p>
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "8px 14px", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: "#6a5a4a" }}>
          <span style={{ color: "#4a4035" }}>Cost shape</span><span>{pattern.cost}</span>
          <span style={{ color: "#4a4035" }}>Order of magnitude</span><span style={{ color: pattern.color }}>{pattern.monthly}</span>
        </div>
      </div>
    </div>
  );
}

function InvisibleLayersTabs({ layers }) {
  const [active, setActive] = useState(0);
  const cur = layers[active];
  return (
    <div style={{ border: "1px solid #1e1e1e" }}>
      <div className="tabs-row" style={{ display: "flex", flexWrap: "wrap", borderBottom: "1px solid #1e1e1e", background: "#0a0a0a" }}>
        {layers.map((l, i) => (
          <button key={l.id} onClick={() => setActive(i)} style={{
            flex: "1 1 auto", minWidth: 100,
            background: active === i ? `${l.color}15` : "transparent",
            border: "none",
            borderRight: i < layers.length - 1 ? "1px solid #1a1a1a" : "none",
            borderBottom: active === i ? `2px solid ${l.color}` : "2px solid transparent",
            color: active === i ? l.color : "#4a4035",
            padding: "11px 8px", cursor: "pointer",
            fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.06em",
            transition: "all 0.2s", textAlign: "center",
          }}>{i + 1}. {l.name.split(" ")[0]}</button>
        ))}
      </div>
      <div style={{ padding: "1.5rem", borderLeft: `3px solid ${cur.color}` }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: cur.color, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
          Layer {active + 1} of {layers.length}
        </div>
        <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.2rem", fontWeight: 700, color: "#e8d5b0", marginBottom: "0.6rem" }}>{cur.name}</div>
        <p style={{ margin: "0 0 1rem", fontFamily: "'Lora', Georgia, serif", fontSize: "0.95rem", fontStyle: "italic", color: cur.color, lineHeight: 1.6 }}>{cur.oneLine}</p>
        <div style={{ marginBottom: "1rem" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.56rem", color: GREEN, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 5 }}>The pattern</div>
          <p style={{ margin: 0, fontFamily: "'Lora', Georgia, serif", fontSize: "0.88rem", color: "#a8997a", lineHeight: 1.75 }}>{cur.pattern}</p>
        </div>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.56rem", color: DANGER, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 5 }}>What happens without it</div>
          <p style={{ margin: 0, fontFamily: "'Lora', Georgia, serif", fontSize: "0.88rem", color: "#8a7a65", lineHeight: 1.75 }}>{cur.failure}</p>
        </div>
      </div>
    </div>
  );
}

function LockInSpectrum({ panels }) {
  return (
    <div className="lockspectrum-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 1, background: "#1a1a1a", border: "1px solid #1e1e1e" }}>
      {panels.map((p, i) => (
        <div key={p.id} style={{ background: "#0d0d0d", padding: "1.5rem", borderTop: `3px solid ${p.color}` }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: p.color, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>
            {p.subtitle}
          </div>
          <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.15rem", fontWeight: 700, color: "#e8d5b0", marginBottom: "0.75rem" }}>{p.name}</div>
          <div style={{ marginBottom: "1rem" }}>
            {p.examples.map((ex, j) => (
              <div key={j} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", color: "#6a5a4a", lineHeight: 1.7, paddingLeft: 10, borderLeft: `1px solid ${p.color}33`, marginBottom: 3 }}>{ex}</div>
            ))}
          </div>
          <p style={{ margin: "0 0 1rem", fontFamily: "'Lora', Georgia, serif", fontSize: "0.88rem", color: "#8a7a65", lineHeight: 1.75 }}>{p.body}</p>
          <div style={{ background: "#111", borderLeft: `2px solid ${p.color}`, padding: "8px 12px", marginBottom: "0.9rem" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: p.color, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 3 }}>Evidence</div>
            <p style={{ margin: 0, fontFamily: "'Lora', Georgia, serif", fontSize: "0.8rem", fontStyle: "italic", color: "#6a5a4a", lineHeight: 1.65 }}>{p.evidence}</p>
          </div>
          <p style={{ margin: 0, fontFamily: "'Playfair Display', Georgia, serif", fontSize: "0.95rem", fontStyle: "italic", color: p.color, lineHeight: 1.55 }}>{p.verdict}</p>
        </div>
      ))}
    </div>
  );
}
function ResilienceCategoryMatrix({ cats, matrix }) {
  const [active, setActive] = useState("RC2");
  const cat = cats.find(c => c.id === active);
  const colKey = active === "RC0" ? "rc0" : active === "RC1" ? "rc1" : "rc2";
  return (
    <div style={{ border: "1px solid #1e1e1e" }}>
      <div style={{ display: "flex", borderBottom: "1px solid #1e1e1e", background: "#0a0a0a" }}>
        {cats.map(c => (
          <button key={c.id} onClick={() => setActive(c.id)} style={{
            flex: 1, background: active === c.id ? `${c.color}15` : "transparent",
            border: "none", borderBottom: active === c.id ? `2px solid ${c.color}` : "2px solid transparent",
            color: active === c.id ? c.color : "#4a4035",
            padding: "12px 8px", cursor: "pointer",
            fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.08em",
            transition: "all 0.2s",
          }}>{c.label} — {c.rto} RTO</button>
        ))}
      </div>
      <div style={{ padding: "1rem 1.5rem", background: `${cat.color}08`, borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "0.75rem" }}>
          {[["RTO", cat.rto], ["RPO", cat.rpo], ["Test cadence", cat.tested]].map(([k, v]) => (
            <div key={k}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.52rem", color: "#4a4035", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 3 }}>{k}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.82rem", color: cat.color, fontWeight: 700 }}>{v}</div>
            </div>
          ))}
        </div>
        <p style={{ margin: 0, fontFamily: "'Lora', Georgia, serif", fontSize: "0.84rem", fontStyle: "italic", color: "#6a5a4a", lineHeight: 1.65 }}>{cat.note}</p>
      </div>
      <div>
        {matrix.map((row, i) => (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: "180px 1fr",
            borderBottom: i < matrix.length - 1 ? "1px solid #111" : "none",
            borderLeft: `2px solid ${cat.color}33`,
          }}>
            <div style={{ padding: "9px 12px", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: "#5a4a3a", background: "#0a0a0a", borderRight: "1px solid #1a1a1a", display: "flex", alignItems: "center", lineHeight: 1.5 }}>
              {row.service}
            </div>
            <div style={{ padding: "9px 14px", fontFamily: "'Lora', Georgia, serif", fontSize: "0.85rem", color: "#a8997a", lineHeight: 1.65 }}>
              {row[colKey]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReplicationTierCards({ tiers }) {
  return (
    <div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: ACCENT, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.85rem" }}>
        Replication tier · choose by RPO obligation
      </div>
      <div className="rep-tier-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "#1a1a1a", border: "1px solid #1e1e1e" }}>
        {tiers.map((t, i) => (
          <div key={i} style={{ background: "#0d0d0d", padding: "1.25rem", borderTop: `3px solid ${t.color}` }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.56rem", color: t.color, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 5 }}>{t.resCat}</div>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.15rem", fontWeight: 700, color: t.color, marginBottom: "0.7rem" }}>{t.name}</div>
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "4px 10px", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.64rem", marginBottom: "0.75rem" }}>
              <span style={{ color: "#4a4035" }}>RPO</span><span style={{ color: "#c8bfb0" }}>{t.rpo}</span>
              <span style={{ color: "#4a4035" }}>RTO</span><span style={{ color: "#c8bfb0" }}>{t.rto}</span>
            </div>
            <p style={{ margin: "0 0 0.75rem", fontFamily: "'Lora', Georgia, serif", fontSize: "0.82rem", color: "#8a7a65", lineHeight: 1.7 }}>{t.mechanism}</p>
            <div style={{ borderLeft: `2px solid ${t.color}33`, paddingLeft: 10 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.52rem", color: t.color, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 3 }}>Cost profile</div>
              <p style={{ margin: 0, fontFamily: "'Lora', Georgia, serif", fontSize: "0.79rem", fontStyle: "italic", color: "#6a5a4a", lineHeight: 1.6 }}>{t.cost}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FailoverStateMachine({ steps }) {
  const [active, setActive] = useState(0);
  const cur = steps[active];
  return (
    <div style={{ border: "1px solid #1e1e1e" }}>
      <div style={{ borderBottom: "1px solid #1e1e1e", background: "#0a0a0a", padding: "1rem 1.25rem" }}>
        <div style={{ display: "flex", gap: 4, alignItems: "center", flexWrap: "wrap" }}>
          {steps.map((s, i) => (
            <Fragment key={s.id}>
              <button onClick={() => setActive(i)} style={{
                background: i <= active ? `${s.color}18` : "transparent",
                border: `1px solid ${i === active ? s.color : i < active ? s.color + "44" : "#222"}`,
                color: i === active ? s.color : i < active ? s.color + "99" : "#3a3028",
                padding: "4px 10px", cursor: "pointer",
                fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.05em",
                transition: "all 0.2s", whiteSpace: "nowrap",
              }}>
                {String(i + 1).padStart(2, "0")} {s.label}
              </button>
              {i < steps.length - 1 && <span style={{ color: "#222", fontSize: 10, userSelect: "none", flexShrink: 0 }}>›</span>}
            </Fragment>
          ))}
        </div>
      </div>
      <div style={{ padding: "1.5rem", borderLeft: `3px solid ${cur.color}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.85rem", flexWrap: "wrap", gap: 8 }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: cur.color, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
              Step {active + 1} of {steps.length}
            </div>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.15rem", fontWeight: 700, color: "#e8d5b0" }}>{cur.label}</div>
          </div>
          <div style={{ background: `${cur.color}12`, border: `1px solid ${cur.color}33`, padding: "4px 12px" }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: cur.color, letterSpacing: "0.06em" }}>{cur.actor}</span>
          </div>
        </div>
        <p style={{ margin: "0 0 1.25rem", fontFamily: "'Lora', Georgia, serif", fontSize: "0.92rem", color: "#a8997a", lineHeight: 1.8 }}>{cur.desc}</p>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          {active > 0 && (
            <button onClick={() => setActive(active - 1)} style={{
              background: "transparent", border: "1px solid #2a2a2a", color: "#6a5a4a",
              padding: "6px 16px", cursor: "pointer",
              fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.06em",
            }}>← prev</button>
          )}
          {active < steps.length - 1 && (
            <button onClick={() => setActive(active + 1)} style={{
              background: `${cur.color}15`, border: `1px solid ${cur.color}`, color: cur.color,
              padding: "6px 16px", cursor: "pointer",
              fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.06em",
              transition: "all 0.2s",
            }}>next →</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────
export default function VoronoiPost3() {
  useEffect(() => { document.title = "When One Cloud Is Not Enough — Voronoi Part III"; }, []);

  return (
    <div style={{ background: "#0a0a0a", color: "#c8bfb0", minHeight: "100vh", fontFamily: "'Lora', Georgia, serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Lora:ital,wght@0,400;1,400&family=JetBrains+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: ${ACCENT}; }
        a { color: ${ACCENT}; }
        button:focus { outline: 1px solid ${ACCENT}55; }
        @media (max-width: 640px) {
          .hero-section { padding: 3rem 1.25rem 2.5rem !important; }
          .body-section { padding: 2rem 1.25rem 4rem !important; }
          .compare-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
          .compare-grid { min-width: 460px; }
          .token-box { font-size: 0.6rem !important; padding: 1rem 1rem !important; }
          .tabs-row { overflow-x: auto; flex-wrap: nowrap !important; }
          .tabs-row button { flex-shrink: 0 !important; }
          .lockspectrum-grid { grid-template-columns: 1fr !important; }
          .rep-tier-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="hero-section" style={{ position: "relative", padding: "5rem 2rem 4rem", borderBottom: "1px solid #1e1e1e", overflow: "hidden" }}>
        <img
          src="/assets/voronoi_part3_linkedin.png"
          alt=""
          aria-hidden="true"
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", opacity: 0.18, pointerEvents: "none", userSelect: "none" }}
        />
        <div style={{ maxWidth: 720, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: "1.5rem" }}>
            <div style={{ width: 28, height: 1, background: ACCENT }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: ACCENT, letterSpacing: "0.15em", textTransform: "uppercase" }}>
              The Voronoi Platform Architecture · Part III
            </span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 900, color: "#f0e6d0", lineHeight: 1.15, marginBottom: "1rem", marginTop: 0, letterSpacing: "-0.03em" }}>
            When One Cloud Is Not Enough
          </h1>
          <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: "1.1rem", fontStyle: "italic", color: "#8a7a65", marginBottom: "2rem", lineHeight: 1.5 }}>
            Honest architecture for moving data between AWS, GCP, and Microsoft Fabric — privately, governed, and only when it actually pays off.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 16, paddingTop: "1.5rem", borderTop: "1px solid #1e1e1e" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${ACCENT}, #3a5060)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#0a0a0a", fontWeight: 700, fontSize: 14, fontFamily: "'JetBrains Mono', monospace" }}>SV</div>
            <div>
              <div style={{ color: "#c8bfb0", fontSize: "0.85rem", fontFamily: "'JetBrains Mono', monospace" }}>Sravan Vadaga</div>
              <div style={{ color: "#4a4035", fontSize: "0.75rem", fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>May 2026 · 11 min read</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="body-section" style={{ maxWidth: 720, margin: "0 auto", padding: "3rem 2rem 6rem" }}>

        {/* §1 The day the region went down */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: "#e8d5b0", marginBottom: "1rem", marginTop: 0, letterSpacing: "-0.02em" }}>
            The day the region went down
          </h2>
          <p style={prose}>
            A Friday afternoon. A trading platform's data pipeline fails silently. The source is an
            S3 bucket in <em>eu-west-1</em>. AWS is having a regional event. It lasts four hours.
            The runbook says escalate to infrastructure. Infrastructure says wait. The business says
            it needs yesterday's positions for the morning risk report.
          </p>
          <p style={prose}>
            Nobody can do anything. The data is there — physically intact, undamaged — but
            unreachable. Every downstream system, every analytical workload, every regulatory feed
            that touches that data is frozen.
          </p>
          <div style={{ borderLeft: `3px solid ${ACCENT}`, margin: "2.5rem 0", padding: "1rem 1.5rem", background: `linear-gradient(90deg, ${ACCENT}10 0%, transparent 100%)` }}>
            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.2rem", fontStyle: "italic", color: "#e8d5b0", lineHeight: 1.6, margin: 0 }}>
              Four hours is not a catastrophe. But it is a question. What would it take for this not to happen?
            </p>
          </div>
          <p style={prose}>
            That question is the beginning of every serious multi-cloud conversation. Not vendor
            strategy. Not platform economics. A Friday afternoon and a regional event that nobody
            caused and nobody could fix.
          </p>
        </section>

        {/* §2 The first answer is multi-region */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: "#e8d5b0", marginBottom: "1rem", marginTop: 0, letterSpacing: "-0.02em" }}>
            The first answer is multi-region
          </h2>
          <p style={prose}>
            Most readers reach the question and immediately know the answer. <em>Cross-region.</em> S3
            cross-region replication for the data. A standby compute environment in another region.
            Aurora Global Database for transactional state. Route 53 failover for the application
            layer. This is well-trodden territory. AWS has built every primitive needed. So have GCP
            and Azure.
          </p>
          <p style={prose}>
            For most resilience requirements, multi-region is the correct answer. The architecture
            earns nothing by going further than the problem requires.
          </p>

          <div className="compare-wrap" style={{ margin: "1.75rem 0" }}>
          <div className="compare-grid" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: 1, background: "#1a1a1a", border: "1px solid #1e1e1e", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem" }}>
            {[
              ["Capability",           { v: "Cross-region (AWS)",      c: GREEN },  { v: "Cross-cloud (AWS→GCP)",   c: GOLD }],
              ["Data replication",     { v: "S3 CRR · minutes",         c: "#8a7a65" }, { v: "Iceberg sync · hours",   c: "#8a7a65" }],
              ["Identity",             { v: "Same IAM, same roles",     c: "#8a7a65" }, { v: "WIF · separate model",   c: "#8a7a65" }],
              ["Cost (10TB, daily)",   { v: "~$200 / month",            c: GREEN },  { v: "~$2,000–3,500 / month",   c: GOLD }],
              ["Operational team",     { v: "One team · one playbook",  c: "#8a7a65" }, { v: "Cross-trained or two",   c: "#8a7a65" }],
              ["Recovery testing",     { v: "Standard DR drill",        c: "#8a7a65" }, { v: "Bespoke · rarely done",  c: "#8a7a65" }],
            ].flatMap((row, i) => [
              <div key={`l-${i}`} style={{ background: "#0d0d0d", padding: "10px 12px", color: i === 0 ? ACCENT : "#6a5a4a", fontWeight: i === 0 ? 700 : 400, letterSpacing: i === 0 ? "0.08em" : "0" }}>{row[0]}</div>,
              <div key={`a-${i}`} style={{ background: "#0d0d0d", padding: "10px 12px", color: row[1].c, fontWeight: i === 0 ? 700 : 400, letterSpacing: i === 0 ? "0.08em" : "0" }}>{row[1].v}</div>,
              <div key={`b-${i}`} style={{ background: "#0d0d0d", padding: "10px 12px", color: row[2].c, fontWeight: i === 0 ? 700 : 400, letterSpacing: i === 0 ? "0.08em" : "0" }}>{row[2].v}</div>,
            ])}
          </div>
          </div>

          <div style={{ borderLeft: `3px solid ${ACCENT}`, margin: "2rem 0", padding: "1rem 1.5rem", background: `linear-gradient(90deg, ${ACCENT}10 0%, transparent 100%)` }}>
            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.15rem", fontStyle: "italic", color: "#e8d5b0", lineHeight: 1.6, margin: 0 }}>
              Cross-region is roughly a 10% premium. Multi-cloud is roughly a 10x premium. Multi-cloud must earn the difference.
            </p>
          </div>

          <p style={{ ...prose, marginTop: "2rem" }}>
            The three resilience categories below are the language the rest of this article uses. They
            set the RTO and RPO the architecture commits to, the recovery mechanism that delivers it,
            and the test cadence that proves it. In-region redundancy — multi-AZ on AWS, multi-zone on
            Azure — is the precondition beneath every category, not a category itself.
          </p>

          <div style={{ margin: "1.5rem 0" }}>
            <ResilienceCategoryMatrix cats={resilienceCats} matrix={serviceMatrix} />
          </div>
        </section>
        {/* §3 Five cases */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: "#e8d5b0", marginBottom: "1rem", marginTop: 0, letterSpacing: "-0.02em" }}>
            Five cases where multi-region is not enough
          </h2>
          <p style={prose}>
            Cross-region answers most resilience questions correctly. The cases below are the residual
            ones — where the architecture must reach beyond a single cloud, and where the 10x premium
            earns its place. Read each carefully. Most organisations meet two or three. A few meet all
            five. None meet zero and need this article.
          </p>

          <div style={{ margin: "1.75rem 0" }}>
            <CaseAccordion items={cases} />
          </div>

          <p style={prose}>
            None of these are theoretical. The regulatory case alone has removed the choice for most
            UK and EU financial entities. The diagnostic below distils the five cases into the
            decision a reader can take back to a Monday morning conversation.
          </p>

          <div style={{ margin: "1.75rem 0" }}>
            <ResilienceDiagnostic questions={diagnosticQuestions} verdicts={diagnosticVerdicts} />
          </div>
        </section>

        {/* §4 AWS→GCP scenario */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: "#e8d5b0", marginBottom: "1rem", marginTop: 0, letterSpacing: "-0.02em" }}>
            A producer in AWS, a consumer in GCP
          </h2>
          <p style={prose}>
            Imagine a credit risk model. The training data — customer transaction history — lives
            in AWS. It has always lived in AWS. It was built there, governed there, tested there.
            Lake Formation column-level controls restrict which columns are visible to which
            applications. The data is Tier 1. It is partly licensed from an external vendor.
          </p>
          <p style={prose}>
            The ML team has chosen GCP. Vertex AI is genuinely better for their workflow. Their
            feature store is in GCS. Their model registry is in GCP. They are not wrong. Now they
            need the transaction data.
          </p>
          <p style={prose}>
            The naive path: give the Vertex AI training job an AWS access key. Point it at S3. Done.
          </p>
          <p style={prose}>
            This is wrong for three reasons that compound.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "14px 18px", margin: "1.5rem 0", padding: "1.25rem 1.5rem", background: "#0d0d0d", border: "1px solid #1e1e1e", borderLeft: `3px solid ${DANGER}` }}>
            {[
              ["First", "It is public. An AWS access key used from a GCP workload authenticates over the public internet unless explicit private connectivity exists. Financial data over public internet. Compliance does not need the diagram to reject this."],
              ["Second", "It breaks governance. Lake Formation column controls apply to AWS principals. A GCP service account is not a principal AWS knows about. The access key bypasses Lake Formation entirely. The licensed columns the vendor requires to be restricted are now visible to the GCP training job with no audit trail."],
              ["Third", "It is invisible to provenance. CloudTrail logs an S3 GET from an access key. It does not log which GCP job, for what declared purpose, under what entitlement, against what model training run. When the data vendor audits usage six months later, the audit log shows access but not context. The organisation cannot produce the evidence the licence requires."],
            ].flatMap(([k, v], i) => [
              <div key={`k-${i}`} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", color: DANGER, letterSpacing: "0.08em", textTransform: "uppercase", paddingTop: 2 }}>{k}</div>,
              <div key={`v-${i}`} style={{ fontFamily: "'Lora', Georgia, serif", fontSize: "0.92rem", color: "#a8997a", lineHeight: 1.75 }}>{v}</div>,
            ])}
          </div>

          <div style={{ borderLeft: `3px solid ${ACCENT}`, margin: "2rem 0", padding: "1rem 1.5rem", background: `linear-gradient(90deg, ${ACCENT}10 0%, transparent 100%)` }}>
            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.15rem", fontStyle: "italic", color: "#e8d5b0", lineHeight: 1.6, margin: 0 }}>
              Three lines of configuration. Three architectural failures. The rest of this article is how to do it correctly.
            </p>
          </div>
        </section>
        {/* §4b AWS↔Azure/Fabric */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: "#e8d5b0", marginBottom: "1rem", marginTop: 0, letterSpacing: "-0.02em" }}>
            A producer in AWS, a consumer in Microsoft Fabric
          </h2>
          <p style={prose}>
            The AWS↔GCP scenario is a platform-strength decision: the ML tooling is genuinely better
            on GCP. The AWS↔Azure scenario is different in character. For many enterprise
            organisations, the driver is the reporting and finance layer — Power BI, Fabric capacity,
            the integrated OneLake surface — combined with a regulatory obligation to demonstrate
            concentration risk reduction. The workload is not migrating. It is being extended across
            a second cloud boundary, with the first cloud remaining the authoritative write surface.
          </p>
          <p style={prose}>
            The economics of this scenario are distinct. A Fabric workspace held in cold standby costs
            nothing for compute until failover. The ongoing charge is the sync and the replicated
            storage — not the processing capacity. Scale-up happens only on activation. This is the
            central economic argument for Fabric as the second cloud in a concentration-risk
            architecture: active-passive resilience at active-passive prices. The architecture
            satisfies the regulatory test without running two full compute environments simultaneously.
          </p>

          {/* The Equinix path */}
          <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.1rem", fontWeight: 700, color: ACCENT, marginBottom: "0.75rem", marginTop: "1.75rem", letterSpacing: "-0.01em" }}>
            The network path: Equinix neutral spine
          </h3>
          <p style={prose}>
            The AWS↔GCP path uses the native hyperscaler interconnect — a joint AWS/Google product
            that provisions in minutes over their shared backbone. That option does not exist for
            AWS↔Azure. The two hyperscalers have no joint fabric. The private path between them runs
            through a neutral co-location provider — typically Equinix — using Direct Connect on the
            AWS side and ExpressRoute on the Azure side, meeting in a Meet-Me-Room or cross-connect
            at the colocation facility.
          </p>

          <div style={{ background: "#0d0d0d", border: `1px solid ${ACCENT}33`, padding: "1.25rem 1.5rem", margin: "1.25rem 0", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.74rem", color: "#a8997a", lineHeight: 1.85 }}>
            <div style={{ color: ACCENT, fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>The private path — AWS ↔ Azure via Equinix</div>
            <div>AWS VPC → <span style={{ color: GREEN }}>Direct Connect</span> (dedicated 1–10 Gbps)</div>
            <div style={{ color: "#4a4035" }}>&nbsp;&nbsp;│ terminates at Equinix colocation facility</div>
            <div><span style={{ color: TEAL }}>Equinix Cross-Connect</span> (Meet-Me-Room or virtual)</div>
            <div style={{ color: "#4a4035" }}>&nbsp;&nbsp;│ meets Azure circuit at the same facility</div>
            <div><span style={{ color: GREEN }}>ExpressRoute</span> → Azure VNet (Private Peering)</div>
            <div style={{ color: "#4a4035" }}>&nbsp;&nbsp;│ MACsec optional; no public internet at any hop</div>
            <div style={{ color: ACCENT }}>ADLS Gen2 / OneLake · traffic never leaves private fabric</div>
          </div>

          <p style={prose}>
            This is a higher upfront investment than the native hyperscaler interconnect for AWS↔GCP.
            Equinix requires a colocation contract, physical or virtual cross-connects at the
            facility, and dedicated circuit ports on both sides. The port fees and cross-connect
            charges are fixed regardless of volume. It does not provision in minutes.
          </p>
          <p style={prose}>
            The investment is worth it precisely because it removes the dependency on either
            hyperscaler's cross-cloud fabric. The private path between AWS and Azure is owned and
            operated by a genuinely independent third party. Neither cloud controls the routing.
            Neither cloud's degradation — including a control-plane event on one side — affects the
            network path to the other. Under DORA's concentration risk framework, that independence
            is demonstrable, auditable, and evidence-producing in a way that a hyperscaler-managed
            cross-cloud product cannot be. The Equinix relationship becomes its own third-party
            ICT contract to manage under DORA Article 28 — that is an additional obligation, but it
            is the correct trade-off for organisations for whom regulatory evidence is non-negotiable.
          </p>

          <div style={{ borderLeft: `3px solid ${GOLD}`, margin: "2rem 0", padding: "1rem 1.5rem", background: `linear-gradient(90deg, ${GOLD}10 0%, transparent 100%)` }}>
            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.1rem", fontStyle: "italic", color: "#e8d5b0", lineHeight: 1.6, margin: 0 }}>
              A hyperscaler-managed cross-cloud product reduces operational complexity. A neutral
              colocation spine reduces concentration dependency. They are not the same thing. The
              architecture that needs to evidence the latter must build the latter.
            </p>
          </div>

          {/* The staging bucket */}
          <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.1rem", fontWeight: 700, color: ACCENT, marginBottom: "0.75rem", marginTop: "2rem", letterSpacing: "-0.01em" }}>
            The staging bucket: the controlled handoff point
          </h3>
          <p style={prose}>
            The AWS↔GCP scenario can use compute federation — the training job runs in AWS where the
            data lives, and only the model artefact crosses. That option does not apply when the
            consumption pattern requires the data to be present in Fabric: Power BI reports run
            against OneLake, not against a remote S3 table. The data must cross. But it should not
            cross directly.
          </p>
          <p style={prose}>
            The correct pattern is a governed staging bucket at the boundary. S3 Cross-Region
            Replication lands the data in a regional staging bucket. A worker validates it — schema
            check, PII classification, lineage capture, data-contract enforcement, quarantine, circuit-breaker
            — before syncing it to ADLS Gen2, where it surfaces as an OneLake shortcut or
            a materialised copy. None of this is possible if Fabric reads S3 directly through a
            shortcut. The staging bucket is the point at which the enterprise enforces its
            data contracts, not the cloud boundary itself.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "14px 18px", margin: "1.5rem 0", padding: "1.25rem 1.5rem", background: "#0d0d0d", border: "1px solid #1e1e1e", borderLeft: `3px solid ${TEAL}` }}>
            {[
              ["Data path",     "S3 → CRR → staging bucket (schema · PII · lineage · circuit-breaker) → sync worker → ADLS Gen2 → OneLake shortcut or materialised copy"],
              ["Metadata path", "iceberg-catalog-sync rewrites S3 URIs to OneLake URIs, preserves snapshot history, commits atomically to the target catalog. Metadata pointer advances only after data is confirmed present."],
              ["Policy",        "One Immuta instance pushes policy to both enforcement points — Lake Formation on AWS, Fabric layered workspace + OneLake security on Azure. Policy is not replicated: it is authored once and distributed."],
              ["Identity",      "Microsoft Entra ID is the central identity provider. AWS IAM federates to Entra. WIF grants short-lived credentials across the boundary. No static secrets, no long-lived cross-cloud access keys."],
            ].flatMap(([k, v], i) => [
              <div key={`k-${i}`} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: TEAL, letterSpacing: "0.06em", textTransform: "uppercase", paddingTop: 2 }}>{k}</div>,
              <div key={`v-${i}`} style={{ fontFamily: "'Lora', Georgia, serif", fontSize: "0.9rem", color: "#a8997a", lineHeight: 1.75 }}>{v}</div>,
            ])}
          </div>
        </section>

        {/* §5 The cross-cloud architecture */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: "#e8d5b0", marginBottom: "1rem", marginTop: 0, letterSpacing: "-0.02em" }}>
            The cross-cloud architecture
          </h2>

          {/* 5.1 highway */}
          <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.1rem", fontWeight: 700, color: ACCENT, marginBottom: "0.75rem", marginTop: "1.5rem", letterSpacing: "-0.01em" }}>
            5.1 · The highway between two clouds
          </h3>
          <p style={prose}>
            Two cities with a highway between them. The highway does not spontaneously exist because
            both cities are large. Someone builds it. Someone decides which vehicles are allowed on
            it and at what speed.
          </p>
          <p style={prose}>
            The highway between AWS and GCP — and between any pair of the three — has three proven
            forms. The right one depends on the tier of the data crossing it.
          </p>

          <div style={{ display: "grid", gap: 12, margin: "1.5rem 0" }}>
            {[
              { name: "Native hyperscaler interconnect", tag: "AWS↔GCP · the default", color: ACCENT,
                body: "AWS Interconnect – multicloud and its counterpart, Google's Partner Cross-Cloud Interconnect for AWS, became generally available in 2026 — products of a joint AWS-Google open specification. A managed 'transport' resource is created on the GCP side and accepted on the AWS side; the connection provisions in minutes on the hyperscalers' own backbones. MACsec-encrypted by default, 1 Gbps to 100 Gbps. The data is fully isolated from the public internet at every hop. No third-party fabric, no physical cross-connects to manage. For AWS↔GCP today, this is the right answer. Azure is expected to join the same open specification in 2026." },
              { name: "Compute follows data",       tag: "Licensed / jurisdictional · cleanest", color: GREEN,
                body: "The GCP ML job submits a training request. Routed to AWS EMR where the data lives. Training runs in AWS. The model artefact — megabytes, not terabytes — is what crosses. The licensed columns never leave AWS. Audit trail complete. When the data cannot move for licence or jurisdictional reasons, this is the architecture that satisfies both the regulator and the consumer." },
              { name: "Virtual cross-connect (Megaport)", tag: "Other pairings · third-party fabric", color: TEAL,
                body: "Software-defined virtual circuits over a third-party private fabric. The right answer when the pairing is not AWS↔GCP (Megaport reaches more clouds today), when multi-region routing matters, or when an existing fabric contract is in place. Adds a third vendor relationship — assess under DORA Article 28 alongside the cloud providers themselves." },
            ].map((p, i) => (
              <div key={i} style={{ background: "#0d0d0d", border: "1px solid #1e1e1e", borderLeft: `3px solid ${p.color}`, padding: "1.1rem 1.4rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8, marginBottom: "0.5rem" }}>
                  <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.05rem", fontWeight: 700, color: p.color }}>{p.name}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: p.color, letterSpacing: "0.1em", textTransform: "uppercase" }}>{p.tag}</div>
                </div>
                <p style={{ margin: 0, fontFamily: "'Lora', Georgia, serif", fontSize: "0.9rem", color: "#8a7a65", lineHeight: 1.75 }}>{p.body}</p>
              </div>
            ))}
          </div>

          <div style={{ margin: "1.75rem 0" }}>
            <CostLineCalculator tiers={tiers} patterns={patterns} />
          </div>

          <p style={{ ...prose, marginTop: "1.5rem" }}>
            Once the connectivity pattern is chosen, the next decision is how often the data crosses
            it and how tightly the replica tracks the source. This is the replication tier — a
            separate axis from the connectivity pattern, but linked to the workload's ResCat.
          </p>

          <div style={{ margin: "1.5rem 0" }}>
            <ReplicationTierCards tiers={replicationTiers} />
          </div>

          {/* 5.2 egress asymmetry */}
          <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.1rem", fontWeight: 700, color: ACCENT, marginBottom: "0.75rem", marginTop: "2.25rem", letterSpacing: "-0.01em" }}>
            5.2 · The egress asymmetry
          </h3>
          <p style={prose}>
            Cloud egress is priced. Cloud ingress is free. The direction of data flow determines who
            pays. A producer in AWS pushing to GCS incurs AWS egress charges. A consumer in GCP
            pulling from S3 incurs the same AWS egress charges — because the data leaves AWS either
            way. Compute federation avoids this entirely: only model artefacts cross the boundary,
            and they are measured in megabytes, not terabytes.
          </p>
          <p style={prose}>
            This is not a footnote. It is a first-order architectural decision. <em>The cheapest
            multi-cloud architecture is the one where the data does not move.</em> The next cheapest
            is the one where it moves rarely. The most expensive is the one that streams data across
            a cloud boundary daily — and that bill is the one finance teams discover six months in.
          </p>

          {/* 5.3 identity bridge */}
          <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.1rem", fontWeight: 700, color: ACCENT, marginBottom: "0.75rem", marginTop: "2.25rem", letterSpacing: "-0.01em" }}>
            5.3 · The identity bridge
          </h3>
          <p style={prose}>
            Private connectivity solves the network problem. It does not solve the identity problem.
            AWS knows IAM roles and STS tokens. GCP knows service accounts and Workload Identity.
            Neither knows about the other without explicit configuration.
          </p>
          <p style={prose}>
            The bridge is Workload Identity Federation. The GCP service account presents an OIDC
            token. AWS is configured to trust that token as a valid credential for a specific IAM
            role. The job receives a short-lived STS session token. Lake Formation column controls
            apply — because the IAM role is a known principal.
          </p>

          <div className="token-box" style={{ background: "#0d0d0d", border: `1px solid ${ACCENT}33`, padding: "1.25rem 1.5rem", margin: "1.25rem 0", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.74rem", color: "#a8997a", lineHeight: 1.85 }}>
            <div style={{ color: ACCENT, fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>The token exchange</div>
            <div>GCP Dataproc job (SA: <span style={{ color: GREEN }}>ml-train@project.iam</span>)</div>
            <div style={{ color: "#4a4035" }}>&nbsp;&nbsp;│ presents OIDC token to</div>
            <div>GCP Workload Identity Federation Pool</div>
            <div style={{ color: "#4a4035" }}>&nbsp;&nbsp;│ exchanges via AssumeRoleWithWebIdentity</div>
            <div>AWS STS → IAM Role <span style={{ color: GREEN }}>ml-reader@aws</span> (15 min TTL)</div>
            <div style={{ color: "#4a4035" }}>&nbsp;&nbsp;│ private connection, Lake Formation applies</div>
            <div style={{ color: ACCENT }}>S3 Iceberg table · column-level governance enforced</div>
          </div>

          <p style={prose}>
            No stored credentials. No long-lived access keys. No service account JSON files in
            environment variables. The trust is federated, the token is ephemeral, and the audit
            trail traces back to a specific GCP service account and a specific training job.
          </p>

          {/* 5.4 lock-in spectrum */}
          <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.1rem", fontWeight: 700, color: ACCENT, marginBottom: "0.75rem", marginTop: "2.25rem", letterSpacing: "-0.01em" }}>
            5.4 · The lock-in spectrum: open is not always open
          </h3>
          <p style={prose}>
            Some readers will think: a platform that works the same on all three clouds — Databricks
            or Snowflake — solves the multi-cloud problem. Others will think: open table formats like
            Iceberg are the answer. Both intuitions are partly right and partly wrong. The
            architecture has to see both ends of the spectrum.
          </p>

          <div style={{ margin: "1.5rem 0" }}>
            <LockInSpectrum panels={lockInPanels} />
          </div>

          <p style={prose}>
            Most multinational firms do not solve jurisdictional data with multi-cloud. They solve
            it with hybrid: sensitive data stays on-premises in the originating jurisdiction; cloud
            platforms host derived, aggregated, or tokenised data only. The hybrid posture is
            permanent, not transitional. The bridge between an on-premises platform and three
            different clouds must be a toolchain that runs in all four environments — with
            identical behaviour. That requirement is not a preference. It is the only way the
            architecture does not fragment at every boundary.
          </p>

          <div style={{ borderLeft: `3px solid ${GREEN}`, margin: "2rem 0", padding: "1rem 1.5rem", background: `linear-gradient(90deg, ${GREEN}10 0%, transparent 100%)` }}>
            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.15rem", fontStyle: "italic", color: "#e8d5b0", lineHeight: 1.6, margin: 0 }}>
              The architectural test for portability is precise: the tool that runs on-premises, on AWS, GCP, and Azure with identical behaviour earns its place. Vanilla Apache Spark with vanilla Apache Iceberg passes. Cloud-managed Iceberg does not — even when it claims to.
            </p>
          </div>

          <p style={prose}>
            This is not vendor lock-in for the sake of appearance. It is lock-in operating in the
            background, under labels that claim to be open. The architecture has to distinguish them
            — and choose accordingly.
          </p>

          {/* 5.5 failover state machine */}
          <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.1rem", fontWeight: 700, color: ACCENT, marginBottom: "0.75rem", marginTop: "2.25rem", letterSpacing: "-0.01em" }}>
            5.5 · The failover state machine
          </h3>
          <p style={prose}>
            Resiliency that has not been tested under realistic conditions is a hypothesis. The
            failover state machine below is not a conceptual diagram — it is the operational
            sequence every enterprise organisation must rehearse. ResCat 0 and ResCat 1 workloads
            run it twice yearly; ResCat 2 runs it annually. Completing it produces the supervisory
            artefact that satisfies DORA Article 28(8)'s requirement to test exit strategies for
            material ICT providers.
          </p>
          <div style={{ margin: "1.5rem 0" }}>
            <FailoverStateMachine steps={failoverSteps} />
          </div>
          <p style={prose}>
            Two things make this sequence work at scale. First, each runbook — Astronomer,
            Redshift, Glue, Confluent, Fabric workspace activation, Immuta parity check — has a
            single owner. The platform supplies a coordinator that sequences them. Second, the
            declaration is a human decision, not an automated trigger. At the scale and regulatory
            weight where this architecture applies, an autonomous declaration would be an audit
            finding. The machine prepares; the operator decides.
          </p>
        </section>
        {/* §6 Six invisible layers */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: "#e8d5b0", marginBottom: "1rem", marginTop: 0, letterSpacing: "-0.02em" }}>
            The six invisible layers
          </h2>
          <p style={prose}>
            Six things that make cross-cloud architecture real or make it theoretical. They are
            invisible when they work and catastrophic when they do not. Each is a layer the
            platform must build deliberately — not assume by default.
          </p>

          <div style={{ margin: "1.5rem 0" }}>
            <InvisibleLayersTabs layers={invisibleLayers} />
          </div>

          <p style={prose}>
            Break any link in this chain and the chain fails. IaC without tagging means entitlement
            has no classification signal. Entitlement without identity federation means cross-cloud
            access needs stored credentials. Lineage without OpenLineage means cross-cloud
            dependencies are invisible. Provenance without Iceberg metadata means audit answers
            take weeks. FinOps without tag discipline means cost attribution is fiction.
          </p>
        </section>

        {/* §7 What to consider */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: "#e8d5b0", marginBottom: "1rem", marginTop: 0, letterSpacing: "-0.02em" }}>
            What to consider before you commit
          </h2>
          <p style={prose}>
            Before the architecture diagram. Before the vendor selection. Five questions.
          </p>

          <ol style={{ ...prose, paddingLeft: "1.25rem", listStyle: "none", counterReset: "qcounter" }}>
            {[
              ["Is your team operationally ready?", "Multi-cloud adds boundary complexity. Every boundary is something the team will debug at 2am. A team not yet expert in one cloud should not design for two."],
              ["Which workloads actually need the second cloud?", "The Friday afternoon problem affects some workloads, not all. Identify the ones where a four-hour outage has a measurable business cost — and the workloads where regulation has removed the choice. Those are the ones that justify the infrastructure investment. The rest can wait."],
              ["Where does your data live that cannot move?", "Licensed data. Jurisdictional data. Data where copy prohibition is contractual, not architectural. These workloads must use compute federation, on-premises hybrid, or tokenisation. The choice is regulatory; the implementation is architectural."],
              ["What is your private network model?", "This must be decided before any data flows between clouds. If the answer is 'public internet with TLS', there is no multi-cloud data architecture — there are two cloud environments sharing data insecurely."],
              ["What does success look like in six months?", "Not the architecture diagram. Not the vendor contracts. One data product, accessible privately from both clouds, with complete provenance, governed by one entitlement service, with cost attributed to its consumers. That is the target. Everything else follows from getting that right."],
            ].map(([q, a], i) => (
              <li key={i} style={{ counterIncrement: "qcounter", marginBottom: "1.25rem", paddingLeft: "2.25rem", position: "relative" }}>
                <span style={{ position: "absolute", left: 0, top: 2, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem", color: ACCENT, fontWeight: 700 }}>{String(i + 1).padStart(2, "0")}</span>
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.02rem", fontWeight: 700, color: "#e8d5b0", marginBottom: "0.4rem" }}>{q}</div>
                <p style={{ margin: 0, fontFamily: "'Lora', Georgia, serif", fontSize: "0.92rem", color: "#8a7a65", lineHeight: 1.75 }}>{a}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* TL;DR */}
        <div style={{ background: "#0d0d0d", border: "1px solid #1e1e1e", borderLeft: `3px solid ${ACCENT}`, padding: "1.75rem", margin: "3rem 0 2rem" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "#4a4035", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1rem" }}>
            The point — in one paragraph
          </div>
          <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.05rem", fontStyle: "italic", color: "#c8bfb0", lineHeight: 1.8, margin: 0 }}>
            Multi-cloud is not three clouds with data in each. It is the deliberate placement of
            workloads in the cell where each genuinely belongs — and the private, federated,
            provenance-carrying infrastructure that lets data cross between cells when it must, and
            refuses to let it cross when it must not. AWS is a cell. GCP is a cell. Azure is a cell.
            The architecture does not resist their gravity — it works with it. The architecture
            earns its place per data product, not per organisation.
          </p>
        </div>

        {/* Coming Next · Part IV */}
        <div style={{ borderTop: "1px solid #1e1e1e", paddingTop: "2rem", marginTop: "3rem" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: "#4a4035", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            Coming Next · Part IV
          </div>
          <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.25rem", color: ACCENT, marginBottom: "0.75rem" }}>
            The Marketplace Plane: Governed Discovery and Consumption
          </div>
          <p style={{ ...prose, color: "#4a4035", marginBottom: 0 }}>
            The boundaries between clouds are private. The identities that cross them are federated.
            The costs of crossing them are understood and attributed. Now the question is how data
            products are published, discovered, and consumed across that architecture — how a
            producer in AWS knows their GCP consumers, how a licensed dataset proves it is within
            its seat count, and how a single platform serves both analytical and operational
            patterns from the same governed substrate.
          </p>
        </div>

        {/* References */}
        <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: "2rem", marginTop: "3rem" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: "#4a4035", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            References
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#6a5a4a", lineHeight: 1.95 }}>
            <div>· UK PRA Supervisory Statement SS2/21 — Outsourcing and third party risk management (Bank of England, March 2021; in force March 2022)</div>
            <div>· EU DORA — Regulation (EU) 2022/2554, directly applicable from 17 January 2025</div>
            <div>· DORA Article 28(4) and Article 29 — preliminary assessment of ICT concentration risk at entity level</div>
            <div>· DORA Article 28(8) — exit strategies for material ICT providers; for CTPPs, tested at least annually</div>
            <div>· ESAs first CTPP designation list (18 November 2025) — 19 designated providers including AWS, Microsoft, Google Cloud, Oracle, SAP, Equinix, Bloomberg, IBM, Kyndryl, FIS, LSEG</div>
            <div>· Microsoft OneLake Iceberg support via Apache XTable — V2 only; V3 in roadmap (Microsoft Learn, 2025)</div>
            <div>· Apache XTable — currently Apache Incubating; cross-format omni-directional interop layer</div>
            <div>· AWS Interconnect – multicloud · GA 2026 — joint AWS/Google open specification for private hyperscaler-to-hyperscaler connectivity</div>
            <div>· GCP Partner Cross-Cloud Interconnect for AWS — managed MACsec-encrypted transport, 1–100 Gbps, no public internet at any hop</div>
          </div>
        </div>

        {/* Back link to Part II */}
        <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: "2rem", marginTop: "3rem" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: "#4a4035", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            Part II
          </div>
          <a href="/writing/voronoi-ii" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1rem", color: TEAL, textDecoration: "none" }}>
            The Physical and Catalog Planes — Apache Iceberg, federated catalogs, cloud economics →
          </a>
        </div>

        {/* Tags */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid #1a1a1a" }}>
          {["Multi-Cloud", "Cross-Region", "DORA", "CTPP", "PRA SS2/21", "Concentration Risk", "Workload Identity Federation", "Private Networking", "AWS Interconnect – multicloud", "Partner Cross-Cloud Interconnect", "Megaport", "Compute Federation", "Egress Asymmetry", "Hybrid Cloud", "Jurisdictional Sovereignty", "Tokenisation", "Apache XTable", "Apache Polaris", "OpenLineage", "Provenance", "FinOps", "Lock-In Spectrum", "Platform Engineering", "Tier-1 Banking"].map(tag => (
            <span key={tag} style={{ background: "#111", border: "1px solid #222", color: "#4a4035", padding: "4px 10px", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.06em" }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
