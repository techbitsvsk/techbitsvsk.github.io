/* ⌘K palette — jump to any chapter, essay, or repository.

   It reads the content modules, so it stays correct as content is
   added without anyone remembering to register it here. */

import { useNavigate } from 'react-router-dom'
import { Command } from 'cmdk'
import { essays } from '@/content/essays'
import { publicProjects } from '@/content/repos'
import { chapters } from '@/content/bio'

/**
 * cmdk's default scorer is fuzzy enough that "zzzz" matched three
 * chapters. Every whitespace-separated term has to appear instead,
 * which also makes "iceberg catalog" narrow rather than widen.
 */
function filterItems(value, search) {
  const haystack = value.toLowerCase()
  const terms = search.toLowerCase().split(/\s+/).filter(Boolean)
  return terms.every(term => haystack.includes(term)) ? 1 : 0
}

export default function CommandPalette({ open, onOpenChange }) {
  const navigate = useNavigate()

  /* The ⌘K hotkey lives in Header, because this component is
     loaded on demand and cannot listen while unmounted. */

  const go = to => {
    onOpenChange(false)
    navigate(to)
  }

  const openExternal = url => {
    onOpenChange(false)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      label="Search the site"
      filter={filterItems}
      className="dlg-content fixed top-[18%] left-1/2 z-[160] w-[calc(100vw-2rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-panel border border-rule bg-surface shadow-far"
      overlayClassName="dlg-overlay fixed inset-0 z-[159] bg-obsidian/85 backdrop-blur-sm"
    >
      <Command.Input
        placeholder="Search chapters, essays, and repositories…"
        className="w-full border-b border-rule bg-transparent px-4 py-3.5 font-prose text-sm text-parchment outline-none placeholder:text-parchment-dim"
      />
      <Command.List className="max-h-[52vh] overflow-auto p-2">
        <Command.Empty className="px-3 py-6 text-center font-mono text-xs text-parchment-dim">
          Nothing matches that.
        </Command.Empty>

        <Group heading="The story">
          {chapters.map(c => (
            <Item
              key={c.id}
              onSelect={() => go(`/about#${c.id}`)}
              meta={c.era}
              /* Searchable on the employer and the technologies too,
                 not just the chapter title. */
              keywords={[c.title, c.org, c.role, ...(c.tech ?? [])].join(' ')}
            >
              {c.n} · {c.title}
            </Item>
          ))}
        </Group>

        <Group heading="Essays">
          {essays.map(e => (
            <Item
              key={e.slug}
              onSelect={() => go(e.path)}
              meta={e.cat}
              /* Series name included, so "voronoi" finds all three
                 parts and not only the one with it in the title. */
              keywords={[
                e.title,
                e.subtitle,
                e.cat,
                e.series && `${e.series.name} part ${e.series.part}`,
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {e.title}
            </Item>
          ))}
        </Group>

        <Group heading="Open source">
          {publicProjects.map(p => (
            <Item
              key={p.slug}
              onSelect={() => openExternal(p.url)}
              meta={p.lang}
              keywords={[p.title, p.repo, p.cat, ...(p.stack ?? [])].join(' ')}
            >
              {p.title} ↗
            </Item>
          ))}
        </Group>

        <Group heading="Pages">
          <Item onSelect={() => go('/')} keywords="Home landing">
            Home
          </Item>
          <Item onSelect={() => go('/about')} keywords="About bio career story">
            About
          </Item>
          <Item onSelect={() => go('/writing')} keywords="Writing essays articles">
            Writing
          </Item>
          <Item onSelect={() => go('/projects')} keywords="Projects open source repositories">
            Projects
          </Item>
        </Group>
      </Command.List>
    </Command.Dialog>
  )
}

function Group({ heading, children }) {
  return (
    <Command.Group
      heading={heading}
      className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[0.6rem] [&_[cmdk-group-heading]]:tracking-[0.16em] [&_[cmdk-group-heading]]:text-parchment-dim [&_[cmdk-group-heading]]:uppercase"
    >
      {children}
    </Command.Group>
  )
}

function Item({ children, onSelect, meta, keywords }) {
  return (
    <Command.Item
      onSelect={onSelect}
      /* cmdk filters on `value`; without this it only ever sees the
         rendered label. */
      value={keywords}
      className="flex cursor-pointer items-center justify-between gap-3 rounded-card px-3 py-2.5 font-prose text-[0.85rem] text-parchment-muted data-[selected=true]:bg-copper-soft data-[selected=true]:text-parchment"
    >
      <span className="min-w-0 truncate">{children}</span>
      {meta && (
        <span className="shrink-0 font-mono text-[0.6rem] text-parchment-dim">{meta}</span>
      )}
    </Command.Item>
  )
}
