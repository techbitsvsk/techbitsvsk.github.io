import { useEffect, useState } from "react";

const post = {
  title: "The Lineage-First Data Platform",
  subtitle:
    "Hundreds of data products. Dozens of Lines of Business. One audit question that takes three weeks to answer. Here is the architecture that makes it take three seconds.",
  author: "Sravan Vadaga",
  readTime: "18 min read",
  date: "April 2026",
};

const ACCENT = "#a07bc8";
const ACCENT_DIM = "#a07bc808";

// ── Shared primitive components ──────────────────────────────────────────────

function PullQuote({ children }) {
  return (
    <div style={{
      borderLeft: `3px solid ${ACCENT}`,
      margin: "2.5rem 0",
      padding: "1rem 1.5rem",
      background: `linear-gradient(90deg, ${ACCENT_DIM} 0%, transparent 100%)`,
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
        color: ACCENT,
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
          borderLeft: `2px solid ${ACCENT}44`,
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
            color: ACCENT,
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

// ── Post-specific components ─────────────────────────────────────────────────

const LAYER_COLORS = {
  analytics: "#a07bc8",
  gold:      "#c8a87a",
  silver:    "#8ab4b8",
  bronze:    "#c87b4a",
  raw:       "#4a4a4a",
};

function LayerBadge({ layer }) {
  return (
    <span style={{
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: "0.6rem",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: LAYER_COLORS[layer] || "#8a7a65",
      border: `1px solid ${(LAYER_COLORS[layer] || "#8a7a65")}44`,
      padding: "1px 6px",
      marginRight: 8,
    }}>
      {layer}
    </span>
  );
}

function LineagePath() {
  const steps = [
    { indent: 0, layer: "analytics", dataset: "analytics.revenue_by_segment", column: "total_revenue",       derived: false },
    { indent: 1, layer: "gold",      dataset: "gold.fact_lineitem",            column: "revenue",             derived: true  },
    { indent: 2, layer: "silver",    dataset: "silver.lineitem",               column: "revenue",             derived: true  },
    { indent: 3, layer: "bronze",    dataset: "bronze.lineitem",               column: "l_extendedprice",     derived: true  },
    { indent: 3, layer: "bronze",    dataset: "bronze.lineitem",               column: "l_discount",          derived: true  },
  ];

  return (
    <div style={{
      background: "#0d0d0d",
      border: "1px solid #1e1e1e",
      padding: "1.5rem",
      margin: "2rem 0",
      overflowX: "auto",
    }}>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "0.65rem",
        color: "#4a4035",
        letterSpacing: "0.08em",
        marginBottom: "1rem",
        textTransform: "uppercase",
      }}>
        Column Lineage — 5-hop DERIVED_FROM traversal
      </div>
      {steps.map((step, i) => (
        <div key={i} style={{
          display: "flex",
          alignItems: "center",
          paddingLeft: `${step.indent * 1.5}rem`,
          marginBottom: "0.6rem",
        }}>
          {step.derived && (
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.75rem",
              color: "#4a4035",
              marginRight: 8,
              userSelect: "none",
            }}>
              ←
            </span>
          )}
          <LayerBadge layer={step.layer} />
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.78rem",
            color: "#8a7a65",
          }}>
            {step.dataset}.
          </span>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.78rem",
            color: LAYER_COLORS[step.layer],
            fontWeight: 500,
          }}>
            {step.column}
          </span>
        </div>
      ))}
      <div style={{
        marginTop: "1rem",
        paddingTop: "1rem",
        borderTop: "1px solid #1a1a1a",
        fontFamily: "'Lora', Georgia, serif",
        fontSize: "0.8rem",
        fontStyle: "italic",
        color: "#4a4035",
        lineHeight: 1.6,
      }}>
        Every arrow is a materialised <span style={{ color: ACCENT, fontStyle: "normal", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem" }}>DERIVED_FROM</span> edge
        written to Neo4j at event time — not computed at query time.
        A business user asking "where does revenue come from?" traverses this chain in a single Cypher hop.
      </div>
    </div>
  );
}

const ACTORS = [
  {
    id: "analyst",
    role: "Business Analyst",
    icon: "◈",
    color: ACCENT,
    pain: "Spends days hunting down which report column maps to which source field. Answers are tribal knowledge.",
    gain: "Types a natural language question. Gets the full 5-hop derivation chain in plain English within seconds.",
    example: '"Where does revenue_by_segment.total_revenue come from?" → full path from analytics to raw TPC-H source, named at every layer.',
  },
  {
    id: "auditor",
    role: "Compliance Auditor",
    icon: "◉",
    color: "#c8a87a",
    pain: "Regulatory audits require tracing every figure in a financial report back to its raw source. Current process: weeks of email chains and spreadsheets.",
    gain: "A single API call returns an immutable, time-stamped provenance chain. Every DERIVED_FROM edge was written when the pipeline ran — not reconstructed after the fact.",
    example: "GET /lineage/column/analytics.revenue_by_segment/total_revenue → JSON graph with run IDs, timestamps, and job names at every hop.",
  },
  {
    id: "engineer",
    role: "Data Engineer",
    icon: "◎",
    color: "#8ab4b8",
    pain: "Before changing a column in bronze, nobody knows which silver, gold, or analytics tables will break. Schema changes are feared, not managed.",
    gain: "Impact analysis query returns every downstream column that derives from the target — with hop distance. Change with confidence, not anxiety.",
    example: '"If I change bronze.lineitem.l_extendedprice, what breaks?" → 4 downstream columns identified across 3 layers and 2 data products.',
  },
  {
    id: "governance",
    role: "Data Governance Lead",
    icon: "◇",
    color: "#8aab7a",
    pain: "No single view of cross-LOB data dependencies. Cannot answer: which data products depend on which upstream products, or trace PII column propagation.",
    gain: "Namespace graph shows every cross-product CONSUMES edge. PII columns tagged in bronze are traceable to every derived column in silver, gold, and analytics.",
    example: '"Which data products consume tpch-data-product gold tables?" → analytics-data-product with 3 datasets listed, lineage edges visible in Marquez.',
  },
];

function ActorGrid() {
  const [active, setActive] = useState("analyst");
  const actor = ACTORS.find(a => a.id === active);

  return (
    <div style={{ margin: "2rem 0" }}>
      {/* Tab row */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 1,
        background: "#1a1a1a",
        marginBottom: 0,
      }}>
        {ACTORS.map(a => (
          <button
            key={a.id}
            onClick={() => setActive(a.id)}
            style={{
              background: active === a.id ? "#111" : "#0d0d0d",
              border: "none",
              borderBottom: active === a.id ? `2px solid ${a.color}` : "2px solid transparent",
              padding: "0.75rem 0.5rem",
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "1rem",
              color: active === a.id ? a.color : "#4a4035",
              marginBottom: 4,
            }}>
              {a.icon}
            </div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.6rem",
              color: active === a.id ? "#c8bfb0" : "#4a4035",
              letterSpacing: "0.04em",
              lineHeight: 1.3,
            }}>
              {a.role}
            </div>
          </button>
        ))}
      </div>

      {/* Detail panel */}
      <div style={{
        background: "#0d0d0d",
        border: "1px solid #1e1e1e",
        borderTop: `2px solid ${actor.color}`,
        padding: "1.5rem",
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
          marginBottom: "1.25rem",
        }}>
          <div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.65rem",
              color: "#c87941",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "0.5rem",
            }}>
              Before
            </div>
            <div style={{
              fontFamily: "'Lora', Georgia, serif",
              fontSize: "0.88rem",
              color: "#8a7a65",
              lineHeight: 1.7,
            }}>
              {actor.pain}
            </div>
          </div>
          <div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.65rem",
              color: "#8aab7a",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "0.5rem",
            }}>
              After
            </div>
            <div style={{
              fontFamily: "'Lora', Georgia, serif",
              fontSize: "0.88rem",
              color: "#c8bfb0",
              lineHeight: 1.7,
            }}>
              {actor.gain}
            </div>
          </div>
        </div>
        <div style={{
          borderTop: "1px solid #1a1a1a",
          paddingTop: "1rem",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.72rem",
          color: actor.color,
          lineHeight: 1.6,
        }}>
          {actor.example}
        </div>
      </div>
    </div>
  );
}

function NamespaceMap() {
  const products = [
    {
      ns: "retail-banking-dp",
      color: "#8ab4b8",
      layers: ["bronze.*", "silver.*", "gold.*"],
      consumes: [],
      note: "Source-of-record for customer and transaction data",
    },
    {
      ns: "insurance-dp",
      color: "#c8a87a",
      layers: ["bronze.*", "silver.*", "gold.*"],
      consumes: [],
      note: "Policy, claim, and risk data products",
    },
    {
      ns: "wealth-mgmt-dp",
      color: "#8aab7a",
      layers: ["bronze.*", "silver.*", "gold.*"],
      consumes: [],
      note: "Portfolio, advisory, and AUM tables",
    },
    {
      ns: "analytics-dp",
      color: ACCENT,
      layers: ["analytics.*"],
      consumes: ["retail-banking-dp", "insurance-dp", "wealth-mgmt-dp"],
      note: "Cross-LOB aggregates — revenue, risk, and segment reports",
    },
  ];

  return (
    <div style={{ margin: "2rem 0" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 1,
        background: "#1a1a1a",
        marginBottom: 1,
      }}>
        {products.slice(0, 3).map(p => (
          <div key={p.ns} style={{
            background: "#0d0d0d",
            padding: "1.25rem",
          }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.65rem",
              color: p.color,
              letterSpacing: "0.06em",
              marginBottom: "0.75rem",
            }}>
              {p.ns}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: "0.75rem" }}>
              {p.layers.map(l => (
                <div key={l} style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.62rem",
                  color: "#4a4035",
                  paddingLeft: "0.5rem",
                  borderLeft: `1px solid ${p.color}44`,
                }}>
                  {l}
                </div>
              ))}
            </div>
            <div style={{
              fontFamily: "'Lora', Georgia, serif",
              fontSize: "0.78rem",
              color: "#4a4035",
              lineHeight: 1.5,
              fontStyle: "italic",
            }}>
              {p.note}
            </div>
          </div>
        ))}
      </div>

      {/* Arrow row */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 1,
        background: "#1a1a1a",
        marginBottom: 1,
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            background: "#0a0a0a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0.4rem 0",
          }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.75rem",
              color: `${ACCENT}88`,
            }}>
              ↓ CONSUMES
            </span>
          </div>
        ))}
      </div>

      {/* Analytics row — spans full width */}
      <div style={{ background: "#1a1a1a" }}>
        <div style={{
          background: "#0d0d0d",
          borderTop: `2px solid ${ACCENT}`,
          padding: "1.25rem",
        }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.65rem",
            color: ACCENT,
            letterSpacing: "0.06em",
            marginBottom: "0.75rem",
          }}>
            {products[3].ns}  ·  cross-lob boundary
          </div>
          <div style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "0.75rem",
            flexWrap: "wrap",
          }}>
            {products[3].layers.map(l => (
              <div key={l} style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.62rem",
                color: "#4a4035",
                paddingLeft: "0.5rem",
                borderLeft: `1px solid ${ACCENT}44`,
              }}>
                {l}
              </div>
            ))}
            {products[3].consumes.map(c => (
              <div key={c} style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.62rem",
                color: "#4a4035",
                paddingLeft: "0.5rem",
                borderLeft: "1px solid #c8a87a44",
              }}>
                ← {c}
              </div>
            ))}
          </div>
          <div style={{
            fontFamily: "'Lora', Georgia, serif",
            fontSize: "0.78rem",
            color: "#4a4035",
            lineHeight: 1.5,
            fontStyle: "italic",
          }}>
            {products[3].note}
          </div>
        </div>
      </div>

      <div style={{
        marginTop: "0.75rem",
        fontFamily: "'Lora', Georgia, serif",
        fontSize: "0.8rem",
        fontStyle: "italic",
        color: "#4a4035",
        lineHeight: 1.6,
      }}>
        Each namespace is an OpenLineage job namespace — the data product identifier. Cross-LOB{" "}
        <span style={{ color: ACCENT, fontStyle: "normal", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem" }}>CONSUMES</span>{" "}
        edges are written to Neo4j and visible as cross-namespace boundaries in Marquez the moment the
        analytics pipeline runs.
      </div>
    </div>
  );
}

const THREATS = [
  {
    threat: "Lineage graph as topology map",
    severity: "MEDIUM",
    detail: "The full Neo4j graph exposes the data product topology of the entire organisation — which LOBs exist, what they own, and who consumes whom. An attacker with read access to Neo4j has a roadmap to the platform's most sensitive datasets.",
    mitigations: [
      "Run Neo4j with authentication enabled (always-on in production). Bolt port 7687 must never be publicly exposed.",
      "Namespace-scope the NLP API: each data product's /lineage/* endpoint returns only its own subgraph. Cross-product edges visible only to governance roles.",
      "No data values are stored in the graph — only metadata (column names, dataset paths, run states). A compromised lineage graph reveals structure, not content.",
    ],
  },
  {
    threat: "Column name metadata leakage",
    severity: "LOW–MEDIUM",
    detail: "Column names in the knowledge graph reveal business logic. A graph that shows `revenue = l_extendedprice * (1 - l_discount)` exposes a pricing formula. PII columns (SSN, DOB, account_number) in bronze are visible as Column nodes even if the data itself is access-controlled.",
    mitigations: [
      "Apply sensitivity classification on Column nodes (e.g., PII flag). Governance queries filter PII columns from non-privileged responses.",
      "Integrate with Purview sensitivity labels: columns tagged CONFIDENTIAL are masked in the Streamlit UI and NLP API responses for non-owner users.",
      "The Marquez UI respects namespace access — configure namespace-level auth so only data product owners see their column metadata.",
    ],
  },
  {
    threat: "NLP API prompt injection",
    severity: "MEDIUM",
    detail: "The Text2Cypher endpoint takes a free-text question, injects schema context, and asks an LLM to produce Cypher. A crafted question could attempt to exfiltrate schema context or generate destructive Cypher (DETACH DELETE, SET properties).",
    mitigations: [
      "The Groq LLM response is parsed and validated before execution. Only MATCH/RETURN statements are permitted — any MERGE, CREATE, SET, or DELETE in LLM output is rejected and logged.",
      "Cypher parameters are used for all user-supplied values. The LLM generates parameterised queries; values are never interpolated into the query string.",
      "Rate-limit the NLP endpoint per caller identity. Log all generated Cypher for audit. Anomalous patterns (DETACH, APOC procedures) trigger alerts.",
    ],
  },
  {
    threat: "Unauthorised cross-LOB lineage queries",
    severity: "MEDIUM–HIGH",
    detail: "The analytics data product's lineage legitimately crosses into other LOBs' namespaces. Without controls, any user who can call the NLP API can traverse the entire cross-product graph — exposing inter-LOB dependencies that may be commercially sensitive.",
    mitigations: [
      "Namespace-scoped API tokens: a retail-banking engineer's token can traverse upstream/downstream within retail-banking-dp and see only the names (not schemas) of external dependencies.",
      "The /lineage/data-product registration card intentionally exposes cross-product CONSUMES edges — this is the mechanism for marketplace discovery. Governance approves which products are registered.",
      "Audit log every cross-namespace traversal. The governance lead reviews this log weekly as part of the data product operating model.",
    ],
  },
  {
    threat: "Stale lineage as false compliance assurance",
    severity: "HIGH",
    detail: "The most dangerous failure mode: lineage in the graph is correct as of the last pipeline run. If a pipeline breaks or is re-engineered without a new run, the graph reflects old reality. An auditor who trusts stale lineage may certify a report whose actual derivation has changed.",
    mitigations: [
      "Every Dataset node carries an updated_at timestamp and a run_state (COMPLETE / FAIL). The Streamlit UI surfaces freshness signals — a dataset not updated in 24 hours shows a staleness warning.",
      "The NLP API includes run recency in all lineage responses: 'last confirmed COMPLETE run: 6 hours ago'. Auditors see this before accepting the lineage as current.",
      "OpenLineage FAIL events are written to Neo4j too. A FAIL on a silver job propagates a staleness flag to all downstream gold and analytics nodes — governance is notified before reports are published.",
    ],
  },
];

function ThreatBlock() {
  const [open, setOpen] = useState(null);

  const severityColor = (s) => {
    if (s.startsWith("HIGH")) return "#c87941";
    if (s.startsWith("MEDIUM")) return "#c8a87a";
    return "#8a7a65";
  };

  return (
    <div style={{ margin: "2rem 0" }}>
      {THREATS.map((t, i) => (
        <div key={i} style={{
          borderBottom: "1px solid #1a1a1a",
        }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: "100%",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "1rem 0",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              textAlign: "left",
            }}
          >
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.6rem",
              color: severityColor(t.severity),
              letterSpacing: "0.08em",
              minWidth: 80,
            }}>
              {t.severity}
            </div>
            <div style={{
              fontFamily: "'Lora', Georgia, serif",
              fontSize: "0.95rem",
              color: open === i ? "#e8d5b0" : "#c8bfb0",
              flex: 1,
            }}>
              {t.threat}
            </div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.7rem",
              color: "#4a4035",
            }}>
              {open === i ? "−" : "+"}
            </div>
          </button>

          {open === i && (
            <div style={{ paddingBottom: "1.25rem" }}>
              <div style={{
                fontFamily: "'Lora', Georgia, serif",
                fontSize: "0.88rem",
                color: "#8a7a65",
                lineHeight: 1.75,
                marginBottom: "1rem",
                paddingLeft: "5.5rem",
              }}>
                {t.detail}
              </div>
              <div style={{ paddingLeft: "5.5rem" }}>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.62rem",
                  color: "#8aab7a",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: "0.5rem",
                }}>
                  Mitigations
                </div>
                <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
                  {t.mitigations.map((m, j) => (
                    <li key={j} style={{
                      fontFamily: "'Lora', Georgia, serif",
                      fontSize: "0.85rem",
                      color: "#8a7a65",
                      lineHeight: 1.7,
                      borderLeft: "2px solid #8aab7a44",
                      paddingLeft: "1rem",
                      marginBottom: "0.6rem",
                    }}>
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}



// ── Post ─────────────────────────────────────────────────────────────────────

export default function LineagePost() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", fontFamily: "'Lora', Georgia, serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Lora:ital,wght@0,400;0,500;1,400&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: ${ACCENT}; }
        button:focus { outline: 1px solid ${ACCENT}44; }
      `}</style>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div style={{
        position: "relative",
        padding: "5rem 2rem 4rem",
        borderBottom: "1px solid #1e1e1e",
        overflow: "hidden",
      }}>
        {/* Background — graph node/edge pattern */}
        <svg
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0.04, pointerEvents: "none" }}
          viewBox="0 0 900 400"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Nodes */}
          {[
            [80, 80], [200, 140], [340, 60], [480, 160], [600, 80], [720, 150], [840, 70],
            [130, 260], [270, 310], [420, 240], [560, 300], [680, 240], [790, 320],
            [50, 350], [180, 380], [400, 370], [650, 360], [850, 340],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r={4} fill={ACCENT} />
          ))}
          {/* Edges */}
          {[
            [80,80,200,140],[200,140,340,60],[340,60,480,160],[480,160,600,80],
            [600,80,720,150],[720,150,840,70],[200,140,130,260],[340,60,270,310],
            [480,160,420,240],[600,80,560,300],[720,150,680,240],[840,70,790,320],
            [130,260,270,310],[270,310,420,240],[420,240,560,300],[560,300,680,240],
            [680,240,790,320],[130,260,50,350],[270,310,180,380],[420,240,400,370],
            [560,300,650,360],[790,320,850,340],
          ].map(([x1,y1,x2,y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={ACCENT} strokeWidth="0.8" />
          ))}
        </svg>

        <div style={{ maxWidth: 720, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: "1.5rem" }}>
            <div style={{ width: 28, height: 1, background: ACCENT }} />
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.7rem",
              color: ACCENT,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}>
              Data Platform · Knowledge Graph · Governance
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
              background: `linear-gradient(135deg, ${ACCENT}, #5e3d82)`,
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

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "3rem 2rem 6rem" }}>

        <Section id="audit">
          <P>
            The call came from the CFO's office at 9 AM on a Tuesday. Regulators had requested a full
            provenance trace for the Group Revenue figure in last quarter's risk report. The figure aggregated
            data from four Lines of Business. Nobody knew, with certainty, which source field it ultimately
            derived from. That audit took three weeks, four teams, and produced a 47-page spreadsheet that
            satisfied nobody, least of all the regulator.
          </P>
          <P>
            This is not a hypothetical. Versions of this story happen in every large financial institution,
            every quarter. And the root cause is not the data — it is the absence of <Keyword>provenance as
            infrastructure</Keyword>. Lineage is treated as a reporting artefact, not a first-class platform
            concern. It is produced after the fact, by people, manually, under pressure.
          </P>
          <P>
            This post documents an architecture that makes that audit take three seconds. It is built on
            open standards, runs entirely in Docker Compose for local development, and scales to production
            with the same design. The key insight is architectural: lineage is a <em>graph problem</em>, not
            a table problem, and treating it as one changes everything about how business users, auditors,
            and platform teams interact with data.
          </P>
        </Section>

        <Section id="scale" title="The Problem at Enterprise Scale">
          <P>
            A mature data platform at a large financial institution is not ten pipelines. It is hundreds of
            data products spread across Lines of Business — Retail Banking, Insurance, Wealth Management,
            Capital Markets, Risk, Finance. Each LOB has its own ingestion patterns, transformation logic,
            and business semantics. Each produces datasets that other LOBs consume.
          </P>
          <P>
            The numbers compound quickly. A platform with eight LOBs, each owning twenty data products, each
            product spanning four layers (raw, bronze, silver, gold), with an analytics layer that aggregates
            across LOBs — that is north of six hundred datasets before you count columns. A conservative
            estimate puts column-level lineage edges in the tens of thousands.
          </P>

          <BulletList items={[
            {
              label: "Discovery failure:",
              text: "A new analyst joins the Wealth Management team and needs to understand where the AUM figure in the executive dashboard comes from. There is no authoritative answer. The pipeline code exists, but reading it requires knowing Spark SQL, understanding the medallion layer conventions, and tracing through four DAGs across two data products.",
            },
            {
              label: "Audit fragility:",
              text: "Regulators increasingly require column-level data provenance for financial reports. The Basel III and BCBS 239 principles for risk data aggregation explicitly require traceability from report to source. Meeting these requirements manually — as most teams do — is expensive, error-prone, and slow to produce.",
            },
            {
              label: "Change fear:",
              text: "Schema changes in upstream datasets break downstream consumers in unpredictable ways. Without a queryable impact graph, engineers add columns cautiously, avoid renaming anything, and leave deprecated columns in place for years because nobody knows what depends on them.",
            },
            {
              label: "Cross-LOB opacity:",
              text: "The analytics team's revenue aggregates pull from gold tables owned by three different LOBs. When the Retail Banking team refactors their silver pipeline, the analytics team finds out when their reports break. There is no mechanism for proactive dependency notification.",
            },
          ]} />

          <PullQuote>
            The platform does not lack data. It lacks the infrastructure to answer questions about that data —
            who owns it, where it came from, and what breaks if it changes.
          </PullQuote>
        </Section>

        <Section id="existing" title="Why Existing Approaches Break at Depth">
          <P>
            Most platforms have some form of lineage. The problem is architectural: the approaches that are
            easy to implement are inadequate at the depth and scale that enterprise governance requires.
          </P>

          <LayerBlock layers={[
            {
              label: "Tool-siloed lineage (dbt artifacts, Spark UI, ADF activity logs)",
              text: "Each tool captures lineage within its own boundary. dbt knows which models depend on which sources. Spark UI shows which jobs read which tables. But these are isolated views. A report column that flows through Spark, then dbt, then Power BI has three separate lineage records in three separate systems with no common identifier linking them.",
            },
            {
              label: "Flat event logs (audit tables, Kafka topics)",
              text: "A table of (job, input_dataset, output_dataset, timestamp) captures what ran and when — but not derivation. It can answer 'which job read this table' but not 'which output column was derived from which input column'. Column-level provenance requires explicit declaration of transformation logic, not just execution events.",
            },
            {
              label: "Inferred column lineage (openlineage-spark bytecode agent)",
              text: "Bytecode instrumentation can sometimes infer column lineage from Spark logical plans. The problems: it requires a specific JAR version matched to both Spark and Iceberg runtime versions, it adds significant JVM startup overhead, and complex SQL rewrites (window functions, lateral views, conditional expressions) often produce incorrect or incomplete lineage maps.",
            },
            {
              label: "Relational lineage stores (Marquez with PostgreSQL backend)",
              text: "Marquez's PostgreSQL backend is excellent for table-level lineage and run history. At column depth across five layers and hundreds of datasets, recursive CTE traversal degrades significantly. A query asking 'what are all columns derived from bronze.lineitem.l_extendedprice across the entire platform' requires a multi-level recursive join that PostgreSQL was not designed to execute at sub-second response times.",
            },
          ]} />

          <P>
            None of these approaches is wrong. Each solves part of the problem. The gap is the absence of
            a <Keyword>unified, queryable, cross-tool lineage layer</Keyword> that operates at column depth,
            traverses across product boundaries, and answers questions in the language business users
            actually use.
          </P>
        </Section>

        <Section id="architecture" title="The Architecture: Four Layers of Lineage Infrastructure">
          <P>
            The design response is built in layers. Each layer has a single responsibility. Together they
            form a lineage infrastructure that is decoupled from any specific pipeline tool, queryable at
            any depth, and accessible to any persona from data engineer to CFO.
          </P>

          <LayerBlock layers={[
            {
              label: "Layer 1 — Emission (OpenLineage + ColumnLineageDatasetFacet)",
              text: "Every pipeline job declares its column lineage explicitly. Not inferred — declared. Each Spark job carries a lineage map: {output_column: [{input_dataset, input_column}]}. The Airflow operator assembles a ColumnLineageDatasetFacet and POSTs it with the OpenLineage RunEvent on task completion. Because lineage is declared in code alongside the SQL, it is always accurate and always version-controlled.",
            },
            {
              label: "Layer 2 — Transport (Composite OpenLineage HTTP)",
              text: "Airflow's composite transport fans each event to two consumers simultaneously: the Neo4j consumer for deep graph persistence and Marquez for visual lineage UI. Neither consumer knows about the other. New consumers (DataHub, custom audit sinks) can be added by extending the composite transport array — no pipeline code changes required.",
            },
            {
              label: "Layer 3 — Persistence (Neo4j Knowledge Graph)",
              text: "The OpenLineage consumer writes events as Cypher MERGE statements — idempotent, safe to replay. The graph schema materialises DERIVED_FROM edges between Column nodes and UPSTREAM_OF edges between Dataset nodes at write time. Multi-hop traversal at query time becomes a native graph walk, not a recursive join. The knowledge graph stores structure and provenance — never data values.",
            },
            {
              label: "Layer 4 — Discovery (Marquez UI + NLP API + Streamlit)",
              text: "Three discovery surfaces serve three personas. Marquez provides the visual lineage DAG with namespace switching for analysts and governance teams. The NLP API accepts natural language questions, generates Cypher via Groq's LLM, executes against Neo4j, and returns English answers — for business users. The Streamlit explorer provides graph visualisation, run history, and dataset browsing for platform engineers.",
            },
          ]} />
        </Section>

        <Section id="graph" title="Why a Graph Database — and Why It Matters Here">
          <P>
            The decision to persist lineage in Neo4j rather than extending the existing PostgreSQL instance
            is the most consequential architectural choice in this design. It is worth explaining precisely.
          </P>
          <P>
            Lineage at column depth is a variable-length path problem. When a business user asks "where does
            this revenue figure come from?", the answer is not a single row — it is a path through a graph
            of arbitrary depth. In this platform, <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85em", color: ACCENT }}>analytics.revenue_by_segment.total_revenue</code>{" "}
            traces back five hops through four layers and two data product namespaces. At enterprise scale,
            paths of ten or more hops are common.
          </P>

          <LineagePath />

          <P>
            In a relational model, this traversal requires a recursive Common Table Expression. A five-hop
            recursive CTE works. A ten-hop CTE across tens of thousands of columns, joining on foreign keys
            at each level, does not perform — and does not compose cleanly with LLM-generated queries. In
            Neo4j, the same traversal is a single Cypher pattern:{" "}
            <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85em", color: ACCENT }}>MATCH path = (c)-[:DERIVED_FROM*1..10]->(src)</code>.
            The graph engine executes this as a native adjacency walk — no joins, no CTEs.
          </P>
          <P>
            The second advantage is <Keyword>impact propagation</Keyword>. Running the same pattern in
            reverse — "what does this column affect?" — is structurally identical. The graph does not
            distinguish between upstream and downstream traversal. A platform with dozens of data products
            can answer "what breaks if I change this field?" across all of them in a single query, with
            hop distance included. This is the query that prevents silent schema breakages from propagating
            across LOBs.
          </P>
          <P>
            The third advantage is the emerging LLM integration story. Cypher's pattern syntax maps
            naturally to how humans describe relationships. Text2Cypher — converting natural language to
            Cypher — works reliably for lineage questions in a way that Text2SQL with recursive CTEs
            does not. This matters as agents become part of the platform's operator model.
          </P>
        </Section>

        <Section id="actors" title="What Each Actor Gets">
          <P>
            The same infrastructure serves radically different personas. The key design principle is that
            each persona interacts with the lineage layer through a surface appropriate to their fluency —
            visual UI for analysts, REST API for engineers, natural language for business users.
          </P>
          <ActorGrid />
        </Section>

        <Section id="semantic" title="Semantic Search: From Graph to Conversation">
          <P>
            The most significant capability shift is what happens when you layer an LLM over the knowledge
            graph. Business users — people who know what questions to ask but not how to write Cypher — can
            interact with the lineage layer in natural language.
          </P>

          <SubSection title="How Text2Cypher Works">
            <P>
              The NLP API receives a question. It injects the graph schema — node types, relationship types,
              key properties — as context. The LLM (Groq's llama-3.1-8b-instant for speed,
              llama-3.3-70b-versatile for complex traversals) generates a Cypher query. The query is
              validated (only MATCH/RETURN permitted), executed against Neo4j, and the result set is
              passed back to the LLM to formulate a plain English answer.
            </P>
          </SubSection>

          <SubSection title="Query Classes That Work Well">
            <BulletList items={[
              {
                label: "Provenance questions:",
                text: '"Where does total_revenue in analytics come from?" — The LLM generates a DERIVED_FROM* traversal, Neo4j returns the path, the answer names every hop with layer and dataset.',
              },
              {
                label: "Impact questions:",
                text: '"If I change l_extendedprice in bronze, what breaks?" — The LLM generates a reverse DERIVED_FROM traversal, returning all downstream columns with hop distance.',
              },
              {
                label: "Ownership questions:",
                text: '"Which data products consume the tpch gold tables?" — The LLM queries CONSUMES edges on Job nodes and returns data product names with owned dataset lists.',
              },
              {
                label: "Freshness questions:",
                text: '"When was gold.fact_lineitem last successfully updated?" — The LLM queries the most recent COMPLETE Run node linked to the dataset via PRODUCED_BY.',
              },
            ]} />
          </SubSection>

          <SubSection title="What Agents Add">
            <P>
              The structured REST endpoints — <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85em", color: ACCENT }}>/lineage/column/{"{dataset}/{column}"}</code>,{" "}
              <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85em", color: ACCENT }}>/lineage/impact/{"{name}"}</code> — are designed as
              LLM agent tools. An agent orchestrating a data quality investigation can call these endpoints
              programmatically: check freshness, trace the affected column's provenance, identify the owning
              data product, and draft a Slack notification to the product owner — all without human
              intervention. The lineage layer is the agent's knowledge source about platform topology.
            </P>
          </SubSection>

          <PullQuote>
            The graph is not a reporting layer. It is queryable infrastructure. The question "what does
            this column depend on?" deserves a first-class API, not a three-week audit.
          </PullQuote>
        </Section>

        <Section id="namespaces" title="Namespace-Based Data Product Isolation">
          <P>
            In an enterprise platform, lineage without ownership is incomplete. The OpenLineage job
            namespace is the mechanism that maps lineage events to data product identity. Every event
            emitted carries a namespace — the data product that owns the job. The knowledge graph stores
            this as a <Keyword>DataProduct</Keyword> node, and every Dataset and Job hangs off it via
            OWNS edges.
          </P>
          <P>
            This is not cosmetic separation. When a pipeline in <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85em", color: ACCENT }}>analytics-data-product</code>{" "}
            reads a table owned by <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85em", color: ACCENT }}>tpch-data-product</code>,
            a cross-product <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85em", color: ACCENT }}>CONSUMES</code> edge is written to the graph.
            This edge is the machine-readable contract between two independent data products — visible in
            Marquez as a cross-namespace boundary, queryable via the NLP API, and auditable as a
            governance artefact.
          </P>
          <P>
            At enterprise scale, each LOB owns one or more data product namespaces. The analytics layer
            that aggregates across LOBs necessarily crosses namespace boundaries. This topology is the
            platform's dependency graph — and it is built automatically, as a side effect of pipelines
            running, not as a manual documentation exercise.
          </P>

          <NamespaceMap />

          <P>
            The data product registration card — served at{" "}
            <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85em", color: ACCENT }}>GET /lineage/data-product</code> — is the
            mechanism for marketplace discovery. A platform catalogue indexes this endpoint for every
            registered product and can answer: "what does this product own, what does it consume, and
            who consumes it?" — building a complete platform topology from the lineage events alone.
          </P>
        </Section>

        <Section id="operational" title="Operational Realities">
          <P>
            Lineage infrastructure that works in development but degrades in production is worse than no
            lineage — it creates false confidence. Several operational concerns require deliberate design
            decisions.
          </P>

          <SubSection title="Event Delivery Reliability">
            <P>
              OpenLineage events are sent over HTTP. If the consumer is unavailable at the moment a task
              completes, the event is lost. The composite transport mitigates this partially — Marquez and
              the Neo4j consumer are independent, so a failure in one does not affect the other. For
              production, configure the Kafka topic provides durable, replayable, at least once delivery 
              so consumers can resume and missed events can be reprocessed. The graph is designed for 
              idempotent replays: every Cypher statement is a MERGE, so re-processing
              an event produces the same result as processing it once.
            </P>
          </SubSection>

          <SubSection title="Explicit vs Inferred Lineage — The Maintenance Contract">
            <P>
              Declaring column lineage explicitly in job code means a developer changing a transformation
              must also update the lineage map. This is a maintenance contract, not just a technical
              pattern. It pays off: the declaration becomes the single source of truth for both the SQL
              transformation and its provenance, living in version control, reviewable in pull requests.
              A code review that changes a SQL expression without updating its lineage declaration is
              visibly incomplete. That visibility is valuable.
            </P>
          </SubSection>

          <SubSection title="Graph Scale">
            <P>
              A platform with 200 datasets, 2000 columns, and daily pipeline runs accumulates Run nodes
              rapidly. Implement a retention policy: archive or delete Run nodes older than 90 days while
              preserving the Dataset and Column nodes with their DERIVED_FROM edges. The lineage structure
              is permanent; the execution history is operational. Neo4j Community Edition handles this
              scale without issues — graph databases are not memory-intensive for lineage workloads because
              the node count grows with platform size, not with data volume.
            </P>
          </SubSection>

          <SubSection title="Schema Evolution">
            <P>
              When a pipeline adds a new output column, a new Column node is created and DERIVED_FROM
              edges are written on the next COMPLETE event. When a column is removed, its Column node
              persists in the graph — it simply stops receiving new DERIVED_FROM edges. This preserves
              historical lineage for columns that have been deprecated, which is important for audit
              purposes. Governance teams can query for "columns not updated in the last 30 days" to
              identify deprecated lineage paths.
            </P>
          </SubSection>
        </Section>

        <Section id="security" title="Security Concerns and Mitigations">
          <P>
            A lineage knowledge graph occupies a specific position in the threat model: it contains no
            data values, but it describes the platform's data topology with precision. Each concern
            below is paired with the specific mitigation built into this architecture.
          </P>
          <ThreatBlock />
        </Section>

        <Section id="return" title="What Changes When Lineage Is First-Class">
          <P>
            The architecture described here is not primarily a technology choice. It is a statement about
            what the platform team believes data infrastructure should provide. When lineage is a
            side-effect of pipelines running — not a separately maintained document — it stops being a
            project and becomes a property of the platform.
          </P>
          <P>
            The CFO's office calls again. Regulators want a full provenance trace for Group Revenue.
            This time, a platform engineer opens the Streamlit UI, types the question, and reads the
            answer aloud in the room. Five hops. Two data products. Four layers. The raw source field.
            The run ID and timestamp of the pipeline that last computed it. Complete in under three seconds.
            The 47-page spreadsheet is not produced. The three-week process does not begin.
          </P>
          <P>
            Business users stop asking data engineers "where does this come from?" and start asking the
            platform directly. Auditors receive JSON-serialised provenance chains with cryptographic run
            identifiers instead of emailed spreadsheets. Data engineers change schemas confidently because
            they can see the impact graph before they merge. Governance leads watch the cross-LOB
            dependency topology grow automatically as new products register.
          </P>
          <P>
            None of this requires a new database product, a new cloud service, or a new team. It requires
            treating lineage the same way mature engineering organisations treat observability — as
            infrastructure, not documentation. Emitted at source. Stored in a queryable system. Accessible
            to every persona that needs it, in the language they actually use.
          </P>

          <PullQuote>
            Lineage built at the start costs nothing at audit time. Lineage built at audit time costs
            everything — and is never quite right.
          </PullQuote>
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
          {[
            "Data Lineage", "Knowledge Graph", "Neo4j", "OpenLineage", "Apache Iceberg",
            "Marquez", "Text2Cypher", "Data Governance", "Platform Engineering",
            "Semantic Search", "Column Lineage", "Data Products",
          ].map(tag => (
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
