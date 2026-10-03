import Media from '@/components/Media'
import Reveal from '@/components/Reveal'
import EvidenceCard from './EvidenceCard'

function TechPills({ items }) {
  if (!items?.length) return null
  return (
    <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
      {items.map(t => (
        <li
          key={t}
          className="rounded-full border border-rule-soft bg-copper-soft px-2.5 py-1 font-mono text-[0.62rem] text-copper"
        >
          {t}
        </li>
      ))}
    </ul>
  )
}

function Metrics({ items }) {
  if (!items?.length) return null
  return (
    <dl className="m-0 grid grid-cols-2 gap-x-5 gap-y-4 border-y border-rule-soft py-5 sm:grid-cols-4">
      {items.map(m => (
        <div key={m.label}>
          <dt className="font-display text-xl leading-none text-copper">{m.value}</dt>
          <dd className="mt-1.5 m-0 font-mono text-[0.62rem] leading-relaxed text-parchment-dim">
            {m.label}
          </dd>
        </div>
      ))}
    </dl>
  )
}

export default function ChapterCard({ chapter }) {
  const {
    id,
    n,
    era,
    org,
    role,
    title,
    narrative,
    pullQuote,
    tracks,
    coda,
    metrics,
    tech,
    media,
    evidence,
  } = chapter

  return (
    <article
      id={id}
      /* Clears the sticky header when linked to directly. */
      className="scroll-mt-28 border-b border-rule-soft pb-14 last:border-b-0"
    >
      <Reveal>
        <header className="flex items-baseline gap-4">
          <span className="font-mono text-[0.68rem] font-bold tracking-[0.18em] text-copper">
            {n}
          </span>
          <div className="min-w-0">
            <p className="m-0 font-mono text-[0.64rem] tracking-[0.16em] text-parchment-dim uppercase">
              {era}
              {org && org !== era && <span className="text-copper"> · {org}</span>}
            </p>
            <h2 className="mt-2 mb-1 font-display text-[clamp(1.4rem,3vw,1.9rem)] leading-tight text-parchment">
              {title}
            </h2>
            {/* Not every chapter carries a role line. */}
            {role && (
              <p className="m-0 font-prose text-[0.85rem] text-parchment-muted italic">
                {role}
              </p>
            )}
          </div>
        </header>
      </Reveal>

      <div className="mt-7 pl-0 sm:pl-[calc(0.68rem+1rem)]">
        <Reveal delay={0.05}>
          {narrative.map((para, i) => (
            <p
              key={i}
              className="mt-0 mb-[1.15rem] font-prose text-[0.95rem] leading-[1.85] text-parchment-muted"
            >
              {para}
            </p>
          ))}
        </Reveal>

        {tracks?.length > 0 && (
          <Reveal delay={0.05}>
            <div className="mt-6 mb-7 flex flex-col gap-4">
              {tracks.map(t => (
                <div
                  key={t.name}
                  className="border-l-2 border-copper/50 pl-4"
                >
                  <p className="m-0 font-mono text-[0.72rem] tracking-[0.1em] text-copper uppercase">
                    {t.name}
                  </p>
                  <p className="mt-1.5 mb-0 font-prose text-[0.9rem] leading-[1.8] text-parchment-muted">
                    {t.body}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {coda && (
          <Reveal delay={0.05}>
            <p className="mt-0 mb-[1.15rem] font-prose text-[0.95rem] leading-[1.85] text-parchment-muted">
              {coda}
            </p>
          </Reveal>
        )}

        {pullQuote && (
          <Reveal delay={0.08}>
            <blockquote className="my-8 border-l-2 border-copper pl-5">
              <p className="m-0 font-display text-[clamp(1.05rem,2.2vw,1.3rem)] leading-snug text-parchment italic">
                {pullQuote}
              </p>
            </blockquote>
          </Reveal>
        )}

        {/* `media` takes one key or several. */}
        {media &&
          (Array.isArray(media) ? media : [media]).map(key => (
            <Reveal key={key} delay={0.08} className="my-8">
              <Media assetKey={key} />
            </Reveal>
          ))}

        {metrics?.length > 0 && (
          <Reveal delay={0.05} className="my-8">
            <Metrics items={metrics} />
          </Reveal>
        )}

        {tech?.length > 0 && (
          <Reveal delay={0.05} className="mt-6">
            <TechPills items={tech} />
          </Reveal>
        )}

        {evidence?.length > 0 && (
          <Reveal delay={0.05} className="mt-7">
            <p className="m-0 mb-3 font-mono text-[0.62rem] tracking-[0.16em] text-parchment-dim uppercase">
              The evidence
            </p>
            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {evidence.map(e => (
                <EvidenceCard key={`${e.type}-${e.slug}`} {...e} />
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </article>
  )
}
