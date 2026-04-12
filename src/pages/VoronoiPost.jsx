import { useState, useEffect, useRef } from "react";

const post = {
  series: "The Voronoi Platform Architecture",
  episode: "Part I",
  title: "The Equilibrium Principle for Enterprise Data",
  subtitle: "The mathematics of equal forces — and what it means for enterprise data",
  author: "Sravan Kumar",
  readTime: "14 min read",
  date: "April 2026",
};

const forces = [
  {
    id: 1,
    angle: 90,
    label: "Physical Sovereignty",
    short: "Storage & Compute",
    color: "#c87941",
    description:
      "Domain-owned storage and compute as a single sovereign unit. Each domain owns its lakehouse, its engines, and its data products. The immutable ground truth no process, model, or engineer can quietly rewrite.",
  },
  {
    id: 2,
    angle: 30,
    label: "Intelligence",
    short: "AI & ML",
    color: "#7b9eb8",
    description:
      "Prediction, inference, generative response. Hungry and powerful — the force that turns data into decisions.",
  },
  {
    id: 3,
    angle: -30,
    label: "Data Marketplace",
    short: "Marketplace",
    color: "#8aab7a",
    description:
      "The governed exchange layer where domain data products are published, discovered, and consumed — internally across domains and externally with SaaS and PaaS ecosystems. Not ingestion pipelines. A living marketplace of trusted data products.",
  },
  {
    id: 4,
    angle: -90,
    label: "Observability",
    short: "Health",
    color: "#b8847b",
    description:
      "The platform's nervous system. Pipeline health, inference telemetry, cost signals. A platform that cannot see itself cannot be trusted.",
  },
  {
    id: 5,
    angle: -150,
    label: "Governance",
    short: "Policy",
    color: "#9b8ab8",
    description:
      "Provenance, classification, lineage, accountability. The force that makes data trustworthy to regulators, auditors, and the organisation.",
  },
  {
    id: 6,
    angle: 150,
    label: "Security",
    short: "Zero Trust",
    color: "#b8a87a",
    description:
      "Not a feature. Not a layer. A sovereign force asking of every other force: on what terms?",
  },
];

const deformations = [
  {
    name: "The Security Fortress",
    symptom: "Secure and unused",
    shape: [0.5, 1.0, 0.5, 0.5, 0.5, 0.5],
    description:
      "Security consumes the geometry. Provisioning takes months. AI is blocked. Marketplace connectivity is strangled by gateway controls. Domain teams cannot publish or consume data products without six approval layers. The platform is a fortress nobody enters voluntarily.",
    industry: "Banking · Insurance · Defence",
    color: "#b8847b",
  },
  {
    name: "The Data Swamp",
    symptom: "Petabytes, no answers",
    shape: [1.0, 0.3, 0.3, 0.2, 0.3, 0.4],
    description:
      "The physical layer grew unchecked. Storage is vast and compute is abundant. Ingestion pipelines multiply. But no domain owns anything — a central team owns everything and nobody is accountable. Data products don't exist. Consumers queue for access to raw tables nobody trusts. Governance is aspirational. The marketplace is empty.",
    industry: "Enterprise · Data Lake Era 2015–2020",
    color: "#c87941",
  },
  {
    name: "The AI Gold Rush",
    symptom: "Exciting until the regulator arrives",
    shape: [0.5, 1.0, 0.6, 0.4, 0.2, 0.3],
    description:
      "Post-2023. GenAI use cases explode faster than governance responds. Models train on unclassified data. Inference is ungoverned. The hexagon collapses inward.",
    industry: "Tech · Financial Services · Healthcare",
    color: "#7b9eb8",
  },
  {
    name: "The Vendor Republic",
    symptom: "Locally rational, globally chaotic",
    shape: [0.6, 0.5, 0.7, 0.4, 0.3, 0.5],
    description:
      "Finance chose Snowflake. Marketing chose Databricks. Operations chose Fabric. Each domain owns its compute — which is correct data mesh thinking — but nobody owns the interoperability. No federated catalog. No shared data product contracts. No marketplace where domains can discover each other's products. Domain sovereignty without platform coherence.",
    industry: "Large Enterprise · Post-Merger",
    color: "#8aab7a",
  },
  {
    name: "The Compliance Theatre",
    symptom: "Looks governed, isn't",
    shape: [0.5, 0.4, 0.4, 0.4, 0.9, 0.5],
    description:
      "A data catalogue populated three years ago. Lineage covering ETL but not AI inference. Classification tags that exist in Purview but don't drive access decisions. Governance as decoration.",
    industry: "Regulated Industries · Post-Audit",
    color: "#9b8ab8",
  },
];

function HexagonDiagram({ forces, size = 200, animated = false }) {
  const [hovered, setHovered] = useState(null);
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.36;
  const innerR = size * 0.22;

  const hexPoints = forces.map((f, i) => {
    const angle = (Math.PI / 180) * (f.angle - 90);
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      ix: cx + innerR * Math.cos(angle),
      iy: cy + innerR * Math.sin(angle),
    };
  });

  const outerPath = hexPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + " Z";

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <radialGradient id="hexGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#c87941" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#c87941" stopOpacity="0" />
          </radialGradient>
          {forces.map((f) => (
            <radialGradient key={f.id} id={`fg${f.id}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={f.color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={f.color} stopOpacity="0" />
            </radialGradient>
          ))}
        </defs>

        {/* Outer hex fill */}
        <path d={outerPath} fill="url(#hexGlow)" stroke="#c87941" strokeWidth="1" strokeOpacity="0.4" />

        {/* Inner spokes */}
        {hexPoints.map((p, i) => (
          <line
            key={i}
            x1={cx} y1={cy}
            x2={p.x} y2={p.y}
            stroke={forces[i].color}
            strokeWidth={hovered === i ? 1.5 : 0.5}
            strokeOpacity={hovered === i ? 0.8 : 0.25}
            style={{ transition: "all 0.3s" }}
          />
        ))}

        {/* 120° angle indicators */}
        {hexPoints.map((p, i) => {
          const next = hexPoints[(i + 1) % 6];
          const mx = (p.x + next.x) / 2;
          const my = (p.y + next.y) / 2;
          const dx = mx - cx;
          const dy = my - cy;
          const len = Math.sqrt(dx * dx + dy * dy);
          const lx = cx + (dx / len) * (innerR * 0.6);
          const ly = cy + (dy / len) * (innerR * 0.6);
          return (
            <text key={i} x={lx} y={ly} fill="#666" fontSize="6" textAnchor="middle" dominantBaseline="middle" opacity="0.5">
              120°
            </text>
          );
        })}

        {/* Hex boundary lines */}
        {hexPoints.map((p, i) => {
          const next = hexPoints[(i + 1) % 6];
          return (
            <line
              key={i}
              x1={p.x} y1={p.y}
              x2={next.x} y2={next.y}
              stroke="#555"
              strokeWidth="0.5"
              strokeOpacity="0.4"
              strokeDasharray="3,3"
            />
          );
        })}

        {/* Force nodes */}
        {hexPoints.map((p, i) => (
          <g key={i}
            style={{ cursor: "pointer" }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}>
            <circle
              cx={p.x} cy={p.y} r={hovered === i ? 14 : 10}
              fill="#0d0d0d"
              stroke={forces[i].color}
              strokeWidth={hovered === i ? 2 : 1}
              style={{ transition: "all 0.3s" }}
            />
            <text
              x={p.x} y={p.y}
              fill={forces[i].color}
              fontSize="5.5"
              textAnchor="middle"
              dominantBaseline="middle"
              fontWeight="600"
            >
              {forces[i].short}
            </text>
          </g>
        ))}

        {/* Centre */}
        <circle cx={cx} cy={cy} r="3" fill="#c87941" opacity="0.6" />
      </svg>

      {/* Tooltip */}
      {hovered !== null && (
        <div style={{
          position: "absolute",
          bottom: "calc(100% + 8px)",
          left: "50%",
          transform: "translateX(-50%)",
          background: "#1a1a1a",
          border: `1px solid ${forces[hovered].color}44`,
          borderLeft: `2px solid ${forces[hovered].color}`,
          padding: "8px 12px",
          width: 200,
          zIndex: 10,
          pointerEvents: "none",
        }}>
          <div style={{ color: forces[hovered].color, fontSize: 11, fontWeight: 700, marginBottom: 4, fontFamily: "monospace" }}>
            {forces[hovered].label}
          </div>
          <div style={{ color: "#999", fontSize: 10, lineHeight: 1.5 }}>
            {forces[hovered].description}
          </div>
        </div>
      )}
    </div>
  );
}

function DeformationChart({ shape, color, size = 120 }) {
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.38;

  const angles = [90, 30, -30, -90, -150, 150].map(a => (Math.PI / 180) * (a - 90));

  const idealPoints = angles.map(a => ({
    x: cx + maxR * Math.cos(a),
    y: cy + maxR * Math.sin(a),
  }));

  const deformedPoints = angles.map((a, i) => ({
    x: cx + maxR * shape[i] * Math.cos(a),
    y: cy + maxR * shape[i] * Math.sin(a),
  }));

  const idealPath = idealPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + " Z";
  const deformedPath = deformedPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + " Z";

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <path d={idealPath} fill="none" stroke="#333" strokeWidth="1" strokeDasharray="2,2" />
      <path d={deformedPath} fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.5" />
      {deformedPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="2.5" fill={color} opacity="0.7" />
      ))}
      <circle cx={cx} cy={cy} r="2" fill={color} opacity="0.5" />
    </svg>
  );
}

function PullQuote({ children }) {
  return (
    <div style={{
      borderLeft: "3px solid #c87941",
      margin: "2.5rem 0",
      padding: "1rem 1.5rem",
      background: "linear-gradient(90deg, #c8794108 0%, transparent 100%)",
    }}>
      <p style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: "1.25rem",
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

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: "3rem" }}>
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

export default function VoronoiBlogPost() {
  const [activeDeformation, setActiveDeformation] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
        ::-webkit-scrollbar-thumb { background: #c87941; }
        a { color: #c87941; }
      `}</style>

      {/* Hero */}
      <div style={{
        position: "relative",
        padding: "5rem 2rem 4rem",
        borderBottom: "1px solid #1e1e1e",
        overflow: "hidden",
      }}>
        {/* Voronoi background pattern */}
        <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0.04, pointerEvents: "none" }}
          viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
          {[
            "M120,80 L280,60 L320,180 L200,220 Z",
            "M280,60 L460,40 L480,160 L320,180 Z",
            "M460,40 L620,80 L600,200 L480,160 Z",
            "M620,80 L760,120 L720,240 L600,200 Z",
            "M200,220 L320,180 L360,320 L240,360 Z",
            "M320,180 L480,160 L500,300 L360,320 Z",
            "M480,160 L600,200 L620,320 L500,300 Z",
            "M600,200 L720,240 L700,360 L620,320 Z",
          ].map((d, i) => (
            <path key={i} d={d} fill="none" stroke="#c87941" strokeWidth="1" />
          ))}
        </svg>

        <div style={{ maxWidth: 720, margin: "0 auto", position: "relative" }}>
          {/* Series label */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            marginBottom: "1.5rem",
          }}>
            <div style={{
              width: 28, height: 1, background: "#c87941",
            }} />
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.7rem",
              color: "#c87941",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}>
              {post.series} · {post.episode}
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
            fontSize: "1.15rem",
            fontStyle: "italic",
            color: "#8a7a65",
            marginBottom: "2rem",
            lineHeight: 1.5,
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
              background: "linear-gradient(135deg, #c87941, #7b5a2a)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#0a0a0a", fontWeight: 700, fontSize: 14,
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              SK
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

        {/* Opening */}
        <Section title="">
          <P>
            In September 1854, physician John Snow stood over a map of Soho, London, plotting cholera deaths
            street by street. Five hundred people had died in ten days. The accepted theory was miasma —
            bad air from the Thames. Snow didn't believe it.
          </P>
          <P>
            He drew a different kind of map. Around each water pump in the neighbourhood, he traced a
            boundary — the line of points exactly equidistant between that pump and every other. Each
            boundary point was precisely as far from one pump as the next. The diagram that emerged — we
            now call it a Voronoi diagram — partitioned Soho into cells of proximity, each cell belonging
            to its nearest pump.
          </P>
          <P>
            Every death clustered inside a single cell. The pump on Broad Street. Snow had the handle
            removed. The outbreak ended within days.
          </P>
          <P>
            The mathematics of equal competing forces, drawn as boundaries of equidistance, solved a
            public health crisis. The same mathematics governs the hexagonal columns rising from the sea
            at the Giant's Causeway — cooling lava contracting under equal thermal stress, fracturing
            always at 120°, always hexagonal, because that is the geometry of equilibrium. It governs
            honeycomb, soap bubbles meeting in foam, the cell walls of living tissue, the territories of
            nesting animals.
          </P>

          <PullQuote>
            The hexagon is not a design choice. It is what equilibrium looks like when you draw it.
          </PullQuote>

          <P>
            Your enterprise data platform has the same problem cooling lava has. Six competing forces.
            Equal pressure from every direction simultaneously. No natural dominant axis. And in many
            cases — perhaps most at scale — it isn't hexagonal. It's deformed. And that deformation
            is a recurring pattern beneath many of the adoption failures, governance gaps, and
            operational crises that data platform teams encounter most frequently.
          </P>
          <P>
            This is the first essay in a series about the architecture that emerges when those forces
            reach genuine equilibrium. We call it the <em>Voronoi Platform Architecture</em>.
          </P>
        </Section>

        {/* Six Forces */}
        <Section title="The Six Forces">
          <P>
            Before we name the deformations, we have to name the forces. Not the tools. Not the
            vendors. Not the product categories. The fundamental, irreducible forces that every
            enterprise data platform at scale must simultaneously satisfy — and that will pull the
            architecture apart if any one of them is allowed to dominate.
          </P>

          {/* Hexagon diagram */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            margin: "2.5rem 0",
            padding: "2rem",
            background: "#0d0d0d",
            border: "1px solid #1e1e1e",
          }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.65rem",
              color: "#4a4035",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}>
              Hover to explore each force
            </div>
            <HexagonDiagram forces={forces} size={260} />
            <div style={{
              fontFamily: "'Lora', Georgia, serif",
              fontSize: "0.8rem",
              fontStyle: "italic",
              color: "#4a4035",
              textAlign: "center",
            }}>
              The Voronoi Platform Architecture — six sovereign forces at 120° equilibrium
            </div>
          </div>

          <P>
            <strong style={{ color: "#e8d5b0" }}>Physical Sovereignty.</strong>{" "}
            In a data mesh, a domain owns its data products end to end — and that means owning both
            the storage substrate and the compute engines that process it. These are not separable
            concerns. A domain that owns its Gold Iceberg tables in S3 but shares a central Spark
            cluster with fifteen other domains does not truly own its data product — it owns a file.
            Physical Sovereignty is the force that pulls toward complete domain autonomy over the
            full storage-and-compute stack: the lakehouse partition, the processing engine, the table
            format, the commit protocol.
          </P>
          <P style={{ color: "#9a8a75" }}>
            <em>This force is most relevant to platform architects and domain leads defining ownership
            boundaries and provisioning models.</em>
          </P>
          <P>
            Raw events are the immutable ground truth. The domain's compute transforms that truth into
            data products. Both are sovereign. Neither can be commandeered by a central team, a
            downstream pipeline, or a model output without the domain's explicit contract. When this
            force is weak — when compute is centralised, when storage is shared without formal
            ownership — the data mesh collapses into a data lake with a new name.
          </P>
          <P>
            <strong style={{ color: "#e8d5b0" }}>Intelligence.</strong>{" "}
            Data without inference is archive. This force pulls toward prediction, pattern recognition,
            generative response, autonomous decision. It is hungry — it consumes the physical layer and
            produces something new. A credit risk model. A customer churn prediction. A natural
            language answer to a CFO's question at eleven on a Wednesday night. It is also dangerous
            unconstrained. Without boundaries, it consumes governance, it consumes compliance, it
            consumes trust.
          </P>
          <P>
            <strong style={{ color: "#e8d5b0" }}>Data Marketplace.</strong>{" "}
            The data mesh principle of data as a product is meaningless without a place to discover,
            evaluate, and consume those products. The Data Marketplace force pulls the architecture
            toward a governed exchange layer — internal and external simultaneously. Internally, domain
            data products are published with SLAs, quality scores, lineage, and classification, and
            consumed by other domains without bilateral agreements or central mediation. Externally,
            the marketplace extends to the SaaS and PaaS ecosystem — Salesforce, SAP, ServiceNow —
            not as ingestion sources but as bidirectional participants. Analytical intelligence computed
            in the lakehouse flows back into operational systems as enriched data products. A customer
            risk score computed by the risk domain becomes a field in Salesforce. A demand forecast
            from the supply chain domain updates an SAP planning record. The marketplace is not a
            portal. It is the force that makes the mesh economically alive.
          </P>
          <P>
            <strong style={{ color: "#e8d5b0" }}>Observability.</strong>{" "}
            A platform that cannot see itself cannot be trusted. This force pulls toward comprehensive
            self-awareness — pipeline latency, query performance, AI inference telemetry, storage cost
            signals, security events, capacity utilisation across every engine in a polyglot
            architecture. It is the platform's nervous system. Without it, problems are invisible until
            they are catastrophic, and catastrophic problems in regulated industries have names attached
            to them.
          </P>
          <P>
            <strong style={{ color: "#e8d5b0" }}>Governance.</strong>{" "}
            Data without provenance is noise. Data without classification is a liability. Data without
            lineage cannot be audited, cannot satisfy GDPR, cannot support a credit decision challenged
            in court. This force pulls toward policy, contract, and accountability. It demands that
            every dataset knows its origin, its owner, its classification tier, its consumers, and its
            regulatory obligations. It resists velocity and resists informality. It is the force that
            makes data trustworthy — not just to engineers, but to auditors, regulators, and the
            organisation's legal counsel.
          </P>
          <P>
            <strong style={{ color: "#e8d5b0" }}>Security.</strong>{" "}
            Not a feature. Not a perimeter. Not a JIRA ticket assigned to the infosec team. A sovereign
            force that asks a single question of every other force: <em>on what terms?</em> Identity
            federation, network topology, zero-trust policy, encryption at every boundary, admin
            activity monitoring across every engine. This force sets the conditions under which all
            other forces are permitted to operate. It is not the wall around the platform. It is the
            physics the platform operates within.
          </P>
        </Section>

        {/* 120° Principle */}
        <Section title="The 120° Principle">
          <P style={{ color: "#9a8a75" }}>
            <em>This section is for architects and platform leads making decisions about how forces
            are governed at their boundaries — not which tools to use, but how authority is
            distributed between them.</em>
          </P>
          <P>
            Here is the architectural insight that changes how you think about platform design — and
            why it took a mathematician named Georgy Voronoi, a physician named John Snow, and sixty
            million years of cooling lava to arrive at it.
          </P>
          <P>
            In the basalt columns at the Giant's Causeway, adjacent fractures meet at 120°. Not because
            a geologist calculated the optimal angle. Because at 120°, neither crack dominates the
            other. The thermal stress is perfectly distributed across the boundary. The structure is
            stable. Any other angle — any departure from 120° — creates an asymmetric stress field that
            will eventually fracture further, or cause neighbouring cells to absorb the imbalance until
            they too crack.
          </P>
          <P>
            In the Voronoi diagram, the boundary between any two cells is the line of points exactly
            equidistant from both seeds. Neither cell has claim over the boundary. It belongs equally
            to both. The tessellation is complete — no gaps, no overlaps — precisely because every
            boundary is governed by this principle of equal claim.
          </P>
          <P>
            In your data platform, adjacent forces meet at boundaries. The question at every boundary
            is the same question the cooling lava answered: does either force dominate?
          </P>

          <div style={{
            background: "#0d0d0d",
            border: "1px solid #1e1e1e",
            padding: "1.5rem",
            margin: "2rem 0",
          }}>
            {[
              ["Physical Sovereignty ↔ Intelligence", "Domain-owned compute powers AI feature engineering and model training. But intelligence does not commandeer domain storage or rewrite domain data products. Model outputs are new data products in their own right — with their own domain owner, lineage, and SLA. Neither force absorbs the other."],
              ["Intelligence ↔ Data Marketplace", "AI-generated predictions and insights are published to the marketplace as first-class data products — discoverable, versioned, and governed like any other domain output. But marketplace demand signals do not directly retrain production models without governance gates and domain owner approval. Neither dominates."],
              ["Data Marketplace ↔ Observability", "Every data product published to the marketplace — internal or external — is subject to the same observability standards as internal pipelines. SLA compliance, freshness, quality scores, and consumer telemetry are visible to the platform. But observability does not control what is published or how products are priced and contracted. Neither dominates."],
              ["Observability ↔ Governance", "Health signals feed governance decisions — a data product consistently breaching its quality SLA triggers a governance review and potential deprecation. But compliance and classification rules govern what observability telemetry can be retained, for how long, and who can query it. Neither dominates."],
              ["Governance ↔ Security", "Data classification propagates automatically from the governance plane into access control enforcement across every engine — Databricks, Snowflake, Fabric, Lake Formation — without human mediation. But security cannot override governance lineage, suppress audit records, or redact provenance when inconvenient. Neither dominates."],
              ["Security ↔ Physical Sovereignty", "Zero-trust identity and network policy protect the domain storage and compute boundary absolutely. But even the highest privilege security principal cannot alter a domain's immutable data product or bypass its schema contract. The domain's physical integrity is not a security configuration. Neither dominates."],
            ].map(([boundary, description], i) => (
              <div key={i} style={{
                borderBottom: i < 5 ? "1px solid #1a1a1a" : "none",
                padding: "1rem 0",
              }}>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.7rem",
                  color: "#c87941",
                  marginBottom: 6,
                  letterSpacing: "0.05em",
                }}>
                  {boundary}
                </div>
                <div style={{
                  fontFamily: "'Lora', Georgia, serif",
                  fontSize: "0.9rem",
                  color: "#8a7a65",
                  lineHeight: 1.7,
                }}>
                  {description}
                </div>
              </div>
            ))}
          </div>

          <PullQuote>
            When every adjacent boundary is at equilibrium — when no force dominates its neighbour —
            the platform is hexagonal. Stable. Like the basalt column. Like the Voronoi cell. Like the
            honeycomb.
          </PullQuote>

          <P>
            When any force dominates — the geometry deforms. And deformed platforms fail in ways that
            are predictable, diagnosable, and — with the right patterns — recoverable.
          </P>
        </Section>

        {/* When Equality Isn't Possible */}
        <Section title="When Equality Isn't Possible">
          <P>
            The 120° principle is an architectural target, not an organisational given. Real enterprises
            have legacy systems that pre-date the mesh, budget cycles that fund one force at the expense
            of others, and CISOs who will not cede ground regardless of the geometric argument. Acknowledging
            this is not a concession — it is the starting point for practical progress.
          </P>
          <P>
            Three patterns have proven durable when genuine equilibrium is temporarily out of reach:
          </P>

          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 0,
            margin: "1.5rem 0",
            border: "1px solid #1e1e1e",
          }}>
            {[
              {
                number: "01",
                title: "The Arbitration Board with Timeboxed Escalation",
                body: "When two forces conflict — say, Security demanding network isolation that prevents the Data Marketplace from operating cross-cloud — establish a standing architecture forum with a fixed escalation window. The forum's mandate is not to pick a winner but to agree a minimum viable boundary: what is the least restrictive security posture that satisfies the threat model? What is the minimum marketplace capability that satisfies the domain's SLA? Timebox the resolution to two weeks. If unresolved, the platform default applies — which should always favour the more conservative force temporarily, with a documented review date. The key discipline is that the conflict is explicitly registered, owned, and time-limited. Unresolved force conflicts that drift without ownership are the most common cause of permanent deformation.",
                color: "#c87941",
              },
              {
                number: "02",
                title: "Temporary Bilateral SLAs as Guardrails",
                body: "When a force cannot be brought to equilibrium globally, scope the imbalance explicitly. A Security Fortress deformation in the network layer does not have to infect the semantic layer. Define a bilateral SLA between the two forces in conflict — Security and Data Marketplace, for example — that specifies what the constrained force can do within the current constraints, and what the dominant force commits to relaxing over a defined timeline. This turns a structural imbalance into a managed transition. The bilateral SLA is reviewed quarterly. It prevents the temporary constraint from becoming permanent architecture by keeping the tension visible and contractually bounded.",
                color: "#7b9eb8",
              },
              {
                number: "03",
                title: "Guardrail Automation Enforcing Minimums",
                body: "The most durable pattern: encode the minimum acceptable posture for every force as automated policy, enforced in CI before any infrastructure change is applied. OPA policies asserting that no domain provisioning can proceed without observability agents configured. Terraform checks that reject workspace creation without a governance classification tag. Pipeline gates that block model registration without lineage metadata. These automation guardrails do not achieve equilibrium — but they prevent any force from being driven below its minimum viable contribution. A platform with enforced minimums across all six forces will deform under pressure but will not collapse. It preserves the geometry's skeleton even when the flesh is under stress.",
                color: "#8aab7a",
              },
            ].map((p, i) => (
              <div key={i} style={{
                padding: "1.5rem",
                borderBottom: i < 2 ? "1px solid #1a1a1a" : "none",
                borderLeft: `3px solid ${p.color}`,
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 12,
                  marginBottom: "0.75rem",
                }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.65rem",
                    color: p.color,
                    opacity: 0.7,
                  }}>{p.number}</span>
                  <span style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#e8d5b0",
                  }}>{p.title}</span>
                </div>
                <div style={{
                  fontFamily: "'Lora', Georgia, serif",
                  fontSize: "0.92rem",
                  color: "#8a7a65",
                  lineHeight: 1.8,
                }}>
                  {p.body}
                </div>
              </div>
            ))}
          </div>

          <P>
            These patterns do not replace the equilibrium target. They are the engineering discipline
            for moving toward it when the organisational physics won't allow a direct path.
          </P>

        {/* Deformations */}
        <Section title="The Deformation Catalogue">
          <P style={{ color: "#9a8a75" }}>
            <em>For CDOs, platform leads, and architects diagnosing why a platform investment
            hasn't delivered the expected returns.</em>
          </P>
          <P>
            Walk into many large enterprises and you will find one of five recognisable shapes. The
            deformation tells you a great deal about the platform's history — which team had the most
            budget, which incident drove the last major investment, which vendor won the last RFP.
            None of these patterns are hypothetical. Each maps to documented failure modes that have
            appeared repeatedly across the industry.
          </P>

          {/* Deformation selector */}
          <div style={{ margin: "2rem 0" }}>
            <div style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              marginBottom: "1.5rem",
            }}>
              {deformations.map((d, i) => (
                <button
                  key={i}
                  onClick={() => setActiveDeformation(i)}
                  style={{
                    background: activeDeformation === i ? d.color + "22" : "transparent",
                    border: `1px solid ${activeDeformation === i ? d.color : "#2a2a2a"}`,
                    color: activeDeformation === i ? d.color : "#4a4035",
                    padding: "6px 12px",
                    cursor: "pointer",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.65rem",
                    letterSpacing: "0.08em",
                    transition: "all 0.2s",
                  }}
                >
                  {d.name.replace("The ", "")}
                </button>
              ))}
            </div>

            {/* Active deformation detail */}
            {(() => {
              const d = deformations[activeDeformation];
              return (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  gap: "1.5rem",
                  background: "#0d0d0d",
                  border: `1px solid ${d.color}33`,
                  borderLeft: `3px solid ${d.color}`,
                  padding: "1.5rem",
                  alignItems: "start",
                }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <DeformationChart shape={d.shape} color={d.color} size={130} />
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.6rem",
                      color: "#4a4035",
                      textAlign: "center",
                      maxWidth: 110,
                    }}>
                      dashed = ideal hexagon
                    </div>
                  </div>
                  <div>
                    <div style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: "1.2rem",
                      fontWeight: 700,
                      color: d.color,
                      marginBottom: 4,
                    }}>
                      {d.name}
                    </div>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.65rem",
                      color: "#4a4035",
                      marginBottom: "0.75rem",
                      letterSpacing: "0.08em",
                    }}>
                      {d.industry}
                    </div>
                    <div style={{
                      fontFamily: "'Lora', Georgia, serif",
                      fontSize: "0.95rem",
                      color: "#8a7a65",
                      lineHeight: 1.75,
                      marginBottom: "0.75rem",
                    }}>
                      {d.description}
                    </div>
                    <div style={{
                      display: "inline-block",
                      background: d.color + "15",
                      border: `1px solid ${d.color}33`,
                      padding: "4px 10px",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.65rem",
                      color: d.color,
                    }}>
                      Symptom: {d.symptom}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          <P>
            None of these deformations emerged from malice or incompetence. Every one is the result
            of a rational local decision — the security team doing their job, the storage team scaling
            to meet demand, the AI team responding to board-level pressure to ship GenAI use cases.
            The pattern repeats across industries and geographies because the forces are universal.
            What varies is which force the organisation's history and incentives allow to dominate.
          </P>

          {/* Real-world references */}
          <div style={{
            background: "#0d0d0d",
            border: "1px solid #1e1e1e",
            borderLeft: "3px solid #4a4035",
            padding: "1.25rem 1.5rem",
            margin: "1.5rem 0",
          }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.6rem",
              color: "#4a4035",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}>
              Documented Patterns in the Industry
            </div>
            {[
              {
                ref: "NHS Data Programme (2003–2011)",
                note: "A £12.7bn centralised data infrastructure programme that became one of the most studied examples of the Data Swamp deformation at national scale — vast central storage investment, negligible domain ownership, and governance that existed on paper but not in practice. The National Audit Office's 2011 report remains a canonical reference for how physical force dominance without mesh principles produces unusable platforms.",
              },
              {
                ref: "Knight Capital Group (2012)",
                note: "Not a data platform failure in the traditional sense — but a definitive case of Observability force collapse. A deployment error in a trading system went undetected for 45 minutes because monitoring was insufficient to surface it. $440m was lost. The incident is now a standard reference for what happens when the observability force is treated as optional infrastructure rather than a sovereign architectural concern.",
              },
              {
                ref: "Gartner's 2019 Data & Analytics Summit findings",
                note: "Gartner reported that through 2022, only 20% of analytic insights would deliver business outcomes. The primary causes cited — poor data quality, lack of trust, centralised bottlenecks, and governance theatre — map precisely to the Governance and Physical Sovereignty deformations. The statistic has since been widely cited as evidence that data lake investments routinely underperform not for technical reasons, but architectural ones.",
              },
            ].map((item, i) => (
              <div key={i} style={{
                marginBottom: i < 2 ? "1rem" : 0,
                paddingBottom: i < 2 ? "1rem" : 0,
                borderBottom: i < 2 ? "1px solid #1a1a1a" : "none",
              }}>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.68rem",
                  color: "#c87941",
                  marginBottom: "0.4rem",
                }}>
                  {item.ref}
                </div>
                <div style={{
                  fontFamily: "'Lora', Georgia, serif",
                  fontSize: "0.88rem",
                  color: "#6a5a4a",
                  lineHeight: 1.7,
                }}>
                  {item.note}
                </div>
              </div>
            ))}
          </div>

          <P>
            The Voronoi Platform Architecture is not a prescription for which tools to use or how
            much to invest in each capability. It is a principle for how forces should relate to
            their neighbours — and a diagnostic for detecting when that relationship has broken down
            before the platform fractures.
          </P>
        </Section>

        {/* What equilibrium feels like */}
        <Section title="What Equilibrium Actually Feels Like">
          <P>
            Before the engineering — before Iceberg and Bedrock and Terraform modules and federated
            identity — it is worth describing what a platform in genuine equilibrium actually produces
            for the people who use and build it. Not as aspiration. As specification.
          </P>
          <P>
            A domain team provisioning a new data product submits a domain intent. An automated
            pipeline validates the network boundaries, registers the identity principals, creates the
            Iceberg namespace in the federated catalog, configures observability agents, applies
            governance classification, and provisions the domain's compute workspace. The security force
            is enforced by the pipeline — not by a human approver reviewing a ticket three weeks later.
            The domain team has a working, governed, monitored data product published to the marketplace
            in hours. Other domains can discover it, evaluate its quality score and SLA, and subscribe
            to it — without raising a ticket to a central data team.
          </P>
          <P>
            A data scientist building a predictive model queries Gold-tier Iceberg tables through a
            unified catalog. The data they can access is determined by their identity, the
            classification of the tables, and the governance policies — enforced automatically, not by
            a gatekeeper. When they register their model, its lineage traces back to the exact Iceberg
            snapshot and domain data product version that produced the training set. The model output
            is published to the marketplace as a new data product — with its own domain owner, SLA,
            and quality contract. When the model drifts, the observability plane detects it and alerts
            the domain owner. The intelligence force and the physical sovereignty force are at 120°.
          </P>
          <P>
            A business analyst asking a natural language question via a GenAI interface receives a
            response that cites its source — which domain data product, which classification tier,
            which snapshot. The response is auditable. The inference event is logged. If the analyst
            lacks clearance to access Confidential data, the AI layer does not surface it — not because
            a human checked, but because the classification from the governance plane flows through to
            the AI serving layer automatically. The intelligence and security forces are at 120°.
          </P>
          <P>
            A Salesforce account manager opens a customer record and finds a real-time risk score,
            a propensity model output, and a next-best-action recommendation — all computed by the
            lakehouse, published to the marketplace, and consumed by the CRM integration without a
            single bespoke pipeline. The data marketplace force and the physical sovereignty force
            are at 120°. The operational system is intelligent because the analytical platform
            treats it as a first-class consumer.
          </P>
          <P>
            An auditor asking who approved the Snowflake instance serving the revenue report receives a
            complete answer: the ARB submission reference, the Terraform module version, the Git commit
            SHA, the pipeline run that applied it, the SPN that executed it, and the lineage from that
            infrastructure event to the current table state. Infrastructure lineage and data lineage
            are the same graph. The governance and physical sovereignty forces are at 120°.
          </P>

          <PullQuote>
            The hexagon holds its shape not because someone holds it. Because the physics is right.
          </PullQuote>

          <P>
            This is not a technology problem. Every component of this platform exists today — Iceberg,
            Databricks, Snowflake, Bedrock, AI Foundry, Purview, Terraform, Sentinel. The question is
            never capability. The question is always architecture. Specifically: have you designed the
            forces into equilibrium, or have you assembled tools and hoped equilibrium would emerge?
          </P>
          <P>
            Lava doesn't hope to become hexagonal. The physics makes any other shape unstable.
          </P>
        </Section>

        {/* Closing */}
        <Section title="The Name">
          <P>
            We call this the <strong style={{ color: "#e8d5b0" }}>Voronoi Platform Architecture</strong> —
            named for the mathematician Georgy Voronoi, who formalised in 1908 what John Snow had drawn
            intuitively in 1854 and what cooling lava had been demonstrating for sixty million years
            before either of them.
          </P>
          <P>
            The Voronoi tessellation partitions space such that every point belongs to exactly one cell,
            every cell is governed by proximity to its seed, and every boundary is jointly owned by the
            two cells it separates. No gaps. No overlaps. Complete, stable, efficient coverage of the
            entire plane.
          </P>
          <P>
            An enterprise data platform should have the same properties. Every data asset belongs to
            exactly one sovereign domain. Every domain is governed by the forces closest to it. Every
            architectural boundary is jointly governed by the two forces it separates — neither
            dominant, both respected. No ungoverned space. No capability overlap. Complete, stable,
            efficient coverage of the platform's operational surface.
          </P>
          <P>
            The Voronoi diagram doesn't tell you where to place the seeds. That is the engineering
            question — and it is a concrete one. In the next essay, we begin with the physical and
            catalog planes: how domain-owned storage and compute are structured on Apache Iceberg,
            why the catalog layer is the most dangerous plane in a polyglot architecture, and what
            a federated catalog federation model looks like in practice across Databricks, Snowflake,
            AWS Glue, and Microsoft Fabric. The geometry gives you the principle. The engineering
            gives you the platform.
          </P>
        </Section>

        {/* The Principle — TL;DR for sharing */}
        <div style={{
          background: "#0d0d0d",
          border: "1px solid #1e1e1e",
          borderLeft: "3px solid #c87941",
          padding: "1.75rem",
          margin: "3rem 0 2rem",
        }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.6rem",
            color: "#4a4035",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: "1rem",
          }}>
            The Principle — in one paragraph
          </div>
          <p style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "1.05rem",
            fontStyle: "italic",
            color: "#c8bfb0",
            lineHeight: 1.8,
            margin: 0,
          }}>
            A data platform achieves stable, scalable architecture not by optimising any single
            capability, but by bringing six sovereign forces — Physical Sovereignty, Intelligence,
            Data Marketplace, Observability, Governance, and Security — into genuine equilibrium
            at their shared boundaries. When no adjacent force dominates its neighbour, the platform
            tessellates completely: no ungoverned space, no capability gaps, no structural failure
            points. This is the geometry that nature uses to partition space efficiently. It is called
            the Voronoi tessellation. And it is the target shape for every enterprise data platform
            operating at scale.
          </p>
        </div>

        {/* Next */}
        <div style={{
          borderTop: "1px solid #1e1e1e",
          paddingTop: "2rem",
          marginTop: "3rem",
        }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.65rem",
            color: "#4a4035",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: "0.75rem",
          }}>
            Coming Next · Part II
          </div>
          <div style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "1.3rem",
            color: "#c87941",
            marginBottom: "0.75rem",
          }}>
            The Physical and Catalog Planes: The Gravitational Mass
          </div>
          <P style={{ color: "#4a4035", marginBottom: 0 }}>
            Before you can build intelligence, governance, or observability on a polyglot multi-cloud
            platform, you have to answer one deceptively simple question: where is the truth, and can
            every engine in your architecture find it? The answer involves Apache Iceberg, federated
            catalogs, a dialect compatibility matrix, and the most dangerous plane in the architecture
            — the one nobody draws, and the one most likely to kill you silently.
          </P>
        </div>

        {/* Tags */}
        <div style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          marginTop: "3rem",
          paddingTop: "2rem",
          borderTop: "1px solid #1a1a1a",
        }}>
          {["Data Architecture", "Data Mesh", "Platform Engineering", "Apache Iceberg", "Enterprise Architecture", "Voronoi"].map(tag => (
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