/* Chapter 03 — 5% of workloads held on-premises by regulatory
   obligation, 95% in the cloud, compute free to cross a governed
   boundary in both directions.

   The orchestration layer is the same shape as the BPMN
   orchestrator in Chapter 02, re-expressed in open tooling:
   Apache Airflow in containers, driving Spark jobs on whichever
   side of the boundary the data sits. */

import { Diagram, Box, T, Eyebrow, Line, Arrow, TableGlyph, C } from './primitives'

const PACKETS = [0, 1, 2, 3]
const SPARK_X = [206, 288, 370]

export default function HybridSplit({ title }) {
  return (
    <Diagram title={title}>
      {/* Both zone panels first: anything drawn after this would
          otherwise be painted over by their fill. */}
      <Box x={24} y={42} w={108} h={154} stroke={C.gold} fill="#14110a" />
      <Box x={180} y={42} w={276} h={154} stroke={C.sage} fill={C.sageWash} />

      {/* ── On-premises: small by design ───────────────────── */}
      <Eyebrow x={78} y={28} fill={C.gold}>
        ON-PREMISES
      </Eyebrow>
      <T x={78} y={74} size={24} fill={C.gold} weight={500} letter={0}>
        5%
      </T>
      <T x={78} y={94} size={7.5} fill={C.dim} letter={1}>
        BY OBLIGATION
      </T>
      <TableGlyph x={61} y={112} w={34} fill={C.gold} />
      <T x={78} y={152} size={8} fill={C.muted}>
        sovereign
      </T>
      <T x={78} y={166} size={8} fill={C.muted}>
        data
      </T>

      {/* ── The governed boundary ──────────────────────────── */}
      <Line x1={156} y1={38} x2={156} y2={200} stroke={C.copper} dashed />
      <Box x={144} y={102} w={24} h={34} stroke={C.copper} fill={C.copperWash} radius={3} />
      <g className="anim-pulse">
        <rect x={150} y={112} width={12} height={14} rx={1.5} fill={C.copper} />
      </g>

      {/* ── Compute crossing, both ways ────────────────────── */}
      {PACKETS.map(i => (
        <circle
          key={`out-${i}`}
          cx={170}
          cy={66 + i * 13}
          r={3}
          fill={C.sage}
          className="anim-travel"
          data-static="hide"
          style={{ '--dist': '258px', '--d': `${i * 0.5}s` }}
        />
      ))}
      {PACKETS.slice(0, 2).map(i => (
        <circle
          key={`in-${i}`}
          cx={430}
          cy={150 + i * 13}
          r={3}
          fill={C.teal}
          className="anim-travel-back"
          data-static="hide"
          style={{ '--dist': '258px', '--d': `${0.8 + i * 0.6}s` }}
        />
      ))}

      {/* ── Cloud: the bulk of the estate ──────────────────── */}
      <Eyebrow x={320} y={28} fill={C.sage}>
        CLOUD
      </Eyebrow>
      <T x={318} y={56} size={7.5} fill={C.sage} letter={1}>
        COMPUTE AND DATA MOVE EITHER WAY
      </T>
      <T x={318} y={96} size={34} fill={C.sage} weight={500} letter={0}>
        95%
      </T>
      <T x={318} y={120} size={7.5} fill={C.dim} letter={1}>
        ELASTIC COMPUTE
      </T>
      <TableGlyph x={214} y={146} w={44} fill={C.sage} />
      <TableGlyph x={294} y={146} w={44} fill={C.sage} />
      <TableGlyph x={374} y={146} w={44} fill={C.sage} />
      <T x={318} y={180} size={8} fill={C.muted}>
        open table formats
      </T>

      {/* ── Orchestration: the same shape, open tooling ────── */}
      <T x={24} y={210} size={7} fill={C.teal} anchor="start" letter={1.1}>
        ORCHESTRATION · THE CHAPTER 02 SHAPE, IN OPEN TOOLING
      </T>

      {/* It schedules work on both sides of the boundary. */}
      {[78, 318].map((x, i) => (
        <g key={x}>
          <Line x1={x} y1={216} x2={x} y2={202} stroke={C.teal} dashed />
          <path
            d={`M ${x - 4} 206 L ${x} 199 L ${x + 4} 206 Z`}
            fill={C.teal}
            className="anim-pulse"
            style={{ '--d': `${i * 0.7}s` }}
          />
        </g>
      ))}

      <Box x={24} y={216} w={432} h={40} stroke={C.teal} fill={C.surface} dashed radius={4} />
      <T x={38} y={231} size={8.5} fill={C.text} anchor="start">
        Apache Airflow
      </T>
      <T x={38} y={244} size={7} fill={C.dim} anchor="start">
        containerised
      </T>
      {SPARK_X.map((x, i) => (
        <g key={x} className="anim-flash" style={{ '--d': `${i * 0.6}s` }}>
          <Box x={x} y={226} w={76} h={20} stroke={C.sage} fill={C.sageWash} radius={10} />
          <circle cx={x + 12} cy={236} r={2.5} fill={C.sage} />
          <T x={x + 44} y={236} size={7} fill={C.text}>
            Spark job
          </T>
        </g>
      ))}
      <Line x1={150} y1={236} x2={200} y2={236} stroke={C.teal} className="anim-flow" />
      <Arrow x={202} y={236} fill={C.teal} size={3} />

      {/* ── The conclusion ─────────────────────────────────── */}
      <Line x1={24} y1={268} x2={456} y2={268} stroke={C.rule} />
      <T x={240} y={285} size={9} fill={C.text}>
        no single vendor holds the estate
      </T>
    </Diagram>
  )
}
