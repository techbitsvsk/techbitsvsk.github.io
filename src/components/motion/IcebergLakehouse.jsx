/* Chapter 04 — Kafka lands data once into a single Iceberg table;
   Glue, EMR and Athena all read the same snapshot, each read
   passing through Lake Formation. */

import { Diagram, Box, T, Eyebrow, Line, Arrow, C } from './primitives'

const STREAMS = [0, 1, 2]
const ENGINES = [
  { label: 'AWS Glue', y: 52 },
  { label: 'Amazon EMR', y: 118 },
  { label: 'Athena', y: 184 },
]
/* Top to bottom follows the medallion flow, so the diagram reads
   in the same direction as the data. */
const LAYERS = ['bronze', 'silver', 'gold']

export default function IcebergLakehouse({ title }) {
  return (
    <Diagram title={title}>
      {/* ── Ingest ─────────────────────────────────────────── */}
      <Eyebrow x={54} y={28} fill={C.teal} anchor="middle">
        INGEST
      </Eyebrow>
      {STREAMS.map(i => (
        <g key={i}>
          <Line
            x1={16}
            y1={104 + i * 22}
            x2={110}
            y2={104 + i * 22}
            stroke={C.teal}
            className="anim-flow"
            style={{ '--d': `${i * 0.25}s` }}
          />
          <Arrow x={112} y={104 + i * 22} fill={C.teal} />
        </g>
      ))}
      <T x={54} y={176} size={8} fill={C.muted}>
        Confluent
      </T>
      <T x={54} y={189} size={8} fill={C.muted}>
        Kafka
      </T>

      {/* ── One table ──────────────────────────────────────── */}
      <Eyebrow x={190} y={28} fill={C.sage}>
        APACHE ICEBERG
      </Eyebrow>
      <Box x={128} y={42} w={124} h={196} stroke={C.sage} fill={C.sageWash} />
      {LAYERS.map((layer, i) => (
        <g key={layer}>
          <rect
            x={140}
            y={66 + i * 52}
            width={100}
            height={38}
            rx={3}
            fill={C.sage}
            opacity={0.14}
          />
          <rect
            x={140}
            y={66 + i * 52}
            width={100}
            height={38}
            rx={3}
            fill="none"
            stroke={C.sage}
            strokeWidth={0.8}
            opacity={0.5}
          />
          <T x={190} y={85 + i * 52} size={8.5} fill={C.text}>
            {layer}
          </T>
        </g>
      ))}
      <T x={190} y={228} size={7.5} fill={C.dim} letter={1}>
        ONE SNAPSHOT
      </T>

      {/* ── Access control on every read ───────────────────── */}
      <Box x={286} y={42} w={22} h={196} stroke={C.copper} fill={C.copperWash} radius={3} />
      <text
        x={297}
        y={140}
        fontFamily="'JetBrains Mono', monospace"
        fontSize={7.5}
        letterSpacing={1.2}
        fill={C.copper}
        textAnchor="middle"
        transform="rotate(-90 297 140)"
      >
        LAKE FORMATION
      </text>

      {/* ── Engines, reading in turn ───────────────────────── */}
      <Eyebrow x={398} y={28} fill={C.steel}>
        ANY ENGINE
      </Eyebrow>
      {ENGINES.map((e, i) => (
        <g key={e.label}>
          <g className="anim-flash" style={{ '--d': `${i * 0.9}s` }}>
            <Line x1={252} y1={e.y + 22} x2={286} y2={e.y + 22} stroke={C.copper} width={1.4} />
            <Line x1={308} y1={e.y + 22} x2={344} y2={e.y + 22} stroke={C.copper} width={1.4} />
            <Arrow x={346} y={e.y + 22} fill={C.copper} />
          </g>
          <Box x={352} y={e.y} w={104} h={44} stroke={C.steel} fill={C.surface} />
          <T x={404} y={e.y + 22} size={8.5} fill={C.text}>
            {e.label}
          </T>
        </g>
      ))}

      {/* ── Erasure without breaking history ───────────────── */}
      <Line x1={16} y1={262} x2={456} y2={262} stroke={C.rule} />
      <T x={16} y={280} size={8} fill={C.dim} anchor="start" letter={1.1}>
        RIGHT TO ERASURE
      </T>
      <T x={456} y={280} size={8.5} fill={C.muted} anchor="end">
        crypto-shredding — history stays intact
      </T>
    </Diagram>
  )
}
