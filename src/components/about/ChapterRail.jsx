/* Sticky chapter rail with scrollspy. Hidden below lg, where the
   chapters simply run full width. */

import { Link } from 'react-router-dom'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import { cn } from '@/lib/utils'

export default function ChapterRail({ chapters }) {
  const ids = chapters.map(c => c.id)
  const active = useScrollSpy(ids)

  return (
    /* self-start matters: as a stretched grid item the nav would be
       as tall as the whole chapter column, leaving sticky nothing to
       move within. Shrinking it to its content makes it pin. */
    <nav aria-label="Chapters" className="sticky top-28 hidden self-start lg:block">
      <p className="m-0 mb-4 font-mono text-[0.6rem] tracking-[0.18em] text-parchment-dim uppercase">
        The story
      </p>
      <ol className="m-0 flex list-none flex-col gap-0 p-0">
        {chapters.map(c => {
          const isActive = c.id === active
          return (
            <li key={c.id}>
              {/* A Link, not an anchor: with HashRouter a bare
                  "#id" href would be read as a route change. */}
              <Link
                to={`/about#${c.id}`}
                aria-current={isActive ? 'true' : undefined}
                className={cn(
                  'flex gap-2.5 border-l py-2 pl-3 no-underline transition-colors',
                  isActive
                    ? 'border-copper text-parchment'
                    : 'border-rule-soft text-parchment-dim hover:border-rule hover:text-parchment-muted'
                )}
              >
                <span
                  className={cn(
                    'font-mono text-[0.58rem] leading-5 tracking-wider',
                    isActive ? 'text-copper' : 'text-parchment-dim'
                  )}
                >
                  {c.n}
                </span>
                <span className="font-prose text-[0.78rem] leading-5">{c.title}</span>
              </Link>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
