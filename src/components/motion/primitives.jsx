/* Shared building blocks for the built-in SVG diagrams.
   All six diagrams share one 480×300 canvas and this palette, so
   they read as a set rather than six separate illustrations. */

import { cn } from '@/lib/utils'

export const C = {
  copper: '#c87941',
  copperDeep: '#5a3a1f',
  copperWash: '#1c1008',
  sage: '#8aab7a',
  sageWash: '#0d1409',
  steel: '#6b8294',
  teal: '#5a9eb5',
  gold: '#c8a050',
  danger: '#b8847b',
  text: '#e8d5b0',
  muted: '#c8bfb0',
  dim: '#8a7a65',
  rule: '#2a2a2a',
  surface: '#141210',
}

export const MONO = "'JetBrains Mono', ui-monospace, monospace"

export function Diagram({ title, children, className }) {
  return (
    <svg
      viewBox="0 0 480 300"
      role="img"
      aria-label={title}
      preserveAspectRatio="xMidYMid meet"
      className={cn('h-full w-full', className)}
    >
      <title>{title}</title>
      {children}
    </svg>
  )
}

/** A labelled container box. */
export function Box({
  x,
  y,
  w,
  h,
  stroke = C.rule,
  fill = C.surface,
  dashed = false,
  radius = 4,
  className,
  style,
  ...rest
}) {
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={radius}
      fill={fill}
      stroke={stroke}
      strokeWidth={1}
      strokeDasharray={dashed ? '3 3' : undefined}
      className={className}
      style={style}
      {...rest}
    />
  )
}

/** Monospaced label. `anchor` follows SVG text-anchor. */
export function T({
  x,
  y,
  children,
  size = 9,
  fill = C.muted,
  anchor = 'middle',
  weight = 400,
  letter = 0.4,
  className,
  style,
  ...rest
}) {
  return (
    <text
      x={x}
      y={y}
      fontFamily={MONO}
      fontSize={size}
      fontWeight={weight}
      letterSpacing={letter}
      fill={fill}
      textAnchor={anchor}
      dominantBaseline="middle"
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </text>
  )
}

/** Section eyebrow — small, uppercase, copper. */
export function Eyebrow({ x, y, children, fill = C.copper, anchor = 'middle' }) {
  return (
    <T x={x} y={y} size={7.5} fill={fill} anchor={anchor} weight={500} letter={1.3}>
      {children}
    </T>
  )
}

/** Straight connector. */
export function Line({
  x1,
  y1,
  x2,
  y2,
  stroke = C.rule,
  width = 1,
  dashed = false,
  className,
  style,
  ...rest
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={stroke}
      strokeWidth={width}
      strokeDasharray={dashed ? '3 4' : undefined}
      strokeLinecap="round"
      className={className}
      style={style}
      {...rest}
    />
  )
}

/** Small arrowhead pointing right. */
export function Arrow({ x, y, fill = C.dim, size = 4, className, style }) {
  return (
    <path
      d={`M ${x} ${y - size} L ${x + size * 1.4} ${y} L ${x} ${y + size} Z`}
      fill={fill}
      className={className}
      style={style}
    />
  )
}

/** Stacked-layer glyph — the shorthand for an Iceberg table. */
export function TableGlyph({ x, y, w = 34, fill = C.sage, className, style }) {
  return (
    <g className={className} style={style}>
      {[0, 1, 2].map(i => (
        <rect
          key={i}
          x={x}
          y={y + i * 6}
          width={w}
          height={4}
          rx={1}
          fill={fill}
          opacity={0.75 - i * 0.18}
        />
      ))}
    </g>
  )
}
