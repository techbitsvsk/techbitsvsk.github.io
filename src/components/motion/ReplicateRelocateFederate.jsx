/* Chapter 07 — where data sits.

   Residency decides first. Only then does the question become
   which of three moves applies: replicate a copy, relocate the
   data to where the compute is, or leave it in place and federate
   to it. Copying everything everywhere is the expensive default,
   not the architecture.

   Underneath the choice sit three principles: data near to
   compute, strong alignment to native integrations, and
   virtualisation through federation when data should not move. */

import { Diagram, Box, T, Eyebrow, Line, Arrow, TableGlyph, C } from './primitives'

const COL_X = [12, 168, 324]
const COL_W = 144

const MOVES = [
  {
    name: 'REPLICATE',
    colour: C.copper,
    when: ['a governed copy must exist', 'on both sides'],
    /* The table exists in both places. */
    left: 'data',
    right: 'copy',
  },
  {
    name: 'RELOCATE',
    colour: C.gold,
    when: ['the data should live where', 'the compute already is'],
    /* The table leaves the origin. */
    left: null,
    right: 'data',
  },
  {
    name: 'FEDERATE',
    colour: C.sage,
    when: ['the data must not move —', 'send the query to it'],
    /* The table stays; the query travels. */
    left: 'data',
    right: null,
  },
]

const PRINCIPLES = [
  'data near to compute',
  'native integrations first',
  'virtualise via federation',
]

export default function ReplicateRelocateFederate({ title }) {
  return (
    <Diagram title={title}>
      <Eyebrow x={12} y={16} anchor="start">
        WHERE DATA SITS
      </Eyebrow>
      <T x={468} y={16} size={7} fill={C.gold} anchor="end" letter={1}>
        RESIDENCY DECIDES FIRST
      </T>

      {MOVES.map((move, i) => {
        const x = COL_X[i]
        const leftBox = x + 8
        const rightBox = x + 78
        return (
          <g key={move.name}>
            {/* The move */}
            <Box x={x} y={30} w={COL_W} h={24} stroke={move.colour} fill="#141210" radius={3} />
            <T x={x + COL_W / 2} y={42} size={8} fill={move.colour} weight={500} letter={1.2}>
              {move.name}
            </T>

            {/* Two locations, and what ends up in each. */}
            <Box
              x={leftBox}
              y={70}
              w={58}
              h={46}
              stroke={C.rule}
              fill={C.surface}
              dashed={!move.left}
              radius={3}
            />
            <Box
              x={rightBox}
              y={70}
              w={58}
              h={46}
              stroke={C.rule}
              fill={C.surface}
              dashed={!move.right}
              radius={3}
            />
            <T x={leftBox + 29} y={62} size={6.2} fill={C.dim}>
              origin
            </T>
            <T x={rightBox + 29} y={62} size={6.2} fill={C.dim}>
              compute
            </T>

            {move.left && <TableGlyph x={leftBox + 12} y={82} w={34} fill={move.colour} />}
            {move.right && <TableGlyph x={rightBox + 12} y={82} w={34} fill={move.colour} />}
            {move.left && (
              <T x={leftBox + 29} y={108} size={6} fill={C.muted}>
                {move.left}
              </T>
            )}
            {move.right && (
              <T x={rightBox + 29} y={108} size={6} fill={C.muted}>
                {move.right}
              </T>
            )}

            {/* What actually crosses the boundary. */}
            {i === 2 ? (
              <>
                {/* Federation: the query travels, the data stays. */}
                <Line
                  x1={rightBox}
                  y1={86}
                  x2={leftBox + 58}
                  y2={86}
                  stroke={move.colour}
                  className="anim-flow"
                />
                <path
                  d={`M ${leftBox + 58} 83 L ${leftBox + 52} 86 L ${leftBox + 58} 89 Z`}
                  fill={move.colour}
                />
                <Line
                  x1={leftBox + 58}
                  y1={100}
                  x2={rightBox}
                  y2={100}
                  stroke={C.steel}
                  className="anim-flow"
                  style={{ '--d': '0.5s' }}
                />
                <Arrow x={rightBox} y={100} fill={C.steel} size={3} />
                <T x={x + COL_W / 2} y={128} size={6} fill={move.colour}>
                  query out · result back
                </T>
              </>
            ) : (
              <>
                <Line
                  x1={leftBox + 58}
                  y1={93}
                  x2={rightBox - 2}
                  y2={93}
                  stroke={move.colour}
                  className="anim-flow"
                  style={{ '--d': `${i * 0.4}s` }}
                />
                <Arrow x={rightBox - 2} y={93} fill={move.colour} size={3} />
                <T x={x + COL_W / 2} y={128} size={6} fill={move.colour}>
                  {i === 0 ? 'the copy crosses' : 'the data moves'}
                </T>
              </>
            )}

            {/* When it applies. */}
            {move.when.map((line, li) => (
              <T key={line} x={x + COL_W / 2} y={148 + li * 12} size={6.8} fill={C.muted}>
                {line}
              </T>
            ))}
          </g>
        )
      })}

      {/* ── What holds underneath whichever move is chosen ─── */}
      <Line x1={12} y1={180} x2={468} y2={180} stroke={C.rule} />
      <T x={12} y={196} size={7} fill={C.dim} anchor="start" letter={1.1}>
        FUNDAMENTAL PRINCIPLES
      </T>
      {PRINCIPLES.map((principle, i) => (
        <g key={principle} className="anim-rise" style={{ '--d': `${i * 0.35}s` }}>
          <Box x={COL_X[i]} y={208} w={COL_W} h={26} stroke={C.sage} fill={C.sageWash} radius={13} />
          <circle cx={COL_X[i] + 14} cy={221} r={3} fill={C.sage} />
          <T x={COL_X[i] + COL_W / 2 + 8} y={221} size={7} fill={C.text}>
            {principle}
          </T>
        </g>
      ))}

      {/* ── The point ──────────────────────────────────────── */}
      <Line x1={12} y1={254} x2={468} y2={254} stroke={C.rule} />
      <T x={240} y={272} size={8.5} fill={C.text}>
        copying everything everywhere is the expensive default, not the architecture
      </T>
      <T x={240} y={289} size={6.8} fill={C.dim} letter={0.9}>
        RESIDENCY DECIDES · THEN ONE OF THREE MOVES
      </T>
    </Diagram>
  )
}
