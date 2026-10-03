/* Chapter 06 — a workspace specification merges in Git, a service
   principal applies it, and the governed workspace emerges with
   its controls already inherited. No human in the path. */

import { Diagram, Box, T, Eyebrow, Line, Arrow, C } from './primitives'

const STAGES = [
  { label: 'spec.yaml', sub: 'in Git', accent: C.steel },
  { label: 'CI/CD', sub: 'template', accent: C.steel },
  { label: 'service', sub: 'principal', accent: C.copper },
  { label: 'workspace', sub: 'governed', accent: C.sage },
]

const CONTROLS = ['bank-held keys', 'row + column', 'Purview policy', 'DLP on prompts']

const STAGE_W = 100
const STAGE_X = [20, 136, 252, 368]

export default function ZeroTrustProvisioning({ title }) {
  return (
    <Diagram title={title}>
      <Eyebrow x={20} y={24} anchor="start">
        PROVISIONING PATH
      </Eyebrow>

      {/* ── The pipeline ───────────────────────────────────── */}
      {STAGES.map((s, i) => (
        <g key={s.label}>
          <Box
            x={STAGE_X[i]}
            y={44}
            w={STAGE_W}
            h={52}
            stroke={s.accent}
            fill={i === 3 ? C.sageWash : C.surface}
          />
          <T x={STAGE_X[i] + STAGE_W / 2} y={62} size={9} fill={C.text}>
            {s.label}
          </T>
          <T x={STAGE_X[i] + STAGE_W / 2} y={78} size={7.5} fill={C.dim}>
            {s.sub}
          </T>
          {i < 3 && (
            <>
              <Line
                x1={STAGE_X[i] + STAGE_W}
                y1={70}
                x2={STAGE_X[i] + STAGE_W + 14}
                y2={70}
                stroke={C.rule}
              />
              <Arrow x={STAGE_X[i] + STAGE_W + 14} y={70} fill={C.dim} />
            </>
          )}
        </g>
      ))}

      {/* ── The spec itself, travelling the whole path ─────── */}
      <g
        className="anim-travel"
        data-static="hide"
        style={{ '--dist': '348px', '--d': '0.2s' }}
      >
        <rect x={66} y={104} width={8} height={8} rx={1.5} fill={C.copper} />
      </g>
      <T x={240} y={122} size={7.5} fill={C.copper} letter={1}>
        ONE DECLARED SPECIFICATION, APPLIED
      </T>

      {/* ── Controls inherited by default ──────────────────── */}
      <Line x1={20} y1={144} x2={468} y2={144} stroke={C.rule} />
      <Eyebrow x={20} y={160} anchor="start" fill={C.sage}>
        INHERITED BY EVERY TEAM, NOT REBUILT
      </Eyebrow>
      {CONTROLS.map((label, i) => (
        <g
          key={label}
          className="anim-rise"
          style={{ '--d': `${0.6 + i * 0.35}s` }}
        >
          <Box
            x={STAGE_X[i]}
            y={176}
            w={STAGE_W}
            h={40}
            stroke={C.sage}
            fill={C.sageWash}
            radius={3}
          />
          <circle cx={STAGE_X[i] + 14} cy={196} r={3} fill={C.sage} />
          <T x={STAGE_X[i] + 56} y={196} size={7.5} fill={C.text}>
            {label}
          </T>
        </g>
      ))}

      {/* ── The standing claim ─────────────────────────────── */}
      <Line x1={20} y1={242} x2={468} y2={242} stroke={C.rule} />
      <T x={20} y={262} size={9} fill={C.copper} anchor="start" weight={500}>
        no standing human access
      </T>
      <T x={20} y={278} size={8} fill={C.dim} anchor="start">
        service principal only · every threat mapped to a control
      </T>
      <T x={468} y={266} size={20} fill={C.sage} anchor="end" weight={500} letter={0}>
        16
      </T>
      <T x={468} y={282} size={7.5} fill={C.dim} anchor="end" letter={1}>
        DECISION RECORDS
      </T>
    </Diagram>
  )
}
