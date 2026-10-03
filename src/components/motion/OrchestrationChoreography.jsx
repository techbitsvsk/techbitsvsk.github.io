/* Chapter 02, figure 2 — the two control planes, working as one.

   Choreography sits on top and is reactive: upstream feed events
   decide WHEN ingestion may start, with cross-check validation,
   dependencies between feeds, and a fall back to the prior feed
   when the holiday calendar says a source is not publishing.

   Orchestration sits underneath and is deterministic: a BPMN
   process decides the ORDER, dispatches each activity as a
   standalone job, and owns reruns, the holiday calendar, and
   what-if scenarios fanned out as multiple batches.

   They are not competing models. Events release work downward,
   finished jobs raise events back up, and the balance between them
   follows what the workload needs.

   BPMN notation: thin circle = start event, thick circle = end
   event, rounded rectangle = activity, three vertical bars =
   parallel multi-instance, double border = call activity invoking
   an independent process.

   The controls are not housekeeping. In a credit-risk context they
   are BCBS 239 obligations: P3 accuracy and reconciliation, P4
   completeness, P6 ad-hoc aggregation for stress scenarios. */

import { Diagram, Box, T, Eyebrow, Line, Arrow, C } from './primitives'

const FEEDS = ['market feed', 'positions', 'reference data']

/* What the event plane decides, and the principle behind it. */
const EVENT_RULES = [
  { label: 'upstream event to ingest', col: 0, row: 0 },
  { label: 'cross-check validation', col: 1, row: 0, tag: 'P3' },
  { label: 'dependencies between feeds', col: 0, row: 1 },
  { label: 'holiday calendar, prior feed', col: 1, row: 1, tag: 'P4' },
]

/* BPMN activities. Aggregation fans out once per scenario. */
const ACTIVITIES = [
  { label: 'ingest', multi: false },
  { label: 'aggregate', multi: true },
  { label: 'report', multi: false },
]

/* What the orchestrator owns. */
/* The BCBS 239 principle each one satisfies is stated once in the
   footer rather than repeated on every chip. */
const ORCHESTRATION = [
  { label: 'reruns' },
  { label: 'holiday calendar' },
  { label: 'what-if batches' },
]

const RULE_X = [128, 300]
const RULE_W = 170
const ACT_X = [186, 272, 358]
const CHIP_X = [156, 263, 370]

export default function OrchestrationChoreography({ title }) {
  return (
    <Diagram title={title}>
      {/* Choreography, on top: reacts to what arrives. */}
      <Eyebrow x={12} y={18} anchor="start" fill={C.teal}>
        CHOREOGRAPHY · EVENT-DRIVEN
      </Eyebrow>
      <T x={470} y={18} size={7} fill={C.dim} anchor="end" letter={1}>
        DECIDES WHEN
      </T>

      {FEEDS.map((feed, i) => (
        <g key={feed}>
          <Box x={12} y={32 + i * 26} w={96} h={21} stroke={C.teal} fill={C.surface} radius={3} />
          <T x={60} y={43 + i * 26} size={7} fill={C.text}>
            {feed}
          </T>
          <Line
            x1={108}
            y1={43 + i * 26}
            x2={116}
            y2={43 + i * 26}
            stroke={C.teal}
            className="anim-flow"
            style={{ '--d': `${i * 0.35}s` }}
          />
        </g>
      ))}

      {/* The event plane itself. */}
      <Line x1={118} y1={28} x2={118} y2={112} stroke={C.teal} dashed />

      {EVENT_RULES.map((rule, i) => (
        <g key={rule.label} className="anim-flash" style={{ '--d': `${i * 0.5}s` }}>
          <Box
            x={RULE_X[rule.col]}
            y={32 + rule.row * 30}
            w={RULE_W}
            h={24}
            stroke={C.teal}
            fill="#0c1316"
            radius={3}
          />
          <circle cx={RULE_X[rule.col] + 12} cy={44 + rule.row * 30} r={2.5} fill={C.teal} />
          <T
            x={RULE_X[rule.col] + 22}
            y={44 + rule.row * 30}
            size={7}
            fill={C.text}
            anchor="start"
          >
            {rule.label}
          </T>
          {rule.tag && (
            <T
              x={RULE_X[rule.col] + RULE_W - 8}
              y={44 + rule.row * 30}
              size={6}
              fill={C.gold}
              anchor="end"
            >
              {rule.tag}
            </T>
          )}
        </g>
      ))}

      <T x={240} y={104} size={7} fill={C.dim} letter={0.9}>
        loose coupling — services react as data lands
      </T>

      {/* The two planes working as one: events release work
          downward, finished jobs raise events back up. */}
      <Line x1={12} y1={118} x2={470} y2={118} stroke={C.rule} />
      {[150, 230, 310].map((x, i) => (
        <g key={`down-${x}`} className="anim-pulse" style={{ '--d': `${i * 0.4}s` }}>
          <Line x1={x} y1={120} x2={x} y2={130} stroke={C.gold} />
          <Arrow x={x} y={132} fill={C.gold} size={3} />
        </g>
      ))}
      {[190, 270, 350].map((x, i) => (
        <g key={`up-${x}`} className="anim-pulse" style={{ '--d': `${0.2 + i * 0.4}s` }}>
          <Line x1={x} y1={132} x2={x} y2={124} stroke={C.teal} />
          <path d={`M ${x - 3} 124 L ${x} 118 L ${x + 3} 124 Z`} fill={C.teal} />
        </g>
      ))}
      <T x={78} y={128} size={6.8} fill={C.gold}>
        release work
      </T>
      <T x={416} y={128} size={6.8} fill={C.teal}>
        completion events
      </T>
      <T x={240} y={142} size={7} fill={C.copper} letter={1.1}>
        ONE PIPELINE, TWO PLANES
      </T>

      {/* Orchestration, underneath: deterministic and auditable. */}
      <Eyebrow x={12} y={160} anchor="start" fill={C.gold}>
        ORCHESTRATION · BPMN
      </Eyebrow>
      <T x={470} y={160} size={7} fill={C.dim} anchor="end" letter={1}>
        DECIDES THE ORDER
      </T>

      {/* Start event: thin circle. */}
      <circle cx={168} cy={186} r={7} fill="none" stroke={C.gold} strokeWidth={1.2} />
      <Line x1={175} y1={186} x2={181} y2={186} stroke={C.gold} />
      <Arrow x={181} y={186} fill={C.gold} size={3} />

      {ACT_X.map((x, i) => (
        <g key={x}>
          <Box x={x} y={171} w={78} h={30} stroke={C.gold} fill="#14110a" radius={5} />
          <T x={x + 39} y={184} size={7.5} fill={C.text}>
            {ACTIVITIES[i].label}
          </T>
          {/* Parallel multi-instance: aggregation runs once per
              scenario when a what-if fans out into batches. */}
          {ACTIVITIES[i].multi &&
            [-4, 0, 4].map(dx => (
              <line
                key={dx}
                x1={x + 39 + dx}
                y1={192}
                x2={x + 39 + dx}
                y2={198}
                stroke={C.gold}
                strokeWidth={1.3}
              />
            ))}
          <Line x1={x + 78} y1={186} x2={x + 84} y2={186} stroke={C.gold} />
          <Arrow x={x + 84} y={186} fill={C.gold} size={3} />
          {/* Call activity: a double border marks an invoked,
              independently deployed process. */}
          <Line x1={x + 39} y1={201} x2={x + 39} y2={207} stroke={C.steel} dashed />
          <g className="anim-rise" style={{ '--d': `${0.6 + i * 0.3}s` }}>
            <Box x={x} y={207} w={78} h={22} stroke={C.steel} fill={C.surface} radius={3} />
            <rect
              x={x + 2}
              y={209}
              width={74}
              height={18}
              rx={2}
              fill="none"
              stroke={C.steel}
              strokeWidth={1}
            />
            <T x={x + 39} y={218} size={6.8} fill={C.muted}>
              standalone job
            </T>
          </g>
        </g>
      ))}

      {/* End event: thick circle. */}
      <circle cx={452} cy={186} r={7.5} fill="none" stroke={C.gold} strokeWidth={2.2} />

      {/* What the orchestrator is actually for. */}
      <T x={12} y={248} size={6.8} fill={C.dim} anchor="start" letter={0.9}>
        THE ORCHESTRATOR OWNS
      </T>
      {ORCHESTRATION.map((item, i) => (
        <g key={item.label} className="anim-flash" style={{ '--d': `${0.5 + i * 0.6}s` }}>
          <Box x={CHIP_X[i]} y={238} w={100} h={20} stroke={C.gold} fill="#14110a" radius={10} />
          <circle cx={CHIP_X[i] + 10} cy={248} r={2.5} fill={C.gold} />
          <T x={CHIP_X[i] + 56} y={248} size={7} fill={C.text}>
            {item.label}
          </T>
        </g>
      ))}

      {/* The lesson. */}
      <Line x1={12} y1={266} x2={470} y2={266} stroke={C.rule} />
      <T x={240} y={280} size={8.5} fill={C.text}>
        not competing models — combined, and the balance follows the need
      </T>
      <T x={240} y={293} size={6.2} fill={C.dim} letter={0.8}>
        P3 ACCURACY · P4 COMPLETENESS · P6 AD-HOC AGGREGATION — BCBS 239
      </T>
    </Diagram>
  )
}
