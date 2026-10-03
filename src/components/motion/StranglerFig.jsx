/* Chapter 02, figure 1 — the decomposition.

   The WebLogic risk monolith gives way to a shared Spring Boot
   framework with business logic packaged as a bundle of JARs.
   Each jar runs with the framework as its own standalone process.
   Report generation falls from 12h to under two.

   How those processes are driven is figure 2. */

import { Diagram, Box, T, Eyebrow, Line, Arrow, C } from './primitives'

const SLICES = [0, 1, 2, 3, 4, 5]

const JARS = [
  { label: 'exposure', col: 0, row: 0 },
  { label: 'limits', col: 1, row: 0 },
  { label: 'ratings', col: 2, row: 0 },
  { label: 'collateral', col: 0, row: 1 },
  { label: 'compute', col: 1, row: 1 },
  { label: 'reporting', col: 2, row: 1 },
]

const GRID_X = [156, 263, 370]
const GRID_W = 100

/* A JAR: a small archive with a lid line. */
function Jar({ x, y, fill = C.sage, w = 10 }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={12} rx={1.5} fill={fill} opacity={0.85} />
      <line x1={x} y1={y + 3.5} x2={x + w} y2={y + 3.5} stroke={C.surface} strokeWidth={1} />
    </g>
  )
}

export default function StranglerFig({ title }) {
  return (
    <Diagram title={title}>
      {/* ── Legacy ─────────────────────────────────────────── */}
      <Eyebrow x={66} y={28} fill={C.danger}>
        WEBLOGIC MONOLITH
      </Eyebrow>
      <rect
        x={12}
        y={38}
        width={112}
        height={186}
        rx={8}
        fill="none"
        stroke={C.sage}
        strokeWidth={1.2}
        opacity={0.55}
        className="anim-flow"
      />
      <Box x={20} y={46} w={96} h={170} stroke={C.rule} fill="#121010" />
      {SLICES.map(i => (
        <rect
          key={i}
          x={27}
          y={54 + i * 27}
          width={82}
          height={21}
          rx={2}
          fill={C.danger}
          opacity={0.55}
          className="anim-erode"
          data-static="dim"
          style={{ '--d': `${i * 0.45}s` }}
        />
      ))}
      <T x={66} y={234} size={8} fill={C.sage}>
        strangler fig
      </T>

      {/* ── Logic lifted out, component by component ───────── */}
      {[115, 157].map((y, i) => (
        <g key={y}>
          <Line
            x1={126}
            y1={y}
            x2={144}
            y2={y}
            stroke={C.copper}
            dashed
            className="anim-flow"
            style={{ '--d': `${i * 0.3}s` }}
          />
          <Arrow x={146} y={y} fill={C.copper} size={3.5} />
        </g>
      ))}

      {/* ── The framework stays at the top, shared by all ──── */}
      <Eyebrow x={313} y={28} fill={C.copper}>
        SHARED FRAMEWORK
      </Eyebrow>
      <Box x={156} y={40} w={314} h={30} stroke={C.copper} fill={C.copperWash} />
      <T x={313} y={55} size={9} fill={C.text}>
        Spring Boot framework
      </T>

      {/* ── Business logic, as a bundle of jars ────────────── */}
      <T x={156} y={88} size={7} fill={C.dim} anchor="start" letter={1.1}>
        BUNDLE OF JARS · BUSINESS LOGIC
      </T>
      <T x={470} y={88} size={7} fill={C.dim} anchor="end" letter={1.1}>
        CQRS READ / WRITE SPLIT
      </T>
      {JARS.map((j, i) => {
        const x = GRID_X[j.col]
        const y = 98 + j.row * 42
        return (
          <g key={j.label} className="anim-emerge" style={{ '--d': `${0.3 + i * 0.25}s` }}>
            <Box x={x} y={y} w={GRID_W} h={34} stroke={C.sage} fill={C.sageWash} radius={3} />
            <Jar x={x + 10} y={y + 11} />
            <T x={x + 60} y={y + 17} size={8} fill={C.text}>
              {j.label}
            </T>
          </g>
        )
      })}

      {/* ── How they are packaged to run ───────────────────── */}
      <Box x={156} y={190} w={314} h={34} stroke={C.steel} fill={C.surface} dashed radius={4} />
      <rect x={168} y={199} width={40} height={6} rx={1.5} fill={C.copper} opacity={0.85} />
      <Jar x={168} y={209} w={8} />
      <Jar x={181} y={209} w={8} />
      <Jar x={194} y={209} w={8} />
      <T x={345} y={207} size={8} fill={C.muted}>
        framework + jar = one standalone process
      </T>

      {/* ── The outcome ────────────────────────────────────── */}
      <Line x1={12} y1={248} x2={470} y2={248} stroke={C.rule} />
      <T x={12} y={270} size={8} fill={C.dim} anchor="start" letter={1.1}>
        RISK REPORT GENERATION
      </T>
      <g className="anim-swap-out" data-static="hide">
        <T x={470} y={270} size={14} fill={C.danger} anchor="end" weight={500}>
          12 hours
        </T>
      </g>
      <g className="anim-swap-in">
        <T x={470} y={270} size={14} fill={C.sage} anchor="end" weight={500}>
          under 2 hours
        </T>
      </g>
    </Diagram>
  )
}
