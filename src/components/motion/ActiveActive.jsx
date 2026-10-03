/* Chapter 07 — Resiliency Category 0: active-active multi-region
   on Iceberg, with Nessie as the versioned catalog and Polaris as
   the open catalog API. Both legs serve live writes, which is what
   makes the coordination problem, not the failover, the hard part.

   Redrawn from Sravan's own EDP architecture slide
   (Resilience/BuildOnceRunAnywhere.html). */

import { Diagram, Box, T, Eyebrow, Line, Arrow, TableGlyph, C } from './primitives'

const ROWS = [
  { label: 'Iceberg', sub: 'live writes', accent: C.sage },
  { label: 'Compute', sub: 'EMR · Glue · Athena', accent: C.steel },
  { label: 'Nessie + Polaris', sub: null, accent: C.teal },
]

function Region({ x, name, branch }) {
  return (
    <>
      <Eyebrow x={x + 80} y={48} fill={C.copper}>
        {name}
      </Eyebrow>
      <Box x={x} y={60} w={160} h={132} stroke={C.copper} fill={C.copperWash} />
      {ROWS.map((r, i) => (
        <g key={r.label}>
          <Box
            x={x + 12}
            y={72 + i * 40}
            w={136}
            h={32}
            stroke={C.rule}
            fill={C.surface}
            radius={3}
          />
          <circle cx={x + 26} cy={88 + i * 40} r={3.5} fill={r.accent} />
          <T x={x + 38} y={r.sub ? 84 + i * 40 : 88 + i * 40} size={8} fill={C.text} anchor="start">
            {r.label}
          </T>
          {r.sub && (
            <T x={x + 38} y={95 + i * 40} size={6.8} fill={C.dim} anchor="start">
              {r.sub}
            </T>
          )}
        </g>
      ))}
      <T x={x + 80} y={204} size={7} fill={C.dim} letter={0.6}>
        {branch}
      </T>
    </>
  )
}

export default function ActiveActive({ title }) {
  return (
    <Diagram title={title}>
      <Eyebrow x={16} y={18} anchor="start">
        RESILIENCY CATEGORY 0 · ACTIVE–ACTIVE
      </Eyebrow>
      <T x={464} y={18} size={7} fill={C.dim} anchor="end" letter={0.9}>
        ~2× COST · BOTH LEGS LIVE
      </T>

      {/* ── Clients reach the nearest region. Both are live. ─ */}
      <T x={240} y={32} size={7.5} fill={C.dim} letter={1}>
        ROUTE 53 · LATENCY POLICY
      </T>
      {[
        { x1: 232, x2: 170 },
        { x1: 248, x2: 310 },
      ].map((l, i) => (
        <g key={i}>
          <Line x1={l.x1} y1={38} x2={l.x2} y2={54} stroke={C.sage} width={1.4} />
          <Arrow x={l.x2} y={54} fill={C.sage} />
        </g>
      ))}

      <Region x={20} name="REGION A · PRODUCTION" branch="branch: eu-west-1-prod" />
      <Region x={300} name="REGION B · PRODUCTION" branch="branch: us-east-1-prod" />

      {/* ── Live writes on both legs, at once ──────────────── */}
      {[0, 1].map(i => (
        <circle
          key={`a-${i}`}
          cx={100}
          cy={88}
          r={3}
          fill={C.sage}
          className="anim-pulse"
          style={{ '--d': `${i * 0.7}s` }}
        />
      ))}
      {[0, 1].map(i => (
        <circle
          key={`b-${i}`}
          cx={380}
          cy={88}
          r={3}
          fill={C.sage}
          className="anim-pulse"
          style={{ '--d': `${0.35 + i * 0.7}s` }}
        />
      ))}

      {/* ── Coordination, not failover ─────────────────────── */}
      <Box x={192} y={76} w={96} h={46} stroke={C.gold} fill="#14110a" radius={23} />
      <T x={240} y={92} size={7.5} fill={C.gold}>
        global commit
      </T>
      <T x={240} y={104} size={7.5} fill={C.gold}>
        coordinator
      </T>
      <T x={240} y={134} size={7} fill={C.dim}>
        or strict partitioning
      </T>

      {/* Replication, continuously, in both directions. */}
      <Line x1={180} y1={99} x2={192} y2={99} stroke={C.teal} className="anim-flow" />
      <Line x1={288} y1={99} x2={300} y2={99} stroke={C.teal} className="anim-flow" />
      <Line
        x1={180}
        y1={152}
        x2={300}
        y2={152}
        stroke={C.teal}
        className="anim-flow"
        style={{ '--d': '0.4s' }}
      />
      <T x={240} y={164} size={7} fill={C.teal} letter={0.8}>
        S3 CRR · NESSIE
      </T>

      {/* ── Branches reconcile into main ───────────────────── */}
      <Line x1={100} y1={212} x2={240} y2={232} stroke={C.rule} dashed />
      <Line x1={380} y1={212} x2={240} y2={232} stroke={C.rule} dashed />
      <g className="anim-rise" style={{ '--d': '0.9s' }}>
        <Box x={196} y={232} w={88} h={26} stroke={C.sage} fill={C.sageWash} radius={3} />
        <T x={240} y={245} size={8} fill={C.text}>
          merged to main
        </T>
      </g>

      {/* ── The honest trade-off ───────────────────────────── */}
      <Line x1={16} y1={270} x2={464} y2={270} stroke={C.rule} />
      <circle cx={24} cy={284} r={3} fill={C.danger} className="anim-pulse" />
      <T x={34} y={284} size={7.8} fill={C.danger} anchor="start">
        split-brain risk if metadata replication degrades
      </T>
      <T x={464} y={284} size={7.8} fill={C.dim} anchor="end">
        failover drills do not apply
      </T>
    </Diagram>
  )
}
