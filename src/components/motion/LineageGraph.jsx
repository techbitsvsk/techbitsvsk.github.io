/* Chapter 08 — column lineage as a graph: five hops from a
   reported figure back to its raw source, answered in
   milliseconds and askable in plain English. */

import { Diagram, Box, T, Eyebrow, Line, C } from './primitives'

/* The path that lights up, left to right. */
const PATH = [
  { id: 'raw', x: 40, y: 150, label: 'raw feed' },
  { id: 'ingest', x: 118, y: 150, label: 'bronze' },
  { id: 'silver', x: 196, y: 104, label: 'silver' },
  { id: 'gold', x: 274, y: 150, label: 'gold' },
  { id: 'mart', x: 352, y: 104, label: 'mart' },
  { id: 'report', x: 430, y: 150, label: 'report' },
]

/* Unrelated neighbours — the graph is bigger than the answer. */
const OFF_PATH = [
  { x: 118, y: 218, to: 1 },
  { x: 196, y: 48, to: 2 },
  { x: 274, y: 224, to: 3 },
  { x: 352, y: 216, to: 3 },
]

const edgeLen = (a, b) => Math.hypot(b.x - a.x, b.y - a.y)

export default function LineageGraph({ title }) {
  return (
    <Diagram title={title}>
      <Eyebrow x={16} y={22} anchor="start">
        COLUMN LINEAGE · FIVE HOPS
      </Eyebrow>

      {/* ── Everything that is not the answer ──────────────── */}
      {OFF_PATH.map((n, i) => {
        const anchor = PATH[n.to]
        return (
          <g key={`off-${i}`} opacity={0.3}>
            <Line x1={anchor.x} y1={anchor.y} x2={n.x} y2={n.y} stroke={C.rule} />
            <circle cx={n.x} cy={n.y} r={7} fill={C.surface} stroke={C.rule} />
          </g>
        )
      })}

      {/* ── The traced path ────────────────────────────────────
          The question is "where did this figure come from?", so
          the traversal runs backwards: it starts at the report and
          works out to the raw source. Each edge is drawn from its
          right-hand end, and hop 1 is the one nearest the report. */}
      {PATH.slice(0, -1).map((node, i) => {
        const next = PATH[i + 1]
        const len = Math.ceil(edgeLen(node, next))
        const hop = PATH.length - 1 - i
        return (
          <g key={`edge-${node.id}`}>
            <Line x1={node.x} y1={node.y} x2={next.x} y2={next.y} stroke={C.rule} />
            <line
              x1={next.x}
              y1={next.y}
              x2={node.x}
              y2={node.y}
              stroke={C.copper}
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeDasharray={len}
              className="anim-draw"
              style={{ '--len': len, '--d': `${(hop - 1) * 0.5}s` }}
            />
            <T
              x={(node.x + next.x) / 2}
              y={(node.y + next.y) / 2 - 10}
              size={7}
              fill={C.dim}
            >
              {`hop ${hop}`}
            </T>
          </g>
        )
      })}

      {/* ── Nodes ──────────────────────────────────────────── */}
      {PATH.map((node, i) => {
        const terminal = i === 0 || i === PATH.length - 1
        return (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r={terminal ? 13 : 10}
              fill={terminal ? C.copperWash : C.surface}
              stroke={terminal ? C.copper : C.rule}
              strokeWidth={terminal ? 1.4 : 1}
            />
            <circle
              cx={node.x}
              cy={node.y}
              r={terminal ? 13 : 10}
              fill="none"
              stroke={C.copper}
              strokeWidth={1.4}
              className="anim-flash"
              style={{ '--d': `${(PATH.length - 1 - i) * 0.5}s` }}
            />
            <T x={node.x} y={node.y + (node.y > 140 ? 28 : -24)} size={8} fill={C.muted}>
              {node.label}
            </T>
          </g>
        )
      })}

      {/* ── Asked in plain English ─────────────────────────── */}
      <Line x1={16} y1={252} x2={464} y2={252} stroke={C.rule} />
      <Box x={16} y={262} w={300} h={28} stroke={C.sage} fill={C.sageWash} radius={14} />
      <T x={34} y={276} size={8.5} fill={C.text} anchor="start">
        "where does this revenue figure come from?"
      </T>
      <T x={464} y={270} size={8} fill={C.sage} anchor="end" letter={1}>
        TEXT2CYPHER
      </T>
      <T x={464} y={284} size={8} fill={C.dim} anchor="end">
        answered in milliseconds
      </T>
    </Diagram>
  )
}
