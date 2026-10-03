/* Chapter 07 — AWS and Azure on one Iceberg and Kafka foundation
   under a single governance model. The primary degrades, the
   secondary takes the load, and the run emits the supervisory
   audit artefact that makes the claim evidenceable. */

import { Diagram, Box, T, Eyebrow, Line, Arrow, TableGlyph, C } from './primitives'

export default function CrossCloudFailover({ title }) {
  return (
    <Diagram title={title}>
      {/* ── Incoming workload ──────────────────────────────── */}
      <T x={240} y={20} size={8} fill={C.dim} letter={1.1}>
        CRITICAL WORKLOAD
      </T>
      <Line x1={240} y1={28} x2={240} y2={42} stroke={C.rule} />

      {/* Healthy: traffic to the primary. */}
      <g className="anim-degrade" data-static="hide">
        <Line x1={238} y1={42} x2={140} y2={62} stroke={C.copper} width={1.6} />
        <Arrow x={140} y={62} fill={C.copper} />
      </g>
      {/* After failover: traffic to the secondary. */}
      <g className="anim-promote">
        <Line x1={242} y1={42} x2={340} y2={62} stroke={C.sage} width={1.6} />
        <Arrow x={340} y={62} fill={C.sage} />
      </g>

      {/* ── Primary ────────────────────────────────────────── */}
      <Eyebrow x={110} y={54} fill={C.copper}>
        AWS · PRIMARY
      </Eyebrow>
      <Box x={32} y={66} w={156} h={92} stroke={C.copper} fill={C.copperWash} />
      <g className="anim-degrade" data-static="hide">
        <T x={110} y={104} size={9} fill={C.text}>
          serving writes
        </T>
        <circle cx={110} cy={128} r={5} fill={C.sage} />
      </g>
      <g className="anim-promote">
        <T x={110} y={104} size={9} fill={C.danger}>
          control plane degraded
        </T>
        <circle cx={110} cy={128} r={5} fill={C.danger} className="anim-pulse" />
      </g>

      {/* ── Secondary ──────────────────────────────────────── */}
      <Eyebrow x={370} y={54} fill={C.sage}>
        AZURE · SECONDARY
      </Eyebrow>
      <Box x={292} y={66} w={156} h={92} stroke={C.sage} fill={C.sageWash} />
      <g className="anim-degrade" data-static="hide">
        <T x={370} y={104} size={9} fill={C.dim}>
          warm replica
        </T>
        <circle cx={370} cy={128} r={5} fill={C.gold} />
      </g>
      <g className="anim-promote">
        <T x={370} y={104} size={9} fill={C.text}>
          carrying the load
        </T>
        <circle cx={370} cy={128} r={5} fill={C.sage} />
      </g>

      {/* ── Replication between them ───────────────────────── */}
      <Line x1={188} y1={112} x2={292} y2={112} stroke={C.teal} className="anim-flow" />
      <T x={240} y={100} size={7} fill={C.teal} letter={1}>
        REPLICATED
      </T>
      <T x={240} y={126} size={7} fill={C.dim} letter={1}>
        PER RPO TIER
      </T>

      {/* ── Shared foundation ──────────────────────────────── */}
      <Box x={32} y={180} w={416} h={58} stroke={C.rule} fill={C.surface} dashed />
      <Eyebrow x={240} y={196} fill={C.teal}>
        ONE FOUNDATION, BOTH CLOUDS
      </Eyebrow>
      <TableGlyph x={76} y={210} w={40} fill={C.teal} />
      <T x={184} y={218} size={8.5} fill={C.muted}>
        Apache Iceberg
      </T>
      <T x={296} y={218} size={8.5} fill={C.muted}>
        Confluent Kafka
      </T>
      <TableGlyph x={380} y={210} w={40} fill={C.teal} />

      {/* ── The evidence ───────────────────────────────────── */}
      <g className="anim-artefact">
        <Box x={268} y={256} w={180} h={34} stroke={C.gold} fill="#14110a" radius={3} />
        <rect x={280} y={266} width={12} height={15} rx={1} fill={C.gold} opacity={0.8} />
        <T x={368} y={273} size={8} fill={C.gold}>
          supervisory audit artefact
        </T>
      </g>
      <T x={32} y={264} size={8} fill={C.dim} anchor="start" letter={1.1}>
        ONE GOVERNANCE AND
      </T>
      <T x={32} y={278} size={8} fill={C.dim} anchor="start" letter={1.1}>
        IDENTITY MODEL
      </T>
    </Diagram>
  )
}
