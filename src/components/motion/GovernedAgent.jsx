/* Chapter 06 — one governed data product, four callers.

   The data product is published once, carrying its entities,
   relationships, business rules and contracts. A Fabric data agent
   activates it: the orchestrator picks the governed source, and the
   source determines the tool rather than the agent choosing freely
   — DAX for a semantic model, SQL for a Lakehouse, KQL for an
   Eventhouse. Security follows the user, enforced at the data and
   catalogue layers rather than in the agent.

   Nothing publishes until it has been through the Agent Development
   Lifecycle, which is the whole cycle rather than a gate at the end.

   Drawn from Sravan's "From Governed Data to Governed Intelligence". */

import { Diagram, Box, T, Eyebrow, Line, Arrow, C } from './primitives'

/* What the data product brings when it onboards, once. */
const CONTRACT = ['entities', 'relationships', 'business rules', 'contracts']

/* The tool is set by the source, not chosen by the agent. */
const TOOLS = [
  { tool: 'DAX', src: 'semantic model' },
  { tool: 'SQL', src: 'Lakehouse' },
  { tool: 'KQL', src: 'Eventhouse' },
]

/* One governed source; the caller is the only thing that changes. */
const CALLERS = ['Fabric', 'Microsoft 365', 'MCP callers', 'domain orchestrator']

/* The full cycle, not a separate approval stage. */
const ADLC = ['certified data', 'security & privacy', 'business owner', 'test & evidence', 'publish']

const ADLC_X = [12, 105, 198, 291, 384]

export default function GovernedAgent({ title }) {
  return (
    <Diagram title={title}>
      <Eyebrow x={12} y={16} anchor="start">
        ONE GOVERNED SOURCE · FOUR CALLERS
      </Eyebrow>

      {/* ── The data product, published once ───────────────── */}
      <T x={70} y={34} size={7} fill={C.sage} letter={1.1}>
        DATA PRODUCT
      </T>
      <Box x={12} y={42} w={116} h={96} stroke={C.sage} fill={C.sageWash} />
      {CONTRACT.map((item, i) => (
        <g key={item}>
          <circle cx={26} cy={60 + i * 22} r={2.5} fill={C.sage} />
          <T x={36} y={60 + i * 22} size={7} fill={C.text} anchor="start">
            {item}
          </T>
        </g>
      ))}

      <Line x1={128} y1={90} x2={142} y2={90} stroke={C.copper} className="anim-flow" />
      <Arrow x={144} y={90} fill={C.copper} size={3.5} />

      {/* ── The agent: activation, not a black box ─────────── */}
      <T x={240} y={34} size={7} fill={C.copper} letter={1.1}>
        FABRIC DATA AGENT
      </T>
      <Box x={152} y={42} w={176} h={96} stroke={C.copper} fill={C.copperWash} />
      <T x={240} y={58} size={7.5} fill={C.text}>
        question in plain English
      </T>
      <Line x1={166} y1={68} x2={314} y2={68} stroke={C.rule} />
      <T x={240} y={79} size={7} fill={C.dim}>
        intent → governed source
      </T>

      {/* The source decides the language, one mapping per row. */}
      {TOOLS.map((t, i) => (
        <g key={t.tool} className="anim-flash" style={{ '--d': `${i * 0.7}s` }}>
          <T x={166} y={95 + i * 14} size={6.8} fill={C.muted} anchor="start">
            {t.src}
          </T>
          <Line x1={252} y1={95 + i * 14} x2={268} y2={95 + i * 14} stroke={C.steel} />
          <Arrow x={268} y={95 + i * 14} fill={C.steel} size={2.6} />
          <T x={314} y={95 + i * 14} size={7.5} fill={C.text} weight={500} anchor="end">
            {t.tool}
          </T>
        </g>
      ))}

      {/* ── The callers ────────────────────────────────────── */}
      <T x={404} y={34} size={7} fill={C.teal} letter={1.1}>
        CALLERS
      </T>
      {CALLERS.map((caller, i) => (
        <g key={caller}>
          <Line x1={328} y1={56 + i * 24} x2={340} y2={56 + i * 24} stroke={C.teal} dashed />
          <Box
            x={344}
            y={46 + i * 24}
            w={124}
            h={20}
            stroke={C.teal}
            fill={C.surface}
            radius={10}
          />
          <circle cx={356} cy={56 + i * 24} r={2.5} fill={C.teal} />
          <T x={364} y={56 + i * 24} size={7} fill={C.text} anchor="start">
            {caller}
          </T>
        </g>
      ))}
      <T x={240} y={152} size={6.8} fill={C.dim}>
        published once · no translation layer to maintain · only the caller changes
      </T>

      {/* ── Entitlements live under the agent, not in it ───── */}
      <Box x={12} y={164} w={456} h={22} stroke={C.gold} fill="#14110a" radius={3} />
      <circle cx={26} cy={175} r={3} fill={C.gold} className="anim-pulse" />
      <T x={244} y={175} size={7.2} fill={C.text}>
        security follows the user — row and column-level security and masking, at the data layer
      </T>

      {/* ── Nothing publishes until it has been through ADLC ─ */}
      <T x={12} y={200} size={7} fill={C.dim} anchor="start" letter={1.1}>
        AGENT DEVELOPMENT LIFECYCLE
      </T>
      {ADLC.map((stage, i) => (
        <g key={stage} className="anim-rise" style={{ '--d': `${i * 0.3}s` }}>
          <Box
            x={ADLC_X[i]}
            y={210}
            w={84}
            h={26}
            stroke={i === ADLC.length - 1 ? C.sage : C.rule}
            fill={C.surface}
            radius={3}
          />
          <T x={ADLC_X[i] + 42} y={223} size={6.6} fill={C.text}>
            {stage}
          </T>
          {i < ADLC.length - 1 && <Arrow x={ADLC_X[i] + 86} y={223} fill={C.dim} size={2.8} />}
        </g>
      ))}

      {/* ── The point ──────────────────────────────────────── */}
      <Line x1={12} y1={252} x2={468} y2={252} stroke={C.rule} />
      <T x={240} y={270} size={8.5} fill={C.text}>
        an answer a colleague cannot inspect is an answer a regulator cannot accept
      </T>
      <T x={240} y={287} size={6.8} fill={C.dim} letter={0.9}>
        BUILD THE DATA PRODUCT ONCE · REUSE IT IN EVERY AGENT
      </T>
    </Diagram>
  )
}
